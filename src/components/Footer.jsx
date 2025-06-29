import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <div>
          <img src={assets.logo} alt="logo" className="w-36" />
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+1-000-000-0000</li>
            <li>greatstackdev@gmail.com</li>
            <li>
              <Link to={"https://www.instagram.com/ducson_29/"}>Instagram</Link>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="my-5 text-sm text-center">
          Copyright 2024@FOREVER.com - All Right Reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
