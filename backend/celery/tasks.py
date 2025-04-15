from celery import shared_task
import time
import flask_excel
from backend.celery.mail_service import send_email
from backend.models import User

@shared_task(ignore_result = False)
def add(x,y):
    time.sleep(10)
    return x+y
    

@shared_task(bind = True, ignore_result = False)
def create_csv(self):
    resource = User.query.all()

    task_id = self.request.id
    filename = f'User_data_{task_id}.csv'
    column_names = [column.name for column in User.__table__.columns]
    print(column_names)
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names = column_names, file_type='csv' )

    with open(f'./backend/celery/user-downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename


@shared_task(ignore_result = True)
def email_reminder(subject, content):
    resource = User.query.all()
    for i in resource:
        send_email(i.email, subject, content)   
        pass