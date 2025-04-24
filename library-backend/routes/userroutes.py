from flask import Blueprint, jsonify
from .decorator import token_required  
from services.user_service import get_user_profile

user_bp = Blueprint("user", __name__)  

@user_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(user_data):
    profile = get_user_profile(user_data['id'])
    if not profile:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(profile)

