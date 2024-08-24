package com.app.VidOrbit.Service;

import com.app.VidOrbit.DTO.Request.AuthRequest;
import com.app.VidOrbit.DTO.Request.AuthTokenRefereshRequest;
import com.app.VidOrbit.DTO.Request.RegisterRequest;
import com.app.VidOrbit.DTO.Response.AuthResponse;
import com.app.VidOrbit.DTO.Response.AuthTokenRefereshResponse;
import com.app.VidOrbit.DTO.Response.RegisterResponse;
import com.app.VidOrbit.Exceptions.EntityNotFoundException;
import com.app.VidOrbit.Exceptions.EntityAlreadyExistsException;

public interface AuthService {

    RegisterResponse registerUser(RegisterRequest registerRequest) throws EntityAlreadyExistsException;

    AuthResponse authenticateUser(AuthRequest authRequest) throws EntityNotFoundException;

    AuthTokenRefereshResponse rotateToken(AuthTokenRefereshRequest refereshRequest);
}
