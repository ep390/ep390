"use client";

import styles from "@/app/[...markdown]/markdown.module.css";
import ModuleFooter from "@/components/ModuleFooter";
import MidiReceiveLog from "@/components/MidiReceiveLog";

import IacImage from "./midi-studio-iac.png"
import AbletonMidiSetupImage from "./ableton-midi.png"
import AbletonTracksImage from "./ableton.png"

import { MidiInputSelector, useMidiContext } from "@/components/midi";
import Image from "next/image";

export default function MidiReceivePage() {
  const { error } = useMidiContext();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>Receive MIDI Messages</h1>
        <p>Here is an example of using MIDI Input</p>

        <div className="flex items-center gap-4 mb-3">
          <MidiInputSelector />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <div>
          <MidiReceiveLog />
        </div>
        <h2>Hands On</h2>
        <p>
          In the source code for this page, find <code className="text-teal-600">&lt;MidiReceiveLog /&gt;</code>.
          This element is a <a href="https://react.dev/learn/your-first-component">React functional component</a> which
          renders the Clock and message log box above. In short, a functional component is a JavaScript function
          that returns some HTML-like data.
        </p>
        <p>
          In fact, this page is defined as a React functional component too. In the source code for this page see where it
          says <code className="text-purple-800">export default <span className="text-blue-800">function</span> <span className="text-amber-700">MidiReceivePage()...</span> </code>?
          A <code className="text-purple-800">default export</code> instructs the <a href="https://nextjs.org/">Next.js</a> framework
          what to render for a given <code>page.jsx</code> file within the <code>app/</code> directory.
        </p>
        <p>
          Find the source code for <code className="text-teal-600">&lt;MidiReceiveLog /&gt;</code>. In VS Code you can
          often Command+Click on a component to navigate to the source code definition.
        </p>
        <p>
          Read the source code for <code className="text-teal-600">&lt;MidiReceiveLog /&gt;</code>.
        </p>
        <p><strong>TODO:</strong></p>
        <ol>
          <li>Find one part of the code that you do not understand. Select that code and use Gemini to see if you can understand it better.</li>
          <li>Create a new React functional component that JUST renders the Most recent Song Position. See if you can clean up the display so that it shows quarter notes and remaining 16th notes.</li>
        </ol>
        <p>NOTE! You will have to setup Ableton to Midi "sync" in order for it to send Song Position Pointers! Open <strong>Audio MIDI Setup</strong>. In the Window menu, select "Show Midi Studio" and double Click "IAC Driver". Here is how mine is setup:</p>

        <Image src={IacImage} alt="Screenshot of macOS Audio MIDI Setup with IAC Driver properties showing one port." />
        <Image src={AbletonMidiSetupImage} alt="Screenshot of Ableton Live Midi" />

        <p>In my setup I have:</p>
        <ol>
          <li>One MIDI track sending TO the "To Browser" IAC Driver</li>
          <li>One MIDI track receiving FROM the "To DAW" IAC Driver (set to Input Monitoring)</li>
        </ol>
        <Image src={AbletonTracksImage} alt="Screenshot of Ableton Live Tracks" />

        <ModuleFooter />
      </div>
    </div>
  );
}
