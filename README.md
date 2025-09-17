## CV Builder (Next.js 15 + OpenAI + LaTeX)

### Features

- Upload/paste CV JSON and a Job Description
- Generate ATS-optimized LaTeX via OpenAI GPT-4o-mini
- Monaco editor for LaTeX with live PDF preview
- Compile LaTeX to PDF server-side with pdflatex (Docker)

### Prerequisites

- Node.js 20+
- OpenAI API key

### Setup

1. Install deps:

```bash
npm ci
```

2. Create `.env.local` with:

```bash
OPENAI_API_KEY=your_key_here
```

3. Run dev:

```bash
npm run dev
```

Open http://localhost:3000

### Usage

- Paste or upload an example from `dat/cv.json`.
- Click "Generate CV" to get LaTeX; edit in the editor.
- Preview updates live; click Download PDF to save.

### Build & Run with Docker

```bash
docker build -t cv-builder .
docker run -e OPENAI_API_KEY=$OPENAI_API_KEY -p 3000:3000 cv-builder
```

### Notes

- API routes: `POST /api/generate` returns `{ latex }`.
- `POST /api/compile` returns a PDF blob. Requires `pdflatex` (provided in Docker image).

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
