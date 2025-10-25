import type { Project } from "../components/Projects.astro";

import aigumentPreview from "../assets/projects/aigument-preview.webp";
import gossPoster from "../assets/projects/goss-poster.png";
import portfoliowebsite from "../assets/projects/portfoliowebsite.webp";
import woosterPoster from "../assets/projects/wooster-poster.webp";

export const PROJECTS: Project[] = [
	{
		title: "AIgument",
		slug: "aigument",
		description:
			"Watch AI models debate! AIgument pits LLMs (GPT-4o, Claude, Gemini) against each other with unique personalities. Built with Next.js, Vercel AI SDK, and Neon DB.",
		imageSrc: aigumentPreview,
		imageAlt: "AIgument application interface showing two AIs debating",
		links: [
			{
				type: "live",
				url: "https://aigument.vercel.app/",
				label: "Live Demo",
			},
			{
				type: "github",
				url: "https://github.com/joshuaisaact/AIgument",
				label: "GitHub Repository",
			},
		],
		skills: [
			"Nextjs",
			"TypeScript",
			"TailwindCSS",
			"Vercel AI SDK",
			"Neon DB",
			"OpenAI API",
			"Anthropic API",
			"Gemini API",
		],
		overview: `AIgument offers a novel and engaging way to experience the capabilities of Large Language Models. Instead of static benchmarks, users can stage dynamic debates between different AIs like GPT-4o, Claude 3 Sonnet, and Gemini 1.5 Flash. The platform allows for customization of debater personalities (e.g., Detective Noir, Drag Queen) and debate intensity ("spiciness"), providing both entertainment and insight into AI interaction styles. Debates can be saved and browsed, creating a library of AI-generated arguments.`,
		features: [
			"Multi-LLM debate platform (OpenAI, Anthropic, Google Gemini, xAI).",
			"Customizable debater personalities and 'spiciness' levels.",
			"Interactive debate progression with user voting.",
			"Persistent storage of debates using Neon Serverless DB.",
			"Responsive interface built with Next.js and Tailwind CSS.",
			"Streamed responses for real-time debate feel using Vercel AI SDK.",
		],
		architecture: {
			frontend: `Next.js 15 (App Router) with TypeScript for a type-safe, performant user interface.
        Tailwind CSS for styling.
        Vercel AI SDK for seamless streaming of LLM responses and UI helpers.`,
			backend: `Leverages Next.js API Routes for backend logic.
        Integrates multiple LLM APIs (OpenAI, Anthropic, Google, xAI).
        Uses Neon Serverless DB (PostgreSQL) for storing debate topics, rounds, votes, and user data.`,
			infrastructure: `Deployed on Vercel with CI/CD via GitHub.
        Edge functions for API routes where applicable.
        Scalable serverless database (Neon).`,
		},
		videoSrc: "/media/projects/videos/aigument.webm",
		videoPreviewSrc: "/media/projects/videos/aigument-preview.webm",
		posterImage: aigumentPreview,
	},
	{
		title: "JoshDesk",
		slug: "joshdesk",
		description:
			"A Slack app for hybrid team coordination that simplifies office attendance tracking. Features 4-week scheduling, automatic status updates, and smart reminders. Built with TypeScript and Bun, deployed on DigitalOcean.",
		imageSrc: "/media/projects/videos/joshdesk.mp4", // You'll need to add this image
		imageAlt: "JoshDesk Slack app interface",
		links: [
			{
				type: "live",
				url: "https://joshdesk.live/",
				label: "Website",
			},
			{
				type: "github",
				url: "https://github.com/joshuaisaact/joshdesk",
				label: "GitHub Repository",
			},
		],
		skills: ["TypeScript", "Bun"],
		overview: `JoshDesk streamlines hybrid work coordination through a simple Slack interface. It solves the common problem of tracking who's in the office on which days, eliminating the need for messy spreadsheets or constant messaging. Built with TypeScript and Bun, this project focuses on delivering a frictionless user experience directly within Slack.

      The app provides a 4-week view of team attendance, making it easy for teams to coordinate in-office days. With two-click status updates and automatic weekly schedule resets, JoshDesk reduces the overhead of managing hybrid work arrangements while improving team coordination.`,
		features: [
			"4-week schedule visibility from the Slack home tab",
			"One-click office/WFH status updates",
			"Automatic weekly schedule reset every Friday",
			"Team view command to see everyone's status at a glance",
			"Data persistence between app restarts",
			"Weather-aware planning integration",
			"Smart weekly reminders to keep schedules current",
			"Customizable team settings for admins",
		],
		architecture: {
			frontend: `Custom Slack Block Kit UI for intuitive user experience.
        Interactive elements for quick status updates with minimal clicks.
        Dynamic home tab interface showing 4-week planning view.`,

			backend: `Built with TypeScript and Bun for fast execution.
        Slack Bolt framework for handling API interactions.
        Persistent data storage with automatic weekly schedule management.
        Socket Mode for secure event handling without exposing endpoints.`,

			infrastructure: `Deployed on DigitalOcean for reliability.
        Environment variable configuration for easy deployment.
        OAuth 2.0 flow for secure workspace installation.
        Scheduled tasks for automated weekly schedule resets.`,
		},
		videoSrc: "/media/projects/videos/joshdesk.mp4", // Add if you have a video
		videoPreviewSrc: "/media/projects/videos/joshdesk.mp4", // Add if you have a preview video
		posterImage: "/media/projects/joshdesk-poster.png", // Add if you have a poster image
	},
	{
		title: "Wooster",
		slug: "wooster",
		description:
			"Full-stack AI travel planner built with React/TypeScript and Node.js. Features custom itinerary generation, production-grade auth, and automated CI/CD. Live at trywooster.live",
		imageSrc: woosterPoster,
		imageAlt: "Wooster logo",
		links: [
			{
				type: "github",
				url: "https://github.com/joshuaisaact/Wooster",
				label: "Front-End GitHub",
			},
			{
				type: "github",
				url: "https://github.com/joshuaisaact/wooster-server",
				label: "Back-End GitHub",
			},
			{
				type: "live",
				url: "https://trywooster.live",
				label: "Deployed Site",
			},
			{
				type: "blog",
				url: "https://joshtuddenham.tech/blog/wooster-series",
				label: "Technical blog",
			},
		],
		skills: [
			"React",
			"Express",
			"TypeScript",
			"TailwindCSS",
			"Nodejs",
			"PostgreSQL",
			"Supabase",
			"Drizzle",
			"Vitest",
			"Jest",
		],
		overview: `Wooster is a sophisticated AI travel planning platform built with reliability and scalability at its core.
It combines LLM technology with robust distributed architecture, comprehensive monitoring, and thorough testing infrastructure to deliver personalized travel experiences.`,
		features: [
			"AI-powered itinerary generation with type-safe prompt system",
			"Token-based rate limiting with configurable time windows",
			"Structured logging system with request correlation",
			"Comprehensive error handling with sanitized production traces",
			"Dockerized test environment with transaction rollbacks",
			"Service layer abstraction with dependency injection",
			"Custom middleware chain for auth and validation",
		],
		architecture: {
			frontend: `Built type-safe React application with TanStack Query for state management.
        Implemented accessible component system with ARIA compliance.
    Developed error boundaries with fallback UI for graceful degradation.
    Created modular prompt engineering interface with validation schemas.`,

			backend: `Designed service layer abstraction with dependency injection patterns.
    Implemented PostgreSQL database with versioned migrations and rollback support.
    Built custom middleware chain for auth, request validation, and response caching.
    Developed regex-based JSON sanitization for malformed LLM responses.
        Created token-based rate limiting with configurable time windows.`,

			testing: `Implemented dockerized PostgreSQL environment with transaction rollbacks.
        Built mock LLM client with typed responses and configurable failure scenarios.
        Designed retry mechanism for flaky integration tests with custom matchers.
        Created reusable test fixtures with factory patterns for complex data scenarios.`,

			infrastructure: `Deployed distributed system on DigitalOcean with GitHub Actions.
        Implemented structured logging with request correlation and context propagation.
        Built custom error hierarchy with environment-aware error responses.
        Created fallback mechanisms for AI service degradation.
        Set up Nginx reverse proxy with SSL/HTTPS and response caching.`,
		},
		videoSrc: "/media/projects/videos/wooster.webm",
		videoPreviewSrc: "/media/projects/videos/wooster-preview.webm",
		posterImage: woosterPoster,
	},
	{
		title: "Foundations",
		slug: "foundations",
		description:
			"Led frontend development of a diversity data transparency platform, transforming raw pay gap data into actionable insights. Built and deployed in 24 hours, winning Best in Category at JumpStart Hackathon.",
		imageSrc: "/media/achievements/foundations-win.webp",
		imageAlt: "Foundations Platform Preview",
		skills: ["Nextjs", "React", "TypeScript", "TailwindCSS"],
		links: [
			{
				type: "github",
				url: "https://github.com/joshuaisaact/dei-dashboard",
				label: "View Code",
			},
			{
				type: "live",
				url: "https://foundations-app.vercel.app/",
				label: "Visit Live Site",
			},
			{
				type: "submission",
				url: "https://www.hackathonparty.com/hackathons/6/projects/98",
				label: "Hackathon Submission",
			},
		],
		award: "Best in Category - JumpStart Hackathon",
		overview: `At JumpStart Hackathon, our team tackled a crucial challenge: making workplace diversity data more
      transparent and actionable. In just 24 hours, we built Foundations, a platform that transforms complex
      gender pay gap statistics into clear insights. Leading the frontend development, I worked with a team of four
      to turn this idea into reality, ultimately winning Best in Category against 20+ competing teams.

      The platform analyzes data from over 11,000 UK companies, making it easy for stakeholders to understand
      and act on diversity metrics that are often buried in complex reports.`,
		features: [
			"Interactive dashboard visualizing gender pay gap data for 11,000+ UK companies",
			"Real-time data filtering and comparison tools",
			"Company profile pages with detailed metrics and trends",
			"Responsive design optimized for both desktop and mobile",
			"Demo company profiles showcasing full platform capabilities",
			"Data visualization pipeline for complex statistical analysis",
		],
		architecture: {
			frontend: `Built with Next.js and TypeScript for type safety and improved developer experience. Implemented responsive UI using Tailwind CSS and shadcn/ui components.
      React Query for efficient data fetching and caching.
        Implemented custom hooks for shared business logic.`,

			backend: `Serverless architecture using Next.js API routes.
        Implemented data transformation pipeline to process and normalize raw pay gap statistics.
        Built type-safe API endpoints with proper error handling and validation.`,

			infrastructure: `Deployed on Vercel with automated CI/CD pipeline.
        Implemented comprehensive error monitoring and logging.
        Set up automatic preview deployments for pull requests.
        Optimized for handling large datasets with 11,000+ companies.`,
		},
		videoSrc: "/media/projects/videos/foundations.webm",
		videoPreviewSrc: "/media/projects/videos/foundations.webm",
	},
	{
		title: "Goss",
		slug: "goss",
		description:
			"Architected a robust real-time social platform featuring WebSocket notifications, social graph management, and file handling. Built with Next.js, TypeScript, and Supabase.",
		imageSrc: gossPoster,
		imageAlt: "Goss logo",
		links: [
			{
				type: "github",
				url: "https://github.com/joshuaisaact/Goss",
				label: "View Code",
			},
		],
		skills: [
			"Nextjs",
			"TypeScript",
			"Supabase",
			"TanStack-Query",
			"TailwindCSS",
		],
		overview: `I took on the technical challenge of building a voice-first social platform that
required real-time capabilities and complex data relationships. I led the development of key infrastructure
components, focusing on creating a scalable backend while ensuring a smooth user experience.

      The project showcases my ability to architect complex systems, from implementing real-time WebSocket
      notifications to designing efficient database schemas for social relationships. Working within a team
      environment, I delivered enterprise-grade features that formed the backbone of the platform.`,
		features: [
			"Real-time notification system using WebSockets and Supabase Realtime for instant updates",
			"Custom social graph implementation with bidirectional friend connections in PostgreSQL",
			"RESTful API layer with optimistic updates for responsive friend operations",
			"Secure file upload system integrated with Supabase storage",
			"Robust authentication flow with multiple providers",
			"WebSocket connection management with automatic reconnection handling",
		],
		architecture: {
			frontend: `Integrated the backend services with the team's Next.js/React frontend.
      Implemented Tanstack Query for efficient state management and optimistic updates, significantly improving perceived performance.
        Built reusable hooks for WebSocket management and real-time data synchronization.`,

			backend: `Architected and implemented a real-time notification system using WebSockets and Supabase
        Realtime, ensuring reliable message delivery across multiple client sessions.
        Designed an efficient social graph schema in PostgreSQL, optimizing friend relationship queries and management.
        Built RESTful APIs with comprehensive validation and error handling.`,

			infrastructure: `Implemented a secure authentication flow using Supabase, supporting multiple providers and session management.
      Built a scalable file upload system with proper access controls and storage optimization.
  Set up WebSocket infrastructure with connection pooling and automatic recovery.`,
		},
		videoSrc: "/media/projects/videos/goss3.webm",
		videoPreviewSrc: "/media/projects/videos/goss-preview.webm",
		posterImage: gossPoster,
	},
	{
		title: "Portfolio Website",
		slug: "portfolio-website",
		description:
			"A modern, accessible portfolio built with Next.js 15, featuring responsive design and smooth animations.",
		imageSrc: portfoliowebsite,
		imageAlt: "Portfolio Website",
		links: [
			{
				type: "github",
				url: "https://github.com/joshuaisaact/portfolio-next",
				label: "View Code",
			},
			{
				type: "live",
				url: "https://www.joshtuddenham.tech/",
				label: "Visit Site",
			},
		],
		skills: ["Typescript", "Nextjs", "TailwindCSS", "CSS3", "HTML5"],
		overview: `You're looking at it! I wanted my portfolio to be more than just a showcase - it needed to
      demonstrate my commitment to clean code, performance, and thoughtful user experience. Built with Next.js 14
      and TypeScript, this site combines modern web practices with careful attention to accessibility and performance.

      While it might be a simpler project than some others in my portfolio, it represents my approach to
      development: clean, efficient, and focused on the user experience.`,
		features: [
			"Server-side rendering with Next.js 15 for optimal performance",
			"Responsive design with fluid typography and layouts",
			"Carefully crafted animations using CSS transitions",
			"Dark mode with system preference detection",
			"Accessibility features including proper ARIA labels and keyboard navigation",
			"SEO optimization with Next.js metadata API",
		],
		architecture: {
			frontend: `Built with Next.js 15's App Router for optimal static generation.
        Implemented WCAG-compliant accessible design patterns.
         Created reusable components with TypeScript for type safety.`,

			backend: `Leveraged Next.js API routes for static generation.
      Implemented efficient asset optimization and delivery.`,

			infrastructure: `Deployed on Vercel with automatic previews for all changes.
      Set up proper meta tags and SEO optimization for all pages.`,
		},
	},
	{
		title: "Bun Server Starter",
		slug: "bun-server-starter",
		projectType: "starter", // or 'tool'
		description:
			"A production-ready Bun HTTP server template with TypeScript, structured logging, and proper error handling.",
		// No imageSrc or videoSrc needed if your 'tool' card doesn't use them
		links: [
			{
				type: "github",
				url: "https://github.com/joshuaisaact/bun-server-starter",
				label: "View on GitHub",
			},
		],
		skills: ["Bun", "TypeScript"],
		overview:
			"This starter provides a solid foundation for building robust HTTP APIs with Bun, focusing on best practices like structured logging, comprehensive error handling, and a clear project structure for scalability.",
		features: [
			"TypeScript with strict typing",
			"Structured logging with Pino",
			"Comprehensive error handling",
			"Environment configuration",
			"Testing setup with Bun's test runner",
		],
	},
	{
		title: "Go AI Agent Foundation",
		slug: "go-ai-agent-foundation",
		projectType: "tool", // or 'library'
		description:
			"A foundational Go project for building AI agents that interact with users and utilize tools, defaulting to the Anthropic (Claude) API.",
		imageSrc: "/media/skills/go.svg", // Path to your Go Gopher SVG or similar
		imageAlt: "Go Language Logo",
		links: [
			{
				type: "github",
				url: "https://github.com/joshuaisaact/Go-AI-Agent", // Ensure this is the correct repo name
				label: "View on GitHub",
			},
		],
		skills: ["Go"],
		overview: `This project provides a flexible and extensible foundation for creating AI agents in Go. It handles core agent logic, inference with LLMs (Anthropic's Claude by default), and a system for defining and integrating custom tools. The goal is to accelerate the development of sophisticated AI agents capable of complex task execution directly from the command line.`,
		features: [
			"Core agent interaction loop for user input and agent responses.",
			"Inference engine for LLM communication (Anthropic API integrated).",
			"Extensible tool system with clear schema definitions.",
			"Example tools: file system operations (read_file, list_files, edit_file).",
			"ripgrep_search tool for powerful regex searches within files/directories.",
			"Designed for building command-line interface (CLI) based agents.",
			"Modular structure (cmd/agent, pkg/agent, pkg/tools) for easy customization.",
		],
		architecture: {
			backend: `Written entirely in Go (Golang).
        Handles API calls to the Anthropic (Claude) API for inference.
        Manages tool registration, invocation based on LLM output, and response parsing.
        Main application entry point in cmd/agent/main.go.
        Core agent logic resides in pkg/agent/.
        Tool definitions and implementations in pkg/tools/.`,
		},
	},
];

export const applicationProjects = PROJECTS.filter(
	(p) => !p.projectType || p.projectType === "application",
);

export const utilityProjects = PROJECTS.filter((p) =>
	["tool", "library", "starter"].includes(p.projectType || ""),
);