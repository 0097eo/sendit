import { useState, useEffect } from 'react';
import { Package, User, LogOut, DollarSign, Home } from 'lucide-react';
import Parcels from '../components/Parcels';
import Quotes from '../components/Quotes';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('parcels');
  const [adminName, setAdminName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await fetch('api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized. Please log in again.');
          }
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status}. ${errorText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned a non-JSON response.');
        }

        const data = await response.json();
        setAdminName(data.username || 'Admin User');
      } catch (err) {
        console.error('Error fetching admin name:', err.message);
        setError(err.message || 'Failed to load admin profile.');
      }
    };

    fetchAdminName();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    window.location.href = '/login';
  };

  const UserManagement = () => (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <p>User management functionality would go here.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <User size={24} className="text-blue-500" />
            <span className="font-semibold text-lg">{adminName}</span>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('parcels')}
              className={`w-full text-left py-2 px-4 rounded ${
                activeTab === 'parcels' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Package className="inline-block mr-2" size={18} />
              Parcels
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`w-full text-left py-2 px-4 rounded ${
                activeTab === 'quotes' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <DollarSign className="inline-block mr-2" size={18} />
              Quotes
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left py-2 px-4 rounded ${
                activeTab === 'users' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <User className="inline-block mr-2" size={18} />
              Users
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full text-left py-2 px-4 rounded hover:bg-gray-100"
            >
              <Home className="inline-block mr-2" size={18} />
              Home
            </button>
          </nav>
        </div>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 flex items-center justify-center"
          >
            <LogOut className="mr-2" size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {activeTab === 'parcels' && <Parcels />}
          {activeTab === 'quotes' && <Quotes />}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;