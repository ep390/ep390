'use client'

import { useState } from 'react'
import { Abc } from '@/components/abc'
import styles from '@/app/[...markdown]/markdown.module.css'
import ModuleFooter from '@/components/ModuleFooter'

const defaultScore = `X:1
T:Bach
M:4/4
L:1/4
K:Cmaj
C4 D4 E4 F4 G4 A4 B4 C5
`

export default function AbcNotationPage() {

  const [text, setText] = useState(defaultScore)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>

        <h1>Abc Notation</h1>
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
        className="w-full p-3 border rounded-md font-mono text-sm"
        rows={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
