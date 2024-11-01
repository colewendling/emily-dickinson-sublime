'use client';

import React, { useState, useEffect } from 'react';
import { Poem } from '../data/poems';
import { X } from 'lucide-react';

interface PoemModalProps {
  poem: Poem;
  onClose: () => void;
}

const PoemModal: React.FC<PoemModalProps> = ({ poem, onClose }) => {
  const [typedPoem, setTypedPoem] = useState<React.ReactNode[]>([]);
  const [typedThemes, setTypedThemes] = useState('');
  const lines = poem.content;
  const themeString = poem.themes.join(', ');
  const typingSpeedPoem = 200;
  const typingSpeedThemes = 100;

  const [highlights, setHighlights] = useState<string[]>([]);

  const addHighlight = (trimmed: string) => {
    setHighlights((prev) => [...prev, trimmed]); // Add to the existing array
  };

  useEffect(() => {
    console.log('highlights: ', highlights);
  }, [highlights]);

  function highlightWord(
    word: string,
    themes: string[],
    lineIndex: number,
    wordIndex: number
  ): React.ReactNode {
    const trimmed = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    // console.log('trimmed: ', trimmed)
    if (themes.includes(trimmed)) {
      addHighlight(trimmed);
      return (
        <span
          className="text-red-500 animate-float"
          key={`${lineIndex}-${wordIndex}`}
        >
          {word + ' '}
        </span>
      );
    }
    return word + ' ';
  }

  useEffect(() => {
    let lineIndex = 0;
    let wordIndex = 0;
    let poemInterval: NodeJS.Timer | null = null;

    poemInterval = setInterval(() => {
      if (lineIndex >= lines.length) {
        if (poemInterval) clearInterval(poemInterval);
        return;
      }

      const words = lines[lineIndex].split(' ');
      if (wordIndex < words.length) {
        const currentWord = highlightWord(words[wordIndex], poem.themes, lineIndex, wordIndex);
        setTypedPoem((prev) => [...prev, currentWord]);
        wordIndex++;
      } else {
        setTypedPoem((prev) => [...prev, <br key={lineIndex} />]);
        lineIndex++;
        wordIndex = 0;
      }
    }, typingSpeedPoem);

    return () => {
      if (poemInterval) clearInterval(poemInterval);
    };
  }, [poem]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < themeString.length) {
        setTypedThemes(themeString.slice(0, index + 1)); // Build from themeString
        index++;
      } else {
        clearInterval(interval);
      }
    }, typingSpeedThemes);

    return () => {
      clearInterval(interval);
    };
  }, [themeString]);

  const isPoemComplete =
    typedPoem.filter((line) => line === <br />).length === lines.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-black text-green-400 p-6 rounded-md max-w-lg w-full font-mono border border-gray-400">
        <button
          className="absolute top-4 right-4 text-white hover:text-lime-300"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        {/* Title */}
        <h2 className="text-xs mb-4 text-white">No. {poem.number}</h2>
        <h2 className="text-xl text-lime-400">{poem.title}</h2>
        <div className="h-[.05px] mb-6 mt-3 bg-slate-300/50" />
        <div className="mb-4">
          <p className="whitespace-pre-wrap terminal">{typedPoem}</p>
          {!isPoemComplete && (
            <span className="inline-block ml-1 animate-blink">█</span>
          )}
        </div>
        {/* Themes */}
        <p className="text-orange-600">
          Themes: <span className="text-red-600">[ {typedThemes} ]</span>
          {typedThemes.length < themeString.length && (
            <span className="inline-block ml-1 animate-blink">_</span>
          )}
        </p>
        <div className="h-[.05px] my-6 bg-slate-300/50" />

        <h2 className="text-xs mt-4 text-white">c. {poem.date}</h2>
      </div>
    </div>
  );
};

export default PoemModal;
