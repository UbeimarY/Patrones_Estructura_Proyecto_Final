package com.cognitiveapp.training.service;

import com.cognitiveapp.training.model.AppUser;
import com.cognitiveapp.training.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AppUser registerUser(AppUser user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return null;
        }
        return userRepository.save(user);
    }

    @Override
    public AppUser loginUser(String username, String password) {
        AppUser user = userRepository.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}
