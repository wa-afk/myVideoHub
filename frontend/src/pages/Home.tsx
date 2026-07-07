import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectVideoLoading, selectPublicVideos, fetchVideosForPublic } from '../reducers/video/videoReducer';
import type { AppDispatch } from '../reducers/store';
import Layout from '../components/Layout';
import { FaPlay } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import VideoSlider from '../components/VideoSlider';

const Home: React.FC = () => {
    const publicVideos = useSelector(selectPublicVideos);
    const isLoading = useSelector(selectVideoLoading);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(fetchVideosForPublic());
    }, []);
  return <Layout>
    <div className='heroSection relative w-full h-[80vh]'>
        {!isPlaying && (
            <div
              style={{zIndex: 5}} 
              className='absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black to-gray-700 flex flex-col items-center justify-center'
            >
                <h1 className='text-4xl font-bold capitalize mb-4 md:text-5xl text-transparent bg-clip-text
                  bg-gradient-to-r from-yellow-400 via-red-300 to-yellow-800'> 
                    Create, Share & Discover Videos
                </h1>
                <p className='text-lg mb-6 md:txt-xl font-extralight text-white'>
                    A full-stack video sharing application built using MongoDB, Express.js, React,
                    Node.js, and Azure cloud services for scalable media storage and delivery.
                </p>
                <button className='bg-blue-500 text-white w-16 h-16 rounded-full transition duration-300
                  ease-in-out hover:bg-blue-700 hover:shadow-lg hover:scale-105 transform animate-scale-pulse justify-items-center'
                  onClick={() => setIsPlaying(true)}
                >
                    <FaPlay className='text-4xl' />
                </button>
                <button className='bg-blue-500 text-black px-6 py-3 mt-4 rounded shadow-lg hover:bg-blue-200
                  transition duration-300'
                  onClick={() => setIsPlaying(true)}
                >
                    Watch Now
                </button>
            </div>
        )}
        <div className={`absolute top-0 left-0 w-full h-full ${isPlaying? "block": "hidden"}`}
          style={{zIndex: isPlaying? 0: 1}}
        >
            <ReactPlayer url={"https://youtube.com/watch?v=_4CPp670fK4"} controls width={"100%"} height={"100%"}
              className='absolute top-0 left-0' playing={isPlaying}
            />
        </div>
    </div>
    <main className='w-[95vw]'>
        <h2 className='capitalize text-textTwo text-lg sm:text-2xl md:text-3xl lg:text-4xl mt-2 p-4'>
            Recently Added
        </h2>
        <VideoSlider videos={publicVideos}/>
    </main>
  </Layout>
};

export default Home;