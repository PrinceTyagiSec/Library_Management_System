import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "supersecretkey"
    JWT_COOKIE_SECURE = False
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SAMESITE = "None"
    JWT_ACCESS_COOKIE_NAME = 'token'
    JWT_COOKIE_CSRF_PROTECT = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    
    BACKEND_URL = os.environ.get("BACKEND_URL", "")

    
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465  
    MAIL_USE_SSL = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')  
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')  
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_USERNAME')  


    
