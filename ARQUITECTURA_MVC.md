# Arquitectura MVC en RemsPrueApp2

## 📐 Patrón MVC (Model-View-Controller)

Este proyecto implementa el patrón arquitectónico MVC para separar responsabilidades y facilitar el mantenimiento.

### 🗂️ Componentes

#### 1. **Model** (Modelo)
**Ubicación**: `src/models/CandidateModel.js`

**Responsabilidad**: 
- Gestiona los datos de la aplicación
- Define la estructura de los datos del candidato
- Proporciona métodos para acceder a los datos

**Implementación**:
```javascript
class CandidateModel {
  constructor() {
    this.data = { /* datos del candidato */ };
  }
  
  getCandidateData() { return this.data; }
  getFullName() { return this.data.fullName; }
  // ... otros getters
}
```

**Ventajas**:
- Datos centralizados
- Fácil de modificar sin afectar otras capas
- Reutilizable en diferentes vistas

---

#### 2. **Controller** (Controlador)
**Ubicación**: `src/controllers/CandidateController.js`

**Responsabilidad**:
- Actúa como intermediario entre Model y View
- Procesa la lógica de negocio
- Coordina el flujo de datos

**Implementación**:
```javascript
class CandidateController {
  getCandidateInfo() {
    return CandidateModel.getCandidateData();
  }
  // ... métodos que invocan al modelo
}
```

**Ventajas**:
- Abstrae la lógica de negocio de la UI
- Facilita testing unitario
- Permite cambiar el modelo sin afectar la vista

---

#### 3. **View** (Vista)
**Ubicación**: `src/views/HomeView.js`

**Responsabilidad**:
- Renderiza la interfaz de usuario
- Presenta los datos al usuario
- Captura interacciones (en este caso, solo muestra datos estáticos)

**Implementación**:
```javascript
const HomeView = () => {
  const [candidateData, setCandidateData] = useState(null);
  
  useEffect(() => {
    const data = CandidateController.getCandidateInfo();
    setCandidateData(data);
  }, []);
  
  return (/* JSX con la UI */);
};
```

**Ventajas**:
- UI separada de la lógica
- Componentes reutilizables
- Facilita cambios de diseño

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────┐
│                                             │
│  1. Usuario abre la app (App.js)           │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│                                             │
│  2. HomeView se monta (View)                │
│     - useEffect se ejecuta                  │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│                                             │
│  3. CandidateController.getCandidateInfo()  │
│     (Controller)                            │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│                                             │
│  4. CandidateModel.getCandidateData()       │
│     (Model) - Retorna datos                 │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│                                             │
│  5. Datos fluyen de vuelta al Controller    │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│                                             │
│  6. Controller retorna datos a View         │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│                                             │
│  7. View actualiza estado y renderiza UI    │
│     - Usuario ve la información             │
│                                             │
└─────────────────────────────────────────────┘
```

## 🎯 Beneficios de esta Arquitectura

### ✅ Separación de Responsabilidades
Cada capa tiene una función específica y bien definida.

### ✅ Mantenibilidad
- Cambiar el diseño: Solo editas la View
- Cambiar datos: Solo editas el Model
- Cambiar lógica: Solo editas el Controller

### ✅ Testabilidad
Puedes hacer tests unitarios de cada capa independientemente:
```javascript
// Test del Model
test('getCandidateData returns correct structure', () => {
  const data = CandidateModel.getCandidateData();
  expect(data).toHaveProperty('fullName');
});

// Test del Controller
test('controller returns data from model', () => {
  const info = CandidateController.getCandidateInfo();
  expect(info).toBeDefined();
});
```

### ✅ Escalabilidad
Fácil agregar nuevas funcionalidades:
- Nueva vista → Reutiliza Model y Controller
- Nuevos datos → Agrega al Model sin tocar View
- Nueva lógica → Agrega métodos al Controller

### ✅ Reutilización
El mismo Model y Controller pueden ser usados por múltiples vistas.

## 🔧 Cómo Extender la Arquitectura

### Agregar Nuevos Datos
1. Edita `CandidateModel.js` → Agrega propiedades al objeto `data`
2. Agrega métodos getter si es necesario
3. Actualiza la View para mostrar los nuevos datos

### Agregar Nueva Lógica
1. Crea métodos en `CandidateController.js`
2. Invoca estos métodos desde la View
3. El Controller coordina con el Model

### Agregar Nueva Vista
1. Crea nuevo archivo en `src/views/`
2. Importa el mismo Controller
3. Renderiza los datos de forma diferente

## 📚 Mejores Prácticas Implementadas

1. **Single Responsibility**: Cada clase tiene una sola responsabilidad
2. **Singleton Pattern**: Model y Controller son instancias únicas
3. **Separation of Concerns**: UI, datos y lógica están separados
4. **React Hooks**: Uso correcto de useState y useEffect
5. **Clean Code**: Código legible y bien comentado

## 🚀 Próximos Pasos (Posibles Mejoras)

- [ ] Agregar manejo de estado global (Context API o Redux)
- [ ] Implementar persistencia local (AsyncStorage)
- [ ] Agregar validaciones en el Controller
- [ ] Crear servicios para APIs externas
- [ ] Implementar testing unitario
- [ ] Agregar navegación entre pantallas
