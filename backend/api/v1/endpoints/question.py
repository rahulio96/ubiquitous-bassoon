from fastapi import APIRouter, HTTPException
from backend.models.question import UserQuestion
from backend.core.supabase import supabase
import random

router = APIRouter()
MAX_LINE_LENGTH = 90

# Get a random question by difficulty
@router.get("/random/{difficulty}", response_model=UserQuestion)
async def get_random_question(difficulty: str):
    difficulty = difficulty[0].upper() + difficulty[1:].lower()
    
    try:
        # Fetch all question IDs
        result = supabase.table("questions").select("id").eq("difficulty", difficulty).execute()
        if result.data:
            random_id = random.choice([q["id"] for q in result.data])
            # Fetch the question by ID
            question_result = supabase.table("questions").select("*").eq("id", random_id).single().execute()
            question_data = question_result.data
            
            description = question_data["problem_description"].split('\n')

            print(question_data['problem_description'])
            new_description = []

            for line in description:
                if len(line) >= MAX_LINE_LENGTH - 2:
                    words = line.split(' ')
                    temp_line = []

                    # For "# "
                    current_length = 2

                    for word in words:
                        if current_length + len(word) >= MAX_LINE_LENGTH:
                            new_description.append(f"# {' '.join(temp_line)}")
                            temp_line = [word]
                            current_length = 2 + len(word)
                        else:
                            temp_line.append(word)
                            current_length += len(word)
                    if temp_line:
                        new_description.append(f"# {' '.join(temp_line)}")
                else:
                    new_description.append(f"# {line}")
                    
            commented_description = '\n'.join(new_description)

            starter_code = commented_description + "\n" + question_data["starter_code"]

            question = UserQuestion(
                id=question_data["id"],
                description=question_data["problem_description"],
                starter_code=starter_code
            )
            return question
        else:
            raise HTTPException(status_code=404, detail="No questions found in the database.")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error fetching question: {str(e)}")
    
# Run test cases by id, return 
@router.get("/{question_id}/testcases")
async def get_test_cases(question_id: str):
    try:
        result = supabase.table("questions").select("input_output", "entry_point").eq("id", question_id).execute()
        if result.data:
            question_data = result.data[0]
            return {
                "entry_point": question_data["entry_point"],
                "test_cases": question_data["input_output"]
            }
        
        else:
            raise HTTPException(status_code=404, detail=f"No question found with id: {question_id}.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching test cases: {str(e)}")