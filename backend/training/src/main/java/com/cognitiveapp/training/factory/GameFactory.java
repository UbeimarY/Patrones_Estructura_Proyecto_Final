package com.cognitiveapp.training.factory;

import com.cognitiveapp.training.model.Game;

public abstract class GameFactory {
    public abstract Game createGame(String name, String description, int difficulty);
    
    public static GameFactory getFactory(String type) {
        switch(type.toLowerCase()){
            case "memory":
                return new MemoryGameFactory();
            case "blackjack":
                return new BlackjackGameFactory();
            case "trivia":
                return new TriviaGameFactory();
            default:
                throw new IllegalArgumentException("Tipo de juego no soportado: " + type);
        }
    }
}
