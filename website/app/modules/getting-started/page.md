---
title: Getting Started
author:
  name: Charles Holbrow
---


Take a moment to study the structure of the `website/app/` directory of the
class repo. Notice how `website/app/syllabus/` has a `page.md` file? Whenever
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