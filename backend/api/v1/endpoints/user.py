from fastapi import APIRouter, Depends
from backend.api.verify_token import verify_token
from backend.models.user import User
from backend.core.supabase import supabase

router = APIRouter()

# Get current user's info
@router.get("/user")
async def get_user(user: User = Depends(verify_token)):
    
    db_user = supabase.table("users").select("*").eq("id", user.id).execute()

    if not db_user.data:
        try:
            supabase.table("users").insert({
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
            }).execute()
        except Exception as e:
            raise Exception(f"Error creating user: {str(e)}")

    else:
        try:
            user_data = db_user.data[0]
            user.email = user_data.get("email", user.email)
            user.full_name = user_data.get("full_name", user.full_name)
            user.first_name = ""

            if user.full_name:
                user.first_name = user.full_name.split()[0]
                
        except Exception as e:
            raise Exception(f"Error fetching user data: {str(e)}")

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "first_name": user.first_name
    }