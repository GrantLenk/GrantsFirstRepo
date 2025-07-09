# Broadcast Video Player Application

## Overview

This is a full-stack application built with React (frontend) and Express (backend) that allows users to schedule and watch daily video broadcasts. The application features a countdown timer, video player, and admin panel for managing broadcast settings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API**: REST endpoints for broadcast management
- **Development**: Hot reload with tsx

### Database Schema
- **broadcasts** table with fields:
  - id (serial primary key)
  - videoUrl (text)
  - broadcastTime (text in HH:MM format)
  - videoTitle (text)
  - date (text in YYYY-MM-DD format)

## Key Components

### Frontend Components
- **Home Page**: Main interface with countdown timer and video player
- **Admin Panel**: Form for setting broadcast details (video URL, time, title)
- **Video Player**: Custom video player with countdown and playback controls
- **Countdown Timer**: Real-time countdown to broadcast time
- **UI Components**: Complete shadcn/ui component library

### Backend Components
- **Routes**: API endpoints for getting and setting broadcasts
- **Storage**: Memory-based storage implementation (MemStorage class)
- **Database**: Drizzle ORM configuration for PostgreSQL

## Data Flow

1. **Initial Load**: Frontend fetches today's broadcast data from `/api/broadcast/today`
2. **Countdown**: Timer calculates time remaining until broadcast time
3. **Video Playback**: When countdown reaches zero, video player starts
4. **Admin Management**: Admin can update broadcast settings via `/api/broadcast` endpoint
5. **Real-time Updates**: Frontend polls for updates every 30 seconds

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM)
- TanStack Query for API state management
- Wouter for routing
- Radix UI for accessible components
- Tailwind CSS for styling
- Lucide React for icons
- Date-fns for date manipulation

### Backend Dependencies
- Express.js for server framework
- Drizzle ORM for database operations
- Neon Database for PostgreSQL hosting
- Zod for schema validation
- tsx for TypeScript execution

## Deployment Strategy

### Development
- Frontend: Vite dev server with hot reload
- Backend: tsx with automatic restart on changes
- Database: PostgreSQL via Neon Database

### Production Build
- Frontend: Vite builds static assets to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Database: Drizzle migrations applied via `db:push` command

### Environment Configuration
- `DATABASE_URL` required for database connection
- Development vs production mode controlled by `NODE_ENV`
- Replit-specific plugins for development environment

The application is designed to be deployed on Replit with PostgreSQL database provisioning. The current implementation uses in-memory storage but is structured to easily switch to the PostgreSQL database when needed.