var gulp        = require('gulp');
var sass        = require('gulp-sass');
var prefixes    = require('gulp-autoprefixer');
var watch       = require('gulp-watch');
var spritesmith = require('gulp.spritesmith');
var livereload  = require('gulp-livereload');
var notify      = require('gulp-notify');

// only reload when modified html
gulp.task('html', function() {
    return gulp.src('./')
        .pipe(notify({message: 'modified HTML'}))
        .pipe(livereload());
});

// compile sass and add prefixes
gulp.task('sass', function() {
    return gulp.src('./src/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(prefixes('> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'))
        .pipe(gulp.dest('./assets/css/'))
        .pipe(notify({message: "compile sass"}))
        .pipe(livereload());
});

// generate a sprite of all the images inside the `sprite`directory
gulp.task('sprite', function() {
    // Generate our spritesheet
    var spriteData = gulp.src('./src/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'mixin-sprite.scss',
        imgPath: '../img/sprite.png'
    }));

    // path of styles
    spriteData.css
        .pipe(gulp.dest('./src/sass/'));

    // optimize image
    spriteData.img
        .pipe(gulp.dest('./assets/img/'))
        .pipe(notify({message: "generated sprite"}));

    return spriteData.img;
});

// watch modified files
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('./**/*.hbs', ['html']);
    gulp.watch('./src/sass/*.scss', ['sass']);
});

// default task
gulp.task('default', ['sass', 'watch']);
