dangerous-cliffs-of-nodejs
===========================

A talk about some of the key things to keep in mind when readying a Node.js service for production.

You don't have to pull this repo down to view the slides, thanks to GitHub pages. Bam! http://scottnonnenberg.github.io/dangerous-cliffs-of-nodejs/dist/slides.html

If you want to pull it local, it is ready to go without any changes. Just open `dist/slides.html` in your local browser. _Note:_ The speaker notes view doesn't work when accessing slides via `file://` URL.

## Running the Demos

```bash
npm install --production # saves 59MB in node_modules!
node demos/1.\ Crashes/a.\ express.js
```

You're off and running!

## Making changes

### Getting set up

```bash
npm install
bower install
```

To re-generate slides.html:

```bash
npm install -g grunt # (if you don't already have it)
grunt jade
```

### Compile as you edit!

```
grunt watch:jade
```
