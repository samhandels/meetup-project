import React from 'react';
import { useSelector } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './Footer.css';

const Footer = () => {
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <footer className="footer">
            <div className="footer-section">
                <h4>Discover</h4>
                <ul>
                    <li><a href="/groups">Groups</a></li>
                    <li><a href="/events">Events</a></li>
                </ul>
            </div>

            {!sessionUser && (
                <div className="footer-section">
                    <h5>Your Account</h5>
                    <ul>
                        <li>
                            <OpenModalButton
                                buttonText="Log In"
                                modalComponent={<LoginFormModal />}
                                className="login"
                            />
                        </li>
                        <li>
                            <OpenModalButton
                                buttonText="Sign Up"
                                modalComponent={<SignupFormModal />}
                                className="signup"
                            />
                        </li>
                    </ul>
                </div>
            )}

            <div className="footer-section">
                <h5>Follow Us</h5>
                <div className="github-linkedin">
                    <a href="https://www.linkedin.com/in/sam-handelsman/" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-linkedin"></i>
                    </a>
                    <a href="https://github.com/samhandels" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-github"></i>
                    </a>
                </div>
                <div>Technologies Utilized: Express, Sequelize, React, Redux, Javascript, HTML, CSS</div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2023 Connect. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
