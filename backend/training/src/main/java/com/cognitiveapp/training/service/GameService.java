package com.cognitiveapp.training.service;

import com.cognitiveapp.training.model.Game;
import com.cognitiveapp.training.repository.GameRepository;
import com.cognitiveapp.training.datastructures.MyLinkedList;
import com.cognitiveapp.training.datastructures.MyStack;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    // Obtiene el primer juego cuyo tipo coincida.
    public Game getGameByType(String type) {
        List<Game> games = gameRepository.findAll();
        for (Game g : games) {
            if (g.getType().equalsIgnoreCase(type)) {
                return g;
            }
        }
        return null;
    }
    
    // Registra un movimiento para el juego identificado por gameId.
    // Agrega el movimiento a la pila (para undo) y a la lista de historial.
    public void addMove(Long gameId, String move) {
        Game game = gameRepository.findById(gameId).orElse(null);
        if (game != null) {
            // Inicializa las estructuras si aún no están configuradas.
            if (game.getMoveStack() == null) {
                game.setMoveStack(new MyStack<>());
            }
            if (game.getMoveHistory() == null) {
                game.setMoveHistory(new MyLinkedList<>());
            }
            game.getMoveStack().push(move);
            game.getMoveHistory().add(move);
        }
    }
    
    // Deshace el último movimiento usando la pila.
    public String undoMove(Long gameId) {
        Game game = gameRepository.findById(gameId).orElse(null);
        if (game != null && game.getMoveStack() != null && !game.getMoveStack().isEmpty()) {
            return game.getMoveStack().pop();
        }
        return null;
    }
    
    // (Opcional) Retorna el historial de movimientos como String.
    public String getMoveHistory(Long gameId) {
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
