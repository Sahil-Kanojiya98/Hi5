package com.app.VidOrbit.Service;

import com.app.VidOrbit.Model.User;

public interface UserService {
    User getUserByEmail(String email);

    void persist(User user);
}
