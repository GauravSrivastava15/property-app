import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart())
      const response = await axios.post("/api/user/signin", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      //The below code is redundant because when the error occures in response it goes to the
      //catch block and we cannot access the response.data or anything related to it

      // const data = response.data;
      // console.log(data);
      // if (data.success === false) {
      //   console.log("Data is", data);
      //   console.log("Error  isasdfasf", data.error);
      //   setError(data.error);
      //   setLoading(false);
      //   return;
      // }

      // setLoading(false);
      // setError(null);
      // console.log("From sign In page",response.data.rest)
      dispatch(signInSuccess(response.data.rest))
      navigate("/");
    } catch (err) {
      // setLoading(false);
      // setError(err.response.data.error); // --> this is the correct way to access the error in axios response
      dispatch(signInFailure(err.response.data.error))
      console.log(err)
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      
      {error && <p className="text-red-400 mt-5">{error}</p>}
    </div>
  );
};

export default SignIn;