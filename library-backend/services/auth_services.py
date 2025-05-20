from flask import request, make_response, jsonify, current_app
from routes.auth import auth_bp
from models import User, db
from flask_mail import Message
from extensions import bcrypt, mail
from utils.utils import generate_auth_token, generate_email_verification_token
import jwt
from datetime import datetime, timezone
from services.mail_services import resend_verification_email

def register_user(name, email, password, is_admin=False, send_verification=True):
    try:
        if not (name and email and password):
            return {"error": "All fields are required"}, 400

        user = User.query.filter_by(email=email).first()

        if user:
            if not user.is_verified:
                return {"error": "Please verify your email to activate your account."}, 403
            return {"error": "Email already exists"}, 409
        
    except Exception as e:
        return {"error": str(e)}, 500

    try:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = User(name=name, email=email, password=hashed_password, is_admin=is_admin)
        db.session.add(new_user)
        print("1`")
        db.session.commit()
        if send_verification:
            print("2`")
            resend_verification_email(email)
        return {"message": "Registration successful! Please check your email for verification."}, 201
    except Exception as e:
        print("3`")
        return {"error": str(e)}, 500
    
def login_user(email, password, remember_me):
    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return {"error": "Invalid credentials"}, 401

    if not user.is_verified:
        return {"error": "Please verify your email before logging in"}, 403

    token = generate_auth_token(user.email, remember_me)
    max_age = 7 * 24 * 60 * 60 if remember_me else 30 * 60  

    response = make_response({
        "message": "Login successful!",
        "token": token
    })
    response.set_cookie(
        'token',
        token,
        httponly=False,  
        path='/',
        secure=False,    
        samesite='Lax',
        max_age=max_age
    )

    return response, 200

def handle_reset_password(token, new_password):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        email = payload.get('email')

        user = User.query.filter_by(email=email).first()
        if not user:
            return {"message": "If the email exists, you will receive a password reset link"}, 400

        if user.reset_token != token:
            return {"error": "Invalid or already used token"}, 401

        if user.reset_token_expiry and datetime.now(timezone.utc) > user.reset_token_expiry.replace(tzinfo=timezone.utc):
            return {"error": "Token expired. Please request a new reset link."}, 401

        user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.reset_token = None
        user.reset_token_expiry = None
        db.session.commit()
        return {"message": "Password reset successful. You can now log in."}, 200

    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired."}, 400
    except jwt.InvalidTokenError:
        return {"error": "Invalid token."}, 400
    except Exception as e:
        return {"error": "Something went wrong. Try again."}, 500