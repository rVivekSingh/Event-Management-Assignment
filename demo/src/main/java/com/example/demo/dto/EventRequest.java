package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {

    @NotBlank
    private String title;

    private String description;

    @Future
    @NotNull
    private LocalDateTime date;

    @NotBlank
    private String location;
}
