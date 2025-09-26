'use client'

import { useState } from 'react'
import { AbcMidiLink, AbcPlayer } from '@/components/abc'
import styles from '@/app/[...markdown]/markdown.module.css'
import ModuleFooter from '@/components/ModuleFooter'

const defaultScore = `X:1
T:Your Song
M:4/4
L:1/4
K:Cmaj
|: CDEF | cdef | C4 | D4 :| _A2 ^B,2 |
`

export default function AbcNotationPage() {

  const [text, setText] = useState(defaultScore)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>ABC Notation</h1>
        <p>
          <a href="https://notabc.app/abc/" target="_blank">ABC notation</a> is a standard for describing musical scores with text.
        </p>
        <p>
          Because machine learning models are good at generating text, ABC notation is often used when generating scores with AI.
        </p>
        <p>
          Try editing the score and see if you can deduce the basics of the notation. Can you figure out what <span className="font-bold">L:1/4</span> does? Can you figure out how to make a chord?
        </p>
        <TextEditor value={text} onChange={setText} />
        <AbcPlayer abc={text} />
        <AbcMidiLink abc={text} />

        <ModuleFooter />
      </div>
    </div>
  )
}

function TextEditor({ value, onChange }) {
  return (
    <div className="my-6">
      <textarea
        className="w-full h-[146px] p-3 border rounded-md font-mono text-sm"
        rows={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
