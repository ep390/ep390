'use client'

import styles from '@/app/[...markdown]/markdown.module.css'
import ModuleFooter from '@/components/ModuleFooter'

import { Abc } from '@/components/abc'

export default function MidiPage() {
    const abc = `X:1
T:Bach
M:4/4
L:1/4
K:Cmaj
C4 D4 E4 F4 G4 A4 B4 C5
`
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className={styles.markdownContent}>
                <h1>Abc Notation</h1>

                <Abc abc={abc} />

                <ModuleFooter />
            </div>
        </div>
    )
}