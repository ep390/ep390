---
title: Creating a Page on the Class Website
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

## Hands On

First, ensure [Node.js](https://nodejs.org/) is installed.

Now we will create a page on the class website like Alice's above. Clone the
repository and install the development environment by executing these commands
in the terminal. You can use GitHub Desktop to clone if you prefer.

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
git checkout -b alice-page
```

Substitute `alice-page` with a suitable branch name.

You can use GitHub Desktop if you do not want to use the Terminal.

Create a new directory with your name and add a `page.md`, for example
[website/app/students/alice/page.md](https://github.com/ep390/ep390/blob/main/website/app/students/alice/page.md?plain=1)

Copy Alice's introductory blog post, and replace her content and thoughts with your own. What do you think AI is useful / overhyped for?

```
---
title: "Alice's EP-390"
excerpt: ""
date: "2025-08-23"
author:
  name: "Alice"
---

I'm an example student taking EP 390!

I think generative AI is useful for doing your homework for you.

I think generative AI could be over-hyped for its ability to self-improve.
```

**Important: this will be posted on the public internet so keep it professional!** 

You may use a screen-name instead of your first name, but make sure your
professor knows who the page belongs to.

Navigate to the local version of your newly created page, which will look something like Alice's:

[http://localhost:3000/students/alice](http://localhost:3000/students/alice)

Ensure it looks good before proceeding.

### 3. Push and create a PR

Tell the instructor your GitHub username. After they add you to the class
Repository push your branch, for example:

```bash
git push -u origin alice-page
```

Now use GitHub to create a pull request from your branch to the main branch.
