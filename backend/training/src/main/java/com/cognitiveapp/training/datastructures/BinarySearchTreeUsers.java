package com.cognitiveapp.training.datastructures;

import com.cognitiveapp.training.model.AppUser;
import java.util.ArrayList;
import java.util.List;

public class BinarySearchTreeUsers {
    private Node root;

    private static class Node {
        AppUser user;
        Node left, right;
        Node(AppUser user) { this.user = user; }
    }

    // Inserta un usuario en el árbol basado en su puntaje.
    public void insert(AppUser user) {
        root = insertRec(root, user);
    }

    private Node insertRec(Node node, AppUser user) {
        if (node == null) {
            return new Node(user);
        }
        // Se coloca el usuario a la izquierda si su puntaje es menor,
        // de lo contrario, a la derecha.
        if (user.getScore() < node.user.getScore()) {
            node.left = insertRec(node.left, user);
        } else {
            node.right = insertRec(node.right, user);
        }
        return node;
    }

    // Realiza un recorrido in-order y devuelve la lista de usuarios ordenados por puntaje.
    public List<AppUser> inOrder() {
        List<AppUser> result = new ArrayList<>();
        inOrderRec(root, result);
        return result;
    }

    private void inOrderRec(Node node, List<AppUser> result) {
        if (node != null) {
            inOrderRec(node.left, result);
            result.add(node.user);
            inOrderRec(node.right, result);
        }
    }
}
