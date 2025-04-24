from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, Boolean
from extensions import db
from datetime import datetime

class User(db.Model):
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(50), nullable=False)
    email = db.Column(String(100), unique=True, nullable=False)
    reset_token = db.Column(db.String(255), nullable=True)  
    reset_token_expiry = db.Column(db.DateTime, nullable=True)  
    password = db.Column(String(200), nullable=False)
    is_verified = db.Column(Boolean, default=False)
    is_admin = db.Column(Boolean, default=False)

    borrowed_books = db.relationship('Borrow', back_populates='user')

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    available = db.Column(db.Boolean, default=True)
    is_deleted = db.Column(Boolean, default=False, index=True)  
    borrowers = db.relationship('Borrow', back_populates='book')

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "available": self.available,
            "is_deleted": self.is_deleted  
        }

class Borrow(db.Model):
    __tablename__ = 'borrow'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id',  ondelete='SET NULL'), nullable=True)
    user_name = db.Column(db.String(100), nullable=True)  
    user_email = db.Column(db.String(100), nullable=True)  
    is_deleted = db.Column(db.Boolean, default=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    borrow_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    return_date = db.Column(db.Date, nullable=True)
    
    due_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(20), default='Pending')  

    user = db.relationship('User', back_populates='borrowed_books', passive_deletes=True)
    book = db.relationship('Book', back_populates='borrowers')
