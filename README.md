# Stack overflow chrome extension
## Summary
This extension will check the current page, and if the current page is a stack overflow page it will create an alert on the page to let the user know that the thread that they are viewing may be out of date. It will also provide a link to the latest documentation for the language being viewed and also a link to the most recent answer of the thread, for if the user wanted to skip straight to it.

# Screenshots
## Current version (early)
![chrome_l5a43Vl3V1](https://github.com/ellio86/stack-overflow-chrome-extension/assets/55849851/53f2d2ee-0b2b-4d75-a6c0-2bbc69174e00)
![chrome_0eQUXI4VWK](https://github.com/ellio86/stack-overflow-chrome-extension/assets/55849851/3979a1bc-a703-40f9-a19c-c23d70e65cb1)



# Dev notes
## Requirements
- Node js >= v18.13.0

## Building the extension
First, run an `npm install` in the root of the project to make sure that the node_modules are present and up to date. Use `npm ic` if you're having caching problems during development.

Then run `npm run build` and the `dist` folder will be generated. Contents from the public folder are copied over and contents of the src are compiled into js and outputted to the dist file

## Adding the extension to chrome
Navigate to chrome://extensions in a chromium browser. During development, click load unpacked and point it towards the dist folder generated above. 
