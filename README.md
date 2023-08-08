# Stack overflow chrome extension
## Summary
This extension will check the current page, and if the current page is a stack overflow page it will check the date on the thread and create an alert on the page to let the user know that the thread that they are viewing may be out of date. 

\[planned]
It will also provide a link to the latest documentation for the language being viewed and also a link to the most recent answer of the thread, for if the user wanted to skip straight to it.

## Screenshots
![chrome_dkcxhdd3CN](https://github.com/ellio86/stack-overflow-chrome-extension/assets/55849851/9bb76fc0-de7e-4f47-98c8-e7fec5e0e622)
![chrome_yxbbxnw6Zt](https://github.com/ellio86/stack-overflow-chrome-extension/assets/55849851/5dd5eb3d-36da-4d57-b5b7-310ff6ed28e8)

# Dev notes
## Requirements
- Node js >= v18.13.0

## First time setup
**Ensure that you are using the correct version of node (check with `nvm list`, change with `nvm use [version]`)**

Run `npm install` in a cmd window at the root of the project; this will create the `node_modules` folder with our node modules we just installed in. Use `npm ic` if you're having caching problems during development.

## Building the extension
**Ensure that you are using the correct version of node (check with `nvm list`, change with `nvm use [version]`)**

Run `npm run build` and the `dist` folder will be generated. Contents from the `public` folder are copied over and contents of the `src` folder are compiled from TypeScript into JavaScript and output to the `dist` folder.

## Adding the extension to chrome
Navigate to chrome://extensions in a chromium browser. Click load unpacked and point it towards the dist folder generated above. 
