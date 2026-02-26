import React from 'react';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

const Home = () => {
  return (
    <div className="landing">
      <Hero />
      <HowItWorks />
      <About />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
