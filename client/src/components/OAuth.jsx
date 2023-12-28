import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      

      const response = await axios.post(
        "/api/user/google",
        {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response", response);
      dispatch(signInSuccess(response.data));
      navigate("/");

      // const res = await fetch('/api/user/google', {
      //     method: "POST",
      //     headers: {
      //         'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({name:result.user.displayName, email:result.user.email, photo:result.user.photoURL})
      // })
      // const data = await res.json()
      // dispatch(signInSuccess(data))
      // navigate('/')
    } catch (err) {
      console.log("could not sign in with google", err);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
