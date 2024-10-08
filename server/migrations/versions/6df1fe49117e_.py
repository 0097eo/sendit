"""empty message

Revision ID: 6df1fe49117e
Revises: 
Create Date: 2024-09-13 13:53:03.695558

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6df1fe49117e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('quotes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('weight_category', sa.String(length=50), nullable=False),
    sa.Column('price', sa.Float(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=20), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('_password', sa.String(length=128), nullable=False),
    sa.Column('is_admin', sa.Boolean(), nullable=True),
    sa.Column('is_verified', sa.Boolean(), nullable=True),
    sa.Column('verification_code', sa.String(length=6), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('admins',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['id'], ['users.id'], name=op.f('fk_admins_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('customers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['id'], ['users.id'], name=op.f('fk_customers_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('parcels',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('weight', sa.Float(), nullable=False),
    sa.Column('pickup_location', sa.String(length=255), nullable=False),
    sa.Column('pickup_latitude', sa.Float(), nullable=True),
    sa.Column('pickup_longitude', sa.Float(), nullable=True),
    sa.Column('destination', sa.String(length=255), nullable=False),
    sa.Column('destination_latitude', sa.Float(), nullable=True),
    sa.Column('destination_longitude', sa.Float(), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('present_location', sa.String(length=255), nullable=True),
    sa.Column('present_latitude', sa.Float(), nullable=True),
    sa.Column('present_longitude', sa.Float(), nullable=True),
    sa.Column('travel_distance', sa.Float(), nullable=True),
    sa.Column('journey_duration', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('customer_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], name=op.f('fk_parcels_customer_id_customers')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('notifications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('parcel_id', sa.Integer(), nullable=False),
    sa.Column('notification_type', sa.String(length=50), nullable=False),
    sa.Column('message', sa.Text(), nullable=False),
    sa.Column('is_read', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['parcel_id'], ['parcels.id'], name=op.f('fk_notifications_parcel_id_parcels')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_notifications_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('status_updates',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('parcel_id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=False),
    sa.Column('location', sa.String(length=255), nullable=True),
    sa.Column('latitude', sa.Float(), nullable=True),
    sa.Column('longitude', sa.Float(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['parcel_id'], ['parcels.id'], name=op.f('fk_status_updates_parcel_id_parcels')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('status_updates')
    op.drop_table('notifications')
    op.drop_table('parcels')
    op.drop_table('customers')
    op.drop_table('admins')
    op.drop_table('users')
    op.drop_table('quotes')
    # ### end Alembic commands ###
