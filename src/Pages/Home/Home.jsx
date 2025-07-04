import React from 'react';
import Banner from './Banner';
import OurServices from './OurServices/OurServices';
import BrandSlider from './BrandSlider/BrandSlider';
import SpecialFeatures from './SpecialFeature/SpecialFeatures';
import BeMarchant from './BeMarchant/BeMarchant';
import HowItWorks from './HowItWorks/HowItWorks';
import TestimonialSlider from './TestimonialSlider/TestimonialSlider';

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <HowItWorks></HowItWorks>
      <OurServices></OurServices>
      <BrandSlider></BrandSlider>
      <SpecialFeatures></SpecialFeatures>
      <BeMarchant></BeMarchant>
      <TestimonialSlider></TestimonialSlider>
    </div>
  );
};

export default Home;