import React from 'react';
import { Link } from 'react-router-dom';
import './CallToAction.css';

const CallToAction = () => {
    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-content">
                    <h2>Ready to Take Action?</h2>
                    <p>
                        Your safety matters. If you or someone you know needs help, don't hesitate.
                        We are here to support you every step of the way.
                    </p>
                    <div className="cta-buttons">
                        <Link to="/chatbot">
                            <button className="btn-primary cta-btn">File a Report</button>
                        </Link>
                        <Link to="/resources">
                            <button className="btn-outline cta-btn-outline">View Resources</button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
