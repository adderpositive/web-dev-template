# Development stack
A default development stack for creating static HTML templates.

## Requirements
- Node.js

## Install
Command: `npm install`

## Default setting
1. Duplicate `example.config.json`
2. Rename it to `config.json`
3. Create a set up in `config.json`

## Development version
### Tasks
`gulp default`

## Stage version
### Tasks
TODO

## Production version
### Tasks
`gulp production`

`gulp productionUpdate` - fast version (compile sass & scripts)

`gulp productionDeploy` - production deploy according to `config.json`

## TODO default
- [x] add config 
- [x] deploy
- [] add https://standardjs.com/index.html & jslint?
- [] stage version
- [] work with enviroment variable
- [] posibility to concate files CSS & JS to one (http 1.0)
- [] posibility to separate files CSS & JS (http 2.0)
- [] autoloading plugins to templates
- [] work with images as in wordpress?!
- [] tasks optimalized for slim framework & wordpress (plan)

## TODO plugins
- [x] swiper
- [x] inpage scroll
- [] menu fix
- [] popup
- [] gallery
- [] video snippet
- [] lazy loading
- [] forms, API request

## Some materials
- https://gulpjs.com/docs/en/getting-started/explaining-globs
- https://www.sitepoint.com/automate-css-tasks-gulp/
