# SY Jewelry Display

A modern e-commerce website for jewelry display and sales, built with Next.js 14.

## Features

- 🛍️ Product browsing and searching
- 👤 User authentication and admin management
- 📱 Responsive design
- 🎨 Beautiful UI with animations
- 📧 Contact form with email notifications

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** NextAuth.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Email Service:** Resend
- **Animations:** Framer Motion
- **State Management:** React Hooks
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Icons:** Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sy-jewelry.git
cd sy-jewelry
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sy_jewelry"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
# or
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (site)/            # Public site pages
│   │   ├── about/         # About page
│   │   └── products/      # Products pages
│   ├── (auth)/            # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Register page
│   ├── admin/             # Admin dashboard
│   │   ├── users/         # User management
│   │   └── products/      # Product management
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # UI components
│   ├── admin/            # Admin components
│   ├── products/         # Product components
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
│   ├── prisma.ts        # Prisma client
│   ├── auth.ts          # Auth configuration
│   └── utils/           # Utility functions
└── types/               # TypeScript type definitions
    ├── auth/            # Auth types
    ├── api/             # API types
    └── products/        # Product types
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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