---
title: "Getting Started with Markdown Posts"
excerpt: "Learn how to create and manage markdown blog posts in the EP-390 web application."
date: "2024-01-20T15:30:00.000Z"
author:
  name: "Course Instructor"
  picture: "/placeholder-avatar.jpg"
---

# Getting Started with Markdown Posts

Now that we have the markdown functionality working, here's how you can create new blog posts:

## Creating a New Post

1. Navigate to the `_posts` directory
2. Create a new `.md` file with a descriptive filename
3. Add the required frontmatter at the top
4. Write your content in Markdown

## Required Frontmatter

Every post needs these fields in the frontmatter:

```yaml
---
title: "Your Post Title"
excerpt: "A brief description of your post"
date: "2024-01-20T15:30:00.000Z"
author:
  name: "Author Name"
  picture: "/path/to/avatar.jpg"
---
```

## Markdown Features

You can use all standard Markdown features:

- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Lists (like this one!)

### Code Blocks

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

### Images

You can also include images by placing them in the `public` directory and referencing them:

```markdown
![Alt text](/path/to/image.jpg)
```

The posts will automatically be sorted by date, with the newest posts appearing first.
