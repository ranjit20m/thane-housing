import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Search = () => {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm : '', type: 'all', parking: false, furnished: false, offer: false, sort: 'created_at', order: 'desc'
  });   // console.log(sidebarData);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);   // console.log(listings);
  const [showMore, setShowMore] = useState(false); 
  const listingsSetPerPage = 4;
  const [nextListingsSet, setNextListingsSet] = useState(listingsSetPerPage);  
  
  const locationSearch = window.location.search;
  useEffect(() => {
    const urlParams = new URLSearchParams(locationSearch);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
    if(searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || 
      offerFromUrl || sortFromUrl || orderFromUrl) {
      setSidebarData({
        searchTerm : searchTermFromUrl || '', 
        type: typeFromUrl || 'all', 
        parking: parkingFromUrl === 'true' ? true : false, 
        furnished: furnishedFromUrl === 'true' ? true : false, 
        offer: offerFromUrl === 'true' ? true : false,  
        sort: sortFromUrl || 'created_at', 
        order: orderFromUrl || 'desc'
      })
    }

    const fetchListings = async () => { 
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/search?${searchQuery}`);
      const data = await res.json(); 
      data.length > nextListingsSet ? setShowMore(true) : setShowMore(false);  
      setListings(data.slice(0, nextListingsSet));
      setLoading(false);
    };
    fetchListings();
  }, [locationSearch, nextListingsSet]);

  const handleShowMore =  () => { 
    setNextListingsSet(nextListingsSet + listingsSetPerPage);
  };

  const handleChange = (e) => {
    // Type = all, rent, sale
    if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData({...sidebarData, type: e.target.id});
    }
    // Input text = searchTerm
    if(e.target.id === 'searchTerm') {
      setSidebarData({...sidebarData, searchTerm: e.target.value});
    }
    // Boolean = True or False
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.checked || e.target.value === 'true' ? true : false 
      })
    }
    // Sort => created_at_desc 
    if(e.target.id === 'sort_order') {
      const sort  = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebarData({...sidebarData, sort, order});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('type', sidebarData.type);
    urlParams.set('parking', sidebarData.parking);
    urlParams.set('furnished', sidebarData.furnished);
    urlParams.set('offer', sidebarData.offer);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);
    // Get search query by converting above to string
    const searchQuery = urlParams.toString(); 
    navigate(`/search?${searchQuery}`);
  }; 

  return (     
    <div className="flex flex-col md:flex-row">
      {/* Left Side */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term: </label>
            <input type="text" id="searchTerm" placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm} onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-5" 
              checked={sidebarData.type === 'all'} onChange={handleChange}
              /> <span>Rent & Sale</span>
            </div>     
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" 
              checked={sidebarData.type === 'rent'} onChange={handleChange}
              /> <span>Rent</span>
            </div> 
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" 
              checked={sidebarData.type === 'sale'} onChange={handleChange}
              /> <span>Sale</span>
            </div> 
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" 
              checked={sidebarData.offer} onChange={handleChange}
              /> <span>Offer</span>
            </div>     
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" 
              checked={sidebarData.parking} onChange={handleChange}
              /> <span>Parking</span>
            </div>     
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" 
              checked={sidebarData.furnished} onChange={handleChange}
              /> <span>Furnished</span>
            </div>                 
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-semibold">Sort:</label>
            <select id="sort_order" className="border rounded-lg p-3" 
            onChange={handleChange} defaultValue={'created_at_desc'}
            >
              <option value={'regularPrice_desc'}>Price high to low</option>
              <option value={'regularPrice_asc'}>Price low to high</option>
              <option value={'createdAt_desc'}>Latest</option>
              <option value={'createdAt_asc'}>Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-95">Search</button>
        </form>
      </div>
      {/* Right Side */}
      <div className="flex-1"> 
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing results:</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-red-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">Loading...</p>
          )}
          {!loading && listings && listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}

          {showMore && (
            <button onClick={handleShowMore} className="text-green-700 hover:underline p-7 text-center w-full">
              Show more
            </button>
          )}
        </div>
      </div>
    </div>  
  )
}

export default Search;