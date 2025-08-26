---
title: "Assignment 1: Next.js Web Server Basics"
excerpt: "Over the course of the semester, we will explore how far we can push AI to create increasingly elaborate content."
---

- Due Date: 6PM EST September 9, 2024
- Cutoff: 6PM EST September 16, 2024

Over the course of the semester, we will explore how far we can push AI to
create increasingly elaborate content. In class we created a simple `.md` file.
Next we're going to take the first step towards creating interactive content on
the web.

Generative AIs were trained on data extracted from the web. As a result, they
know a lot of JavaScript, which is the programming language of the web. 

This assignment uses the `.jsx` flavor of JavaScript, which embeds HTML in
JavaScript.

## Assignment

### 1. Setup the Web Server

Make sure that the class website development server is running on your computer by following the instructions in [Getting Started](/modules/getting-started). 

You can verify this by going to http://localhost:3000/ in your browser. If you see
the class page, that means the dev server is running.

### 2. Create a Branch and Page

Creating a new branch is essential for submitting your homework correctly!

When starting work in a shared git repository, always begin by creating a new git branch, for example:

```bash
git checkout -b alice-hw1
```

You can also use GitHub Desktop if you do not want to use the Terminal.
Substitute `alice-hw1` with a suitable branch name.

1. Create a new directory in your student folder named `website/app/students/alice/hw1/` (replace `alice` with your name)
1. Add a `page.jsx` file in that directory, for example: `website/app/students/alice/hw1/page.jsx`

Copy the following JSX code:

```tsx
export default function StudentPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Alice's EP 390 Page</h1>
      <p>I'm Alice.</p>
      <h2 className="text-2xl font-semibold mt-6 mb-3">Musical Inspirations: Genres and Artists</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Ambient</li>
        <li>Aphex Twin</li>
        <li>Jazz</li>
      </ul>
    </div>
  );
}
```

Open up your page on your local machine
http://localhost:3000/students/your-name/hw1 and verify it renders correctly
(but replace `your-name` in the url)

**Your Task:** Modify the JSX code above to personalize it:
1. Change "Alice's EP 390 Page" to use your own name
2. Update the "Musical Inspirations: Genres and Artists" list items with your own favorite genres or artists
3. Create a second section by adding:
   - A new `<h2>` heading called "My Favorite VST Instruments"
   - A new `<ul>` list with a few favorite VST synthesizers, drum machines, or other instruments
   - Use the same CSS classes as the first list: `className="list-disc list-inside space-y-1"`

Verify again that http://localhost:3000/students/your-name/hw1 renders correctly

For bragging rights, you can add styling.

### 3. Commit and Push to GitHub

Once you've created your page, you need to commit your changes and push them to GitHub: 

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Add student page for [your name]"

# Push to GitHub. -u is needed the first time you push a new branch
git push -u origin [your-branch-name]
```


### 4. Make a Pull Request

After pushing your branch to GitHub, create a Pull Request (PR) to submit your assignment:

1. **Go to the GitHub repository** in your web browser
2. **Click "Compare & pull request"** (this button should appear after pushing your branch)
3. **Fill out the PR form:**
   - **Title:** Use a clear title like "Add student page - [Your Name]"
   - **Description:** Briefly describe what you've added
4. **Review your changes** to make sure only the intended files are modified
5. **Click "Create pull request"** to submit your assignment

**Important:** Do not merge your own pull request. Your instructor will review and merge it after grading.

## Grading Rubric

- **20** Your page renders correctly on the web
- **20** Your pull request changed only files in the correct directory (you may also modify your subdirectory in the `public` folder, for example `website/public/students/alice/`)
- **15** Your file names and directory structure are correct (for example `website/app/students/alice/hw1/page.jsx`)
- **15** You created a single branch dedicated only to the assignment
- **10** Your JSX code has valid syntax and proper formatting
- **10** You successfully personalized both the page title and the first list with your own content
- **10** You created a second section with an `<h2>` heading and `<ul>` list for VST instruments 
