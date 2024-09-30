import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Plane, Package, MapPin, Users, Check, X, Facebook, Twitter, Instagram } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const AboutPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Plane className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-gray-800">SendIt</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              {user ? (
                <button
                  onClick={logout}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* About Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            About SendIT
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            SendIT is a courier service that helps users deliver parcels to different destinations. We provide courier quotes based on weight categories.
          </p>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Our Features</h2>
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <Feature icon={<Package />} title="Create Parcel Orders">
              Users can create parcel delivery orders with ease.
            </Feature>
            <Feature icon={<MapPin />} title="Change Destination">
              Flexibility to change the destination of a parcel delivery order.
            </Feature>
            <Feature icon={<X />} title="Cancel Orders">
              Users can cancel a parcel delivery order when needed.
            </Feature>
            <Feature icon={<Check />} title="Order Details">
              View comprehensive details of each delivery order.
            </Feature>
          </dl>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Admin Features</h2>
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-1 md:gap-x-8 md:gap-y-10">
            <Feature icon={<Users />} title="Order Management">
              Admins can change the status and present location of parcel delivery orders.
            </Feature>
          </dl>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Future Enhancements</h2>
          <ul className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 space-y-2">
            <li>Integration with Google Maps for visual tracking</li>
            <li>Real-time email notifications for order updates</li>
            <li>Advanced route optimization</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" aria-hidden="true" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" aria-hidden="true" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 SendIt, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Feature = ({ icon, title, children }) => {
  return (
    <div className="relative">
      <dt>
        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
          {icon}
        </div>
        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{title}</p>
      </dt>
      <dd className="mt-2 ml-16 text-base text-gray-500">{children}</dd>
    </div>
  );
};

Feature.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AboutPage;