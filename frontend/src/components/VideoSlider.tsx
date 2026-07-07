import React from 'react'
import Slider from 'react-slick'
import type { IVideo } from '../reducers/video/videoReducer';
import HeroVideoCard from './HeroVideoCard';

interface VideoSliderProps {
    videos: IVideo[] | null;
};

const VideoSlider: React.FC<VideoSliderProps> = ({ videos }) => {
    const sliderSetting = {
        infinite: true,
        speed: 500,                     // Transition animation duration (while moving to next slide)
        slidesToShow: 5,                 // screen width >=1024px show 5 slides
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,       // screen width 768-1024px show 5 slides
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };
  return <Slider {...sliderSetting}>
    {videos?.map((video) => (
        <HeroVideoCard key={video._id} video={video} />
    ))}
  </Slider>
};

export default VideoSlider;