# Sezzle Simple SDK 

This SDK is a simple way to include sezzle widget onto a merchant's website.
Think of it as a light version to our own `Sezzle-js` 
Everything is packaged within the SDK i.e All the images, css is within the bundle.js file 

What makes this SDK interesting is that it has a different approach compared to the standard Sezzle widget script. Instead of reaching out to Sezzle's widget server on page-load, all the widget code and the custom configuration is stored locally within the store theme. 


## Configurations

Once the widget is rendering, additional configurations can be added to the AwesomeSezzle to change the appearance. Below is an example featuring all the options. However, amount is the only required value.

```
 <script>  
  var renderSezzle = new AwesomeSezzle({
        amount: '{{ product.selected_or_first_available_variant.price | money }}’,
		renderElement: 'new-sezzle-widget-container-id',
		theme: 'light',
		maxWidth: 400,
		marginTop: 0,
		marginBottom, 0,
		marginLeft: 0,
		marginRight: 0,
		alignment: 'left',
		alignmentSwitchMinWidth: 576,
		alignmentSwitchType: 'center',
		textColor: 'black',
		fontFamily: 'Comfortaa, sans-serif',
		fontSize: 12,
		fontWeight: 400,
        language: 'en'
  })
  renderSezzle.init();
</script>
```

1. **`amount`** - This config is required. Provide the product price variable as a template-literal,  Shopify.Liquid Example: `'{{ product.selected_or_first_available_variant.price | money }}'`
2. **`renderElement`** - This config is optional. It defaults to `sezzle-widget`.
3. **`theme`** - This config is optional. It defaults to `light`. Alternative values include `dark`, `grayscale`, `black`, or `white`.
4. **`maxWidth`** - This config is optional. It defaults to `none`.
5. **`marginTop`** - This config is optional. It defaults to `0`.
6. **`marginBottom`** - This config is optional. It defaults to `0`.
7. **`marginLeft`** - This config is optional. It defaults to `0`.
8. **`marginRight`** - This config is optional. It defaults to `0`.
9. **`alignment`** - This config is optional. It defaults to `left`. Alternative values include `center`, `right`, or `auto`.
10. **`alignmentSwitchMinWidth`** - This config is optional. It defaults to `760`.
11. **`alignmentSwitchType`** - This config is optional. Alternative values include `left`, `center`, or `right`.
12. **`textColor`** - This config is optional. It defaults to `#111`. Alternative values include all colors supported by CSS.
13. **`fontFamily`** - This config is optional. It defaults to `inherit`. Alternative values include all fonts supported by CSS.
14. **`fontSize`** - This config is optional. It defaults to `12` <small>in pixel</small>. 
15. **`fontWeight`** - This config is optional. It defaults to `300`.
16. **`widgetType`** - This config is optional. It defaults to `product-page`. Alternative values include `product-preview` or `cart`.
17. **`fixedHeight`** - This config is optional. It defaults to `0`.
18. **`logoSize`** - This config is optional. It defaults to `1.0`.
19. **`logoStyle`** - This config is optional. It defaults to `{}`.
20. **`language`** - This config is optional. It defaults to `en`. Only French translation is currently supported.

### <b>Please discuss with Sezzle point of contact before using the below config options:</b>
21. **`widgetTemplate`**  - This config is optional. It defaults to `or 4 interest-free payments of %%price%% with %%logo%% %%info%%`. Available templates include `%%price%%`, `%%logo%%`, `%%link%%`, `%%info%%`, `%%question-mark%%`, `%%line-break%%`, `%%afterpay-logo%%`, `%%afterpay-logo-grey%%`, `%%afterpay-info-icon%%`, `%%afterpay-link-icon%%`, `%%quadpay-logo%%`, `%%quadpay-logo-grey%%`, `%%quadpay-logo-white%%`, or `%%quadpay-info-icon%%`.
22. **`numberOfPayments`** - This config is optional. defaults to `4`.
23. **`minPrice`** - This config is optional. It defaults to `0` - <small>in cents</small>.
24. **`maxPrice`** - This config is optional. It defaults to `250000` - <small>in cents</small>.
25. **`altModalHTML`** - This config is optional.
26. **`qpModalHTML`** -This config is optional.
27. **`apModalHTML`** - This config is optional.
28. **`apLink`** - This config is optional. It defaults to `https://www.afterpay.com/terms-of-service`.


