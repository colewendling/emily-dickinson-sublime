// app/page.tsx

import PoemGraph from './components/PoemGraph';

export default function Home() {
  return (
    <div className="grid">
      {/* Sections 1 and 2 as a responsive row/column */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <section className="bordered p-4">
          <h3 className="subheader">1735</h3>
          <p className="paragraph">
            After her death in 1865, 1735 poems were discovered in Emily
            Dickinson’s room, hidden and neatly organized into hand-sewn
            fascicles. A body of work left by a genius who stared into the face
            of eternity and took a step.
          </p>
        </section>
        <section className="bordered p-4">
          <h3 className="subheader">Sublime Threads</h3>
          <p className="paragraph">
            Dickinson’s work weaves an intricate web of themes, where
            life, death, and the infinite collide. These connections form an uncharted cosmos that beckons us to explore the
            mysteries she left behind.
          </p>
        </section>
      </div>
      {/* PoemGraph */}
      <div className="bordered p-4 w-full aspect-square relative">
        {/* Aspect Ratio Box */}
        <h3 className="subheader">The Mind of Emily Dickinson</h3>
        <div className="absolute inset-0">
          <PoemGraph />
        </div>
      </div>
    </div>
  );
}
