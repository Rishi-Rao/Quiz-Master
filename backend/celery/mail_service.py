from email import encoders
from email.mime.base import MIMEBase
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from backend.models import *

SMTP_SERVER = "localhost"
SMTP_PORT =1025
SENDER_EMAIL = 'QuizAdmin@example'
SENDER_PASSWORD = ''


def send_email(to, subject, content):

    msg = MIMEMultipart()
    msg['To'] = to
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL

    msg.attach(MIMEText(content,'html'))

    with smtplib.SMTP(host=SMTP_SERVER, port=SMTP_PORT) as client:
        client.send_message(msg)
        client.quit()

def send_email_att(to, subject, content, attachment_path=None):
    msg = MIMEMultipart()
    msg['To'] = to
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL

    msg.attach(MIMEText(content, 'html'))

    if attachment_path:
        try:
            with open(attachment_path, "rb") as attachment:
                part = MIMEBase('application', 'octet-stream') 
                part.set_payload(attachment.read()) 

                encoders.encode_base64(part)
                part.add_header(
                    'Content-Disposition', 
                    f'attachment; filename={attachment_path.split("/")[-1]}'
                )
                msg.attach(part)
        except Exception as e:
            print(f"Error attaching file: {e}")
            return
    try:
        with smtplib.SMTP(host=SMTP_SERVER, port=SMTP_PORT) as client:
            client.send_message(msg)
            client.quit()
    except Exception as e:
        print(f"Error sending email: {e}")

def send_email_with_attachment(subject, to_email, body, pdf_buffer, pdf_filename):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))
    
    part = MIMEBase('application', 'octet-stream')
    part.set_payload(pdf_buffer.read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', f'attachment; filename={pdf_filename}')
    msg.attach(part)
    
    with smtplib.SMTP(host=SMTP_SERVER, port=SMTP_PORT) as client:
        client.send_message(msg)
        client.quit()

def onNewQuiz(subid):
    sub=Subject.query.filter_by(id=subid).one()
    print(sub.name)
    sub_name=sub.name
    userlist=Subscribed.query.filter_by(sub_id=subid).all()
    for i in userlist:
        mail=User.query.filter_by(id = i.user_id).one()
        msg=f'''Dear user,\nA NEW QUIZ FOR {sub_name} IS NOW LIVE ATTEMPT IT \nThank you, \nQuizMaster'''
        sub=f'New Quiz is now Live'
        send_email(mail.email,sub,msg)