
## Testing Static Widget

In Terminal, run: `npm install & npx webpack --mode production --config webpack/webpack.config.js`
Go to playground/index.html
Update the HTML and config for the feature you wish to test.
Secondary-click on the file and select "Open in Default Browser"
 - If you don't have that option, click on Extensions in the left toolbar
 - Search for and install "open in browser" by TechER, or an equivalent

* Following any code changes, you will need to re-compile the code and refresh the page.

## Releasing updates to NPM:

1. Update CHANGELOG.md
2. Update `version` number in `package.json`
   1. This can also be done using `npm version <update_type>` where update_type options are `major`, `minor`, or `patch`
3. `npm install`
4. `npm publish`
   1. You cannot overwrite previously published versions
   2. If you accidentally publish, use `npm unpublish @sezzle/sezzle-static-widget@2.1.1` to back out the changes within 24 hours.

## Testing the Checkout Button

Follow the instructions in src/sezzle--checkout-button/README.md to install the desired package in https://admin.shopify.com/store/sezzle-dev/themes
 - If you don't have direct access to this store, you may be able to access it via Shopify Partners: https://partners.shopify.com/455865/stores?search_value=sezzle-dev.myshopify.com
 - If you don't have access via either method, you will need to submit a request to Sezzle Service Desk to be added as a staff member on Shopify Partners.