import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(backendUrl + '/api/product/list', { headers: { token } });
      if (response.data.success) {
        setList(response.data.products);
        setFilteredList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const editProduct = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredList(list);
    } else {
      const filtered = list.filter(
        item => 
          item.name.toLowerCase().includes(term) || 
          (item.description && item.description.toLowerCase().includes(term))
      );
      setFilteredList(filtered);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <button 
          onClick={() => navigate('/add')} 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Add New Product
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by product name or description..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {searchTerm && (
            <button 
              onClick={() => {setSearchTerm(''); setFilteredList(list);}}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              ✕
            </button>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {filteredList.length} product{filteredList.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          {filteredList.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 bg-gray-100 font-medium">
                <div>Image</div>
                <div>Product Details</div>
                <div>Category</div>
                <div>Price</div>
                <div className="text-center">Actions</div>
              </div>

              <div className="divide-y">
                {filteredList.map((item, index) => (
                  <div
                    className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-4 py-4 px-4 hover:bg-gray-50"
                    key={index}
                  >
                    <div className="flex justify-center md:justify-start">
                      <img 
                        className="w-16 h-16 object-cover rounded" 
                        src={item.image[0]} 
                        alt={item.name} 
                      />
                    </div>
                    
                    <div className="space-y-1 text-center md:text-left">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    
                    <div className="text-center md:text-left">
                      <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {item.category}
                      </span>
                    </div>
                    
                    <div className="text-center md:text-left font-medium">
                      {currency}{item.price}
                    </div>
                    
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => editProduct(item._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this product?')) {
                            removeProduct(item._id);
                          }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default List;