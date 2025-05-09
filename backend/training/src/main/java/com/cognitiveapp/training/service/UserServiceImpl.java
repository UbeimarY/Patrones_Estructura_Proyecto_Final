package com.cognitiveapp.training.service;

import com.cognitiveapp.training.datastructures.BinarySearchTreeUsers;
import com.cognitiveapp.training.model.AppUser;
import com.cognitiveapp.training.repository.UserRepository;

public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private BinarySearchTreeUsers rankingTree = new BinarySearchTreeUsers();

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AppUser registerUser(AppUser user) {
        AppUser newUser = userRepository.save(user);
        rankingTree.insert(newUser);
        return newUser;
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
