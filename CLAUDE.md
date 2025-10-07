# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered podcast generator that transforms uploaded documents into conversational podcasts. The application uses a three-panel interface for configuration, chat interaction, and podcast generation/preview.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 5173 by default)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Lucide React** - Icon library
- **ESLint** - Code linting

## Application Architecture

### Three-Panel Layout Structure

The app uses a fixed 12-column grid layout (`src/App.tsx`) with three main panels:

1. **Left Panel (3 cols)** - `PodcastForm` component
   - Document upload interface
   - Podcast configuration (length, tone, audience, voices, etc.)
   - Form submission triggers app state change via `onFormSubmit` callback

2. **Center Panel (5 cols)** - `ChatInterface` component
   - Chat interface for refining podcast requirements
   - Disabled until configuration is uploaded
   - Receives `isDisabled` prop from App state

3. **Right Panel (4 cols)** - `GenerationPanel` component
   - Podcast generation and preview controls
   - Progress tracking during generation
   - Audio player mockup for preview
   - Disabled until configuration is uploaded
   - Receives `isDisabled` prop from App state

### State Flow

- App maintains `isFormSubmitted` state that controls when chat and generation panels become active
- Each component manages its own internal state (files, messages, generation progress, etc.)
- Components communicate via props, not through global state management

### Component Interfaces

All major components use TypeScript interfaces:
- `PodcastConfig` - Configuration object structure (files, length, tone, voices, etc.)
- `Message` - Chat message structure (id, type, content, timestamp)
- Props interfaces define component contracts (`PodcastFormProps`, `ChatInterfaceProps`, `GenerationPanelProps`)

## Deployment

Production deployment on Netlify: https://zippy-speculoos-b2cb43.netlify.app/
