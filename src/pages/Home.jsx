import React from 'react'
import Hero from '../components/Hero'
import Hero2 from '../components/Hero2'
import LastCollection from '../components/LastCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div>
      <Hero/>
      <LastCollection/>
      <Hero2/>
      <BestSeller/>
      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home