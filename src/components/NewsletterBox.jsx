import React from 'react'

const NewsletterBox = () => {
    const onSubmitHandler = (event) => {
        // Khi gửi email subcribe thì sẽ không bị reload page
        event.preventDefault();
    }

  return (
    <div className='text-center px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <p className='text-3xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'  action="">
            <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required/>
            <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
        </form>
    </div>
  )
}

export default NewsletterBox