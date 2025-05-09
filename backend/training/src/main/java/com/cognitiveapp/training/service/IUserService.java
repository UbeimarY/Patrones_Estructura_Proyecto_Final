package com.cognitiveapp.training.service;

import com.cognitiveapp.training.model.AppUser;

public interface IUserService {
    AppUser registerUser(AppUser user);
    AppUser loginUser(String username, String password);
}
