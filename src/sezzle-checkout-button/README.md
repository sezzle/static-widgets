The following are 4 methods for installing the Sezzle checkout button. The `Install as Asset` method should work for most installations.

## Install as Asset

_The Asset method is a one-size-fits-most - compatible with Shopify 2.0 onward, intuitively placing the Sezzle button after the Shopify checkout button, and inheriting select page styles._

### From CDN

1. Log in to your Shopify Admin
2. Go to Online Store > Themes
3. Next to the applicable theme, click `Actions` then `Edit Code`
4. Paste the following snippet in the bottom of the `layout/theme.liquid` file, enter the ID in the space provided, then click Save:

```html
{{ "//checkout-sdk.sezzle.com/sezzle-checkout-button.min.js" | script_tag }}
<script>
  new SezzleCheckoutButton({
  	merchantUUID : "enter ID here", <!-- Your ID(format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
  	widgetServerBaseUrl : "https://widget.sezzle.com",
  	cartTotal : {{ cart.total_price }},
  }).init();
</script>
```

5. Click Preview, then go to the cart page to confirm button is appearing correctly.

### Local File

> Use this method for testing the minified file

1. Clone/pull down the Static-Widgets[https://github.com/sezzle/static-widgets/] project, then run `npm run build`
2. Log in to your Shopify Admin
3. Go to Online Store > Themes
4. Next to the applicable theme, click `Actions` then `Edit Code`
5. Scroll to the Assets folder, then click Add A New Asset
6. Click Create a Blank File, name the section `sezzle-checkout-button`, select `.js` as the file type, then click Add Asset
7. In the Assets folder, select the asset you just created (you may need to scroll, files are not in alphabetical order).
8. Overwrite the asset template with the code contents here[../../../build/sezzle-checkout-button-asset.js], then click Save.
9. Paste the following snippet in the bottom of the `layout/theme.liquid` file, enter the ID in the space provided, then click Save:

```html
{{ "sezzle-checkout-button.js" | asset_url | script_tag }}
<script>
  new SezzleCheckoutButton({
  	merchantUUID : "enter ID here",  <!-- Your ID(format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
  	cartTotal : {{ cart.total_price }},
  }).init();
</script>
```

9. Click Preview, then go to the cart page to confirm button is appearing correctly.
   > For testing an unminified file, the process is the same, except skip step 1, and instead of step 8, copy+paste file contents from here[https://github.com/sezzle/static-widgets/blob/production/src/sezzle-checkout-button/sezzle-checkout-button-asset.js] but remove the `export default` line at the bottom, and update the snippet file path accordingly.

### STYLE CUSTOMIZATION

The button appearance can now be customized as needed using the below keys.

- `theme`: "light" is compatible with light background sites (default), "dark" is compatible with dark background sites.
- `template`: controls the text content - `%%logo%%` is required, and will be replaced with the Sezzle logo image. "Checkout with %%logo%%" is the default, but "Pay with %%logo%%" is an approved alternative.
  Here is an example of the default configuration:

```
  {{ "sezzle-checkout-button.js" | asset_url | script_tag }}
  <script>
      new SezzleCheckoutButton({
        merchantUUID: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        theme: "light", <!-- accepts "light" and "dark" (based on site background) -->
        template: "Checkout with %%logo%%", <!-- accepts "Checkout with %%logo%%", "Pay with %%logo%%", or "%%logo%%" -->
        cartTotal : {{ cart.total_price }}
      }).init();
  </script>
```

## Install as Section

_The Section method has a built-in customization matrix. However, since you cannot put a section inside another section, if your cart page code is in sections/cart.liquid or if you are unsure, please follow the instructions for `Install as Snippet` or `Install as HTML`._

1. Log in to your Shopify Admin
2. Go to Online Store > Themes
3. Next to the applicable theme, click `Actions` then `Edit Code`
4. Scroll to the Sections folder, then click Add A New Section
5. Name the section `sezzle-checkout-button`, then click Create Section
6. Overwrite the section template with the code contents here[https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button/sezzle-checkout-button-section.liquid].
7. Paste the following snippet into the `templates/cart.liquid` file where the button should appear, then click Save:
   - Note: this is typically below the Shopify checkout button. Open the file, then search (Cmd+F or Ctrl+F) for the word "checkout" - it is usually a button or input

```
	{% section "sezzle-checkout-button" %}
```

8. Click Customize Theme
9. Add a product to the cart, then go to the cart page
10. In the left toolbar, click Sezzle Checkout Button
11. Make any desired changes, then click Save
    - If the button is not in the desired position, either change the location of the code snippet or add applicable styling as needed.

## Install as Snippet

_The Snippet method has the same lightweight code as the HTML method, but can be customized through a configuration, and since it is saved in its own file, the tag added to the cart page is smaller and easier to move around as needed._

1. Log in to your Shopify Admin
2. Go to Online Store > Themes
3. Next to the applicable theme, click `Actions` then `Edit Code`
4. Scroll to the Snippets folder, then click Add A New Snippet
5. Name the file `sezzle-checkout-button`, then click Create Snippet
6. Overwrite the snippet template with the code contents here[https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button/sezzle-checkout-button-snippet.liquid].
7. Paste the following snippet into the `templates/cart.liquid` or `sections/cart-template.liquid` file where the button should appear, then click Save:
   - Note: this below the Shopify checkout button. Open the file, then search (Cmd+F or Ctrl+F) for the word "checkout" - it is usually a button or input

```
	{% include "sezzle-checkout-button" %}
```

8. Edit the values of the `assign` tags at the top of the file to edit styles. Details as follows:
   - Theme can be "light" or "dark", corresponding to the page background color.
   - Border type can be "square", "semi-rounded" or "rounded" to change the shape of the button.
   - Padding X can be set in px to change the space to the left and right of the text within the button.
   - Changes to the text can be made directly in the HTML, for instance `Pay with <img>`

## Install as HTML

_The HTML method is the most lightweight but the least intuitive install. Recommended for merchants who are comfortable reading and writing code._

1. Log in to your Shopify Admin
2. Go to Online Store > Themes
3. Next to the applicable theme, click `Actions` then `Edit Code`
4. Paste the code snippet here [https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button/sezzle-checkout-button.html] into the `templates/cart.liquid` or `sections/cart-template.liquid` file where the button should appear, then click Save:
   - Note: this is typically below the regular Shopify checkout button. Open the file, then search (Cmd+F or Ctrl+F) for the word "checkout" - it is usually a button or input
5. Click Save
6. Click Preview, then go to the cart page to confirm button is appearing correctly.
   - To change the widget position, cut+paste the code block into the new location.

### STYLE CUSTOMIZATION

For dark theme sites:
Change the `<button>` class from `sezzle-button-light` to `sezzle-button-dark`
Change the `<img>` href to `"https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg"`
Text to display can be updated as desired, but Sezzle logo must remain. The three most common variations are: - `Checkout with {logo}` - `Pay with {logo}` - `{logo}`
