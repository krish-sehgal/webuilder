import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Zap } from 'lucide-react';
import ProfileDropdown from '../components/ProfileDropdown';
import toast, { Toaster } from 'react-hot-toast';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const eNotify = (msg: string) => toast.error(msg)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    } else {
      eNotify(`Prompt can't be empty`)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">

      {/* Profile dropdown — fixed to viewport top-right */}
      <div className="fixed top-5 right-5 z-50">
        <ProfileDropdown />
      </div>

      <div className="w-full max-w-xl">

        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-13 h-13 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-5">
            <Wand2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-3">
            Website Builder AI
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
            Describe your dream website and we'll help you build it, step by step.
          </p>
        </div>

        {/* Prompt card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to build... e.g. 'A portfolio for a photographer with a dark theme and gallery grid'"
              className="w-full h-32 p-3.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 resize-none transition leading-relaxed"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition"
            >
              <Zap className="w-4 h-4" />
              Generate website plan
            </button>
          </form>
        </div>

        {/* Example prompt chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {["Portfolio site", "SaaS landing page", "E-commerce store", "Blog"].map((example) => (
            <button
              key={example}
              onClick={() => setPrompt(`Build me a ${example.toLowerCase()}`)}
              className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition bg-white dark:bg-gray-900"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
}