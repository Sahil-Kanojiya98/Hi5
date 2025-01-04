//package com.app.Echohub.service.Impl;
//
//import com.app.Echohub.dto.request.AuthRequest;
//import com.app.Echohub.dto.request.AuthTokenRefereshRequest;
//import com.app.Echohub.dto.request.RegisterRequest;
//import com.app.Echohub.dto.response.AuthResponse;
//import com.app.Echohub.dto.response.AuthTokenRefereshResponse;
//import com.app.Echohub.dto.response.RegisterResponse;
//import com.app.Echohub.exceptions.EntityNotFoundException;
//import com.app.Echohub.exceptions.EntityAlreadyExistsException;
//import com.app.Echohub.model.RefreshToken;
//import com.app.Echohub.model.User;
//import com.app.Echohub.repository.RefreshTokenRepository;
//import com.app.Echohub.repository.UserRepository;
//import com.app.Echohub.security.AuthenticationTokenServiceImpl;
//import com.app.Echohub.security.RefreshTokenService;
//import com.app.Echohub.service.AuthService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.Optional;
//
//@Service
//public class AuthServiceImpl implements AuthService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private BCryptPasswordEncoder bCryptPasswordEncoder;
//
//    @Autowired
//    private AuthenticationTokenServiceImpl jwtService;
//
//    @Autowired
//    private RefreshTokenService refreshTokenService;
//
//    @Autowired
//    private RefreshTokenRepository refreshTokenRepository;
//
//    @Override
//    public RegisterResponse registerUser(RegisterRequest registerRequest) throws EntityAlreadyExistsException {
//        System.out.println("register: "+registerRequest);
//        System.out.println(userRepository.findByEmail(registerRequest.getEmail()));
//        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
//            throw new EntityAlreadyExistsException("email already exsists!");
//        }
//        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()){
//            throw new EntityAlreadyExistsException("username already exsists!");
//        }
//        User user = User.builder()
//                .email(registerRequest.getEmail())
//                .username(registerRequest.getUsername())
//                .fullname(registerRequest.getFullname())
//                .password(bCryptPasswordEncoder.encode(registerRequest.getPassword()))
//                .build();
//        user.getRoles().add("ROLE_USER");
//        userRepository.save(user);
//        String accessToken = jwtService.generateToken(user.getEmail());
//        String refreshToken = refreshTokenService.generateToken(user.getEmail());
//        return RegisterResponse.builder()
//                .accessToken(accessToken)
//                .refreshToken(refreshToken)
//                .createdAt(LocalDateTime.now())
//                .build();
//    }
//
//    @Override
//    public AuthResponse authenticateUser(AuthRequest authRequest) throws EntityNotFoundException {
//        User user = userRepository.findByEmail(authRequest.getEmail())
//                .orElseThrow(() -> new EntityNotFoundException("Invalid username or password!"));
//        if (!bCryptPasswordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
//            throw new EntityAlreadyExistsException("Invalid username or password");
//        } else {
//            String accessToken = jwtService.generateToken(user.getEmail());
//            String refreshToken = refreshTokenService.generateToken(user.getEmail());
//            return AuthResponse.builder()
//                    .accessToken(accessToken)
//                    .refreshToken(refreshToken)
//                    .build();
//        }
//    }
//
//    @Override
//    public AuthTokenRefereshResponse rotateToken(AuthTokenRefereshRequest refereshRequest) {
//        return refreshTokenService.generateAuthTokenAndRotateRefreshToken(refereshRequest.getRefreshToken());
//    }
//
//    @Override
//    public String logout(String refreshToken) {
//        String username = refreshTokenService.extractUserName(refreshToken);
//        System.out.println("Username extracted: " + username);
//        User user = userRepository.findByEmail(username).orElseThrow(() -> new EntityNotFoundException("User not found!"));
//        Optional<RefreshToken> token = refreshTokenRepository.findByToken(refreshToken);
//        System.out.println("refresh tokens :"+user.getRefreshToken());
//        user.getRefreshToken().removeIf(t -> t.getToken().equals(refreshToken));
//        if (token.isPresent()) {
//            System.out.println("removing refresh: "+refreshToken);
//            refreshTokenRepository.deleteByToken(refreshToken);
//        }
//        userRepository.save(user);
//        return "Refresh token removed successfully";
//    }
//
//
//}
