# WealthBeeing 🌱💰

A modern financial wellness platform built with Next.js, helping users manage their wealth and financial well-being.

## Tech Stack

- **Frontend Framework**: [Next.js 15.1.0](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & Backend**: [Supabase](https://supabase.io/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (Package Manager)
- Supabase Account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wealthbeeing.git
   cd wealthbeeing
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables in `.env.local`

4. Start the development server:
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Features

- 📊 Financial Dashboard
- 💰 Wealth Tracking
- 📈 Investment Analytics
- 🔐 Secure Authentication
- 📱 Responsive Design
- 🎯 Goal Setting
- 📝 Financial Planning Tools

## Project Structure

```
wealthbeeing/
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   └── pages/        # Page components
├── public/            # Static assets
├── styles/           # Global styles
├── types/            # TypeScript types
└── utils/            # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com) 