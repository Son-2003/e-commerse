import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
    const[visible, setVisible] = useState(false);
    const {search, setSearch, getCartCount} = useContext(ShopContext);



  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] sticky top-0 bg-white z-50'>
        <div className='flex items-center justify-between py-5 font-medium'>
            <div className='flex w-1/3'>
                <img src={assets.search_icon} className='w-5 mr-2' alt="search-icon" value={search} onChange={(e) => setSearch(e.target.value)}/>
                <input type="text" placeholder='Search' className='pl-2  outline-none'/>
            </div>
            <div className='w-1/3 flex justify-center'>
                <Link to={'/'}>
                {/* <img src={assets.logo} alt="logo" className='w-36' /> */}
                    <p className='text-center text-3xl sm:text-6xl w-60 font-gallisia'>Mei Ling</p>
                </Link>
            </div>

                
                
            <div className='flex items-center gap-6 w-1/3 justify-end'>
                    <Link to='/cart' className='relative'>
                        <img src={assets.cart_icon} alt="cart-icon" className='w-5 min-w-5 cursor-pointer'/>
                        <p className='absolute right-[-5px] bottom-[-8px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
                            {getCartCount()}
                        </p>
                    </Link>
                    <div className='group relative'>
                        <img src={assets.profile_icon} alt="profile-icon" className='w-5 cursor-pointer'/>
                        <div className='group-hover:block hidden absolute right-0 pt-2'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded-md'>
                                <p className='cursor-pointer hover:text-black'>My Profile</p>
                                <p className='cursor-pointer hover:text-black'>Orders</p>
                                <p className='cursor-pointer hover:text-black'>Login</p>
                            </div>
                        </div>
                    </div>
                    
                    <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>  
                {/* Sidebar menu for small screens  */}
                <div className={`absolute top-0 right-0 bottom-0 transition-all bg-white ${visible ? 'w-full' : 'w-0 hidden'}`}>
                    <div className='flex flex-col text-gray-600 bg-white'>
                        <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                            <img src={assets.dropdown_icon} alt="" className='h-4 rotate-180'/>
                            <p>Back</p>
                        </div>
                        <NavLink onClick={() => setVisible(false)} on  to='/newproduct' className="py-2 pl-6 border-b-2">SẢN PHẨM MỚI</NavLink>
                        <NavLink onClick={() => setVisible(false)} to='/favorite' className="py-2 pl-6 border-b-2">SẢN PHẨM YÊU THÍCH</NavLink>
                        <NavLink onClick={() => setVisible(false)} to='/restock' className="py-2 pl-6 border-b-2">RESTOCK</NavLink>
                        <NavLink onClick={() => setVisible(false)} to='/shop' className="py-2 pl-6 border-b-2">SHOP</NavLink>   
                        <NavLink onClick={() => setVisible(false)} to='/collection' className="py-2 pl-6 border-b-2">BỘ SƯU TẬP</NavLink>   
                    </div>
                </div>
        </div>
        <div className='flex justify-center border-t-2 py-3'>
            <ul className='hidden sm:flex justify-around w-full h-9 gap-5 text-sm text-gray-700'>
                    <NavLink to='/newproduct' className="flex flex-col items-center gap-1 group">
                        <h2 className='text-xl'>SẢN PHẨM MỚI</h2>
                        <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40'/>
                    </NavLink>
                    <NavLink to='/favorite' className="flex flex-col items-center gap-1 group">
                        <h2 className='text-xl'>SẢN PHẨM YÊU THÍCH</h2>
                        <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40'/>
                    </NavLink>
                    <NavLink to='/restock' className="flex flex-col items-center gap-1 group">
                        <h2 className='text-xl'>RESTOCK</h2>
                        <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40'/>
                    </NavLink>
                    <NavLink to='/shop' className="flex flex-col items-center gap-1 group">
                        <h2 className='text-xl'>SHOP</h2>
                        <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40'/>
                    </NavLink>
                    <NavLink to='/collection' className="flex flex-col items-center gap-1 group">
                        <h2 className='text-xl'>BỘ SƯU TẬP</h2>
                        <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40'/>
                    </NavLink>
            </ul>
        </div>
    </div>    
  )
}

export default Navbar