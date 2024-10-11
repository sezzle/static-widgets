import HelperClass from "./awesomeHelper";
import enTranslations from "./translations/en";
import frTranslations from "./translations/fr";
import esTranslations from "./translations/es";
import "../css/global.scss";

class AwesomeSezzle {
    constructor(options) {
        if (!options) {
            options = {};
            console.error("Config for widget is not supplied");
        }
        switch (typeof options.language) {
            case "string":
                this.language =
                    options.language === "spanish"
                        ? "es"
                        : options.language.substring(0, 2).toLowerCase();
                break;
            case "function":
                this.language = options
                    .language()
                    .substring(0, 2)
                    .toLowerCase();
                break;
            default:
                this.language = "en";
        }
        this.translationsMap = {
            en: enTranslations,
            fr: frTranslations,
            es: esTranslations,
        };
        this.language = this.translationsMap[this.language]
            ? this.language
            : "en";
        this.translations = this.translationsMap[this.language];
        this.numberOfPayments = 4;
        const templateString = this.translations.widget;
        const templateStringLT = this.translations.widgetLT;
        this.widgetTemplate =
            this.getWidgetTemplateOverride(options.widgetTemplate) ||
            templateString;
        this.widgetTemplateLT =
            this.getWidgetTemplateOverride(options.widgetTemplateLT) ||
            templateStringLT;
        this.ineligibleWidgetTemplate =
            this.getWidgetTemplateOverride(options.ineligibleWidgetTemplate) ||
            "";
        this.renderElementInitial = options.renderElement || "sezzle-widget";
        this.assignConfigs(options);
    }

    assignConfigs(options) {
        this.amount = options.amount || null;
        this.minPrice = options.minPrice || 0;
        this.maxPrice = options.maxPrice || 250000;
        this.minPriceLT = options.minPriceLT || 0;
        this.bestAPR = options.bestAPR || 0;
        this.altModalHTML = options.altLightboxHTML || "";
        this.ltAltModalHTML = options.ltAltModalHTML || "";
        this.apModalHTML = options.apModalHTML || "";
        this.qpModalHTML = options.qpModalHTML || "";
        this.modalTheme = options.modalTheme || "color";
        this.affirmModalHTML = options.affirmModalHTML || "";
        this.klarnaModalHTML = options.klarnaModalHTML || "";
        this.alignmentSwitchMinWidth = options.alignmentSwitchMinWidth || 760;
        this.alignmentSwitchType = options.alignmentSwitchType || "";
        this.alignment = options.alignment || "left";
        this.fontWeight = options.fontWeight || 300;
        this.fontSize = options.fontSize || 12;
        this.fontFamily = options.fontFamily || "inherit";
        this.maxWidth = options.maxWidth || 400;
        this.textColor = options.textColor || "#111";
        this.renderElementArray =
            typeof this.renderElementInitial === "string"
                ? [this.renderElementInitial]
                : this.renderElementInitial;
        this.renderElement = this.renderElementInitial;
        this.apLink =
            options.apLink ||
            "https://www.afterpay.com/purchase-payment-agreement";
        this.widgetType = options.widgetType || "product-page";
        this.bannerURL = options.bannerURL || "";
        this.bannerClass = options.bannerClass || "";
        this.bannerLink = options.bannerLink || "";
        this.marginTop = options.marginTop || 0;
        this.marginBottom = options.marginBottom || 0;
        this.marginLeft = options.marginLeft || 0;
        this.marginRight = options.marginRight || 0;
        this.logoSize = options.logoSize || 1.0;
        this.scaleFactor = options.scaleFactor || 1.0;
        this.fixedHeight = options.fixedHeight || 0;
        this.logoStyle = options.logoStyle || {};
        this.theme = options.theme || "light";
        this.parseMode = options.parseMode || "default";
        this.widgetTemplate = this.widgetTemplate;
        this.widgetTemplateLT = this.widgetTemplateLT;
        this.ineligibleWidgetTemplate =
            this.ineligibleWidgetTemplate.replace("%%price%%", "") || "";
    }

    getWidgetTemplateOverride(widgetTemplate) {
        if (widgetTemplate !== null && typeof widgetTemplate == "object") {
            return widgetTemplate[this.language] || widgetTemplate.en;
        }
        return widgetTemplate;
    }

    addCSSAlignment() {
        let newAlignment = "";
        if (
            matchMedia &&
            this.alignmentSwitchMinWidth &&
            this.alignmentSwitchType
        ) {
            const queryString = `(min-width: ${this.alignmentSwitchMinWidth}px)`;
            const mq = window.matchMedia(queryString);
            if (!mq.matches) {
                newAlignment = this.alignmentSwitchType;
            }
        }
        switch (newAlignment || this.alignment) {
            case "left":
                this.renderElement.children[0].children[0].classList.add(
                    "sezzle-left"
                );
                break;
            case "right":
                this.renderElement.children[0].children[0].classList.add(
                    "sezzle-right"
                );
                break;
            case "center":
                this.renderElement.children[0].children[0].classList.add(
                    "sezzle-center"
                );
            default:
                break;
        }
    }

    addCSSFontStyle() {
        if (this.fontWeight) {
            this.renderElement.children[0].children[0].style.fontWeight =
                this.fontWeight;
        }
        if (this.fontFamily) {
            this.renderElement.children[0].children[0].style.fontFamily =
                this.fontFamily;
        }
        if (this.fontSize != "inherit") {
            this.renderElement.children[0].children[0].style.fontSize = `${this.fontSize}px`;
        }
    }

    addCSSWidth() {
        if (this.maxWidth) {
            this.renderElement.children[0].children[0].style.maxWidth = `${this.maxWidth}px`;
        }
    }

    addCSSTextColor() {
        if (this.textColor) {
            this.renderElement.children[0].children[0].style.color =
                this.textColor;
        }
    }

    addCSSTheme() {
        switch (this.theme) {
            case "dark":
            case "white":
            case "white-flat":
            case "white-pill":
                this.renderElement.children[0].children[0].classList.add(
                    "szl-dark"
                );
                break;
            default:
                this.renderElement.children[0].children[0].classList.add(
                    "szl-light"
                );
                break;
        }
    }

    setImageURL() {
        switch (this.theme) {
            case "dark":
                this.imageClassName = "szl-dark-image";
                this.imageInnerHTML = HelperClass.svgImages().sezzleDark;
                break;
            case "grayscale":
                this.imageClassName = "szl-light-image";
                this.imageInnerHTML = HelperClass.svgImages().sezzleGrey;
                break;
            case "black-flat":
                this.imageClassName = "szl-light-image";
                this.imageInnerHTML = HelperClass.svgImages().sezzleBlack;
                break;
            case "white":
                this.imageClassName = "szl-dark-image";
                this.imageInnerHTML = HelperClass.svgImages().sezzleWhite;
                break;
            case "white-flat":
                this.imageClassName = "szl-dark-image";
                this.imageInnerHTML = HelperClass.svgImages().sezzleWhiteAlt;
                break;
            case "purple-pill":
                this.imageClassName = "szl-light-image";
                this.imageInnerHTML = HelperClass.svgImages().sezzlePurplePill;
                break;
            case "white-pill":
                this.imageClassName = "szl-dark-image";
                this.imageInnerHTML = HelperClass.svgImages().sezzleWhitePill;
                break;
            default:
                this.imageClassName = "szl-light-image";
                this.imageInnerHTML = HelperClass.svgImages().sezzleLight;
                break;
        }
    }

    addCSSCustomisation() {
        this.addCSSAlignment();
        this.addCSSFontStyle();
        this.addCSSTextColor();
        this.addCSSTheme();
        this.addCSSWidth();
    }

    insertWidgetTypeCSSClassInElement() {
        switch (this.widgetType) {
            case "cart":
                this.renderElement.classList.add("sezzle-cart-page-widget");
                break;
            case "product-preview":
                this.renderElement.classList.add(
                    "sezzle-product-preview-widget"
                );
                break;
            default:
                this.renderElement.classList.add("sezzle-product-page-widget");
                break;
        }
    }

    setElementMargins() {
        this.renderElement.style.marginTop = `${this.marginTop}px`;
        this.renderElement.style.marginBottom = `${this.marginBottom}px`;
        this.renderElement.style.marginLeft = `${this.marginLeft}px`;
        this.renderElement.style.marginRight = `${this.marginRight}px`;
    }

    setWidgetSize() {
        if (this.scaleFactor) {
            this.renderElement.style.transformOrigin = `top ${this.alignment}`;
            this.renderElement.style.transform = `scale(${this.scaleFactor})`;
        }
        if (this.fixedHeight) {
            this.renderElement.style.height = `${this.fixedHeight}px`;
            this.renderElement.style.overflow = "hidden";
        }
    }

    alterPrice(amt) {
        this.eraseWidget();
        this.assignConfigs(this);
        this.amount = amt;
        this.init();
    }

    updateWidgetTemplate(template) {
        this.eraseWidget();
        this.assignConfigs(this);
        this.widgetTemplate = template;
        this.init();
    }

