package com.app.Echohub.Service.Impl;

import com.app.Echohub.DTO.Request.AuthRequest;
import com.app.Echohub.DTO.Request.AuthTokenRefereshRequest;
import com.app.Echohub.DTO.Request.RegisterRequest;
import com.app.Echohub.DTO.Response.AuthResponse;
import com.app.Echohub.DTO.Response.AuthTokenRefereshResponse;
import com.app.Echohub.DTO.Response.RegisterResponse;
import com.app.Echohub.Exceptions.EntityNotFoundException;
import com.app.Echohub.Exceptions.EntityAlreadyExistsException;
import com.app.Echohub.Model.RefreshToken;
import com.app.Echohub.Model.User;
import com.app.Echohub.Repository.RefreshTokenRepository;
import com.app.Echohub.Repository.UserRepository;
import com.app.Echohub.Security.AuthenticationTokenServiceImpl;
import com.app.Echohub.Security.RefreshTokenService;
import com.app.Echohub.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private AuthenticationTokenServiceImpl jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Override
    public RegisterResponse registerUser(RegisterRequest registerRequest) throws EntityAlreadyExistsException {
        System.out.println("register: "+registerRequest);
        System.out.println(userRepository.findByEmail(registerRequest.getEmail()));
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new EntityAlreadyExistsException("email already exsists!");
        }
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()){
            throw new EntityAlreadyExistsException("username already exsists!");
        }
        User user = User.builder()
                .email(registerRequest.getEmail())
                .username(registerRequest.getUsername())
                .fullname(registerRequest.getFullname())
                .password(bCryptPasswordEncoder.encode(registerRequest.getPassword()))
                .build();
        userRepository.save(user);
        String accessToken = jwtService.generateToken(user.getEmail());
        String refreshToken = refreshTokenService.generateToken(user.getEmail());
        return RegisterResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Override
    public AuthResponse authenticateUser(AuthRequest authRequest) throws EntityNotFoundException {
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Invalid username or password!"));
        if (!bCryptPasswordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            throw new EntityAlreadyExistsException("Invalid username or password");
        } else {
            String accessToken = jwtService.generateToken(user.getEmail());
            String refreshToken = refreshTokenService.generateToken(user.getEmail());
            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();
        }
    }

    @Override
    public AuthTokenRefereshResponse rotateToken(AuthTokenRefereshRequest refereshRequest) {
        return refreshTokenService.generateAuthTokenAndRotateRefreshToken(refereshRequest.getRefreshToken());
    }

    @Override
    public String logout(String refreshToken) {
        String username = refreshTokenService.extractUserName(refreshToken);
        System.out.println("Username extracted: " + username);
        User user = userRepository.findByEmail(username).orElseThrow(() -> new EntityNotFoundException("User not found!"));
        Optional<RefreshToken> token = refreshTokenRepository.findByToken(refreshToken);
        System.out.println("refresh tokens :"+user.getRefreshToken());
        user.getRefreshToken().removeIf(t -> t.getToken().equals(refreshToken));
        if (token.isPresent()) {
            refreshTokenRepository.deleteByToken(refreshToken);
        }
        userRepository.save(user);
        return "Refresh token removed successfully";
    }
}
