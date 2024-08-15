package com.app.VidOrbit.Service.Impl;

import com.app.VidOrbit.DTO.Request.AuthRequest;
import com.app.VidOrbit.DTO.Request.AuthTokenRefereshRequest;
import com.app.VidOrbit.DTO.Request.RegisterRequest;
import com.app.VidOrbit.DTO.Response.AuthResponse;
import com.app.VidOrbit.DTO.Response.AuthTokenRefereshResponse;
import com.app.VidOrbit.DTO.Response.RegisterResponse;
import com.app.VidOrbit.Exceptions.UserNotFoundException;
import com.app.VidOrbit.Exceptions.UsernameAlreadyExistsException;
import com.app.VidOrbit.Model.User;
import com.app.VidOrbit.Repository.UserRepository;
import com.app.VidOrbit.Security.AuthenticationTokenServiceImpl;
import com.app.VidOrbit.Security.RefreshTokenService;
import com.app.VidOrbit.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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

    @Override
    public RegisterResponse registerUser(RegisterRequest registerRequest) throws UsernameAlreadyExistsException {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new UsernameAlreadyExistsException("Username already taken!");
        }
        User user = User.builder()
                .email(registerRequest.getEmail())
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
    public AuthResponse authenticateUser(AuthRequest authRequest) throws UserNotFoundException {
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new UserNotFoundException("user not found!"));
        if (!bCryptPasswordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            throw new UsernameAlreadyExistsException("Invalid username or password");
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
}
