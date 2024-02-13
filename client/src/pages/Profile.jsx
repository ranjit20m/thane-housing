import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase";

const Profile = () => {
  const {currentUser} = useSelector(state => state.user);
  const fileRef =  useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  // console.log(file);
  console.log(filePerc);
  console.log(formData);
  console.log(fileUploadError);
  
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
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Upload Progress
        setFilePerc(Math.round(progress)) // console.log(progress)
      },
      (error) => {
        setFileUploadError(true);
      },
      () => { // Get download url
        getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          setFormData({...formData, avatar: downloadURL});
        })
      }
    )
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
        <input id="username" type="text" placeholder="username" className="border p-3 rounded-lg" />
        <input id="email" type="text" placeholder="email" className="border p-3 rounded-lg" />
        <input id="password" type="password" placeholder="password" className="border p-3 rounded-lg" />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}

export default Profile