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
   var sezzleObserver = new MutationObserver(function(){
      if(!document.querySelector('.sezzle-checkout-button')){
         new SezzleCheckoutButton({
            merchantUUID : "enter ID here",  <!-- Your ID(format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
            cartTotal : {{ cart.total_price }},
         }).init();
      }
   });
   sezzleObserver.observe(document, {
      childList: true,
      subtree: true
   });
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
8. Overwrite the asset template with the code contents here[../../../build/sezzle-checkout-button.js], then click Save.
9. Paste the following snippet in the bottom of the `layout/theme.liquid` file, enter the ID in the space provided, then click Save:

```html
{{ "sezzle-checkout-button.js" | asset_url | script_tag }}
<script>
   var sezzleObserver = new MutationObserver(function(){
      if(!document.querySelector('.sezzle-checkout-button')){
         new SezzleCheckoutButton({
            merchantUUID : "enter ID here",  <!-- Your ID(format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
            cartTotal : {{ cart.total_price }},
         }).init();
      }
   });
   sezzleObserver.observe(document, {
      childList: true,
      subtree: true
   });
</script>
```

9. Click Preview, then go to the cart page to confirm button is appearing correctly.

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
