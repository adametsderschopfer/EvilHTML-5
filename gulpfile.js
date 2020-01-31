const 	gulp         = require('gulp'),
		sass         = require('gulp-sass'),
		browserSync  = require('browser-sync').create(),
		concat       = require('gulp-concat'),
		uglify 		 = require('gulp-uglify'),
		cleanCSS 	 = require('gulp-cssmin'),
		autoprefixer = require('gulp-autoprefixer'),
		sourcemaps 	 = require('gulp-sourcemaps'),
		rsync        = require('gulp-rsync'),
		imagemin 	 = require('gulp-imagemin');


// Local Server
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: 'src/'
		},
		notify: false,
		// online: false, // Work offline without internet connection
		// tunnel: true, tunnel: 'projectname', // Demonstration page: http://projectname.localtunnel.me
	})
});
//  Styles & compil & aPrefix
gulp.task('styles', () => {
	return gulp.src('./src/scss/**/*.scss')
	.pipe(sass({
        outputStyle: 'expanded',
		includePaths: [__dirname + '/node_modules']
	}))
	.pipe(sourcemaps.init())
	.pipe(concat('styles.min.css'))
	.pipe(autoprefixer({
		grid: true,
		overrideBrowserslist: ['last 10 versions']
	}))
	.pipe(sourcemaps.write('.'))
	.pipe(cleanCSS())
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({ stream: true }))
});

//  scripts
gulp.task('scripts', () => {
	return gulp.src('./src/js-src/**/*.js')
		.pipe(concat('all.min.js'))
		.pipe(uglify())
        .pipe(gulp.dest('src/js'))
		.pipe(browserSync.reload({ stream: true }))
});



// Code & Reload
gulp.task('code', function() {
	return gulp.src('src/**/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

// Deploy
gulp.task('rsync', function() {
	return gulp.src('src/')
	.pipe(rsync({
		root: 'src/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], 
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});



// Minify => img
gulp.task('img', () => {
	gulp.src('src/img/*')
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.mozjpeg({quality: 70, progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
		]))
        .pipe(gulp.dest('src/img/'))
})


// Watcher 
gulp.task('watch', function() {
	gulp.watch('src/scss/**/*.scss', gulp.parallel('styles'));
	gulp.watch(['src/js-src/**/*.js'], gulp.parallel('scripts'));
	gulp.watch('src/**/*.html', gulp.parallel('code'));
	gulp.watch('src/img/*', gulp.parallel('img'));
	
});

gulp.task('default', gulp.parallel('img','styles', 'scripts', 'browser-sync', 'watch'));
 