import React from 'react';
import './ResourcesPage.css';

const ResourcesPage = () => {
    return (
        <div className="resources-page">
            {/* Hero Section */}
            <section className="resources-hero">
                <div className="container">
                    <h1>Resources & Support</h1>
                    <p>You are not alone. Access emergency helplines, legal guides, and support services.</p>
                </div>
            </section>

            {/* Emergency Contacts Banner */}
            <section className="emergency-banner">
                <div className="container">
                    <div className="emergency-card" style={{ margin: "2rem" }}>
                        <h2>🚨 Immediate Assistance</h2>
                        <div className="helpline-grid">
                            <div className="helpline-item">
                                <h3>National Women's Helpline</h3>
                                <a href="tel:1091">1091</a>
                            </div>
                            <div className="helpline-item">
                                <h3>Domestic Violence Helpline</h3>
                                <a href="tel:181">181</a>
                            </div>
                            <div className="helpline-item">
                                <h3>Police</h3>
                                <a href="tel:100">100 / 112</a>
                            </div>
                            <div className="helpline-item">
                                <h3>Cyber Crime Helpline</h3>
                                <a href="tel:1930">1930</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Resource Categories */}
            < section className="resource-categories" >
                <div className="container">
                    <h2>Explore Resources</h2>
                    <div className="categories-grid">
                        <div className="category-card">
                            <h3>⚖️ Legal Rights</h3>
                            <p>Understand your legal protections under IPC and special laws for women.</p>
                            <ul>
                                <li>Right to Zero FIR</li>
                                <li>Protection from Domestic Violence Act</li>
                                <li>Workplace Harassment Laws</li>
                            </ul>
                        </div>
                        <div className="category-card">
                            <h3>🧘 Mental Health</h3>
                            <p>Professional counseling and support for trauma survivors.</p>
                            <ul>
                                <li>Trauma Counseling</li>
                                <li>Support Groups</li>
                                <li>Rehabilitation Services</li>
                            </ul>
                        </div>
                        <div className="category-card">
                            <h3>💻 Cyber Safety</h3>
                            <p>Protect yourself online and report digital crimes.</p>
                            <ul>
                                <li>Securing Social Media</li>
                                <li>Reporting Cyber Stalking</li>
                                <li>Online Banking Safety</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section >

            {/* FAQ Section */}
            < section className="faq-section" >
                <div className="container">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4>Can I file a report anonymously?</h4>
                            <p>Yes, our platform allows you to submit reports without revealing your identity. However, providing details can help in quicker investigation.</p>
                        </div>
                        <div className="faq-item">
                            <h4>What is a Zero FIR?</h4>
                            <p>A Zero FIR allows you to file a complaint at any police station, regardless of the jurisdiction where the crime occurred.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Is legal aid free?</h4>
                            <p>Yes, women are entitled to free legal aid under the Legal Services Authorities Act, 1987 in India.</p>
                        </div>
                    </div>
                </div>
            </section >

            {/* External Links */}
            < section className="external-links" >
                <div className="container">
                    <h2>Helpful Organizations & Links</h2>
                    <div className="links-list">
                        <a href="https://ncw.nic.in/" target="_blank" rel="noopener noreferrer">National Commission for Women</a>
                        <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">National Cyber Crime Reporting Portal</a>
                        <a href="https://nalsa.gov.in/" target="_blank" rel="noopener noreferrer">National Legal Services Authority</a>
                    </div>
                </div>
            </section >
        </div >
    );
};

export default ResourcesPage;
