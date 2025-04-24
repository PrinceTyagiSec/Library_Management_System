from flask import Blueprint, request, jsonify, current_app, redirect
from models import db, User
from flask_bcrypt import Bcrypt
from flask_mail import Message
from extensions import mail
from threading import Thread
import jwt
import os
import datetime
from flask import make_response
from flask_jwt_extended import create_access_token, set_access_cookies
bcrypt = Bcrypt()
auth_bp = Blueprint('auth', __name__)
from .decorator import token_required  
from sqlalchemy import text  
from services.auth_services import register_user, login_user, handle_reset_password

from services.mail_services import handle_forgot_password, resend_verification_email,verify_email_token
from dotenv import load_dotenv 

load_dotenv()


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400
    try:
        result, status = handle_forgot_password(email)
        return jsonify(result), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')
    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400
    try:
        result, status = handle_reset_password(token, new_password)
        return jsonify(result), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/resend-verification', methods=['POST'])
def resend_verification():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    result, status = resend_verification_email(email)
    return jsonify(result),status

@auth_bp.route('/verify-email', methods=['GET'])
def verify_email():
    token = request.args.get('token')
    email, error = verify_email_token(token)
    frontend_url = os.getenv("FRONTEND_URL")

    redirect_map = {
        "MissingToken": f"{frontend_url}/login?error=MissingToken",
        "InvalidOrExpiredToken": f"{frontend_url}/login?error=InvalidOrExpiredToken",
        "TokenExpired": f"{frontend_url}/resend-verification?email={email}&error=TokenExpired",
        "InvalidToken": f"{frontend_url}/login?error=InvalidToken"
    }

    if error:
        return redirect(redirect_map.get(error, f"{frontend_url}/login?error=Unknown"))

    return redirect(f"{frontend_url}/login?message=Email verified successfully!&messageType=success")


@auth_bp.route('/protected', methods=['GET'])
@token_required
def protected_route(current_user):
    
    return jsonify({"message": "Access granted", "user": current_user}), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        remember_me = data.get('rememberMe', False)

        return login_user(email, password, remember_me)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        result, status = register_user(name, email, password)
        return jsonify(result), status

    except Exception as e:
        return jsonify({"error": str(e)}), 500
