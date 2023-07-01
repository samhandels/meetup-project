import React from 'react';
import {useState, useRef} from 'react'
import { useSelector } from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import './LandingPage.css';
import home from '../../assets/home-img.svg';

function LandingPage({setAuthForm}) {
    const user = useSelector(state => state.session.user);
    const history = useHistory();

    const navigate = (route) => {
        history.push(route)
    }
    return (
      <div className="landing-page">
        <section className="top-section">
          <h1>The people platform - where interests become friendships</h1>
          <p>Insert description here...</p>
          <img src={home} className='home-image'/>
        </section>

        <section className="middle-section">
          <h2>How Meetup works</h2>
          <p>Insert description here...</p>
        </section>

        <section className="features-section">
          <div className="feature">
            <h3>See all groups</h3>
            <p>Insert description here...</p>
          </div>
          <div className="feature">
            <h3>Find an event</h3>
            <p>Insert description here...</p>
          </div>
          <div className="feature">
            <h3>Start a new group</h3>
            <p>Insert description here...</p>
          </div>
        </section>

        <section className="join-section">
          <button className="join-button">Join Meetup</button>
        </section>
      </div>
    );
  }

  export default LandingPage;
