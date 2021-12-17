
The following are 4 methods for installing the Sezzle checkout button. The `Install as Asset` method should work for most installations.

## Install as Asset
*The Asset method is a one-size-fits-most - compatible with 2.0, intuitively placing the Sezzle button after the Shopify checkout button, and inheriting select page styles.*

1. Log in to your Shopify Admin
2. Go to Online Store > Themes
3. Next to the applicable theme, click `Actions` then `Edit Code`
4. Scroll to the Assets folder, then click Add A New Asset
5. Click Create a Blank File, name the section `sezzle-checkout-button`, select `.js` as the file type, then click Add Asset
6. In the Assets folder, select the asset you just created (you may need to scroll, files are not in alphabetical order).
7. Overwrite the asset template with the code contents here[https://github.com/sezzle/static-widgets/blob/production/src/sezzle-checkout-button/sezzle-checkout-button-asset.js], then click Save.
8. Paste the following snippet in the bottom of the `layout/theme.liquid` file, enter the ID in the space provided, then click Save:
```
  {{ "sezzle-checkout-button.js" | asset_url | script_tag }}
  <script>
      new SezzleCheckoutButton({
        merchantUUID:"enter ID here" <!-- Your ID(format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) can be found in `business` section(under `settings`) of merchant dashboard -->
      }).init();
  </script>
```
8. Click Preview, then go to the cart page to confirm button is appearing correctly.

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
        template: "Checkout with %%logo%%"  <!-- accepts "Checkout with %%logo%%", "Pay with %%logo%%", or "%%logo%%" -->
      }).init();
  </script>
```


## Install as Section
*The Section method has a built-in customization matrix. However, since you cannot put a section inside another section, if your cart page code is in sections/cart.liquid or if you are unsure, please follow the instructions for `Install as Snippet` or `Install as HTML`.*

1. Log in to your Shopify Admin
2. Go to Online Store > Themes
3. Next to the applicable theme, click `Actions` then `Edit Code`
4. Scroll to the Sections folder, then click Add A New Section
5. Name the section `sezzle-checkout-button`, then click Create Section
6. Overwrite the section template with the code contents here[https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button/sezzle-checkout-button-section.liquid].
7. Paste the following snippet into the `templates/cart.liquid` file where the button should appear, then click Save:
	* Note: this is typically below the Shopify checkout button. Open the file, then search (Cmd+F or Ctrl+F) for the word "checkout" - it is usually a button or input
```
	{% section "sezzle-checkout-button" %}
```
8. Click Customize Theme
9. Add a product to the cart, then go to the cart page
10. In the left toolbar, click Sezzle Checkout Button
11. Make any desired changes, then click Save
	* If the button is not in the desired position, either change the location of the code snippet or add applicable styling as needed.


## Install as Snippet
*The Snippet method has the same lightweight code as the HTML method, but can be customized through a configuration, and since it is saved in its own file, the tag added to the cart page is smaller and easier to move around as needed.*

1. Log in to your Shopify Admin
2. Go to Online Store > Themes
3. Next to the applicable theme, click `Actions` then `Edit Code`
4. Scroll to the Snippets folder, then click Add A New Snippet
5. Name the file `sezzle-checkout-button`, then click Create Snippet
6. Overwrite the snippet template with the code contents here[https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button/sezzle-checkout-button-snippet.liquid].
7. Paste the following snippet into the `templates/cart.liquid` or `sections/cart-template.liquid` file where the button should appear, then click Save:
	* Note: this below the Shopify checkout button. Open the file, then search (Cmd+F or Ctrl+F) for the word "checkout" - it is usually a button or input
```
	{% include "sezzle-checkout-button" %}
```
8. Edit the values of the `assign` tags at the top of the file to edit styles. Details as follows:
	* Theme can be "light" or "dark", corresponding to the page background color.
	* Border type can be "square", "semi-rounded" or "rounded" to change the shape of the button.
	* Padding X can be set in px to change the space to the left and right of the text within the button.
	* Changes to the text can be made directly in the HTML, for instance `Pay with <img>`


## Install as HTML
*The HTML method is the most lightweight but the least intuitive install. Recommended for merchants who are comfortable reading and writing code.*

1. Log in to your Shopify Admin
2. Go to Online Store > Themes
3. Next to the applicable theme, click `Actions` then `Edit Code`
4. Paste the code snippet here [https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button/sezzle-checkout-button.html] into the `templates/cart.liquid` or `sections/cart-template.liquid` file where the button should appear, then click Save:
	* Note: this is typically below the regular Shopify checkout button. Open the file, then search (Cmd+F or Ctrl+F) for the word "checkout" - it is usually a button or input
7. Click Save
8. Click Preview, then go to the cart page to confirm button is appearing correctly.
	* To change the widget position, cut+paste the code block into the new location.

### STYLE CUSTOMIZATION
For dark theme sites:
    Change the `<button>` class from `sezzle-button-light` to `sezzle-button-dark`
    Change the `<img>` href to `"https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg"`
Text to display can be updated as desired, but Sezzle logo must remain. The three most common variations are:
	- `Checkout with {logo}`
	- `Pay with {logo}`
	- `{logo}`


### CONDITIONS
To hide the checkout button under certain conditions, either:
* wrap the below HTML block in a Liquid conditional statement. Examples below:
```html
	{% if cart.total_price > 100  %}<div>Checkout with Sezzle</div>{% endif%}
```
```html
	{% unless cart.total_price < 100 %}<div>Pay with Sezzle</div>{% endunless %}
```
OR
* create a new `<script type="text/javascript"></script>` element with an event listener and function that hides or shows the button under certain conditions
```html
	<script type="text/javascript">document.addEventListener( "change", function(){if(window.innerWidth < 560){document.querySelector(.sezzle-checkout-button).style.display = "none !important"} else {document.querySelector(".sezzle-checkout-button").style.display = "inline-block"} } )</script>
```
