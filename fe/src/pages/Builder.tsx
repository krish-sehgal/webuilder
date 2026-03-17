import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { type Step, type FileItem, StepType } from '../types';
import axios from 'axios';
import { parseXml } from '../steps';
// import { FileNode } from '@webcontainer/api';
import { Loader } from '../components/Loader.jsx';
import { ArrowUp, Code2 } from 'lucide-react';
import useWebContainer from '../hooks/useWebContainer';
import ProfileDropdown from '../components/ProfileDropdown';
import toast, { Toaster } from 'react-hot-toast';

export function Builder() {
    const location = useLocation();
    const webcontainer = useWebContainer();
    const navigate = useNavigate()
    const [userPrompt, setPrompt] = useState("");
    const [llmMessages, setLlmMessages] = useState<{ role: "user" | "assistant", content: string; }[]>([]);
    const [loading, setLoading] = useState(false);
    const [templateSet, setTemplateSet] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [steps, setSteps] = useState<Step[]>([]);
    const [files, setFiles] = useState<FileItem[]>([]);

    useEffect(() => {
        if (!location.state) {
            navigate('/')
            return
        }
    }, [])

    const { prompt } = (location.state || {}) as { prompt: string };

    useEffect(() => {
        let originalFiles = [...files];
        let updateHappened = false;
        steps.filter(({ status }) => status === "pending").forEach(step => {
            updateHappened = true;
            if (step?.type === StepType.CreateFile) {
                let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
                let currentFileStructure = [...originalFiles]; // {}
                let finalAnswerRef = currentFileStructure;

                let currentFolder = ""
                while (parsedPath.length) {
                    currentFolder = `${currentFolder}/${parsedPath[0]}`;
                    let currentFolderName = parsedPath[0];
                    parsedPath = parsedPath.slice(1);

                    if (!parsedPath.length) {
                        // final file
                        let file = currentFileStructure.find(x => x.path === currentFolder)
                        if (!file) {
                            currentFileStructure.push({
                                name: currentFolderName,
                                type: 'file',
                                path: currentFolder,
                                content: step.code
                            })
                        } else {
                            file.content = step.code;
                        }
                    } else {
                        /// in a folder
                        let folder = currentFileStructure.find(x => x.path === currentFolder)
                        if (!folder) {
                            // create the folder
                            currentFileStructure.push({
                                name: currentFolderName,
                                type: 'folder',
                                path: currentFolder,
                                children: []
                            })
                        }

                        currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
                    }
                }
                originalFiles = finalAnswerRef;
            }
        })

        if (updateHappened) {

            setFiles(originalFiles)
            setSteps(steps => steps.map((s: Step) => {
                return {
                    ...s,
                    status: "completed"
                }

            }))
        }
    }, [steps, files]);

    useEffect(() => {
        const createMountStructure = (files: FileItem[]): Record<string, any> => {
            const mountStructure: Record<string, any> = {};

            const proccessFile = (file: FileItem, isRootFolder: boolean) => {

                if (file.type === 'folder') {
                    mountStructure[file.name] = {
                        directory: file.children ? Object.fromEntries(file.children.map(child => [child.name, proccessFile(child, false)])) : {}
                    };
                } else if (file.type === 'file') {
                    if (isRootFolder) {
                        mountStructure[file.name] = {
                            file: {
                                contents: file.content || ''
                            }
                        };
                    }
                    else {
                        return {
                            file: {
                                contents: file.content || ''
                            }
                        };
                    }
                }
                return mountStructure[file.name];
            };

            files.forEach(file => proccessFile(file, true));
            return mountStructure;
        };
        const mountStructure = createMountStructure(files);
        webcontainer?.mount(mountStructure)
        console.log('structure mounted');
    }, [files, webcontainer]);

    async function init() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/p/template`, { prompt: prompt.trim() }, { withCredentials: true });
            if (!response.data.success) {
                toast.error(`Error: ${response.data.message}`)
                return;
            }
            setTemplateSet(true);

            const { prompts, uiPrompts } = response.data;

            setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
                ...x,
                status: "pending"
            })));

            setLoading(true);
            const stepsResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/p/chat`, {
                messages: [...prompts, prompt].map(content => ({
                    role: "user",
                    content
                }))
            }, { withCredentials: true })

            setLoading(false);

            setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                ...x,
                status: "pending" as "pending"
            }))]);

            setLlmMessages([...prompts, prompt].map(content => ({
                role: "user",
                content
            })));

            setLlmMessages(x => [...x, { role: "assistant", content: stepsResponse.data.response }]);
        } catch (error: any) {
            if (error.response.state === 429) {
                toast.error(error?.message)
                navigate('/')
            } else {
                toast.error(error?.message)
            }
        }
    }

    useEffect(() => {
        init();
    }, [])

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">

            {/* Header */}
            <header className="flex items-center justify-between px-5 h-12 shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                        <Code2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">WebuilderAI</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 max-w-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{prompt}</p>
                </div>
                <ProfileDropdown />
            </header>

            {/* Body */}
            <div className="flex-1 overflow-hidden grid grid-cols-[220px_180px_1fr]">

                {/* Steps panel */}
                <div className="flex flex-col overflow-hidden border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="px-3 py-2.5 shrink-0 border-b border-gray-200 dark:border-gray-800">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Steps</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <StepsList steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />
                    </div>
                    {!(loading || !templateSet) && (
                        <div className="p-2.5 shrink-0 border-t border-gray-200 dark:border-gray-800">
                            <div className="relative">
                                <textarea
                                    value={userPrompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe modifications..."
                                    className="w-full pl-3 pr-9 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none h-16 leading-relaxed transition"
                                />
                                <button
                                    onClick={async () => {
                                        const newMessage = { role: "user" as "user", content: userPrompt };
                                        setLoading(true);
                                        const stepsResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/p/chat`, { messages: [...llmMessages, newMessage] }, { withCredentials: true });
                                        setLoading(false);
                                        setLlmMessages(x => [...x, newMessage]);
                                        setLlmMessages(x => [...x, { role: "assistant", content: stepsResponse.data.response }]);
                                        setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                                            ...x, status: "pending" as "pending"
                                        }))]);
                                    }}
                                    className="absolute bottom-2 right-2 w-6 h-6 rounded-lg bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition cursor-pointer"
                                >
                                    {(loading || !templateSet) ? <Loader /> : <ArrowUp className="w-3 h-3 text-white" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* File explorer */}
                <div className="flex flex-col overflow-hidden border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="px-3 py-2.5 shrink-0 border-b border-gray-200 dark:border-gray-800">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Files</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        <FileExplorer files={files} onFileSelect={setSelectedFile} />
                    </div>
                </div>

                {/* Code / Preview */}
                <div className="flex flex-col overflow-hidden bg-white dark:bg-gray-900">
                    <div className="px-3 py-2 shrink-0 border-b border-gray-200 dark:border-gray-800">
                        <TabView activeTab={activeTab} onTabChange={setActiveTab} files={files} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {activeTab === 'preview' && webcontainer ? (
                            <PreviewFrame webContainer={webcontainer} />
                        ) : activeTab === 'preview' ? (
                            <div>Initializing...</div>
                        ) : (
                            <CodeEditor file={selectedFile} />
                        )}
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
}