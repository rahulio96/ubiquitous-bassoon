from fastapi import APIRouter, Depends, Request, HTTPException
from backend.api.verify_token import verify_token
import tempfile
import os
import docker
import time
from backend.models.code import CodeExecutionResponse
from backend.models.user import User

router = APIRouter()

MAX_CODE_SIZE = 10 * 1024  # 10 KB
TIMEOUT = 10  # seconds

# Run code endpoint
@router.post("/execute_code")
async def execute_code(request: Request, user: User=Depends(verify_token)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    data = await request.json()
    code = data.get("code")

    # default to python
    language = data.get("language", "python")

    if not code:
        raise HTTPException(status_code=400, detail="Cannot execute empty code.")

    if len(code.encode("utf-8")) > MAX_CODE_SIZE:
        raise HTTPException(status_code=400, detail="Code size exceeds the maximum limit.")
    
    # NOTE: Update this if other language support is added
    if language != "python":
        raise HTTPException(status_code=400, detail="Unsupported language.")
    
    # create a temporary folder/file to hold the code
    with tempfile.TemporaryDirectory() as tempdir:
        code_file_path = os.path.join(tempdir, "main.py")

        # write code to temp file
        with open(code_file_path, "w") as code_file:
            code_file.write(code)

        client = docker.from_env()
        container_name = "python_container"

        output = None
        is_error = False

        # remove the container just in case it exists
        try:
            if client.containers.get(container_name):
                client.containers.get(container_name).remove(force=True)
        except docker.errors.NotFound:
            pass

        try:
            container = client.containers.run(
                name=container_name,
                image="python:3.10-slim",
                command=f"python /code/main.py",
                volumes={tempdir: {'bind': '/code', 'mode': 'ro'}},
                network_disabled=True,
                mem_limit="128m",
                stderr=True,
                stdout=True,
                remove=False,
                detach=True,
            )

            start_time = time.time()

            while time.time() - start_time <= TIMEOUT:
                container.reload()

                if container.status == "exited":
                    container_result = container.logs(stdout=True, stderr=True)
                    output = container_result.decode("utf-8")
                    break
                time.sleep(0.1)
            else:
                container.kill()
                container.remove(force=True)
                output="Time limit exceeded."
                is_error = True

        except docker.errors.ContainerError as e:
            output = e.stderr.decode("utf-8")
            is_error = True

        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
        
        if output is None:
            raise HTTPException(status_code=500, detail="No output from code execution.")
        
        if output.strip() == "":
            output = "(No output)"
        
        return CodeExecutionResponse(output=output, is_error=is_error)


