# Sistematización de Fortificaciones y Obstáculos (MTRR)
### 🇻🇪 UNEFA Falcón - Ingeniería de Sistemas

Este sistema automatiza y recopila las especificaciones técnicas de fortificaciones sobre el terreno, diseñado para un rol único de **Operador de Terreno / Cliente**.

---

## 📐 Arquitectura del Sistema (Mermaid.js)

### 🚀 1. Flujo de Navegación del Operador de Terreno
```mermaid
graph TD
    A(👤 Operador de Terreno) -->|1. Elige una opción en el menú| B[💻 Interfaz Principal: HTML/CSS]
    B -->|2. Captura el click y procesa| C[⚙️ Controlador Dinámico JavaScript]
    C -->|3. Consulta parámetros técnicos| D[(💾 Base de Datos: PostgreSQL)]
    D -->|4. Retorna datos de resistencia| C
    C -->|5. Inyecta el contenido dinámicamente| B
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