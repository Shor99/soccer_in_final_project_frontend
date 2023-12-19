import { useState } from 'react'
import { useQuery } from 'react-query';
import { profileLogoRequest } from '../services/soccerin-service';
import authService from '../services/auth-service';

const Modal = ({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) => {
  const { data: res } = useQuery("get-profile_logos", profileLogoRequest);
  const [chosenLogo, isChosenLogo] = useState<boolean>(false)
  const username = String(localStorage.getItem("username"));
  const email = String(localStorage.getItem("email"));
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex w-1/5 h-3/5 rounded-lg mt-24 ms-3">
            <div className="w-[600px] flex flex-col">
                <button className="text-white text-xl place-self-end pe-3" onClick={() => onClose()}>X</button>
                <div className="h-56 grid grid-cols-2 gap-2 content-normal ps-8">
                    {res?.data.map((logo: any) => (
                        <div className="row-span-3 " key={logo.id} id={logo.profileLogoUrl}>
                            <button className="w-24 h-24 rounded-full shadow-lg" onClick={() => {
                                isChosenLogo(!chosenLogo)
                                localStorage.setItem("clickedLogo", String(logo.profileLogoUrl))
                                localStorage.setItem(username, String(logo.profileLogoUrl))
                                authService.updateUser(username,email,String(logo.profileLogoUrl))
                                onClose()
                            }
                            }
                                style={{ backgroundColor: (localStorage.getItem("clickedLogo") === String(logo.profileLogoUrl) && chosenLogo) ? "gray" : "transparent" }}>
                                <img className="w-15 h-15" src={logo.profileLogoUrl} alt="" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Modal