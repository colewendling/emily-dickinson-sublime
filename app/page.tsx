// app/page.tsx

import PoemTable from './components/PoemTable';
import PoemGraph from './components/PoemGraph';
import GenerateButton from './components/GenerateButton';

export default function Home() {
  return (
    <div className="grid gap-8">
      {/* Section: Title and Subtitle */}
      <section className="p-4">
        <h1 className="text-2xl font-bold text-header">
          The Dickinson Sublime
        </h1>
        <h2 className="text-lg text-subheader">mapping eternity</h2>
      </section>
      {/* Sections 1 and 2: Responsive row/column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="p-4 border border-gray-700 rounded">
          <h3 className="text-xl font-semibold text-subheader">1735</h3>
          <p className="text-gray-300">
            After her death in 1865, 1735 poems were discovered in Emily
            Dickinson’s room, hidden and neatly organized into hand-sewn
            fascicles. A body of work left by a genius who stared into the face
            of eternity and took a step.
          </p>
        </section>
        <section className="p-4 border border-gray-700 rounded">
          <h3 className="text-xl font-semibold text-subheader">
            Sublime Threads
          </h3>
          <p className="text-gray-300">
            Dickinson’s work weaves an intricate web of themes, where life,
            death, and the infinite collide. These connections form an uncharted
            cosmos that beckons us to explore the mysteries she left behind.
          </p>
        </section>
      </div>

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
    </div>
  );
}
