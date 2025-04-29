package com.cognitiveapp.training.controller;

import com.cognitiveapp.training.model.AppUser;
import com.cognitiveapp.training.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AppUser> register(@RequestBody AppUser user) {
        AppUser createdUser = userService.registerUser(user);
        if (createdUser != null) {
            return ResponseEntity.ok(createdUser);
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AppUser> login(@RequestBody AppUser credentials) {
        AppUser user = userService.loginUser(credentials.getUsername(), credentials.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).build();
    }
}
