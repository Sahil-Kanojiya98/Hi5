package com.app.VidOrbit.Service;

import com.app.VidOrbit.DTO.Request.AuthRequest;
import com.app.VidOrbit.DTO.Request.AuthTokenRefereshRequest;
import com.app.VidOrbit.DTO.Request.RegisterRequest;
import com.app.VidOrbit.DTO.Response.AuthResponse;
import com.app.VidOrbit.DTO.Response.AuthTokenRefereshResponse;
import com.app.VidOrbit.DTO.Response.RegisterResponse;
import com.app.VidOrbit.Exceptions.UserNotFoundException;
import com.app.VidOrbit.Exceptions.UsernameAlreadyExistsException;

public interface AuthService {

    RegisterResponse registerUser(RegisterRequest registerRequest) throws UsernameAlreadyExistsException;

    AuthResponse authenticateUser(AuthRequest authRequest) throws UserNotFoundException;

    AuthTokenRefereshResponse rotateToken(AuthTokenRefereshRequest refereshRequest);
}
