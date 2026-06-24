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