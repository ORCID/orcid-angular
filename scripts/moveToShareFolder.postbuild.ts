import { src, dest } from 'gulp'
const flatten = require('gulp-flatten')
const clean = require('gulp-clean')
const del = require('del')

export async function createShareAssetsFolder() {
  await new Promise((resolve, reject) => {
    src(['./dist/*/*.{js,woff,woff2,jpg,svg,txt}', '!./dist/*/assets/*'])
      .pipe(clean({ force: true }))
      .pipe(flatten())
      .pipe(dest('./dist/share-assets/', { overwrite: true }))
      .on('end', resolve)
      .on('error', reject)
  })

  await new Promise((resolve, reject) => {
    src('./dist/en/assets/**/*.*')
      .pipe(dest('./dist/share-assets/assets', { overwrite: true }))
      .on('end', resolve)
      .on('error', reject)
  })

  await del(['./dist/*/assets', '!./dist/share-assets/assets'])
}

