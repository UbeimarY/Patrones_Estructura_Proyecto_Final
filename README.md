# Cognitive Training App

Este repositorio contiene el frontend y el backend de la aplicación **Cognitive Training App**, diseñada para ofrecer juegos cognitivos y gestionar usuarios, puntuaciones y estadísticas.

---

## Índice

1. [Frontend](#frontend)  
   1.1 [Tecnologías y Estado Global](#tecnologías-y-estado-global)  
   1.2 [Estructura del Código](#estructura-del-código-front)  
   1.3 [Estructuras de Datos](#estructuras-de-datos-front)  
   1.4 [Patrones de Diseño](#patrones-de-diseño-front)  

2. [Backend](#backend)  
   2.1 [Tecnologías y Arquitectura](#tecnologías-y-arquitectura-back)  
   2.2 [Estructura del Código](#estructura-del-código-back)  
   2.3 [Estructuras de Datos](#estructuras-de-datos-back)  
   2.4 [Patrones de Diseño](#patrones-de-diseño-back)  

3. [Instalación y Ejecución](#instalación-y-ejecución)  
4. [Resumen](#resumen)  

---

## Frontend

La capa de presentación está desarrollada con **Next.js** y **React**, usando **Tailwind CSS v4** (CSS-First) para estilos y **Context API** para el estado global.

### Tecnologías y Estado Global

- **Next.js & React**: SSR/SSG y componentes reutilizables.  
- **Tailwind CSS v4**: utilidades CSS y variables en `globals.css`.  
- **Context API**: gestión del estado global (usuario, autenticación, preferencias).

### Estructura del Código  <a name="estructura-del-código-front"></a>

```
frontend/
└── cognitive-training-frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── index.tsx        # Lista de juegos
    │   │   ├── login.tsx        # Inicio de sesión
    │   │   ├── register.tsx     # Registro de usuario
    │   │   └── account.tsx      # Perfil de usuario
    │   ├── components/
    │   │   ├── Navbar.tsx       # Barra de navegación
    │   │   └── GameCard.tsx     # Tarjeta de cada juego
    │   ├── context/
    │   │   └── AppContext.tsx   # Contexto global de la app
    │   └── utils/
    │       └── api.ts           # Funciones de llamada al backend
    └── package.json
```

### Estructuras de Datos  <a name="estructuras-de-datos-front"></a>

1. **Arrays de Objetos (Lista de Juegos)**  
   - **Dónde**: `src/pages/index.tsx`  
   - **Qué hace**: almacena y renderiza dinámicamente juegos.  
   - **Ejemplo**:
     ```ts
     const games: Game[] = [
       {
         id: "sliding-puzzle",
         title: "Rompecabezas Deslizante",
         description: "Desafía tu mente con este puzzle clásico.",
         image: "/games/sliding-puzzle-banner.jpg",
         category: "Puzzle",
         technologies: ["Lógica", "Cognitivo"],
         link: "/games/sliding-puzzle"
       },
       // …
     ];
     ```
2. **Objetos Literales (Usuario)**  
   - **Dónde**: `AppContext.tsx`  
   - **Qué hace**: mantiene la información del usuario autenticado en el contexto global.  
   - **Ejemplo**:
     ```js
     const user = {
       id: 1,
       username: "Camilo",
       score: 1200,
       trainingRoute: ""
     };
     ```

### Patrones de Diseño  <a name="patrones-de-diseño-front"></a>

- **Component-Based Architecture**: UI dividida en componentes independientes y reutilizables.  
- **Context API**: evita el prop drilling, compartiendo estado global entre componentes.  
- **Facade Pattern** en `api.ts`: unifica las llamadas al backend (login, registro, fetch de juegos).

---

## Backend

El servidor está construido con **Spring Boot**, persiste datos en **MongoDB** y expone APIs REST para autenticación, gestión de juegos y usuarios.

### Tecnologías y Arquitectura  <a name="tecnologías-y-arquitectura-back"></a>

- **Spring Boot**: framework principal para APIs.  
- **MongoDB**: base de datos NoSQL para usuarios, juegos y progresos.  
- **Maven (pom.xml)**: gestión de dependencias.

### Estructura del Código  <a name="estructura-del-código-back"></a>

```
backend/
└── cognitive-training/
    ├── src/main/java/com/cognitiveapp/training/
    │   ├── config/
    │   │   ├── MongoConfig.java
    │   │   └── ServiceConfig.java
    │   ├── controller/
    │   │   ├── AuthController.java
    │   │   ├── GameController.java
    │   │   └── UserController.java
    │   ├── datastructures/
    │   │   ├── BinarySearchTreeUsers.java
    │   │   ├── MyDynamicArray.java
    │   │   ├── MyGraph.java
    │   │   ├── MyLinkedList.java
    │   │   ├── MyQueue.java
    │   │   ├── MySimpleMap.java
    │   │   └── MyStack.java
    │   ├── factory/
    │   │   ├── GameFactory.java
    │   │   ├── MemoryGameFactory.java
    │   │   ├── BlackjackGameFactory.java
    │   │   └── TriviaGameFactory.java
    │   ├── facade/
    │   │   └── GameFacade.java
    │   ├── manager/
    │   │   └── GameManager.java
    │   ├── model/
    │   │   ├── AppUser.java
    │   │   └── Game.java
    │   ├── repository/
    │   │   ├── UserRepository.java
    │   │   └── GameRepository.java
    │   └── service/
    │       ├── IUserService.java
    │       ├── UserServiceImpl.java
    │       ├── UserServiceProxy.java
    │       └── GameService.java
    └── pom.xml
```

### Estructuras de Datos  <a name="estructuras-de-datos-back"></a>

- **Árbol Binario (`BinarySearchTreeUsers.java`)**: búsqueda eficiente de usuarios ordenados.  
- **Pila (`MyStack.java`)**: funcionalidad de “deshacer” en juegos.  
- **Cola (`MyQueue.java`)**: gestión de turnos en multijugador.  
- **Arreglo Dinámico (`MyDynamicArray.java`)**: lista de elementos mutable.

### Patrones de Diseño  <a name="patrones-de-diseño-back"></a>

- **Factory Pattern** (`GameFactory.java`): creación de instancias de juegos.  
- **Facade Pattern** (`GameFacade.java`): punto único de acceso a la lógica de juegos.  
- **Repository Pattern** (`UserRepository.java`, `GameRepository.java`): abstrae el acceso a MongoDB.  
- **Service Pattern** (`UserServiceImpl.java`, `GameService.java`): separa la lógica de negocio de los controladores.

---

## Instalación y Ejecución

1. **Clonar repositorio y moverse a la raíz**  
   ```bash
   https://github.com/UbeimarY/Patrones_Estructura_Proyecto_Final.git
   cd cognitive-training-app
   ```

2. **Frontend**  
   ```bash
   cd frontend/cognitive-training-frontend
   npm install
   npm run dev
   ```
   Accede a `http://localhost:3000`.

3. **Backend**  
   ```bash
   cd ../../backend/cognitive-training
   mvn clean install
   mvn spring-boot:run
   ```
   La API REST estará disponible en `http://localhost:8080`.

---

## Resumen

Este proyecto une un **frontend** moderno con Next.js/React y Tailwind CSS v4, y un **backend** robusto con Spring Boot y MongoDB. Emplea patrones de diseño y estructuras de datos personalizadas para un código mantenible, escalable y de alto rendimiento.  
