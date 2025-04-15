import io
import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import Image
from PIL import Image as PILImage

def generate_test_attendance_graph(data):
    
    labels = ['year', 'month', 'week', 'day']
    print(labels)
    values = [data[period]['tests_attended'] for period in labels]  
    print(values)
    plt.bar(labels, values, color=['blue', 'green', 'orange', 'red'])

    plt.title('Number of Tests Attended')
    plt.xlabel('Time Period')
    plt.ylabel('Tests Attended')

    img_stream = io.BytesIO()
    plt.savefig(img_stream, format='png')  
    img_stream.seek(0)
    plt.close()
    return img_stream 

def generate_user_summary_pdf(user_summary):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica-Bold", 16)
    c.drawString(100, height - 50, f"User Summary Report")

    c.setFont("Helvetica", 12)
    c.drawString(100, height - 80, f"User: {user_summary['user_name']}")
    c.drawString(100, height - 100, f"Email: {user_summary['user_email']}")

    c.setFont("Helvetica-Bold", 12)
    y_position = height - 150
    headers = ["Period", "Tests Attended", "Scores"]
    c.drawString(100, y_position, headers[0])
    c.drawString(250, y_position, headers[1])
    c.drawString(400, y_position, headers[2])

    y_position -= 50 

    periods = ['year', 'month', 'week', 'day']
    for period in periods:
        c.setFont("Helvetica", 10)
        c.drawString(100, y_position, period.capitalize())
        c.drawString(250, y_position, str(user_summary[period]['tests_attended']))

        scores_text = "\n".join([f"Quiz {score[0]}: {score[1]}" for score in user_summary[period]['scores'][:3]])
        c.drawString(400, y_position, scores_text)

        y_position -= 40  

    y_position -= 120 
    graph_image_stream = generate_test_attendance_graph(user_summary)

    try:
        img = PILImage.open(graph_image_stream)  
        graph_image_stream.seek(0)  

        image = Image(graph_image_stream, width=200, height=150)
        image.drawHeight = 150
        image.drawWidth = 200
        image.wrapOn(c, width, height)
        image.drawOn(c, 100, y_position)
    except Exception as e:
        print(f"Error loading image for period {period}: {e}")

    c.showPage()
    c.save()

    buffer.seek(0)
    return buffer

# data = {
#     'year': {
#         'tests_attended': 15,
#     },
#     'month': {
#         'tests_attended': 5,
#     },
#     'week': {
#         'tests_attended': 2,
#     },
#     'day': {
#         'tests_attended': 1,
#     }
# }
# generate_test_attendance_graph(data)