## Functions

1. `alterPrice(newPrice)` - Alters price on widget. Create an event listener after `renderSezzle.init()` that invokes this function where `newPrice` is the new price value of the selected variant. Example:
    ```
      document.onchange = function(){
        var newPrice = '${yourPriceVariableHere}'; 
        renderSezzle.alterPrice(newPrice);
      }
    ```

2. `renderModalByfunction()` - Opens the Sezzle modal by a function. Create an event listener that invokes this function if the event location is other than the info icon.

3. `isMobileBrowser()` - Returns true on mobile browser. Use this event to show or hide the widget in different page locations based on device.

4. `getElementToRender()` - Returns Element where the widget will be rendered. Create an event listener that invokes this function if the widget should appear when the event occurs.


## Implementation General Overview

Create a new Javascript file within your site's code where appropriate. <br/>
Copy+paste  <a href="https://github.com/sezzle/static-widgets/blob/production/dist/bundle.js">this minified code</a> into this newly created file.<br/>
Import this new file into the page(s) where the Sezzle widget will be added.<br/>
 ```
  <script src="../scripts/sezzle-static-widget.js"></script>
 ```
Create a placeholder element where the Sezzle widget should be rendered on the page(s), usually below the price container element:<br/>
  ```
    <div id="sezzle-widget"></div>
  ```
Add the following script below the placeholder element, updating the amount value to reflect your price variable which renders the current product price or cart total as applicable.<br/>
  ```
    <script>  
    var renderSezzle = new AwesomeSezzle({ 
        amount: `${yourPriceVariableHere}`
    })
    renderSezzle.init();
    </script>
  ```
Preview your changes to confirm the widget is displaying correctly.<br/>
  - Regular Price<br/>
  - Sale Price<br/>
  - Variant Selection<br/>
  - Desktop<br/>
  - Mobile<br/>

Use the Configuration options above to customize the widget appearance as desired.<br/>


## Shopify Implementation

Log into your Shopify store admin<br/>
Click Online Store > Themes<br/>
Next to the theme you wish to edit, click Actions, then select Edit Code<br/>
* Or click Customize. In the lower-left corner, click Theme Actions, then select Edit Code<br/>

Under the Assets folder, click “Add a new asset” <br/>
On the Create a Blank File tab, name it 'sezzle-static-widget’ and select “.js” as the file type, then click Add Asset<br/>
Copy the code from the below repository file and paste it into this new file, then click Save<br/>
* https://gitlab.sezzle.com/sezzle/static-widgets/-/edit/dev/dist/bundle.js

* If bundle.js/sezzle-static-widget.js file name or type is changed in Assets folder, it needs to be updated during the next step,

Add the following lines of code wherever the widget should render on the product page within `templates/product.liquid` or `sections/product-template.liquid` as applicable:

```
<!-- Sezzle Static Widget -->
<div id="sezzle-widget"></div>
{{ 'sezzle-static-widget.js' | asset_url | script_tag }}
<script>  
  var renderSezzle = new AwesomeSezzle({ 
      amount: '{{ product.selected_or_first_available_variant.price | money }}'
  })
  renderSezzle.init();
  document.onchange = function(){
    var newPrice = '{{product.selected_or_first_available_variant.price | money}}'; 
    renderSezzle.alterPrice(newPrice);
  }
</script>
<!-- End Sezzle Static Widget -->
```

Add the following lines of code wherever the widget should render on the cart page within `templates/cart.liquid` or `sections/cart-template.liquid` as applicable:

```
<!-- Sezzle Static Widget -->
<div id="sezzle-widget"></div>
{{ 'sezzle-static-widget.js' | asset_url | script_tag }}
<script>  
  var renderSezzle = new AwesomeSezzle({ 
      amount: '{{ cart.total_price | money }}',
    alignment: 'right'
  })
  renderSezzle.init();
</script>
<!-- End Sezzle Static Widget -->
```

* If the ID `sezzle-widget` is changed in the div element, the new ID needs to be given in the config as `renderElement`.