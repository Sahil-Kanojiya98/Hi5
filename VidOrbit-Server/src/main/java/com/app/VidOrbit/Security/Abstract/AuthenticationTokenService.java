package com.app.VidOrbit.Security.Abstract;

import org.springframework.security.core.userdetails.UserDetails;

public interface AuthenticationTokenService {

    String generateToken(String name);

    String extractUserName(String token);

    boolean validateToken(String token, UserDetails userDetails);

    boolean isTokenExpired(String token);

}
