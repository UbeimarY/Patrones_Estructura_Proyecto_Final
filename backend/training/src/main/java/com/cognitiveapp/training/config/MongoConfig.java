package com.cognitiveapp.training.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoConfig {

    @Bean
    public MongoClient mongoClient() {
        // Aquí se define la cadena de conexión con tu clúster. 
        // Asegúrate de incluir el nombre de la base de datos al final si lo deseas, 
        // en este caso se usará "CognitiveGamesDB".
        ConnectionString connectionString = new ConnectionString(
            "mongodb+srv://camilotorosan:jOW87pz5laeUEJyM@cluster0.w7kx3st.mongodb.net/CognitiveGamesDB?retryWrites=true&w=majority&appName=Cluster0"
        );
        MongoClientSettings settings = MongoClientSettings.builder()
            .applyConnectionString(connectionString)
            .build();
        return MongoClients.create(settings);
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        // El segundo parámetro es el nombre de la base de datos que se usará.
        return new MongoTemplate(mongoClient(), "CognitiveGamesDB");
    }
}
