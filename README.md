# RemsPrueApp2 - Aplicación de Perfil Profesional

Esta es una aplicación React Native construida con Expo que muestra información profesional del candidato.

## 🚀 Características

- **Arquitectura MVC**: Implementación clara de Model-View-Controller
- **React Native con Expo**: Desarrollo multiplataforma
- **UI Moderna**: Diseño atractivo con gradientes y animaciones
- **EAS Build**: Configurado para generar builds públicos

## 📁 Estructura del Proyecto

```
RemsPrueApp2/
├── src/
│   ├── models/
│   │   └── CandidateModel.js      # Modelo de datos del candidato
│   ├── controllers/
│   │   └── CandidateController.js # Lógica de negocio
│   └── views/
│       └── HomeView.js            # Vista principal
├── App.js                         # Punto de entrada
├── eas.json                       # Configuración de EAS Build
└── package.json
```

## 🛠️ Tecnologías Utilizadas

- React Native
- Expo SDK 54
- Expo Linear Gradient
- EAS Build
- Arquitectura MVC

## 📱 Instalación y Ejecución

### Prerrequisitos
- Node.js (v14 o superior)
- npm o yarn
- Expo CLI
- Cuenta de Expo (para EAS Build)

### Pasos para ejecutar localmente

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo**:
   ```bash
   npx expo start
   ```

3. **Ejecutar en diferentes plataformas**:
   - **Android**: Presiona `a` en la terminal o ejecuta `npm run android`
   - **iOS**: Presiona `i` en la terminal o ejecuta `npm run ios` (requiere macOS)
   - **Web**: Presiona `w` en la terminal o ejecuta `npm run web`

## 🏗️ Generar Build con EAS

### 1. Iniciar sesión en Expo
```bash
eas login
```

### 2. Generar build de Android (APK)
```bash
eas build --platform android --profile preview
```

### 3. Generar build de iOS
```bash
eas build --platform ios --profile preview
```

### 4. Generar build de producción
```bash
eas build --platform all --profile production
```

### 5. Obtener URL pública
Una vez completado el build, EAS te proporcionará una URL pública donde podrás:
- Descargar el APK/IPA
- Compartir el enlace
- Ver el estado del build

Ejemplo de URL: `https://expo.dev/accounts/[tu-usuario]/projects/RemsPrueApp2/builds/[build-id]`

## 📋 Información personal

La aplicación muestra:
- ✅ Nombre completo
- ✅ Correo electrónico
- ✅ Descripción profesional
- ✅ Habilidades técnicas

## 🎨 Características de la UI

- Diseño con gradientes morados
- Iconos de Ionicons
- Tarjetas con sombras
- Scroll suave
- Diseño responsive
- SafeArea para diferentes dispositivos

## 📦 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS
- `npm run web` - Ejecuta en navegador

## 🔐 Variables de Entorno

No se requieren variables de entorno para esta aplicación.

## 📝 Notas Importantes

1. **EAS Build** está configurado con perfiles:
   - `development`: Para desarrollo con dev client
   - `preview`: Para builds internos de prueba
   - `production`: Para builds de producción

2. **Personalización**: Edita `src/models/CandidateModel.js` para cambiar la información del candidato.

3. **Arquitectura MVC**:
   - **Model** (`CandidateModel.js`): Contiene los datos
   - **Controller** (`CandidateController.js`): Maneja la lógica
   - **View** (`HomeView.js`): Presenta la interfaz

## 🤝 Contribuciones

Este es un proyecto de prueba técnica.

## 📄 Licencia

MIT

## 👤 Autor

Francis Daniel Nemocón
- Email: francis.nemocon@example.com
