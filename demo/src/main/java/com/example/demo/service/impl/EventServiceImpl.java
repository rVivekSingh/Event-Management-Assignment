package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.model.User;
import com.example.demo.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    @Override
    public Event createEvent(Event event, User creator) {
        event.setCreatorId(creator.getId());
        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(Event existingEvent, Event updatedEvent) {
        existingEvent.setTitle(updatedEvent.getTitle());
        existingEvent.setDescription(updatedEvent.getDescription());
        existingEvent.setDate(updatedEvent.getDate());
        existingEvent.setLocation(updatedEvent.getLocation());
        return eventRepository.save(existingEvent);
    }

    @Override
    public void deleteEvent(Event event) {
        eventRepository.delete(event);
    }
}
