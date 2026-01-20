import { Link } from "react-router-dom";
import AuthChecker from "./AuthChecker";
import Editor from '@monaco-editor/react';
import { useState } from "react";
import { API_URL } from "../config/env";
import { apiFetch } from "../api";
import type { ExecuteCodeResponse } from "../types/code";

function EditorPage() {
    const [codeValue, setCodeValue] = useState("# type here");
    const [codeResponse, setCodeResponse] = useState<ExecuteCodeResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleEditorChange = (value: string | undefined) => {
        setCodeValue(value || "");
    };

    const handleRunCode = async () => {
        if (!codeValue.trim()) {
            setCodeResponse({ output: "No code to execute", is_error: true });
            return;
        }

        try {
            setIsLoading(true);
            setCodeResponse(null);
            const response = await apiFetch(`${API_URL}/api/v1/protected/execute_code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: codeValue }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Code execution result:', data);
            setCodeResponse(data);
        }

        catch (error) {
            console.error('Error executing code:', error);
            setCodeResponse({ output: 'Error executing code', is_error: true });
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthChecker>
            <div className='flex flex-col gap-2 justify-center items-center min-h-screen'>
                Code Editor (Python)
                <Editor
                    height="80vh"
                    width="50vw"
                    theme="vs-dark"
                    defaultLanguage="python"
                    value={codeValue}
                    onChange={handleEditorChange}
                />

                <button 
                    className='cursor-pointer bg-black px-5 py-3 text-white'
                    onClick={handleRunCode}
                    disabled={isLoading}>
                        {isLoading ? "Running..." : "Run Code"}
                </button>

                <div>Output:
                    <span className={(codeResponse && codeResponse.is_error) 
                        ? "text-red-500" : "text-green-500"}>
                            {`${codeResponse ? codeResponse.output : ""}`}
                    </span>
                </div>
                <Link to="/" className='text-blue-500 underline'>Go back to Home</Link>
            </div>
        </AuthChecker>
    );
}

export default EditorPage;