from flask import request, jsonify
from flask_restful import Resource
from config import app, api, db
from flask_jwt_extended import create_access_token
from models import User, Customer
from email.mime.text import MIMEText
import smtplib
import secrets
from datetime import timedelta

# User verification
def send_verification_email(email, verification_code):
    sender = 'emmanuelokello294@gmail.com'
    recipient = email
    subject = 'SENDIT - Verify your email'
    body = f'Your verification code is : {verification_code}'

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.starttls()
            smtp.login('emmanuelokello294@gmail.com', 'quzo ygrw gcse maim')
            smtp.send_message(msg)
    except smtplib.SMTPException as e:
        print(f"Error sending verification email: {e}")
        raise e
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise e


class Register(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')

        if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
            return jsonify({'message': 'Username or email already exists'}), 400
        
        verification_code = secrets.token_hex(3)
        new_user = Customer(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            verification_code=verification_code,
            is_verified=False
        )
        db.session.add(new_user)
        db.session.commit()

        try:
            send_verification_email(data['email'], verification_code)
            return {'message': 'User created. Please check your email for verification.'}, 201
        except Exception as e:
            db.session.delete(new_user)
            db.session.commit()
            return {'error': 'Failed to send verification email.'}, 500


class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and user.check_password(data['password']):
            if not user.is_verified:
                return {'message': 'Please verify your email before logging in.'}, 401
            access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=10))
            return {'access_token': access_token}, 200
        return {'message': 'Invalid credentials'}, 401

class VerifyEmail(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        verification_code = data.get('verification_code')

        if not email or not verification_code:
            return {'error': 'Missing email or verification code'}, 400

        user = User.query.filter_by(email=email).first()

        if not user or user.verification_code != verification_code:
            return {'error': 'Invalid email or verification code'}, 401

        user.is_verified = True
        user.verification_code = None
        db.session.commit()

        return {'message': 'Email verified successfully'}, 200

api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(VerifyEmail, '/verify-email')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
