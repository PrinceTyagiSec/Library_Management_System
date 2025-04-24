from math import ceil
from flask import Blueprint, request, jsonify
from models import db, Book, Borrow, User
from .decorator import token_required
from datetime import timedelta, datetime, timezone
import traceback
from sqlalchemy.orm import aliased
from sqlalchemy import or_
from sqlalchemy import case, literal_column

borrow_bp = Blueprint('borrow', __name__)

books_bp = Blueprint('books', __name__, url_prefix='/api/books')

def is_admin(user_data):
    return True  

@books_bp.route('', methods=['POST'])
@token_required
def add_book(user_data):
    if not is_admin(user_data):
        return jsonify({"msg": "Admin only"}), 403

    data = request.get_json()
    if not data or 'title' not in data or 'author' not in data:
        return jsonify({"msg": "Missing required fields: title and author"}), 400
    new_book = Book(title=data['title'], author=data['author'], available=data.get('available', True))
    db.session.add(new_book)
    db.session.commit()
    return jsonify(new_book.to_dict()), 201

@books_bp.route('/<int:book_id>', methods=['PUT'])
@token_required
def update_book(user_data, book_id):
    if not is_admin(user_data):
        return jsonify({"msg": "Admin only"}), 403

    book = Book.query.get(book_id)
    if not book:
        return jsonify({"msg": "Book not found"}), 404

    data = request.get_json()
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.available = data.get('available', book.available)
    db.session.commit()
    return jsonify(book.to_dict())

@books_bp.route('/delete/<int:book_id>', methods=['DELETE'])
@token_required
def delete_book(user_data, book_id):
    if not is_admin(user_data):
        return jsonify({"msg": "Admin only"}), 403

    book = Book.query.get(book_id)
    if not book:
        return jsonify({"msg": "Book not found"}), 404

    book.is_deleted = True
    db.session.commit()
    return jsonify({"msg": "Book deleted"})

@books_bp.route('/restore/<int:book_id>', methods=['PUT'])
@token_required
def restore_book(user_data, book_id):
    if not is_admin(user_data):
        return jsonify({"msg": "Admin only"}), 403

    book = Book.query.get(book_id)
    if not book or not book.is_deleted:
        return jsonify({'message': 'Book not found or already active'}), 404
    book.is_deleted = False
    db.session.commit()
    return jsonify({'message': 'Book restored successfully'})

@books_bp.route('', methods=['GET'])
@token_required
def get_all_books(user_data):
    if not is_admin(user_data):
        return jsonify({"msg": "Admin only"}), 403

    
    search_query = request.args.get('search_query', '').lower()  
    filter_status = request.args.get('filter_status', 'all')  
    search_by = request.args.get('search_by', 'title')  
    page = int(request.args.get('page', 1))  
    limit = int(request.args.get('limit', 10))  


    
    query = Book.query

    
    if search_query:
        if search_by == 'title':
            query = query.filter(Book.title.ilike(f'%{search_query}%'))  
        elif search_by == 'author':
            query = query.filter(Book.author.ilike(f'%{search_query}%'))  

    
    if filter_status == 'deleted':
        query = query.filter(Book.is_deleted == True)
    elif filter_status == 'not_deleted':
        query = query.filter(Book.is_deleted == False)

 
    total_books = query.count()
    total_pages = ceil(total_books / limit)

    
    books = query.offset((page - 1) * limit).limit(limit).all()

    
    return jsonify({
        'books': [book.to_dict() for book in books],
        'totalPages': total_pages
    })

