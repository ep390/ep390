export default function StudentPage() {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Fumiya's EP 390 Page</h1>
        <p>I'm Fumiya.</p>
        <h2 className="text-2xl font-semibold mt-6 mb-3">Musical Inspirations: Genres and Artists</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>House</li>
          <li>Aphex Twin</li>
          <li>Floating Points</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6 mb-3">Favorite VST Instruments</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Serum</li>
        </ul>
      </div>
    );
  }