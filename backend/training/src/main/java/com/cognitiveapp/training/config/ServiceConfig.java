package com.cognitiveapp.training.config;

import com.cognitiveapp.training.repository.UserRepository;
import com.cognitiveapp.training.service.IUserService;
import com.cognitiveapp.training.service.UserServiceImpl;
import com.cognitiveapp.training.service.UserServiceProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
  Configuración de beans: se definen los beans para el servicio de usuario.
  Se utiliza Proxy para agregar funcionalidades (logging) 
 */
@Configuration
public class ServiceConfig {

    @Bean
    public UserServiceImpl realUserService(UserRepository userRepository) {
        return new UserServiceImpl(userRepository);
    }

    @Bean
    public IUserService userService(UserServiceImpl realUserService) {
        return new UserServiceProxy(realUserService);
    }
}
