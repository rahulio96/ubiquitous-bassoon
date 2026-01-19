from fastapi import Depends, HTTPException, requests, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import base64, json
import requests
from backend.core.config import SUPABASE_URL
from backend.models.user import User

JWK_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
jwks = requests.get(JWK_URL).json()["keys"]

def get_signing_key(kid):
    for key in jwks:
        if key["kid"] == kid:
            return key
    return None

# used for token verification
security = HTTPBearer()

async def verify_token(cred: HTTPAuthorizationCredentials = Depends(security)) -> User:
    token = cred.credentials
    header = json.loads(base64.urlsafe_b64decode(token.split('.')[0] + '=='))

    try:
        kid = header["kid"]
        key = get_signing_key(kid)
        if not key:
            raise HTTPException(status_code=401, detail="Invalid token: unknown kid")
        payload = jwt.decode(
            token,
            key,
            algorithms=["ES256"],
            audience="authenticated"
        )
        user_id = payload.get("sub")
        email = payload.get("email")
        name = payload.get("user_metadata", {}).get("full_name")
        first_name = name.split()[0] if name else ""

        if not user_id or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        return User(
            id=user_id,
            email=email,
            full_name=name,
            first_name=first_name
        )
    except JWTError as e:
        print('JWT Error:', str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )