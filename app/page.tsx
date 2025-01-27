// app/page.tsx
'use client';

import Footer from './components/Footer';
import PoemTable from './components/PoemTable';
import PoemGraph from './components/PoemGraph';
// import GenerateButton from './components/GenerateButton';

export default function Home() {
  return (
    <div className="grid gap-12">
      {/* Section: Title and Subtitle */}
      <section className="p-4">
        <h1 className="text-2xl font-bold text-header">
          The Dickinson Sublime
        </h1>
        <h2 className="text-lg text-subheader">mapping eternity</h2>
      </section>
      {/* Sections 1 and 2: Responsive row/column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="p-5 border border-gray-700 rounded">
          <h3 className="text-xl font-semibold mb-2 text-subheader">1735</h3>
          <p className="text-gray-300">
            After her death in 1865, 1735 poems were discovered in Emily
            Dickinson’s room, hidden and neatly organized into hand-sewn
            fascicles. A body of work left by a genius who stared into the face
            of eternity and took a step.
          </p>
        </section>
        <section className="p-5 border border-gray-700 rounded">
          <h3 className="text-xl font-semibold mb-2 text-subheader">
            Sublime Threads
          </h3>
          <p className="text-gray-300">
            Dickinson’s work weaves an intricate web of themes, where life,
            death, and the infinite collide. These connections form an uncharted
            cosmos that beckons us to explore the mysteries she left behind.
          </p>
        </section>
      </div>

      {/* How It Works Section */}
      <section className="p-5 border border-gray-700 rounded">
        <h3 className="text-xl font-semibold mb-4 text-subheader">How It Works</h3>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Position Icon */}
          <div className="flex flex-col items-start">
            <svg className="w-8 h-8 my-6 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line className="animate-horizontal" x1="0" y1="12" x2="24" y2="12" strokeWidth="2"/>
              <line className="animate-vertical" x1="12" y1="0" x2="12" y2="24" strokeWidth="2"/>
            </svg>
            <h4 className="text-lg font-medium text-subheader">Position</h4>
            <p className="text-gray-300 text-base opacity-80 max-w-prose py-2">
              Using an LLM-generated sentence embedding, each poem’s vectors are averaged and positioned in 3D space so that poems with similar themes naturally cluster together.
            </p>
          </div>
          {/* Color Icon */}
          <div className="flex flex-col items-start">
            <div className="w-8 h-8 rounded-full my-6 opacity-50 animate-color"></div>
            <h4 className="text-lg font-medium text-subheader">Color</h4>
            <p className="text-gray-300 text-base opacity-80 max-w-prose py-2">
              A poem’s color is chosen by normalizing its x-coordinate within the embedding space to a predefined palette, so semantically similar poems share similar hues, with slight deterministic variation for clarity.
            </p>
          </div>
          {/* Connections Icon */}
          <div className="flex flex-col items-start">
            <svg className="w-8 h-8 my-6 opacity-50 animate-connections" viewBox="0 0 24 4" fill="none" stroke="currentColor" strokeDasharray="4">
              <line x1="0" y1="2" x2="24" y2="2" strokeWidth="2"/>
            </svg>
            <h4 className="text-lg font-medium text-subheader">Connections</h4>
            <p className="text-gray-300 text-base opacity-80 max-w-prose py-2">
              Connections link poems based on weighted shared themes and motifs, combined with the two nearest neighbors in embedding space, highlighting both thematic and semantic relationships.
            </p>
          </div>
          {/* Size Icon */}
          <div className="flex flex-col items-start">
            <div className="w-8 h-8 rounded-full my-6 opacity-50 animate-size border border-current"></div>
            <h4 className="text-lg font-medium text-subheader">Size</h4>
            <p className="text-gray-300 text-base opacity-80 max-w-prose py-2">
              The size of each node reflects its total number of connections—poems with more related neighbors appear larger to emphasize their centrality in the network.
            </p>
          </div>
        </div>
      </section>

      {/* Dev Tools Section */}
      {/* <section className="p-4 border border-gray-700 rounded">
        <h3 className="text-xl font-semibold mb-4 text-subheader">Dev Tools</h3>
        <div className="flex gap-4">
          <GenerateButton type="colors" />
          <GenerateButton type="connections" />
          <GenerateButton type="coordinates" />
        </div>
      </section> */}

      {/* Poem Graph Section */}
      <section className="p-4 border border-gray-700 rounded">
        <h3 className="text-xl font-semibold mb-4 text-subheader">
          The Mind of Emily Dickinson
        </h3>
        {/*
          2) Give this a fixed/min height to allow the Three.js canvas
             to expand properly. For instance, 600px or whatever works best.
        */}
        <div className="h-[350px] sm:h-[600px]">
          <PoemGraph />
        </div>
      </section>

      {/* Poem Table Section */}
      <section className="p-4 border border-gray-700 rounded">
        <h3 className="text-xl font-semibold mb-4 text-subheader">
          Explore the Poems
        </h3>
        <PoemTable />
      </section>
      <Footer />
      <style jsx>{`
        @keyframes horizontalMove {
          0%, 100% { transform: translateX(0); }
          50%     { transform: translateX(3px); }
        }
        .animate-horizontal {
          transform-origin: center;
          animation: horizontalMove 3s infinite ease-in-out;
        }
        @keyframes verticalMove {
          0%, 100% { transform: translateY(0); }
          50%     { transform: translateY(3px); }
        }
        .animate-vertical {
          transform-origin: center;
          animation: verticalMove 3s infinite ease-in-out;
        }
        @keyframes colorAnim {
          0% { background-color: #f87171; }
          25% { background-color: #34d399; }
          50% { background-color: #60a5fa; }
          75% { background-color: #fbbf24; }
          100% { background-color: #f87171; }
        }
        .animate-color {
          animation: colorAnim 5s infinite;
        }
        @keyframes connectionsAnim {
          0%, 100% { stroke-dashoffset: 0; }
          50% { stroke-dashoffset: 8; }
        }
        .animate-connections {
          animation: connectionsAnim 2s infinite ease-in-out;
        }
        @keyframes sizeAnim {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.5); }
        }
        .animate-size {
          animation: sizeAnim 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