@books_bp.route('/available', methods=['GET'])
def get_available_books():
    
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))

    
    search_query = request.args.get('searchQuery', '')
    search_by = request.args.get('searchBy', '')
    filter_status = request.args.get('filterStatus', '')

    
    offset = (page - 1) * limit

    
    books_query = Book.query.filter_by(is_deleted=False)

    
    if search_query and search_by:
        
        if search_by == 'title':
            books_query = books_query.filter(Book.title.ilike(f'%{search_query}%'))
        elif search_by == 'author':
            books_query = books_query.filter(Book.author.ilike(f'%{search_query}%'))

    
    if filter_status:
        if filter_status == 'available':
            books_query = books_query.filter(Book.available == True)
        elif filter_status == 'not_available':
            books_query = books_query.filter(Book.available == False)
        elif filter_status == 'all':  
            pass  

    
    total_books = books_query.count()
    
    
    books = books_query.offset(offset).limit(limit).all()

    
    response = {
        "books": [book.to_dict() for book in books],
        "totalPages": (total_books // limit) + (1 if total_books % limit > 0 else 0),
        "currentPage": page,
        "totalBooks": total_books
    }
    
    return jsonify(response)



@borrow_bp.route('', methods=['POST'])
@token_required
def borrow_book(user_data):
    

    data = request.get_json()
    book_id = data.get('book_id')

    if user_data.get("is_admin"):
        return jsonify({"message": "Admins are not allowed to borrow books."}), 403

    if not book_id:
        return jsonify({"message": "Missing book_id"}), 400

    book = Book.query.get(book_id)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    if not book.available:
        return jsonify({"message": "Book is not available"}), 400
    borrow_date = datetime.now(timezone.utc)
    due_date = borrow_date + timedelta(days=14)  

    borrow = Borrow(
            user_id=user_data["id"],
            book_id=book_id,
            borrow_date=borrow_date,
            due_date=due_date,
            status='Not Returned'  
        )

    book.available = False
    db.session.add(borrow)
    db.session.commit()

    return jsonify({
        "message": f"You have borrowed '{book.title}'.",
        "due_date": due_date.strftime("%Y-%m-%d")
    })

@borrow_bp.route('/records', methods=['GET'])
@token_required
def get_borrow_records(user_data):
    try:
        now = datetime.now(timezone.utc).date()
        
        search_query = request.args.get('searchQuery', '')
        status_filter = request.args.get('returnStatus', '')
        account_status_filter = request.args.get('accountStatus', '')
        search_by = request.args.get('searchBy', 'book')  
        page = request.args.get('page', 1, type=int)  
        limit = request.args.get('limit', 10, type=int)  

        borrow_status_case = case(
            (Borrow.return_date.isnot(None), literal_column("'Returned'")),
            (Borrow.return_date.is_(None) & (Borrow.due_date < now), literal_column("'Overdue'")),
            (Borrow.return_date.is_(None) & (Borrow.due_date >= now), literal_column("'Not Returned'")),
            else_=literal_column("'Unknown'")
        ).label('borrow_status_unique')  
        
        
        query = db.session.query(
            Borrow.id,
            Borrow.borrow_date,
            Borrow.due_date,
            Borrow.return_date,
            Borrow.status,
            Borrow.is_deleted.label('user_is_deleted'),
            borrow_status_case,
            User.id.label('user_id'),
            User.name.label('user_name'),
            Borrow.user_name.label('borrow_user_name'),
            Borrow.user_email.label('borrow_user_email'),
            User.email.label('user_email'),
            Book.id.label('book_id'),
            Book.title.label('book_title'),
            Book.author.label('book_author')
        ).outerjoin(User, Borrow.user_id == User.id)\
         .outerjoin(Book, Borrow.book_id == Book.id)

        if search_query:
            if search_by == 'book':
                query = query.filter(Book.title.ilike(f'%{search_query}%'))

            elif search_by == 'author':
                query = query.filter(Book.author.ilike(f'%{search_query}%'))

            elif search_by == 'borrower':
                query = query.filter(
                    Borrow.user_id.is_(None),
                    Borrow.user_name.ilike(f"%{search_query}%")
                ).union(
                    query.filter(User.name.ilike(f'%{search_query}%'))
                )

            elif search_by == 'borrowerEmail':
                query = query.filter(
                    Borrow.user_id.is_(None),
                    Borrow.user_email.ilike(f"%{search_query}%")
                ).union(
                    query.filter(User.email.ilike(f'%{search_query}%'))
                )

        
        if status_filter:
            status_filter = status_filter.lower()
            if status_filter == "returned":
                query = query.filter(
                    Borrow.return_date.isnot(None)
                )
            elif status_filter == "overdue":
                
                query = query.filter(
                    Borrow.return_date.is_(None),
                    Borrow.due_date <= now
                )
            elif status_filter == "not_returned":
                
                query = query.filter(
                    Borrow.return_date.is_(None),
                    Borrow.due_date > now
                )

        
        if account_status_filter:
            account_status_filter = account_status_filter.lower()
            if account_status_filter == "active":
                query = query.filter(Borrow.is_deleted == False)
            elif account_status_filter == "deleted":
                query = query.filter(Borrow.is_deleted == True)

        
        records = query.all()

        
        borrow_records = query.paginate(page=page, per_page=limit, error_out=False)
        records = borrow_records.items
        total_pages = borrow_records.pages

        
        result = []
        for r in records:
            user_id = r.user_id
            user_name = None
            user_email = None
            account_status = None

            
            if user_id is None or r.user_id is None or r.user_is_deleted:
                
                user_name = r.borrow_user_name or "Deleted Account"
                user_email = r.borrow_user_email or "Deleted Account"
                account_status = "Deleted"
            else:
                
                user_name = r.user_name
                user_email = r.user_email
                account_status = "Active"

            
            result.append({
                "borrow_id": r.id,
                "borrow_date": r.borrow_date,
                "due_date": r.due_date,
                "return_date": r.return_date,
                "user_id": r.user_id,
                "user_name": user_name,
                "account_status": account_status,
                "user_email": user_email,
                "book_id": r.book_id,
                "book_title": r.book_title,
                "book_author": r.book_author,
                "borrow_status": r.borrow_status_unique,  
            })

        return jsonify({
            "records": result,
            "totalPages": total_pages
        })

    except Exception as e:
        traceback.print_exc()  
        return jsonify({"msg": "An error occurred while fetching borrow records."}), 500


@borrow_bp.route('/return', methods=['POST'])
@token_required
def return_book(user_data):
    data = request.get_json()
    borrow_id = data.get('borrow_id')

    if not borrow_id:
        return jsonify({"msg": "Missing borrow_id"}), 400

    borrow_record = Borrow.query.get(borrow_id)
    if not borrow_record or borrow_record.user_id != user_data['id']:
        return jsonify({"msg": "Borrow record not found or not authorized"}), 404

    if borrow_record.return_date:
        return jsonify({"msg": "Book already returned"}), 400

    
    return_date = datetime.now(timezone.utc).date()
    borrow_record.return_date = return_date

    
    if borrow_record.due_date and return_date > borrow_record.due_date:
        borrow_record.status = "Returned (Late)"
    else:
        borrow_record.status = "Returned"

    
    book = Book.query.get(borrow_record.book_id)
    book.available = True

    db.session.commit()

    return jsonify({
        "msg": f"Book '{book.title}' returned successfully",
        "status": borrow_record.status
    })

@borrow_bp.route('/history', methods=['GET'])
@token_required
def user_borrow_history(user_data):
    """
    👤 Get the borrowing history of the currently logged-in user.
    """
    user_id = user_data['id']
    search_query = request.args.get('search')
    search_by = request.args.get('search_by')
    status = request.args.get('return_status')
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=10, type=int)


    
    query = Borrow.query.join(Book).join(User)
    if not user_id:
        return jsonify({"error": "User not found"}), 404

    
    if user_id:
        query = query.filter(Borrow.user_id == user_id)

    if status == 'returned':
        query = query.filter(Borrow.return_date.isnot(None))
    elif status == 'not_returned':
        query = query.filter(
            Borrow.return_date.is_(None),  
            Borrow.due_date >= datetime.now()  
        )
    elif status == 'overdue':
        
        query = query.filter(
            Borrow.return_date.is_(None),  
            Borrow.due_date <= datetime.now()  
        )

    
    if search_query:
        if search_by == 'book':
            query = query.filter(Book.title.ilike(f"%{search_query}%"))
        elif search_by == 'author':
            query = query.filter(Book.author.ilike(f"%{search_query}%"))
        elif search_by == 'borrower':
            query = query.filter(
                (Borrow.user_id.is_(None) & Borrow.user_name.ilike(f"%{search_query}%")) |
                (User.name.ilike(f'%{search_query}%'))
            )
        elif search_by == 'borrowerEmail':
            query = query.filter(
                (Borrow.user_id.is_(None) & Borrow.user_email.ilike(f"%{search_query}%")) |
                (User.email.ilike(f'%{search_query}%'))
            )

    pagination = query.order_by(Borrow.borrow_date.desc()).paginate(page=page, per_page=limit, error_out=False)
    borrow_history = pagination.items


    result = []
    for record in borrow_history:
        
        if record.return_date:
            status = "Returned"
        elif record.due_date < datetime.now().date() and record.return_date is None:  
            status = "Overdue"
        else:
            status = "Not Returned"

        result.append({
            "borrow_id": record.id,
            "user_name": record.user.name,
            "user_email": record.user.email,
            "book_title": record.book.title,
            "book_author": record.book.author,
            "borrow_date": record.borrow_date,
            "return_date": record.return_date,
            "due_date": record.due_date.strftime("%Y-%m-%d") if record.due_date else "N/A",
            "status": status
        })

    return jsonify({
    "history": result,
    "totalPages": pagination.pages,
    "currentPage": pagination.page,
}), 200
