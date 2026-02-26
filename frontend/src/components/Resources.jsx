import React from 'react';
import { Link } from 'react-router-dom';
import './Resources.css';

const Resources = () => {
  return (
    <section id="resources" className="resources">
      <h2>Helpful Resources</h2>
      <div className="resource-cards">
        <div className="card">
          <h3>24/7 Helpline</h3>
          <p>Call 1091 for immediate assistance.</p>
        </div>
      </div>
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to="/resources">
          <button className="btn-primary">View All Resources</button>
        </Link>
      </div>
    </section>
  );
};

export default Resources;
