# Sezzle Static Widget SDK

This SDK is a way to install the Sezzle widget onto a merchant's website that does not communicate with Sezzle's server. All the widget code, custom configuration, images, and stylesheets are stored locally within the store theme. This approach means slightly faster load speed, and greater merchant control over the widget - the Sezzle team cannot make changes to the widget, for better or for worse.

## NPM Implementation

Using npm:
`npm install @sezzle/sezzle-static-widget`

Within your product page, add the following code snippet where you want the widget to render, updating the path to node_modules for your file structure:
```js
<script type="text/javascript" src="../node_modules/@sezzle/sezzle-static-widget/dist/bundle.js"></script>
  <script>
    const renderSezzle = new AwesomeSezzle({
      amount: `${yourPriceVariableHere}`,
    });
    renderSezzle.init();
  </script>
```

Use the Configuration options below to customize the widget appearance as desired.<br/>

## HTML Implementation

* Note: Implementation varies greatly by platform, theme, etc. Below is a general overview of the process. The code snippets below are <i>samples</i> and may need to be modified to fit your site. For Shopify merchants, please proceed to the next section.

Create a new Javascript file within your site's code where appropriate. <br/>
Copy+paste  <a href="https://github.com/sezzle/static-widgets/blob/production/dist/bundle.js">this minified code</a> into the newly created file.<br/>
Import the new file into the page(s) where the Sezzle widget will be added.<br/>
 ```html
  <script src="../scripts/sezzle-static-widget.js"></script>
 ```
Create a placeholder element where the Sezzle widget should be rendered on the page(s), usually below the price container element:<br/>
  ```html
    <div id="sezzle-widget"></div>
  ```
Add the following script below the placeholder element, updating the `amount` value to reflect your price variable which renders the current product price or cart total as applicable.<br/>
  ```html
    <script>
    var renderSezzle = new AwesomeSezzle({
        amount: `${yourPriceVariableHere}`
    })
    renderSezzle.init();
    </script>
  ```
Preview your changes to confirm the widget is displaying correctly in each of the following scenarios<br/>
  - Regular Price<br/>
  - Sale Price<br/>
  - Variant Selection<br/>
  - Desktop<br/>
  - Mobile<br/>

Use the Configuration options below to customize the widget appearance as desired.<br/>


## Shopify Implementation

Log into your Shopify store admin<br/>
Click Online Store > Themes<br/>
Next to the theme you wish to edit, click Actions, then select Edit Code<br/>

Under the Assets folder, click “Add a new asset” <br/>
On the Create a Blank File tab, name the file 'sezzle-static-widget’ and select “.js” as the file type, then click Add Asset<br/>
Copy the code from the below repository file and paste it into this new file, then click Save<br/>
* https://github.com/sezzle/static-widgets/blob/production/dist/bundle.js

Add the following lines of code wherever the widget should render on the product page within `templates/product.liquid` or `sections/product-template.liquid` as applicable:

```html
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

```html
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

## Customizing the Configuration

Once the widget is rendering, additional configurations can be added to the AwesomeSezzle to change the appearance. Below is an example featuring all the options. However, amount is the only required value.

```html
 <script>
  var renderSezzle = new AwesomeSezzle({
    amount: '{{ product.selected_or_first_available_variant.price | money }}',
    renderElement: 'new-sezzle-widget-container-id',
    theme: 'light',
    modalTheme:'color',
    maxWidth: 400,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    alignment: 'left',
    alignmentSwitchMinWidth: 576,
    alignmentSwitchType: 'center',
    textColor: '#111',
    fontFamily: 'Comfortaa, sans-serif',
    fontSize: 12,
    fontWeight: 400,
    widgetType: 'product-page',
    fixedHeight: 0,
    logoSize: 1.0,
    logoStyle: {},
    language: 'en',
    parseMode: 'default',
    merchantLocale: 'North America'
  })
  renderSezzle.init();
</script>
```

`amount` (required)

**Purpose**: The target price amount, in dollar format.
**Type**: string
**Default**: ''
**Additional Details**: Provide the product price variable as a template-literal,  Shopify.Liquid Example: `'{{ product.selected_or_first_available_variant.price | money }}'`

`renderElement` (optional)

**Purpose**: Path from the targetXPath to the element in the webpage after which the Sezzle widget should be rendered.
**Type**: string
**Default**: `sezzle-widget`
**Additional Details**: Provide the ID name or array of ID names that correspond to the widget placeholder elements.

`theme` (optional)

**Purpose**: Updates the logo color to coordinate and contrast with different background colors of websites.
**Type**: string
**Options**: dark, light, black-flat, white-flat, grayscale, white
**Default**: 'light'
**Additional Details**: If theme is not specified, the widget will attempt to detect the background color and apply the appropriate contrasting logo. Use "light"  or "black-flat" for light backgrounds, and "dark" or "white-flat" for dark backgrounds.

`modalTheme` (optional)

**Purpose**: Updates the modal color to coordinate with color or monochrome sites.
**Type**: string
**Options**: color, grayscale
**Default**: 'color'


`maxWidth` (optional)

