const gulp = require("gulp");
const fileinclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const size = require("gulp-size");
const reset = async () => del("./dist");
const autoprefixer = require("gulp-autoprefixer");
const html = async () => {
    return gulp
        .src("./src/*.html")
        .pipe(
            fileinclude({
                prefix: "@",
            })
        )
        .pipe(size())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(size())
        .pipe(gulp.dest("./dist"));
};

const styles = async () => {
    return gulp
        .src("./src/scss/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(
            autoprefixer({
                cascade: false,
            })
        )
        .pipe(gulp.dest("./dist/styles"));
};

const watcher = () => {
    gulp.watch("./src/**/*.html", gulp.series(html)).on(
        "change",
        browserSync.reload
    );
    gulp.watch("./src/scss/**/*.scss", gulp.series(styles)).on(
        "change",
        browserSync.reload
    );
};

const server = () => {
    browserSync.init({
        server: {
            baseDir: "./dist",
        },
    });
};

const dev = gulp.series(
    gulp.series(reset, html, styles),
    gulp.parallel(watcher, server)
);

exports.default = dev;
