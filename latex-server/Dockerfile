FROM node:20-bookworm

WORKDIR /app

ENV NODE_ENV=production

# Install LaTeX (subset sufficient for most resumes)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --only=production --no-audit --no-fund

COPY server.js ./server.js

EXPOSE 8080
CMD ["node", "server.js"]


