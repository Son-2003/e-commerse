import Title from "../../components/customer/Title";
import { assets } from "../../assets/assets";
import NewsletterBox from "../../components/customer/NewsletterBox";

const Contact = () => {
  return (
    <div className="text-center px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] h-screen">
      <div className="text-2xl text-center pt-8">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.contact_img}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <b className="font-semibold text-xl text-gray-600">Our Store</b>
          <p className="text-xl text-left text-gray-600">
            54709 Willms Station
            <br /> Suite 350, Washington, USA
          </p>
          <p className="text-xl text-left text-gray-600">
            Tel: (415) 555-0132
            <br />
            Email: admin@forever.com
          </p>

          <b className="font-semibold text-xl text-gray-600">
            Careers at Forever
          </b>
          <p className="text-xl text-gray-600">
            Learn more about our teams and job openings.{" "}
          </p>
          <button
            type="submit"
            className="bg-white text-black text-xs px-10 py-4 border-2 border-black hover:bg-black hover:text-white"
          >
            EXPLORE JOBS
          </button>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Contact;
