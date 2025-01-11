'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Poem } from '../data/poems';
import { X } from 'lucide-react';
import { poemThemes } from '../data/themes'; // Importing themes
import { poemMotifs } from '../data/motifs'; // Importing motifs

interface PoemModalProps {
  poem: Poem;
  onClose: () => void;
}

const PoemModal: React.FC<PoemModalProps> = ({ poem, onClose }) => {
  // Control typing speeds (in milliseconds)
  const typingSpeedPoem = 100;
  const typingSpeedThemes = 100; // Faster for character-by-character
  const typingSpeedMotifs = 100; // Faster for character-by-character

  // State for typed poem with possible emphasis
  const [typedPoem, setTypedPoem] = useState<React.ReactNode[]>([]);
  const [isPoemComplete, setIsPoemComplete] = useState(false);

  // State for typed themes
  const [typedThemes, setTypedThemes] = useState('');
  const [isThemesComplete, setIsThemesComplete] = useState(false);

  // State for typed motifs
  const [typedMotifs, setTypedMotifs] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // State for scroll indicator
  const [showIndicator, setShowIndicator] = useState(false);

  // Ref for the poem body to handle overflow
  const poemBodyRef = useRef<HTMLDivElement>(null);

  // Retrieve themes and motifs based on poem.id
  const themes = useMemo(() => poemThemes[poem.id] || [], [poem.id]);
  const motifs = useMemo(() => poemMotifs[poem.id] || [], [poem.id]);
  // Convert themes and motifs arrays to strings separated by commas
  const themeString = useMemo(() => themes.join(', ').trim(), [themes]);
  const motifString = useMemo(() => motifs.join(', ').trim(), [motifs]);

  useEffect(() => {
    const checkOverflow = () => {
      const el = poemBodyRef.current;
      if (el) {
        setShowIndicator(
          el.scrollHeight > el.clientHeight && el.scrollTop === 0
        );
      }
    };
    checkOverflow();

    const handleScroll = () => {
      const el = poemBodyRef.current;
      if (el) {
        setShowIndicator(el.scrollTop === 0);
      }
    };

    poemBodyRef.current?.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkOverflow);

    return () => {
      poemBodyRef.current?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  useEffect(() => {
    let currentStanzaIndex = 0;
    let currentLineIndex = 0;
    let wordCount = 0;

    const totalStanzas = poem.stanzas.length;
    const intervals: NodeJS.Timeout[] = [];

    const typePoem = () => {
      if (currentStanzaIndex >= totalStanzas) {
        setIsPoemComplete(true);
        return;
      }

      const stanza = poem.stanzas[currentStanzaIndex];
      const lines = Array.isArray(stanza) ? stanza : [stanza];
      const totalLines = lines.length;

      const typeLine = () => {
        if (currentLineIndex >= totalLines) {
          currentStanzaIndex++;
          currentLineIndex = 0;
          setTypedPoem((prev) => [
            ...prev,
            <br key={`stanza-${currentStanzaIndex}`} />,
          ]);
          setTimeout(typePoem, typingSpeedPoem);
          return;
        }

        const line = lines[currentLineIndex];
        const words = line.split(/\s+/);
        const totalWords = words.length;
        wordCount = 0;

        const typeWord = () => {
          if (wordCount < totalWords) {
            const rawWord = words[wordCount];
            const cleanedWord = rawWord.replace(/[^\w'-]/g, '');
            const emphasis = poem.emphases.find(
              (e) =>
                e.stanzaIndex === currentStanzaIndex &&
                e.lineIndex === currentLineIndex &&
                e.position === wordCount
            );

            setTypedPoem((prev) => [
              ...prev,
              emphasis ? (
                <span
                  className="text-red-600 inline-block animate-jitter"
                  key={`word-${currentStanzaIndex}-${currentLineIndex}-${wordCount}`}
                >
                  {rawWord + ' '}
                </span>
              ) : (
                rawWord + ' '
              ),
            ]);

            wordCount++;
          } else {
            // End of line
            setTypedPoem((prev) => [
              ...prev,
              <br key={`line-${currentStanzaIndex}-${currentLineIndex}`} />,
            ]);
            currentLineIndex++;
            clearInterval(wordInterval);

            if (currentLineIndex < totalLines) {
              setTimeout(typeLine, typingSpeedPoem);
            } else {
              // Move to next stanza
              currentStanzaIndex++;
              currentLineIndex = 0;
              if (currentStanzaIndex < totalStanzas) {
                setTypedPoem((prev) => [
                  ...prev,
                  <br key={`stanza-${currentStanzaIndex}`} />,
                ]);
                setTimeout(typePoem, typingSpeedPoem);
              } else {
                // Poem typing complete
                setIsPoemComplete(true);
              }
            }
          }
        };

        const wordInterval = setInterval(typeWord, typingSpeedPoem);
        intervals.push(wordInterval);
      };

      typeLine();
    };

    typePoem();

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [poem, typingSpeedPoem, themes]);

  /**
   * Effect to handle typing of themes
   */
  useEffect(() => {
    setTypedThemes('');
    setIsThemesComplete(false);
    const timers: number[] = [];
    for (let i = 0; i < themeString.length; i++) {
      timers.push(
        window.setTimeout(() => {
          setTypedThemes(themeString.substring(0, i + 1));
          if (i + 1 === themeString.length) {
            setIsThemesComplete(true);
          }
        }, i * typingSpeedThemes)
      );
    }
    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [themeString, typingSpeedThemes]);

  useEffect(() => {
    setTypedMotifs('');
    setIsTypingComplete(false);
    const timers: number[] = [];
    for (let i = 0; i < motifString.length; i++) {
      timers.push(
        window.setTimeout(() => {
          setTypedMotifs(motifString.substring(0, i + 1));
          if (i + 1 === motifString.length) {
            setIsTypingComplete(true);
          }
        }, i * typingSpeedMotifs)
      );
    }
    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [motifString, typingSpeedMotifs]);

  const title = Array.isArray(poem.stanzas[0])
    ? poem.stanzas[0][0] || 'Untitled'
    : poem.stanzas[0] || 'Untitled';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-8">
      <div className="relative bg-black text-white p-6 rounded-md max-w-3xl w-full font-mono border border-gray-400">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white hover:text-pink-500"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Poem Number and Title with animate-jitter */}
        <h2 className="text-xs mb-4 text-white">No. {poem.id}</h2>
        <h2 className="text-xl text-lime-400">{title}</h2>

        {/* Separator */}
        <div className="h-px my-6 bg-slate-300/50" />

        {/* Poem Body with Typing Animation */}
        <div
          ref={poemBodyRef}
          className="max-h-[320px] md:max-h-[600px] overflow-y-auto -mr-4 pr-4 no-scrollbar"
        >
          <p className="whitespace-pre-wrap text-green-400 text-sm">
            {typedPoem}
            {!isPoemComplete && (
              <span className="inline-block ml-1 animate-blink">█</span>
            )}
            {/* Blinking cursor after poem completes */}
            {isPoemComplete && (
              <span className="block mt-1 animate-blink">█</span>
            )}
          </p>
        </div>

        {/* Separator */}
        <div className="h-px my-4 bg-slate-300/50" />

        {/* Themes Section with Typing Animation */}
        <div className="mt-4">
          <p className="text-orange-600">
            Themes: [{' '}
            <span className="text-red-600">
              {typedThemes}
              {typedThemes.length < themeString.length && (
                <span className="inline-block ml-1 animate-blink">█</span>
              )}
            </span>{' '}
            ]
          </p>
        </div>

        {/* Motifs Section with Typing Animation */}
        <div className="mt-2">
          <p className="text-orange-600">
            Motifs: [{' '}
            <span className="text-red-600">
              {typedMotifs}
              {typedMotifs.length < motifString.length && (
                <span className="inline-block ml-1 animate-blink">█</span>
              )}
            </span>{' '}
            ]
          </p>
        </div>

        {/* Scroll Indicator */}
        {showIndicator && (
          <div className="absolute text-2xl right-6 bottom-0 text-white animate-bounce mb-4">
            👇
          </div>
        )}

        {/* Separator */}
        <div className="h-px my-4 bg-slate-300/50" />

        {/* Poem Date */}
        <h2 className="text-xs mt-4 text-white">c. {poem.date}</h2>
      </div>
    </div>
  );
};

export default PoemModal;
