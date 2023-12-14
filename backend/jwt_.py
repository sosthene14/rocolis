import jwt
import secrets
import string


def generate_unique():
    characters = string.ascii_letters + string.digits
    unique_id = ''.join(secrets.choice(characters) for _ in range(100))
    return unique_id


def encode_(email):
    generated_id = generate_unique()
    token = jwt.encode({"email": email, "logged": True}, key=generated_id)
    return token
