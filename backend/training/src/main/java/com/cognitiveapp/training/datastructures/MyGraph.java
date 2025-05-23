package com.cognitiveapp.training.datastructures;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MyGraph<T> {
    private Map<T, List<T>> adjList;

    public MyGraph() {
        adjList = new HashMap<>();
    }

    public void addVertex(T vertex) {
        adjList.putIfAbsent(vertex, new ArrayList<>());
    }

    // Para un grafo no dirigido, se añade la arista en ambas direcciones.
    public void addEdge(T source, T destination) {
        adjList.putIfAbsent(source, new ArrayList<>());
        adjList.putIfAbsent(destination, new ArrayList<>());
        adjList.get(source).add(destination);
        adjList.get(destination).add(source);
    }

    public List<T> getAdjVertices(T vertex) {
        return adjList.getOrDefault(vertex, new ArrayList<>());
    }
}
