import React, { useEffect } from 'react'
import Layout from '../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../reducers/store';
import { fetchVideosForPublic, selectPublicVideos } from '../reducers/video/videoReducer';
import HeroVideoCard from '../components/HeroVideoCard';

const AllVideos: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const publicVideos = useSelector(selectPublicVideos);
    useEffect(() => {
        dispatch(fetchVideosForPublic());
    }, []);
  return <Layout>
    <div className='w-full p-4'>
        <main className='w-[95vw]'>
            <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
                {publicVideos?.map((video, index) => (
                    <HeroVideoCard key={index} video={video} />
                ))}
            </div>
        </main>
    </div>
  </Layout>
};

export default AllVideos;