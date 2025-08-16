import React from 'react'

interface TitleProps {
  text1: String;
  text2: String;
}

const Title = ({text1, text2}: TitleProps) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
            <p className='text-gray-500'>{text1} <span className='text-gray-700 font-medium'>{text2}</span></p>
            <p className='w-8 sm:w-12 sm:h-[2px] h-[1px] bg-gray-700'></p>
    </div>
  )
}

export default Title