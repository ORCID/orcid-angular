import { src, dest } from 'gulp'
const flatten = require('gulp-flatten')
const clean = require('gulp-clean')
const del = require('del')

export async function createShareAssetsFolder() {
  await new Promise((resolve, reject) => {
    // gulp 5 decodes files as utf8 by default, which corrupts fonts and images
    src(
      [
        './dist/*/*.{js,woff,woff2,jpg,jpeg,png,svg,webp,txt,css}',
        '!./dist/*/assets/*',
      ],
      { encoding: false }
    )
      .pipe(clean({ force: true }))
      .pipe(flatten())
      .pipe(dest('./dist/share-assets/', { overwrite: true }))
      .on('end', resolve)
      .on('error', reject)
  })

  await new Promise((resolve, reject) => {
    src('./dist/en/assets/**/*.*', { encoding: false })
      .pipe(dest('./dist/share-assets/assets', { overwrite: true }))
      .on('end', resolve)
      .on('error', reject)
  })

  await del(['./dist/*/assets', '!./dist/share-assets/assets'])
}
