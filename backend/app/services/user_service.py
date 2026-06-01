from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password
# CREATE
def create_user(db: Session, email: str, password: str, full_name: str):
    hashed_password = hash_password(password)
    new_user = User(email=email, password_hash=hashed_password, full_name=full_name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# READ — get user by email (used during login)
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# READ — get user by id (used when verifying JWT token)
def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

# UPDATE
def update_user_name(db: Session, user_id: int, full_name: str):
    user = db.query(User).filter(User.id == user_id).first()
    user.full_name = full_name
    db.commit()
    return user

# DELETE
def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    db.delete(user)
    db.commit()