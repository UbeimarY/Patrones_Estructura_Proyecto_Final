package com.cognitiveapp.training.datastructures;

/**
 * Implementación propia de una lista enlazada.
 * Se utiliza para almacenar el historial de jugadas.
 */
public class MyLinkedList<T> {
    private Node<T> head;
    private int size;

    private static class Node<T> {
        T value;
        Node<T> next;
        Node(T value) { this.value = value; }
    }

    public MyLinkedList() {
        head = null;
        size = 0;
    }

    public int size() {
        return size;
    }

    // Agrega un elemento al final
    public void add(T value) {
        Node<T> newNode = new Node<>(value);
        if (head == null) {
            head = newNode;
        } else {
            Node<T> curr = head;
            while (curr.next != null) {
                curr = curr.next;
            }
            curr.next = newNode;
        }
        size++;
    }

    // Retorna el elemento en la posición especificada
    public T get(int index) {
        if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
        Node<T> current = head;
        for (int i = 0; i < index; i++) {
            current = current.next;
        }
        return current.value;
    }

    // Elimina la primera ocurrencia del valor y retorna true si se elimina
    public boolean remove(T value) {
        if (head == null) return false;
        if (head.value.equals(value)) {
            head = head.next;
            size--;
            return true;
        }
        Node<T> current = head;
        while (current.next != null && !current.next.value.equals(value)) {
            current = current.next;
        }
        if (current.next != null) {
            current.next = current.next.next;
            size--;
            return true;
        }
        return false;
    }
}
