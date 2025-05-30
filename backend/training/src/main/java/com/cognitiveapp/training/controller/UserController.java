package com.cognitiveapp.training.controller;

import com.cognitiveapp.training.model.AppUser;
import com.cognitiveapp.training.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controlador REST para la gestión de usuarios.
 */
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserRepository userRepository;
    
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    // Listar todos los usuarios
    @GetMapping
    public ResponseEntity<List<AppUser>> getAllUsers() {
        List<AppUser> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    // Obtener detalles de un usuario por id
    @GetMapping("/{id}")
    public ResponseEntity<AppUser> getUserById(@PathVariable String id) {
        AppUser user = userRepository.findById(id).orElse(null);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.noContent().build();
    }
    
    // Actualizar información del usuario (por ejemplo, la ruta de entrenamiento o score)
    @PatchMapping("/{id}")
    public ResponseEntity<AppUser> updateUser(@PathVariable String id, @RequestBody AppUser updatedUser) {
        AppUser user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setTrainingRoute(updatedUser.getTrainingRoute());
            user.setScore(updatedUser.getScore());
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.badRequest().build();
    }
}
