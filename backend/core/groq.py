from backend.core.config import GROQ_API_KEY
from groq import Groq

groq_client = Groq(api_key=GROQ_API_KEY)
