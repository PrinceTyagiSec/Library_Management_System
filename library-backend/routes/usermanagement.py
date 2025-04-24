from flask import Blueprint, request, jsonify
from models import db, User  
from .decorator import token_required
from routes.auth import register
from services.auth_services import register_user
from services.mail_services import resend_verification_email
from routes.books import Borrow

user_bp = Blueprint('user_management', __name__)  

def is_admin(user_data):
    return user_data.get("is_admin") == 1

@user_bp.route('', methods=['GET'])
@token_required
def get_users(user_data):
    if not is_admin(user_data):
        return jsonify({"msg": "Admin only"}), 403

    
    search_query = request.args.get('search', '', type=str).strip()
    search_by = request.args.get('searchBy', 'name', type=str)
    filter_verified = request.args.get('verified', 'all', type=str)
    page = request.args.get('page', 1, type=int)  
    limit = request.args.get('limit', 10, type=int)  

    
    query = User.query

    
    if search_query:
        if search_by == 'email':
            query = query.filter(User.email.ilike(f"%{search_query}%"))
        else:  
            query = query.filter(User.name.ilike(f"%{search_query}%"))

    
    if filter_verified == 'verified':
        query = query.filter(User.is_verified.is_(True))
    elif filter_verified == 'not_verified':
        query = query.filter(User.is_verified.is_(False))

        
    users_query = query.paginate(page=page, per_page=limit, error_out=False)  

    users = users_query.items  
    total_pages = users_query.pages  

    return jsonify({
            "users": [{
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "is_admin": u.is_admin,
                "email_verified": u.is_verified
            } for u in users],
            "totalPages": total_pages  
        })


@user_bp.route('/<int:user_id>', methods=['PUT'])
@token_required
def update_user(user_data, user_id):

    if not is_admin(user_data):
        return jsonify({"msg": "Admin only"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()
    user.name = data.get("name", user.name)

    
    new_email = data.get("email")
    email_changed = False
    if new_email and new_email != user.email:
        user.email = new_email
        user.is_verified = False  
        email_changed = True

    user.name = data.get("name", user.name)
    user.is_admin = data.get("is_admin", user.is_admin)

    db.session.commit()

    if email_changed:
            try:
                resend_verification_email(new_email)
            except Exception as e:
                return jsonify({
                    "msg": "Email updated but failed to send verification email",
                    "error": str(e)
                }), 500

    return jsonify({"msg": "User updated"})

def update_borrow_history_with_user_info(user_id, user_name, user_email):
    
    borrow_records = Borrow.query.filter_by(user_id=user_id).all()
    for borrow in borrow_records:
        borrow.user_name = user_name
        borrow.user_email = user_email
    db.session.commit()

@user_bp.route('/<int:user_id>', methods=['DELETE'])
@token_required
def delete_user(user_data, user_id):
    if not is_admin(user_data):
        return jsonify({"msg": "Admin only"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    
    update_borrow_history_with_user_info(user_id, user.name, user.email)

    
    borrow_records = Borrow.query.filter_by(user_id=user_id).all()
    for record in borrow_records:
        record.is_deleted = True
    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "User deleted"})


@user_bp.route('', methods=['POST'])
@token_required
def add_user(user_data):
    try:
        req_data = request.get_json()
        name = req_data.get('name')
        email = req_data.get('email')
        password = req_data.get('password')
        is_admin = req_data.get('is_admin', False)
        
        return register_user(name, email, password, send_verification=True, is_admin=is_admin)
    except Exception as e:
        return jsonify({"error": str(e)}), 500