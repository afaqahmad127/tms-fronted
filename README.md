### TMS Frontend - React Application

A modern, beautiful Transportation Management System frontend built with React, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🎨 **Beautiful Dark UI** with glassmorphism effects
- 📱 **Responsive Design** for all devices
- 🍔 **Hamburger Menu** with submenu navigation
- 📊 **Grid & Tile Views** for shipments
- 🔍 **Advanced Filtering** and search
- 📄 **Pagination & Sorting**
- 🎭 **Smooth Animations** with Framer Motion
- 🔐 **Role-based Access Control**

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Apollo Client (GraphQL)
- Framer Motion (animations)
- React Router (navigation)
- React Hot Toast (notifications)
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running on port 4000

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create `.env` file:
\`\`\`env
VITE_API_URL=http://localhost:4000/graphql
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint

## Project Structure

\`\`\`
src/
├── components/      # Reusable UI components
│   └── Layout.tsx   # Main layout with navigation
├── context/         # React contexts
│   └── AuthContext  # Authentication state
├── lib/             # Utilities and configurations
│   ├── apollo.ts    # Apollo Client setup
│   └── graphql.ts   # GraphQL queries/mutations
├── pages/           # Page components
│   ├── Dashboard    # Overview with stats
│   ├── Shipments    # Grid/Tile view of shipments
│   ├── ShipmentDetail # Detailed shipment view
│   ├── Analytics    # Performance metrics
│   ├── Settings     # User preferences
│   └── Login        # Authentication
├── types/           # TypeScript definitions
├── App.tsx          # Route configuration
├── main.tsx         # Entry point
└── index.css        # Global styles
\`\`\`

## Features Overview

### Navigation
- **Hamburger Menu**: Collapsible sidebar on mobile with submenu support
- **Horizontal Menu**: Quick access to common views on desktop

### Shipments View
- **Grid View**: Traditional table with 10 columns, sortable headers
- **Tile View**: Card-based layout with key information
- **Filtering**: By status, priority, carrier, etc.
- **Search**: Full-text search across shipments
- **Pagination**: Navigate through large datasets

### Shipment Actions
- **View Details**: Expanded view with full information
- **Edit**: Modify shipment details
- **Flag/Unflag**: Mark shipments for attention
- **Delete**: Remove shipments (admin only)
- **Status Update**: Change shipment status

### Role-based Access
- **Admin**: Full access including delete and bulk operations
- **Employee**: View and edit access

## Test Credentials

- **Admin**: admin@tms.com / admin123
- **Employee**: employee@tms.com / employee123

