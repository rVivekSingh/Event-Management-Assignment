import React, { useEffect, useState, useContext } from 'react';
import { useFormik } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from '../api/api';
import { AuthContext } from '../context/AuthContext';

const EventFormPage = () => {
  const { id } = useParams(); // If 'id' exists, it's edit mode
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [error, setError] = useState('');

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/events/${id}`);
      const eventData = response.data;
      setInitialValues({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date.slice(0, 16), // Format for datetime-local input
        location: eventData.location,
      });
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to load event data.');
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    date: Yup.date()
      .required('Date and time are required')
      .min(new Date(), 'Date must be in the future'),
    location: Yup.string().required('Location is required'),
    description: Yup.string(),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await axios.put(`/events/${id}`, values, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        navigate(`/events/${id}`);
      } else {
        await axios.post('/events', values, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        navigate('/events');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit the form.');
    }
    setSubmitting(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h2>{isEditMode ? 'Edit Event' : 'Create Event'}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="invalid-feedback">{formik.errors.title}</div>
            ) : null}
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              className={`form-control ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              rows="4"
            ></textarea>
            {formik.touched.description && formik.errors.description ? (
              <div className="invalid-feedback">{formik.errors.description}</div>
            ) : null}
          </div>

          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date and Time *</label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              className={`form-control ${formik.touched.date && formik.errors.date ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.date}
            />
            {formik.touched.date && formik.errors.date ? (
              <div className="invalid-feedback">{formik.errors.date}</div>
            ) : null}
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location *</label>
            <input
              id="location"
              name="location"
              type="text"
              className={`form-control ${formik.touched.location && formik.errors.location ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.location}
            />
            {formik.touched.location && formik.errors.location ? (
              <div className="invalid-feedback">{formik.errors.location}</div>
            ) : null}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={formik.isSubmitting || auth.loading}
          >
            {isEditMode ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventFormPage;
