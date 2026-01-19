import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
CROSS_ORIGINS = os.getenv("CROSS_ORIGINS").split(",")