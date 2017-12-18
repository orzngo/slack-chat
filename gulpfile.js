var gulp = require("gulp");
var ts = require("gulp-typescript");
var runSequence = require("run-sequence");


var serverProject = ts.createProject("tsconfig.json");

gulp.task("build", function () {
    return gulp.src("./src/**/*.ts")
        .pipe(serverProject())
        .pipe(gulp.dest("build/"));
});

gulp.task("default", function (callback) {
    runSequence(
        "build",
        callback
    );
});