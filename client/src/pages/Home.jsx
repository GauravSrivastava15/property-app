import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css/bundle'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import ListingItem from "../components/ListingItem";

const Home = () => {
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  SwiperCore.use([Navigation])
  console.log(offerListings)

  useEffect(() =>{
    const fetchOfferListng = async () =>{
      try{
        const res = await axios.get(`/api/property/get?offer=true&limit=4`)
        const data = res.data
        setOfferListings(data)
        fetchRentListings()
      }catch(err){
        console.log(err)
      }
    }
    const fetchRentListings = async () =>{
      try{
        const res = await axios.get('/api/property/get?type=rent&limit=4')
        const data = res.data
        setRentListings(data)
        fetchSaleListings()
      }catch(err){
        console.log(err)
      }
    }

    const fetchSaleListings = async () =>{
      try{
        const res = await axios.get('/api/property/get?type=sale&limit=4')
        
        const data = res.data
        setSaleListings(data)
      }catch(err){
        console.log(err)
      }
    }
    fetchOfferListng()
  }, [])

  return (
    <div className="">

      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span> <br /> place with ease
        </h1>
        <div className="text-gray-400  text-xs sm:text-sm">
          This website will help you find your home in fast, easy and
          comfortable way <br /> We have wide range of properties for you to
          choose from
        </div>
        <Link to={'/search'} className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">Letss get started...</Link>
      </div>

      <Swiper navigation>
        {offerListings && offerListings.length > 1 && 
          offerListings.map((list) => (
            <SwiperSlide>
              <div style={{background: `url(${list.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} className="h-[500px]" key={list._id}></div>
            </SwiperSlide>
          ))
        }

      </Swiper>
        
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent offers</h2>
              <Link  className='text-sm text-blue-800' to={'/search?offer=true'}>
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent places for rent</h2>
              <Link  className='text-sm text-blue-800' to={'/search?type=rent'}>
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent places for sale</h2>
              <Link  className='text-sm text-blue-800' to={'/search?type=sale'}>
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default Home;
