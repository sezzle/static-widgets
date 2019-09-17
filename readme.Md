

/**
 * Sample Config  supplied to the init function could be a string or an object like follows
 * '$ 10' or
 * {
 *  amount:'$ 10',
 *  fontSize:13
 * }
 * Our Widget would detect element with id  - sezzle-widget
 * and render our widget there with default config unless over ridden 
 */


# Sezzle simple SDK 

This SDK is a simple way to include sezzle widget onto a merchant's website.
Think of it as a light version to our own Sezzle-js 
Every thing is packaged within the SDK i.e All the images, css is within the bundle.js file 

What makes this sdk interesting is that it has a different approach compared to our sezzle-js 
We open all our inbuilt functions as api's of the SDK now. 

## How to get the widget working 

One simply has to make place for the widget on his dom with a id -> sezzle-widget
Our SDK searches for this element in the DOM and adds our widget 
```
    <script>
        var renderSezzle = new AwesomeSezzle({
               amount:'$ 25',
               marginTop:-20
        })
        renderSezzle.init();
      </script>
 ```
We offer compatibility with all the options we had before 

1. amount - required options
2. numberOfPayments - optiional ; defaults at 4
3. minPrice - optiional ; defaults at 0 - in cents
4. maxPrice - optiional ; defaults at 250000 - in cents
5. altModalHTML - optional
6. apModalHTML - optional
7. qpModalHTML -optional
8. widgetTemplate  - optiional ; defaults at  'or ' + numberOfPayments + ' interest-free payments                                                 of %%price%% with %%logo%% %%info%%';
9. alignmentSwitchMinWidth - optiional ; defaults at 760;
10. alignmentSwitchType - optiional ; defaults at ''
11. alignment - optiional ; defaults at 'left'
12. fontWeight - optiional ; defaults at 300
13. fontSize - optiional ; defaults at 12 in pixels
14. fontFamily - optiional ; defaults at "inherit"
15. maxWidth - optiional ; defaults at 400
16. textColor - optiional ; defaults at '#111'
17. renderElement - optiional ; defaults at 'sezzle-widget'
18. apLink = - optiional ; defaults at 'https://www.afterpay.com/terms-of-service'
19. widgetType - optiional ; defaults at 'product-page'
20. bannerURL - optiional ; defaults at  ''
21. bannerClass - optiional ; defaults at ''
22. bannerLink - optiional ; defaults at ''
23. marginTop - optiional ; defaults at 0
24. marginBottom - optiional ; defaults at 0
25. marginLeft - optiional ; defaults at 0
26. marginRight - optiional ; defaults at 0
27. logoSize - optiional ; defaults at 1.0
28. fixedHeight - optiional ; defaults at 0
29. logoStyle - optiional ; defaults at {} - new feature 


We have also introduced functions like -> 
```
renderModalByfunction()
```
This invokes sezzle Modal by a function

