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
- Open up your page on your local machine
http://localhost:3000/students/your-name/hw2 and verify it renders correctly
(but replace `your-name` in the url)

## 3. Extend the MIDI Controller

The existing virtual MIDI controller only has one note! That's not very good. Let's add a new one.

...TODO...

## 4. Use Gemini

We'll use Gemini Code Assist because of its generous free tier. 

...TODO...

## 3. Submit Your Assignment

1. Push/Sync your assignment branch to GitHub
1. On the GitHub website, create a new Pull Request

**Important:** Do not merge your own PR. Your instructor will review and merge it after grading.

## Grading Rubric

- **20** Your page renders correctly on the web
- **20** Your pull request changed only files in the correct directory (you may also modify your subdirectory in the `public` folder, for example `website/public/students/alice/`)
- **15** Your file names and directory structure are correct (for example `website/app/students/alice/hw1/page.jsx`)
- **15** You created a single branch dedicated only to the assignment
- **10** Your JSX code has valid syntax and proper formatting
- **10** You successfully personalized both the page title and the first list with your own content
- **10** You created a second section with an `<h2>` heading and `<ul>` list for VST instruments 
