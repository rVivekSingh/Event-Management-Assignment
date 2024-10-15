import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  
  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, events]);

  const fetchEvents = async () => {
    try {
        const response = await api.get('/events');
        setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const filterEvents = () => {
    const term = searchTerm.toLowerCase();
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
    );
    setFilteredEvents(filtered);
  };

  return (
    <div>
      <h2>All Events</h2>

      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text"><FaSearch /></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="row">
          {filteredEvents.map((event) => (
            <div key={event.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text">{event.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Date:</strong> {new Date(event.date).toLocaleString()}
                  </li>
                  <li className="list-group-item">
                    <strong>Location:</strong> {event.location}
                  </li>
                </ul>
                <div className="card-footer">
                  <Link to={`/events/${event.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default EventListPage;
