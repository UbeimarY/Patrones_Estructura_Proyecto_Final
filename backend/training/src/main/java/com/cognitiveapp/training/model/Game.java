package com.cognitiveapp.training.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.annotation.PostConstruct;  // Usamos javax para mantener la versión antigua
import com.cognitiveapp.training.datastructures.MyStack;
import com.cognitiveapp.training.datastructures.MyLinkedList;

/**
 * Modelo de juego para la plataforma de entrenamiento cognitivo.
 * Se persiste en MongoDB en la colección "game".
 */
@Document(collection = "game")
public class Game {

    @Id
    private String id;
    
    private String name;
    private String description;
    private String type;      // Por ejemplo: "memory", "blackjack", "trivia"
    private int difficulty;
    
    // Campos transitorios que se usan para gestionar los movimientos y el historial (no se persistirán)
    private transient MyStack<String> moveStack;
    private transient MyLinkedList<String> moveHistory;
    
    // Constructor por defecto
    public Game() {
        this.moveStack = new MyStack<>();
        this.moveHistory = new MyLinkedList<>();
    }
    
    // Constructor parametrizado
    public Game(String name, String description, String type, int difficulty) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.difficulty = difficulty;
        this.moveStack = new MyStack<>();
        this.moveHistory = new MyLinkedList<>();
    }
    
    // Método de inicialización para asegurarse de que las estructuras de datos estén instanciadas.
    @PostConstruct
    public void init() {
        if (moveStack == null) {
            moveStack = new MyStack<>();
        }
        if (moveHistory == null) {
            moveHistory = new MyLinkedList<>();
        }
    }
    
    // Getters y setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
       this.id = id;
    }

    public String getName() {
       return name;
    }

    public void setName(String name) {
       this.name = name;
    }

    public String getDescription() {
       return description;
    }

    public void setDescription(String description) {
       this.description = description;
    }

    public String getType() {
       return type;
    }

    public void setType(String type) {
       this.type = type;
    }

    public int getDifficulty() {
       return difficulty;
    }

    public void setDifficulty(int difficulty) {
       this.difficulty = difficulty;
    }

    public MyStack<String> getMoveStack() {
       return moveStack;
    }

    public void setMoveStack(MyStack<String> moveStack) {
       this.moveStack = moveStack;
    }

    public MyLinkedList<String> getMoveHistory() {
       return moveHistory;
    }

    public void setMoveHistory(MyLinkedList<String> moveHistory) {
       this.moveHistory = moveHistory;
    }
}
