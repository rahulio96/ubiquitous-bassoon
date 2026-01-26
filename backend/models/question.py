from pydantic import BaseModel

class UserQuestion(BaseModel):
    id: int
    description: str
    starter_code: str

class QuestionTestCase(BaseModel):
    input: str
    expected_output: str

class TestQuestionSolution(BaseModel):
    entry_point: str
    test_cases: list[QuestionTestCase]