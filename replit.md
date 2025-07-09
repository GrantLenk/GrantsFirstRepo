# Daily Ad Display Application

## Overview

This is a full-stack application built with React (frontend) and Express (backend) that allows administrators to schedule and display daily video advertisements. The application features a countdown timer, video player, and admin panel for managing ad settings.

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
  - videoUrl (text) - URL to the ad video
  - broadcastTime (text in HH:MM format) - time to display ad
  - videoTitle (text) - title of the advertisement
  - date (text in YYYY-MM-DD format) - date for the ad

## Key Components

### Frontend Components
- **Home Page**: Main interface with countdown timer and ad player
- **Admin Panel**: Form for setting ad details (video URL, time, title)
- **Video Player**: Custom video player with countdown and playback controls for ads
- **Countdown Timer**: Real-time countdown to ad display time
- **UI Components**: Complete shadcn/ui component library

### Backend Components
- **Routes**: API endpoints for getting and setting ad schedules
- **Storage**: Memory-based storage implementation (MemStorage class)
- **Database**: Drizzle ORM configuration for PostgreSQL

## Data Flow

1. **Initial Load**: Frontend fetches today's ad data from `/api/broadcast/today`
2. **Countdown**: Timer calculates time remaining until ad display time
3. **Ad Playback**: When countdown reaches zero, ad video player starts
4. **Admin Management**: Admin can update ad settings via `/api/broadcast` endpoint
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

## Recent Changes

- **2024-01-09**: Updated application focus from general video broadcasts to advertisement display
  - Changed all user-facing text from "broadcast" to "ad" terminology
  - Updated admin panel labels and messages
  - Modified video player waiting state to reference advertisements
  - Updated database schema comments to reflect ad focus
  - Added revenue distribution pie chart showing ad payment breakdown
  - Added adPayment field to database schema with default value of $1000
  - Created RevenuePieChart component showing distribution: 75% user rewards, 15% platform fee, 10% operating costs
  - Updated admin panel to include ad payment amount input field