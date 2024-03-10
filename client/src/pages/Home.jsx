import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide}  from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

const Home = () => {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);   
  const [saleListings, setSaleListings] = useState([]);
  // console.log(offerListings);
  // console.log(rentListings);
  // console.log(saleListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/search?offer=true&limit=3');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings(); // call rent listing after fetching offers
      } catch (error) {
        console.log(error)
      }
    };
    fetchOfferListings();

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/search?type=rent&limit=3');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings(); // call sale listing after fetching rent
      } catch (error) {
        console.log(error)
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/search?type=sale&limit=3');
        const data = await res.json();
        setSaleListings(data); 
      } catch (error) {
        console.log(error)
      }
    }
  },[]);

  return (
    <div>
      {/* Top */}
      <div className="flex flex-col gap-6 p-28 py-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>  <br />place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Thane housing is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <div className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
          <Link to={"/search"}>Let&lsquo;s get started.</Link>
        </div>
      </div>
      {/* Swiper */}
      <Swiper navigation>
        { offerListings && offerListings.length > 0 && (
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div 
                className="h-[500px]" 
                style={{background:`url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:'cover'}}
              ></div>
            </SwiperSlide>
          ))
        )}
      </Swiper>      
      {/* Listing Results for offer, sale and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link to={'/search?offer=true'} className='text-sm text-blue-800 hover:underline'>Show more offers</Link>
              <div className="flex flex-wrap gap-4 my-4">
                {
                  offerListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link to={'/search?type=rent'} className='text-sm text-blue-800 hover:underline'>Show more places for rent</Link>
              <div className="flex flex-wrap gap-4 my-4">
                {
                  rentListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link to={'/search?type=sale'} className='text-sm text-blue-800 hover:underline'>Show more places for sale</Link>
              <div className="flex flex-wrap gap-4 my-4">
                {
                  saleListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home