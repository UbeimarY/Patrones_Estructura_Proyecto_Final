package com.cognitiveapp.training.service;

import com.cognitiveapp.training.model.Game;
import com.cognitiveapp.training.repository.GameRepository;
import com.cognitiveapp.training.datastructures.MyLinkedList;
import com.cognitiveapp.training.datastructures.MyStack;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Servicio para la lógica de los juegos.
 */
@Service
public class GameService {

    private final GameRepository gameRepository;
    
    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }
    
    // Retorna un juego por su tipo (por ejemplo, "memory")
    public Game getGameByType(String type) {
        List<Game> games = gameRepository.findAll();
        for (Game g : games) {
            if (g.getType().equalsIgnoreCase(type)) {
                return g;
            }
        }
        return null;
    }
    
    // Registra un movimiento en un juego
    public void addMove(String gameId, String move) {
        Game game = gameRepository.findById(gameId).orElse(null);
        if (game != null) {
            if (game.getMoveStack() == null)
                game.setMoveStack(new MyStack<>());
            if (game.getMoveHistory() == null)
                game.setMoveHistory(new MyLinkedList<>());
            game.getMoveStack().push(move);
            game.getMoveHistory().add(move);
            gameRepository.save(game);
        }
    }
    
    // Deshace el último movimiento
    public String undoMove(String gameId) {
        Game game = gameRepository.findById(gameId).orElse(null);
        if (game != null && game.getMoveStack() != null && !game.getMoveStack().isEmpty()) {
            String undone = game.getMoveStack().pop();
            gameRepository.save(game);
            return undone;
        }
        return null;
    }
    
    // Obtiene el historial de movimientos
    public String getMoveHistory(String gameId) {
        Game game = gameRepository.findById(gameId).orElse(null);
        if (game != null && game.getMoveHistory() != null) {
            StringBuilder sb = new StringBuilder();
            MyLinkedList<String> history = game.getMoveHistory();
            for (int i = 0; i < history.size(); i++) {
                sb.append(history.get(i)).append("; ");
            }
            return sb.toString();
        }
        return "";
    }
}
