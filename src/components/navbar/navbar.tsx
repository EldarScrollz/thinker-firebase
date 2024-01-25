import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

import logoutSVG from "../navbar/Logout.svg";
import thoughtBubble from "../navbar/Thought_Bubble.svg";
import { useEffect, useRef, useState } from "react";

export const Navbar = () =>
{
    const menuRef = useRef<HTMLDivElement>(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [user] = useAuthState(auth);

    const navigate = useNavigate();

    useEffect(() =>
    {
        const mobileMenuOpenClose = (e: MouseEvent) =>
        {
            if (!menuRef.current?.contains(e.target as Node)) 
            {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", mobileMenuOpenClose);

        return () => 
        {
            document.removeEventListener("mousedown", mobileMenuOpenClose);
        };
    });

    const logout = async () =>
    {
        await signOut(auth);
    };

    return (
        <>
            <nav className={`navbar ${isMobileMenuOpen && "navbar-open"}`} ref={menuRef}>

                <div className="navbar-wrapper">


                    <div className="navbar-user-wrapper">
                        {user &&
                            <>
                                <div className="navbar-user" style={{ backgroundColor: "rgb(57, 65, 62)" }}>

                                    <p>{user?.displayName}</p>

                                    <img className="navbar-profilePic" src={user?.photoURL || ""} />
                                </div>
                            </>
                        }
                    </div>


                    <Link to="/" className="logo"> THINKER </Link>

                    <ul className="navbar-links">
                        <li onClick={() => setIsMobileMenuOpen(false)}>
                            <Link to="/">HOME</Link>
                        </li>
                        {!user ?
                            <li onClick={() => setIsMobileMenuOpen(false)}>
                                <Link to="/login">LOG IN</Link>
                            </li>
                            : user &&
                            <li onClick={() => setIsMobileMenuOpen(false)}>
                                <Link to="/create-post">POST</Link>
                            </li>
                        }
                    </ul>

                    <ul className="navbar-exitArea">
                        <li className="navbar-close" onClick={() => setIsMobileMenuOpen(false)}>
                            X
                        </li>
                        {user &&
                            <li className="navbar-logout">
                                <img onClick={() => { logout(); setIsMobileMenuOpen(false); navigate("/"); }} src={logoutSVG} alt="Logout" />
                            </li>
                        }
                    </ul>
                </div>


            </nav>

            <img className="navbar-menuButton" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} src={thoughtBubble} alt="Mobile menu" />
        </>
    );
};