import { Fragment, useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import DarkModeContext from '../context/DarkModeContext';
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import Modal from './Modal';

const Navbar = () => {

  const { isLoggedIn, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";
  const logo = localStorage.getItem(username) || "";
  const { toggleDarkMode } = useContext(DarkModeContext);
  const [showModal, setShowModal] = useState<boolean>(false)
  return (
    <Fragment>
      <nav
        id="app-nav"
        className={`sm:gap-10 z-10 shadow-lg p-8 gap-4 flex align-middle items-center justify-center bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-50 fixed top-0 ${localStorage.getItem("openSidebar") === "true" ? "left-52" : "left-20"} right-0`}
      >
        {isLoggedIn && <button className="flex gap-2 align-middle items-center justify-center" onClick={() => setShowModal(true)}>
          <div>
            <img className="w-10 h-10 dark:bg-gray-400 rounded-full shadow-lg" src={logo} alt="" />
          </div>
          <p>{username}</p>
        </button>}
        <NavLink to="/about" onClick={()=>localStorage.setItem("current-page", "about")}>About</NavLink>
        <div className="flex-1"></div>
        <div className="hidden sm:flex sm:items-center sm:gap-10">
          {isAdmin && isLoggedIn && <NavLink to="/adding" onClick={()=>localStorage.setItem("current-page", "adding")}>Adding</NavLink>}
          {isLoggedIn && <NavLink to="/transfers" onClick={()=>{
            localStorage.setItem("current-page", "transfers");
            localStorage.setItem("searching_transfer","false");
            localStorage.setItem("searching_transfer_by_player", "false");
            localStorage.setItem("searching_transfer_by_team", "false");
            localStorage.setItem("searching_transfer_by_range", "false");
            }}>Transfers</NavLink>}
          {isLoggedIn && <button onClick={() => {
            logout();
            navigate("/login");
            localStorage.setItem("current-page", "login");
          }}>Logout</button>}
          {!isLoggedIn && <NavLink to="/login" onClick={()=>localStorage.setItem("current-page", "login")}>Login</NavLink>}
          {!isLoggedIn && <NavLink to="/register" onClick={()=>localStorage.setItem("current-page", "register")}>Register</NavLink>}
          <button
            onClick={() => {
              toggleDarkMode();
              localStorage.theme === "dark" ? localStorage.theme = "light" : localStorage.theme = "dark";
            }}
          >
            {localStorage.theme === "dark" ? <BsSunFill /> : <BsMoonFill />}
          </button>
        </div>
      </nav>
      <Modal isVisible={showModal} onClose={() =>
        setShowModal(false)} />
    </Fragment>
  )
}

export default Navbar