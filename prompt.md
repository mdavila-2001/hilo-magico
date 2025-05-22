# Prompt para generar el componente Header.astro de Hilo Mágico

Estoy desarrollando el frontend de un e-commerce llamado **Hilo Mágico**, especializado en prendas personalizadas y servicios de costura.

El sitio está construido en **Astro** (sin Tailwind), y utilizo **Sass (SCSS)** para los estilos. El enfoque es **mobile-first**, limpio, artesanal y con estética mágica, alineado al logo de la marca que usa tonos lavanda, violeta y blanco cálido.

---

## 📌 Contenido del Header

- Logo ubicado a la izquierda en escritorio, centrado en móvil.
- Menú de navegación con los siguientes ítems:
  - Inicio
  - Productos
  - Servicios
  - Contacto
  - Icono de carrito 🛒
- En versión móvil debe mostrarse un **menú hamburguesa**:
  - Al hacer clic debe mostrar los enlaces verticalmente.

---

## 🎨 Estilo visual

- Fondo blanco o lavanda claro (`#fbf7fc`)
- Tipografía elegante y amigable: `Segoe UI`, `Quicksand`, o similar.
- Colores:
  - Texto: violeta oscuro (`#3e195f`)
  - Acentos: lavanda suave (`#cbb4e9`)
- Bordes suaves, sin sombras pesadas.
- Estilo coherente con el logo de *Hilo Mágico*.

---

## 🧩 Requisitos técnicos

- El logo debe cargarse desde `/logo-hilo-magico.png`.
- El menú debe mostrarse horizontal en escritorio y colapsado en móvil.
- Debe utilizar HTML semántico:
  - `<header>`, `<nav>`, `<ul>`, `<li>`, `<button>`
- El menú hamburguesa puede abrirse/cerrarse con JavaScript simple.
- El archivo `header.scss` debe incluir:
  - Estilos responsivos (media queries)
  - Uso de variables desde `_variables.scss`

---

## 🎯 Objetivo del prompt

Generar:
- `Header.astro`: componente funcional y responsivo
- `header.scss`: con diseño coherente, limpio y basado en el branding

Ambos archivos deben estar listos para integrarse al layout principal de la landing page de Hilo Mágico.
