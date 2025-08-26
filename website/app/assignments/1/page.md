---
title: "Lesson 1: Getting Started"
excerpt: "Let's create some pages in the class website. Over the course of the semester, we will explore how far we can push AI to create increasingly elaborate content."
---

Let's create some pages in the class website. Over the course of the semester, we will explore how far we can push AI to create increasingly elaborate content. To get started we will go over the simplest possible example.

## What You'll Learn

- How to setup the class web **server** for development
- How to add a page to the website with a markdown file
- How to submit an assignment as a GitHub Pull Request (PR)

## Assignment

### 1. Setup the Web Server

First, ensure [Node.js](https://nodejs.org/) is installed.

Then, clone the repository and install the development environment by executing
these commands in the terminal

```bash
git clone https://github.com/ep390/ep390.git
cd ep390/website/
npm install
npm run dev
```

This will start a "development" web server on your local machine that runs the
class website, probably at [http://localhost:3000](http://localhost:3000/)

### 2. Update Your Page

Creating a new branch is essential for submitting your homework correctly!

When starting work in a shared git repository always begin by creating a new git branch, for example

```bash
git checkout -b charles-hw1
```

You can also use GitHub Desktop if you do not want to user the Terminal.
Sustitute `charles-hw` with a suitable branch name.





2. Create a new directory with your name put in `page.md`, for example
   - [website/app/students/alice/page.md](https://github.com/ep390/ep390/blob/main/website/app/students/alice/page.md?plain=1)


### 3. Push To GitHub

TBD

### 4. Make a Pull Request

TBD

## Grading Rubric

- Front Matter:
- Your pull request changed only files in the correct  directory (you may also modify the your subdirectory in the public folder, for example `website/public/students/alice/`)
- Your file names are correct (for example `website/app/students/alice/page.md`)
- You created a single branch dedicated only to the assignment
- Your content is legible and 