**Purpose**: Maximum width of the widget element in pixels.
**Type**: number
**Default**: 400
**Additional Details**: 200 to render the widget nicely on 2 lines, 120 for 3 lines.

`marginTop` (optional)

**Purpose**: Amount of space above the widget in pixels.
**Type**: number
**Default**: 0

`marginBottom` (optional)

**Purpose**: Amount of space below the widget in pixels.
**Type**: number
**Default**: 0

`marginLeft` (optional)

**Purpose**: Amount of space left of the widget in pixels.
**Type**: number
**Default**: 0

`marginRight` (optional)

**Purpose**: Amount of space right of the widget in pixels.
**Type**: number
**Default**: 0

`alignment` (optional)

**Purpose**: Alignment of the widget relative to the parent element.
**Type**: string
**Options**: left, center, right, auto
**Default**: 'left'


`alignmentSwitchMinWidth` (optional)

**Purpose**: Screen width in pixels below which the alignment switches to `alignmentSwitchType` instead of `alignment`.
**Type**: number
**Default**: 760
**Additional Details**: The most common breakpoint is *768* (handheld vs desktop). `alignmentSwitchMinWidth` is typically only necessary when alignment is not auto.


`alignmentSwitchType` (optional)

**Purpose**: Alignment of the widget relative to the parent element to be applied when the viewport width is narrower than `alignmentSwitchMinWidth`.
**Type**: string
**Options**: left, center, right, auto
**Default**: 'auto'

`textColor` (optional)

**Purpose**: Color of the widget text.
**Type**: string
**Default**: '#111'
**Additional Details**: Accepts all kinds of values (hexadecimal, rgb(), hsl(), etc...)

`fontFamily` (optional)

**Purpose**: Font family of the widget text.
**Type**: string
**Default**: 'inherit'

`fontSize` (optional)

**Purpose**: Font size of the widget text in pixels.
**Type**: number
**Default**: 12
**Additional Details**: Enter numbers only. Do not enter the unit (e.g. px)!

`fontWeight` (optional)

**Purpose**: Boldness of the widget text.
**Type**: number
**Default**: 300
**Additional Details**: 100 is the lightest, 900 is the boldest.

`widgetType` (optional)

**Purpose**: Specifies the page category on which the widget is being rendered.
**Type**: string
**Options**: product-page, product-preview, cart
**Default**: 'product-page'

`fixedHeight` (optional)

**Purpose**: Sets the CSS value of fixed-height
**Type**: number
**Default**: 0

`logoSize` (optional)

**Purpose**: Ratio at which to scale the Sezzle logo.
**Type**: number
**Default**: 1.0
**Additional Details**: The space the logo occupies between the widget text and the More Info link/icon is determined by the font size. When dramatically scaling the widget, it may be necessary to override the styling to adjust the left and right margins of the logo using logoStyle.

`logoStyle` (optional)

**Purpose**: Custom styling to apply to the Sezzle logo within the widget.
**Type**: object
**Default**: {}
**Additional Details**: The object will accept any CSS styling in JSON format. Keys must be surrounded by '', given in camelCase instead of kebab-case, and separated from the following key by a comma instead of a semi-colon.

`language` (optional)

**Purpose**: Language in which the widget text should be rendered.
**Type**: string
**Options**: 'en'
**Default**: document.querySelector('html').lang
**Additional Details**: Currently, SezzleJS only supports 'en', 'fr', 'es' and 'de'. If the specified language is not supported, the translation will default to English.

`parseMode` (optional)

**Purpose**: Allows widget installment price to calculate and format correctly for foreign currencies
**Type**: string
**Options**: 'default', 'comma'
**Default**: 'default'

`merchantLocale` (optional)

**Purpose**: Allows widget to render the correct program details, depending on if the merchant is enrolled through Sezzle North America or Sezzle Europe.
**Type**: string
**Options**: North America, Europe
**Default**: 'North America'

### <b>Please discuss with Sezzle point of contact before using the below config options:</b>

`widgetTemplate` (optional)

**Purpose**: Text content of the widget. Also changes the arrangement of price, logo, and the info/learn-more icon within the widget.
**Type**: string, or object
**Default**: {en: 'or 4 interest-free payments of %%price%% with %%logo%% %%info%%', fr: 'ou 4 paiements de %%price%% sans intérêts avec %%logo%% %%info%%'}
**Additional Details**: Available templates include `%%price%%`, `%%logo%%`, `%%link%%`, `%%info%%`, `%%question-mark%%`, `%%line-break%%`, `%%afterpay-logo%%`, `%%afterpay-logo-grey%%`, `%%afterpay-info-icon%%`, `%%afterpay-link-icon%%`, `%%quadpay-logo%%`, `%%quadpay-logo-grey%%`, `%%quadpay-logo-white%%`, `%%quadpay-info-icon%%`, `%%affirm-logo%%`, `%%affirm-logo-grey%%`, `%%affirm-logo-white%%`, `%%affirm-info-icon%%`, `%%klarna-logo%%`, `%%klarna-logo-grey%%`, `%%klarna-logo-white%%`, `%%klarna-info-icon%%`.


`numberOfPayments` (optional)

