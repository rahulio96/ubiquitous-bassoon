from fastapi import APIRouter, Depends, HTTPException, Request
from backend.api.verify_token import verify_token
from backend.core.supabase import supabase
from backend.models.session import UpdateSessionRequest
from backend.models.user import User

router = APIRouter()

# Create a chat session
@router.put("/create")
async def create_chat_session(request: Request, user: User = Depends(verify_token)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    data = await request.json()
    question_id = data.get("question_id")

    session = None

    try:
        session = supabase.table("sessions").insert({
            "user_id": user.id,
            "question_id": question_id,
            "phase": "introduction",
        }).execute()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating session: {str(e)}")
    
    if not session.data or (session.data and not session.data[0]["id"]):
        raise HTTPException(status_code=500, detail="Failed to retrieve session from database")
    
    return { "id": session.data[0]["id"] }

# Update a chat session
@router.post("/update/{session_id}")
async def update_chat_session(
    session_id: str, 
    request: UpdateSessionRequest,
    user: User = Depends(verify_token)):

    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        supabase.table("sessions").update({
            "summary": request.summary,
            "phase": request.phase,
            "evaluation": request.evaluation
        }).eq("id", session_id).execute()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating session: {str(e)}")
