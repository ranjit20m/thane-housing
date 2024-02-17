const CreateListing = () => {
  return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7 ">Create a Listing</h1>
        <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1">
                <input id="name" type="text" maxLength={62} minLength={10} placeholder="Name" className="border p-3 rounded-lg" required />
                <textarea id="description" type="text" placeholder="Description" className="border p-3 rounded-lg" required />
                <input id="address" type="text" placeholder="Address" className="border p-3 rounded-lg" required />
                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input id="sell" type="checkbox" className="w-5" /> <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input id="rent" type="checkbox" className="w-5" /> <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input id="parking" type="checkbox" className="w-5" /> <span>Parking</span>
                    </div>
                    <div className="flex gap-2">
                        <input id="furnished" type="checkbox" className="w-5" /> <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input id="offer" type="checkbox" className="w-5" /> <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                        <input id="bedrooms" type="number" min='1' max='10'  className="p-3 border-gray-300 rounded-lg" required  /> 
                        <p>Bedrooms</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input id="bathrooms" type="number" min='1' max='10'  className="p-3 border-gray-300 rounded-lg" required  /> 
                        <p>Bathrooms</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input id="regularPrice" type="number" min='1' max='10'  className="p-3 border-gray-300 rounded-lg" required  />
                        <div className="flex flex-col items-center">
                            <p>Regular Price</p>
                            <span className="text-xs">($ / month)</span>
                        </div>                         
                    </div>
                    <div className="flex items-center gap-2">
                        <input id="discountedPrice" type="number" min='1' max='10'  className="p-3 border-gray-300 rounded-lg" required  /> 
                        <div className="flex flex-col items-center">
                            <p>Discounted Price</p>
                            <span className="text-xs">($ / month)</span>
                        </div>                        
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
                <p className="font-semibold">Images:
                    <span className="font-normal text-grey-600 ml-2">The first image will be the cover (max 6)</span>
                </p>
                <div className="flex gap-4">
                    <input id="images" type="file" accept="image/*" multiple className="p-3 border border-gray-300 rounded w-full" />
                    <button 
                        className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                    >
                        Upload
                    </button>
                </div>
                <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
            </div>
            
        </form>
    </main>
  )
}

export default CreateListing;