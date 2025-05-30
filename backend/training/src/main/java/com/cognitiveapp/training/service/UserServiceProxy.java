package com.cognitiveapp.training.service;

import com.cognitiveapp.training.model.AppUser;

/**
 * Proxy para agregar funcionalidades adicionales (por ejemplo, logging).
 */
public class UserServiceProxy implements IUserService {

    private final IUserService realService;
    
    public UserServiceProxy(IUserService realService) {
        this.realService = realService;
    }
    
    @Override
    public AppUser registerUser(AppUser user) {
        System.out.println("Inicio del registro para: " + user.getUsername());
        AppUser created = realService.registerUser(user);
        System.out.println("Registro completado: " + (created != null ? user.getUsername() : "Error"));
        return created;
    }
    
    @Override
    public AppUser loginUser(String username, String password) {
        System.out.println("Intentando login para: " + username);
        AppUser logged = realService.loginUser(username, password);
        System.out.println("Resultado del login: " + (logged != null ? "Exitoso" : "Fallido"));
        return logged;
    }
}
