# Sezzle Banner

## Shopify

### Install as Asset

#### From CDN

1. Log in to your Shopify Admin
1. Go to `Online Store` > `Themes`
1. Next to the applicable theme, click `Actions` then `Edit Code`
1. Paste the following snippet into the `sections/header.liquid` file where the banner should appear, update the `merchantUUID` value, then click `Save`
 - Note: this is typically below the `header` or `sticky-header` closing tag. Open the file, then search (Cmd+F or Ctrl+F) for the word "sticky-header"

```
{{ "//checkout-sdk.sezzle.com/sezzle-home-banner.min.js" | script_tag }}
<div id="sezzle-banner-render-reference"></div>
<script>
new SezzleBanner({
    merchantUUID: "enter ID here",  <!-- Your ID(format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
    theme : "indigo",  <!-- Other options: "violet" and "black" -->
    renderToContainer : "#sezzle-banner-render-reference", <!-- This will use `querySelector` to render the banner, so use a unique ID or class -->
}).init();
</script>
```

#### Local File

1. Clone/pull down the Static-Widgets[https://github.com/sezzle/static-widgets/] project, then run `npm run build-banner`
1. Log in to your Shopify Admin
1. Go to `Online Store` > `Themes`
1. Next to the applicable theme, click `Actions` then `Edit Code`
1. Scroll to the Assets folder, then click `Add A New Asset`
1. Click `Create a Blank File`, name the section `sezzle-home-banner`, select `.js` as the file type, then click `Add Asset`
1. In the Assets folder, select the asset you just created (you may need to scroll, files are not in alphabetical order).
1. Overwrite the asset template with the code contents here[../../../build/sezzle-home-banner.js], then click `Save`.
1. Paste the following snippet into the `sections/header.liquid` file where the banner should appear, update the `merchantUUID` value, then click `Save`:
 - Note: this is typically below the `header` or `sticky-header` closing tag. Open the file, then search (Cmd+F or Ctrl+F) for the word "sticky-header"

```
{{ "sezzle-home-banner.js" | asset_url | script_tag }}
<div id="sezzle-banner-render-reference"></div>
<script>
new SezzleBanner({
    merchantUUID: "enter ID here",  <!-- Your ID(format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
    theme : "indigo",  <!-- Other options: "violet" and "black" -->
    renderToContainer : "#sezzle-banner-render-reference", <!-- This will use `querySelector` to render the banner, so use a unique ID or class -->
}).init();
</script>
```

### Install as HTML

1. Log in to your Shopify Admin
1. Go to `Online Store` > `Themes`
1. Next to the applicable theme, click `Actions` then `Edit Code`
1. Paste the code snippet here [https://github.com/sezzle/static-widgets/tree/production/src/sezzle-home-banner/sezzle-home-banner.html] into the sections/header.liquid` file where the banner should appear, then click `Save`
 - Note: this is typically below the `header` or `sticky-header` closing tag. Open the file, then search (Cmd+F or Ctrl+F) for the word "sticky-header"

#### CUSTOMIZATION

 - Update the wrapper element's class name to the theme color you desire (violet, indigo, or black)
 - Update the Learn More href URL to point to your own [How Sezzle Works](https://docs.sezzle.com/docs/guides/about-sezzle) page, if applicable

## Other Platforms

### From CDN

Paste the following where the banner should appear, such as below `</header>` and update the `merchantUUID` value

```
<script src="https://checkout-sdk.sezzle.com/sezzle-home-banner.min.js"></script>
<div id="sezzle-banner-render-reference"></div>
<script>
new SezzleBanner({
    merchantUUID: "enter ID here",  <!-- Your ID(format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
    theme : "indigo",  <!-- Other options: "violet" and "black" -->
    renderToContainer : "#sezzle-banner-render-reference", <!-- This will use `querySelector` to render the banner, so use a unique ID or class -->
}).init();
</script>
```

### Local File

Clone/pull down the Static-Widgets[https://github.com/sezzle/static-widgets/] project, then run `npm run build-banner`
Create a new .js file and populate it with the code contents from here[../../../build/sezzle-home-banner.js]
Paste the following where the banner should appear, such as below `</header>`, then update the file path and `merchantUUID` value

```
<script src="YOUR_FILE_PATH_HERE.js"></script>
<div id="sezzle-banner-render-reference"></div>
<script>
new SezzleBanner({
    merchantUUID: "enter ID here",  <!-- Your ID(format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
    theme : "indigo",  <!-- Other options: "violet" and "black" -->
    renderToContainer : "#sezzle-banner-render-reference", <!-- This will use `querySelector` to render the banner, so use a unique ID or class -->
}).init();
</script>
```

### Install as HTML

Paste the code snippet here [https://github.com/sezzle/static-widgets/tree/production/src/sezzle-home-banner/sezzle-home-banner.html] where the banner should appear, such as below `</header>`

#### CUSTOMIZATION

 - Update the wrapper element's class name to the theme color you desire (violet, indigo, or black)
 - Update the Learn More href URL to point to your own [How Sezzle Works](https://docs.sezzle.com/docs/guides/about-sezzle) page, if applicable