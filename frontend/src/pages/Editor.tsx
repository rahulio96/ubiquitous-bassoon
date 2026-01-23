import AuthChecker from "../components/AuthChecker";
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
            <div className='flex gap-2 justify-center items-center min-h-screen px-10 pt-5'>
                <div className="flex justify-between w-full gap-5">

                    <div className="flex flex-col min-h-[75vh] min-w-[50vw] w-full">
                        <div className="py-3 px-5 bg-(--textbg) flex justify-between items-center font-bold">
                            Python Editor:

                            <button 
                                className="bg-(--secondary) px-3 py-1 rounded cursor-pointer font-normal"
                                onClick={() => {setCodeValue('')}}
                            >Reset</button>

                        </div>
                        <Editor
                            theme="vs-dark"
                            defaultLanguage="python"
                            value={codeValue}
                            onChange={handleEditorChange}
                        />
                    </div>

                    <div className="flex flex-col w-full pl-10 gap-10">
                        <button 
                            className='cursor-pointer bg-black px-5 py-3'
                            onClick={handleRunCode}
                            disabled={isLoading}>
                                {isLoading ? "Running..." : "Run Code"}
                        </button>

                        <div className="justify-start bg-(--secondary) p-4 font-bold">
                            Output:
                            <div className="flex-col h-[40vh] overflow-y-scroll whitespace-pre-wrap wrap-break-word font-normal">
                                <span className={`block ${(codeResponse && codeResponse.is_error) && "text-red-500"}`}>
                                    {codeResponse ? `${codeResponse.output}` : ""}
                                </span>
                            </div>
                        </div>
                        
                        <textarea
                            className="bg-(--textbg) h-full p-5 resize-none"
                            placeholder="Notes..."
                        />

                    </div>

                </div>
            </div>
        </AuthChecker>
    );
}

export default EditorPage;