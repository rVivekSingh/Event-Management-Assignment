package com.example.demo.service;

import com.example.demo.model.User;

import java.util.Optional;

public interface UserService {
    public User registerUser(User user);
    public Optional<User> findByEmail(String email);

    public Optional<User> findById(Long id);
}
