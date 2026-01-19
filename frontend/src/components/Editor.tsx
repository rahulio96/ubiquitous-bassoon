import { Link } from "react-router-dom";
import AuthChecker from "./AuthChecker";
import Editor from '@monaco-editor/react';
import { useState } from "react";

function EditorPage() {

    const [codeValue, setCodeValue] = useState("# type here");

    const handleEditorChange = (value: string | undefined) => {
        setCodeValue(value || "");
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
                <Link to="/" className='text-blue-500 underline'>Go back to Home</Link>
            </div>
        </AuthChecker>
    );
}

export default EditorPage;