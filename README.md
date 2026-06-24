# Sistematización de Fortificaciones y Obstáculos (MTRR)
### 🇻🇪 UNEFA Falcón - Ingeniería de Sistemas

Este sistema automatiza y recopila las especificaciones técnicas de fortificaciones sobre el terreno, diseñado para un rol único de **Operador de Terreno / Cliente**.

---

## 📐 Arquitectura del Sistema (Mermaid.js)

### 🚀 1. Diagrama de flujo
```mermaid
graph TD
    %% Configuración de Estilos Básicos (Similares a tu imagen)
    classDef inicioFin fill:#029676,stroke:#016b54,stroke-width:2px,color:#fff;
    classDef proceso fill:#cfe2ff,stroke:#9ec5fe,stroke-width:1px,color:#084298;
    classDef cargar fill:#fff3cd,stroke:#ffe69c,stroke-width:1px,color:#664d03;
    classDef decision fill:#5836be,stroke:#432896,stroke-width:2px,color:#fff;
    classDef finNodo fill:#dc3545,stroke:#b02a37,stroke-width:2px,color:#fff;

    %% Nodos del Flujo
    Inicio([Inicio]):::inicioFin
    MostrarWeb[Mostrar aplicacion Web]:::proceso
    CargarBotonPrincipal[Cargar boton Crear fortificaciones/obstaculos]:::cargar
    
    DecisPrincipal{"¿Clic al boton de 'Crear Fortificacion/Obstaculo'?"}:::decision
    Salir[Salir]:::cargar
    
    CargarBotonesTipos[Cargar Botones 'Fortificación y Obstáculo']:::cargar
    
    DecisFortificaciones{"¿Fortificaciones?"}:::decision
    DecisObstaculos{"¿Obstáculos?"}:::decision
    
    CargarBotonesFort{"Cargar botones 'Trinchera y Sacos de arena'"}:::cargar
    CargarBotonesObs{"Cargar Botones 'Erizo, Ramadas y Vehículos'"}:::cargar
    
    DecisClicFort{"¿Clic a Trinchera o Sacos de Arena?"}:::decision
    DecisClicObs{"¿Clic a Erizo, Ramadas o Vehículos?"}:::decision
    
    AnimacionFort[Mostrar Animacion 2D]:::proceso
    AnimacionObs[Mostrar Animacion 2D]:::proceso
    
    Fin([Fin]):::finNodo

    %% Conexiones y Relaciones
    Inicio --> MostrarWeb
    MostrarWeb --> CargarBotonPrincipal
    CargarBotonPrincipal --> DecisPrincipal
    
    %% Ruta del NO Principal
    DecisPrincipal -- No --> Salir
    Salir --> Fin
    
    %% Ruta del SÍ Principal
    DecisPrincipal -- Si --> CargarBotonesTipos
    CargarBotonesTipos --> DecisFortificaciones
    CargarBotonesTipos --> DecisObstaculos
    
    %% Flujo de Fortificaciones
    DecisFortificaciones -- Si --> CargarBotonesFort
    DecisFortificaciones -- No --> Salir
    CargarBotonesFort --> DecisClicFort
    DecisClicFort -- Si --> AnimacionFort
    DecisClicFort -- No --> Salir
    AnimacionFort --> Fin
    
    %% Flujo de Obstáculos
    DecisObstaculos -- Si --> CargarBotonesObs
    DecisObstaculos -- No --> Salir
    CargarBotonesObs --> DecisClicObs
    DecisClicObs -- Si --> AnimacionObs
    DecisClicObs -- No --> Salir
    AnimacionObs --> Fin
```

### 📊 2. Modelo Entidad-Relación de la Base de Datos (PostgreSQL)
```mermaid
erDiagram
    MULTIMEDIA_INFO {
        int id PK
        varchar name
        varchar decription
        enum_multimedia_info_classification classification
        varchar type
        int multimediaid 
        timestamp createat
        timestamp updatedat
    }

    MULTIMEDIA_files {
        int id PK
        varchar url
        enum_multimedia_info_classification type
        timestamp createat
        timestamp updatedat
    }
```

### 🚀 1. Diagrama de flujo
```mermaid
graph LR
    %% Configuración de Estilos Básicos
    classDef capa fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef componente fill:#ffffff,stroke:#2196f3,stroke-width:1px,color:#000;
    classDef backend fill:#ffffff,stroke:#4caf50,stroke-width:1px,color:#000;
    classDef db fill:#ffffff,stroke:#1e3d59,stroke-width:1px,color:#000;

    %% --- CAPA FRONTEND ---
    subgraph Frontend ["Lado del Cliente (Frontend) - Interfaz MTRR"]
        Usuario((👤 Usuario))
        HTML["🌐 HTML5 (Lienzo del Mapa)"]
        CSS["🎨 CSS3 (Renderizado de Iconos)"]
        JS["⚡ JavaScript Fetch (Lógica y Capas)"]
        Marcadores["📍 Manejo de Marcadores"]
        UserInput["⌨️ User-Input"]
    end

    %% --- CAPA BACKEND ---
    subgraph Backend ["Lado del Servidor (Backend) - Express.js"]
        Rutas["🛣️ Rutas (/api/multimedia)"]
        Middleware["🛡️ Middleware (Autenticación/Cuerpo)"]
        Controllers["🧠 Controllers (Lógica de Negocio)"]
        Sequelize["🔄 ORM Sequelize (Modelos y Mapeo)"]
    end

    %% --- CAPA BASE DE DATOS ---
    subgraph Database ["Base de Datos (PostgreSQL)"]
        Catalogo["📚 Catálogo Recursos Tácticos"]
        Relacion{{"1:N Relación"}}
        Activos["🎬 Almacenamiento Activos Visuales"]
    end

    %% --- ASIGNACIÓN DE ESTILOS POR CLASES ---
    class HTML,CSS,JS,Marcadores,UserInput componente;
    class Rutas,Middleware,Controllers,Sequelize backend;
    class Catalogo,Activos db;

    %% --- FLUJOS DE ENTRADA Y PETICIONES ---
    Usuario --> UserInput
    Usuario --> Marcadores
    UserInput & Marcadores --> JS
    
    %% Petición HTTP del Frontend al Backend
    JS -->| "Peticiones HTTP (JSON)" | Rutas
    Rutas --> Middleware
    Middleware --> Controllers
    Controllers --> Sequelize

    %% Comunicación Backend ↔ Database
    Sequelize <-->| "Consultas SQL / JSON" | Catalogo
    Catalogo --> Relacion
    Relacion --> Activos

    %% Flujo de respuesta final (Cierre del ciclo)
    Sequelize -.->| "Respuestas HTTP (JSON)" | JS
    Activos -.->| "Flujo de Datos Multimedia (Animación)" | HTML
```