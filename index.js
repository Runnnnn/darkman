#! node
// #!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var co = require('co')
var prompt = require('co-prompt')
var program = require('commander')

function copyTemplate (from, to) {
  fs.stat(from, (err, stats) => {
    if (stats.isDirectory()) writeDir(to, from, fs.readdirSync(from, 'utf-8'))
    else if (stats.isFile()) writeFile(to, fs.readFileSync(from, 'utf-8'))
  })
}
function writeFile (to, file, mode) {
  fs.writeFileSync(to, file)
}
function writeDir (to, from, dirs, mode) {
  dirs.forEach(fileName => {
    let fromDir = from + '/' + fileName
    let toDir = to + '/' + fileName
    fs.stat(fromDir, (err, stats) => {
      if(stats.isFile()) {
        writeFile(toDir, fs.readFileSync(fromDir, 'utf-8'))
      }
      else if (stats.isDirectory()) {
        mkdir(toDir, () => {
          copyTemplate(fromDir, toDir)
        }) 
      }
    })
  })
}
function mkdir (path, fn) {
  fs.mkdir(path, function (err) {
    fn && fn()
  })
}


// program
//   .version('0.1.0')
//   .option('-p, --peppers', 'Add peppers')
//   .option('-P, --pineapple', 'Add pineapple')
//   .option('-b, --bbq-sauce', 'Add bbq sauce')
//   .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
//   .parse(process.argv)

// console.log('you ordered a pizza with:')
// if (program.peppers) console.log('  - peppers')
// if (program.pineapple) console.log('  - pineapple')
// if (program.bbqSauce) console.log('  - bbq')
// console.log('  - %s cheese', program.cheese)

var confirm = prompt.confirm

co(function *(){
  var dir = yield prompt(chalk.blue('project name: '))
  var redux = yield confirm(chalk.yellow('redux? '))
  var saga = yield confirm(chalk.hex('#DEADED')('redux-saga? '))
  var route = yield confirm(chalk.hex('#11aadd')('route? '))
  // console.log(redux)
  if (saga === false && route === false) {
    let from = path.join(__dirname, 'templates', 'redux-react-starter')
    mkdir('./' + dir, () => copyTemplate(from, './' + dir))
  }
  if (saga === false && route === true) {
    let from = path.join(__dirname, 'templates', 'react-redux-boilerplate')
    mkdir('./' + dir, () => copyTemplate(from, './' + dir))
  }
  if (saga === true && route === true) {
    let from = path.join(__dirname, 'templates', 'react-redux-saga-boilerplate')
    mkdir('./' + dir, () => copyTemplate(from, './' + dir))
  }
  process.stdin.pause()
})
