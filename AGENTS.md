---
name: "Reentry Buddy Project"
description: "A comprehensive development guide for Reentry Buddy - a wellness-focused full-stack application for recovery support, based on React 19 + TypeScript + Express + PostgreSQL, including complete development standards and best practices tailored to this workspace's actual structure."
---

# Reentry Buddy Project Development Guide

## Project Overview

Reentry Buddy is a wellness-focused full-stack application designed to support individuals in recovery. It provides daily check-ins, goal tracking, journaling, and emotional support features with a calming, accessible design system focused on trust and emotional safety.

## Tech Stack

- **Frontend Framework**: React 19 + TypeScript (project is planned to be upgraded to React 19)
- **Build Tool**: Vite
- **Backend Framework**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query (React Query)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod validation
- **Authentication**: Passport.js with local strategy
- **Icons**: Lucide React
- **Code Quality**: ESLint + Prettier + TypeScript

## Project Structure

```
reentry-buddy/
├── client/                 # Frontend React application
│   ├── public/
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   └── examples/  # Example components
│   │   ├── pages/         # Page components
│   │   │   ├── Landing.tsx
│   │   │   ├── CheckIn.tsx
│   │   │   └── not-found.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database connection
│   └── vite.ts           # Vite development setup
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
├── .env.example           # Environment variables template
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
└── design_guidelines.md   # Wellness-focused design system
```

## Development Guidelines

### Component Development Standards

1. **Function Components First**: Use function components and Hooks
2. **TypeScript Types**: Define interfaces for all props
3. **Component Naming**: Use PascalCase, file name matches component name
4. **Single Responsibility**: Each component handles only one functionality

```tsx
// Example: CheckInButton Component
interface CheckInButtonProps {
  variant: "primary" | "secondary" | "calm";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const CheckInButton: React.FC<CheckInButtonProps> = ({
  variant,
  size = "medium",
  disabled = false,
  onClick,
  children,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### State Management Standards

Using TanStack Query for server state management:

```tsx
// lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
```

### API Service Standards

```tsx
// server/routes.ts
import express from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes for check-ins, users, and wellness data
app.use("/api/check-ins", checkInRoutes);
app.use("/api/users", userRoutes);
```

## Environment Setup

### Development Requirements

- Node.js >= 19.0.0
- npm >= 8.0.0 or yarn >= 1.22.0
- PostgreSQL database

### Installation Steps

```bash
# 1. Clone and navigate to project directory
git clone <repository-url>
cd reentry-buddy

# 2. Install dependencies
npm install

# 3. Set up database
npm run db:push

# 4. Configure environment variables
cp .env.example .env.local

# 5. Start development server
npm run dev
```

### Environment Variables Configuration

```env
# .env.local
DATABASE_URL=postgresql://username:password@localhost:5432/reentry_buddy
NODE_ENV=development
PORT=5000 (5001 on mac)
SESSION_SECRET=your-session-secret
```

## Routing Configuration

```tsx
// client/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Landing from "@/pages/Landing";
import CheckIn from "@/pages/CheckIn";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
```

## Database Schema

```tsx
// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
```

## Testing Strategy

### Unit Testing Example

```tsx
// Example test structure for wellness components
import { render, screen, fireEvent } from "@testing-library/react";
import { CheckInButton } from "../src/components/CheckInButton";

describe("CheckInButton Component", () => {
  test("renders button with wellness-focused text", () => {
    render(<CheckInButton variant="primary">Check In for Today</CheckInButton>);
    expect(screen.getByText("Check In for Today")).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(
      <CheckInButton variant="primary" onClick={handleClick}>
        Check In for Today
      </CheckInButton>
    );

    fireEvent.click(screen.getByText("Check In for Today"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Performance Optimization

### Code Splitting

```tsx
import { lazy, Suspense } from "react";

const LazyCheckInForm = lazy(() => import("./components/CheckInForm"));

function App() {
  return (
    <Suspense fallback={<div>Loading check-in form...</div>}>
      <LazyCheckInForm />
    </Suspense>
  );
}
```

### Memory Optimization

```tsx
import { memo, useMemo, useCallback } from "react";

const WellnessCard = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map((item) => ({ ...item, wellnessScore: item.score }));
  }, [data]);

  const handleUpdate = useCallback(
    (id) => {
      onUpdate(id);
    },
    [onUpdate]
  );

  return (
    <div>
      {processedData.map((item) => (
        <div key={item.id} onClick={() => handleUpdate(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
```

## Deployment Configuration

### Build Production Version

```bash
npm run build
```

### Vite Configuration Optimization

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-button"],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

## Common Issues

### Issue 1: Database Connection Errors

**Solution**:

- Verify DATABASE_URL environment variable is correctly set
- Ensure PostgreSQL is running and accessible
- Check database permissions for the configured user
- Run `npm run db:push` to sync schema

### Issue 2: TypeScript Type Errors

**Solution**:

- Ensure all UI component imports from @/components/ui/\* are correct
- Check that shared types are properly imported
- Verify all environment variables have proper typing
- Use `npm run check` for type checking

## Reference Resources

- [React Official Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [TanStack Query Documentation](https://tanstack.com/query/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Official Documentation](https://www.typescriptlang.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
