package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.model.User;

import java.util.List;
import java.util.Optional;

public interface EventService {
    public List<Event> getAllEvents();
    public Optional<Event> getEventById(Long id);
    public Event createEvent(Event event, User creator);
    public Event updateEvent(Event existingEvent, Event updatedEvent);
    public void deleteEvent(Event event);
}
