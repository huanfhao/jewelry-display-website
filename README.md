# SY Jewelry Display

A modern e-commerce website for jewelry display and sales, built with Next.js 14.

## Features

- 🛍️ Product browsing and searching
- 📱 Responsive design for all devices
- 🎨 Beautiful UI with animations
- 📧 Contact form with email notifications
- 🔒 Admin dashboard with authentication
- 🌐 SEO optimized
- 🚀 High performance & accessibility
- 🌍 Internationalization support

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** NextAuth.js
- **Email:** Resend
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics & Google Analytics

## Getting Started

### Prerequisites

- Node.js 18+ 
- PNPM
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sy-jewelry-display.git
cd sy-jewelry-display
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
ADMIN_EMAIL="your-admin-email"

# Analytics
NEXT_PUBLIC_GA_ID="your-ga-id"
```

5. Initialize the database:
```bash
pnpm prisma generate
pnpm prisma db push
pnpm run db:seed
```

6. Start the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to see your application.

## Project Structure

```
├── prisma/               # Database schema and migrations
├── public/              # Static assets
├── scripts/             # Build and setup scripts
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   ├── lib/           # Utility functions
│   ├── types/         # TypeScript types
│   └── hooks/         # Custom React hooks
```

## Key Features Documentation

### Authentication

The application uses NextAuth.js for authentication. Admin users can be created using:

```bash
pnpm run create-admin
```

Default admin credentials:
- Email: admin@example.com
- Password: admin123

### Database Models

- **User**: Admin user accounts
- **Category**: Product categories
- **BlogPost**: Blog articles
- **ContactMessage**: Contact form submissions

### API Routes

- `POST /api/contact` - Submit contact form
- `GET /api/messages` - Get all contact messages (admin only)
- `GET /api/products` - Get all products
- `GET /api/blog` - Get blog posts

### Internationalization

The site supports multiple languages:
- English (default)
- Chinese

Language files are located in `src/app/i18n/locales/`.

### Performance Optimization

- Images are automatically optimized
- CSS is minified in production
- Code splitting and lazy loading
- Static page generation where possible

### SEO

- Dynamic meta tags
- Structured data for products
- Automatic sitemap generation
- robots.txt configuration

## Development Workflow

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "feat: add your feature"
```

3. Push changes and create a pull request:
```bash
git push origin feature/your-feature-name
```

## Deployment

The application is configured for deployment on Vercel:

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Framer Motion](https://www.framer.com/motion/)

## Database Deployment

This project uses Neon - a serverless PostgreSQL database service.

### Neon Database Setup
1. Go to [Neon](https://neon.tech) and sign in
2. Create a new project or select existing one
3. Get your connection string from the dashboard
4. Update your `.env` file with the connection string:
   ```env
   DATABASE_URL="postgres://[user].[project-id].neon.tech/neondb?sslmode=require"
   ```
5. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

> Note: Make sure to enable "Pooling mode" in your Neon project settings for better performance in production.

## Database Deployment

This project uses a cloud-hosted PostgreSQL database. We recommend using one of these services:

### Option 1: Supabase
1. Create a new project on [Supabase](https://supabase.com)
2. Get your database connection string from the project settings
3. Update your `.env` file with the connection string

### Option 2: Railway
1. Create a new project on [Railway](https://railway.app)
2. Add a PostgreSQL database to your project
3. Copy the connection string to your `.env` file

### Option 3: Neon
1. Create a new project on [Neon](https://neon.tech)
2. Get your connection string from the dashboard
3. Update your `.env` file