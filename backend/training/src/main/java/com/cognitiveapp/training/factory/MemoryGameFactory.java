package com.cognitiveapp.training.factory;

import com.cognitiveapp.training.model.Game;

public class MemoryGameFactory extends GameFactory {
    @Override
    public Game createGame(String name, String description, int difficulty) {
        // Lógica real de inicialización para el juego de memoria
        return new Game(name, description, "memory", difficulty);
    }
}
