new SezzleBanner({
    theme : "indigo",  <!-- Other options: "violet" and "black" -->
    renderToContainer : ".your-class-name", <!-- This will use `querySelector` to render the banner, so use a unique ID or class -->
}).init();

## Shopify

### Install as Asset

Clone/pull down the Static-Widgets[https://github.com/sezzle/static-widgets/] project, then run npm run build-banner
Log in to your Shopify Admin
Go to Online Store > Themes
Next to the applicable theme, click Actions then Edit Code
Scroll to the Assets folder, then click Add A New Asset
Click Create a Blank File, name the section sezzle-home-banner, select .js as the file type, then click Add Asset
In the Assets folder, select the asset you just created (you may need to scroll, files are not in alphabetical order).
Overwrite the asset template with the code contents here[../../../build/sezzle-home-banner.js], then click Save.
Paste the following snippet in the bottom of the layout/theme.liquid file, update the config values, then click Save:

```
{{ "sezzle-home-banner.js" | asset_url | script_tag }}
<script>
new SezzleBanner({
    theme : "indigo",  <!-- Other options: "violet" and "black" -->
    renderToContainer : ".your-class-name", <!-- This will use `querySelector` to render the banner, so use a unique ID or class -->
}).init();
</script>
```

### Install as HTML

Log in to your Shopify Admin
Go to Online Store > Themes
Next to the applicable theme, click Actions then Edit Code
Paste the code snippet here [https://github.com/sezzle/static-widgets/tree/production/src/sezzle-home-banner/sezzle-home-banner.html] into the sections/header.liquid file where the banner should appear, then click Save
    Note: this is typically below the header or sticky-header closing tag. Open the file, then search (Cmd+F or Ctrl+F) for the word "sticky-header"
Click Save

#### CUSTOMIZATION

Update the wrapper element's class name to the theme color you desire (violet, indigo, or black)
Update the Learn More href URL to point to your own [How Sezzle Works](https://docs.sezzle.com/docs/guides/about-sezzle) page, if applicable