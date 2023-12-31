import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // console.log(formData);
  // console.log(filePerc);
  // console.log(fileUploadError);

  // console.log("Current user is ",currentUser)
  // console.log("Form data is",formData)

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },

      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log("customer id in handle submit",currentUser)
      dispatch(updateUserStart());
      const res = await axios.post(
        `/api/user/update/${currentUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Axios response",res.data)
      const data = res.data;

      // using fetch :point_down:
      // const res = await fetch (`/api/user/update/${currentUser._id}`,{
      //   method: "POST",
      //   headers: {
      //     'Content-Type' : 'application/json'
      //   },
      //   body: JSON.stringify(formData)
      // })
      // const data = await res.json()

      // this if condition is redundant
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      console.log("err in update" , err)
      dispatch(updateUserFailure(err.response.data));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      // console.log("customer id in handle delete",currentUser._id)
      const res = await axios.delete(`/api/user/delete/${currentUser._id}`);
      // console.log("Delete response", res);
      dispatch(deleteUserSuccess(res.data));
    } catch (err) {
      console.log("Err in delete user" + err);
      dispatch(deleteUserFailure(err));
    }
  };

  const handleSignOut = async () =>{
    try{
      dispatch(signOutUserStart())
      const res = await axios.get('/api/user/signout')
      dispatch(signOutUserSuccess(res.data))
    }catch(err){
      dispatch(signOutUserFailure(err))
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="User Avatar"
          className="rounded-full h-24 w-24 object-cover cursor-pointer border border-black self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
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
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}>Create Listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      <p className="text-red-700 mt-5">
        {error && error.error ? error.error : error}
      </p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated successfully" : " "}
      </p>
    </div>
  );
};

export default Profile;
