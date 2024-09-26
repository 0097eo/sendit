import { useState, useEffect, useCallback } from 'react';
import { Package, Search, PlusCircle, Edit, Trash2, Check, X } from 'lucide-react';

const Parcels = () => {
  const [parcels, setParcels] = useState([]);
  const [newParcel, setNewParcel] = useState({
    weight: '',
    pickup_location: '',
    destination: '',
  });
  const [searchParams, setSearchParams] = useState({
    status: '',
    pickup_location: '',
    destination: '',
    weight: '',
  });
  const [editingParcel, setEditingParcel] = useState(null);
  const [adminUpdate, setAdminUpdate] = useState({});

  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const fetchParcels = useCallback(async () => {
    try {
      const response = await fetch('/api/parcels', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setParcels(data);
      } else {
        console.error('Failed to fetch parcels');
      }
    } catch (error) {
      console.error('Error fetching parcels:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchParcels();
  }, [fetchParcels]);

  const handleCreateParcel = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/parcels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newParcel),
      });
      if (response.ok) {
        setNewParcel({ weight: '', pickup_location: '', destination: '' });
        fetchParcels();
      } else {
        console.error('Failed to create parcel');
      }
    } catch (error) {
      console.error('Error creating parcel:', error);
    }
  };

  const handleUpdateParcel = async (parcelId, updatedData) => {
    try {
      const response = await fetch(`/api/parcels/${parcelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        fetchParcels();
        setEditingParcel(null);
        setAdminUpdate({});
      } else {
        console.error('Failed to update parcel');
      }
    } catch (error) {
      console.error('Error updating parcel:', error);
    }
  };

  const handleDeleteParcel = async (parcelId) => {
    try {
      const response = await fetch(`/api/parcels/${parcelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchParcels();
      } else {
        console.error('Failed to delete parcel');
      }
    } catch (error) {
      console.error('Error deleting parcel:', error);
    }
  };

  const handleSearch = async () => {
    const queryParams = new URLSearchParams(searchParams).toString();
    try {
      const response = await fetch(`/api/parcels?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setParcels(data);
      } else {
        console.error('Failed to search parcels');
      }
    } catch (error) {
      console.error('Error searching parcels:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Package className="mr-2" /> Parcels
      </h1>
      
      {userType === 'customer' && (
        <form onSubmit={handleCreateParcel} className="mb-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <PlusCircle className="mr-2" /> Create New Parcel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Weight"
              value={newParcel.weight}
              onChange={(e) => setNewParcel({...newParcel, weight: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Pickup Location"
              value={newParcel.pickup_location}
              onChange={(e) => setNewParcel({...newParcel, pickup_location: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Destination"
              value={newParcel.destination}
              onChange={(e) => setNewParcel({...newParcel, destination: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center">
            <PlusCircle className="mr-2" /> Create Parcel
          </button>
        </form>
      )}

      <div className="mb-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Search className="mr-2" /> Search Parcels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Status"
            value={searchParams.status}
            onChange={(e) => setSearchParams({...searchParams, status: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Pickup Location"
            value={searchParams.pickup_location}
            onChange={(e) => setSearchParams({...searchParams, pickup_location: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Destination"
            value={searchParams.destination}
            onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Weight"
            value={searchParams.weight}
            onChange={(e) => setSearchParams({...searchParams, weight: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button onClick={handleSearch} className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center">
          <Search className="mr-2" /> Search
        </button>
      </div>

      <ul className="space-y-4">
        {parcels.map((parcel) => (
          <li key={parcel.id} className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg">Parcel #{parcel.id}</p>
                <p><strong>Weight:</strong> {parcel.weight}</p>
                <p><strong>Pickup:</strong> {parcel.pickup_location}</p>
                <p><strong>Destination:</strong> {parcel.destination}</p>
                <p><strong>Status:</strong> {parcel.status}</p>
              </div>
              {userType === 'customer' && parcel.status === 'Pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingParcel(parcel.id)}
                    className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition duration-300"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteParcel(parcel.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
            {userType === 'admin' && (
              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  placeholder="New Status"
                  onChange={(e) => setAdminUpdate({...adminUpdate, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="New Present Location"
                  onChange={(e) => setAdminUpdate({...adminUpdate, present_location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleUpdateParcel(parcel.id, adminUpdate)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                >
                  <Check className="mr-2" /> Update Parcel
                </button>
              </div>
            )}
            {editingParcel === parcel.id && (
              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  placeholder="New Destination"
                  defaultValue={parcel.destination}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id={`new-destination-${parcel.id}`}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdateParcel(parcel.id, { destination: document.getElementById(`new-destination-${parcel.id}`).value })}
                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 flex items-center"
                  >
                    <Check className="mr-2" /> Update
                  </button>
                  <button
                    onClick={() => setEditingParcel(null)}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300 flex items-center"
                  >
                    <X className="mr-2" /> Cancel
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Parcels;