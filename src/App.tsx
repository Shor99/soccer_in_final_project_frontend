import { Route, Routes, useNavigate } from "react-router-dom";
import About from "./routes/About";
import Register from "./routes/Register";
import Login from "./routes/Login";
import Navbar from "./components/Navbar";
import NotFound from "./routes/NotFound";
import { useContext, useState } from "react";
import AuthContext from "./context/AuthContext";
import Transfers from "./routes/Transfers";
import TransfersDetails from "./routes/TransfersDetails";
import Adding from "./routes/Adding";
import Updating from "./routes/Updating";
import Comments from "./routes/Comments";
import Footer from "./components/Footer";
import { GiSoccerKick, GiGoalKeeper } from "react-icons/gi";
import { FaQuestionCircle, FaPlusCircle } from "react-icons/fa";
import { BiTransfer } from "react-icons/bi";

const App = () => {
    const { isAdmin, isLoggedIn } = useContext(AuthContext);
    const [openSidebar, setOpenSidebar] = useState(false);
    const navigator = useNavigate();

    if (localStorage.theme === "dark") {
        document.body.classList.add("dark")
    }
    return (
        <div>
            <Navbar/>
            <div className="flex dark:text-white">
                <div className={`bg-gray-200 shadow-2xl dark:bg-gray-700 ${openSidebar ? "w-60" : "w-20"}` }  onMouseOver={()=>{
                            setOpenSidebar(true);
                            localStorage.setItem("openSidebar","true");
                        }} onMouseOut={()=>{
                            setOpenSidebar(false)
                            localStorage.setItem("openSidebar","false");
                        }}>
                    <div className="p-2 relative duration-300">
                        <div className="flex justify-start items-center gap-2">
                            <div className="border-4 border-gray-700 dark:border-4 dark:border-gray-900 dark:text-gray-900  bg-gray-400 rounded-full w-16 h-16 items-center align-middle justify-center">
                                <div className="flex pt-3">
                                    <GiSoccerKick size={"30px"} />
                                    <GiGoalKeeper size={"14px"} />
                                </div>
                            </div>
                            {openSidebar&& <h1 className="font-serif">
                                Soccer In
                            </h1>}
                        </div>
                    </div>
                    <div className="justify-center items-center pt-10 ps-8">
                        <div className="flex justify-start align-middle items-center gap-2 cursor-pointer" onClick={()=> {
                            navigator("/about");
                            localStorage.setItem("current-page", "about");
                        }}>
                            <FaQuestionCircle/>
                            {openSidebar&& <h1 className="font-serif">
                                About
                            </h1>}
                        </div>
                    </div>
                    {isLoggedIn && <div className="justify-center items-center pt-10 ps-8">
                        <div className="flex justify-start align-middle items-center gap-2 cursor-pointer" onClick={()=> {
                            localStorage.setItem("current-page", "transfers");
                            localStorage.setItem("searching_transfer","false");
                            localStorage.setItem("searching_transfer_by_player", "false");
                            localStorage.setItem("searching_transfer_by_team", "false");
                            localStorage.setItem("searching_transfer_by_range", "false");
                            navigator("/transfers");
                        }}>
                            <BiTransfer/>
                            {openSidebar&& <h1 className="font-serif">
                                Transfers
                            </h1>}
                        </div>
                    </div>}
                    {isLoggedIn && isAdmin && <div className="justify-center items-center pt-10 ps-8">
                        <div className="flex justify-start align-middle items-center gap-2 cursor-pointer" onClick={()=> {
                            navigator("/adding");
                            localStorage.setItem("current-page", "adding");
                        }}>
                            <FaPlusCircle/>
                            {openSidebar&& <h1 className="font-serif">
                                Adding
                            </h1>}
                        </div>
                    </div>}
                </div>
                <div className={`w-screen dark:bg-gray-600`}>  
                    <div className="pt-28">
                        <Routes>
                            <Route path="/" element={<About />} />
                            <Route path="/about" element={<About />} />
                            {!isLoggedIn && <Route path="/register" element={<Register />} />}
                            {!isLoggedIn && <Route path="/login" element={<Login />} />}
                            {isLoggedIn && <Route path="/transfers" element={<Transfers />} />}
                            {isLoggedIn && <Route path="/adding" element={<Adding />} />}
                            {isLoggedIn && <Route path="/transfers/:id" element={<TransfersDetails />} />}
                            <Route path="*" element={<NotFound />}/>
                            {isLoggedIn && <Route path="/updating" element={<Updating />} />}
                            <Route path="/transfers/:id/comments" element={<Comments />} />
                        </Routes>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
export default App;
