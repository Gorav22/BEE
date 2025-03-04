import { useEffect, useState } from 'react';
import logo from "../images/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import { MdLightMode } from "react-icons/md";
import { BsGridFill } from "react-icons/bs";
import { api_base_url, toggleClass } from '../helper';
import GodChatbot from '../pages/GodChatbot';

const Navbar = ({ isGridLayout, setIsGridLayout }) => {
  const [isLightMode, setIsLightMode] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  // Function to toggle between light and dark mode
  const changeTheme = () => {
    const editorNavbar = document.querySelector(".navbar");
    if (isLightMode) {
      editorNavbar.style.background = "#141414";
      document.body.classList.remove("lightMode");
      setIsLightMode(false);
      localStorage.setItem("lightMode", "false");
    } else {
      editorNavbar.style.background = "gray";
      document.body.classList.add("lightMode");
      setIsLightMode(true);
      localStorage.setItem("lightMode", "true");
    }
  };

  // Check localStorage on component mount to apply saved theme
  useEffect(() => {
    const savedLightMode = localStorage.getItem("lightMode");
    const editorNavbar = document.querySelector(".navbar");
    
    if (savedLightMode === "true") {
      editorNavbar.style.background = "gray";
      document.body.classList.add("lightMode");
      setIsLightMode(true);
    } else {
      editorNavbar.style.background = "#141414";
      document.body.classList.remove("lightMode");
      setIsLightMode(false);
    }
  }, []);

  useEffect(() => {
    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId")
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        setData(data.user);
      }
      else {
        setError(data.message);
      }
    })
  }, [])

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  }

  return (
    <>
      <div className="navbar flex items-center justify-between px-[100px] h-[80px] bg-[#141414]">
        <div className="logo">
          <img className='w-[250px] cursor-pointer' src={logo} alt="" />
        </div>
        <div className="links flex items-center gap-7">
          <Link to='/'>Home</Link>
          <Link to='/GodChatbot'>GodchatBot</Link>
          <button onClick={logout} className='btnBlue !bg-red-500 min-w-[120px] ml-2 hover:!bg-red-600'>Logout</button>
          <Avatar onClick={() => { toggleClass(".dropDownNavbar", "hidden") }} name={data ? data.name : ""} size="40" round="50%" className=' cursor-pointer ml-2' />
        </div>

        <div className='dropDownNavbar hidden absolute right-[60px] top-[80px] shadow-lg shadow-black/50 p-[10px] rounded-lg bg-gray-400 w-[150px] h-[160px]'>
          <div className='py-[10px] border-b-[1px] border-b-[#fff]'>
            <h3 className='text-[17px] navbar' style={{ lineHeight: 1 }}>{data ? data.name : ""}</h3>
          </div>
          <i className='flex items-center gap-2 mt-3 mb-2 cursor-pointer' style={{ fontStyle: "normal" }} onClick={changeTheme}>
            <MdLightMode className='text-[20px]' />  {isLightMode ? "Dark mode" : "Light mode"}
          </i>
          <i onClick={() => setIsGridLayout(!isGridLayout)} className='flex items-center gap-2 mt-3 mb-2 cursor-pointer' style={{ fontStyle: "normal" }}>
            <BsGridFill className='text-[20px]' /> {isGridLayout ? "List" : "Grid"} layout
          </i>
        </div>
      </div>
    </>
  );
};

export default Navbar;