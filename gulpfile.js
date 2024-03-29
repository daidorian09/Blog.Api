const gulp = require("gulp");
const tslint = require("gulp-tslint");
const clean = require("gulp-clean");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");


gulp.task("lint", function() {
    return gulp.src("./**/*.ts").pipe(tslint({}))
        .pipe(tslint.report({
            summarizeFailureOutput: true
        }));
})

gulp.task('html', function() {
    return gulp
        .src('./**/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return gulp.src('dist/*', {
            read: false
        })
        .pipe(clean());
})

gulp.task('build', function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
})