---
title: "Assignment 4: Combined MIDI IO"
excerpt: "Combine MIDI IO and async functions to create an arpeggiator"
---

- Due Date: **5 PM EST** September 30, 2024
- Cutoff: 6 PM EST October 7, 2024

In this assignment you will build a creative MIDI effect in the web browser that
utilizes both MIDI in and MIDI out.

Copy the `page.jsx` file from the MIDI IO module
(`website/app/modules/midi-io/page.jsx`) into your
`website/app/students/your-name/hw4/page.jsx` directory. Open the new page in
your web browser and code editor.

Take a look at this section of the code. Do you understand each line?

```JavaScript
  useMidiHandlers({
    noteOn: async (note, velocity, channel) => {
      if (!selectedOutput) return;
      setActiveNotes(prev => new Set(prev).add(note));
      selectedOutput.send(MidiMessage.noteOn(note, velocity, channel));
    },
    noteOff: async (note, velocity, channel) => {
      if (!selectedOutput) return;
      setActiveNotes(prev => { prev.delete(note); return new Set(prev) });
      selectedOutput.send(MidiMessage.noteOff(note, velocity, channel));
    },
  });
```

The code uses JavaScript/React features that may be unfamiliar:

- The `setActiveNotes` function was returned from React's `useState` function,
  which is called above. This is a very common pattern in React and it is used to
  create dynamic interactive web pages. You can consult Gemini/Google/React
  documentation if you want to understand this better. For now, it is enough to
  know that this is used to track and display the MIDI notes that are currently
  playing.

- The `new Set` call creates a JavaScript `Set`. Again, it may be helpful to
  study this, but it is not required to complete the homework.

- The `async` keyword before the function tells JavaScript that this is a
  special function that can include delays via the `await` keyword.

We'll use the `async` function to create a delay. Add the following lines to the
end of the **noteOn** function taking note of the `pause` function defined at
the end of the file:

```javascript
      await pause(500);
      selectedOutput.send(MidiMessage.noteOn(note + 7, velocity, channel));
```

and the following lines to the end of the **noteOff** function:

```javascript
      await pause(500);
      selectedOutput.send(MidiMessage.noteOff(note + 7, velocity, channel));
```

Before trying this out, what do you expect to happen when you send a note
through? Set up your DAW so you can play MIDI into the browser. See the [MIDI
Receive Module](/modules/midi-receive) for an example of how to do this.

Your assignment is to create a musical MIDI effect using this code as a starting point.

Here's the simplest option: Output a 3-note chord every time for each incoming
note. **Additionally** ensure that all additional notes are re-assigned so that
they conform to a musical key or scale.

We will try out these instruments at the next class! This is why the assignment
is due one hour early next week: so that the instructor can merge them into
main. 

Another idea is to create a tempo-synced arpeggiator or effect. To do this, you
would send note-on and note-off events from the `clock: () => {}` callback. See
`<MidiReceiveLog />` for an example.

Clean up any lingering content from the module page that you copy/pasted.

Try to make it musical and fun to play. Come to class ready to perform your
instrument. You can bring an external MIDI controller if you like.

## Grading Rubric

- **20** Your page renders correctly on the web
- **10** Your pull request changed only files in the correct directory (you may also modify your subdirectory in the `public` folder, e.g., `website/public/students/your-name/`)
- **10** Your file names and directory structure are correct (e.g., `website/app/students/your-name/hw4/page.jsx`)
- **10** You created a single branch dedicated only to the assignment
- **10** Your JSX code has valid syntax and proper formatting
- **10** You removed traces of the original page that you copy/pasted from
- **10** You implemented a musical MIDI effect based on this assignment (e.g., a three-note chord with key/scale quantization, or a tempo-synced arpeggiator)
- **10** Your MIDI IO works end-to-end and generated notes have correct note-on/note-off lifecycle
- **10** You demonstrated your instrument at class when the assignment is due
