package com.cognitiveapp.training.controller;

import com.cognitiveapp.training.model.AppUser;
import com.cognitiveapp.training.service.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para autenticación de usuarios.
 */
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final IUserService userService;

    public AuthController(IUserService userService) {
        this.userService = userService;
    }

    // Endpoint para registrar un usuario
    @PostMapping("/register")
    public ResponseEntity<AppUser> register(@RequestBody AppUser user) {
        AppUser createdUser = userService.registerUser(user);
        if (createdUser != null) {
            return ResponseEntity.ok(createdUser);
        }
        return ResponseEntity.badRequest().build();
    }

    // Endpoint para iniciar sesión
    @PostMapping("/login")
    public ResponseEntity<AppUser> login(@RequestBody AppUser credentials) {
        AppUser user = userService.loginUser(credentials.getUsername(), credentials.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).build();
    }
}
