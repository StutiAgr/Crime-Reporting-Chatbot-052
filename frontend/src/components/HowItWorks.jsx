import React from 'react';
import './HowItWorks.css';

const steps = [
    {
        id: 1,
        title: "Report Securely",
        description: "Fill out our secure, encrypted form. You can choose to remain anonymous or provide contact details.",
        icon: "🔒"
    },
    {
        id: 2,
        title: "Get Verified",
        description: "Our dedicated team reviews your report instantly and verifies the details while maintaining strict confidentiality.",
        icon: "✅"
    },
    {
        id: 3,
        title: "Receive Support",
        description: "Get connected with legal aid, counseling services, and law enforcement support tailored to your needs.",
        icon: "🤝"
    }
];

const HowItWorks = () => {
    return (
        <section className="how-it-works-section">
            <div className="container">
                <h2 className="section-title">How It Works</h2>
                <p className="section-subtitle">A simple, secure, and supportive process designed for your safety.</p>

                <div className="steps-container">
                    <div className="steps-line"></div>
                    {steps.map((step) => (
                        <div key={step.id} className="step-card">
                            <div className="step-icon-wrapper">
                                <div className="step-icon">{step.icon}</div>
                                <div className="step-number">{step.id}</div>
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
