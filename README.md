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

## Lighthouse Scores

Desktop:

<img width="944" height="622" alt="image" src="https://github.com/user-attachments/assets/3187d217-4887-46a7-8bbc-f6bf4ec80a38" />

Mobile:

<img width="949" height="628" alt="image" src="https://github.com/user-attachments/assets/c1e51a99-3be6-45ad-b376-cded1c9f2e77" />

## Project Structure

```text
/
├── public/
│   ├── fonts/           # Geist font files
│   ├── images/          # Project images and screenshots
│   ├── media/           # Skills icons, navigation icons, project assets
│   └── videos/          # Project demo videos
├── src/
│   ├── assets/          # Optimized images (projects, blog)
│   ├── components/      # Reusable Astro components
│   │   ├── Blog.astro
│   │   ├── BlogCard.astro
│   │   ├── Contact.astro
│   │   ├── Figure.astro
│   │   ├── Navbar.astro
│   │   ├── ProjectCard.astro
│   │   ├── Projects.astro
│   │   ├── Section.astro
│   │   ├── ThemeIcon.astro
│   │   └── Welcome.astro
│   ├── content.config.ts # Content collections configuration
│   ├── data/
│   │   ├── blog/        # Blog posts (MDX)
│   │   └── projects/    # Project metadata (MDX)
│   ├── layouts/
│   │   └── Layout.astro # Base layout with theme support
│   ├── pages/
│   │   ├── blog/
│   │   │   ├── [slug].astro  # Blog post page
│   │   │   └── index.astro   # Blog listing
│   │   ├── projects/
│   │   │   └── [slug].astro  # Project detail page
│   │   └── index.astro       # Homepage
│   └── styles/
│       └── global.css   # Global styles and Tailwind config
└── package.json
```

## Features

- Dark/light theme toggle with system preference detection
- Responsive design optimized for all screen sizes
- Project showcase with interactive cards and lazy-loaded videos
- Blog system with MDX support and content collections
- Optimized images through Astro's image pipeline
- SEO-friendly metadata and Open Graph tags
- Accessible navigation and skip links

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



