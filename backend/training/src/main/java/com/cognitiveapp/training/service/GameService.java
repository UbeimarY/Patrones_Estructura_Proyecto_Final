package com.cognitiveapp.training.service;

import com.cognitiveapp.training.datastructures.MyDynamicArray;
import com.cognitiveapp.training.model.Game;
import com.cognitiveapp.training.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameService {

    private final GameRepository repository;

    public GameService(GameRepository repository) {
        this.repository = repository;
    }

    // Recupera juegos y los almacena en un arreglo dinámico personalizado
    public List<Game> getGamesByType(String type) {
        List<Game> gamesFromRepo = repository.findAll();
        MyDynamicArray<Game> gameArray = new MyDynamicArray<>();
        for (Game game : gamesFromRepo) {
            if (game.getType().equalsIgnoreCase(type)) {
                gameArray.add(game);
            }
        }
        // Convertimos nuestro arreglo dinámico a un ArrayList para el retorno
        List<Game> result = new ArrayList<>();
        for (int i = 0; i < gameArray.size(); i++) {
            result.add(gameArray.get(i));
        }
        return result;
    }
}
