set -e

rm -rf dist

# build jade templates
grunt jade

mkdir dist/img
mkdir dist/css
mkdir dist/css/theme
mkdir dist/lib
mkdir dist/lib/font
mkdir dist/lib/notes
mkdir dist/js

# copy images over
cp img/* dist/img/

# css
cp bower_components/reveal.js/css/reveal.min.css dist/css/reveal.min.css
cp bower_components/reveal.js/css/theme/default.css dist/css/theme/default.css
cp bower_components/reveal.js/lib/css/zenburn.css dist/css/zenburn.css
cp bower_components/reveal.js/css/print/pdf.css dist/css/pdf.css
cp bower_components/reveal.js/css/print/paper.css dist/css/paper.css

# fonts
cp bower_components/reveal.js/lib/font/league_gothic-webfont.woff dist/lib/font/league_gothic-webfont.woff
cp bower_components/reveal.js/lib/font/league_gothic-webfont.ttf dist/lib/font/league_gothic-webfont.ttf
cp bower_components/reveal.js/lib/font/league_gothic-webfont.svg dist/lib/font/league_gothic-webfont.svg

# reveal.js
cp bower_components/reveal.js/lib/js/head.min.js dist/js/head.min.js
cp bower_components/reveal.js/lib/js/html5shiv.js dist/js/html5shiv.js
cp bower_components/reveal.js/js/reveal.js dist/js/reveal.min.js
cp bower_components/reveal.js/lib/js/classList.js dist/js/classList.js

# notes plugin
cp bower_components/reveal.js/plugin/notes/notes.js dist/lib/notes/notes.js

# using custom-tweaked notes.html
cp src/slides/notes.html dist/lib/notes/notes.html
