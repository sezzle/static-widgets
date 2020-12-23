## Sezzle Checkout Button

The Sezzle checkout button was created so Sezzle can be used on a merchant site that is using a cart extension app, such as Carthook, instead of Shopify native checkout. If the Sezzle checkout button is clicked on the cart page, the cart extension checkout will be bypassed, and the user will be taken to the Shopify native checkout.

Log into your Shopify store admin<br/>
Click Online Store > Themes<br/>
Next to the theme you wish to edit, click Actions, then select Edit Code<br/>
  Or click Customize. In the lower-left corner, click Theme Actions, then select Edit Code<br/>

Under the Assets folder, click `Add a new asset` <br/>
On the Create a Blank File tab, name it `sezzle-static-checkout` and select `.js` as the file type, then click Add Asset<br/>
Copy the code from the following repository file and paste it into this new file, then click Save:<br/>
https://gitlab.sezzle.com/sezzle/static-widgets/-/tree/dev/src/sezzle-static-checkout.js

Place the following lines of code within the `sections/cart-template.liquid` or `templates/cart.liquid` file where the Sezzle checkout button should appear (after the Shopify checkout button), then click Save

```
<sezzle-button></sezzle-button>
{{ 'sezzle-static-checkout.js' | asset_url | script_tag }}
```

To hide the checkout button under certain conditions, either:
    * wrap the `<sezzle-button>` HTML block in the Liquid conditional: <br/>
        `{% if cart.total_price > 100  %}<div>Pay with Sezzle</div>{% endif%}`<br/>
        OR<br/>
        `{% unless cart.total_price < 100 %}<div>Pay with Sezzle</div>{% endunless %}`<br/>
    OR <br/>
    * create a new `<script type="text/javascript"></script>` element with an event listener and function that hides or shows the button under certain conditions: <br/>
        `<script type="text/javascript">document.addEventListener( 'change', function(){if(window.innerWidth < 560){document.querySelector(.sezzle-checkout-button).style.display = 'none !important'} else {document.querySelector('.sezzle-checkout-button').style.display = 'inline-block'} } )</script>`


### Options:

The button appearance can now be customized as needed using the below keys. Here is an example of the default configuration:

```
<sezzle-button  
  template= 'Checkout with %%logo%%' 
  theme='light' 
  borderType ='rounded'
  paddingX = '13px'
></sezzle-button>
```

`template`

Purpose: Customizes the text content of the Sezzle checkout button<br/>
Type: string<br/>
Default: 'Checkout with %%logo%%'<br/>
Additional Details: `%%logo%%` is a required template that will be replaced with the official Sezzle logo. The accompanying text can be customized. Example: 'Pay with %%logo%%'

`theme`

Purpose: Updates the logo color to coordinate and contrast with different background colors of the merchant site.<br/>
Type: string<br/>
Options: 'light', 'dark'<br/>
Default: 'light'<br/>
Additional Details: Select 'dark' if the cart page background is dark

`borderType`

Purpose: Updates the look of the Sezzle checkout button<br/>
Type: string<br/>
Options: 'square', 'semi-rounded', 'rounded'<br/>
Default: 'rounded'

`paddingX`

Purpose: Changes the left and right padding within the Sezzle checkout button<br/>
Type: string<br/>
Default: '13px'
