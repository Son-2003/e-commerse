import { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';

const PlaceOrder = () => {
  const [method, setMethod] = useState("");
  const {navigate} = useContext(ShopContext);
 
  return (
    <div className='flex flex-col justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      {/* Left Side */}
      <div className='flex flex-col mb-10 gap-4 w-full md:w-full'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={"DELIVERY"} text2={"INFORMATION"}/>
        </div>
        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name'/>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name'/>
        </div>
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Email address'/>
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street'/>
        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City'/>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State'/>
        </div>
        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Zipcode'/>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country'/>
        </div>
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Phone'/>
      </div>

      {/* Right Side */}
      <div className='flex flex-col gap-4 w-full sm:w-full'>
        <CartTotal/>

        <div className='mt-2'>
          <Title text1={"PAYMENT"} text2={"METHOD"}/>
          {/* Payment Method Selection */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod("stripe")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded ${method == 'stripe' ? "bg-green-400" : ""}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod("razorpay")} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded ${method == 'razorpay' ? "bg-green-400" : ""}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={() => setMethod("cod")} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded ${method == 'cod' ? "bg-green-400" : ""}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
        </div>

        <div className='w-full text-end mt-8'>
          <button onClick={() => navigate('/order')} className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
        </div>

      </div>
    </div>
  )
}

export default PlaceOrder