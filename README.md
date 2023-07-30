# Stack overflow chrome extension
## Summary
This extension will check the current page, and if the current page is a stack overflow page it will create an alert on the page to let the user know that the thread that they are viewing may be out of date. It will also provide a link to the latest documentation for the language being viewed and also a link to the most recent answer of the thread, for if the user wanted to skip straight to it. ((Images to come))

# Dev notes
## Requirements
- Node js >= v18.13.0

## Building the extension
First, run an `npm install` in the root of the project to make sure that the node_modules are present and up to date. Use `npm ic` if you're having caching problems during development.

Then run `npm run build` and the `dist` folder will be generated. Contents from the public folder are copied over and contents of the src are compiled into js and outputted to the dist file

## Adding the extension to chrome
Navigate to chrome://extensions in a chromium browser. During development, click load unpacked and point it towards the dist folder generated above. 
