# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# Configuración de Stripe (fase 1)

Para procesar pagos reales la aplicación usa Stripe. Antes de continuar debes:

1. **Crear un archivo `.env`** a partir del ejemplo:

   ```bash
   cd anelaapp
   cp .env.example .env
   ```

2. **Completar las variables** dentro de `.env`:

   ```env
   STRIPE_SECRET_KEY=sk_test_...      # tu clave secreta de Stripe
   CLIENT_URL=http://localhost:5174   # dirección donde corre la app
   ```

   - No compartas ni subas este archivo a Git. Asegúrate de que esté en `.gitignore`.
   - En producción deberás usar la clave live y ajustar `CLIENT_URL`.

3. **Instalar dependencias del servidor** (sólo la primera vez):

   ```bash
   npm install express stripe cors dotenv
   ```

4. **Arrancar el servidor de Stripe**:

   ```bash
   npm run start-server
   ```

   Si te olvidas de definir `STRIPE_SECRET_KEY` el servidor abortará e imprimirá un mensaje claro.

5. A partir de aquí abordaremos el siguiente paso: conectar el frontend con el servidor y redirigir a Stripe. Sigue la siguiente fase cuando estés listo.

---
