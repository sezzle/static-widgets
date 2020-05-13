# Sezzle simple SDK 

This SDK is a simple way to include sezzle widget onto a merchant's website.
Think of it as a light version to our own `Sezzle-js` 
Every thing is packaged within the SDK i.e All the images, css is within the bundle.js file 

What makes this sdk interesting is that it has a different approach compared to our sezzle-js. 


## Configurations

1. **`amount`** - required , Example: `$ 25`
2. **`numberOfPayments`** - This config is optional. defaults to `4`
3. **`minPrice`** - This config is optional. It defaults to `0` - <small>in cents</small>
4. **`maxPrice`**` - This config is optional. It defaults to 250000 - <small>in cents</small>
5. **`altModalHTML`** - This config is optional.
6. **`apModalHTML`** - This config is optional.
7. **`qpModalHTML`** -This config is optional.
8. **`widgetTemplate`**  - This config is optional. It defaults to ~ `or 4 interest-free payments of %%price%% with %%logo%% %%info%%`
9. **`alignmentSwitchMinWidth`** - This config is optional. It defaults to `760`;
10. **`alignmentSwitchType`** - This config is optional. It defaults to ``
11. **`alignment`** - This config is optional. It defaults to   `left`
12. **`fontWeight`** - This config is optional. It defaults to `300`
13. **`fontSize`** - This config is optional. It defaults to `12` <small>in pixel</small>
14. **`fontFamily`** - This config is optional. It defaults to `inherit`
15. **`maxWidth`** - This config is optional. It defaults to `400`
16. **`textColor`** - This config is optional. It defaults to `#111`.
17. **`renderElement`** - This config is optional. It defaults to `sezzle-widget`.
18. **`apLink`** = - This config is optional. It defaults to `https://www.afterpay.com/terms-of-service`.
19. **`widgetType`** - This config is optional. It defaults to `product-page`.
20. **`bannerURL`** - This config is optional. It defaults to  ``.
21. **`bannerClass`** - This config is optional. It defaults to ``.
22. **`bannerLink`** - This config is optional. It defaults to ``.
23. **`marginTop`** - This config is optional. It defaults to `0`.
24. **`marginBottom`** - This config is optional. It defaults to `0`.
25. **`marginLeft`** - This config is optional. It defaults to `0`.
26. **`marginRight`** - This config is optional. It defaults to `0`.
27. **`logoSize`** - This config is optional. It defaults to `1.0`.
28. **`fixedHeight`** - This config is optional. It defaults to `0`.
29. **`logoStyle`** - This config is optional. It defaults to `{}`.


## Functions

1. `renderModalByfunction()`
   **Note** - This invokes `Sezzle Modal` by a function.

2. `alterPrice(newPrice)`
    **Note** - Alters price on widget.

3. `isMobileBrowser()`
    **Note** - Returns true on mobile browser.

4. `getElementToRender()`
    **Note** - Returns Element where the widget will be rendered.

## Example

One simply has to make place for the widget on his `html` with a `div which has an id of sezzle-widget`.
Our SDK searches for this element on the DOM and renders our widget.
```
    <script>
        var renderSezzle = new AwesomeSezzle({
               amount:'$ 25',
               marginTop:-20
        })
        renderSezzle.init();
      </script>
 ```
