package com.app.Echohub.Service;

import com.app.Echohub.DTO.Request.AuthRequest;
import com.app.Echohub.DTO.Request.AuthTokenRefereshRequest;
import com.app.Echohub.DTO.Request.RegisterRequest;
import com.app.Echohub.DTO.Response.AuthResponse;
import com.app.Echohub.DTO.Response.AuthTokenRefereshResponse;
import com.app.Echohub.DTO.Response.RegisterResponse;
import com.app.Echohub.Exceptions.EntityNotFoundException;
import com.app.Echohub.Exceptions.EntityAlreadyExistsException;

public interface AuthService {

    RegisterResponse registerUser(RegisterRequest registerRequest) throws EntityAlreadyExistsException;

    AuthResponse authenticateUser(AuthRequest authRequest) throws EntityNotFoundException;

    AuthTokenRefereshResponse rotateToken(AuthTokenRefereshRequest refereshRequest);

    String logout(String refreshToken);

}
