import type { Request, Response } from "express";
import { BASE_PROMPT, getSystemPrompt } from '../prompts.js';
import { basePrompt as reactBasePrompt } from '../defaults/react.js';
import { basePrompt as nodeBasePrompt } from '../defaults/node.js';
import { groq } from "../config/groq.js";

export async function getTemplate(req: Request, res: Response) {
    const prompt = req.body.prompt;

    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
                {
                    role: "system",
                    content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
                },
            ],
            model: "openai/gpt-oss-20b",
            temperature: 0.5,
            max_completion_tokens: 200,
            top_p: 1,
            stop: null,
        });

        const answer = response.choices[0]?.message.content;

        if (answer != 'react' && answer != 'node') {
            return res.status(403).json({ message: 'neither react nor node' })
        }

        if (answer == 'react') {
            res.json({
                success: true,
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [reactBasePrompt]
            })
        }

        if (answer == 'node') {
            res.json({
                success: true,
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [nodeBasePrompt]
            })
        }
    } catch (error: any) {
        if (error?.status === 429 || error?.code === "rate_limit_exceeded") {
            res.json({
                success: false,
                message: 'Too many requests. Please wait a moment and try again.'
            })
        }
        res.json({
            success: false,
            message: 'something went wrong. Please try again'
        })
    }
}

export async function chat(req: Request, res: Response) {
    const messages = req.body.messages;
    messages.push({ role: 'system', content: getSystemPrompt() })
    try {
        const response = await groq.chat.completions.create({
            messages: messages,
            model: "openai/gpt-oss-20b",
            temperature: 0.5,
            max_completion_tokens: 8000,
            top_p: 1,
            stop: null,
        })
        // console.log(response.choices[0]?.message.content);
        res.json({
            response: response.choices[0]?.message.content
        })
    } catch (error) {
        res.json({
            success: false,
            message: 'free api rate limit reached, wait for 5 minutes'
        })
    }
}