import React from 'react';
import {useState, useRef} from 'react'
import { useSelector } from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import './LandingPage.css';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';
import home from '../../assets/home-img.svg';
import join from '../../assets/join-hands-img.svg';
import find from '../../assets/find-img.svg';
import start from '../../assets/start-img.svg';
import connect from '../../assets/Connect.png';

function LandingPage({setAuthForm}) {
    const user = useSelector(state => state.session.user);
    const history = useHistory();

    const navigate = (route) => {
        history.push(route)
    }
    return (
      <div className="landing-page">
        <div className="top-section">
            <div className="topwords">
          <h1 className="headerwords">The people platform - where interests become friendships</h1>
          <p className="pwords">Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Connect. Events are happening every day—sign up to join the fun.</p>
            </div>
          <img src={home} className='home-image'/>
        </div>

        <section className="middle-section">
          <h2>How Connect works</h2>
          <p>Connect with new people who share your interests through online and in-person events. It’s free to create an account.</p>
        </section>

        <section className="features-section">
          <div className="feature">
          <img src={join} className='join-image'/>
            <h3>See all groups</h3>
            <p>Do what you love, connect with others who love it, find your community. The rest is history!</p>
          </div>
          <div className="feature">
          <img src={find} className='find-image'/>
            <h3>Find an event</h3>
            <p>Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</p>
          </div>
          <div className={`feature-startgroup${user ? "" : " disabled"}`}>
          <img src={start} className='start-image'/>
          <h3 className={user ? "" : "disabled-text"}>Start a new group</h3>
          {user ? (
            <p>
              You don’t have to be an expert to gather people together and explore
              shared interests.
            </p>
          ) : (
            <p className="disabled-text">
              You don’t have to be an expert to gather people together and explore
              shared interests.
            </p>
          )}
        </div>
        </section>

        <section className="join-section">
        {!user && (
          <OpenModalButton
            className="join-button"
            modalComponent={<SignupFormModal />}
            buttonText="Join MeetHere"
          />
        )}
      </section>
      </div>
    );
  }

  export default LandingPage;
