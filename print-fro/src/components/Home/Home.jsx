import React from 'react';
import Header from '../Header/Header';
import Hero from './Hero/Hero';
import About from './About/About';
import Services from './Services/Services';
import Products from './Products/Products';
import Testimonials from './Testimonials/Testimonials';
import Principles from './Principles/Principles';
import Footer from '../Footer/Footer';


export const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <Hero />
      <About />
      <Services />
      <Products />
      <Testimonials />
      <Principles />
      <Footer />
    </div>
  );
};

