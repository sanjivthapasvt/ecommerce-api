# Backend Project

A TypeScript Express backend project with TypeORM integration.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- pnpm (recommended) or npm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory and configure your environment variables:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=backend
```

## Development

To start the development server:

```bash
pnpm dev
```

The server will start on http://localhost:3000 (or the port specified in your .env file).

## Scripts

- `pnpm dev` - Start the development server
- `pnpm dev:sync` - Start the development server with database sync
- `pnpm build:local` - Build for local environment
- `pnpm build:prod` - Build for production
- `pnpm build:staging` - Build for staging
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier

## Database Migrations

- Generate a migration:
```bash
pnpm migration:generate
```

- Create a new migration:
```bash
pnpm migration:create
```

- Run migrations:
```bash
pnpm migration:run
```

- Revert last migration:
```bash
pnpm migration:revert
```

## Project Structure

```
src/
├── config/         # Configuration files
├── middleware/     # Express middleware
├── migrations/     # TypeORM migrations
├── models/        # Database models
├── routes/        # API routes
└── index.ts       # Application entry point
```

## Features

- Express.js with TypeScript
- TypeORM for database management
- JWT authentication
- Error handling middleware
- Request validation
- Database migrations
- ESLint + Prettier for code quality
- Jest for testing

## License

MIT # node_ts_backend_starter_template
