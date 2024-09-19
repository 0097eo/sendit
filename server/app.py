from flask import request, jsonify
from flask_restful import Resource
from config import app, api, db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, Customer, Parcel, Quote, Admin
from email.mime.text import MIMEText
import smtplib
import secrets
from datetime import timedelta
from sqlalchemy.orm import Session

# Email functions
def send_email(recipient, subject, body):
    sender = 'emmanuelokello294@gmail.com'
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.starttls()
            smtp.login('emmanuelokello294@gmail.com', 'quzo ygrw gcse maim')
            smtp.send_message(msg)
    except Exception as e:
        print(f"Error sending email: {e}")
        raise e

def send_verification_email(email, verification_code):
    subject = 'SENDIT - Verify your email'
    body = f'Your verification code is: {verification_code}'
    send_email(email, subject, body)

def send_status_update_email(email, parcel_id, new_status):
    subject = 'SENDIT - Parcel Status Update'
    body = f'Your parcel (ID: {parcel_id}) status has been updated to: {new_status}'
    send_email(email, subject, body)

def send_location_update_email(email, parcel_id, new_location):
    subject = 'SENDIT - Parcel Location Update'
    body = f'Your parcel (ID: {parcel_id}) has been moved to a new location: {new_location}'
    send_email(email, subject, body)



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
    
class ParcelResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        current_user_id = get_jwt_identity()
        new_parcel = Parcel(
            weight=data['weight'],
            pickup_location=data['pickup_location'],
            destination=data['destination'],
            customer_id=current_user_id
        )
        db.session.add(new_parcel)
        db.session.commit()
        return {'message': 'Parcel created successfully', 'parcel_id': new_parcel.id}, 201
    
    @jwt_required()
    def get(self, parcel_id=None):
        current_user_id = get_jwt_identity()
        user = db.session.get(User, current_user_id)


        if parcel_id:
            parcel = db.session.get(Parcel, parcel_id)
            if not parcel or (parcel.customer_id != current_user_id and not user.is_admin):
                return {'message': 'Parcel not found or access denied'}, 404

            return {
                'id': parcel.id,
                'weight': parcel.weight,
                'pickup_location': parcel.pickup_location,
                'pickup_latitude': parcel.pickup_latitude,
                'pickup_longitude': parcel.pickup_longitude,
                'destination': parcel.destination,
                'destination_latitude': parcel.destination_latitude,
                'destination_longitude': parcel.destination_longitude,
                'status': parcel.status,
                'present_location': parcel.present_location,
                'present_latitude': parcel.present_latitude,
                'present_longitude': parcel.present_longitude,
                'travel_distance': parcel.travel_distance,
                'journey_duration': parcel.journey_duration,
                'customer_id': parcel.customer_id,
                'created_at': parcel.created_at.strftime('%Y-%m-%d'),
                'updated_at': parcel.updated_at.strftime('%Y-%m-%d') if parcel.updated_at else None
            }, 200

        else:
            # Search parameters: status, pickup_location, destination, weight
            status = request.args.get('status')
            pickup_location = request.args.get('pickup_location')
            destination = request.args.get('destination')
            weight = request.args.get('weight')

            # Build query
            query = Parcel.query
            if not user.is_admin:
                query = query.filter_by(customer_id=current_user_id)

            if status:
                query = query.filter(Parcel.status.ilike(f'%{status}%'))
            if pickup_location:
                query = query.filter(Parcel.pickup_location.ilike(f'%{pickup_location}%'))
            if destination:
                query = query.filter(Parcel.destination.ilike(f'%{destination}%'))
            if weight:
                query = query.filter(Parcel.weight.ilike(f'%{weight}%'))

            parcels = query.all()

            # Return selected fields for each parcel
            return [
                {
                    'id': parcel.id,
                    'weight': parcel.weight,
                    'pickup_location': parcel.pickup_location,
                    'destination': parcel.destination,
                    'status': parcel.status,
                    'travel_distance': parcel.travel_distance,
                    'customer_id': parcel.customer_id
                } for parcel in parcels
            ], 200
        
    @jwt_required()
    def put(self, parcel_id):
        data = request.get_json()
        current_user_id = get_jwt_identity()
        parcel = db.session.get(Parcel, parcel_id)

        if not parcel or parcel.customer_id != current_user_id:
            return {'message': 'Parcel not found or unauthorized'}, 404

        if not parcel.can_modify():
            return {'message': 'Parcel cannot be modified'}, 400

        parcel.destination = data.get('destination', parcel.destination)
        db.session.commit()
        return {'message': 'Parcel updated successfully'}
    
    @jwt_required()
    def delete(self, parcel_id):
        current_user_id = get_jwt_identity()
        parcel = db.session.get(Parcel, parcel_id)

        if not parcel or parcel.customer_id!= current_user_id:
            return {'message': 'Parcel not found or unauthorized'}, 404

        if not parcel.can_modify():
            return {'message': 'Parcel cannot be deleted'}, 400

        db.session.delete(parcel)
        db.session.commit()
        return {'message': 'Parcel deleted successfully'}
    
class QuoteResource(Resource):
    def get(self, quote_id=None):
        if quote_id:
            quote = db.session.get(Quote, quote_id)
            if quote:
                return {
                    'id': quote.id,
                    'weight_category': quote.weight_category,
                    'price': quote.price,
                    'created_at': quote.created_at.isoformat() if quote.created_at else None,
                    'updated_at': quote.updated_at.isoformat() if quote.updated_at else None
                }, 200
            return {'message': 'Quote not found'}, 404
        
        quotes = Quote.query.all()
        return [
            {
                'id': quote.id,
                'weight_category': quote.weight_category,
                'price': quote.price,
                'created_at': quote.created_at.isoformat() if quote.created_at else None,
                'updated_at': quote.updated_at.isoformat() if quote.updated_at else None
            } for quote in quotes
        ], 200

    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        admin = db.session.get(Admin, current_user_id)
        if not admin:
            return {'message': 'Unauthorized'}, 403

        data = request.get_json()
        new_quote = Quote(
            weight_category=data.get('weight_category'),
            price=data.get('price')
        )
        db.session.add(new_quote)
        db.session.commit()

        return {'message': 'Quote added successfully'}, 201
    
    @jwt_required()
    def put(self, quote_id):
        current_user_id = get_jwt_identity()
        admin = db.session.get(Admin, current_user_id)
        if not admin:
            return {'message': 'Unauthorized'}, 403

        quote = db.session.get(Quote, quote_id)
        if not quote:
            return {'message': 'Quote not found'}, 404

        data = request.get_json()
        quote.weight_category = data.get('weight_category', quote.weight_category)
        quote.price = data.get('price', quote.price)
        db.session.commit()
        return {'message': 'Quote updated successfully'}, 200

    @jwt_required()
    def delete(self, quote_id):
        current_user_id = get_jwt_identity()
        admin = db.session.get(Admin, current_user_id)
        if not admin:
            return {'message': 'Unauthorized'}, 403

        quote = db.session.get(Quote, quote_id)
        if not quote:
            return {'message': 'Quote not found'}, 404

        db.session.delete(quote)
        db.session.commit()
        return {'message': 'Quote deleted successfully'}, 200



api.add_resource(ParcelResource, '/parcels', '/parcels/<int:parcel_id>')
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(VerifyEmail, '/verify-email')
api.add_resource(QuoteResource, '/quotes', '/quotes/<int:quote_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)