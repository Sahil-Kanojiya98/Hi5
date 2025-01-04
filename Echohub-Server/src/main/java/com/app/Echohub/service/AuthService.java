//package com.app.Echohub.service;
//
//import com.app.Echohub.dto.request.AuthRequest;
//import com.app.Echohub.dto.request.AuthTokenRefereshRequest;
//import com.app.Echohub.dto.request.RegisterRequest;
//import com.app.Echohub.dto.response.AuthResponse;
//import com.app.Echohub.dto.response.AuthTokenRefereshResponse;
//import com.app.Echohub.dto.response.RegisterResponse;
//import com.app.Echohub.exceptions.EntityNotFoundException;
//import com.app.Echohub.exceptions.EntityAlreadyExistsException;
//
//public interface AuthService {
//
//    RegisterResponse registerUser(RegisterRequest registerRequest) throws EntityAlreadyExistsException;
//
//    AuthResponse authenticateUser(AuthRequest authRequest) throws EntityNotFoundException;
//
//    AuthTokenRefereshResponse rotateToken(AuthTokenRefereshRequest refereshRequest);
//
//    String logout(String refreshToken);
//
//}
