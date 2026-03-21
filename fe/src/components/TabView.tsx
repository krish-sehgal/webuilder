import JSZip from "jszip";
import saveAs from "file-saver"
import { Code2, Download, Eye } from "lucide-react";
import type { FileItem } from "../types";

interface TabViewProps {
    activeTab: 'code' | 'preview';
    onTabChange: (tab: 'code' | 'preview') => void;
    files: FileItem[];
    loading: boolean;
}

export function TabView({ activeTab, onTabChange, files, loading }: TabViewProps) {
    const handleDownloadProject = async (files: FileItem[]) => {
        const zip = new JSZip();

        const processFile = (file: FileItem, currentPath: string = '') => {
            if (file.type === 'file') {
                const content = file.content || ''
                zip.file(currentPath + file.name, content)
            } else if (file.type === 'folder') {
                const filePath = currentPath + `${file.name}/`
                if (file.children) {
                    file.children.forEach((child) => {
                        processFile(child, filePath)
                    })
                }
            }
        }

        files.forEach((file) => processFile(file))

        try {
            const content = await zip.generateAsync({ type: 'blob' })
            saveAs(content, 'project.zip')
        } catch (error) {
            console.error('Failed to generate zip:', error);
        }
    }

    return (
        <div className="flex justify-between mb-4">
            <div className="flex space-x-2">
                <button
                    onClick={() => onTabChange('code')}
                    className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors border ${activeTab === 'code'
                        ? 'bg-gray-700 text-gray-100'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                        }`}
                    disabled={loading}
                >
                    <Code2 className="w-4 h-4" />
                    <span className={`${activeTab === 'code' ? 'block' : 'hidden'}`}>Code</span>
                </button>
                <button
                    onClick={() => onTabChange('preview')}
                    className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors border ${activeTab === 'preview'
                        ? 'bg-gray-700 text-gray-100'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                        }`}
                    disabled={loading}
                >
                    <Eye className="w-4 h-4" />
                    <span className={`${activeTab === 'preview' ? 'block' : 'hidden'}`}>Preview</span>
                </button>
            </div>
            <div>
                <button
                    className="flex items-center cursor-pointer text-gray-400 border px-2 py-1 rounded-md"
                    onClick={() => handleDownloadProject(files)}>
                    <Download className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}