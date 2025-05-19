import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedItems, setSelectedItems] = useState([]);
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
        setSelectedItems(selectedItems.filter(item => item !== id));
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const bulkRemoveProducts = async () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} products?`)) {
      try {
        for (const id of selectedItems) {
          await removeProduct(id);
        }
        toast.success(`${selectedItems.length} products deleted successfully`);
        setSelectedItems([]);
      } catch (error) {
        console.log(error);
        toast.error("Error deleting products");
      }
    }
  };

  const editProduct = (id) => {
    navigate(`/edit/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const applyFilters = () => {
    let filtered = [...list];
    
    // Apply text search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.name.toLowerCase().includes(term) || 
          (item.description && item.description.toLowerCase().includes(term))
      );
    }
    
    // Apply date filter
    if (dateFilter) {
      // Convert the selected date to start of day in user's timezone
      const selectedDate = new Date(dateFilter);
      selectedDate.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(item => {
        if (!item.WPdate) return false;
        
        // Convert item date to start of day in user's timezone
        const itemDate = new Date(item.WPdate);
        itemDate.setHours(0, 0, 0, 0);
        
        return itemDate.getTime() === selectedDate.getTime();
      });
    }
    
    // Apply sorting if configured
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle special cases
        if (sortConfig.key === 'price') {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        } else if (sortConfig.key === 'WPdate') {
          aValue = a.WPdate ? new Date(a.WPdate).getTime() : 0;
          bValue = b.WPdate ? new Date(b.WPdate).getTime() : 0;
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredList(filtered);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setFilteredList(list);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  const toggleItemSelection = (id) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(itemId => itemId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredList.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredList.map(item => item._id));
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Re-apply filters when list changes or filters/sorting changes
  useEffect(() => {
    applyFilters();
  }, [list, searchTerm, dateFilter, sortConfig]);

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white shadow-sm rounded-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
        <button 
          onClick={() => navigate('/add')} 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <span>+</span> Add New Product
        </button>
      </div>

      <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Text Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by product name or description..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Date Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="date"
              value={dateFilter}
              onChange={handleDateChange}
              className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {dateFilter && (
              <button 
                onClick={() => setDateFilter('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {filteredList.length} product{filteredList.length !== 1 ? 's' : ''}
            </span>
            
            {selectedItems.length > 0 && (
              <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                {selectedItems.length} selected
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <button 
                onClick={bulkRemoveProducts}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Selected
              </button>
            )}
            
            {(searchTerm || dateFilter) && (
              <button 
                onClick={clearFilters}
                className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500 mb-2"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : (
        <>
          {filteredList.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 font-medium">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 w-12">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.length === filteredList.length && filteredList.length > 0}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </th>
                      <th scope="col" className="px-4 py-3 w-24 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th 
                        scope="col" 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('name')}
                      >
                        Product Details {getSortIndicator('name')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('category')}
                      >
                        Category {getSortIndicator('category')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('price')}
                      >
                        Price {getSortIndicator('price')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('WPdate')}
                      >
                        Whatsapp Date {getSortIndicator('WPdate')}
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredList.map((item, index) => (
                      <tr key={index} className={selectedItems.includes(item._id) ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            checked={selectedItems.includes(item._id)}
                            onChange={() => toggleItemSelection(item._id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="h-14 w-14 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                            <img 
                              className="h-full w-full object-cover" 
                              src={item.image && item.image.length > 0 ? item.image[0] : '/placeholder.png'} 
                              alt={item.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-md">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                            {item.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                            {item.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          {currency}{item.price || '0'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(item.WPdate)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => editProduct(item._id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition duration-150"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this product?')) {
                                  removeProduct(item._id);
                                }
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition duration-150"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default List;