import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchAllorders = async () => {
    if (!token) {
      return null
    }

    setLoading(true)
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Order status updated successfully')
        await fetchAllorders()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Function to navigate to product details page
  const handleProductClick = (productId) => {
      window.location.href = `https://www.watchlab.in/product/${productId}`;
  }

  useEffect(() => {
    fetchAllorders()
  }, [token])

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-800'
      case 'Packing':
        return 'bg-purple-100 text-purple-800'
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800'
      case 'Out for delivery':
        return 'bg-amber-100 text-amber-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Order Management</h3>
        <button 
          onClick={fetchAllorders} 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Order header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">Order #{order._id.slice(-6)}</span>
                  <span className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${order.payment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <div className={`w-2 h-2 rounded-full mr-1.5 ${order.payment ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {order.payment ? 'Payment Complete' : 'Payment Pending'}
                  </div>
                  <span className="font-semibold text-gray-900">{currency} {order.amount}</span>
                </div>
              </div>

              {/* Order content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left column: Items */}
                  <div className="col-span-1">
                    <h4 className="font-medium text-sm text-gray-500 mb-3">ORDER ITEMS</h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                          onClick={() => handleProductClick(item._id)}
                        >
                          <div className="h-12 w-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                            {item.image && item.image[0] && (
                              <img className="h-full w-full object-cover" src={item.image[0]} alt={item.name} />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-600 hover:underline">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Middle column: Customer details */}
                  <div className="col-span-1">
                    <h4 className="font-medium text-sm text-gray-500 mb-3">CUSTOMER DETAILS</h4>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
                      <p>{order.address.street}</p>
                      <p>{order.address.city}, {order.address.state}</p>
                      <p>{order.address.country}, {order.address.zipcode}</p>
                      <p className="pt-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {order.address.phone}
                      </p>
                    </div>
                  </div>

                  {/* Right column: Status and payment */}
                  <div className="col-span-1">
                    <h4 className="font-medium text-sm text-gray-500 mb-3">ORDER STATUS</h4>
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Payment Method:</span>
                          <span className="text-sm text-gray-600">{order.paymentMethod}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Items:</span>
                          <span className="text-sm text-gray-600">{order.items.length}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor={`status-${order._id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <div className="relative">
                          <select
                            id={`status-${order._id}`}
                            onChange={(event) => statusHandler(event, order._id)}
                            value={order.status}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Packing">Packing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-2 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders