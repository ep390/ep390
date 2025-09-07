---
title: "Assignment 2: Tools for Agentic Coding"
excerpt: "You can get help with your coding project by copying and pasting code into ChatGPT–but there is a much better way..."
---

- Due Date: 6PM EST September 16, 2024
- Cutoff: 6PM EST September 23, 2024

## Overview

You can get help with your coding project by copying and pasting code into ChatGPT... but there is a much better way.

Giving the LLM permission to use a limited set of "tools" on your development machine enables it to act as an "agent." This is called agentic coding. Tools that you give an AI access to inclucde:

- Reading files in your codebase
- Making changes to those files
- Searching the web for documentation

We'll be trying out Gemini Code Assist by Google.

## 1. Setup

Prepare a dedicated git branch for your assignment. This is essential for
submitting your homework correctly.

1. Checkout the main branch of the class repo
1. Pull or sync to ensure your local main branch is up-to-date
1. Checkout a new branch for your homework, for example `yourname-hw-x`
1. Make sure that the class website development server is running on your computer.
   - In the terminal, `cd` into the `website/` dir and run `npm run dev`
   - Verify that http://localhost:3000/ displays the class page
   - For details, see the instructions in [Getting Started](/modules/getting-started).

## 2. Create a New Page

- In your code editor, find the file in `website/app/modules/midi/page.jsx`. This has the minimal MIDI example in it.
- Copy this file into your `hw1` directory at `website/app/students/your-name/hw2/page.jsx`
- Open up your page on your local machine at
http://localhost:3000/students/your-name/hw2 and verify it renders correctly
(but replace `your-name` in the url)
- Route the MIDI into a Synthesizer. On Mac OS you can configure IAC MIDI Driver in The Audio MIDI Setup to create a virtual MIDI connection between your browser and DAW.

## 3. Extend the MIDI Controller

The existing virtual MIDI controller only has one note! That's not very good. Let's add a new one.

Look at the newly create page.jsx file. It contains two functions, both of which are React components.

- The function that starts with `export default function MidiPage()` represents the entire contents of the page. It returns some JSX, which will be converted to HTML and JavaScript, and rendered in the browser. Notice the JSX includes a `<NoteButton />` element.
- `NoteButton` is also the name of our second top-level function in the page.jsx file. Do you understand how this works? In React, we define functions that can be used as custom HTML elements which bundle HTML and JavaScript.

Find `<NoteButton />` in the page.jsx file and copy and paste it so it looks like this:

```javascript
   <div className="flex items-center gap-4 mb-3">
     <MidiOutputSelector />
     <NoteButton />
     <NoteButton />
   </div>
```

Save the file and look back at the browser. Now there are TWO buttons that all play the same note! How do you customize the buttons so they play different notes without duplicating code? To figure out how lets get some help from an AI.

## 4. Use Gemini

We'll use Gemini Code Assist because of its generous free tier. You can use any AI tool you want like Cline, Claude, Cursor, or Copilot, but this tutorial assumes Gemini.

1. Install the [Gemini Code Assist](https://marketplace.visualstudio.com/items?itemName=Google.geminicodeassist) VS Code plugin.
1. VS Code will prompt you to sign In with your Google Account. **IMPORTANT:** To use Gemini for free, use a `@gmail.com` account, NOT your `@berklee.edu` account.
1. Open the Gemini Tab in the VS Code sidebar by clicking the Star Icon. Where it says "Ask Gemini or type @", givt it an instruction, for example
   > I'm new to JavaScript and React, and I want to parameterize the NoteButton so that it can play different notes. Can you update this code so that the buttons play a C and a D? Make the code and your explanation simple and clear.
1. Make sure that the correct `page.jsx` file is open in VS Code when you hit enter.

Read Gemini's answer and look at the results. Do they make sense? VS Code will highlight lines of code that have changed. The old version will be in red and new version in green. Because this is a very simple change, there's a good change that Gemini was able to oneshot it (get it correct on the first try).

Continue using Gemini to address the following issues. 

- Right now, the button sends a ond-second note. Make it send a note on when you press the button and a note-off when you release it. 
- Add more buttons. Ensure it can play at least a full scale
- Add some more styling with Tailwind `className`s. Can you make the note buttons display in a grid like a Live controller?


For bragging rights (Not graded):
- make the buttons Display the correct note name instead of the note number (this is not scored).
- Make it so you can drag your mouse across the buttons firing each of them. 

## 5. Clean 

Because you originally copied the page from the modules directory, it's got some
extra text at the top that is unrelated to your homework assignment. Remove any
lingering text that isn't part of your MIDI instrument update the title you can
also remove the footer if you don't want it there.

Remember, this page will be available on the public internet, and you may want to use some of these in a portfolio at some point. It's a good idea to keep your pages looking clean!

## 6. Submit Your Assignment

1. Push/Sync your assignment branch to GitHub
1. On the GitHub website, create a new Pull Request

**Important:** Do not merge your own PR. Your instructor will review and merge it after grading.

## Grading Rubric

- **20** Your page renders correctly on the web
- **20** Your pull request changed only files in the correct directory (you may also modify your subdirectory in the `public` folder, for example `website/public/students/alice/`)
- **15** Your file names and directory structure are correct (for example `website/app/students/alice/hw1/page.jsx`)
- **15** You created a single branch dedicated only to the assignment
- **10** Your JSX code has valid syntax and proper formatting
- **10** You removed traces of the original page that you copy/paged from.
- **10** Your interface sends valid MIDI messages
- **10** Your interface can play at least a full octave (8 different notes)
- **10** Your buttons send note-on on press and note-off on depress
- **10** You added styling beyond the basic green buttons from the initial modules page
