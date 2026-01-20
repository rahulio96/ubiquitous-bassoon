## Run Frontend
```bash
cd ./frontend
npm install
npm run dev
```

## Run Backend
1. Install Docker
2. Initialize Python virtual environment first, then:
```bash
cd ./backend
pip install -r ./requirements.txt
source ./.venv/bin/activate
fastapi dev main.py
```