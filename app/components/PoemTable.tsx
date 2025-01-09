'use client';

import React, { useState } from 'react';
import { poems, Poem } from '../data/poems';
import PoemModal from './PoemModal';
import Pagination from './Pagination'; // Import the Pagination component

const PoemsTable: React.FC = () => {
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const poemsPerPage = 10;

  const handleRowClick = (poem: Poem) => {
    setSelectedPoem(poem);
  };

  const closeModal = () => {
    setSelectedPoem(null);
  };

  // Function to calculate total lines
  const getTotalLines = (stanzas: Poem['stanzas']) => {
    if (Array.isArray(stanzas[0])) {
      return stanzas.reduce((acc, stanza) => acc + stanza.length, 0);
    }
    return stanzas.length;
  };

  // Calculate total pages
  const totalPages = Math.ceil(poems.length / poemsPerPage);

  // Get current poems
  const indexOfLastPoem = currentPage * poemsPerPage;
  const indexOfFirstPoem = indexOfLastPoem - poemsPerPage;
  const currentPoems = poems.slice(indexOfFirstPoem, indexOfLastPoem);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="overflow-x-auto px-2 sm:px-4">
        <table className="w-full table-fixed border-collapse whitespace-normal text-sm sm:text-base">
        <thead>
          <tr>
            <th className="border border-white px-2 py-1 sm:px-4 sm:py-2 text-pink-500">ID</th>
            <th className="border border-white px-2 py-1 sm:px-4 sm:py-2 text-pink-500">
              Poem
            </th>
            <th className="border border-white px-2 py-1 sm:px-4 sm:py-2 text-pink-500">
              Date
            </th>
            <th className="border border-white px-2 py-1 sm:px-4 sm:py-2 text-pink-500">
              Stanzas
            </th>
            <th className="border border-white px-2 py-1 sm:px-4 sm:py-2 text-pink-500">
              Lines
            </th>
            <th className="border border-white px-2 py-1 sm:px-4 sm:py-2 text-pink-500">
              Emphases
            </th>
          </tr>
        </thead>
        <tbody>
          {currentPoems.map((poem) => {
            const firstLine = Array.isArray(poem.stanzas[0])
              ? poem.stanzas[0][0]
              : poem.stanzas[0];
            const stanzasCount = Array.isArray(poem.stanzas[0])
              ? poem.stanzas.length
              : poem.stanzas.length; // Assuming each string is a stanza
            const totalLines = getTotalLines(poem.stanzas);
            const emphasesCount = poem.emphases.length;

            return (
              <tr
                key={poem.id}
                className="border border-white cursor-pointer hover:bg-pink-900/30"
                onClick={() => handleRowClick(poem)}
              >
                <td className="border border-white px-2 py-1 sm:px-4 sm:py-2 break-words">{poem.id}</td>
                <td className="border border-white px-2 py-1 sm:px-4 sm:py-2 break-words">{firstLine}</td>
                <td className="border border-white px-2 py-1 sm:px-4 sm:py-2 break-words">{poem.date}</td>
                <td className="border border-white px-2 py-1 sm:px-4 sm:py-2 break-words">
                  {stanzasCount}
                </td>
                <td className="border border-white px-2 py-1 sm:px-4 sm:py-2 break-words">{totalLines}</td>
                <td className="border border-white px-2 py-1 sm:px-4 sm:py-2 break-words">
                  {emphasesCount}
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {selectedPoem && <PoemModal poem={selectedPoem} onClose={closeModal} />}
    </div>
  );
};

export default PoemsTable;
