---
title: "Assignment 8: ComfyUI"
excerpt: "Create an assignment using ComfyUI for image generation."
---

## Overview

**🚨 UPDATE 🚨** This assignment is for optional extra-credit. If you complete this assignment it will replace your lowest score for an existing homework assignment ⚠️

![Students learning about AI](/ai-class.png)

The goal: understand the practical effects of **Classifier Free Guidance (CFG)**
in diffusion models through hands-on experience. You will

- Generate 8 images with the same seed and identical parameters, varying only the CFG (Classifier Free Guidance) value
- Display these images on a web page with analysis of what you learned

## What is a diffusion model?

If you search or ask LLMs about how diffusion models work, you will probably get either

- Misleading oversimplifications OR
- Overly technical mathematical explanations

...neither of which is helpful for building intuition about how the models work. The best resource I have found for DDPM is [But how do AI images and videos actually work? (YouTube)](https://www.youtube.com/watch?v=iv-5mZ_9CPY). While this is a more technical video, it does a better job of conveying intuition about how these models really work – Including CFG.

**Note:** You may not understand everything in the video, but **DO NOT WORRY!**
Your goal should be to work towards an understanding by identifying the areas
that are confusing and gradually building understanding of those areas. This
takes time.

## 1. Prepare

1. Ensure the dev server runs locally (see [Getting Started](/modules/getting-started)).
1. Create a new branch for this homework, e.g., `yourname-hw8`.

## 2. Generate images with ComfyUI

Using ComfyUI, generate 8 images with the following requirements:

- **Same seed**: Use the same seed value for all 8 images
- **Identical parameters**: Keep all other parameters identical (prompt, model, steps, sampler, etc.)
- **Vary CFG only**: Change only the CFG (Classifier Free Guidance) value
- **CFG range**: Use 8 different CFG values between 1 and 20 (e.g., 1, 3, 5, 7, 10, 12, 15, 20)

Save each image with a filename that indicates the CFG value used (e.g., `cfg-1.png`, `cfg-3.png`, etc.).

## 3. Create your assignment page

Create your assignment page at `website/app/students/your-name/hw8/page.jsx` (or `page.md` if you prefer markdown).

Your page should include:

- All 8 images displayed clearly, labeled with their CFG values
- A description of the experiment: what parameters you used (seed, prompt, model, steps, sampler, etc.)
- Analysis of the results: describe what you observe as CFG changes and what you learned about how CFG affects image generation
- Optionally, include a brief description of the other parameters you used and why they matter

**Using images in Next.js:**

- **If using a JSX file (`.jsx`)**: You can place images in the same directory as your `page.jsx` file and import them directly. See [`/modules/midi-receive/page.jsx`](/modules/midi-receive) for an example:
  ```jsx
  import Image from "next/image";
  import Cfg1Image from "./cfg-1.png";
  import Cfg3Image from "./cfg-3.png";
  // ... etc

  // Then use:
  <Image src={Cfg1Image} alt="CFG value 1" />
  ```
  Alternatively, you can place images in `website/public/students/your-name/hw8/` and reference them using `/students/your-name/hw8/cfg-1.png`.

- **If using a markdown file (`.md`)**: Place your images in the `website/public/students/your-name/` directory and reference them using a path like `/students/your-name/cfg-1.png`.


## 4. Submit your assignment

1. Commit your new page and any supporting assets (e.g., images, screenshots) to your branch.
1. Push to GitHub and open a Pull Request into `main`.
1. Do not merge your own PR.

## Grading Rubric

- **10** PR changes only files in the correct directory
- **10** Correct file/directory structure (e.g., `.../students/your-name/hw8/page.jsx` or `page.md`)
- **10** Single dedicated branch
- **10** Valid syntax and proper formatting
- **15** All 8 images generated with same seed and parameters, varying only CFG values between 1 and 20
- **10** Images displayed clearly on the page with CFG values labeled
- **10** Description of experiment includes parameters used (seed, prompt, model, steps, sampler, etc.)
- **10** Analysis describes observations about CFG effects and what was learned
- **20** Images properly placed and referenced (in same directory as `page.jsx` with imports, in `public/` with markdown, or in `public/students/your-name/hw8/` with JSX)
