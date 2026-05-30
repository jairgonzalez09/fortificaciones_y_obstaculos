# Sistematización de Fortificaciones y Obstáculos (MTRR)
### 🇻🇪 UNEFA Falcón - Ingeniería de Sistemas

Este sistema automatiza y recopila las especificaciones técnicas de fortificaciones sobre el terreno, diseñado para un rol único de **Operador de Terreno / Cliente**.

---

## 📐 Arquitectura del Sistema (Mermaid.js)

### Flujo de Navegación del Operador
```mermaid
graph TD
    A[👤 Operador de Terreno / Cliente] -->|Interactúa| B(💻 Interfaz Web: HTML/CSS)
    B -->|Peticiones API| C[⚙️ Servidor Express / Node.js]
    C -->|Consulta Modelos con Sequelize| D[(💾 Base de Datos: PostgreSQL)]
    D -->|Retorna Datos de Resistencia| C
    C -->|Inyecta Datos Dinámicos| B
### 📊 2. Modelo Entidad-Relación de la Base de Datos (PostgreSQL)

```mermaid
erDiagram
    MULTIMEDIA_INFO {
        int id PK
        string name
        string decription
        string classification
        string type
        int multimediaid 
        timestamp createat
        timestamp updatedat
    }

    MULTIMEDIA_files {
        int id PK
        string url
        string type
        timestamp createat
        timestamp updatedat
    }