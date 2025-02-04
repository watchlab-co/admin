import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Edit = ({ token }) => {
    const navigate = useNavigate()
    const { productId } = useParams();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        subCategory: '',
        bestseller: false,
        sizes: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/product/${productId}`);
                if (response.data.success) {
                    setProduct(response.data.product);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error('Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            // Send data directly as JSON instead of FormData
            const response = await axios.put(
                `${backendUrl}/api/product/update/${productId}`,
                product,  // Send the product object directly
                {
                    headers: { 
                        token,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                navigate('/list')
                toast.success(response.data.message);
                
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Update Error:', error);
            toast.error('Update failed');
        }
    };

    if (loading) return <div className="w-full text-center py-4">Loading...</div>;

    return (
        <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
            <div className="w-full">
                <p className="mb-2">Product Name</p>
                <input
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    className="w-full max-w-[500px] px-3 py-2 border rounded"
                    type="text"
                    required
                />
            </div>

            <div className="w-full">
                <p className="mb-2">Product Description</p>
                <textarea
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    className="w-full max-w-[500px] px-3 py-2 border rounded"
                    required
                />
            </div>

            <div>
                <p className="mb-2">Product Price</p>
                <input
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded"
                    type="number"
                    required
                />
            </div>

            <div className="flex gap-2 mt-2">
                <input
                    onChange={() => setProduct(prev => ({ ...prev, bestseller: !prev.bestseller }))}
                    checked={product.bestseller}
                    type="checkbox"
                    id="bestseller"
                    className="h-4 w-4"
                />
                <label htmlFor="bestseller">Add to Bestseller</label>
            </div>

            <button 
                className="w-28 py-3 mt-4 bg-black text-white rounded hover:bg-gray-800 transition-colors" 
                type="submit"
            >
                Update Product
            </button>
        </form>
    );
};

export default Edit;