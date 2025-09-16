import LastCollection from "../../components/customer/LastCollection";
import Hero2 from "../../components/customer/Hero2";
import BestSeller from "../../components/customer/BestSeller";
import OurPolicy from "../../components/customer/OurPolicy";
import NewsletterBox from "../../components/customer/NewsletterBox";
import FashionLoopVideo from "components/customer/FashionLoopVideo";

const Home = () => {
  return (
    <div>
      <FashionLoopVideo/>
      <LastCollection />
      <Hero2 />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </div>
  );
};

export default Home;
