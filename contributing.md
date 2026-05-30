## 1. Nomenclatura de Ramas
La rama `main` está blindada. Para trabajar en las tareas, crea ramas auxiliares:
* `feat/modulo-manual` -> Nuevas interfaces del manual.
* `feat/db-postgres` -> Modelos de datos y tablas de suelos (Arcilloso, Arenoso, Rocoso).
* `fix/error-codigo` -> Corrección de bugs.

## 2. Formato de Commits (Bitácora)
Cada commit debe incluir el identificador de la tarea:
> **Formato:** `tipo: descripción corta (Tarea #ID)`
* Ejemplo: `feat: configurar conexion a base de datos postgres (Tarea #01)`