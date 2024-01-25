import "../login/login.scss";

import googleSignIn from "../login/btn_google_signin_dark_normal_web.png";

import { auth, provider } from "../../config/firebase";

import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Login = () =>
{
    const navigate = useNavigate();

    const signInWithGoogle = async () =>
    {
        const result = await signInWithPopup(auth, provider);
        navigate("/");
    };

    return (
        <div className="sign-in-google">
            <h1>Sign in with google to continue</h1>
            {/* <button onClick={signInWithGoogle}>Sign in with Google</button> */}
            <img onClick={signInWithGoogle} src={googleSignIn} alt="Google sign in" />
        </div>
    );
};