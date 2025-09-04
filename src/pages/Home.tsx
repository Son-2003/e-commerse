import LastCollection from "../components/LastCollection";
import Hero2 from "../components/Hero2";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import FashionLoopVideo from "components/FashionLoopVideo";

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
