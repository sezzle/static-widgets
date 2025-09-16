# Sezzle Checkout Installment Widget

This product will display the installment amounts and payment dates on the checkout page.

## INSTALLATION

### React Method

Please refer to the instructions on [NPM](https://www.npmjs.com/package/@sezzle/sezzle-installment-widget) for React package installment

### Javascript Method

1. Create a copy of `src/sezzle-checkout-installment-widget/sezzle-checkout-installment-widget.js` within your store

2.a (recommended) Add the following script to inject the placeholder element dynamically
add the following lines of code to run when the page has loaded (un-commented) and update the query to match your page:
Note: our top four platforms are given as examples - choose one or create your own
```
<script type="text/javascript">
	 document.addEventListener('readystatechange', function(){
		 var sezzlePaymentLine = document.querySelector('[alt="Sezzle"]').parentElement.parentElement.parentElement; // Shopify
		 // var sezzlePaymentLine = document.querySelector('.payment_method_sezzlepay'); // WooCommerce
		 // var sezzlePaymentLine = document.querySelector('.sezzle'); // CommentSold
		 // var sezzlePaymentLine = document.querySelector('.linkGateway'); // 3DCart
	 var sezzleCheckoutWidget = document.createElement('div');
	 sezzleCheckoutWidget.id = 'sezzle-installment-widget-box';
	 sezzlePaymentLine.parentElement.insertBefore(sezzleCheckoutWidget, sezzlePaymentLine.nextElementSibling);
	 })
</script>
```

2.b Enter the following two lines of code (un-commented) where this widget should appear
```
<div id="sezzle-installment-widget-box"></div>
<script src="sezzle-checkout-installment-widget.js"></script>
```

3. Update the querySelector target in checkoutTotal below to indicate the cart total element
Note: our top four platforms are given as examples - choose one or create your own
