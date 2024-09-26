import { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Edit2, Trash2, Package, Save, Banknote } from 'lucide-react';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState({
    weight_category: '',
    price: '',
  });
  const [editingQuote, setEditingQuote] = useState(null);
  const [editForm, setEditForm] = useState({
    weight_category: '',
    price: '',
  });

  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const fetchQuotes = useCallback(async () => {
    try {
      const response = await fetch('/api/quotes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      } else {
        console.error('Failed to fetch quotes');
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleCreateQuote = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newQuote),
      });
      if (response.ok) {
        setNewQuote({ weight_category: '', price: '' });
        fetchQuotes();
      } else {
        console.error('Failed to create quote');
      }
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  const handleUpdateQuote = async (quoteId) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        setEditingQuote(null);
        setEditForm({ weight_category: '', price: '' });
        fetchQuotes();
      } else {
        console.error('Failed to update quote');
      }
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchQuotes();
      } else {
        console.error('Failed to delete quote');
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  const startEditing = (quote) => {
    setEditingQuote(quote.id);
    setEditForm({ weight_category: quote.weight_category, price: quote.price });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Quotes</h1>
      
      {userType === 'admin' && (
        <form onSubmit={handleCreateQuote} className="mb-8">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Weight Category"
              value={newQuote.weight_category}
              onChange={(e) => setNewQuote({...newQuote, weight_category: e.target.value})}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={newQuote.price}
              onChange={(e) => setNewQuote({...newQuote, price: e.target.value})}
              className="flex-1 p-2 border rounded"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded flex items-center">
              <PlusCircle className="mr-2" size={18} />
              Create Quote
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-4">
        {quotes.map((quote) => (
          <li key={quote.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package size={18} className="text-gray-500" />
                <span className="font-semibold">{quote.weight_category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Banknote size={18} className="text-green-500" />
                <span className="font-semibold">{quote.price}</span>
              </div>
            </div>
            {userType === 'admin' && (
              <div className="mt-4">
                {editingQuote === quote.id ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editForm.weight_category}
                      onChange={(e) => setEditForm({...editForm, weight_category: e.target.value})}
                      className="flex-1 p-2 border rounded"
                    />
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      className="flex-1 p-2 border rounded"
                    />
                    <button 
                      onClick={() => handleUpdateQuote(quote.id)}
                      className="bg-green-500 text-white p-2 rounded flex items-center"
                    >
                      <Save size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => startEditing(quote)}
                      className="bg-yellow-500 text-white p-2 rounded flex items-center"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteQuote(quote.id)}
                      className="bg-red-500 text-white p-2 rounded flex items-center"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quotes;