**Purpose**: Number of installments by which the shopper will pay the total, calculates installment amount within the widget.
**Type**: number
**Default**: 4
**Additional Details**: There are very few merchants who offer anything other than a 4-pay model. This selection does not affect the appearance of the modal.

`minPrice` (optional)

**Purpose**: Minimum price in cents for which Sezzle can be selected at checkout. If the price at `targetXPath` is lower than this number, the widget will render with a note stating the minimum eligible price required.
**Type**: number
**Default**: 0
**Additional Details**: This configuration does not prevent a customer from checking out with Sezzle below this price. For more information on setting a gateway minimum, contact your Merchant Success representative or use the Contact Us section of the Sezzle Merchant Dashboard.


`maxPrice` (optional)

**Purpose**: Maximum price in cents for which the widget should be rendered. If the price at `targetXPath` is higher than this number, the widget will not render on the page.
**Type**: number
**Default**: 250000

`altLightboxHTML` (optional)

**Purpose**: Replaces the default modal design with the code snippet provided.
**Type**: string
**Default**: ''

`qpModalHTML` (optional)

**Purpose**: The code snippet of competitor modal, which will open when the competitor logo is clicked.
**Type**: string
**Default**: ''

`apModalHTML` (optional)

**Purpose**: The code snippet of competitor modal, which will open when the competitor logo is clicked.
**Type**: string
**Default**: ''

`apLink` (optional)

**Purpose**: The URL for the competitor's About page, which will open in a new tab when the competitor logo is clicked.
**Type**: string
**Default**: `https://www.afterpay.com/purchase-payment-agreement`

`affirmModalHTML` (optional)

**Purpose**: The code snippet of competitor modal, which will open when the competitor logo is clicked.
**Type**: string
**Default**: ''

`klarnaModalHTML` (optional)

**Purpose**: The code snippet of competitor modal, which will open when the competitor logo is clicked.
**Type**: string
**Default**: ''

### <b>The following are reserved for merchants enrolled in our long-term payment program. Please discuss with Sezzle point of contact before using the below config options:</b>

`minPriceLT` (optional)

**Purpose**: Minimum price in cents for which purchase is eligible for long-term lending. Above this amount, the monthly installments with interest will be reflected in the widget and modal. Below this amount, the 4-pay widget and modal will render.
**Type**: number
**Default**: 0
**Additional Details**: The `maxPrice` option should be overwritten to `4000000` for long-term.

`bestAPR` (optional)

**Purpose**: Standard APR rate by which interest should be calculated.
**Type**: number
**Default**: 9.99

`widgetTemplateLT` (optional)

**Purpose**: Text content of the widget. Also changes the arrangement of price, logo, and the info/learn-more icon within the widget.
**Type**: string, or object
**Default**: `or monthly payments as low as %%price%% with %%logo%% %%info%%`
**Additional Details**: Available templates include `%%price%%`, `%%logo%%`, `%%link%%`, `%%info%%`, `%%question-mark%%`, `%%line-break%%`.

`ltAltModalHTML` (optional)

**Purpose**: Replaces the default modal design with the code snippet provided.
**Type**: string


## Functions
The following functions are built into the static widget and are ready for use for your widget installation. Simply add the applicable snippet to your webpage code, updating the event listener and variables as necessary.

1. `alterPrice(newPrice)` - Alters price on widget. Create an event listener after `renderSezzle.init()` that invokes this function where `newPrice` is the new price value of the selected variant. Example:
    ```js
      document.onchange = function(){
        var newPrice = '${yourPriceVariableHere}';
        renderSezzle.alterPrice(newPrice);
      }
    ```

2. `renderModalByfunction()` - Opens the Sezzle modal by a function. Create an event listener that invokes this function if the event location is other than the info icon.
    ```js
      var clickElement = document.querySelector('#yourClickableElementIdHere')
      clickElement.addEventListener("click", function() { renderSezzle.renderModalByfunction() });
    ```

3. `isMobileBrowser()` - Returns true on mobile browser. Use this event to show or hide the widget in different page locations based on device type.
    ```js
      document.onreadystatechange = function(){
        if(renderSezzle.isMobileBrowser()){
          document.getElementById('sezzle-widget-mobile').style.display = "block";
          document.getElementById('sezzle-widget').style.display = "none";
        } else {
          document.getElementById('sezzle-widget').style.display = "block";
          document.getElementById('sezzle-widget-mobile').style.display = "none";
        }
      }
    ```

4. `getElementToRender()` - Returns Element where the widget will be rendered. Create an event listener that invokes this function if the widget should appear when the event occurs.
    ```js
      document.body.insertBefore(renderSezzle.getElementToRender(), document.getElementById('price').nextElementSibling);
    ```

5. `updateWidgetTemplate(newTemplate)` - Allows caller to update the widget template when specific scenarios might occur. Examples could include when custom text needs to render per customized pricing rules or when Sezzle is unavailable due to other restrictions.

```js
document.onchange = function(){
   renderSezzle.updateWidgetTemplate('%%logo%% Pay in 4 interest-free payments on purchases greater than $50. %%info%%');
}
```