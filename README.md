# Portfolio - Astro Migration

This is a migration of my personal portfolio from Next.js to Astro, focusing on improved performance and simpler deployment with static site generation.

## Why Astro?

- **Better Performance**: Zero JavaScript by default, with faster page loads
- **Simpler Architecture**: No need for server-side rendering complexity
- **Static First**: Perfect for portfolio sites that don't need dynamic server logic
- **Developer Experience**: Astro's component model is intuitive and flexible

## Tech Stack

- **Framework**: Astro 5
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide Astro
- **Fonts**: Geist & Plus Jakarta Sans
- **Deployment**: Static site generation

## Project Structure

```text
/
├── public/
│   ├── fonts/           # Geist font files
│   ├── images/          # Project images and screenshots
│   ├── media/           # Skills icons, navigation icons, project assets
│   └── videos/          # Project demo videos
├── src/
│   ├── assets/          # Profile picture and other assets
│   ├── components/      # Reusable Astro components
│   │   ├── Navbar.astro
│   │   ├── ProjectCard.astro
│   │   ├── Projects.astro
│   │   ├── Skills.astro
│   │   ├── ThemeIcon.astro
│   │   └── Welcome.astro
│   ├── layouts/
│   │   └── Layout.astro # Base layout with theme support
│   ├── lib/
│   │   └── Projects.ts  # Project data and metadata
│   ├── pages/
│   │   └── index.astro  # Homepage
│   └── styles/
│       └── global.css   # Global styles and Tailwind config
└── package.json
```

## Features

- Dark/light theme toggle
- Responsive design
- Project showcase with interactive cards
- Skills section with tech stack icons
- Optimized images and videos
- SEO-friendly metadata

## Commands

All commands are run from the root of the project:

| Command            | Action                                        |
| :----------------- | :-------------------------------------------- |
| `pnpm install`     | Install dependencies                          |
| `pnpm dev`         | Start dev server at `localhost:4321`          |
| `pnpm build`       | Build production site to `./dist/`            |
| `pnpm preview`     | Preview build locally before deploying        |
| `pnpm astro ...`   | Run Astro CLI commands                        |

## Migration Notes

Key differences from the Next.js version:

- Removed server-side rendering (SSR) in favor of static site generation (SSG)
- Simplified routing with Astro's file-based system
- Replaced React components with Astro components
- Improved build times and bundle size
- Better Lighthouse scores out of the box
