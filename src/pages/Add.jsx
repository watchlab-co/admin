import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('Branded');
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState('Yes');
  const [strapMaterial, setStrapMaterial] = useState('Leather');
  const [features, setFeatures] = useState([]);
  const [movement, setMovement] = useState('Quartz');

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setDiscount('');
    setStock('Yes');
    setFeatures([]);
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    setCategory('Men');
    setSubCategory('Branded');
    setBestseller(false);
    setSizes([]);
    setStrapMaterial('Leather');
    setMovement('Quartz');
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const loadingToast = toast.loading('Adding product...');
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Basic product details
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("stock", stock);

      // Watch specific details
      formData.append("strapMaterial", strapMaterial);
      formData.append("features", JSON.stringify(features));
      formData.append("movement", movement);

      // Images
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(backendUrl + '/api/product/add', formData, {
        headers: { token },
        timeout: 30000 // 30 second timeout
      });

      if (response.data.success) {
        toast.success(response.data.message, { id: loadingToast });
        resetForm();
      } else {
        toast.error(response.data.message, { id: loadingToast });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 'Failed to add product. Please try again.',
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


  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[
            { state: image1, setState: setImage1, id: "image1" },
            { state: image2, setState: setImage2, id: "image2" },
            { state: image3, setState: setImage3, id: "image3" },
            { state: image4, setState: setImage4, id: "image4" }
          ].map(({ state, setState, id }) => (
            <label
              key={id}
              htmlFor={id}
              className={`relative ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <img
                className="w-20 h-20 object-cover border-2 border-gray-200"
                src={!state ? assets.upload_area : URL.createObjectURL(state)}
                alt=""
              />
              <input
                onChange={(e) => setState(e.target.files[0])}
                type="file"
                id={id}
                hidden
                disabled={isSubmitting}
              />
            </label>
          ))}
        </div>
      </div>

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
          <p className="mb-2">Discount (Fake Price )</p>
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
            onChange={(e) => setMovement(e.target.value)}
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
        <p className="mb-2">Watch Sizes</p>
        <div className="flex flex-wrap gap-3">
          {["38mm", "40mm", "42mm", "45mm"].map((size) => (
            <div
              key={size}
              onClick={() => setSizes(prev =>
                prev.includes(size)
                  ? prev.filter(item => item !== size)
                  : [...prev, size]
              )}
              className={`${sizes.includes(size) ? 'bg-pink-100' : 'bg-slate-200'
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
            Adding...
          </>
        ) : (
          'Add Product'
        )}
      </button>
    </form>
  );
};

export default Add;