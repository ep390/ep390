---
title: "Assignment 4: Combined MIDI IO"
excerpt: "Combine Midi IO and Async Functions to create an arpeggiator"
---

- Due Date: **5 PM EST** September 30, 2024
- Cutoff: 6 PM EST October 7, 2024

In this assignment you will build a creative MIDI effect in the web-browser that utilizes both MIDI in and MIDI out.

Copy the `page.jsx` file from the MIDI IO module into your `student/<yourName>/hw4` directory. Open the new page in your web browser and code editor. 

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
  which is called above. This is a very common pattern in React and it used to
  create dynamic interactive webpages. You can consult Gemini/Google/React
  documentation if you want to understand this better. For now, it is enough to
  know that this is used to track and display the Midi notes that are currently
  playing.

- The `new Set` call. Again, it may be helpful to study this, but it is not
  required to complete the homework. 

- The `async` keyword before the function tells JavaScript that this is a
  special function that can include delays via the `await` keyword.

We'll use the `async` function to create a delay. Add the following lines to the
end of the **noteOn** function:

```javascript
      await pause(500);
      selectedOutput.send(MidiMessage.noteOn(note + 7, velocity, channel));
```

and the following lines to the end of the **noteOff** function:

```javascript
      await pause(500);
      selectedOutput.send(MidiMessage.noteOff(note + 7, velocity, channel));
```

Before trying this out, what do you expect to happen when you send a note through? Setup your DAW so you can play MIDI into the browser. See the [Midi Receive Module](/modules/midi-receive) for an example of how to do this.

Your assignment is to create a musical MIDI effect using this code as a starting point.

Here's the simplest option: Output a 3-note chord every time for each incoming note. **Additionally** ensure that all additional notes are re-assigned so that they conform to a musical key or scale.

We will try out these instruments at the next class! This is why the assignment is due one hour early next week: so that the instructor can merge them into main. 

Another idea is to create a tempo-synched arpeggiator or effect. Do do this, you would send Note-on and note-off events from the `clock: () => {}` callback. See `<MidiReceiveLog>` for an example.

Clean up the any lingering content from the module page that you copy/pasted.

Try to make it musical and fun to play. Come to class ready to perform your instrument. You can bring an external MIDI controller if you like.

## Grading Rubric (Copied from HW2. Needs Updating)

- **20** Your page renders correctly on the web
- **20** Your pull request changed only files in the correct directory (you may also modify your subdirectory in the `public` folder, for example `website/public/students/alice/`)
- **15** Your file names and directory structure are correct (for example `website/app/students/alice/hw2/page.jsx`)
- **15** You created a single branch dedicated only to the assignment
- **10** Your JSX code has valid syntax and proper formatting
- **10** You removed traces of the original page that you copy/pasted from.
- **10** Your interface sends valid MIDI messages
- **10** Your interface can play at least a full octave (8 different notes)
- **10** Your buttons send note-on on press and note-off on release
- **10** You added styling beyond the basic green buttons from the initial modules page
