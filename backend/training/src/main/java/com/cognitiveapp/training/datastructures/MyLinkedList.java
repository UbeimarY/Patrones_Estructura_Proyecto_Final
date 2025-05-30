package com.cognitiveapp.training.datastructures;

/**
 * Implementación de una lista enlazada simple.
 */
public class MyLinkedList<T> {
    private Node<T> head;
    private Node<T> tail;
    private int size;
    
    private static class Node<T> {
        T data;
        Node<T> next;
        Node(T data) { this.data = data; }
    }
    
    public MyLinkedList() {
        head = null;
        tail = null;
        size = 0;
    }
    
    public void add(T data) {
        Node<T> newNode = new Node<>(data);
        if (head == null) {
            head = newNode;
            tail = newNode;
        } else {
            tail.next = newNode;
            tail = newNode;
        }
        size++;
    }
    
    public T get(int index) {
        if (index < 0 || index >= size)
            throw new IndexOutOfBoundsException("Índice fuera de límites");
        Node<T> current = head;
        for (int i = 0; i < index; i++) current = current.next;
        return current.data;
    }
    
    public boolean remove(T data) {
        if (head == null)
            return false;
        if (head.data.equals(data)) {
            head = head.next;
            if (head == null)
                tail = null;
            size--;
            return true;
        }
        Node<T> current = head;
        while (current.next != null) {
            if (current.next.data.equals(data)) {
                current.next = current.next.next;
                if (current.next == null)
                    tail = current;
                size--;
                return true;
            }
            current = current.next;
        }
        return false;
    }
    
    public int size() {
        return size;
    }
}
