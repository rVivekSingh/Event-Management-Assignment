import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="text-center">
    <h1>Welcome to Event Manager</h1>
    <p>
      <Link to="/events" className="btn btn-primary mt-3">
        View Events
      </Link>
    </p>
  </div>
);

export default Home;
