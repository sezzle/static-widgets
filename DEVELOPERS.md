
## Testing Static Widget

In Terminal, run: `bun install && bun run build-widget`
Go to playground/index.html
Update the HTML and config for the feature you wish to test.
Secondary-click on the file and select "Open in Default Browser"
 - If you don't have that option, click on Extensions in the left toolbar
 - Search for and install "open in browser" by TechER, or an equivalent

* Following any code changes, you will need to re-compile the code and refresh the page.

## Working with translations and Lokalise

Now we are using Localise tool here where we keep translations for widget service.

### If you want to add a new key of translation and upload it to Localise

1. Add a new message to the component's `en.json` file with default message. For example:

```json
  "myNewMessage" :  "Default message"
```
1. Run command `API_KEY=<localise-api-key> bun run translate:push` where is `<localise-api-key>` your API key which you need for authentication. You can find Localise API key using following instructions given in the link (https://docs.lokalise.com/en/articles/1929556-api-tokens).
2. Send translations keys to #translation-request Slack channel
3. Then translator or developer can go to the Lokalise project and add translations for the needed languages.

### If you want to download translations from Lokalise

1. Run command `API_KEY=<localise-api-key> bun run translate:pull` where is `<localise-api-key>` is your api key which you need for authentication.
2. Then updated files with translations should appear in the src/translations directory

Commit and push the change and merge your MR.

For futher information,please follow the link https://sezzle.atlassian.net/wiki/spaces/ME/pages/2887909400/Translation+-+everything+you+need+to+know

## Working with dependencies

This project ships a `bun.lock` for local development and a `package-lock.json` that the GitLab pipeline consumes via `npm ci`. When you add or remove a dependency, run **both** `bun install` and `npm install` and commit both lockfiles — drift between the two will fail the release pipeline.

`bunfig.toml` sets `minimumReleaseAge = 259200` (3 days) so Bun refuses to install package versions published in the last 3 days — a supply-chain safety guard. `npm ci` does not enforce this, so the protection only holds if you introduce dependency changes through Bun first:

1. `bun add <pkg>` (or `bun update <pkg>`) — Bun applies the release-age filter and writes `bun.lock`.
2. `npm install` — syncs `package-lock.json` to the version Bun selected.
3. Commit both lockfiles.

If you run `npm install <pkg>` first, npm has no release-age filter and may pick a freshly-published version; the next `bun install` will then accept it from the lockfile and silently bypass the guard.

## Releasing updates to NPM:

1. Do not update version in package.json
2. `bun install && npm install && bun run build-widget`
3. If either lockfile was regenerated, commit and push the updated file(s) before tagging. CI will re-run on the new commit.
4. Create tag in Gitlab to reflect the new version and attach to your branch
5. Merge the branch to production - the pipeline will bump the version number in package.json and release to NPM
   - If prompted, enter NPM_NEWVERSION value with the desired new version number.

If you accidentally publish, use `npm unpublish @sezzle/sezzle-static-widget@{Major.minor.patch}` to back out the changes within 24 hours.

## Testing the Checkout Button

Follow the instructions in ./addons/sezzle-checkout-button/README.md to install the desired package in https://admin.shopify.com/store/sezzle-dev/themes
 - If you don't have direct access to this store, you may be able to access it via Shopify Partners: https://partners.shopify.com/455865/stores?search_value=sezzle-dev.myshopify.com
 - If you don't have access via either method, you will need to submit a request to Sezzle Service Desk to be added as a staff member on Shopify Partners.