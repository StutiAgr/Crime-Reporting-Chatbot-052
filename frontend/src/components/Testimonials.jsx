import React from 'react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: "Pragya J.",
    role: "User",
    content: "This platform gave me the courage to speak up. The anonymity feature made me feel safe throughout the process.",
    avatar: "P"
  },
  {
    id: 2,
    name: "Vaishali",
    role: "Community Member",
    content: "A much-needed resource. The guidance provided on legal rights was incredibly helpful during a difficult time.",
    avatar: "V"
  },
  {
    id: 3,
    name: "Priya M.",
    role: "Advocate",
    content: "The interface is so easy to use. It empowers women to take action without fear of judgment.",
    avatar: "P"
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="section-title">Voices of Courage</h2>
        <p className="section-subtitle">Hear from those who have found support and justice through our platform.</p>

        <div className="testimonials-grid">
          {testimonials.map((item) => (
            <div key={item.id} className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-text">{item.content}</p>
              <div className="testimonial-author">
                <div className="avatar">{item.avatar}</div>
                <div className="author-info">
                  <h4>{item.name}</h4>
                  <span>{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
