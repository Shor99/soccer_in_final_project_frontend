import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const About = () => {
  const { isAdmin, isLoggedIn } = useContext(AuthContext);
  const nav = useNavigate();
  if(localStorage.getItem("role") === undefined){
    window.location.reload();
  }
  return (
    <div className="h-screen text-start ps-16 pt-10 flex">
      <div className="w-3/5">
        <div className="w-3/5">
          <h1 className="text-2xl">About Us</h1>
          <ul className="pt-4 ps-4">
            <li className="flex align-middle items-center pt-3 gap-2 text-xl"><IoMdCheckmarkCircleOutline /><p className="font-serif">Like your favorite transfers</p></li>
            <li className="flex align-middle items-center pt-3 gap-2 text-xl"><IoMdCheckmarkCircleOutline /><p className="font-serif">Comment about your favorite transfers</p></li>
            <li className="flex align-middle items-center pt-3 gap-2 text-xl"><IoMdCheckmarkCircleOutline /><p className="font-serif">Like your favorite transfer comments</p></li>
          </ul>
        </div>
        <div className="w-4/5 pt-20">
          <div>
            <h1 className="bold text-2xl">What can you do</h1>
            <ul className="pt-4 ps-4">
              <li className="flex align-middle items-center pt-3 gap-2 text-xl"><IoMdCheckmarkCircleOutline /><p className="font-serif">Set your profile icon by clicking the icon and change</p></li>
              <li className="flex align-middle items-center pt-3 gap-2 text-xl"><IoMdCheckmarkCircleOutline /><p className="font-serif">Like your favorite transfers</p></li>
              <li className="flex align-middle items-center pt-3 gap-2 text-xl"><IoMdCheckmarkCircleOutline /><p className="font-serif">Comment about your favorite transfers</p></li>
              <li className="flex align-middle items-center pt-3 gap-2 text-xl"><IoMdCheckmarkCircleOutline /><p className="font-serif">Like your favorite transfer comments</p></li>
              {isLoggedIn && isAdmin && <li className="flex align-middle items-center pt-3 gap-2 text-xl"><IoMdCheckmarkCircleOutline /><p className="font-serif">Add a new transfer</p></li>}
              {isLoggedIn && isAdmin && <li className="flex align-middle items-center pt-3 gap-2 text-xl"><IoMdCheckmarkCircleOutline /><p className="font-serif">Update a transfer</p></li>}
              {isLoggedIn && isAdmin && <li className="flex align-middle items-center pt-3 gap-2 text-xl"><IoMdCheckmarkCircleOutline /><p className="font-serif">Delete a transfer</p></li>}
            </ul>
          </div>
          <div>
            {!isLoggedIn && <button className="mt-8 block text-sm rounded-lg border dark:border-transparent border-gray-300 bg-gray-300 dark:bg-gray-700 py-1.5 px-4 font-medium dark:text-white text-black transition-colors hover:bg-gray-400 disabled:opacity-50" onClick={() => {
              nav("/register")
              localStorage.setItem("current-page", "register")
            }
            }>Sign up for free</button>}

            {!isLoggedIn && <button className="mt-2 ms-1 block text-sm bg-transparent py-1.5 font-medium dark:text-white text-black transition-colors hover:text-gray-700 dark:hover:text-gray-400 disabled:opacity-50" onClick={() => {

              nav("/login")
              localStorage.setItem("current-page", "login")
            }
            }>Already have an acount</button>}
          </div>
        </div>
      </div>
    </div>

  );
}

export default About