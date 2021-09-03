## Install as Section
You cannot put a section inside another section. If your cart page code is in sections/cart.liquid, please follow the instructions for `Install as HTML`.
1. Log in to our Shopify store admin
2. Go to Online Store > Themes
3. Click Actions, then select Edit Code
4. Scroll to the Sections folder, then click Add A New Section
5. Name the section `sezzle-checkout-button`, then click Create Section
6. Overwrite the section template with the code contents here[https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button/sezzle-checkout-button-section.liquid].
7. Paste the following snippet into the templates/cart.liquid file where the button should appear, then click Save:
	* Note: this below the Shopify checkout button. Open the file, then search (Cmd+F or Ctrl+F) for the word 'checkout' - it is usually a button or input
```
	{% section 'sezzle-checkout-button' %}
```
8. Click Customize Theme
9. Add a product to the cart, then go to the cart page
10. In the left toolbar, click Sezzle Checkout Button
11. Make any desired changes, then click Save
	* If the button is not in the desired position, either change the location of the code snippet or add applicable styling as needed.



## Install as HTML
1. Log in to your Shopify Admin
2. Go to Online Store > Themes
3. Next to the applicable theme, click `Actions` then `Edit Code`
4. Paste the code snippet here [https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button/sezzle-checkout-button.html] into the templates/cart.liquid file where the button should appear, then click Save:
	* Note: this below the Shopify checkout button. Open the file, then search (Cmd+F or Ctrl+F) for the word 'checkout' - it is usually a button or input
7. Click Save
8. Click Preview, then go to the cart page to confirm button is appearing correctly.
	* To change the widget position, cut+paste the code block into the new location.
	* Style changes can be made directly in the element's "style" attribute, as outlined below.


### STYLE CUSTOMIZATION
For dark theme sites:
    Change the `<button>` class from `sezzle-button-light` to `sezzle-button-dark`
    Change the `<img>` href to `"https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg"`
To change the button radius, change `border-radius` to `0px` for square, `5px` for semi-rounded, or `300px` for rounded.
`padding-left` and `padding-right` can be updated as desired.
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
	<script type="text/javascript">document.addEventListener( 'change', function(){if(window.innerWidth < 560){document.querySelector(.sezzle-checkout-button).style.display = 'none !important'} else {document.querySelector('.sezzle-checkout-button').style.display = 'inline-block'} } )</script>
```
