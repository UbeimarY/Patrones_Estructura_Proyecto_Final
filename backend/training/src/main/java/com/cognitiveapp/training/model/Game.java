package com.cognitiveapp.training.model;

import jakarta.persistence.*;
import jakarta.persistence.PostLoad;

@Entity
@Table(name = "game")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    private String type;       // Ej.: "memory", "logic", "concentration"
    private int difficulty;    // Nivel de dificultad

    // Campos transitorios para la funcionalidad de movimientos
    @Transient
    private com.cognitiveapp.training.datastructures.MyStack<String> moveStack;
    
    @Transient
    private com.cognitiveapp.training.datastructures.MyLinkedList<String> moveHistory;

    public Game() {
        this.moveStack = new com.cognitiveapp.training.datastructures.MyStack<>();
        this.moveHistory = new com.cognitiveapp.training.datastructures.MyLinkedList<>();
    }

    public Game(String name, String description, String type, int difficulty) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.difficulty = difficulty;
        this.moveStack = new com.cognitiveapp.training.datastructures.MyStack<>();
        this.moveHistory = new com.cognitiveapp.training.datastructures.MyLinkedList<>();
    }

    // @PostLoad para asegurar que se inicialicen las estructuras al cargar la entidad desde la DB.
    @PostLoad
    private void init() {
        if(moveStack == null) {
            moveStack = new com.cognitiveapp.training.datastructures.MyStack<>();
        }
        if(moveHistory == null) {
            moveHistory = new com.cognitiveapp.training.datastructures.MyLinkedList<>();
        }
    }

    // Getters y setters básicos
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
  
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
  
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
  
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
  
    public int getDifficulty() { return difficulty; }
    public void setDifficulty(int difficulty) { this.difficulty = difficulty; }
    
    // Getters y setters para las estructuras de movimientos (transitorios)
    public com.cognitiveapp.training.datastructures.MyStack<String> getMoveStack() {
        return moveStack;
    }
    public void setMoveStack(com.cognitiveapp.training.datastructures.MyStack<String> moveStack) {
        this.moveStack = moveStack;
    }
    public com.cognitiveapp.training.datastructures.MyLinkedList<String> getMoveHistory() {
        return moveHistory;
    }
    public void setMoveHistory(com.cognitiveapp.training.datastructures.MyLinkedList<String> moveHistory) {
        this.moveHistory = moveHistory;
    }
}
