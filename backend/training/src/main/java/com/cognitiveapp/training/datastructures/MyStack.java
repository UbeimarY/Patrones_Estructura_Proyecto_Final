package com.cognitiveapp.training.datastructures;

/**
 * Implementación de una pila (stack) para operaciones LIFO.
 */
public class MyStack<T> {
    private Node<T> top;
    
    private static class Node<T> {
        T data;
        Node<T> next;
        Node(T data) { this.data = data; }
    }
    
    public MyStack() {
        top = null;
    }
    
    public boolean isEmpty() {
        return top == null;
    }
    
    public void push(T data) {
        Node<T> newNode = new Node<>(data);
        newNode.next = top;
        top = newNode;
    }
    
    public T pop() {
        if (isEmpty()) {
            throw new IllegalStateException("La pila está vacía");
        }
        T data = top.data;
        top = top.next;
        return data;
    }
    
    public T peek() {
        if (isEmpty()) {
            throw new IllegalStateException("La pila está vacía");
        }
        return top.data;
    }
}
