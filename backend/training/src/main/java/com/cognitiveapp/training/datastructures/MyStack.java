package com.cognitiveapp.training.datastructures;

/**
 * Implementación propia de una pila (stack).
 * Se utiliza para almacenar los movimientos recientes y permitir deshacer (undo).
 */
public class MyStack<T> {
    private Node<T> top;

    private static class Node<T> {
        T value;
        Node<T> next;
        Node(T value) { this.value = value; }
    }

    public MyStack() {
        top = null;
    }

    public boolean isEmpty() {
        return top == null;
    }

    // Empuja un elemento a la pila.
    public void push(T value) {
        Node<T> newNode = new Node<>(value);
        newNode.next = top;
        top = newNode;
    }

    // Saca el elemento superior de la pila.
    public T pop() {
        if (isEmpty()) throw new IllegalStateException("La pila está vacía");
        T value = top.value;
        top = top.next;
        return value;
    }

    // Retorna el elemento superior sin removerlo.
    public T peek() {
        if (isEmpty()) throw new IllegalStateException("La pila está vacía");
        return top.value;
    }
}
