package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.dto.*;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(registerRequest.getPassword())
                .build();
        try {
            User result = userService.registerUser(user);
            return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
        } catch (RuntimeException ex) {
            return new ResponseEntity<>(new ApiResponse(false, ex.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken((UserPrincipal) authentication.getPrincipal());
            return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
        } catch (BadCredentialsException ex) {
            return new ResponseEntity<>(new ApiResponse(false, "Invalid email or password"), HttpStatus.UNAUTHORIZED);
        }
    }
}
