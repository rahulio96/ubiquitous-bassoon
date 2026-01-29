from fastapi import APIRouter, Depends, HTTPException, Request
from backend.core.groq import groq_client
from backend.api.verify_token import verify_token
from backend.core.supabase import supabase
from backend.models.user import User

router = APIRouter()

@router.post("/send/{session_id}")
async def send_message(request: Request, session_id: str, user: User = Depends(verify_token)):

    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    data = await request.json()
    message = data.get("content")
    
    # insert user message
    try:
        supabase.table("messages").insert({
            "session_id": session_id,
            "role": "user",
            "content": message
        }).execute()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving message: {str(e)}")

    messages = None

    # fetch messages from db to give llm context
    try:
        messages = supabase.table("messages").select("*").eq("session_id", session_id).order("created_at").execute()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve messages: {str(e)}")
    
    history = []
    for msg in messages.data:
        history.append({
            "role": msg.get("role"),
            "content": msg.get("content")
        })

    # get the llm's response
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=history,
        temperature=0.7,
    )

    llm_message = response.choices[0].message.content

    # save llm message to db
    try:
        supabase.table("messages").insert({
            "session_id": session_id,
            "role": "assistant",
            "content": llm_message
        }).execute()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving message: {str(e)}")
    
    return {"response": llm_message}