gulp = require 'gulp'
coffee = require 'gulp-coffee'
less = require 'gulp-less'

coffeeDir = 'src/'
lessDir = 'src/'
jsDir = 'dist/js'
cssDir = 'dist/css'

compileCoffee = ->
  gulp.src coffeeDir + '/*.coffee'
    .pipe()
    .pipe(gulp.dest(jsDir))
gulp.task 'compile-coffee', compileCoffee

compileLess = ->
  gulp.src lessDir + '/*.less'
    .pipe(less())
    .pipe(gulp.dest(cssDir))
gulp.task 'compile-less', compileLess

gulp.task 'watch-compile',->
  gulp.watch lessDir + '/**/*.less',['compile-less']
  gulp.watch coffeeDir + '/**/*.coffee',['compile-coffee']

gulp.task 'default',['compile-less','compile-coffee','watch-compile']
