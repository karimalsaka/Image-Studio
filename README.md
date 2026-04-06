# Image Studio

Generate, compare, and refine AI images — all in one place.

Instead of juggling ChatGPT, Gemini, and other tools separately, Image Studio lets you run the same prompt across multiple AI models simultaneously and compare the results side by side. Pick your favourite, then refine it through conversation until it's exactly what you want.

<!-- TODO: Add screenshot -->

## Why Image Studio?

**The problem:** Every AI image model has a different style, different strengths, and different quirks. Finding the best result means opening multiple tabs, copy-pasting prompts, and manually comparing outputs.

**The solution:** Write your prompt once, select the models you want, and see all the results stream in side by side in real time. Then click "Refine" on any image to start a conversation — ask for changes, adjust the style, tweak details — without starting over.

## Features

- **Multi-model generation** — Run the same prompt across Gemini, GPT-5 Image, and more in a single click. Results stream in as each model finishes, so you're not waiting for the slowest one.
- **Side-by-side comparison** — See every model's output in a grid with labels, so you can instantly tell which model handled your prompt best.
- **Conversational refinement** — Click "Refine" on any image to open a chat. Describe changes in natural language and the model will iterate on the image, keeping the conversation history as context.
- **Multiple aspect ratios** — Square, landscape, portrait, ultra-wide — pick the right format for your use case.
- **Chat history** — All your conversations are saved. Come back anytime to continue refining or revisit past generations.
- **Real-time streaming** — Server-sent events deliver each model's result the moment it's ready, not after all models finish.

## Tech Stack

### Frontend
- **Next.js 16** with React 19
- **Tailwind CSS v4** for styling
- **Motion** for animations
- TypeScript throughout

### Backend
- **Express 5** with a layered architecture (routes, controllers, services, repositories)
- **PostgreSQL** with **Prisma ORM**
- **Zod** for request validation
- **JWT** cookie-based authentication
- **Winston** for structured logging
- **express-rate-limit** for API protection
- **AWS S3** for image storage

### AI
- **OpenRouter API** — unified access to multiple image generation models
- Server-sent events (SSE) for streaming results from parallel model calls

## Architecture

```
Frontend (Next.js)
  → API service layer
    → Express server
      → Route (Zod validation middleware)
        → Controller (orchestration)
          → Service (business logic)
            → Repository (database) / External APIs (OpenRouter, S3)
```

Each layer has a single responsibility. Zod schemas validate all incoming requests at the route level. Controllers receive typed data — never `req`/`res`. Services handle business logic and call repositories for database access or external services for APIs. Repositories are thin wrappers around Prisma queries.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- AWS S3 bucket
- OpenRouter API key

### Setup

1. Clone the repo:
```bash
git clone https://github.com/karimalsaka/imagestudio.git
cd imagestudio
npm install
```

2. Set up the server environment variables in `server/.env`:
```env
DATABASE_URL=postgresql://...
OPENROUTER_API_KEY=sk-or-...
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
S3_BUCKET_NAME=your-bucket
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

3. Set up the frontend environment variable in `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

4. Run database migrations:
```bash
npx prisma migrate deploy
```

5. Start the development servers:
```bash
# Terminal 1 — backend
npm run server

# Terminal 2 — frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

MIT
