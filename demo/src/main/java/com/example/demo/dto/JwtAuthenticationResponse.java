package com.example.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";

    public JwtAuthenticationResponse(String accessToken) {
        this.accessToken = accessToken;
    }
}
