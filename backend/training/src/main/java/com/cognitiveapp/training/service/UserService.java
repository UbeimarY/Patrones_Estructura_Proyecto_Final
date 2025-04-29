package com.cognitiveapp.training.service;

import com.cognitiveapp.training.datastructures.BinarySearchTreeUsers;
import com.cognitiveapp.training.model.AppUser;
import com.cognitiveapp.training.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    
    // BST personalizado para ranking de usuarios
    private BinarySearchTreeUsers rankingTree = new BinarySearchTreeUsers();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AppUser registerUser(AppUser user) {
        AppUser newUser = userRepository.save(user);
        rankingTree.insert(newUser); 
        return newUser;
    }

    public AppUser loginUser(String username, String password) {
        AppUser user = userRepository.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
    
    // Método para obtener el ranking de usuarios usando in-order en el BST
    public List<AppUser> getRanking() {
        return rankingTree.inOrder();
    }
}
