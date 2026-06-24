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
    %% Configuración de Estilos basados en la imagen
    classDef frontend fill:#e8f4fd,stroke:#2196f3,stroke-width:2px,color:#000;
    classDef backend fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef database fill:#d0e1f9,stroke:#1e3d59,stroke-width:2px,color:#000;
    classDef componente fill:#ffffff,stroke:#333333,stroke-width:1px,color:#000;
    classDef decis fill:#fff3cd,stroke:#ffe69c,stroke-width:1px,color:#000;

    %% --- LADO DEL CLIENTE (FRONTEND) ---
    subgraph Frontend ["Lado del Cliente (Frontend)"]
        Usuario((👤<br>Usuario))
        
        subgraph Interfaz ["Interfaz de Usuario (Navegador MTRR)"]
            subgraph Tecnologias ["Visualización 2D en Mapa Táctico"]
                HTML["<b>HTML5</b><br>Estructura .html<br>(Lienzo del Mapa)"]:::componente
                CSS["<b>CSS3</b><br>Estilo .css<br>(Renderizado de Iconos)"]:::componente
                JS["<b>JavaScript (fetch)</b><br>Lógica .js<br>(Interactividad de Capas)"]:::componente
            end
            Marcadores["📍 Manejo de Marcadores"]:::componente
            UserInput["⌨️ User-Input"]:::componente
        end
    end
    class Frontend frontend;

    %% --- LADO DEL SERVIDOR (BACKEND) ---
    subgraph Backend ["Lado del Servidor (Backend)"]
        subgraph ServerExpress ["Servidor Express.js (Node.js) - API de Recursos Multimedia"]
            Rutas["<b>Rutas</b><br>• /api/multimedia<br>• /api/multimedia/:id"]:::componente
            Middleware["<b>Middleware</b><br>• Autenticación y Registro<br>• Análisis de Cuerpo (JSON/Form-Data)"]:::componente
            Controllers["<b>Controllers</b><br>Lógica de Negocio<br>(Manejo de Consultas Multimedia)"]:::componente
            
            subgraph SequelizeBox ["Sequelize (Objetos JavaScript ↔ Consultas DB)"]
                M_Info["MultimediaInfo (Model)"]:::componente
                M_File["MultimediaFile (Model)"]:::componente
            end
            
            Mapeo["Mapeo de Modelos Sequelize"]:::componente
        end
    end
    class Backend backend;

    %% --- BASE DE DATOS ---
    subgraph Database ["Base de Datos Relacional (PostgreSQL)"]
        subgraph DB_Cilindro ["🛢️ Almacenamiento de Datos Tácticos"]
            Catalogo["<b>**Catálogo de Recursos Tácticos (Conceptual)**</b><br>(Referencia conceptual a la estructura 'multimedia_info')"]:::componente
            Relacion["1:N Relación Conceptual<br>(Táctico <-> Archivo)"]:::decis
            Activos["<b>**Almacenamiento de Activos Visuales (Abstracto)**</b><br>(Referencia conceptual a la estructura 'multimedia_files')"]:::componente
        end
    end
    class Database database;

    %% --- FLUJOS DE INTERACCIÓN Y DATOS ---
    Usuario --> Marcadores & UserInput
    Marcadores & UserInput --> Interfaz
    
    %% Envío del Frontend al Backend
    Interfaz -->|"(Peticiones HTTP JSON/API)"| Rutas
    Rutas --> Middleware
    Middleware --> Controllers
    Controllers --> SequelizeBox
    
    %% Conexiones Internas de Sequelize
    M_Info --> M_File
    SequelizeBox --> Mapeo
    Mapeo <-->|"Definición de Esquema JS"| Mapeo
    
    %% Comunicación Backend ↔ Database
    SequelizeBox <-->|"Consultas SQL / Resultados de Datos (JSON)"| Catalogo
    Catalogo --> Relacion
    Relacion --> Activos
    
    %% Flujo de datos de retorno (Cierre del ciclo)
    Activos -->|"FLUJO DE DATOS MULTIMEDIA (Animación / Imagen)"| Interfaz
    SequelizeBox -.->|"Respuestas HTTP (Datos JSON)"| Interfaz
```