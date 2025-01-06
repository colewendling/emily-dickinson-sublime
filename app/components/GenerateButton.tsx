'use client';

import React, { useState } from 'react';
import { generateColorsAndUpdateFile } from '@/app/actions/generateColors';
import { generateConnectionsAndUpdateFile } from '@/app/actions/generateConnections';
import { generateCoordinates } from '@/app/actions/generateCoordinates';

interface GenerateButtonProps {
  type: 'colors' | 'connections' | 'coordinates';
}

export default function GenerateButton({ type }: GenerateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Determine the action and label based on the type
  const getActionAndLabel = () => {
    switch (type) {
      case 'colors':
        return {
          action: generateColorsAndUpdateFile,
          label: 'Generate Colors Data',
        };
      case 'connections':
        return {
          action: () => generateConnectionsAndUpdateFile(3), // Pass k=3 as default
          label: 'Generate Connections Data',
        };
      case 'coordinates':
        return {
          action: generateCoordinates,
          label: 'Generate Coordinates Data',
        };
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  };

  const { action, label } = getActionAndLabel();

  const handleClick = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const result = await action();
      console.log(`${label} Result:`, result);
      setMessage(`${label} completed successfully!`);
    } catch (err: unknown) {
      // Safely extract a message from an unknown error
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`${label} Error:`, err);
      setMessage(`Error: ${errorMessage || 'Something went wrong.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`px-6 py-2 rounded-md text-white font-bold text-lg ${
          loading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? `Generating ${label}...` : label}
      </button>
      {message && <p className="text-center">{message}</p>}
    </div>
  );
}
