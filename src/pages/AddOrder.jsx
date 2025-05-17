import { useState } from 'react';
import { ShoppingBag, Instagram, CreditCard, User, MapPin, Package, ArrowRight, Check } from 'lucide-react';

export default function AddOrderForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Customer Info
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        
        // Address
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India', // Default
        
        // Order Info
        orderNotes: '',
        instagramUsername: '',
        leadSource: 'instagram', // Default value
        priority: 'normal',
        
        // Payment
        paymentMethod: '',
        paymentRefId: '',
        paymentStatus: 'pending',
        
        // Admin
        addedBy: '',
    });

    const [responseOrderId, setResponseOrderId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 800));
            const mockResponse = { _id: 'ORD' + Math.floor(10000 + Math.random() * 90000) };
            setResponseOrderId(mockResponse._id);
            
            // Reset form and go to first step
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'India',
                orderNotes: '',
                instagramUsername: '',
                leadSource: 'instagram',
                priority: 'normal',
                paymentMethod: '',
                paymentRefId: '',
                paymentStatus: 'pending',
                addedBy: '',
            });
            setStep(1);
        } catch (err) {
            console.error(err);
            alert('Failed to submit order');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Form progress bar
    const Progress = () => (
        <div className="w-full mb-6">
            <div className="flex justify-between mb-2">
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                        <User size={16} />
                    </div>
                    <span className="ml-2 text-sm font-medium">Customer</span>
                </div>
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                        <MapPin size={16} />
                    </div>
                    <span className="ml-2 text-sm font-medium">Address</span>
                </div>
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                        <Package size={16} />
                    </div>
                    <span className="ml-2 text-sm font-medium">Order</span>
                </div>
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                        <CreditCard size={16} />
                    </div>
                    <span className="ml-2 text-sm font-medium">Payment</span>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${(step / 4) * 100}%` }}
                ></div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">New Order</h2>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                    <ShoppingBag size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Admin Panel</span>
                </div>
            </div>

            {responseOrderId && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                        <Check size={20} className="text-green-600" />
                    </div>
                    <div>
                        <h3 className="font-medium">Order Created Successfully!</h3>
                        <p className="text-sm">Order ID: <span className="font-mono font-bold">{responseOrderId}</span></p>
                    </div>
                </div>
            )}

            <Progress />

            <form onSubmit={handleSubmit}>
                {/* Step 1: Customer Information */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4 text-blue-600 border-b pb-2">
                            <User size={18} />
                            <h3 className="font-medium">Customer Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-md">
                                    <Instagram size={18} className="text-pink-600" />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Username</label>
                                        <input
                                            type="text"
                                            name="instagramUsername"
                                            value={formData.instagramUsername}
                                            onChange={handleChange}
                                            placeholder="@username"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Next <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Address Information */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4 text-blue-600 border-b pb-2">
                            <MapPin size={18} />
                            <h3 className="font-medium">Delivery Address</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address*</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code*</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="India">India</option>
                                    <option value="UAE">UAE</option>
                                    <option value="Saudi Arabia">Saudi Arabia</option>
                                    <option value="Qatar">Qatar</option>
                                    <option value="Kuwait">Kuwait</option>
                                    <option value="Oman">Oman</option>
                                    <option value="Bahrain">Bahrain</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Next <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Order Details */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4 text-blue-600 border-b pb-2">
                            <Package size={18} />
                            <h3 className="font-medium">Order Details</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source*</label>
                                <select
                                    name="leadSource"
                                    value={formData.leadSource}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="instagram">Instagram</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="website">Website</option>
                                    <option value="direct">Direct</option>
                                    <option value="referral">Referral</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="high">High Priority</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes</label>
                                <textarea
                                    name="orderNotes"
                                    value={formData.orderNotes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Special instructions or requirements"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Added By*</label>
                                <select
                                    name="addedBy"
                                    value={formData.addedBy}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="">Select Person</option>
                                    <option value="shamil">Shamil</option>
                                    <option value="midlaj">Midlaj</option>
                                    <option value="mugthar">Mugthar</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Next <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Payment Information */}
                {step === 4 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4 text-blue-600 border-b pb-2">
                            <CreditCard size={18} />
                            <h3 className="font-medium">Payment Details</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method*</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="">Select Method</option>
                                    <option value="COD">Cash on Delivery</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Prepaid">Prepaid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reference ID</label>
                                <input
                                    type="text"
                                    name="paymentRefId"
                                    value={formData.paymentRefId}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Transaction ID / Reference Number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                                <select
                                    name="paymentStatus"
                                    value={formData.paymentStatus}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center gap-2 px-5 py-2 rounded-md text-white 
                                ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
                                focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                {isSubmitting ? 'Processing...' : 'Create Order'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}