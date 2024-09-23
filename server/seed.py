from faker import Faker
from sqlalchemy.exc import IntegrityError
from models import db, User, Admin, Customer, Parcel, ParcelStatusUpdate, Quote, Notification
from app import app
import random

fake = Faker()

def clear_data():
    with app.app_context():
        # Drop all tables
        db.drop_all()
        # Recreate all tables
        db.create_all()
        print("All data cleared from the database.")

def seed_database():
    with app.app_context():
        # Create Admins
        print('Creating Admins...')
        for _ in range(3):
            admin = Admin(
                username=fake.user_name(),
                email=fake.email(),
                password='admin',
                is_verified=True
            )
            db.session.add(admin)

        # Create Customers
        print("Creating Customers...")
        customers = []
        for _ in range(20):
            customer = Customer(
                username=fake.unique.user_name(),
                email=fake.email(),
                password=fake.password(),
                is_verified=True
            )
            db.session.add(customer)
            customers.append(customer)

        # Create Quotes
        print("Creating Quotes...")
        weight_categories = ['Light', 'Medium', 'Heavy', 'Extra Heavy']
        for category in weight_categories:
            quote = Quote(
                weight_category=category,
                price=round(random.uniform(10, 100), 2)
            )
            db.session.add(quote)

        db.session.commit()

        # Create Parcels
        print("Creating Parcels...")
        parcels = []
        statuses = ['Pending', 'In Transit', 'Delivered']
        for _ in range(50):
            customer = random.choice(customers)
            parcel = Parcel(
                weight=round(random.uniform(0.1, 50), 2),
                pickup_location=fake.address(),
                destination=fake.address(),
                status=random.choice(statuses),
                present_location=fake.address(),
                customer_id=customer.id
            )
            db.session.add(parcel)
            parcels.append(parcel)

        db.session.commit()

        # Create ParcelStatusUpdates and Notifications
        print("Updating Parcel Status and Sending Notifications...")
        for parcel in parcels:
            # Create ParcelStatusUpdates
            for _ in range(random.randint(1, 5)):
                status_update = ParcelStatusUpdate(
                    parcel_id=parcel.id,
                    status=random.choice(statuses),
                    location=fake.address(),
                    latitude=fake.latitude(),
                    longitude=fake.longitude()
                )
                db.session.add(status_update)

            # Create Notifications
            notification = Notification(
                user_id=parcel.customer_id,
                parcel_id=parcel.id,
                notification_type='Status Update',
                message=f'Your parcel status has been updated to {parcel.status}.',
                is_read=random.choice([True, False])
            )
            db.session.add(notification)

        db.session.commit()

if __name__ == '__main__':
    clear_data()
    seed_database()
    print("Database seeded successfully!")