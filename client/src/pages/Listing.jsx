import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

const Listing = () => {
    SwiperCore.use([Navigation]);
    const params = useParams(); 
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    
    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/fetch/${listingId}`); // App.jsx => path='/listing/:listingId'
                const data = await res.json(); // console.log(data.name);
                if(data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }            
        };
        fetchListing();
    },[params.listingId]);
  return (
    <main>
        {loading && <p className="text-center text-2xl my-7">Loading...</p>}
        {error && <p className="text-center text-2xl my-7">Something went wrong!</p>}
        {listing && !loading && !error && (
            <>
                <Swiper navigation>
                    {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div className="h-[500px]" style={{ background:`url(${url}) center no-repeat`, backgroundSize:'cover'}}></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
            // <div> 
            //     <p><img src={listing.imageUrls} className="w-16 h-16" /></p>
            //     <p>{listing.name}</p>
            //     <p>{listing.description}</p>
            //     <p>{listing.address}</p>
            //     <p>{listing.regularPrice}</p>
            //     <p>{listing.discountedPrice}</p>
            //     <p>{listing.bathrooms}</p>
            //     <p>{listing.bedrooms}</p>
            //     <p>{listing.furnished}</p>
            //     <p>{listing.parking}</p>
            //     <p>{listing.type}</p>
            //     <p>{listing.offer}</p>
            // </div>           
        )}
    </main>
  )
}

export default Listing;