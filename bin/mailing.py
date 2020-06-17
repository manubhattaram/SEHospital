
import smtplib, ssl, sys

string1 = sys.argv[2];
smtp_server = "smtp.gmail.com"
port = 587  # For starttls
sender_email = "hestia.medical.help@gmail.com"
rcvr_email = sys.argv[1]
password = "hestia123"
message = """\
Subject: About Your Appointment at Hestia Medical.

"""
message = message+string1
print(message)

#input("Type your password and press enter: ")

# Create a secure SSL context
context = ssl.create_default_context()

# Try to log in to server and send email
try:
	server = smtplib.SMTP(smtp_server,port)
	server.ehlo()
	server.starttls(context=context) # Secure the connection
	server.ehlo()
	server.login(sender_email, password)
	server.sendmail(sender_email, rcvr_email, message)

except Exception as e:
    print("Error: ")
    print(e)
finally:
    server.quit()
