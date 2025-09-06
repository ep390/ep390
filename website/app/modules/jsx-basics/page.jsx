'use client'

import { useState } from 'react'
import { useMidi, useSelectedMidiOutput } from '../../../components/midi.jsx'

function ClickableButton() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      Clicked {count} times
    </button>
  )
}

const buttonCode = `
'use client'

import { useState } from 'react'

function ClickableButton() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      Clicked {count} times
    </button>
  )
}`

export default function JsxBasicsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">JSX and JavaScript Basics</h1>
      <p className="mb-4">
        This is a simple React component. It's a button that keeps track of how
        many times it has been clicked.
      </p>
      <ClickableButton />
      <h2 className="text-2xl font-semibold mt-8 mb-4">The Code</h2>
      <p className="mb-4">
        Here is the code that creates the button. Notice how it mixes HTML-like
        tags (JSX) with JavaScript logic.
      </p>
      <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
        <code>{buttonCode}</code>
      </pre>
    </>
  )
}