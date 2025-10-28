import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="about">
        <div className="about-content">
            <h2>About Us</h2>
            <p>
          We are dedicated to providing high quality online courses to help
          individuals learn and grow in their desired fields. Our experienced
          instruction ensure that each course is tailored for effective learning
          and practical application.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h3>Our Mission</h3>
            <p>
              Empower learners everywhere with affordable, industry-ready skills.
              We partner with experts to build practical, project-based content that
              translates into real outcomes.
            </p>
          </div>
          <div className="about-card">
            <h3>Why Choose Us</h3>
            <ul>
              <li>Up-to-date curriculum curated by practitioners</li>
              <li>Hands-on projects and case studies</li>
              <li>Lifetime access to purchased courses</li>
              <li>Certificate of completion</li>
              <li>Community Q&A and mentor tips</li>
            </ul>
          </div>
          <div className="about-card">
            <h3>What You’ll Learn</h3>
            <p>
              From fundamentals to advanced topics in Web Development, Data Science,
              Analytics, Python, and AI — master the tools top teams use every day.
            </p>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="num">50K+</span>
            <span className="label">Learners</span>
          </div>
          <div className="stat">
            <span className="num">120+</span>
            <span className="label">Expert-Led Courses</span>
          </div>
          <div className="stat">
            <span className="num">4.8/5</span>
            <span className="label">Average Rating</span>
          </div>
        </div>

        <div className="cta">
          <h3>Ready to start your learning journey?</h3>
          <p>Browse our catalog and pick the next skill to level up.</p>
          <a className="common-btn" href="/courses">Explore Courses</a>
        </div>

        </div>
    </div>
  );
};

export default About