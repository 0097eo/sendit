from config import bcrypt, db
from sqlalchemy import func

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    _password = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=False)
    verification_code = db.Column(db.String(6))
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())

    @property
    def password(self):
        return self._password
    
    @password.setter
    def password(self, password):
        self._password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self._password, password)

class Admin(User):
    __tablename__ = 'admins'

    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)

    __mapper_args__ = {
        'polymorphic_identity': 'admin',
    }

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.is_admin = True

class Customer(User):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)

    __mapper_args__ = {
        'polymorphic_identity': 'customer',
    }

class Parcel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    weight = db.Column(db.Float, nullable=False)
    pickup_location = db.Column(db.String(255), nullable=False)
    pickup_latitude = db.Column(db.Float)
    pickup_longitude = db.Column(db.Float)
    destination = db.Column(db.String(255), nullable=False)
    destination_latitude = db.Column(db.Float)
    destination_longitude = db.Column(db.Float)
    status = db.Column(db.String(50), default='Pending')
    present_location = db.Column(db.String(255))
    present_latitude = db.Column(db.Float)
    present_longitude = db.Column(db.Float)
    travel_distance = db.Column(db.Float)  # in kilometers
    journey_duration = db.Column(db.Integer)  # in minutes
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    customer = db.relationship('Customer', backref=db.backref('parcels', lazy=True))

    def can_modify(self):
        return self.status != 'Delivered'

class ParcelStatusUpdate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parcel_id = db.Column(db.Integer, db.ForeignKey('parcel.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    updated_at = db.Column(db.DateTime, default=func.now())

    parcel = db.relationship('Parcel', backref=db.backref('status_updates', lazy=True))

class Quote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    weight_category = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    parcel_id = db.Column(db.Integer, db.ForeignKey('parcel.id'), nullable=False)
    notification_type = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=func.now())

    user = db.relationship('User', backref=db.backref('notifications', lazy=True))
    parcel = db.relationship('Parcel', backref=db.backref('notifications', lazy=True))