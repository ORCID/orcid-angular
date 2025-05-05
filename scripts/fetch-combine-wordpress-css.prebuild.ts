// Import fetch if it's not globally available (uncomment if needed)
// const fetch = require('node-fetch');
const fs = require('fs')

// URLs of the CSS files
const cssUrls = [
  'https://info.orcid.org/wp-content/themes/orcid-outreach-pro/style.css',
  'https://info.orcid.org/wp-includes/css/dist/block-library/style.css',
  'https://info.orcid.org/wp-content/plugins/genesis-blocks/dist/style-blocks.build.css',
]

// Function to fetch and combine CSS content
async function fetchAndCombineCSS(urls) {
  let combinedCSS = '::ng-deep .wordpress-styles {\n' // Starting the wrapper class

  for (const url of urls) {
    try {
      const response = await fetch(url)
      let data = await response.text()
      data = data.replace(/@charset "UTF-8";\s*/g, '') // REMOVE CHARSET
      data = data.replace(
        /\} \*\/[\s\S]*?\/\* ROB 10\/07\/22 /g,
        '/* ROB 10/07/22 '
      ) // REMOVE A ERROR WITH THE ORIGINAL CSS
      data = data.replace(/.*\.png.*\n/g, '') // REMOBE IMAGES
      data = data.replace(/:root\s*\{([\s\S]*?)\}/g, '$1') // UNWRAPS THE :root variables

      combinedCSS += `  /* Content from ${url} */\n`
      combinedCSS += data + '\n' // Add the CSS content
    } catch (error) {
      console.error(`Failed to fetch CSS from ${url}: ${error}`)
    }
  }

  combinedCSS += '}' // Closing the wrapper class

  // Writing the combined CSS to a SCSS file
  fs.writeFile(
    'src/app/home/pages/home/wordpress-styles.scss',
    combinedCSS,
    (err) => {
      if (err) {
        console.error('Failed to write SCSS file:', err)
      } else {
        console.info('Successfully wrote combined.scss')
      }
    }
  )
}

// Run the function
fetchAndCombineCSS(cssUrls)
