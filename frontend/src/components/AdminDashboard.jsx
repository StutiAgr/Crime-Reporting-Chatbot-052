import React from 'react';
import ComplaintTable from './ComplaintTable';
import Footer from './Footer';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      {/* Simplified Hero Section */}
      <section className="hero hero-admin">
        <div className="hero-text">
          <h1>Admin <span>Dashboard</span></h1>
          <p>
            Manage and oversee all crime reports. Review complaint statuses and take necessary actions.
          </p>
        </div>
      </section>

      {/* Complaint Table Section */}
      <section className="hero hero-complaints">
        <div className="hero-text complaints-section">
          <ComplaintTable />
        </div>
        <div className="hero-image">
        <img
          src="../home-page-img.png"
          alt="Illustration of woman reporting"
          height={"400px"}
          width={"300px"}
        />
      </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;
