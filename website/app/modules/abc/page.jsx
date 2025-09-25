'use client'

import { useState } from 'react'
import { Abc } from '@/components/abc'
import styles from '@/app/[...markdown]/markdown.module.css'
import ModuleFooter from '@/components/ModuleFooter'

const defaultScore = `X:1
T:Your Song
M:4/4
L:1/4
K:Cmaj
|: CDEF | cdef | C4 | D4 :|
`

export default function AbcNotationPage() {

  const [text, setText] = useState(defaultScore)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>Abc Notation</h1>
        <p>
          Abc notation is a standard for describing musical scores with text.
          Machine learning models are good at generating text.
          As a result, abc notation is often used for generating music scores with AI.
        </p>
        <p>Try editing the score and see if you can figure out the basics of the notation.</p>
        <TextEditor value={text} onChange={setText} />
        <Abc abc={text} />

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
