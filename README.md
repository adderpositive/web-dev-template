# Dev stack
Default stack for developing static HTML templates.

Stack uses following modules:
- Gulp.js - automation tool
- Browsersync - creating of local server
- Twig - templating system for HTML
- SASS - precompiler for CSS
- Babel - for possibility to use modern features in JS
- Imagemin - partial optimalization of images
- Svgstore - creating SVG map + svgforeverybody polyfill

## Project structure:
```
.
├── \_materials
├── dev                     # Development files visible on local server
├── gulpfile.js
├── node_modules
├── prod                    # Production/stage compiles files
├── src
│   ├── html                # Twig reusable components
│   ├── icons               # Only svg icons
│   ├── img                 
│   ├── js                  
│   ├── other               # Materials like videos, fonts, favicons etd.
│   ├── sass                
│   └── index.twig          # In root of `src` folder should be all templates
├── .editorconfig
├── .gitignore
├── example.config.json     # Default project setting - should be duplicated to `config.json`
├── LICENSE.md
├── package-lock.json
├── package.json
└── README.md
```

## Install

### Requirements
- Node.js
- Gulp.js

> Command for installation: `npm install`

### Default setting
1. Duplicate `example.config.json`
2. Rename it to `config.json`
3. Create a set up in `config.json`

## Tasks
> Recommendation: Use `npm run [-task]` rather than `gulp [-task]`.

### Development version
Following task creates a server on https://localhost:8000, where you can see real time changes you make in `/src` directory. While task is running, `/src` is compiled to `/dev`.

**Task to run:**

`npm run default` or `gulp default`

### Stage version
> You should have created remote server & access data for server saved in `config.json`.

Next task creates stage version for all templates & make a deploy on hosting for testing reasons.

**Task to run:**

`npm run stage` or `gulp production --env=stage`

---

Make an update of JS & CSS files & make a deploy on hosting for testing reasons.

**Task to run:**

`npm run stage-update` or `gulp productionUpdate --env=stage`

---

Create stage version in `/prod` directory.

**Task to run:**

`npm run stage-export` or `gulp productionExport --env=stage`

### Production version
> You should have created remote server & access data for server saved in `config.json`.

Next task creates production version for all templates & make a deploy on hosting.

**Task to run:**

`npm run prod`
or
`gulp production --env=production`

---

Make an update of JS & CSS files & make a deploy on hosting.

**Task to run:**

`npm run prod-update`
or
`gulp productionUpdate --env=production`

---

Create production version in `/prod` directory.

**Task to run:**

`npm run prod-export` or `gulp productionExport --env=production`

## TODO default
- [x] add config 
- [x] deploy
- [x] add https://standardjs.com/index.html & jslint?
- [x] stage version
- [x] work with enviroment variable
- [x] basic documentation 
- [ ] posibility to concate files CSS & JS to one (http 1.0)
- [ ] posibility to separate files CSS & JS (http 2.0)
- [ ] autoloading plugins to templates
- [ ] work with images as in wordpress?!
- [ ] tasks optimalized for slim framework & wordpress (plan)
- [ ] make automated creating of .scss files according to classes - prefixes (b-, p-, c-, s-, u-)

## TODO plugins
- [x] swiper
- [x] inpage scroll
- [x] menu fix
- [x] popup
- [x] gallery
- [ ] video snippet
- [ ] lazy loading
- [ ] forms, API request
- [x] add basic styles for some components
