# Web application using React and Typescript using Supabase

A modern web application built with React, TypeScript, and Vite, featuring Supabase integration, mapping capabilities, and data visualization.

## 🚀 Features

- ⚡️ Built with Vite for lightning-fast development
- 🎯 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🗺️ Mapping functionality with Leaflet
- 📊 Data visualization with Recharts
- 🔐 Authentication and database with Supabase
- 🛣️ React Router for navigation
- 🎭 Framer Motion for animations
- 🔥 Hot toast notifications

## 📦 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vite-react-typescript-starter
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

To preview the production build:

```bash
npm run preview
# or
yarn preview
```

## 🧪 Linting

To run the linter:

```bash
npm run lint
# or
yarn lint
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # React context providers
├── lib/          # Utility functions and configurations
├── types/        # TypeScript type definitions
├── services/     # API and service integrations
├── App.tsx       # Main application component
└── main.tsx      # Application entry point
```

## 🛠️ Built With

- [React](https://reactjs.org/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [Vite](https://vitejs.dev/) - Build Tool
- [Supabase](https://supabase.com/) - Backend as a Service
- [React Router](https://reactrouter.com/) - Routing
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Leaflet](https://leafletjs.com/) - Interactive Maps
- [Recharts](https://recharts.org/) - Charts and Data Visualization
- [React Hot Toast](https://react-hot-toast.com/) - Toast Notifications

## 📦 Dependencies

### Main Dependencies
```json
{
  "@supabase/supabase-js": "^2.39.7",
  "axios": "^1.6.2",
  "date-fns": "^3.3.1",
  "framer-motion": "^10.16.4",
  "jsonwebtoken": "^9.0.2",
  "jwt-decode": "^4.0.0",
  "leaflet": "^1.9.4",
  "lucide-react": "^0.344.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-hot-toast": "^2.4.1",
  "react-leaflet": "^4.2.1",
  "react-router-dom": "^6.20.0",
  "recharts": "^2.12.2"
}
```

### Development Dependencies
```json
{
  "@eslint/js": "^9.9.1",
  "@types/jsonwebtoken": "^9.0.5",
  "@types/leaflet": "^1.9.8",
  "@types/node": "^20.10.0",
  "@types/react": "^18.3.5",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.3.1",
  "autoprefixer": "^10.4.18",
  "eslint": "^9.9.1",
  "eslint-plugin-react-hooks": "^5.1.0-rc.0",
  "eslint-plugin-react-refresh": "^0.4.11",
  "globals": "^15.9.0",
  "postcss": "^8.4.35",
  "supabase": "^1.145.4",
  "tailwindcss": "^3.4.1",
  "typescript": "^5.5.3",
  "typescript-eslint": "^8.3.0",
  "vite": "^5.4.2"
}
```

## 🔧 Configuration Files

### tsconfig.json
The project uses TypeScript with the following configuration:
```json
{
  "extends": "./tsconfig.app.json"
}
```

### vite.config.ts
Vite is configured with React plugin:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### tailwind.config.js
Tailwind CSS is configured with:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👥 Authors

- K.Dharani Shankar
- R.Akhil Teja
- A.Balaji Asish

## 🙏 Acknowledgments

- Thanks to all the open-source libraries and tools used in this project
- Special thanks to the React and Vite communities
