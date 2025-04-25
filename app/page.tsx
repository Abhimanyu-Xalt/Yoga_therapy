import React from 'react';
import Link from 'next/link';

export default function HomePage(): React.JSX.Element {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Yoga Therapy</h1>
      <p className="text-xl text-gray-600 mb-8">Your journey to wellness begins here</p>
      <Link 
        href="/api-docs" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        View API Documentation
      </Link>
    </main>
  );
} 