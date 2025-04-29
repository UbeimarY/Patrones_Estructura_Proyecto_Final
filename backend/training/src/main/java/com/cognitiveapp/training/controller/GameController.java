package com.cognitiveapp.training.controller;

import com.cognitiveapp.training.model.Game;
import com.cognitiveapp.training.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService service;

    public GameController(GameService service) {
        this.service = service;
    }

    @GetMapping("/{type}")
    public ResponseEntity<List<Game>> getGamesByType(@PathVariable String type) {
        List<Game> games = service.getGamesByType(type);
        return ResponseEntity.ok(games);
    }
}
