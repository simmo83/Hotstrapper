var gulp = require('gulp'),
	sass = require('gulp-sass'),
	del = require('del'),
	uglify = require('gulp-uglify'),
	replace = require('gulp-replace'),
	cssnano = require('gulp-cssnano'),
	cache = require('gulp-cache'),
	runSequence = require('run-sequence'),
	concat = require("gulp-concat"),
	minifyCss = require('gulp-minify-css'),
	fileinclude = require('gulp-file-include'),
	broswerSync = require("browser-sync").create(),
	imgOptim = require("gulp-imageoptim");

var srcPath = "src",
	distPath = "dist",
	
	scssSrcPattern = "src/scss/**/*.scss",
	cssSrcPattern = "src/css/**/*.css",
	cssSrcPath = "src/css",
	cssDistPath = "dist/css",
	
	jsSrcPattern = "src/js/**/*.js",
	jsSrcPath = "src/js",
	jsDistPath = "dist/js",

	imgSrcPattern = "src/img/**/*.*",
	imgSrcPath = "src/img",
	imgDistPath = "dist/img",
	
	htmlSrcPattern = "src/*.html";

gulp.task('browserSync', function () {
	broswerSync.init({
		server: {
			baseDir: distPath
		}
	})
});

gulp.task("sass", function () {
	return gulp.src(scssSrcPattern)
	.pipe(sass().on("error", sass.logError))
	.pipe(gulp.dest(cssSrcPath))
});

gulp.task("css", ['sass'], function () {
	return gulp.src(cssSrcPattern)
	.pipe(minifyCss())
	.pipe(concat('hotstrapper.min.css'))
	.pipe(gulp.dest(cssDistPath))
	.pipe(broswerSync.reload({
		stream: true
	}));
});

gulp.task("js", function () {
	return gulp.src(jsSrcPattern)
	.pipe(uglify())
	.pipe(concat('hotstrapper.min.js'))
	.pipe(gulp.dest(jsDistPath))
	.pipe(broswerSync.reload({
		stream: true
	}));
});


gulp.task("img", function () {
	// Need to install imageoptim https://imageoptim.com/mac
	return gulp.src(imgSrcPattern)
	// .pipe(imgOptim.optimize())
	.pipe(gulp.dest(imgDistPath))
});

gulp.task("html", function () {
	return gulp.src(htmlSrcPattern)
	.pipe(fileinclude())
	.pipe(gulp.dest(distPath))
	.pipe(broswerSync.reload({
		stream: true
	}));
});

gulp.task("clean", function () {
	return del.sync(distPath);
});

gulp.task("watch", function () {
	gulp.watch(cssSrcPath, ['css']);
	gulp.watch(jsSrcPath, ['js']);
	gulp.watch(imgSrcPath, ['img']);
	gulp.watch(htmlSrcPattern, ['html']);
});

gulp.task('default', function (callback) {
	runSequence(['clean', 'sass', 'js', 'html', 'browserSync'], 'watch', callback);
});

gulp.task('build', function (callback) {
	runSequence('clean', 'sass', 'css', ['js', 'img', 'html'], callback);
});