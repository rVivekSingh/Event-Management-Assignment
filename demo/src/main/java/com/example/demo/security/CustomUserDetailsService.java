package com.example.demo.security;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional // To handle lazy loading of user events if needed
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email)
                );

        return UserPrincipal.create(user);
    }

    // This method is used by JWTAuthenticationFilter if you decide to load by ID
    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with id: " + id)
                );

        return UserPrincipal.create(user);
    }
}
