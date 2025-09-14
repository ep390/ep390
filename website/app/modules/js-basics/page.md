---
title: "JavaScript Basics"
---

Get a feel for the JS langauge...

To run JavaScript you need an interpreter like a web browser, [node](https://nodejs.org/), [deno](https://deno.com/), or [bun](https://bun.sh/).

We will use `node`. You can download it from [nodejs.org](http://nodejs.org).

**Do not try to memorize the syntax all at once.** _Your memory will strengthen as you work with the langauge._

## Creating and Assigning Variables

Open the terminal `cd` into an empty working directory, and type `node`. Try
entering this code:

```javascript
let score = 0;
console.log(score);
score = 5;
console.log(score); // 5
```

`const` is another way to create variables. However, you can never re-assign to a `const` variable.

```javascript
const name = "Alice";
name = "Bob"; // ERROR!
```

## Using Functions

```javascript
let count = 0;

// Define a function named addOne
function addOne() {
  count = count + 1;
  console.log("the new value of count is", count);
}

// Now that you have function defined try using it.
addOne();
addOne();
```

Here are two other methods of defining a function

```javascript
// Create a function. Assign it to a variable named addOneB
const addOneB = () => {
  count = count + 1;
  console.log("the new value of count is", count);
};

// One-line functions can usually omit the curly braces
const addOneC = () => (count = count + 1);
```

But how would you pass arguments into a function? It looks very similar to Python.

```javascript
function add(num) {
  count = count + num;
}

console.log(count);
add(10);
console.log(count);
```

## JavaScript Arrays

Arrays hold ordered lists of values.

Try entering this code:

```javascript
const numbers = [1, 2, 3];
console.log(numbers[0]); // 1
console.log(numbers.length); // 3
```

Change a value by index:

```javascript
numbers[1] = 20;
console.log(numbers); // [1, 20, 3]
```

Arrays can hold strings too:

```javascript
const fruits = ["apple", "banana"];
fruits.push("cherry"); // add a cherry to the end of the array
console.log(fruits[1]); // "banana"
```

## JavaScript Objects

Objects group related values. They use key-value pairs.

Try entering this code:

```javascript
const user = {
  name: "Alice",
  score: 0,
};
console.log(user.name); // "Alice"
console.log(user.score); // 0
```

Change values with dot notation:

```javascript
user.score = 10;
user.name = "Bob";
console.log(user);     // { name: "Bob", score: 10 }
console.log(user.name) // "Bob"
```

Add a new key:

```javascript
user.level = "beginner";
console.log(user.level); // "beginner"
```

Use bracket notation with a string key:

```javascript
const key = "name";
console.log(user[key]); // "Bob"
```

Objects can be nested:

```javascript
const game = {
  title: "Tennis",
  player: {
    name: "Bob",
    score: 10,
  },
};
console.log(game.player.name); // "Bob"
```
