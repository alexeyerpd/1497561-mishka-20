const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const minify = require("gulp-minify");

gulp.task("styles", () => {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
});

gulp.task("server", (done) => {
  sync.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
});

gulp.task("createWebp", () => {
  return gulp
    .src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("source/img"));
});

gulp.task("images", () => {
  return gulp
    .src("source/img/**/*.{jpg,svg,png}")
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.mozjpeg({ quality: 85, progressive: true }),
        imagemin.svgo(),
      ])
    )
    .pipe(gulp.dest("source/img"));
});

gulp.task("sprite", () => {
  return gulp
    .src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("clean", () => {
  return del("build");
});

gulp.task("html", () => {
  return gulp.src("source/*.html").pipe(gulp.dest("build/"));
});

gulp.task("copy", () => {
  return gulp
    .src(
      [
        "source/fonts/**/*.{woff,woff2}",
        "source/img/**",
        "source/js/**",
        "source/*.ico",
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("./build"));
});

gulp.task("min-js", function () {
  return gulp
    .src("source/js/*.js")
    .pipe(
      minify({
        ext: {
          min: ".min.js",
        },
        ignoreFiles: ["-min.js"],
      })
    )
    .pipe(gulp.dest("build/js/"));
});

gulp.task("watcher", () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/**/*.js", gulp.series("min-js")).on("change", sync.reload);
  gulp.watch("source/**/*.html").on("change", sync.reload);
});

gulp.task("build", gulp.series("clean", "copy", "styles", "min-js","sprite", "html"));
gulp.task("start", gulp.series("styles", "min-js", "server", "watcher"));
