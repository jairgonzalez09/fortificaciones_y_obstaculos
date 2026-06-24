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

### 🚀 1. Diagrama de arquitectura
```mermaid
graph LR
    %% ----------------------------------------------------
    %% CONFIGURACIÓN DE ESTILOS Y COLORES (Fieles a tu imagen)
    %% ----------------------------------------------------
    classDef capa fill:#1a1a1a,stroke:#444,stroke-width:2px,color:#fff;
    classDef componente fill:#fff,stroke:#1e3d59,stroke-width:1.5px,color:#000;
    classDef cajaFront fill:#fff3cd,stroke:#ffe69c,stroke-width:1.5px,color:#000;
    classDef cajaBack fill:#e8f5e9,stroke:#4caf50,stroke-width:1.5px,color:#000;
    classDef db fill:#ffffff,stroke:#1e3d59,stroke-width:1.5px,color:#000;
    classDef invisible fill:none,stroke:none,color:#fff;

    %% ----------------------------------------------------
    %% LADO DEL CLIENTE (FRONTEND)
    %% ----------------------------------------------------
    subgraph Frontend ["Lado del Cliente (Frontend)"]
        Usuario["👤 Usuario"]:::componente
        
        subgraph Interfaz ["Interfaz de Usuario (Navegador MTRR) - Visualización 2D"]
            HTML["<b>HTML5</b><br>Estructura .html (Lienzo del Mapa)"]:::cajaFront
            CSS["<b>CSS3</b><br>Estilo .css (Renderizado de Iconos)"]:::cajaFront
            JS["<b>JavaScript (fetch)</b><br>Lógica .js (Interactividad de Capas)"]:::cajaFront
            
            Marcadores["💻 Manejo de Marcadores"]:::componente
            UserInput["📝 User-Input"]:::componente
        end
    end

    %% ----------------------------------------------------
    %% LADO DEL SERVIDOR (BACKEND)
    %% ----------------------------------------------------
    subgraph Backend ["Lado del Servidor (Backend)"]
        subgraph ServerExpress ["Servidor Express.js (Node.js) - API de Recursos Multimedia"]
            Rutas["<b>Rutas</b><br>• /api/multimedia<br>• /api/multimedia/:id"]:::cajaBack
            Middleware["<b>Middleware</b><br>• Autenticación y Registro<br>• Análisis (JSON/Form-Data)"]:::cajaBack
            Controllers["<b>Controllers</b><br>Lógica de Negocio<br>(Consultas Multimedia)"]:::cajaBack
            
            subgraph SequelizeBox ["Sequelize (Objetos JS ↔ Consultas DB)"]
                Models["• MultimediaInfo (Model)<br>• MultimediaFile (Model)"]:::componente
                Mapeo["Mapeo de Modelos Sequelize"]:::componente
            end
        end
    end

    %% ----------------------------------------------------
    %% BASE DE DATOS (POSTGRESQL)
    %% ----------------------------------------------------
    subgraph Database ["Base de Datos Relacional (PostgreSQL)"]
        subgraph DB_Cilindro ["🛢️ Almacenamiento de Datos Tácticos"]
            Catalogo["<b>🏰 Catálogo de Recursos Tácticos (Conceptual)</b><br>(Estructura 'multimedia_info')"]:::db
            Relacion["1:N Relación Conceptual (Táctico <-> Archivo)"]:::cajaFront
            Activos["<b>🎬 Almacenamiento de Activos Visuales (Abstracto)</b><br>(Estructura 'multimedia_files')"]:::db
        end
    end

    %% Nodos invisibles de flujo externo para etiquetado limpio
    PetHTTP["Peticiones HTTP<br>(JSON/API)"]:::invisible
    ResHTTP["Respuestas HTTP<br>(Datos JSON)"]:::invisible
    SQLData["Consultas SQL /<br>Resultados (JSON)"]:::invisible

    %% ----------------------------------------------------
    %% CONEXIONES Y FLUJOS DE DATOS (Orden Lineal Estricto)
    %% ----------------------------------------------------
    %% Interacción del usuario
    Usuario --> Marcadores
    Usuario --> UserInput
    Marcadores --> JS
    UserInput --> JS

    %% Frontend hacia Backend
    JS --> PetHTTP
    PetHTTP --> Rutas
    Rutas --> Middleware
    Middleware --> Controllers
    Controllers --> SequelizeBox

    %% Lógica interna de Sequelize
    Models --> Mapeo
    Mapeo <-->|"Definición de Esquema JS"| Mapeo

    %% Backend hacia Base de Datos (Ida y Vuelta)
    SequelizeBox <--> SQLData
    SQLData <--> Catalogo
    
    %% Estructura interna de la DB
    Catalogo --> Relacion
    Relacion --> Activos

    %% Flujos de retorno al Cliente
    SequelizeBox -.-> ResHTTP
    ResHTTP -.-> JS
    Activos ==>|"FLUJO DE DATOS MULTIMEDIA (Animación / Imagen)"| Interfaz
```