import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { backendUrl } from '../App'
import axios from 'axios'

const Navbar = ({ setToken }) => {
  const token = localStorage.getItem('token')
  const [shop, setShop] = useState({})

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/shop/getShop', {
          headers: { token },
          params: { is_singleShop: true },
        });

        setShop(response.data)
      } catch (error) {
        console.error('Error fetching shop:', error);
      }
    };
    fetchShop();
  }, []);

  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      {/* Replace logo with shop name, or "WatchLab" if shop name is loading */}
      <p className='text-xl font-bold'>{shop.name || 'WatchLab'}</p>

      <button onClick={() => setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>
        Logout
      </button>
    </div>
  )
}

export default Navbar
