dangerous-cliffs-of-nodejs
===========================

A talk about some of the key things to keep in mind when readying a node.js service for production.

You don't have to pull this repo down to view the slides, thanks to GitHub pages. Bam! [http://scottnonnenberg.github.io/dangerous-cliffs-of-nodejs/dist/slides.html]

But if you want to pull it local, it's ready to go without any changes. Just open dist/slides.html in your browser.

## making changes

### getting set up

```bash
npm install
bower install
```

To re-generate slides.html:

```bash
npm install -g grunt # (if you don't already have it)
grunt jade
```

### compile as you edit!

```
grunt watch
```
