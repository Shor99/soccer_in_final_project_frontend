import { ReactNode, createContext, useEffect, useState } from "react";
interface AuthContextState {
    isLoggedIn: boolean;
    isAdmin: boolean;
    token?: string;
    username?: string;
    login: (username: string, token: string) => void;
    logout: ()=>void;
   }
   const initialState = {
    isLoggedIn: false,
    isAdmin: localStorage.getItem("role") === "Admin" ? true : false,
    login: (username: string, token: string) => {},
    logout: () => {},
   };
   //create context
   const AuthContext = createContext<AuthContextState>(initialState);

   
   
   //wrapper component rafce:
   export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem("role") === "Admin" ? true : false);
    const [username, setUsername] = useState<string>();
    const [token, setToken] = useState<string>();
    useEffect(() => {
        //code that runs once, thus no infinite render loop
        //run code once the component is loaded to the dom:
        const data = localStorage.getItem("user");
        const userRole = localStorage.getItem("role")
        console.log(userRole)
        if (data && userRole) {
          const user = JSON.parse(data);
          setIsAdmin(userRole === "Admin" ? true : false)
          setIsLoggedIn(true);
          setToken(user.token);
          setUsername(user.username);
        }
      }, []);

    const auth = {
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        token,
        username,
        login: (username: string, token: string) => {
            setUsername(username);
            setToken(token);
            setIsLoggedIn(true);
        },
        logout: () => {
            localStorage.removeItem("user");
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
            setUsername(undefined);
            setToken(undefined);
            setIsLoggedIn(false);
        },
    };
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
   };
   export default AuthContext;