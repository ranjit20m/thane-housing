import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserFailure, 
        deleteUserFailure, deleteUserStart, deleteUserSuccess } from "../redux/user/userSlice"; 

const Profile = () => {
  const {currentUser, loading, error} = useSelector(state => state.user);
  const fileRef =  useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  // console.log(file); // console.log(filePerc); // console.log(formData); // console.log(fileUploadError);
  
  useEffect(() => {
    if(file) {
        setFileUploadError(false); // error stays once it show so to fix that
        handleFileUpload(file);
    }
  }, [file]);
  
  const handleFileUpload = (file) => {
    const storage = getStorage(app); // getStorage from firebase/storage and app from firebase.js
    const fileName = new Date().getTime() + file.name; // Date Time to have unique file name
    const storageRef = ref(storage, fileName) // Which place to save the storage
    const uploadTask = uploadBytesResumable(storageRef, file) // To see the percentage of upload
    // Track upload changes
    uploadTask.on('state_changed', // state_changed event has three callback functions
      (snapshot) => { // 1. keeping track of the upload progress and uploading the progress state
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Upload Progress
        setFilePerc(Math.round(progress)) // console.log(progress)
      },
      (error) => { // 2. handle an error if the upload is unsuccessful
        setFileUploadError(true);
        console.log(error); // FirebaseError: Firebase Storage: User does not have permission to access '1707843190816DSC_0002 - Copy.JPG'. (storage/unauthorized)
      },
      () => { // 3. once the upload is complete, and gets the download URL, then... 
        getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          setFormData({...formData, avatar: downloadURL});
        })
      }
    )
  };
  const handleChange = (e) => {
    // based on the id of input,extract the changes and put it in the formData
    setFormData({...formData, [e.target.id]: e.target.value});     
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      } 
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE' 
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      } 
      dispatch(deleteUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
        <img 
          onClick={() => fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} 
          alt="Profile" 
          className="rounded-full h-24 w-24 object-cover cursor-pointer mt-2 self-center" 
        />
        <p className="text-sm self-center">
          {
            fileUploadError ? 
            (<span className="text-red-700">Error Image upload (Image must be less than 2 MB)</span>) 
            : filePerc > 0 && filePerc < 100 ?
            (<span className="text-slate-700">{`Uploading ${filePerc}%`}</span>)
            : filePerc === 100 ?
            (<span className="text-green-700">Image uploaded successfully!</span>)
            : 
            ('')
          }
        </p>
        <input 
          id="username" 
          type="text" 
          placeholder="username" 
          className="border p-3 rounded-lg" 
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input 
          id="email" 
          type="text" 
          placeholder="email" 
          className="border p-3 rounded-lg" 
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input 
          id="password" 
          type="password" 
          placeholder="password" 
          className="border p-3 rounded-lg"  
          onChange={handleChange}
        />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully!' : ''}</p>
    </div>
  )
}

export default Profile