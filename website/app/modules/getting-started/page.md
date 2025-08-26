---
title: Getting Started
date: "2025-08-25"
author:
  name: Charles Holbrow
---

Take a moment to study the structure of the `website/app/` directory of the
class repo. Notice how [website/app/syllabus/](https://github.com/ep390/ep390/blob/main/website/app/syllabus) has a **`page.md`** file? Whenever
this file changes on the main branch a GitHub action builds a new version of the
website, and publishes it to
[ep390.vercel.app/syllabus](https://ep390.vercel.app/syllabus)

This is a general pattern. We'll use it to create pages for assignments

Notice how this filename maps to a web "route".

- Git repo filename: [website/app/**syllabus**/page.md](https://github.com/ep390/ep390/blob/main/website/app/syllabus/page.md?plain=1)
- Development route: [http://localhost:3000/**syllabus**/](http://localhost:3000/syllabus)
- Production route: [https://ep390.vercel.app/**syllabus**/](https://ep390.vercel.app/syllabus/)

Make a sub-folder and **`page.md`** file your assignments. For example:

- Git repo filename: [website/app/**students/alice**/page.md](https://github.com/ep390/ep390/blob/main/website/app/students/alice/page.md?plain=1)
- Development route: [http://localhost:3000/**students/alice**/](http://localhost:3000/students/alice)
- Production route: [https://ep390.vercel.app/**students/alice**/](https://ep390.vercel.app/students/alice)

## Activity

Create a page for yourself like the alice example above.

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

Create a new directory with your name and add a `page.md`, for example
[website/app/students/alice/page.md](https://github.com/ep390/ep390/blob/main/website/app/students/alice/page.md?plain=1)

### 3. Push and create a PR

Tell the instructor your GitHub username. After they add you to the class
Repository push your branch, for example:

```bash
git push -u origin charles-hw
```

