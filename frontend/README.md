# Permit Office Finder - Frontend

A modern React application built with Next.js 15, TypeScript, and Tailwind CSS for finding building permit offices.

## 🚀 Features

- **Smart Search**: Find permit offices by location, address, or permit type
- **Interactive Maps**: View offices on an interactive map with directions
- **Office Details**: Complete contact information, hours, and services
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Maps**: Mapbox GL JS
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_key
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── office-card.tsx
│   ├── office-map.tsx
│   └── search-form.tsx
└── lib/               # Utilities and configuration
    ├── constants.ts   # App constants
    ├── types.ts      # TypeScript types
    └── utils.ts      # Utility functions
```

## 🎨 Components

### Core Components

- **SearchForm**: Main search interface with filters
- **OfficeCard**: Display permit office information
- **OfficeMap**: Interactive map with office locations

### UI Components

All UI components are built with shadcn/ui:
- Button, Card, Input, Select, Badge, etc.

## 🗺️ Map Integration

The app uses Mapbox GL JS for interactive maps. To enable map functionality:

1. Sign up for a [Mapbox account](https://www.mapbox.com/)
2. Get your access token
3. Add it to your `.env.local` file

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`: Mapbox access token
- `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`: Google Places API key

### Tailwind CSS

The app uses Tailwind CSS v4 with custom theme configuration in `globals.css`.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.