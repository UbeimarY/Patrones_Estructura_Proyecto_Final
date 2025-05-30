package com.cognitiveapp.training.manager;

import com.cognitiveapp.training.model.Game;
import java.util.HashMap;
import java.util.Map;

/**
 * GameManager es un Singleton que administra las partidas activas.
 */
public class GameManager {
    private static GameManager instance;
    private Map<String, Game> activeGames;
    
    private GameManager() {
        activeGames = new HashMap<>();
    }
    
    public static synchronized GameManager getInstance() {
        if (instance == null) {
            instance = new GameManager();
        }
        return instance;
    }
    
    public void addGame(String id, Game game) {
        activeGames.put(id, game);
    }
    
    public Game getGame(String id) {
        return activeGames.get(id);
    }
    
    public void removeGame(String id) {
        activeGames.remove(id);
    }
}
