import os
from flask import current_app as app, jsonify , request ,render_template, send_file
from flask_security import auth_required, verify_password ,hash_password
from backend.celery.mail_service import send_email_att
from backend.models import User, db
from datetime import datetime
from backend.celery.tasks import add, create_csv
from celery.result import AsyncResult

datastore = app.security.datastore

@app.route('/')
def home():
    return render_template("index.html")

@app.get('/celery')
def celery():
     task = add.delay(10, 20)
     return {'task_id' : task.id}

@app.route('/upload-pdf/<int:id>', methods=['POST'])
def upload_pdf(id):
    if 'pdf' not in request.files:
        return jsonify({'success': False, 'message': 'No file part'}), 400

    file = request.files['pdf']
    
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'}), 400

    # Save the PDF to the server
    pdf_path = os.path.join('backend/celery/user-downloads/', 'quiz-summary.pdf')
    file.save(pdf_path)

    user=User.query.filter_by(id = id).one()
    
    # Send the email with the PDF attachment
    send_email_att(
        to=user.email,  
        subject="Quiz Summary PDF",
        content="Please find attached the quiz summary PDF.",
        attachment_path=pdf_path
    )

    # Return success response
    return jsonify({'success': True, 'message': 'PDF uploaded and email sent!'}), 20


@app.get('/get-csv/<id>')
def getCSV(id):
    result = AsyncResult(id)

    if result.ready():
        print(f"File path: backend/celery/user-downloads/{result.result}")
        return send_file(f'backend/celery/user-downloads/{result.result}'), 200
    else:
        return {'message' : 'task not ready'}, 405
    
@app.get('/create-csv')
def createCSV():
    task = create_csv.delay()
    return {'task_id' : task.id}, 200


@app.route('/login',methods=["POST"])
def login():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password :
        return jsonify({"messege":"invalid inputs"}), 404
    
    user = datastore.find_user(email = email)
    
    if not user:
        return jsonify({"messege":"invalid email"}), 404
    
    if verify_password(password,user.password):
        return jsonify({"token": user.get_auth_token(),"email": user.email, "role": user.roles[0].name ,'id': user.id }), 200

    return jsonify({"messege":"invalid email"}), 400

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    qualification = data.get('qualification')
    dob = datetime.strptime(data.get('dob'), "%Y-%m-%d").date()

    
    if not email or not password :
        return jsonify({"messege":"invalid inputs"}), 404
    
    user = datastore.find_user(email = email)
    
    if user:
        return jsonify({"messege":"invalid email"}), 404
    
    try:
        datastore.create_user(email = email, password = hash_password(password), roles = ['user'], name=name, qualification=qualification,dob=dob)
        db.session.commit()
        return jsonify({"messege" : "user_created"}),200
    
    except:
        db.session.rollback()
        return jsonify({"messege":"error creating user"}), 404
