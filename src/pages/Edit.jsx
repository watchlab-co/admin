import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const Edit = ({ token }) => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        category: 'Men',
        subCategory: 'Branded',
        bestseller: false,
        sizes: [],
        stock: '',
        dialColor: '',
        strapMaterial: 'Leather',
        features: [],
        movement: 'Quartz'
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

    const watchFeatures = [
        'Chronograph', 'Date Display', 'Luminous Hands', 'Tachymeter',
        'Perpetual Calendar', 'Moon Phase', 'GMT', 'Skeleton Dial'
    ];

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${backendUrl}/api/product/update/${productId}`,
                product,
                {
                    headers: { 
                        token,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                navigate('/list');
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-[500px]">
                <div>
                    <p className="mb-2">Category</p>
                    <select 
                        value={product.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="unisex">Unisex</option>
                    </select>
                </div>

                <div>
                    <p className="mb-2">Brand</p>
                    <select 
                        value={product.subCategory}
                        onChange={(e) => setProduct({ ...product, subCategory: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="Branded">Branded</option>
                        <option value="Rolex">Rolex</option>
                        <option value="Casio">Casio</option>
                        <option value="Seiko">Seiko</option>
                        <option value="Fossil">Fossil</option>
                        <option value="Rado">Rado</option>
                        <option value="PatekPhilippe">Patek Philippe</option>
                        <option value="Cartier">Cartier</option>
                        <option value="Tissot">Tissot</option>
                        <option value="AudemarsPiguet">Audemars Piguet</option>
                        <option value="Omega">Omega</option>
                        <option value="Hublot">Hublot</option>
                    </select>
                </div>

                <div>
                    <p className="mb-2">Movement</p>
                    <select 
                        value={product.movement}
                        onChange={(e) => setProduct({ ...product, movement: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="Quartz">Quartz</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Solar">Solar</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-[500px]">
                <div>
                    <p className="mb-2">Price ($)</p>
                    <input 
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded"
                        type="number"
                        required
                    />
                </div>

                <div>
                    <p className="mb-2">Discount (%)</p>
                    <input 
                        value={product.discount}
                        onChange={(e) => setProduct({ ...product, discount: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        type="number"
                        placeholder="10"
                        min="0"
                        max="100"
                    />
                </div>

                <div>
                    <p className="mb-2">Stock</p>
                    <input 
                        value={product.stock}
                        onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        type="number"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[500px]">
                <div>
                    <p className="mb-2">Dial Color</p>
                    <input 
                        value={product.dialColor}
                        onChange={(e) => setProduct({ ...product, dialColor: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        type="text"
                        required
                    />
                </div>

                <div>
                    <p className="mb-2">Strap Material</p>
                    <select 
                        value={product.strapMaterial}
                        onChange={(e) => setProduct({ ...product, strapMaterial: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="Leather">Leather</option>
                        <option value="Metal">Metal</option>
                        <option value="Rubber">Rubber</option>
                        <option value="Fabric">Fabric</option>
                        <option value="Ceramic">Ceramic</option>
                    </select>
                </div>
            </div>

            <div>
                <p className="mb-2">Watch Sizes</p>
                <div className="flex flex-wrap gap-3">
                    {["38mm", "40mm", "42mm", "45mm"].map((size) => (
                        <div 
                            key={size}
                            onClick={() => setProduct(prev => ({
                                ...prev,
                                sizes: prev.sizes.includes(size)
                                    ? prev.sizes.filter(item => item !== size)
                                    : [...prev.sizes, size]
                            }))}
                            className={`${
                                product.sizes.includes(size) ? 'bg-pink-100' : 'bg-slate-200'
                            } px-3 py-1 cursor-pointer rounded`}
                        >
                            {size}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <p className="mb-2">Features</p>
                <div className="flex flex-wrap gap-3">
                    {watchFeatures.map((feature) => (
                        <div 
                            key={feature}
                            onClick={() => setProduct(prev => ({
                                ...prev,
                                features: prev.features.includes(feature)
                                    ? prev.features.filter(item => item !== feature)
                                    : [...prev.features, feature]
                            }))}
                            className={`${
                                product.features.includes(feature) ? 'bg-pink-100' : 'bg-slate-200'
                            } px-3 py-1 cursor-pointer rounded`}
                        >
                            {feature}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-2 mt-2">
                <input 
                    onChange={() => setProduct(prev => ({ ...prev, bestseller: !prev.bestseller }))}
                    checked={product.bestseller}
                    type="checkbox"
                    id="bestseller"
                    className="h-4 w-4"
                />
                <label className="cursor-pointer" htmlFor="bestseller">
                    Add to Bestseller
                </label>
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