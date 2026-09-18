# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



# Mi Proyecto SPA - Explorador de Pokémon

Aplicación en React + TypeScript + Vite que consume la [PokéAPI](https://pokeapi.co/) para mostrar un listado de los 151 Pokémon originales, con búsqueda, favoritos y vista de detalle (tipos, altura, peso, experiencia, habilidades y estadísticas).

## Funcionalidades

- Consumo de datos desde `https://pokeapi.co/api/v2/pokemon?limit=151`
- Búsqueda por nombre
- **Favoritos**: marca tus Pokémon favoritos con ❤️, se guardan en el navegador (localStorage) y no se pierden al recargar la página
- Filtro para ver solo tus favoritos
- Vista de detalle con tipos, altura, peso, experiencia base, habilidades y estadísticas
- Diseño responsive: se adapta a celular, tablet y laptop

## Requisitos previos

- [Node.js](https://nodejs.org/) instalado (v18 o superior recomendado)

## Cómo levantar el proyecto en local

1. Clonar el repositorio:
   ```bash
   git clone <URL-de-este-repositorio>
   cd mi-proyecto-spa
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Levantar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador la URL que muestra la terminal (normalmente `http://localhost:5173`).

## Tecnologías

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
