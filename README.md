# Emily Dickinson Sublime

![Preview](public/meta/social-share.gif)

**Live Demo:** [emilypoems.com](https://emilypoems.com)

## Technologies Used
- **Next.js** – Framework for React, handling routing, SSR, and optimizations
- **TypeScript** – Static typing throughout the codebase
- **Tailwind CSS** – Utility-first styling for rapid UI development
- **Three.js** – WebGL-based 3D rendering of poem-node graph
- **Hugging Face Transformers** (`all-MiniLM-L6-v2`) – Sentence embeddings via feature-extraction API for semantic positioning
- **Vercel** – Continuous deployment and hosting

## Project Overview
Emily Dickinson Sublime transforms a selected corpus of Emily Dickinson’s poems into an interactive 3D network. Each poem is embedded using a pretrained sentence-transformer LLM, averaged into 3D coordinates, and rendered as a colored node. Connections represent semantic neighbors and shared motifs, enabling exploration of thematic relationships in Dickinson’s work.

## Key Features
- **Semantic Embedding**: Poems sent to Hugging Face’s API endpoint `https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2` to generate 384-dimensional embeddings.
- **3D Visualization**: Nodes positioned using the first three dimensions of averaged embeddings, rendered with Three.js for rotation, zoom, and interactive exploration.
- **Color Coding**: Node hues derived from normalized x-coordinate to group semantically similar poems by shade.
- **Animated Connections**: Edges link each poem to its two nearest embedding neighbors and to others sharing key literary motifs.
- **Responsive Design**: Tailwind CSS ensures a clean, mobile-friendly UI; clicking a node opens a detail modal with the full poem text.

## How It Works

- **Position**: Sends each poem’s text to Hugging Face’s `all-MiniLM-L6-v2` endpoint, averages the resulting 384‑dimensional embeddings, and uses the first three dimensions as 3D coordinates—semantically similar poems cluster together.
- **Color**: Normalizes each node’s x‑coordinate within the embedding space to assign a hue, grouping them by theme.
- **Connections**: Draws animated edges to the two nearest embedding neighbors and other poems sharing major motifs, highlighting thematic links.
- **Size**: Scales each node by its total number of connections, making highly connected poems stand out.

## Getting Started

1. **Clone the repository**  
   ```bash
   git clone https://github.com/colewendling/emily-dickinson-sublime.git
   cd emily-dickinson-sublime
   ```

2. **Install dependencies**  
   ```bash
   pnpm install
   ```

3. **Run in development mode**  
   ```bash
   pnpm dev
   ```  
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

- Hosted on Vercel. Push to the `main` branch to trigger automatic deployment.
