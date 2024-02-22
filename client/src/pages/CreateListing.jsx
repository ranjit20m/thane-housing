import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]); 
    // console.log(files);
    const [formData, setFormData] = useState({ 
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        regularPrice: 50,
        discountedPrice: 0,
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        parking: false,
        type: 'rent',
        offer: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [filePerc, setFilePerc] = useState(0);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    // console.log(formData);
    const handleImageSubmit = () => {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7 ) {
            setUploading(true);
            setImageUploadError(false);
            const promises = []; // since we are going to upload more than one image - one by one
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => { 
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)}); // concat for more images
                setImageUploadError(false);
                setUploading(false);
                })
                .catch(() => {
                setImageUploadError('Image upload failed (2 mb max per image)');
                setUploading(false);
            });            
        } else {
            setImageUploadError('You can only upload 6 images per listing.');
            setUploading(false);
        }
    };
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef =  ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log(`Upload is ${progress}% done`);
                    setFilePerc(Math.round(progress));
                },
                (error) => { reject(error) },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        resolve(downloadURL); // => save this downloadURL into a piece of state => formData => imageUrls
                    })
                }
            )
        })
    };
    const handleRemoveImage = (index) => {
        setFormData({
            ...formData, 
            imageUrls: formData.imageUrls.filter(( _ , i) => i !== index)
        })
    };
    const handleChange = (e) => {
        if(e.target.id === 'sell' || e.target.id==='rent') {
            setFormData({...formData, type: e.target.id});
        }
        if(e.target.id === 'furnished' || e.target.id === 'parking' || e.target.id === 'offer') {
            setFormData({...formData, [e.target.id]: e.target.checked});
        }
        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({...formData, [e.target.id]: e.target.value}); // [] => "name", "address"
        }
    };
    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) return setError('You must upload at least one image.');
            if(+formData.regularPrice < +formData.discountedPrice) return setError('Discount price must be lower than regular price.');
            // + => to change string to number
            setLoading(true);
            setError(false);
            const response = await fetch('/api/listing/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                // body: JSON.stringify(formData), 
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id // Error if not added: Listing validation failed: userRef: Path `userRef` is required.
                })

            });
            const data = await response.json();
            console.log(data);
            setLoading(false);
            if(data.success === false) setError(data.message);
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };
  return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7 ">Create a Listing</h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1">
                <input id="name" type="text" maxLength={62} minLength={10} placeholder="Name" required
                    className="border p-3 rounded-lg" onChange={handleChange} value={formData.name}
                />
                <textarea id="description" type="text" placeholder="Description" required
                    className="border p-3 rounded-lg" onChange={handleChange} value={formData.description}
                />
                <input id="address" type="text" placeholder="Address" required
                    className="border p-3 rounded-lg" onChange={handleChange} value={formData.address}
                />
                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input id="sell" type="checkbox" className="w-5" 
                            onChange={handleChange} checked={formData.type === 'sell'} 
                        /> 
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input id="rent" type="checkbox" className="w-5" 
                            onChange={handleChange} checked={formData.type === 'rent'}
                        /> 
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input id="parking" type="checkbox" className="w-5" 
                            onChange={handleChange} checked={formData.parking}
                        /> 
                        <span>Parking</span>
                    </div>
                    <div className="flex gap-2">
                        <input id="furnished" type="checkbox" className="w-5" 
                            onChange={handleChange} checked={formData.furnished}
                        /> 
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input id="offer" type="checkbox" className="w-5" 
                            onChange={handleChange} checked={formData.offer}
                        /> 
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                        <input id="bedrooms" type="number" min='1' max='10'  className="p-3 border-gray-300 rounded-lg" required  
                            onChange={handleChange} checked={formData.bedrooms}
                        /> 
                        <p>Bedrooms</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input id="bathrooms" type="number" min='1' max='10'  className="p-3 border-gray-300 rounded-lg" required  
                            onChange={handleChange} checked={formData.bathrooms}
                        /> 
                        <p>Bathrooms</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input id="regularPrice" type="number" min='50' max='1000000'  className="p-3 border-gray-300 rounded-lg" required  
                            onChange={handleChange} checked={formData.regularPrice}
                        />
                        <div className="flex flex-col items-center">
                            <p>Regular Price</p>
                            <span className="text-xs">($ / month)</span>
                        </div>                         
                    </div>
                    { formData. offer && (
                    <div className="flex items-center gap-2">
                        <input id="discountedPrice" type="number" min='0' max='1000000'  className="p-3 border-gray-300 rounded-lg" required  
                            onChange={handleChange} checked={formData.discountedPrice}
                        /> 
                        <div className="flex flex-col items-center">
                            <p>Discounted Price</p>
                            <span className="text-xs">($ / month)</span>
                        </div>                        
                    </div>
                    )}                    
                </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
                <p className="font-semibold">Images:
                    <span className="font-normal text-grey-600 ml-2">The first image will be the cover (max 6)</span>
                </p>
                <div className="flex gap-4">
                    <input onChange={(e) => setFiles(e.target.files)} id="images" type="file" accept="image/*" multiple className="p-3 border border-gray-300 rounded w-full" />
                    <button 
                        type="button"
                        onClick={handleImageSubmit}
                        disabled = {uploading}
                        className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                    >
                        { uploading ? `Uploading ${filePerc}%` : 'Upload' }
                    </button>                    
                </div>
                <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div className="flex justify-between border p-3 items-center" key={url}>
                            <img alt="listing image" src={url} className="w-20 h-20 object-contain rounded-lg" />
                            <button onClick={() => handleRemoveImage(index)} type="button" className="text-red-700  p-3 rounded-lg hover:opacity-75 uppercase">Delete</button>
                        </div>
                    ))
                }
                <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                   {loading ? 'Creating...' : 'Create Listing'} 
                </button>
                {error && <p className="text-red-700 text-sm">{error}</p>}
            </div>            
        </form>
    </main>
  )
}

export default CreateListing;