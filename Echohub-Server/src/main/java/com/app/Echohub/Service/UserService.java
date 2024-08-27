package com.app.Echohub.Service;

import com.app.Echohub.Model.User;

public interface UserService {
    User getUserByEmail(String email);

    void persist(User user);
}
