from celery.schedules import crontab
from flask import current_app as app
from backend.celery.mail_service import send_email_with_attachment
from backend.celery.pdfmaker import generate_user_summary_pdf
from backend.celery.tasks import email_reminder
from backend.models import *
from datetime import datetime, timedelta

celery_app = app.extensions['celery']

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # every 10 seconds
    #sender.add_periodic_task(10.0, email_reminder.s( 'reminder to login', '<h1> hello everyone </h1>') )
    #sender.add_periodic_task(10.0, sendsumamrymail.s() )

    # daily message at 12:00 pm, everyday
    sender.add_periodic_task(crontab(hour=14, minute=21), email_reminder.s('reminder to login', '<h1> hello everyone </h1>'), name='daily reminder' )

    # Monthly messages
    sender.add_periodic_task(crontab(hour=14, minute=23, day_of_month=9), sendsumamrymail.s())
    
@celery_app.task
def sendsumamrymail():
    userlist= User.query.all()
    for i in userlist:
        send_user_summary_periodically(i.id)

    pass

def send_user_summary_periodically(user_id):
    user_summary = generate_user_summary(user_id)
    
    pdf_buffer = generate_user_summary_pdf(user_summary)
    
    send_email_with_attachment(
        subject='User Summary Report',
        to_email=user_summary['user_email'],
        body='<h1>Your User Summary Report</h1>',
        pdf_buffer=pdf_buffer,
        pdf_filename=f'user_summary_{user_id}.pdf'
    )

def generate_user_summary(user_id):
    now = datetime.now()
    
    start_of_year = datetime(now.year, 1, 1)
    start_of_month = datetime(now.year, now.month, 1)
    start_of_week = now - timedelta(days=now.weekday())  
    start_of_day = datetime(now.year, now.month, now.day) 

    yearly_tests = db.session.query(Scores).filter(
        Scores.user_id == user_id,
        Scores.timestamp >= start_of_year
    ).all()

    monthly_tests = db.session.query(Scores).filter(
        Scores.user_id == user_id,
        Scores.timestamp >= start_of_month
    ).all()

    weekly_tests = db.session.query(Scores).filter(
        Scores.user_id == user_id,
        Scores.timestamp >= start_of_week
    ).all()

    daily_tests = db.session.query(Scores).filter(
        Scores.user_id == user_id,
        Scores.timestamp >= start_of_day
    ).all()

    u=User.query.filter_by(id=user_id).one()
    summary = {
        'user_email':u.email,
        'user_name':u.name,
        'year': {
            'tests_attended': len(yearly_tests),
            'scores': [(score.quiz_id, score.score, score.timestamp) for score in yearly_tests]
        },
        'month': {
            'tests_attended': len(monthly_tests),
            'scores': [(score.quiz_id, score.score, score.timestamp) for score in monthly_tests]
        },
        'week': {
            'tests_attended': len(weekly_tests),
            'scores': [(score.quiz_id, score.score, score.timestamp) for score in weekly_tests]
        },
        'day': {
            'tests_attended': len(daily_tests),
            'scores': [(score.quiz_id, score.score, score.timestamp) for score in daily_tests]
        }
    }

    # print(summary)
    return summary

