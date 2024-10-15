package com.example.demo.controller;

import com.example.demo.model.Event;
import com.example.demo.model.User;
import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.EventRequest;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EventService;
import com.example.demo.service.UserService;
import com.example.demo.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserService userService;

    private final UserRepository userRepository;

    // 3. GET /events: Retrieve all events (publicly accessible).
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    // 4. GET /events/{id}: Retrieve a specific event by its ID.
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(event -> ResponseEntity.ok(event))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Event()));
    }
//.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, "Event not found")
    // 5. POST /events: Create a new event (authenticated users).
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createEvent(@Valid @RequestBody EventRequest eventRequest,
                                         @AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userService.findByEmail(currentUser.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = Event.builder()
                .title(eventRequest.getTitle())
                .description(eventRequest.getDescription())
                .date(eventRequest.getDate())
                .location(eventRequest.getLocation())
                .build();

        Event createdEvent = eventService.createEvent(event, user);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    // 6. PUT /events/{id}: Update an event (only by the event creator).
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateEvent(@PathVariable Long id,
                                         @Valid @RequestBody EventRequest eventRequest,
                                         @AuthenticationPrincipal UserPrincipal currentUser) {

        return eventService.getEventById(id).map(existingEvent -> {
            if (!existingEvent.getCreatorId().equals(currentUser.getId())) {
                return new ResponseEntity<>(new ApiResponse(false, "Unauthorized"), HttpStatus.UNAUTHORIZED);
            }

            existingEvent.setTitle(eventRequest.getTitle());
            existingEvent.setDescription(eventRequest.getDescription());
            existingEvent.setDate(eventRequest.getDate());
            existingEvent.setLocation(eventRequest.getLocation());

            Event updatedEvent = eventService.updateEvent(existingEvent, existingEvent);
            return ResponseEntity.ok(updatedEvent);
        }).orElse(new ResponseEntity<>(new ApiResponse(false, "Event not found"), HttpStatus.NOT_FOUND));
    }

    // 7. DELETE /events/{id}: Delete an event (only by the event creator).
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id,
                                         @AuthenticationPrincipal UserPrincipal currentUser) {
        return eventService.getEventById(id).map(existingEvent -> {
            if (!existingEvent.getCreatorId().equals(currentUser.getId())) {
                return new ResponseEntity<>(new ApiResponse(false, "Unauthorized"), HttpStatus.UNAUTHORIZED);
            }

            eventService.deleteEvent(existingEvent);
            return ResponseEntity.ok(new ApiResponse(true, "Event deleted successfully"));
        }).orElse(new ResponseEntity<>(new ApiResponse(false, "Event not found"), HttpStatus.NOT_FOUND));
    }
}