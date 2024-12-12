import React, { useEffect, useState } from "react";
import "./Homepage.css";
import { useLoading } from "../context/LoadingContext";
import TestimonialsCarousel from "./Testimonials";
import anonymity from "../Assets/anonymity.jpg"
import community from "../Assets/community.jpg"
import reaction1 from "../Assets/reaction1.png"

const Homepage = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true); // Show the loader
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [setLoading]);


  return (
    <div className="homepage">
      {/* Section 1: Catchy Line */}
      <section className="catchy-line text-center">
        <h1 className="catchy-text">Get the Best Advice, Anytime, Anywhere! 💡✨</h1>
        <p className="subtext">Anonymous, unbiased, and always available. 📭‍♀️💬</p>
      </section>

      {/* Section 2: Button */}
      <section className="button-section text-center">
        <a href="/advices" className="btn btn-primary btn-lg btn-cta">
          Let the Party Begin 🎉🚀
        </a>
      </section>

      {/* Section 3: Benefits Section */}
      <section className="benefits-section container">
        <div className="row text-center">
          <div className="col-md-4">
            <div className="benefit-block">
              <img src={anonymity} className="benefit-image w-50"></img>
              <h3 className="benefit-title">Anonymity 🔶</h3>
              <p className="benefit-description">Share advice without revealing your identity. 😐</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="benefit-block">
            <img src={community} className="benefit-image w-50"></img>
              <h3 className="benefit-title">Community 🌍</h3>
              <p className="benefit-description">Join a diverse community of advice-givers and seekers. 🤝</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="benefit-block">
            <img src={reaction1} className="benefit-image w-50"></img>
              <h3 className="benefit-title">Reactions ❤️👍</h3>
              <p className="benefit-description">Get feedback with reactions to advice shared. 💬👁</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Testimonials Carousel */}
      <section className="testimonials-carousel">
        <h2 className="text-center">What People Are Saying 🌟</h2>
        <TestimonialsCarousel />
      </section>

      {/* Section 5: Social Media Proofs */}
      <section className="social-media-section text-center">
        <h2>Follow Us on Instagram 📸</h2>
        <div className="instagram-frames">
          {/* Instagram Frame placeholders */}
          <div className="instagram-frame"></div>
          <div className="instagram-frame"></div>
          <div className="instagram-frame"></div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;