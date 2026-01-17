# Blog Frontend

A modern blog frontend built with React, featuring a rich text editor, dark mode, comment system, and a full admin dashboard.

It is designed to work in conjunction with my [Blog API](https://github.com/JacobArthurs/blog-api), ensuring a full-stack application experience.

## Technology Stack

- **Framework**: React with React Router
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Shadcn
- **Rich Text Editor**: TipTap
- **Form Handling**: React Hook Form + Zod
- **Testing**: Vitest
- **Linting/Formatting**: ESLint + Prettier

## Features

### Public

- Blog home page with featured post and paginated recent posts
- Individual post pages with comments
- Tag-based post filtering
- Global search (Cmd+K / Ctrl+K)
- Light/Dark theme toggle
- RSS feed and sitemap support

### Admin

- Post management with rich text editor (create, edit, delete)
- Tag management (create, edit, delete)
- Image uploads
- JWT authentication

## Running the App

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run serve
```

## Testing

Run tests in watch mode:

```bash
npm run test
```

Run tests with UI dashboard:

```bash
npm run test:ui
```

## Project Structure

```text
blog-frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── layout/      # Header, Footer, MainLayout
│   │   └── ui/          # Shadcn UI components
│   ├── pages/           # Page components
│   │   ├── public/      # Home, Post, Tag, Login, NotFound
│   │   └── admin/       # Admin dashboard, Post editor, Tag editor
│   ├── services/        # API client and authentication
│   ├── contexts/        # React Context providers (theme)
│   ├── types/           # TypeScript type definitions for the Blog API
│   ├── utils/           # Utility functions
│   └── lib/             # Library utilities
├── functions/           # Cloudflare Workers (RSS, sitemap proxies)
├── public/              # Static assets
└── dist/                # Production build output
```

## Environment Setup

Create a `.env` file in the project root:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

This configures the backend API endpoint. For production, update this to your deployed API URL.
