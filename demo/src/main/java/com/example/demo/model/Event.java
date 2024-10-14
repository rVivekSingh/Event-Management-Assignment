package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    private String description;

    @Future
    private LocalDateTime date;

    @NotBlank
    private String location;

    // Relationship to User (creator)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;
}