    eraseWidget() {
        this.renderElementArray.forEach(function (element, index) {
            let sezzleElement = document.getElementById(element);
            if (sezzleElement) {
                let checkoutButtonWrapper = sezzleElement.querySelector(
                    ".sezzle-checkout-button-wrapper"
                );
                if (checkoutButtonWrapper) {
                    checkoutButtonWrapper.remove();
                }
            }
        });
        let modals = document.querySelectorAll(
            ".sezzle-checkout-modal-lightbox"
        );
        modals.forEach((modal)=>{
            modal.remove();
        })
    }

    setLogoSize(element) {
        element.style.transformOrigin = `top ${this.alignment}`;
        element.style.transform = `scale(${this.logoSize})`;
    }

    setLogoStyle(element) {
        const newStyles = Object.keys(this.logoStyle);
        for (let i = 0; i < newStyles.length; i++) {
            element.style[newStyles[i]] = this.logoStyle[newStyles[i]];
        }
    }

    renderAwesomeSezzle() {
        if (
            !this.isProductEligible(this.amount) &&
            this.ineligibleWidgetTemplate.length === 0
        ) {
            return false;
        }

        let widgetText = "";
        if (!this.isProductEligible(this.amount)) {
            widgetText = this.ineligibleWidgetTemplate;
        } else if (this.isProductEligibleLT(this.amount)) {
            widgetText = this.widgetTemplateLT;
        } else {
            widgetText = this.widgetTemplate;
        }

        this.insertWidgetTypeCSSClassInElement();
        this.setElementMargins();
        if (this.scaleFactor || this.fixedHeight) this.setWidgetSize();
        const node = document.createElement("button");
        node.ariaHasPopup = "dialog";
        node.className = "sezzle-checkout-button-wrapper sezzle-modal-link";
        const sezzleButtonText = document.createElement("div");
        sezzleButtonText.className = "sezzle-button-text";
        this.setImageURL();
        const widgetTextArray = widgetText.split("%%");
        widgetTextArray.forEach(
            function (subtemplate) {
                switch (subtemplate) {
                    case "price":
                        const priceSpanNode = document.createElement("span");
                        priceSpanNode.className =
                            "sezzle-payment-amount sezzle-button-text";
                        const priceValueText = document.createTextNode(
                            this.getFormattedPrice()
                        );
                        priceSpanNode.appendChild(priceValueText);
                        sezzleButtonText.appendChild(priceSpanNode);
                        break;
                    case "logo":
                        const logoNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        logoNode.setAttribute("width", "798.16");
                        logoNode.setAttribute("height", "199.56");
                        logoNode.setAttribute("viewBox", "0 0 798.16 199.56");
                        logoNode.setAttribute(
                            "class",
                            `sezzle-logo ${this.imageClassName}`
                        );
                        logoNode.setAttribute("aria-label", "Sezzle");
                        logoNode.style.height = "18px !important";
                        logoNode.innerHTML = this.imageInnerHTML;
                        sezzleButtonText.appendChild(logoNode);
                        if (this.logoStyle != {}) this.setLogoStyle(logoNode);
                        this.setLogoSize(logoNode);
                        if (
                            this.theme === "purple-pill" ||
                            this.theme == "white-pill"
                        ) {
                            logoNode.style.transform = "scale(12)";
                        }
                        break;
                    case "link":
                        const learnMoreNode = document.createElement("div");
                        learnMoreNode.style.color = this.textColor;
                        learnMoreNode.ariaLabel = `${this.translations.learnMoreAlt} Sezzle`;
                        learnMoreNode.className =
                            "sezzle-learn-more sezzle-modal-open-link";
                        const learnMoreText = document.createTextNode(
                            this.translations.learnMoreLink
                        );
                        learnMoreNode.appendChild(learnMoreText);
                        sezzleButtonText.appendChild(learnMoreNode);
                        break;
                    case "info":
                        const infoIconNode = document.createElement("div");
                        infoIconNode.ariaLabel = `${this.translations.learnMoreAlt} Sezzle`;
                        infoIconNode.className =
                            "sezzle-info-icon sezzle-modal-open-link";
                        infoIconNode.innerHTML = "&#9432;";
                        sezzleButtonText.appendChild(infoIconNode);
                        break;
                    case "question-mark":
                        const questionMarkButton =
                            document.createElement("button");
                        questionMarkButton.role = "button";
                        questionMarkButton.type = "button";
                        questionMarkButton.ariaLabel = `${this.translations.learnMoreLink} Sezzle`;
                        const questionMarkIconNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        questionMarkIconNode.setAttribute("width", "14");
                        questionMarkIconNode.setAttribute("height", "14");
                        questionMarkIconNode.setAttribute(
                            "viewBox",
                            "0 0 369 371"
                        );
                        questionMarkButton.setAttribute(
                            "class",
                            "sezzle-question-mark-icon sezzle-modal-open-link"
                        );
                        questionMarkIconNode.innerHTML =
                            HelperClass.svgImages().questionMarkIcon;
                        questionMarkButton.appendChild(questionMarkIconNode);
                        sezzleButtonText.appendChild(questionMarkButton);
                        break;
                    case "afterpay-logo":
                        var apNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        apNode.setAttribute("width", "115");
                        apNode.setAttribute("height", "40");
                        apNode.setAttribute("viewBox", "0 0 115 40");
                        apNode.setAttribute(
                            "class",
                            `sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`
                        );
                        apNode.setAttribute(
                            "style",
                            `height: 24px !important;width: auto !important;margin-bottom: -8px;`
                        );
                        apNode.setAttribute("aria-label", "Afterpay");
                        apNode.innerHTML = HelperClass.svgImages().apNodeColor;
                        sezzleButtonText.appendChild(apNode);
                        this.setLogoSize(apNode);
                        break;
                    case "afterpay-logo-grey":
                        var apNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        apNode.setAttribute("width", "115");
                        apNode.setAttribute("height", "40");
                        apNode.setAttribute("viewBox", "0 0 115 40");
                        apNode.setAttribute(
                            "class",
                            `sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`
                        );
                        apNode.setAttribute(
                            "style",
                            `height: 32px !important;width: auto !important;margin: -10px !important;`
                        );
                        apNode.setAttribute("aria-label", "Afterpay");
                        apNode.innerHTML = HelperClass.svgImages().apNodeGrey;
                        sezzleButtonText.appendChild(apNode);
                        this.setLogoSize(apNode);
                        break;
                    case "afterpay-logo-white":
                        var apNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        apNode.setAttribute("width", "115");
                        apNode.setAttribute("height", "40");
                        apNode.setAttribute("viewBox", "0 0 115 40");
                        apNode.setAttribute(
                            "class",
                            `sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`
                        );
                        apNode.setAttribute(
                            "style",
                            `height: 32px !important;width: auto !important;margin: -10px !important`
                        );
                        apNode.setAttribute("aria-label", "Afterpay");
                        apNode.innerHTML = HelperClass.svgImages().apNodeWhite;
                        sezzleButtonText.appendChild(apNode);
                        this.setLogoSize(apNode);
                        break;
                    case "afterpay-info-icon":
                        const apInfoIconNode = document.createElement("button");
                        apInfoIconNode.role = "button";
                        apInfoIconNode.type = "button";
                        apInfoIconNode.ariaLabel = `${this.translations.learnMoreAlt} Afterpay`;
                        apInfoIconNode.className =
                            "ap-modal-info-link no-sezzle-info";
                        apInfoIconNode.innerHTML = "&#9432;";
                        sezzleButtonText.appendChild(apInfoIconNode);
                        break;
                    case "afterpay-link-icon":
                        const apAnchor = document.createElement("a");
                        apAnchor.href = this.apLink;
                        apAnchor.target = "_blank";
                        const apLinkIconNode = document.createElement("code");
                        apLinkIconNode.ariaLabel = `${this.translations.learnMoreAlt} Afterpay`;
                        apLinkIconNode.className = "ap-info-link";
                        apLinkIconNode.innerHTML = "&#9432;";
                        apAnchor.appendChild(apLinkIconNode);
                        sezzleButtonText.appendChild(apAnchor);
                        break;
                    case "quadpay-logo":
                        var qpNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        qpNode.setAttribute("width", "498");
                        qpNode.setAttribute("height", "135");
                        qpNode.setAttribute("viewBox", "0 0 498 135");
                        qpNode.setAttribute(
                            "class",
                            `sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`
                        );
                        qpNode.setAttribute(
                            "style",
                            `height: 22px !important;width: auto !important;margin-bottom: -5px;`
                        );
                        qpNode.setAttribute("aria-label", "Quadpay");
                        qpNode.innerHTML = HelperClass.svgImages().qpNodeColor;
                        sezzleButtonText.appendChild(qpNode);
                        this.setLogoSize(qpNode);
                        break;
                    case "quadpay-logo-grey":
                        var qpNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        qpNode.setAttribute("width", "498");
                        qpNode.setAttribute("height", "135");
                        qpNode.setAttribute("viewBox", "0 0 498 135");
                        qpNode.setAttribute(
                            "class",
                            `sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`
                        );
                        qpNode.setAttribute(
                            "style",
                            `height: 22px !important;width: auto !important;margin-bottom: -5px;`
                        );
                        qpNode.setAttribute("aria-label", "Quadpay");
                        qpNode.innerHTML = HelperClass.svgImages().qpNodeGrey;
                        sezzleButtonText.appendChild(qpNode);
                        this.setLogoSize(qpNode);
                        break;
                    case "quadpay-logo-white":
                        var qpNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        qpNode.setAttribute("width", "498");
                        qpNode.setAttribute("height", "135");
                        qpNode.setAttribute("viewBox", "0 0 498 135");
                        qpNode.setAttribute(
                            "class",
                            `sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`
                        );
                        qpNode.setAttribute(
                            "style",
                            `height: 22px !important;width: auto !important;margin-bottom: -5px;`
                        );
                        qpNode.setAttribute("aria-label", "Quadpay");
                        qpNode.innerHTML = HelperClass.svgImages().qpNodeWhite;
                        sezzleButtonText.appendChild(qpNode);
                        this.setLogoSize(qpNode);
                        break;
                    case "quadpay-info-icon":
                        const quadpayInfoIconNode =
                            document.createElement("button");
                        quadpayInfoIconNode.role = "button";
                        quadpayInfoIconNode.type = "button";
                        quadpayInfoIconNode.ariaLabel = `${this.translations.learnMoreAlt} Quadpay`;
                        quadpayInfoIconNode.className =
                            "quadpay-modal-info-link no-sezzle-info";
                        quadpayInfoIconNode.innerHTML = "&#9432;";
                        sezzleButtonText.appendChild(quadpayInfoIconNode);
                        break;
                    case "affirm-logo":
                        var affirmNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        affirmNode.setAttribute("width", "450");
                        affirmNode.setAttribute("height", "170");
                        affirmNode.setAttribute("viewBox", "0 0 450 170");
                        affirmNode.setAttribute(
                            "class",
                            `sezzle-affirm-logo affirm-modal-info-link no-sezzle-info`
                        );
                        affirmNode.setAttribute(
                            "style",
                            `height: 24px !important;width: auto !important;`
                        );
                        affirmNode.setAttribute("aria-label", "Affirm");
                        affirmNode.innerHTML =
                            HelperClass.svgImages().affirmNodeColor;
                        sezzleButtonText.appendChild(affirmNode);
                        this.setLogoSize(affirmNode);
                        break;
                    case "affirm-logo-grey":
                        var affirmNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        affirmNode.setAttribute("width", "450");
                        affirmNode.setAttribute("height", "170");
                        affirmNode.setAttribute("viewBox", "0 0 450 170");
                        affirmNode.setAttribute(
                            "class",
                            `sezzle-affirm-logo affirm-modal-info-link no-sezzle-info`
                        );
                        affirmNode.setAttribute(
                            "style",
                            `height: 24px !important;width: auto !important;`
                        );
                        affirmNode.setAttribute("aria-label", "Affirm");
                        affirmNode.innerHTML =
                            HelperClass.svgImages().affirmNodeGrey;
                        sezzleButtonText.appendChild(affirmNode);
                        this.setLogoSize(affirmNode);
                        break;
                    case "affirm-logo-white":
                        var affirmNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        affirmNode.setAttribute("width", "450");
                        affirmNode.setAttribute("height", "170");
                        affirmNode.setAttribute("viewBox", "0 0 450 170");
                        affirmNode.setAttribute(
                            "class",
                            `sezzle-affirm-logo affirm-modal-info-link no-sezzle-info`
                        );
                        affirmNode.setAttribute(
                            "style",
                            `height: 24px !important;width: auto !important;`
                        );
                        affirmNode.setAttribute("aria-label", "Affirm");
                        affirmNode.innerHTML =
                            HelperClass.svgImages().affirmNodeWhite;
                        sezzleButtonText.appendChild(affirmNode);
                        this.setLogoSize(affirmNode);
                        break;
                    case "affirm-info-icon":
                        const affirmInfoIconNode =
                            document.createElement("button");
                        affirmInfoIconNode.role = "button";
                        affirmInfoIconNode.type = "button";
                        affirmInfoIconNode.ariaLabel = `${this.translations.learnMoreAlt} Affirm`;
                        affirmInfoIconNode.className =
                            "affirm-modal-info-link no-sezzle-info";
                        affirmInfoIconNode.innerHTML = "&#9432;";
                        sezzleButtonText.appendChild(affirmInfoIconNode);
                        break;
                    case "klarna-logo":
                        var klarnaNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        klarnaNode.setAttribute("width", "45");
                        klarnaNode.setAttribute("height", "25");
                        klarnaNode.setAttribute("viewBox", "0 0 45 23");
                        klarnaNode.setAttribute(
                            "class",
                            `sezzle-klarna-logo klarna-modal-info-link no-sezzle-info`
                        );
                        klarnaNode.setAttribute(
                            "style",
                            `height: 25px !important;width: auto !important; margin-bottom: -5px;`
                        );
                        klarnaNode.setAttribute("aria-label", "Klarna");
                        klarnaNode.innerHTML =
                            HelperClass.svgImages().klarnaNodeColor;
                        sezzleButtonText.appendChild(klarnaNode);
                        this.setLogoSize(klarnaNode);
                        break;
                    case "klarna-logo-grey":
                        var klarnaNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        klarnaNode.setAttribute("width", "45");
                        klarnaNode.setAttribute("height", "25");
                        klarnaNode.setAttribute("viewBox", "0 0 45 23");
                        klarnaNode.setAttribute(
                            "class",
                            `sezzle-klarna-logo klarna-modal-info-link no-sezzle-info`
                        );
                        klarnaNode.setAttribute(
                            "style",
                            `height: 25px !important;width: auto !important; margin-bottom: -5px;`
                        );
                        klarnaNode.setAttribute("aria-label", "Klarna");
                        klarnaNode.innerHTML =
                            HelperClass.svgImages().klarnaNodeGrey;
                        sezzleButtonText.appendChild(klarnaNode);
                        this.setLogoSize(klarnaNode);
                        break;
                    case "klarna-logo-white":
                        var klarnaNode = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );
                        klarnaNode.setAttribute("width", "45");
                        klarnaNode.setAttribute("height", "25");
                        klarnaNode.setAttribute("viewBox", "0 0 45 23");
                        klarnaNode.setAttribute(
                            "class",
                            `sezzle-klarna-logo klarna-modal-info-link no-sezzle-info`
                        );
                        klarnaNode.setAttribute(
                            "style",
                            `height: 25px !important;width: auto !important; margin-bottom: -5px;`
                        );
                        klarnaNode.setAttribute("aria-label", "Klarna");
                        klarnaNode.innerHTML =
                            HelperClass.svgImages().klarnaNodeWhite;
                        sezzleButtonText.appendChild(klarnaNode);
                        this.setLogoSize(klarnaNode);
                        break;
                    case "klarna-info-icon":
                        const klarnaInfoIconNode =
                            document.createElement("button");
                        klarnaInfoIconNode.role = "button";
                        klarnaInfoIconNode.type = "button";
                        klarnaInfoIconNode.ariaLabel = `${this.translations.learnMoreAlt} Klarna`;
                        klarnaInfoIconNode.className =
                            "klarna-modal-info-link no-sezzle-info";
                        klarnaInfoIconNode.innerHTML = "&#9432;";
                        sezzleButtonText.appendChild(klarnaInfoIconNode);
                        break;
                    case "line-break":
                        const lineBreakNode = document.createElement("br");
                        sezzleButtonText.appendChild(lineBreakNode);
                        break;
                    case "&eacute;":
                        const eacute = document.createElement("span");
                        eacute.innerHTML = "&#233;";
                        sezzleButtonText.appendChild(eacute);
                        break;
                    case "&ecirc;":
                        const ecirc = document.createElement("span");
                        ecirc.innerHTML = "&#234;";
                        sezzleButtonText.appendChild(ecirc);
                        break;
                    case "&auml;":
                        const auml = document.createElement("span");
                        auml.innerHTML = "&#228;";
                        sezzleButtonText.appendChild(auml);
                        break;
                    case "&uuml;":
                        const uuml = document.createElement("span");
                        uuml.innerHTML = "&#252;";
                        sezzleButtonText.appendChild(uuml);
                        break;
                    default:
                        const widgetTextNode =
                            document.createTextNode(subtemplate);
                        sezzleButtonText.appendChild(widgetTextNode);
                        break;
                }
            }.bind(this)
        );
        node.appendChild(sezzleButtonText);
        this.renderElement.appendChild(node);
        this.addCSSAlignment();
        this.addCSSCustomisation();
    }

    getElementToRender() {
        return this.renderElement;
    }

    isProductEligible(priceText) {
        let price =
            this.parseMode === "default"
                ? HelperClass.parsePrice(priceText)
                : HelperClass.parsePrice(priceText, this.parseMode);
        this.productPrice = price;
        let priceInCents = price * 100;
        return priceInCents >= this.minPrice && priceInCents <= this.maxPrice;
    }

    isProductEligibleLT(priceText) {
        let price =
            this.parseMode === "default"
                ? HelperClass.parsePrice(priceText)
                : HelperClass.parsePrice(priceText, this.parseMode);
        this.productPrice = price;
        let priceInCents = price * 100;
        return (
            this.minPriceLT &&
            priceInCents >= this.minPriceLT &&
            priceInCents <= this.maxPrice
        );
    }

    getFormattedPrice(amount = this.amount) {
        const priceText = amount;
        const priceString = HelperClass.parsePriceString(priceText, true);
        const price =
            this.parseMode === "default"
                ? HelperClass.parsePrice(priceText)
                : HelperClass.parsePrice(priceText, this.parseMode);
        const formatter = priceText.replace(priceString, "{price}");
        const terms = this.termsToShow(price);
        const sezzleInstallmentPrice = this.isProductEligibleLT(amount)
            ? this.calculateMonthlyWithInterest(
                  price.toString(),
                  terms[terms.length - 1],
                  this.bestAPR
              )
            : price / this.numberOfPayments;
        const sezzleInstallmentFormattedPrice = formatter.replace(
            "{price}",
            this.addDelimiters(sezzleInstallmentPrice, this.parseMode)
        );
        return sezzleInstallmentFormattedPrice;
    }

    addDelimiters(priceString, parseMode) {
        const parsedPrice = Number(priceString).toFixed(2);
        if (parsedPrice.length > 6 && parseMode === "comma") {
            const commaPrice = parsedPrice.replace(".", ",");
            return (
                commaPrice.substring(0, commaPrice.indexOf(",") - 3) +
                "." +
                commaPrice.substring(
                    commaPrice.indexOf(",") - 3,
                    commaPrice.length
                )
            );
        } else if (parsedPrice.length > 6) {
            return (
                parsedPrice.substring(0, parsedPrice.indexOf(".") - 3) +
                "," +
                parsedPrice.substring(
                    parsedPrice.indexOf(".") - 3,
                    parsedPrice.length
                )
            );
        } else {
            return parsedPrice;
        }
    }

    termsToShow(price) {
        switch (true) {
            case price > 1000:
                return [24, 36, 48];
            case price > 500:
                return [6, 12, 24];
            case price > 250:
                return [3, 6, 12];
            default:
                return [3, 6];
        }
    }

    currencySymbol(priceText) {
        let currency = 0;
        for (let i = 0; i < priceText.length; i++) {
            if (
                priceText.charCodeAt(i) === 8364 ||
                priceText.charCodeAt(i) === 128 ||
                priceText.charCodeAt(i) === 8356 ||
                priceText.charCodeAt(i) === 163
            ) {
                currency = priceText.charCodeAt(i);
            }
        }
        return currency || 36;
    }

    calculateMonthlyWithInterest(priceText, term, APR) {
        const price = Number(priceText);
        if (APR > 0) {
            const rate = APR / 100 / 12;
            const numerator = price * rate * Math.pow(1 + rate, term);
            const denominator = Math.pow(1 + rate, term) - 1;
            const interestPayment = numerator / denominator;
            return interestPayment;
        } else {
            return price / term;
        }
    }
    formatMonthly(priceString, parseMode, term, APR) {
        const interestAmount = this.calculateMonthlyWithInterest(
            priceString,
            term,
            APR
        );
        return this.addDelimiters(interestAmount.toFixed(2), parseMode);
    }
    formatTotalInterest(priceString, parseMode, term, APR) {
        const adjustedTotal =
            this.calculateMonthlyWithInterest(priceString, term, APR) * term;
        return this.addDelimiters(adjustedTotal - priceString, parseMode);
    }
    formatAdjustedTotal(priceString, parseMode, term, APR) {
        const amountPlusInterest = this.calculateMonthlyWithInterest(
            priceString,
            term,
            APR
        );
        return this.addDelimiters(amountPlusInterest * term, parseMode);
    }

    modalKeyboardNavigation() {
        let focusableElements = document.querySelector(
            ".sezzle-modal-content"
        ).childNodes;
        let firstFocusableElement = focusableElements[0];
        let lastFocusableElement =
            focusableElements[focusableElements.length - 1];
        document.addEventListener("keydown", function (event) {
            if (
                event.key === "ArrowDown" &&
                document.activeElement === lastFocusableElement
            ) {
                firstFocusableElement.focus();
            } else if (
                event.key === "ArrowUp" &&
                document.activeElement === firstFocusableElement
            ) {
                lastFocusableElement.focus();
            } else if (event.key === "Escape") {
                let modals = document.getElementsByClassName(
                    "sezzle-checkout-modal-lightbox"
                );
                for (let i = 0; i < modals.length; i++) {
                    modals[i].style.display = "none";
                }
                let newFocus = document.querySelector("#sezzle-modal-return");
                if (newFocus) {
                    newFocus.focus();
                    newFocus.removeAttribute("id");
                } else if (
                    document
                        .querySelector(".sezzle-checkout-button-wrapper")
                        .querySelector(".sezzle-info-icon")
                ) {
                    document
                        .querySelector(".sezzle-checkout-button-wrapper")
                        .querySelector(".sezzle-info-icon")
                        .focus();
                } else {
                    document
                        .querySelector(".sezzle-checkout-button-wrapper")
                        .focus();
                }
            }
        });
    }

    renderModal() {
        if (
            !document.getElementsByClassName("sezzle-checkout-modal-lightbox")
                .length
        ) {
            var modalNode = document.createElement("section");
            modalNode.className =
                "sezzle-checkout-modal-lightbox close-sezzle-modal";
            modalNode.style.display = "none";
            modalNode.role = "dialog";
            modalNode.lang = this.language;
            modalNode.ariaLabel = this.translations.sezzleInfo;
            modalNode.ariaDescription = this.translations.aboutSezzle;
            if (this.isProductEligibleLT(this.amount)) {
                let currency = String.fromCharCode(
                    this.currencySymbol(this.amount)
                );
                let priceString =
                    this.amount.indexOf(currency) > -1
                        ? this.amount.split(currency)[1]
                        : this.amount;
                priceString =
                    this.parseMode === "comma"
                        ? priceString.replace(".", "").replace(",", ".")
                        : priceString.replace(",", "");
                let terms = this.termsToShow(priceString);
                if (this.ltAltModalHTML) {
                    modalNode.innerHTML = this.ltAltModalHTML;
                } else {
                    modalNode.innerHTML = `
				<div id="sezzle-modal-container" role="dialog" aria-label="Sezzle Modal" aria-description="${
                    this.translations.aboutSezzle
                }" class="sezzle-checkout-modal-hidden long-term">
					<div class="sezzle-modal">
						<div>
							<button role="button" aria-label="${
                                this.translations.closeSezzleModal
                            }" class="close-sezzle-modal"></button>
						</div>
						<div class="sezzle-logo" title="Sezzle"> </div>
						<div id="sezzle-modal-core-content" class="sezzle-modal-content">

							<header class="sezzle-header">${this.translations.sezzleHeaderLt}</header>
							<div class="sezzle-row">${this.translations.sezzleRowLtChild}</div>
							<div class="sezzle-lt-payments">
								<div class="sezzle-lt-payment-header">${
                                    this.translations.sezzleLtPaymentHeader
                                } <span>${
                        currency +
                        this.addDelimiters(priceString, this.parseMode)
                    }</span></div>
								<div class="sezzle-lt-payment-options ${terms[2]}-month" ${
                        terms[2] === undefined
                            ? `style="display: none;"`
                            : `style="display: block;"`
                    }>
									<div class="plan">
									<div class="monthly-amount">
										<span>${
                                            currency +
                                            this.formatMonthly(
                                                priceString,
                                                this.parseMode,
                                                terms[2],
                                                this.bestAPR
                                            )
                                        }</span>
										<span aria-label="${
                                            this.translations.perMonth
                                        }"><span class="per-month" aria-hidden="true">${
                        this.translations.monthlyAmount
                    }<sup>*</sup></span></span>
									</div>
									<div class="term-length">${terms[2]} ${this.translations.termLength}</div>
								</div>
									<div class="plan-details">
										<div class="adjusted-total">${this.translations.adjustedTotal} <span>${
                        currency +
                        this.formatAdjustedTotal(
                            priceString,
                            this.parseMode,
                            terms[2],
                            this.bestAPR
                        )
                    }</span></div>
										<div class="interest-amount">${this.translations.interest} <span>${
                        currency +
                        this.formatTotalInterest(
                            priceString,
                            this.parseMode,
                            terms[2],
                            this.bestAPR
                        )
                    }</span></div>
										<div class="sample-apr">
											<span aria-label="${this.translations.readApr} ${this.bestAPR} ${
                        this.translations.percent
                    }">
											<span aria-hidden="true">${
                                                this.translationsMap[
                                                    this.language
                                                ].sampleApr
                                            }</span><span aria-hidden="true">${
                        this.bestAPR
                    }%</span></span>
										</div>
									</div>
								</div>
								<div class="sezzle-lt-payment-options ${terms[1]}-month">
									<div class="plan">
										<div class="monthly-amount">
											<span>${
                                                currency +
                                                this.formatMonthly(
                                                    priceString,
                                                    this.parseMode,
                                                    terms[1],
                                                    this.bestAPR
                                                )
                                            }</span>
											<span aria-label="${
                                                this.translationsMap[
                                                    this.language
                                                ].perMonth
                                            }"><span class="per-month" aria-hidden="true">${
                        this.translations.monthlyAmount
                    }<sup>*</sup></span></span>
										</div>
										<div class="term-length">${terms[1]} ${this.translations.termLength}</div>
									</div>
									<div class="plan-details">
										<div class="adjusted-total">${this.translations.adjustedTotal} <span>${
                        currency +
                        this.formatAdjustedTotal(
                            priceString,
                            this.parseMode,
                            terms[1],
                            this.bestAPR
                        )
                    }</span></div>
										<div class="interest-amount">${this.translations.interest} <span>${
                        currency +
                        this.formatTotalInterest(
                            priceString,
                            this.parseMode,
                            terms[1],
                            this.bestAPR
                        )
                    }</span></div>
										<div class="sample-apr">
											<span aria-label="${this.translations.readApr} ${this.bestAPR} ${
                        this.translations.percent
                    }">
											<span aria-hidden="true">${
                                                this.translationsMap[
                                                    this.language
                                                ].sampleApr
                                            }</span><span aria-hidden="true">${
                        this.bestAPR
                    }%</span></span>
										</div>
									</div>
								</div>
								<div class="sezzle-lt-payment-options ${terms[0]}-month">
									<div class="plan">
										<div class="monthly-amount">
											<span>${
                                                currency +
                                                this.formatMonthly(
                                                    priceString,
                                                    this.parseMode,
                                                    terms[0],
                                                    this.bestAPR
                                                )
                                            }</span>
											<span aria-label="${
                                                this.translationsMap[
                                                    this.language
                                                ].perMonth
                                            }"><span class="per-month" aria-hidden="true">${
                        this.translations.monthlyAmount
                    }<sup>*</sup></span></span>
										</div>
										<div class="term-length">${terms[0]} ${this.translations.termLength}</div>
									</div>
									<div class="plan-details">
										<div class="adjusted-total">${this.translations.adjustedTotal} <span>${
                        currency +
                        this.formatAdjustedTotal(
                            priceString,
                            this.parseMode,
                            terms[0],
                            this.bestAPR
                        )
                    }</span></div>
										<div class="interest-amount">${this.translations.interest} <span>${
                        currency +
                        this.formatTotalInterest(
                            priceString,
                            this.parseMode,
                            terms[0],
                            this.bestAPR
                        )
                    }</span></div>
										<div class="sample-apr">
											<span aria-label="${this.translations.readApr} ${this.bestAPR} ${
                        this.translations.percent
                    }">
											<span aria-hidden="true">${
                                                this.translationsMap[
                                                    this.language
                                                ].sampleApr
                                            }</span><span aria-hidden="true">${
                        this.bestAPR
                    }%</span></span>
										</div>
									</div>
								</div>
							</div>
							<div class="details">${this.translations.singleFeatureAffordable}</div>
							<div class="details">${this.translations.singleFeaturePrequalify}</div>
							<div class="details">${this.translations.singleFeatureTrusted}</div>
							<div class="terms">
								<p>${this.translations.termsLt1}</p>
								<p>${this.translations.termsLt2}</p>
								<p>${this.translations.termsLt3}</p>
							</div>
						</div>
					</div>
				</div>`;
                }
            } else if (this.altModalHTML) {
                modalNode.innerHTML = this.altModalHTML;
            } else {
                modalNode.innerHTML = `
        <div id="sezzle-modal-container" role="dialog" aria-label="Sezzle Modal" aria-description="${this.translations.aboutSezzle}" class="sezzle-checkout-modal-hidden">
		<div class="sezzle-modal">
				<div><button role="button" aria-label="${this.translations.closeSezzleModal}" class="close-sezzle-modal"></button></div>
				<div class="sezzle-logo" title="Sezzle"></div>
				<div id="sezzle-modal-core-content" class="sezzle-modal-content">
                    <div id="tp-widget-wrapper" class="tp-widget-wrapper visible">
                        <a id="profile-link" target="_blank" href="https://www.trustpilot.com/review/sezzle.com?utm_medium=trustbox&amp;utm_source=MicroCombo">
                            <!-- Stars -->
                            <div id="tp-widget-stars" class="tp-widget-stars">
                                <div class="">
                                    <div class="tp-stars tp-stars--4 tp-stars--4--half">
                                        <div style="position: relative; height: 0; width: 100%; padding: 0; padding-bottom: 18.326693227091635%;">

                                            <svg role="img" viewBox="0 0 251 46" xmlns="http://www.w3.org/2000/svg" style="position: absolute; height: 100%; width: 100%; left: 0; top: 0;">
                                                <title id="starRating-tfnn0cd6r0c" lang="en-US">${this.translations.trustPilotTitle}</title>
                                                <g class="tp-star">
                                                    <path class="tp-star__canvas" fill="#dcdce6" d="M0 46.330002h46.375586V0H0z"></path>
                                                    <path class="tp-star__shape" d="M39.533936 19.711433L13.230239 38.80065l3.838216-11.797827L7.02115 19.711433h12.418975l3.837417-11.798624 3.837418 11.798624h12.418975zM23.2785 31.510075l7.183595-1.509576 2.862114 8.800152L23.2785 31.510075z" fill="#FFF"></path>
                                                </g>
                                                <g class="tp-star">
                                                    <path class="tp-star__canvas" fill="#dcdce6" d="M51.24816 46.330002h46.375587V0H51.248161z"></path>
                                                    <path class="tp-star__canvas--half" fill="#dcdce6" d="M51.24816 46.330002h23.187793V0H51.248161z"></path>
                                                    <path class="tp-star__shape" d="M74.990978 31.32991L81.150908 30 84 39l-9.660206-7.202786L64.30279 39l3.895636-11.840666L58 19.841466h12.605577L74.499595 8l3.895637 11.841466H91L74.990978 31.329909z" fill="#FFF"></path>
                                                </g>
                                                <g class="tp-star">
                                                    <path class="tp-star__canvas" fill="#dcdce6" d="M102.532209 46.330002h46.375586V0h-46.375586z"></path>
                                                    <path class="tp-star__canvas--half" fill="#dcdce6" d="M102.532209 46.330002h23.187793V0h-23.187793z"></path>
                                                    <path class="tp-star__shape" d="M142.066994 19.711433L115.763298 38.80065l3.838215-11.797827-10.047304-7.291391h12.418975l3.837418-11.798624 3.837417 11.798624h12.418975zM125.81156 31.510075l7.183595-1.509576 2.862113 8.800152-10.045708-7.290576z" fill="#FFF"></path>
                                                </g>
                                                <g class="tp-star">
                                                    <path class="tp-star__canvas" fill="#dcdce6" d="M153.815458 46.330002h46.375586V0h-46.375586z"></path>
                                                    <path class="tp-star__canvas--half" fill="#dcdce6" d="M153.815458 46.330002h23.187793V0h-23.187793z"></path>
                                                    <path class="tp-star__shape" d="M193.348355 19.711433L167.045457 38.80065l3.837417-11.797827-10.047303-7.291391h12.418974l3.837418-11.798624 3.837418 11.798624h12.418974zM177.09292 31.510075l7.183595-1.509576 2.862114 8.800152-10.045709-7.290576z" fill="#FFF"></path>
                                                </g>
                                                <g class="tp-star">
                                                    <path class="tp-star__canvas" fill="#dcdce6" d="M205.064416 46.330002h46.375587V0h-46.375587z"></path>
                                                    <path class="tp-star__canvas--half" fill="#dcdce6" d="M205.064416 46.330002h23.187793V0h-23.187793z"></path>
                                                    <path class="tp-star__shape" d="M244.597022 19.711433l-26.3029 19.089218 3.837419-11.797827-10.047304-7.291391h12.418974l3.837418-11.798624 3.837418 11.798624h12.418975zm-16.255436 11.798642l7.183595-1.509576 2.862114 8.800152-10.045709-7.290576z" fill="#FFF"></path>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="widget-info">
                                <!-- Business Info -->
                                <div id="tp-widget-rating" class="tp-widget-rating">${this.translations.trustPilotReviews}</div>
                                <!-- Logo -->
                                <div id="tp-widget-logo" class="tp-widget-logo">
                                    <div class="">
                                        <div style="position: relative; height: 0; width: 100%; padding: 0; padding-bottom: 24.6031746031746%;">
                                            <svg role="img" viewBox="0 0 126 31" xmlns="http://www.w3.org/2000/svg" style="position: absolute; height: 100%; width: 100%; left: 0; top: 0;">
                                                <title id="trustpilotLogo-wwxihtot4h">Trustpilot</title>
                                                <path class="tp-logo__text" d="M33.074774 11.07005H45.81806v2.364196h-5.010656v13.290316h-2.755306V13.434246h-4.988435V11.07005h.01111zm12.198892 4.319629h2.355341v2.187433h.04444c.077771-.309334.222203-.60762.433295-.894859.211092-.287239.466624-.56343.766597-.79543.299972-.243048.633276-.430858.999909-.585525.366633-.14362.744377-.220953 1.12212-.220953.288863 0 .499955.011047.611056.022095.1111.011048.222202.033143.344413.04419v2.408387c-.177762-.033143-.355523-.055238-.544395-.077333-.188872-.022096-.366633-.033143-.544395-.033143-.422184 0-.822148.08838-1.199891.254096-.377744.165714-.699936.41981-.977689.740192-.277753.331429-.499955.729144-.666606 1.21524-.166652.486097-.244422 1.03848-.244422 1.668195v5.39125h-2.510883V15.38968h.01111zm18.220567 11.334883H61.02779v-1.579813h-.04444c-.311083.574477-.766597 1.02743-1.377653 1.369908-.611055.342477-1.233221.51924-1.866497.51924-1.499864 0-2.588654-.364573-3.25526-1.104765-.666606-.740193-.999909-1.856005-.999909-3.347437V15.38968h2.510883v6.948968c0 .994288.188872 1.701337.577725 2.1101.377744.408763.922139.618668 1.610965.618668.533285 0 .96658-.077333 1.322102-.243048.355524-.165714.644386-.37562.855478-.65181.222202-.265144.377744-.596574.477735-.972194.09999-.37562.144431-.784382.144431-1.226288v-6.573349h2.510883v11.323836zm4.27739-3.634675c.07777.729144.355522 1.237336.833257 1.535623.488844.287238 1.06657.441905 1.744286.441905.233312 0 .499954-.022095.799927-.055238.299973-.033143.588836-.110476.844368-.209905.266642-.099429.477734-.254096.655496-.452954.166652-.198857.244422-.452953.233312-.773335-.01111-.320381-.133321-.585525-.355523-.784382-.222202-.209906-.499955-.364573-.844368-.497144-.344413-.121525-.733267-.232-1.17767-.320382-.444405-.088381-.888809-.18781-1.344323-.287239-.466624-.099429-.922138-.232-1.355432-.37562-.433294-.14362-.822148-.342477-1.166561-.596573-.344413-.243048-.622166-.56343-.822148-.950097-.211092-.386668-.311083-.861716-.311083-1.436194 0-.618668.155542-1.12686.455515-1.54667.299972-.41981.688826-.75124 1.14434-1.005336.466624-.254095.97769-.430858 1.544304-.541334.566615-.099429 1.11101-.154667 1.622075-.154667.588836 0 1.15545.066286 1.688736.18781.533285.121524 1.02213.320381 1.455423.60762.433294.276191.788817.640764 1.07768 1.08267.288863.441905.466624.98324.544395 1.612955h-2.621984c-.122211-.596572-.388854-1.005335-.822148-1.204193-.433294-.209905-.933248-.309334-1.488753-.309334-.177762 0-.388854.011048-.633276.04419-.244422.033144-.466624.088382-.688826.165715-.211092.077334-.388854.198858-.544395.353525-.144432.154667-.222203.353525-.222203.60762 0 .309335.111101.552383.322193.740193.211092.18781.488845.342477.833258.475048.344413.121524.733267.232 1.177671.320382.444404.088381.899918.18781 1.366542.287239.455515.099429.899919.232 1.344323.37562.444404.14362.833257.342477 1.17767.596573.344414.254095.622166.56343.833258.93905.211092.37562.322193.850668.322193 1.40305 0 .673906-.155541 1.237336-.466624 1.712385-.311083.464001-.711047.850669-1.199891 1.137907-.488845.28724-1.04435.508192-1.644295.640764-.599946.132572-1.199891.198857-1.788727.198857-.722156 0-1.388762-.077333-1.999818-.243048-.611056-.165714-1.14434-.408763-1.588745-.729144-.444404-.33143-.799927-.740192-1.05546-1.226289-.255532-.486096-.388853-1.071621-.411073-1.745528h2.533103v-.022095zm8.288135-7.700208h1.899828v-3.402675h2.510883v3.402675h2.26646v1.867052h-2.26646v6.054109c0 .265143.01111.486096.03333.684954.02222.18781.07777.353524.155542.486096.07777.132572.199981.232.366633.298287.166651.066285.377743.099428.666606.099428.177762 0 .355523 0 .533285-.011047.177762-.011048.355523-.033143.533285-.077334v1.933338c-.277753.033143-.555505.055238-.811038.088381-.266642.033143-.533285.04419-.811037.04419-.666606 0-1.199891-.066285-1.599855-.18781-.399963-.121523-.722156-.309333-.944358-.552381-.233313-.243049-.377744-.541335-.466625-.905907-.07777-.364573-.13332-.784383-.144431-1.248384v-6.683825h-1.899827v-1.889147h-.02222zm8.454788 0h2.377562V16.9253h.04444c.355523-.662858.844368-1.12686 1.477644-1.414098.633276-.287239 1.310992-.430858 2.055369-.430858.899918 0 1.677625.154667 2.344231.475048.666606.309335 1.222111.740193 1.666515 1.292575.444405.552382.766597 1.193145.9888 1.92229.222202.729145.333303 1.513527.333303 2.3421 0 .762288-.099991 1.50248-.299973 2.20953-.199982.718096-.499955 1.347812-.899918 1.900194-.399964.552383-.911029.98324-1.533194 1.31467-.622166.33143-1.344323.497144-2.18869.497144-.366634 0-.733267-.033143-1.0999-.099429-.366634-.066286-.722157-.176762-1.05546-.320381-.333303-.14362-.655496-.33143-.933249-.56343-.288863-.232-.522175-.497144-.722157-.79543h-.04444v5.656393h-2.510883V15.38968zm8.77698 5.67849c0-.508193-.06666-1.005337-.199981-1.491433-.133321-.486096-.333303-.905907-.599946-1.281527-.266642-.37562-.599945-.673906-.988799-.894859-.399963-.220953-.855478-.342477-1.366542-.342477-1.05546 0-1.855387.364572-2.388672 1.093717-.533285.729144-.799928 1.701337-.799928 2.916578 0 .574478.066661 1.104764.211092 1.59086.144432.486097.344414.905908.633276 1.259432.277753.353525.611056.629716.99991.828574.388853.209905.844367.309334 1.355432.309334.577725 0 1.05546-.121524 1.455423-.353525.399964-.232.722157-.541335.97769-.905907.255531-.37562.444403-.79543.555504-1.270479.099991-.475049.155542-.961145.155542-1.458289zm4.432931-9.99812h2.510883v2.364197h-2.510883V11.07005zm0 4.31963h2.510883v11.334883h-2.510883V15.389679zm4.755124-4.31963h2.510883v15.654513h-2.510883V11.07005zm10.210184 15.963847c-.911029 0-1.722066-.154667-2.433113-.452953-.711046-.298287-1.310992-.718097-1.810946-1.237337-.488845-.530287-.866588-1.160002-1.12212-1.889147-.255533-.729144-.388854-1.535622-.388854-2.408386 0-.861716.133321-1.657147.388853-2.386291.255533-.729145.633276-1.35886 1.12212-1.889148.488845-.530287 1.0999-.93905 1.810947-1.237336.711047-.298286 1.522084-.452953 2.433113-.452953.911028 0 1.722066.154667 2.433112.452953.711047.298287 1.310992.718097 1.810947 1.237336.488844.530287.866588 1.160003 1.12212 1.889148.255532.729144.388854 1.524575.388854 2.38629 0 .872765-.133322 1.679243-.388854 2.408387-.255532.729145-.633276 1.35886-1.12212 1.889147-.488845.530287-1.0999.93905-1.810947 1.237337-.711046.298286-1.522084.452953-2.433112.452953zm0-1.977528c.555505 0 1.04435-.121524 1.455423-.353525.411074-.232.744377-.541335 1.01102-.916954.266642-.37562.455513-.806478.588835-1.281527.12221-.475049.188872-.961145.188872-1.45829 0-.486096-.066661-.961144-.188872-1.44724-.122211-.486097-.322193-.905907-.588836-1.281527-.266642-.37562-.599945-.673907-1.011019-.905907-.411074-.232-.899918-.353525-1.455423-.353525-.555505 0-1.04435.121524-1.455424.353525-.411073.232-.744376.541334-1.011019.905907-.266642.37562-.455514.79543-.588835 1.281526-.122211.486097-.188872.961145-.188872 1.447242 0 .497144.06666.98324.188872 1.458289.12221.475049.322193.905907.588835 1.281527.266643.37562.599946.684954 1.01102.916954.411073.243048.899918.353525 1.455423.353525zm6.4883-9.66669h1.899827v-3.402674h2.510883v3.402675h2.26646v1.867052h-2.26646v6.054109c0 .265143.01111.486096.03333.684954.02222.18781.07777.353524.155541.486096.077771.132572.199982.232.366634.298287.166651.066285.377743.099428.666606.099428.177762 0 .355523 0 .533285-.011047.177762-.011048.355523-.033143.533285-.077334v1.933338c-.277753.033143-.555505.055238-.811038.088381-.266642.033143-.533285.04419-.811037.04419-.666606 0-1.199891-.066285-1.599855-.18781-.399963-.121523-.722156-.309333-.944358-.552381-.233313-.243049-.377744-.541335-.466625-.905907-.07777-.364573-.133321-.784383-.144431-1.248384v-6.683825h-1.899827v-1.889147h-.02222z" fill="#191919"></path>
                                                <path class="tp-logo__star" fill="#00B67A" d="M30.141707 11.07005H18.63164L15.076408.177071l-3.566342 10.892977L0 11.059002l9.321376 6.739063-3.566343 10.88193 9.321375-6.728016 9.310266 6.728016-3.555233-10.88193 9.310266-6.728016z"></path>
                                                <path class="tp-logo__star-notch" fill="#005128" d="M21.631369 20.26169l-.799928-2.463625-5.755033 4.153914z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
					<header class="sezzle-header">${this.translations.sezzleHeader}
					</header>
        			<p class="sezzle-row">
                        <span>${this.translations.sezzleHeaderChild}</span>
                        <span>${this.translations.sezzleHeaderChild2}</span>
					</p>
        		<div class="sezzle-four-pay">
					<div class="sezzle-pie-area">
						<div class="due-today">
							<div class="payment-item">
								<div title="${this.translations.pieAlt} 25%">
									<svg width="35" height="35" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20ZM10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20Z" fill="#8333D4" fill-opacity="0.05"></path>
										<path d="M20 -7.62939e-05C22.6264 -7.64088e-05 25.2272 0.51724 27.6537 1.52233C30.0802 2.52743 32.285 4.00062 34.1421 5.85779C35.9993 7.71496 37.4725 9.91974 38.4776 12.3463C39.4827 14.7728 40 17.3735 40 19.9999L30 19.9999C30 18.6867 29.7413 17.3863 29.2388 16.1731C28.7362 14.9598 27.9997 13.8574 27.0711 12.9289C26.1425 12.0003 25.0401 11.2637 23.8268 10.7611C22.6136 10.2586 21.3132 9.99992 20 9.99992L20 -7.62939e-05Z" fill="#8333D4"></path>
										<path d="M40 19.9999C40 22.7613 37.7614 24.9998 35 24.9998C32.2386 24.9998 30 22.7613 30 19.9999C30 17.2385 32.2386 14.9998 35 14.9998C37.7614 14.9998 40 17.2385 40 19.9999Z" fill="#8333D4"></path>
										<circle cx="35" cy="20" r="5" fill="#8333D4"></circle>
									</svg>
								</div>
								<p class="breakdown-row">
									<span class="percentage">25%</span>
									<span class="due">${this.translations.today}</span>
								</p>
							</div>
						</div>
						<div class="future-payments">
							<div class="payment-item">
								<div title="${this.translations.pieAlt} 50%">
									<svg width="35" height="35" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20ZM10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20Z" fill="#8333D4" fill-opacity="0.05"></path>
										<path fill-rule="evenodd" clip-rule="evenodd" d="M40 20C40 31.0457 31.0457 40 20 40C17.2386 40 15 37.7614 15 35C15 32.2386 17.2386 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10V0C31.0457 0 40 8.9543 40 20Z" fill="#8333D4"></path>
									</svg>
								</div>
								<p class="breakdown-row">
									<span class="percentage">25%</span>
									<span class="due">${this.translations.week} 2</span>
								</p>
							</div>
							<div class="payment-item">
								<div title="${this.translations.pieAlt} 75%">
									<svg width="35" height="35" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20ZM10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20Z" fill="#8333D4" fill-opacity="0.05"></path>
										<path d="M20 -8.74228e-07C23.9556 -1.04713e-06 27.8224 1.17298 31.1114 3.37061C34.4004 5.56824 36.9638 8.69181 38.4776 12.3463C39.9913 16.0009 40.3874 20.0222 39.6157 23.9018C38.844 27.7814 36.9392 31.3451 34.1421 34.1421C31.3451 36.9392 27.7814 38.844 23.9018 39.6157C20.0222 40.3874 16.0009 39.9913 12.3463 38.4776C8.69181 36.9638 5.56824 34.4004 3.37061 31.1114C1.17298 27.8224 -7.48492e-07 23.9556 -8.74228e-07 20L10 20C10 21.9778 10.5865 23.9112 11.6853 25.5557C12.7841 27.2002 14.3459 28.4819 16.1732 29.2388C18.0004 29.9957 20.0111 30.1937 21.9509 29.8079C23.8907 29.422 25.6725 28.4696 27.0711 27.0711C28.4696 25.6725 29.422 23.8907 29.8079 21.9509C30.1937 20.0111 29.9957 18.0004 29.2388 16.1732C28.4819 14.3459 27.2002 12.7841 25.5557 11.6853C23.9112 10.5865 21.9778 10 20 10L20 -8.74228e-07Z" fill="#8333D4"></path>
										<path d="M10 20C10 22.7614 7.76142 25 5 25C2.23858 25 -8.74228e-07 22.7614 -8.74228e-07 20C-8.74228e-07 17.2386 2.23858 15 5 15C7.76142 15 10 17.2386 10 20Z" fill="#8333D4"></path>
										<circle cx="5" cy="20" r="5" fill="#8333D4"></circle>
									</svg>
								</div>
								<p class="breakdown-row">
									<span class="percentage">25%</span>
									<span class="due">${this.translations.week} 4</span>
								</p>
							</div>
							<div class="payment-item">
								<div title="${this.translations.pieAlt} 100%">
									<svg width="35" height="35" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20ZM10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20Z" fill="#8333D4"></path>
									</svg>
								</div>
								<p class="breakdown-row">
									<span class="percentage">25%</span>
									<span class="due">${this.translations.week} 6</span>
								</p>
							</div>
						</div>
					</div>
				</div>
						<div class="sezzle-features">
           					<p class="single-feature">
								${this.translations.selectSezzle}
							</p>
            				<p class="single-feature">
								${this.translations.completePurchase}
							</p>
							<p class="single-feature">
								${this.translations.schedulePayments}
							</p>
        				</div>
				<div class="terms-container">
        			<p class="terms"><span class="webbank-terms">${this.translations.webBankTerms}</span><br/>${this.translations.terms1}</p>
        			<p class="terms">${this.translations.terms2}</p>
        			<p class="terms">${this.translations.terms3}</p>
				</div>
				</div>
			</div>
		</div>`;
            }
            document.getElementsByTagName("html")[0].appendChild(modalNode);
        } else {
            modalNode = document.getElementsByClassName(
                "sezzle-checkout-modal-lightbox"
            )[0];
        }
        Array.prototype.forEach.call(
            document.getElementsByClassName("close-sezzle-modal"),
            function (el) {
                el.addEventListener("click", function () {
                    modalNode.style.display = "none";
                    modalNode.getElementsByClassName(
                        "sezzle-modal"
                    )[0].className = `sezzle-modal sezzle-modal${
                        this.modalTheme === "grayscale"
                            ? "-grayscale"
                            : "-color"
                    } sezzle-checkout-modal-hidden`;
                    let newFocus = document.querySelector(
                        "#sezzle-modal-return"
                    );
                    if (newFocus) {
                        newFocus.focus();
                        newFocus.removeAttribute("id");
                    } else if (
                        document
                            .querySelector(".sezzle-checkout-button-wrapper")
                            .querySelector(".sezzle-info-icon")
                    ) {
                        document
                            .querySelector(".sezzle-checkout-button-wrapper")
                            .querySelector(".sezzle-info-icon")
                            .focus();
                    } else {
                        document
                            .querySelector(".sezzle-checkout-button-wrapper")
                            .focus();
                    }
                });
            }
        );
        let sezzleModal = document.getElementsByClassName("sezzle-modal")[0];
        if (!sezzleModal)
            sezzleModal = document.getElementsByClassName(
                "sezzle-checkout-modal"
            )[0];
        sezzleModal.addEventListener("click", function (event) {
            event.stopPropagation();
        });
        this.modalKeyboardNavigation();
    }

    async getAPModal(modalNode) {
        const url = `https://media.sezzle.com/afterpay/modal/${this.language}.html`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new error(
                    `Failed to fetch aftetpay modal, status: ${response.status}`
                );
            }
            modalNode.innerHTML = await response.text();
        } catch (error) {
            console.error(error);
        }
    }

    renderAPModal() {
        var modalNode = document.createElement("section");
        modalNode.className =
            "sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-ap-modal";
        modalNode.style = "position: center";
        modalNode.style.display = "none";
        modalNode.role = "dialog";
        modalNode.ariaLabel = this.translations.afterpayInfo;
        modalNode.ariaDescription = `${this.translations.learnMoreAlt} Afterpay`;

        if (this.apModalHTML) {
            modalNode.innerHTML = this.apModalHTML;
        } else {
            this.getAPModal(modalNode);
        }
        document.getElementsByTagName("html")[0].appendChild(modalNode);
        Array.prototype.forEach.call(
            document.getElementsByClassName("close-sezzle-modal"),
            function (el) {
                el.addEventListener("click", function () {
                    modalNode.style.display = "none";
                    let newFocus = document.querySelector(
                        "#sezzle-modal-return"
                    );
                    if (newFocus) {
                        newFocus.focus();
                        newFocus.removeAttribute("id");
                    } else if (document.querySelector(`.ap-modal-info-link`)) {
                        document
                            .querySelector(".sezzle-checkout-button-wrapper")
                            .getElementsByClassName(`ap-modal-info-link`)[0]
                            .focus();
                    } else {
                        document
                            .querySelector(".sezzle-checkout-button-wrapper")
                            .focus();
                    }
                });
            }
        );
        let sezzleModal = document.getElementsByClassName("sezzle-modal")[0];
        if (!sezzleModal)
            sezzleModal = document.getElementsByClassName(
                "sezzle-checkout-modal"
            )[0];
        sezzleModal.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }

    renderQPModal() {
        var modalNode = document.createElement("section");
        modalNode.className =
            "sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-qp-modal";
        modalNode.style = "position: center";
        modalNode.style.display = "none";
        modalNode.role = "dialog";
        modalNode.ariaLabel = this.translations.quadpayInfo;
        modalNode.ariaDescription = `${this.translations.learnMoreAlt} Quadpay`;
        modalNode.innerHTML = this.qpModalHTML;
        document.getElementsByTagName("html")[0].appendChild(modalNode);
        Array.prototype.forEach.call(
            document.getElementsByClassName("close-sezzle-modal"),
            function (el) {
                el.addEventListener("click", function () {
                    modalNode.style.display = "none";
                    let newFocus = document.querySelector(
                        "#sezzle-modal-return"
                    );
                    if (newFocus) {
                        newFocus.focus();
                        newFocus.removeAttribute("id");
                    } else if (document.querySelector(`.qp-modal-info-link`)) {
                        document
                            .querySelector(".sezzle-checkout-button-wrapper")
                            .getElementsByClassName(`qp-modal-info-link`)[0]
                            .focus();
                    } else {
                        document
                            .querySelector(".sezzle-checkout-button-wrapper")
                            .focus();
                    }
                });
            }
        );
        let sezzleModal = document.getElementsByClassName("sezzle-modal")[0];
        if (!sezzleModal)
            sezzleModal = document.getElementsByClassName(
                "sezzle-checkout-modal"
            )[0];
        sezzleModal.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }

    renderAffirmModal() {
        var modalNode = document.createElement("section");
        modalNode.className =
            "sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-affirm-modal";
        modalNode.style = "position: center";
        modalNode.style.display = "none";
        modalNode.role = "dialog";
        modalNode.ariaLabel = this.translations.affirmInfo;
        modalNode.ariaDescription = `${this.translations.learnMoreAlt}  Affirm`;
        modalNode.innerHTML = this.affirmModalHTML;
        document.getElementsByTagName("html")[0].appendChild(modalNode);
        Array.prototype.forEach.call(
            document.getElementsByClassName("close-sezzle-modal"),
            function (el) {
                el.addEventListener("click", function () {
                    modalNode.style.display = "none";
                    let newFocus = document.querySelector(
                        "#sezzle-modal-return"
                    );
                    if (newFocus) {
                        newFocus.focus();
                        newFocus.removeAttribute("id");
                    } else if (
                        document.querySelector(`.affirm-modal-info-link`)
                    ) {
                        document
                            .querySelector(".sezzle-checkout-button-wrapper")
                            .getElementsByClassName(`affirm-modal-info-link`)[0]
                            .focus();
                    } else {
                        document
                            .querySelector(".sezzle-checkout-button-wrapper")
                            .focus();
                    }
                });
            }
        );
        let sezzleModal = document.getElementsByClassName("sezzle-modal")[0];
        if (!sezzleModal)
            sezzleModal = document.getElementsByClassName(
                "sezzle-checkout-modal"
            )[0];
        sezzleModal.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }

    renderKlarnaModal() {
        var modalNode = document.createElement("section");
        modalNode.className =
            "sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-klarna-modal";
        modalNode.style = "position: center";
        modalNode.style.display = "none";
        modalNode.role = "dialog";
        modalNode.ariaLabel = this.translations.klarnaInfo;
        modalNode.ariaDescription = `${this.translations.learnMoreAlt}  Klarna`;
        modalNode.innerHTML = this.klarnaModalHTML;
        document.getElementsByTagName("html")[0].appendChild(modalNode);
        Array.prototype.forEach.call(
            document.getElementsByClassName("close-sezzle-modal"),
            function (el) {
                el.addEventListener("click", function () {
                    modalNode.style.display = "none";
                    let newFocus = document.querySelector(
                        "#sezzle-modal-return"
                    );
                    if (newFocus) {
                        newFocus.focus();
                        newFocus.removeAttribute("id");
                    } else if (
                        document.querySelector(`.klarna-modal-info-link`)
                    ) {
                        document
                            .querySelector(".sezzle-checkout-button-wrapper")
                            .getElementsByClassName(`klarna-modal-info-link`)[0]
                            .focus();
                    } else {
                        document
                            .querySelector(".sezzle-checkout-button-wrapper")
                            .focus();
                    }
                });
            }
        );
        let sezzleModal = document.getElementsByClassName("sezzle-modal")[0];
        if (!sezzleModal)
            sezzleModal = document.getElementsByClassName(
                "sezzle-checkout-modal"
            )[0];
        sezzleModal.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }

    renderModalByfunction() {
        var modalNode = document.getElementsByClassName(
            "sezzle-checkout-modal-lightbox"
        )[0];
        modalNode.style.display = "block";
        modalNode.getElementsByClassName(
            "sezzle-modal"
        )[0].className = `sezzle-modal sezzle-modal${
            this.modalTheme === "grayscale" ? "-grayscale" : "-color"
        }`;
    }

    addClickEventForModal(sezzleElement) {
        const modalLinks = document.getElementsByClassName("sezzle-modal-link");
        Array.prototype.forEach.call(
            modalLinks,
            function (modalLink) {
                modalLink.addEventListener(
                    "click",
                    function (event) {
                        event.preventDefault();
                        if (
                            !event.target.classList.contains("no-sezzle-info")
                        ) {
                            var modalNode = document.getElementsByClassName(
                                "sezzle-checkout-modal-lightbox"
                            )[0];
                            modalNode.style.display = "block";
                            modalNode
                                .getElementsByClassName("close-sezzle-modal")[0]
                                .focus();
                            modalNode.getElementsByClassName(
                                "sezzle-modal"
                            )[0].className = `sezzle-modal sezzle-modal${
                                this.modalTheme === "grayscale"
                                    ? "-grayscale"
                                    : "-color"
                            }`;
                            event.target.id = "sezzle-modal-return";
                        }
                    }.bind(this)
                );
            }.bind(this)
        );
        const apModalLinks =
            sezzleElement.getElementsByClassName("ap-modal-info-link");
        Array.prototype.forEach.call(
            apModalLinks,
            function (modalLink) {
                modalLink.addEventListener(
                    "click",
                    function (event) {
                        document.getElementsByClassName(
                            "sezzle-ap-modal"
                        )[0].style.display = "block";
                        document
                            .getElementsByClassName("sezzle-ap-modal")[0]
                            .focus();
                        event.target.id = "sezzle-modal-return";
                    }.bind(this)
                );
            }.bind(this)
        );
        const qpModalLinks = sezzleElement.getElementsByClassName(
            "quadpay-modal-info-link"
        );
        Array.prototype.forEach.call(
            qpModalLinks,
            function (modalLink) {
                modalLink.addEventListener(
                    "click",
                    function (event) {
                        document.getElementsByClassName(
                            "sezzle-qp-modal"
                        )[0].style.display = "block";
                        document
                            .getElementsByClassName("sezzle-qp-modal")[0]
                            .focus();
                        event.target.id = "sezzle-modal-return";
                    }.bind(this)
                );
            }.bind(this)
        );
        const affirmModalLinks = sezzleElement.getElementsByClassName(
            "affirm-modal-info-link"
        );
        Array.prototype.forEach.call(
            affirmModalLinks,
            function (modalLink) {
                modalLink.addEventListener(
                    "click",
                    function (event) {
                        document.getElementsByClassName(
                            "sezzle-affirm-modal"
                        )[0].style.display = "block";
                        document
                            .getElementsByClassName("sezzle-affirm-modal")[0]
                            .focus();
                        event.target.id = "sezzle-modal-return";
                    }.bind(this)
                );
            }.bind(this)
        );
        const klarnaModalLinks = sezzleElement.getElementsByClassName(
            "klarna-modal-info-link"
        );
        Array.prototype.forEach.call(
            klarnaModalLinks,
            function (modalLink) {
                modalLink.addEventListener(
                    "click",
                    function (event) {
                        document.getElementsByClassName(
                            "sezzle-klarna-modal"
                        )[0].style.display = "block";
                        document
                            .getElementsByClassName("sezzle-klarna-modal")[0]
                            .focus();
                        event.target.id = "sezzle-modal-return";
                    }.bind(this)
                );
            }.bind(this)
        );
    }

    isMobileBrowser() {
        return (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
                navigator.userAgent
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                navigator.userAgent.substr(0, 4)
            )
        );
    }

    init() {
        let els = [];

        function renderModals() {
            this.renderModal();
            if (
                document.getElementsByClassName("ap-modal-info-link").length > 0
            ) {
                this.renderAPModal();
            }
            if (
                document.getElementsByClassName("quadpay-modal-info-link")
                    .length > 0
            ) {
                this.renderQPModal();
            }
            if (
                document.getElementsByClassName("affirm-modal-info-link")
                    .length > 0
            ) {
                this.renderAffirmModal();
            }
            if (
                document.getElementsByClassName("klarna-modal-info-link")
                    .length > 0
            ) {
                this.renderKlarnaModal();
            }
        }

        function sezzleWidgetCheckInterval() {
            this.renderElementArray.forEach(function (el, index) {
                els.push({
                    element: document.getElementById(el),
                });
            });
            els.forEach(
                function (el, index) {
                    if (!el.element.childElementCount) {
                        this.renderElement = el.element;
                        const sz = this.renderAwesomeSezzle();
                        this.addClickEventForModal(document);
                    }
                }.bind(this)
            );
            els = els.filter(function (e) {
                return e !== undefined;
            });
        }
        sezzleWidgetCheckInterval.call(this);
        renderModals.call(this);
    }
}

export default AwesomeSezzle;
