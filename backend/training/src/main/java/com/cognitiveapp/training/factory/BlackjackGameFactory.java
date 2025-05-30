package com.cognitiveapp.training.factory;

import com.cognitiveapp.training.model.Game;

public class BlackjackGameFactory extends GameFactory {
    @Override
    public Game createGame(String name, String description, int difficulty) {
        // Lógica real para inicializar un juego de Blackjack
        return new Game(name, description, "blackjack", difficulty);
    }
}
