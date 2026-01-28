import ast
import json
from fastapi import APIRouter, HTTPException
from backend.models.question import UserQuestion
from backend.core.supabase import supabase
import random

router = APIRouter()
MAX_LINE_LENGTH = 90

# Get a random question by difficulty
@router.get("/random/{difficulty}", response_model=UserQuestion)
async def get_random_question(difficulty: str):    
    try:
        # Fetch all question IDs
        result = supabase.table("questions").select("id").eq("difficulty", difficulty).execute()
        if result.data:
            # Pick a random question ID
            random_id = random.choice([q["id"] for q in result.data])
            # Fetch the question by ID
            question_result = supabase.table("questions").select("*").eq("id", random_id).single().execute()
            question_data = question_result.data

            description = question_data["problem_description"].split('\n')
            new_description = []

            # Need to comment out the description so it can be pasted to the editor
            # Also limit line length to MAX_LINE_LENGTH
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

            if "ListNode" in question_data["input_types"] or "ListNode" in question_data["output_type"]:
                new_description.append("\n# Use list_to_linked_list(values: list[int]) -> ListNode to convert list to linked list")
                new_description.append("# Use linked_list_to_list(head: ListNode) -> list[int] to convert linked list to list\n")

            if "TreeNode" in question_data["input_types"] or "TreeNode" in question_data["output_type"]:
                new_description.append("\n# Use list_to_tree(values: list[int]) -> TreeNode to convert list to binary tree")
                new_description.append("# Use tree_to_list(root: TreeNode) -> list[int] to convert binary tree to list\n")
                    
            commented_description = '\n'.join(new_description)

            # Need to process starter code, uncomment custom classes, e.g. ListNode
            has_custom_class = False
            starter_code = question_data["starter_code"]

            starter_code_lines = starter_code.split('\n')
            for i in range(len(starter_code_lines)):
                line = starter_code_lines[i]
                if line.startswith("# class") and line.endswith(":"):
                    has_custom_class = True
                
                if has_custom_class and line.startswith("# "):
                    line = line[2:]
                    starter_code_lines[i] = line
            
            starter_code = '\n'.join(starter_code_lines)

            # Add description to the starter code, send to frontend editor
            starter_code = commented_description + "\n" + starter_code

            question = UserQuestion(
                id=question_data["id"],
                description=question_data["problem_description"],
                starter_code=starter_code
            )
            return question
        else:
            raise HTTPException(status_code=404, detail="No questions found in the database.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching question: {str(e)}")
    
def parse_input(input_str: str) -> list[str]:
    input_list = []
    bracket_count = 0
    start = 0

    for i in range(len(input_str)):
        if input_str[i] == '[':
            bracket_count += 1

        elif input_str[i] == ']':
            bracket_count -= 1

        elif input_str[i] == ',' and bracket_count == 0:
            input_list.append(input_str[start:i].strip())
            start = i + 1

    input_list.append(input_str[start:].strip())
    return input_list

    
# Run test cases by id, return 
@router.post("/testcases/{question_id}")
async def get_test_case_code(question_id: str):
    try:
        result = supabase.table("questions").select("input_output", "entry_point", "input_types", "output_type").eq("id", question_id).execute()
        if result.data:
            question_data = result.data[0]

            entry_point = question_data["entry_point"]
            test_cases = ast.literal_eval(question_data["input_output"])
            
            # Handle ListNode or TreeNode cases
            code = "count = 0\n"
            code += "solution = " + entry_point + "\n"
            num_test_cases = len(test_cases)

            for test_case in test_cases:

                inputs = parse_input(test_case["input"])
                input_types = question_data["input_types"]

                for i in range(len(inputs)):
                    input_type = input_types[i].strip()
                    input_split = inputs[i].split('=', 1)

                    variable_name = input_split[0].strip()
                    variable_value = input_split[1].strip()

                    if "ListNode" in input_type:
                        inputs[i] = f"{variable_name} = list_to_linked_list({variable_value.strip()})"
                    elif "TreeNode" in input_type:
                        inputs[i] = f"{variable_name} = list_to_tree({variable_value.strip()})"
                    else:
                        inputs[i] = f"{variable_name} = {variable_value.strip()}"

                test_case["input"] = ', '.join(inputs)

                if "ListNode" in question_data["output_type"].strip():
                    code += "if linked_list_to_list(solution(" + test_case["input"] + ")) == " + test_case["output"].strip() + ":\n"

                elif "TreeNode" in question_data["output_type"].strip():
                    code += "if tree_to_list(solution(" + test_case["input"] + ")) == " + test_case["output"].strip() + ":\n"

                else:
                    code += "if solution(" + test_case["input"] + ") == " + repr(test_case["output"]) + ":\n"

                code += "    count += 1\n"

            code += f'print(f"Passed {{count}} out of {num_test_cases} test cases.")\n'
            return {"code": code}
        
        else:
            raise HTTPException(status_code=404, detail=f"No question found with id: {question_id}.")
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error fetching test cases: {str(e)}")
    
# PROBLEMS FOR FUTURE ME:
# Need to handle cases where inputs are hidden, and aren't directly passed to the function
# There are also cases where order doesn't matter for either input or output
# Some test cases check for exceptions and errors raised

# Solution:
# Store test case validation code for each problem
# But this takes time, look into automating using local LLM?
# Or manually add question validation code for neetcode 150 or blind 75 as a starting point

# Will hold off on this for now, focus more on candidate communication, problem-solving skills, and general correctness