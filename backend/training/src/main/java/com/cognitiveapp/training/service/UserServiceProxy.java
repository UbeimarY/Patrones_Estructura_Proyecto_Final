package com.cognitiveapp.training.service;

import com.cognitiveapp.training.model.AppUser;

public class UserServiceProxy implements IUserService {

    private final IUserService realService;

    public UserServiceProxy(IUserService realService) {
        this.realService = realService;
    }

    @Override
    public AppUser registerUser(AppUser user) {
        System.out.println("Inicio del registro para el usuario: " + user.getUsername());
        AppUser createdUser = realService.registerUser(user);
        System.out.println("Registro completado para el usuario: " + user.getUsername());
        return createdUser;
    }

    @Override
    public AppUser loginUser(String username, String password) {
        System.out.println("Intentando iniciar sesión para el usuario: " + username);
        AppUser loggedUser = realService.loginUser(username, password);
        if (loggedUser != null) {
            System.out.println("Inicio de sesión exitoso para el usuario: " + username);
        } else {
            System.out.println("Fallo en el inicio de sesión para el usuario: " + username);
        }
        return loggedUser;
    }
}
