# Prompt para generar un proyecto Astro completo para el e-commerce "Hilo Mágico"

Estoy creando un sitio web para un e-commerce llamado **Hilo Mágico**, una tienda digital dedicada a prendas personalizadas y servicios de costura a medida.  

Quiero generar desde cero un proyecto frontend moderno usando **Astro**, sin TailwindCSS, pero con uso de **Sass (SCSS)** para estilos. El enfoque del diseño es **mobile-first**, limpio, visualmente fluido, y alineado a la estética del logotipo (mágico, artesanal y femenino).

---

## 🎯 Objetivo del proyecto

Crear la estructura base de un sitio Astro responsivo y modular, con los primeros componentes de una landing page funcional que incluya:

- Header con navegación accesible
- Hero con nombre y slogan
- Sección de servicios destacados
- Footer con contacto
- Preparado para SEO básico (HTML semántico, etiquetas útiles)
- Estilos gestionados con SCSS, usando variables y archivos modulares

---

## 🧱 Estructura esperada del proyecto

src/
├── pages/
│ └── index.astro # Landing page principal
├── components/
│ ├── Header.astro # Navegación superior
│ ├── Hero.astro # Slogan principal
│ ├── Servicios.astro # Lista de beneficios
│ └── Footer.astro # Contacto y pie de página
├── layouts/
│ └── BaseLayout.astro # Contenedor HTML con slot
├── styles/
│ ├── base.scss # Reset + tipografía base
│ ├── _variables.scss # Colores y tipografía
│ ├── _mixins.scss # Estilos reutilizables
│ ├── components/
│ │ ├── header.scss
│ │ ├── hero.scss
│ │ ├── servicios.scss
│ │ └── footer.scss
│ └── main.scss # Archivo raíz de estilos
public/
├── logo-hilo-magico.png # Logo principal
└── icono-hilo-magico.png # Versión sin texto (favicon)

---

## 💡 Estilo visual y branding

- Colores principales:
  - Lavanda: `#cbb4e9`
  - Violeta oscuro: `#3e195f`
  - Blanco cálido: `#fdf7f2`
  - Rosa claro: `#fce9e9`
- Tipografía sugerida: `'Segoe UI'`, `'Quicksand'`, `'Playfair Display'`
- Estilo suave, bordes redondeados, sin sombras duras
- Todo debe ser **fluido, acogedor y mágico** como el logo

---

## ✅ Requisitos técnicos

- Astro (`npm create astro@latest`) plantilla `minimal`
- TypeScript: **Sí (Strict Mode)**
- Linter: **Sí (ESLint + Prettier)**
- Framework adicional: **ninguno**
- Instalar y configurar Sass: `npm install -D sass`
- Importar `main.scss` en `BaseLayout.astro`
- Preparado para escalar hacia un catálogo, carrito y autenticación en el futuro

---

## 📣 Accesibilidad y SEO

- Usar HTML semántico: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Etiquetas `<a>` con `href`, `aria-label`, `alt` en imágenes
- Menú accesible: `aria-expanded`, `aria-controls`, `aria-label`
- Preparado para Open Graph y metadatos SEO

---

🎯 Generá el proyecto inicial completo siguiendo esta estructura y estilo, listo para comenzar con el desarrollo de la landing page del e-commerce *Hilo Mágico*.
