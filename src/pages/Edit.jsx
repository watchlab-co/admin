import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const Edit = ({ token }) => {
  const { productId } = useParams();
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('Branded');
  const [bestseller, setBestseller] = useState(false);
  const [colours, setColour] = useState([]);
  const [stock, setStock] = useState('Yes');
  const [strapMaterial, setStrapMaterial] = useState('Leather');
  const [features, setFeatures] = useState([]);
  const [movement, setMovement] = useState('Quartz');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/${productId}`, {
          headers: { token }
        });

        if (response.data.success) {
          const product = response.data.product;
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setDiscount(product.discount);
          setCategory(product.category);
          setSubCategory(product.subCategory);
          setBestseller(product.bestseller);
          setColour(product.colours);
          setStock(product.stock);
          setStrapMaterial(product.strapMaterial);
          setFeatures(product.features);
          setMovement(product.movement);
        }
      } catch (error) {
        toast.error('Failed to fetch product details');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, token]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const loadingToast = toast.loading('Updating product...');
    setIsSubmitting(true);

    try {
      const productData = {
        name,
        description,
        price,
        discount,
        category,
        subCategory,
        bestseller,
        colours,
        stock,
        strapMaterial,
        features,
        movement
      };

      const response = await axios.put(
        `${backendUrl}/api/product/update/${productId}`,
        productData,
        {
          headers: { token }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message, { id: loadingToast });
        navigate("/list")
      } else {
        toast.error(response.data.message, { id: loadingToast });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 'Failed to update product. Please try again.',
        { id: loadingToast }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchFeatures = [
    'Chronograph', 'Date Display', 'Luminous Hands', 'Tachymeter',
    'Perpetual Calendar', 'Moon Phase', 'GMT', 'Skeleton Dial'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          type="text"
          placeholder="Enter the product name"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 border rounded"
          placeholder="Enter the product description"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-[500px]">
        <div>
          <p className="mb-2">Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="unisex">Unisex</option>
            <option value="Couple">Couple</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Brand</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
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
            <option value="Daniel-wellington">Danil Wellington</option>
            <option value="Fastrack">Fastrack</option>
            <option value="Versace">Versace</option>
            <option value="Citizen">Citizen</option>
            <option value="Omega">Omega</option>
            <option value="Apple">Apple</option>
            <option value="Richard-mille">Richars Mille</option>
            <option value="Gucci">GUCCI</option>
            <option value="Franck-muller">Franck Muller</option>
            <option value="Vacheron-constantin">Vacheron Constantin</option>
            <option value="Burberry">Burberry</option>
            <option value="Bvlgari">Bvlgari</option>
            <option value="Invicta">Invicta</option>
            <option value="Calvin-klein-ck">Calvin Klvin (CK)</option>
            <option value="Christian-dior">Christian Dior</option>
            <option value="Chanel">Chanel</option>
            <option value="Guess">Guess</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Movement</p>
          <select
            onChange={(e) => setMovement(e.target.value)}
            value={movement}
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
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 border rounded"
            type="number"
            placeholder="250"
            required
          />
        </div>

        <div>
          <p className="mb-2">Discount (Fake Price)</p>
          <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            className="w-full px-3 py-2 border rounded"
            type="number"
            placeholder="10"
            min="0"
          />
        </div>

        <div>
          <p className="mb-2">Stock</p>
          <select
            onChange={(e) => setStock(e.target.value)}
            value={stock}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[500px]">
        <div>
          <p className="mb-2">Strap Material</p>
          <select
            onChange={(e) => setStrapMaterial(e.target.value)}
            value={strapMaterial}
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
        <p className="mb-2">Watch Color</p>
        <div className="flex flex-wrap gap-3">
          {["Blue", "Green", "White", "Black", "Gold", "Brown", "Dark Blue", "Red", "Silver", "Rose Gold", "Grey", "Dark Green", "Dark Red", "Orange", "Yellow", "Violet"].map((colour) => (
            <div
              key={colour}
              onClick={() => setColour(prev =>
                prev.includes(colour)
                  ? prev.filter(item => item !== colour)
                  : [...prev, colour]
              )}
              className={`${colours.includes(colour) ? 'bg-pink-100' : 'bg-slate-200'
                } px-3 py-1 cursor-pointer rounded`}
            >
              {colour}
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
              onClick={() => setFeatures(prev =>
                prev.includes(feature)
                  ? prev.filter(item => item !== feature)
                  : [...prev, feature]
              )}
              className={`${features.includes(feature) ? 'bg-pink-100' : 'bg-slate-200'
                } px-3 py-1 cursor-pointer rounded`}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller(prev => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
          className="w-4 h-4"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to Bestseller
        </label>
      </div>

      <button
        className={`w-28 py-3 mt-4 bg-black text-white rounded transition-colors flex items-center justify-center gap-2
          ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'}`}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </>
        ) : (
          'Update'
        )}
      </button>
    </form>
  );
};

export default Edit;