import { useState, useEffect } from 'react';
import { Package, User, LogOut, Home, Banknote } from 'lucide-react';
import Parcels from '../components/Parcels';
import Quotes from '../components/Quotes';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('parcels');
  const [customerName, setCustomerName] = useState('Loading...');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
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
          } else {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status}. ${errorText.slice(0, 100)}...`);
          }
        }
  
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned a non-JSON response.");
        }
  
        const data = await response.json();

        setCustomerName(data.username || 'Unknown');
      } catch (err) {
        setError(err.message || 'Failed to load profile.');
        setCustomerName('Guest'); 
      }
    };
  
    fetchProfile();
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <User size={24} className="text-blue-500" />
            <span className="font-semibold text-lg">{customerName}</span> {/* Display the fetched username */}
          </div>
          <nav>
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
              <Banknote className="inline-block mr-2" size={18} />
              Quotes
            </button>
            {/* New Home Button */}
            <button
              onClick={() => window.location.href = '/'}  // Redirect to home page
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
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
