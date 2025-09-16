# Sezzle Checkout Installment Widget

This product will display the installment amounts and payment dates on the checkout page.

## INSTALLATION

### React Method

Please refer to the instructions on [NPM](https://www.npmjs.com/package/@sezzle/sezzle-installment-widget) for React package installment

### Shopify Method

*Note: Compatible with Shopify Plus stores only.

1. Log in to your Shopify Admin
1. Go to Online Store > Themes
1. On the theme you wish to edit, click `...` then select Edit Code
1. In the `Assets` folder, click `New File` and name it `sezzle-installment-widget.js`
1. Copy+paste the contents of `src/sezzle-checkout-installment-widget/sezzle-checkout-installment-widget.js` then click Save
1. Paste the following into the bottom of the `templates/checkout.liquid` file in Shopify, then click Save:
    ```html
    {{ "sezzle-installment-widget.js" | asset_url | script_tag }}
    <script type="text/javascript">
        document.addEventListener('readystatechange', function(){
            var sezzlePaymentLine = document.querySelector('[alt="Sezzle"]').parentElement.parentElement.parentElement;
            var sezzleCheckoutWidget = document.createElement('div');
            sezzleCheckoutWidget.id = 'sezzle-installment-widget-box';
            sezzlePaymentLine.parentElement.insertBefore(sezzleCheckoutWidget, sezzlePaymentLine.nextElementSibling);
        })
    </script>
    ```
1. Back in the Javascript file, update the values of the following options as applicable, then click Save:
    - merchantLocale (optional): The country code. Currently Sezzle is only available in the United States and its territories, and Canada. Defaults to "US".
    - currencySymbol (optional): The currency symbol to display in the installment widget. If unassigned, the currency symbol will be automatically detected in the targeted checkout total element contents or default to `$`
    - checkoutTotal (*required*): The element where the checkout total is rendered. (Example value is given for Shopify default)

### Javascript Method (Non-Shopify platforms)

1. Create a copy of `src/sezzle-checkout-installment-widget/sezzle-checkout-installment-widget.js` within your store's theme code, then import it into the checkout page code.

2.
    Option 1 (recommended): To inject the placeholder element dynamically, add the following lines of code to run once the rest of the page has loaded, updating `sezzlePaymentLine` to target the Sezzle payment method line, below which the installment widget asset will display:
    ```html
    <script type="text/javascript">
        document.addEventListener('readystatechange', function(){
            var sezzlePaymentLine = document.querySelector('[alt="Sezzle"]').parentElement.parentElement.parentElement; // Shopify example
            var sezzleCheckoutWidget = document.createElement('div');
            sezzleCheckoutWidget.id = 'sezzle-installment-widget-box';
            sezzlePaymentLine.parentElement.insertBefore(sezzleCheckoutWidget, sezzlePaymentLine.nextElementSibling);
        })
    </script>
    ```

    Option 2: Enter the following two lines of code where the installment widget should appear
    ```html
        <div id="sezzle-installment-widget-box"></div>
        <script src="sezzle-checkout-installment-widget.js"></script>
    ```

3. Back in the Javascript file, update the values of the following options as applicable, then Save changes:
    - merchantLocale (optional): The country code. Currently Sezzle is only available in the United States and its territories, and Canada. Defaults to "US".
    - currencySymbol (optional): The currency symbol to display in the installment widget. If unassigned, the currency symbol will be automatically detected in the targeted checkout total element contents or default to `$`
    - checkoutTotal (*required*): The element where the checkout total is rendered. (Example value is given for Shopify default, other top platform values saved as comments)

_Note: language will auto-detect, first by HTML lang attribute, then by user's brownser default, and finally to EN._