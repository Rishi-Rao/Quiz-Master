from flask import current_app as app, jsonify , request ,render_template
from flask_security import auth_required, verify_password ,hash_password
from backend.models import db
from datetime import datetime

datastore = app.security.datastore

@app.route('/')
def home():
    return render_template("index.html")

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
