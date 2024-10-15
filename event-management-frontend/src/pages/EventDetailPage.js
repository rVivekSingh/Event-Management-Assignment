import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/events/${id}`);
      setEvent(response.data);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Event not found.');
    }
  };
  const fetchUser = async () => {
    try {
      const response = await axios.get(`/users/id?userid=${event.creatorId}`);
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Event not found.');
    }
  };

  const getUserEmail = () => {
    fetchUser();

    if(user?.email){
      return user.email;
    }
    return null;
  }
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/events/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        navigate('/events');
      } catch (err) {
        console.error('Error deleting event:', err);
        setError('Failed to delete the event.');
      }
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!event) {
    return <div>Loading...</div>;
  }

  const isCreator = auth.user && event.creator && auth.user.email === event.creator.email;

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Created By:</strong> {event.creatorId} {getUserEmail()}
      </p>

      {isCreator && (
        <div className="mt-4">
          <Link to={`/edit-event/${event.id}`} className="btn btn-secondary me-2">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
