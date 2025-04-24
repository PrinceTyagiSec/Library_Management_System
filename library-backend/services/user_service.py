from models import User, Borrow

def get_user_by_id(user_id):
    return User.query.get(user_id)

def get_user_profile(user_id):
    user = get_user_by_id(user_id)
    if not user:
        return None
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_admin": user.is_admin
    }
