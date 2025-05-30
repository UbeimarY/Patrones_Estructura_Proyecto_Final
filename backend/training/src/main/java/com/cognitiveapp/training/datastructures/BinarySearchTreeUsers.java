package com.cognitiveapp.training.datastructures;

import com.cognitiveapp.training.model.AppUser;

/**
 * Árbol binario de búsqueda para almacenar y buscar usuarios por username.
 */
public class BinarySearchTreeUsers {
    private Node root;
    
    private class Node {
        AppUser user;
        Node left, right;
        Node(AppUser user) { this.user = user; }
    }
    
    public void insert(AppUser user) {
        root = insertRec(root, user);
    }
    
    private Node insertRec(Node node, AppUser user) {
        if (node == null) return new Node(user);
        if (user.getUsername().compareToIgnoreCase(node.user.getUsername()) < 0)
            node.left = insertRec(node.left, user);
        else if (user.getUsername().compareToIgnoreCase(node.user.getUsername()) > 0)
            node.right = insertRec(node.right, user);
        return node;
    }
    
    public AppUser search(String username) {
        Node result = searchRec(root, username);
        return result == null ? null : result.user;
    }
    
    private Node searchRec(Node node, String username) {
        if (node == null || node.user.getUsername().equalsIgnoreCase(username))
            return node;
        if (username.compareToIgnoreCase(node.user.getUsername()) < 0)
            return searchRec(node.left, username);
        return searchRec(node.right, username);
    }
}
