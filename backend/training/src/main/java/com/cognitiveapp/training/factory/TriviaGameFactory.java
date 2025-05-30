package com.cognitiveapp.training.factory;

import com.cognitiveapp.training.model.Game;

public class TriviaGameFactory extends GameFactory {
    @Override
    public Game createGame(String name, String description, int difficulty) {
        // Lógica real para inicializar un juego de Trivia
        return new Game(name, description, "trivia", difficulty);
    }
}
