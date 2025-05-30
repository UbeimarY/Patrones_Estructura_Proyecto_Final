package com.cognitiveapp.training.facade;

import com.cognitiveapp.training.factory.GameFactory;
import com.cognitiveapp.training.manager.GameManager;
import com.cognitiveapp.training.model.Game;

/**
 * Facade para simplificar la interacción del jugador.
 */
public class GameFacade {
    private GameManager gameManager = GameManager.getInstance();
    
    public Game createAndRegisterGame(String type, String name, String description, int difficulty) {
        GameFactory factory = GameFactory.getFactory(type);
        Game game = factory.createGame(name, description, difficulty);
        if (game.getId() == null) {
            // Generamos un id único, en una implementación real MongoDB asigna el id tras persistir
            game.setId(String.valueOf(System.currentTimeMillis()));
        }
        gameManager.addGame(game.getId(), game);
        return game;
    }
    
    // Aquí agregarías otros métodos para gestionar conexiones a "servidores" o rankings.
}
