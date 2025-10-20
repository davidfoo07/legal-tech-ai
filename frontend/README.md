# LawLink - AI-Powered Labour Law Consultation

A production-ready React + TypeScript + Vite frontend application for LawLink, an AI legal consultation platform specializing in labour law cases including wrongful termination, discrimination, and unpaid wages.

## 🚀 Features

- **Interactive AI Chat Interface**: Real-time conversation with AI legal assistant
- **Labour Law Specialization**: Focused on employment law matters
- **Professional Design**: Clean, trustworthy legal-tech aesthetic
- **Mobile-First Responsive**: Works seamlessly on all devices (375px+)
- **Real-time Typing Indicators**: Enhanced user experience
- **Message History**: Persistent conversation tracking
- **Accessibility**: WCAG compliant with semantic HTML and ARIA labels
- **Type-Safe**: Full TypeScript implementation with strict mode

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 4
- **Styling**: Tailwind CSS with custom color scheme
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Markdown**: React Markdown (for AI responses)

## 🎨 Design System

### Color Palette
- **Primary**: `#1e3a8a` (Deep Blue) - Professional, trustworthy
- **Accent**: `#f59e0b` (Gold) - Attention, highlights
- **Success**: `#059669` (Emerald) - Positive actions
- **Neutral**: `#475569` (Slate) - Text, borders

### Typography
- **Font Stack**: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
- **Responsive**: Mobile-first with fluid scaling

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── scroll-area.tsx
│   │   └── toast.tsx
│   ├── chat/              # Chat interface components
│   │   ├── ChatMessage.tsx    # Message bubbles with avatars
│   │   ├── ChatInput.tsx      # Input with validation
│   │   └── ChatWindow.tsx     # Main chat interface
│   └── layout/            # Layout components
│       ├── Header.tsx         # App header with logo
│       ├── Footer.tsx         # App footer
│       └── Container.tsx      # Responsive wrapper
├── stores/
│   └── chatStore.ts       # Zustand store for chat state
├── api/
│   ├── mock.ts           # Mock API with realistic responses
│   └── types.ts          # TypeScript interfaces
├── hooks/
│   └── useChat.ts        # Custom hook for chat logic
├── lib/
│   └── utils.ts          # Utility functions
├── App.tsx               # Main application component
└── main.tsx             # Application entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ (recommended: 18.16.0+)
- npm 9+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## 🧪 Demo Data

The application includes pre-seeded demo conversations covering common labour law scenarios:

1. **Wrongful Termination**: "I was fired after taking medical leave"
2. **Unpaid Wages**: "My employer hasn't paid me overtime"
3. **Workplace Discrimination**: "I think I'm being discriminated against"

## 🔧 Configuration

### Path Aliases
- `@/*` maps to `src/*` for cleaner imports

### Environment Variables
Currently using mock API. When integrating with real backend:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Tailwind Configuration
Custom colors and utilities configured in `tailwind.config.js`

## 🎯 API Integration

The frontend is designed to work with the API contract defined in `../shared/api-contract.md`. Currently uses mock API that simulates:

- 500-1500ms network delays
- Realistic AI responses for labour law questions
- In-memory data storage
- Full API contract compliance

### Switching to Real API
1. Update `src/api/mock.ts` with real API endpoints
2. Configure environment variables
3. Update CORS settings if needed

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Mobile Responsiveness

- Minimum supported width: 375px (iPhone SE)
- Fluid design scales from mobile to desktop
- Touch-friendly interface elements
- Optimized chat experience for mobile

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- High contrast color ratios
- Focus management

## 🔒 Security Considerations

- All inputs validated and sanitized
- XSS protection through React's built-in escaping
- No sensitive data in localStorage
- HTTPS enforced in production

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Contributing

1. Follow the existing code style
2. Run `npm run lint` and `npm run format` before committing
3. Ensure all TypeScript checks pass
4. Test on mobile devices
5. Maintain accessibility standards

## 📄 License

Private - LawLink AI Legal Consultation Platform

---

**Note**: This is an AI assistant for informational purposes only. Users should consult qualified lawyers for actual legal advice.
