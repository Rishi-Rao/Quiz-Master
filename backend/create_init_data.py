from flask import current_app as app
from sqlalchemy import text
from backend.models import db
from flask_security import SQLAlchemyUserDatastore,hash_password
from datetime import datetime

with app.app_context():
    db.create_all()
    
    user_datastore: SQLAlchemyUserDatastore = app.security.datastore

    user_datastore.find_or_create_role(name='admin', description = 'superuser')
    user_datastore.find_or_create_role(name='user', description = 'gen user')

    if not user_datastore.find_user(email = 'admin@gmail.com'):
        user_datastore.create_user(email = 'admin@gmail.com', password = hash_password('pass'), roles = ['admin'] , name = "ADMIN", qualification = "ADMIN" , dob = datetime(2004,12,23) )
        user_datastore.create_user(email = 'user1@gmail.com', password = hash_password('pass'), roles = ['user'], name = "user1", qualification = "Diploma" , dob = datetime(2004,12,23) )

    db.session.commit()

with db.engine.connect() as connection:
    result = connection.execute(text('PRAGMA foreign_keys = ON'))