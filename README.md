## CV Builder (Next.js 15 + OpenAI/Claude/Gemini + LaTeX)

### Features

- Upload/paste CV JSON and a Job Description
- Generate ATS-optimized LaTeX via OpenAI GPT-4o-mini, Anthropic Claude, or Google Gemini
- Monaco editor for LaTeX with live PDF preview
- Compile LaTeX to PDF server-side with pdflatex (Docker)

### Prerequisites

- Node.js 20+
- One or more API keys depending on provider
  - `OPENAI_API_KEY` (for OpenAI)
  - `ANTHROPIC_API_KEY` (for Claude)
  - `GOOGLE_API_KEY` (for Gemini)

### Setup

1. Install deps:

```bash
npm ci
# If you just pulled changes that added providers, run:
npm i anthropic @google/generative-ai --no-audit --no-fund
```

2. Create `.env.local` with any providers you plan to use:

```bash
# OpenAI
OPENAI_API_KEY=your_openai_key

# Anthropic (Claude)
ANTHROPIC_API_KEY=your_anthropic_key

# Google Gemini
GOOGLE_API_KEY=your_google_key
```

3. Run dev:

```bash
npm run dev
```

Open http://localhost:3000

### Usage

- Paste or upload your CV JSON, paste a JD, and choose a provider (OpenAI/Claude/Gemini).
- Click "Generate CV" to get LaTeX; edit in the editor.
- Preview updates live; click Download PDF to save.

### Build & Run with Docker

```bash
docker build -t cv-builder .
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  -e GOOGLE_API_KEY=$GOOGLE_API_KEY \
  cv-builder
```

### API

- `POST /api/generate` → `{ latex }`
  - Body: `{ cv: any, jd: string, provider?: "openai" | "claude" | "gemini" }` (default: `openai`)
- `POST /api/compile` → PDF blob

### Notes

- Ensure your `.env.local` or container env includes the key for the selected provider.
- Docker image includes `texlive-full` to support `pdflatex` for compilation.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
