import { ReactNode, createContext, useState } from "react";
import { ProfileLogo, Role, Transfer, User } from "../@Types";

interface SoccerinContextState {
  profileLogo: ProfileLogo[];
  transfers: Transfer[];
  user: User[];
  role: Role[];
  comments: Comment[];
  setTransfers: (transfers: Transfer[]) => void;
  setComments: (Comments: Comment[]) => void;
  setUser: (User: User[])=>void;
  setRole: (Role: Role[]) => void;
  setProfileLogo: (profileLogo: ProfileLogo[]) => void;
}

const initialState: SoccerinContextState = {
  transfers: [],
  comments:[],
  user:[],
  role:[],
  profileLogo:[],
  setTransfers: () => {},
  setComments: () => {},
  setUser: () => {},
  setRole:() => {},
  setProfileLogo:() => {},
};

//create context
const SoccerinContext = createContext<SoccerinContextState>(initialState);

//wrapper component:
export const SoccerinContextProvider = ({ children }: { children: ReactNode }) => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<User[]>([]);
  const [role, setRole] = useState<Role[]>([]);
  const [profileLogo, setProfileLogo] = useState<ProfileLogo[]>([]);

  return (
    <SoccerinContext.Provider value={{ transfers,comments,user,role, profileLogo, setUser, setRole, setTransfers, setComments, setProfileLogo }}>
      {children}
    </SoccerinContext.Provider>
  );
};

export default SoccerinContext;