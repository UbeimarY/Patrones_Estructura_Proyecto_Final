package com.cognitiveapp.training.model;

import jakarta.persistence.*;

@Entity
@Table(name = "app_user")
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;
    
    private String password; // En producción, se debe encriptar
    
    private int score;
    private String trainingRoute;

    public AppUser() {}

    public AppUser(String username, String password) {
        this.username = username;
        this.password = password;
        this.score = 0;
        this.trainingRoute = "";
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
  
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
  
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
  
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
  
    public String getTrainingRoute() { return trainingRoute; }
    public void setTrainingRoute(String trainingRoute) { this.trainingRoute = trainingRoute; }
}
