package com.cognitiveapp.training.controller;

import com.cognitiveapp.training.model.Game;
import com.cognitiveapp.training.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para gestionar juegos.
 */
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    // Devuelve el primer juego del tipo solicitado (p.ej, "memory", "logic")
    @GetMapping("/{type}")
    public ResponseEntity<Game> getGameByType(@PathVariable String type) {
        Game game = gameService.getGameByType(type);
        if (game != null) {
            return ResponseEntity.ok(game);
        }
        return ResponseEntity.noContent().build();
    }

    // Registra un movimiento en el juego (se guarda en la pila para undo y en el historial)
    @PostMapping("/{id}/move")
    public ResponseEntity<String> addMove(@PathVariable Long id, @RequestBody String move) {
        gameService.addMove(id, move);
        return ResponseEntity.ok("Movimiento registrado correctamente.");
    }

    // Deshace el último movimiento del juego
    @PostMapping("/{id}/undo")
    public ResponseEntity<String> undoMove(@PathVariable Long id) {
        String undone = gameService.undoMove(id);
        if (undone != null) {
            return ResponseEntity.ok("Se deshizo el movimiento: " + undone);
        }
        return ResponseEntity.badRequest().body("No hay movimiento para deshacer.");
    }
}
