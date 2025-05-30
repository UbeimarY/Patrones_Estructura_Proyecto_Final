package com.cognitiveapp.training.controller;

import com.cognitiveapp.training.model.Game;
import com.cognitiveapp.training.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para la gestión y operación de juegos.
 */
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/games")
public class GameController {
    
    private final GameService gameService;
    
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }
    
    // Obtener juego por tipo (ej. memory, blackjack, trivia)
    @GetMapping("/{type}")
    public ResponseEntity<Game> getGameByType(@PathVariable String type) {
        Game game = gameService.getGameByType(type);
        if (game != null) {
            return ResponseEntity.ok(game);
        }
        return ResponseEntity.noContent().build();
    }
    
    // Obtener detalles de un juego por su id
    @GetMapping("/detail/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable String id) {
        Game game = gameService.getGameByType(id); // Alternativamente puedes buscar por id
        if (game != null) {
            return ResponseEntity.ok(game);
        }
        return ResponseEntity.noContent().build();
    }
    
    // Registrar un movimiento en una partida
    @PostMapping("/{id}/move")
    public ResponseEntity<String> addMove(@PathVariable String id, @RequestBody String move) {
        gameService.addMove(id, move);
        return ResponseEntity.ok("Movimiento registrado correctamente.");
    }
    
    // Deshacer el último movimiento
    @PostMapping("/{id}/undo")
    public ResponseEntity<String> undoMove(@PathVariable String id) {
        String undone = gameService.undoMove(id);
        if (undone != null) {
            return ResponseEntity.ok("Se deshizo el movimiento: " + undone);
        }
        return ResponseEntity.badRequest().body("No hay movimiento para deshacer.");
    }
    
    // Consultar historial de movimientos
    @GetMapping("/{id}/history")
    public ResponseEntity<String> getMoveHistory(@PathVariable String id) {
        String history = gameService.getMoveHistory(id);
        return ResponseEntity.ok(history);
    }
    
    // Registrar puntuación final (endpoint de ejemplo para actualizar el puntaje)
    @PostMapping("/{id}/score")
    public ResponseEntity<String> submitScore(@PathVariable String id, @RequestBody int score) {
        // Aquí se podría actualizar el puntaje del juego o del usuario (lógica de negocio adicional)
        // Por ejemplo, actualizar el puntaje en el modelo Game y luego persistirlo.
        Game game = gameService.getGameByType(id);
        if (game != null) {
            // Ejemplo: actualizar la dificultad a modo de puntaje (modifica según tu lógica)
            game.setDifficulty(score);
            // Se podría guardar de nuevo el juego si es necesario
            return ResponseEntity.ok("Puntaje actualizado a: " + score);
        }
        return ResponseEntity.badRequest().body("Juego no encontrado.");
    }
}
