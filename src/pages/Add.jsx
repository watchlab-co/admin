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
  const [video, setVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const [productDate, setProductDate] = useState('');
  const [freeDelivery, setFreeDelivery] = useState(false);


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
    setVideo(false);
    setCategory('Men');
    setSubCategory('Branded');
    setBestseller(false);
    setColour([]);
    setStrapMaterial('Leather');
    setMovement('Quartz');
    setProductDate('');
    setFreeDelivery(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Basic validation
    if (!name || !description || !price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(discount) < parseFloat(price)) {
      toast.error('Discount cannot be greater than price');
      return;
    }


    const loadingToast = toast.loading('Adding product...');
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Basic product details
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discount", discount || 0); // Default to 0 if empty
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("colours", JSON.stringify(colours));
      formData.append("stock", stock);
      formData.append("freeDelivery", freeDelivery);
      formData.append("productDate", productDate || new Date().toISOString().split('T')[0]); // Default to today if empty

      // Watch specific details
      formData.append("strapMaterial", strapMaterial);
      formData.append("features", JSON.stringify(features));
      formData.append("movement", movement);

      // Images - only append if they exist
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      video && formData.append("video", video);

      console.log('====================================');
      console.log(formData);
      console.log('====================================');

      const response = await axios.post(backendUrl + '/api/product/add', formData, {
        headers: {
          token,
          'Content-Type': 'multipart/form-data'
        },
      });

      if (response.data.success) {
        toast.success(response.data.message, { id: loadingToast });
        resetForm();
      } else {
        toast.error(response.data.message, { id: loadingToast });
      }
    } catch (error) {
      console.error('Error adding product:', error);
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

  const colorOptions = [
    "Blue", "Green", "White", "Black", "Gold", "Brown", "Pink",
    "Dark Blue", "Red", "Silver", "Rose Gold", "Grey",
    "Dark Green", "Dark Red", "Orange", "Yellow", "Violet"
  ];
  const uploads = [
    { state: image1, setState: setImage1, id: "image1" },
    { state: image2, setState: setImage2, id: "image2" },
    { state: image3, setState: setImage3, id: "image3" },
    { state: image4, setState: setImage4, id: "image4" },
    { state: video, setState: setVideo, id: "video" },
  ];

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2 font-medium">Upload Image & Video</p>
        <div className="flex gap-3 flex-wrap">
          {uploads.map(({ state, setState, id }) => {
            const isVideo = id === "video";
            const previewUrl = state ? URL.createObjectURL(state) : assets.upload_area;

            return (
              <label
                key={id}
                htmlFor={id}
                className={`relative w-20 h-20 border-2 border-gray-300 rounded overflow-hidden shadow-sm flex items-center justify-center ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
              >
                {state ? (
                  isVideo ? (
                    <video
                      src={previewUrl}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt={`Preview ${id}`}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <img
                    src={assets.upload_area}
                    alt="Upload placeholder"
                    className="w-10 h-10 opacity-50"
                  />
                )}

                <input
                  type="file"
                  id={id}
                  hidden
                  disabled={isSubmitting}
                  accept={isVideo ? "video/*" : "image/*"}
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setState(e.target.files[0]);
                    }
                  }}
                />

                {/* Clear Button */}
                {state && !isSubmitting && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setState(null);
                    }}
                    className="absolute top-0 right-0 text-white bg-black bg-opacity-60 rounded-bl px-1 text-xs hover:bg-opacity-80"
                  >
                    ✕
                  </button>
                )}
              </label>
            );
          })}
        </div>
      </div>

      <div className="w-full">
        <label htmlFor="product-name" className="mb-2 block">Product Name *</label>
        <input
          id="product-name"
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
        <label htmlFor="product-description" className="mb-2 block">Product Description *</label>
        <textarea
          id="product-description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 border rounded"
          placeholder="Enter the product description"
          required
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-[500px]">
        <div>
          <label htmlFor="category" className="mb-2 block">Category *</label>
          <select
            id="category"
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
          <label htmlFor="brand" className="mb-2 block">Brand *</label>
          <select
            id="brand"
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
          <label htmlFor="movement" className="mb-2 block">Movement *</label>
          <select
            id="movement"
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
          <label htmlFor="price" className="mb-2 block">Price ($) *</label>
          <input
            id="price"
            onChange={(e) => setPrice(Math.max(0, e.target.value))}
            value={price}
            className="w-full px-3 py-2 border rounded"
            type="number"
            placeholder="250"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="discount" className="mb-2 block">Discount ($)</label>
          <input
            id="discount"
            onChange={(e) => setDiscount(Math.max(0, e.target.value))}
            value={discount}
            className="w-full px-3 py-2 border rounded"
            type="number"
            placeholder="10"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="stock" className="mb-2 block">Stock *</label>
          <select
            id="stock"
            onChange={(e) => setStock(e.target.value)}
            value={stock}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Yes">In Stock</option>
            <option value="No">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[500px]">
        <div>
          <label htmlFor="strap-material" className="mb-2 block">Strap Material *</label>
          <select
            id="strap-material"
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
        <div>
          <label htmlFor="free-delivery" className="mb-2 block">Free Delivery</label>
          <input
            type="checkbox"
            id="free-delivery"
            onChange={(e) => setFreeDelivery(e.target.checked)}
            checked={freeDelivery}
            className="mr-2"
          />
          <span>Enable free delivery for this product</span>
        </div>


      </div>

      <div className="w-full">
        <p className="mb-2">Watch Color</p>
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((colour) => (
            <button
              type="button"
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
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Features</p>
        <div className="flex flex-wrap gap-3">
          {watchFeatures.map((feature) => (
            <button
              type="button"
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
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2 items-center">
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