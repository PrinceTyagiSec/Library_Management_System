import jwt
from datetime import datetime, timezone,timedelta
from flask import current_app
from models import User
from models import db  # Needed for reset token saving

# For authentication (login) tokens:
def generate_auth_token(email, remember_me=False):
    user = User.query.filter_by(email=email).first()
    if not user:
        raise ValueError("User not found")

    exp_time = timedelta(days=7) if remember_me else timedelta(minutes=30)
    payload = {
        "id": user.id,
        "email": user.email,
        "is_admin": user.is_admin,
        "exp": datetime.now(timezone.utc) + exp_time
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def generate_reset_token(email):
    """
    🔁 Generates a JWT reset token for a user based on their email.
    - Stores the token and expiry time in the database.
    - Used for password reset functionality.
    """
    token, exp_time = generate_timed_token(email, expiry_minutes=15)
    
    # Get the user again (you could also pass the user from the helper if you prefer)
    user = User.query.filter_by(email=email).first()
    # Store the token and its expiry in the database for resets
    user.reset_token = token
    user.reset_token_expiry = exp_time
    db.session.commit()

    return token

def generate_timed_token(email, expiry_minutes):
    """
    ⏱️ Generates a JWT token with a specific expiration time.
    - Encodes user's email and expiry time into a JWT token.
    - Returns both token and datetime object for expiry.
    """
    # Query the user
    user = User.query.filter_by(email=email).first()
    if not user:
        raise ValueError("User not found")

    # Calculate the expiry time based on given minutes
    exp_time = datetime.now(timezone.utc) + timedelta(minutes=expiry_minutes)
    # Create the payload. Here we include the email and expiry.
    payload = {
        "email": email,
        "exp": exp_time
    }
    # Generate the token using the secret key from current_app.config
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm="HS256")
    return token, exp_time  


def generate_email_verification_token(email):
    """
    📧 Generates a JWT token for email verification.
    - Stores the token and expiry in dedicated fields in the user model.
    - Intended for verifying user's email address after registration or email change.
    """

    try:
        token, exp_time = generate_timed_token(email, expiry_minutes=15)

        # Get the user and store the token
        user = User.query.filter_by(email=email).first()
        if not user:
            return None

        user.email_verification_token = token
        user.email_verification_expiry = exp_time
        db.session.commit()

        return token
    
    except Exception as e:
        return None
