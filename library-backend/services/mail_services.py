import os
from flask import current_app
from flask_mail import Message
from models import User, db
from utils.utils import generate_reset_token, generate_email_verification_token
from extensions import mail
from datetime import datetime, timezone,timedelta
import jwt
from dotenv import load_dotenv 

load_dotenv()

def handle_forgot_password(email):
    user = User.query.filter_by(email=email).first()
    if not user:
        return {"message": "If this email exists, a reset link has been sent."}, 200

    token = generate_reset_token(email)
    BACKEND_URL = current_app.config.get("BACKEND_URL")
    reset_link = f'{BACKEND_URL}/reset-password?token={token}'

    msg = Message(
        subject="Reset Your Password",
        recipients=[email],
        body=f"Hello {user.name},\n\nClick the link below to reset your password:\n{reset_link}\n\nThis link will expire in 15 minutes."
    )

    mail.send(msg)
    user.reset_token = token
    user.reset_token_expiry = datetime.now(timezone.utc) + timedelta(minutes=15)
    db.session.commit()

    return {"message": "Password reset link sent successfully."}, 200

def resend_verification_email(email):
    user = User.query.filter_by(email=email).first()

    if not user:
        print("User not found")
        return {"error": "User not found"}, 404

    if user.is_verified:
        print("User is already verified")
        return {"message": "Your account is already verified"}, 200

    try:
        print("Generating verification token")
        token = generate_email_verification_token(email)
        print("Token generated successfully")
        print(os.getenv("BACKEND_URL"))
        print(os.getenv("BACKEND_URL"))
        if not token:
            print("Failed to generate verification token")
            return {"error": "Failed to generate verification token"}, 500
        print(f"Token: {token}")

        verification_link = f'{current_app.config["BACKEND_URL"]}/api/verify-email?token={token}'

        print(f"Verification link: {verification_link}")
        msg = Message(
            subject="Verify Your Email",
            recipients=[email],
            body=f"Hello {user.name},\n\nPlease verify your email using this link: {verification_link}\n\nThis link will expire in 15 minutes."
        )

        print(f"mail:{mail}")
        try:
            print("Sending verification email")
            mail.send(msg)
            print("Verification email sent successfully")
        except Exception as mail_error:
            print(f"Failed to send verification email: {str(mail_error)}")
            return {"error": "Failed to send verification email"}, 500
        print("Verification email resent successfully")
        return {"message": "Verification email resent successfully."}, 200


    except Exception as e:
        return {"error": str(e)}, 500

def verify_email_token(token):
    if not token:
        return None, "MissingToken"

    try:
        
        payload = jwt.decode(token, options={"verify_signature": False})
        email = payload.get('email')

        
        jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])

        user = User.query.filter_by(email=email).first()
        if not user or user.is_verified:
            return None, "InvalidOrExpiredToken"

        user.is_verified = True
        db.session.commit()

        return email, None  

    except jwt.ExpiredSignatureError:
        return email, "TokenExpired"
    except jwt.InvalidTokenError:
        return None, "InvalidToken"