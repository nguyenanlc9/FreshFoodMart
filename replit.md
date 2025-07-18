# FoodMart - E-commerce Food Application

## Overview

FoodMart is a full-stack e-commerce application built for selling fresh food products. It features a modern React frontend with TypeScript, a Node.js/Express backend, and PostgreSQL database integration using Drizzle ORM. The application includes customer-facing product browsing with shopping cart functionality and an admin dashboard for product management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot module replacement with Vite integration

### Database Design
- **Products Table**: Stores product information (name, category, price, weight, rating, description, image)
- **Cart Items Table**: Manages shopping cart items with session-based storage
- **Admins Table**: Handles admin authentication with email/password

## Key Components

### Product Management
- **Product Grid**: Displays products with category filtering and search functionality
- **Product Cards**: Individual product displays with rating, pricing, and cart actions
- **Category Filter**: Allows filtering by product categories (vegetables, meat, dairy, eggs, dry goods)

### Shopping Cart
- **Cart Hook**: Custom React hook for cart state management
- **Session-based Storage**: Cart items are stored per session ID
- **Real-time Updates**: Cart updates reflect immediately in the UI

### Admin Dashboard
- **Authentication**: Email/password login system for admin access
- **Product Management**: CRUD operations for products
- **Product Form**: Modal-based form for adding/editing products
- **Product Table**: Data table with edit/delete actions

### UI Components
- **shadcn/ui**: Comprehensive component library for consistent design
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Toast Notifications**: User feedback for actions and errors
- **Loading States**: Skeleton loaders and loading indicators

## Data Flow

1. **Product Browsing**: Users browse products by category or search, data fetched from `/api/products`
2. **Cart Management**: Add/update/remove items via cart API endpoints, stored by session ID
3. **Admin Operations**: Authenticated admins can manage products through dedicated API endpoints
4. **Real-time Updates**: TanStack Query automatically refetches data and updates UI

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Data Fetching**: TanStack Query for server state
- **Icons**: Lucide React icons
- **Utilities**: date-fns for date handling, zod for validation

### Backend Dependencies
- **Express.js**: Web framework with middleware support
- **Database**: Drizzle ORM with PostgreSQL driver (@neondatabase/serverless)
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **Validation**: Zod for schema validation
- **Development**: tsx for TypeScript execution, esbuild for production builds

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for frontend development
- **Express Server**: Serves API endpoints and static files
- **Database**: PostgreSQL with Drizzle migrations
- **Session Storage**: PostgreSQL-based sessions for cart persistence

### Production Build
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations ensure schema consistency
- **Static Serving**: Express serves built frontend files

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment flag (development/production)
- **Session Configuration**: Secure session handling with PostgreSQL store

The application uses a monorepo structure with shared TypeScript schemas between frontend and backend, ensuring type safety across the entire stack. The modular architecture allows for easy maintenance and feature additions while maintaining clean separation of concerns.