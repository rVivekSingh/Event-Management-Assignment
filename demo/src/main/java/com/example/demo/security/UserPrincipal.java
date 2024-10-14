package com.example.demo.security;

import com.example.demo.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserPrincipal implements UserDetails {
    private Long id;

    private String name;

    private String email;

    @JsonIgnore
    private String password;

    // Authorities (roles). For simplicity, we use ROLE_USER
    private Collection<? extends GrantedAuthority> authorities;

    public static UserPrincipal create(User user) {
        // For simplicity, all users have ROLE_USER
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_USER");
        return new UserPrincipal(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }

    @Override
    public String getUsername() {
        return email;
    }

    // Other overridden methods
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
