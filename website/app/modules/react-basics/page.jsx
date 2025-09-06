'use client'

import ExampleButton from '@/components/ExampleButton'
import ModuleFooter from '@/components/ModuleFooter'
import styles from '@/app/[...markdown]/markdown.module.css'
import hljs from 'highlight.js'

const buttonCode = `import { useState } from 'react'

function ExampleButton() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
  }

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 rounded-lg text-white bg-green-600 active:bg-green-700"
    >
      Clicked {count} Times
    </button>
  )
}

// Exporting the function makes it available to import in other files
export default ExampleButton
`

export default function ReactBasicsPage() {
  const highlightedCode = hljs.highlight(buttonCode, { language: 'javascript' }).value
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>React and JSX</h1>
        <p className="mb-4">
          <span className="font-bold">React components</span> are reusable functions for creating interactive user interfaces.
        </p>
        <p className="mb-4">
          Below is a simple <span className="font-bold">React button component</span> that counts clicks.
        </p>

        <ExampleButton />

        <p className="my-4">
          See <a href="https://github.com/ep390/ep390/blob/main/website/components/ExampleButton.jsx">the code for the button on GitHub</a>.
        </p>
        <p className="mb-4">
          See <a href="https://github.com/ep390/ep390/blob/main/website/app/modules/jsx-basics/page.jsx">how this component is imported and used in THIS page</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">The Code</h2>
        <p className="mb-4">
          Here is the JavaScript code that creates the button. The HTML-like syntax is called <span className="font-bold">JSX</span>. It can describe HTML in JavaScript code.
        </p>
        <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
          <code
            className="hljs language-javascript"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>

        <ul>
          <li>React is a JavaScript library for building interactive user interfaces. It works well with JSX.</li>
          <li>What are all those <code>className</code> strings? These use <a href="https://tailwindcss.com/">Tailwind CSS</a> for styling colors, formatting, and more.
            <ul>
              <li><code>px-4</code> add left and right padding</li>
              <li><code>py-2</code> add top and bottom padding</li>
              <li><code>rounded-lg</code> large rounded corners</li>
              <li><code>text-white</code> color the text</li>
              <li><code>bg-green-600</code> color the background</li>
              <li><code>active:bg-green-700</code> make the background darker when when "active" (when the button is being pressed)</li>
              <li>Installing the <a href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss">Tailwind VS Code extension</a> makes it easier to write the CSS strings.</li>
            </ul>
          </li>

          <li>What is <code>const [count, setCount] = useState(0)</code>?</li>
        </ul>

        <ModuleFooter />

      </div>
    </div>
  )
}
