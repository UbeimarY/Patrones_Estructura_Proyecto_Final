package com.cognitiveapp.training.config;

import com.cognitiveapp.training.repository.UserRepository;
import com.cognitiveapp.training.service.IUserService;
import com.cognitiveapp.training.service.UserServiceImpl;
import com.cognitiveapp.training.service.UserServiceProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
