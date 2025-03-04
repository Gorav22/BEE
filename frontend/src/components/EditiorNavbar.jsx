import React, { useEffect } from 'react';
import logo from "../images/logo.png";
import { FiDownload } from "react-icons/fi";

const EditiorNavbar = ({ onDownload }) => {
  // Apply the theme based on what's stored in localStorage
  useEffect(() => {
    const savedLightMode = localStorage.getItem("lightMode");
    const editorNavbar = document.querySelector(".EditiorNavbar");

    if (savedLightMode === "true") {
      editorNavbar.style.background = "gray";  // Light mode background
    } else {
      editorNavbar.style.background = "#141414";  // Dark mode background
    }
  }, []);

  return (
    <div className="EditiorNavbar flex items-center justify-between px-[100px] h-[80px]">
      <div className="logo">
        <a href="http://localhost:5173/">
          <img className='w-[250px] cursor-pointer' src={logo} alt="" />
        </a>
      </div>
      <p>File /My first project</p>
      <i 
        className='p-[8px] btn bg-black rounded-[5px] cursor-pointer text-[20px]' 
        onClick={onDownload} 
      >
        <FiDownload />
      </i>
    </div>
  );
};

export default EditiorNavbar;
