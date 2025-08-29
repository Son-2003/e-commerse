import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/FormatPrice';

interface ProductItemProps {
  id: number;
  image: string;
  name: string;
  price: number;
}

const ProductItem = ({ id, name, price, image }: ProductItemProps) => {
    const {currency} = useContext(ShopContext);
    
  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
        <div className='overflow-hidden'>
            <img className='hover:scale-110 transition ease-in-out duration-300' src={image.split(",")[0]} alt="" />
        </div>
        <p className='pt-3 pb-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap'>{name}</p>
        <p className='text-base font-medium'>{formatPrice(price)}{currency}</p>
    </Link>
  )
}

export default ProductItem