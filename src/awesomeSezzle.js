import HelperClass from "./awesomeHelper";
import enTranslations from "./translations/en";
import frTranslations from "./translations/fr";
import esTranslations from "./translations/es";
import { sanitizeHTML, escapeHTML } from "./utils/sanitizer";
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
        this.language = options.language().substring(0, 2).toLowerCase();
        break;
      default:
        this.language = "en";
    }
    this.translationsMap = {
      en: enTranslations,
      fr: frTranslations,
      es: esTranslations,
    };
    this.language = this.translationsMap[this.language] ? this.language : "en";
    this.translations = this.translationsMap[this.language];
    this.numberOfPayments = 4;
    const templateString = this.translations.widget;
    const templateStringLT = this.translations.longTerm;
    this.widgetTemplate =
      this.getWidgetTemplateOverride(options.widgetTemplate) || templateString;
    this.widgetTemplateLT =
      this.getWidgetTemplateOverride(options.widgetTemplateLT) ||
      templateStringLT;
    this.ineligibleWidgetTemplate =
      this.getWidgetTemplateOverride(options.ineligibleWidgetTemplate) || "";
    this.renderElementInitial = options.renderElement || "sezzle-widget";
    this.assignConfigs(options);
  }

  assignConfigs(options) {
    this.amount = options.amount || null;
    this.minPrice = options.minPrice || 2000;
    this.maxPrice = options.maxPrice || 250000;
    this.minPriceLT = options.minPriceLT || 0;
    this.bestAPR = options.bestAPR || 9.99;
    this.altModalHTML = options.altLightboxHTML ? sanitizeHTML(options.altLightboxHTML) : "";
    this.ltAltModalHTML = options.ltAltModalHTML ? sanitizeHTML(options.ltAltModalHTML) : "";
    this.apModalHTML = sanitizeHTML(options.apModalHTML) || "";
    this.cashAppAfterpayModalHTML = sanitizeHTML(options.cashAppAfterpayModalHTML) || "";
    this.zipModalHTML = sanitizeHTML(options.zipModalHTML) || sanitizeHTML(options.qpModalHTML) || "";
    this.modalTheme = options.modalTheme || "color";
    this.affirmModalHTML = sanitizeHTML(options.affirmModalHTML) || "";
    this.klarnaModalHTML = sanitizeHTML(options.klarnaModalHTML) || "";
    this.shoppayModalHTML = sanitizeHTML(options.shoppayModalHTML) || "";
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
      options.apLink || "https://www.afterpay.com/purchase-payment-agreement";
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
        this.renderElement.children[0].classList.add("sezzle-left");
        break;
      case "right":
        this.renderElement.children[0].classList.add(
            "sezzle-right"
        );
        break;
      case "center":
        this.renderElement.children[0].classList.add(
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
      this.renderElement.children[0].children[0].style.color = this.textColor;
    }
  }

  addCSSTheme() {
    switch (this.theme) {
      case "dark":
      case "white":
      case "white-flat":
      case "white-pill":
        this.renderElement.children[0].children[0].classList.add("szl-dark");
        break;
      default:
        this.renderElement.children[0].children[0].classList.add("szl-light");
        break;
    }
  }

  setImageURL() {
    switch (this.theme) {
      case "dark":
        this.imageClassName = "szl-dark-image";
        this.imageInnerHTML = HelperClass.svgImages().sezzleDark();
        break;
      case "grayscale":
        this.imageClassName = "szl-light-image";
        this.imageInnerHTML = HelperClass.svgImages().sezzleGrey();
        break;
      case "black-flat":
        this.imageClassName = "szl-light-image";
        this.imageInnerHTML = HelperClass.svgImages().sezzleBlack;
        break;
      case "white":
        this.imageClassName = "szl-dark-image";
        this.imageInnerHTML = HelperClass.svgImages().sezzleWhite();
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
        this.imageInnerHTML = HelperClass.svgImages().sezzleLight();
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
        this.renderElement.classList.add("sezzle-product-preview-widget");
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
    let modals = document.querySelectorAll(".sezzle-checkout-modal-lightbox");
    modals.forEach((modal) => {
      modal.remove();
    });
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

  getCompetitorConfig() {
    return {
      afterpay: {
        name: "Afterpay",
        competitorClass: "afterpay",
        variants: {
          "logo": {
            width: "115", height: "40", viewBox: "0 0 115 40",
            svg: HelperClass.svgImages().apNodeColor,
            extraClass: "afterpay-logo-pill"
          },
          "logo-black": {
            width: "170", height: "35", viewBox: "0 0 170 35",
            svg: HelperClass.svgImages().apNodeBlack,
            extraClass: "afterpay-logo-text"
          },
          "logo-grey": {
            width: "115", height: "40", viewBox: "0 0 115 40",
            svg: HelperClass.svgImages().apNodeGrey,
            extraClass: "afterpay-logo-pill"
          },
          "logo-white": {
            width: "115", height: "40", viewBox: "0 0 115 40",
            svg: HelperClass.svgImages().apNodeWhite,
            extraClass: "afterpay-logo-pill"
          }
        },
        hasLinkIcon: true
      },
      "cash-app-afterpay": {
        name: "Cash App Afterpay",
        competitorClass: "cash-app-afterpay",
        variants: {
          "logo": {
            width: "98", height: "24", viewBox: "0 0 98 24",
            preserveAspectRatio: "xMidYMid meet",
            svg: HelperClass.svgImages().cashAppApNodeColor
          },
          "logo-black": {
            width: "98", height: "24", viewBox: "0 0 98 24",
            preserveAspectRatio: "xMidYMid meet",
            svg: HelperClass.svgImages().cashAppApNodeBlack
          }
        }
      },
      zip: {
        name: "Zip",
        competitorClass: "zip",
        aliases: ["quadpay"],
        variants: {
          "logo": {
            id: "zip-logo-svg",
            alt: "Zip logo, when clicked, opens infographic about the option of buying this item with 4 installment payments",
            version: "1.1",
            width: "50", height: "23", viewBox: "0 0 300 111",
            style: "height: 22px !important;width: auto !important;margin-bottom: -5px;",
            svg: HelperClass.svgImages().zipNodeColor
          },
          "logo-grey": {
            id: "zip-logo-svg-black-white",
            alt: "Zip logo, when clicked, opens infographic about the option of buying this item with 4 installment payments",
            version: "1.1",
            width: "50", height: "23", viewBox: "0 0 50 19",
            style: "height: 22px !important;width: auto !important;margin-bottom: -5px;",
            svg: HelperClass.svgImages().zipNodeGrey
          },
          "logo-white": {
            id: "zip-logo-svg-secondary-light",
            alt: "Zip logo, when clicked, opens infographic about the option of buying this item with 4 installment payments",
            version: "1.1",
            width: "50", height: "23", viewBox: "0 0 51 23",
            style: "height: 22px !important;width: auto !important;margin-bottom: -5px;",
            svg: HelperClass.svgImages().zipNodeWhite
          }
        }
      },
      affirm: {
        name: "Affirm",
        competitorClass: "affirm",
        variants: {
          "logo": {
            width: "450", height: "170", viewBox: "0 0 450 170",
            style: "height: 24px !important;width: auto !important;",
            svg: HelperClass.svgImages().affirmNodeColor
          },
          "logo-grey": {
            width: "450", height: "170", viewBox: "0 0 450 170",
            style: "height: 24px !important;width: auto !important;",
            svg: HelperClass.svgImages().affirmNodeGrey
          },
          "logo-white": {
            width: "450", height: "170", viewBox: "0 0 450 170",
            style: "height: 24px !important;width: auto !important;",
            svg: HelperClass.svgImages().affirmNodeWhite
          }
        }
      },
      klarna: {
        name: "Klarna",
        competitorClass: "klarna",
        variants: {
          "logo": {
            width: "45", height: "25", viewBox: "0 0 45 23",
            style: "height: 25px !important;width: auto !important; margin-bottom: -5px;",
            svg: HelperClass.svgImages().klarnaNodeColor
          },
          "logo-grey": {
            width: "45", height: "25", viewBox: "0 0 45 23",
            style: "height: 25px !important;width: auto !important; margin-bottom: -5px;",
            svg: HelperClass.svgImages().klarnaNodeGrey
          },
          "logo-white": {
            width: "45", height: "25", viewBox: "0 0 45 23",
            style: "height: 25px !important;width: auto !important; margin-bottom: -5px;",
            svg: HelperClass.svgImages().klarnaNodeWhite
          }
        }
      },
      shoppay: {
        name: "Shoppay",
        competitorClass: "shoppay",
        variants: {
          "logo": {
            width: "99", height: "25", viewBox: "0 0 99 25",
            style: "height: 18px !important;width: auto !important; margin-bottom: -5px;",
            svg: HelperClass?.svgImages()?.shoppayLight || ""
          }
        }
      }
    };
  }

  renderCompetitorLogo(variant, config, sezzleButtonText) {
    let variantConfig = config.variants[variant];
    if (!variantConfig) {
      variantConfig = config.variants["logo"];
    }

    const node = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    node.setAttribute("width", variantConfig.width);
    node.setAttribute("height", variantConfig.height);
    node.setAttribute("viewBox", variantConfig.viewBox);
    node.setAttribute("aria-label", config.name);

    let className = `sezzle-${config.competitorClass}-logo ${config.competitorClass} no-sezzle-info ${config.competitorClass}-modal-info-link`;
    if (variantConfig.extraClass) {
      className += ` ${variantConfig.extraClass}`;
    }
    node.setAttribute("class", className);

    if (variantConfig.style) {
      node.setAttribute("style", variantConfig.style);
    }
    if (variantConfig.id) {
      node.setAttribute("id", variantConfig.id);
    }
    if (variantConfig.alt) {
      node.setAttribute("alt", variantConfig.alt);
    }
    if (variantConfig.version) {
      node.setAttribute("version", variantConfig.version);
    }
    if (variantConfig.preserveAspectRatio) {
      node.setAttribute("preserveAspectRatio", variantConfig.preserveAspectRatio);
    }

    node.innerHTML = variantConfig.svg;
    sezzleButtonText.appendChild(node);
    this.setLogoSize(node);
    return true;
  }

  renderCompetitorInfoIcon(config, sezzleButtonText) {
    const iconNode = document.createElement("button");
    iconNode.role = "button";
    iconNode.type = "button";
    iconNode.ariaLabel = `${this.translations.learnMoreAlt} ${config.name}`;
    iconNode.className = `${config.competitorClass}-modal-info-link no-sezzle-info ${config.competitorClass}-info-icon`;
    iconNode.innerHTML = "&#9432;";

    sezzleButtonText.appendChild(iconNode);
    return true;
  }

  renderCompetitorLinkIcon(sezzleButtonText) {
    const anchor = document.createElement("a");
    anchor.href = this.apLink;
    anchor.target = "_blank";
    const linkIconNode = document.createElement("code");
    linkIconNode.ariaLabel = `${this.translations.learnMoreAlt} Afterpay`;
    linkIconNode.className = "afterpay-info-link";
    linkIconNode.innerHTML = "&#9432;";
    anchor.appendChild(linkIconNode);
    sezzleButtonText.appendChild(anchor);
    return true;
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
        const competitorConfigs = this.getCompetitorConfig();
        let handled = false;

        for (const [competitorKey, competitorConfig] of Object.entries(competitorConfigs)) {
          const competitors = [competitorKey, ...(competitorConfig.aliases || [])];

          for (const competitor of competitors) {
            if (subtemplate === `${competitor}-link-icon` && competitorConfig.hasLinkIcon) {
              this.renderCompetitorLinkIcon(sezzleButtonText);
              handled = true;
              break;
            }

            if (subtemplate === `${competitor}-info-icon`) {
              this.renderCompetitorInfoIcon(competitorConfig, sezzleButtonText);
              handled = true;
              break;
            }

            // Escape regex special characters to prevent regex injection
            const escapedCompetitor = competitor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const logoMatch = subtemplate.match(new RegExp(`^${escapedCompetitor}-(logo(?:-\\w+)?)$`));
            if (logoMatch) {
              const variant = logoMatch[1];
              this.renderCompetitorLogo(variant, competitorConfig, sezzleButtonText);
              handled = true;
              break;
            }
          }

          if (handled) break;
        }

        if (handled) return;

        switch (subtemplate) {
            case "price":
                const priceSpanNode = document.createElement("span");
                priceSpanNode.className =
                    "sezzle-payment-amount sezzle-button-text";
                const priceValueText = document.createTextNode(
                    this.getFormattedPrice(),
                );
                priceSpanNode.appendChild(priceValueText);
                sezzleButtonText.appendChild(priceSpanNode);
                break;
            case "logo":
                const logoNode = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg",
                );
                logoNode.setAttribute("width", "798.16");
                logoNode.setAttribute("height", "199.56");
                logoNode.setAttribute("viewBox", "0 0 798.16 199.56");
                logoNode.setAttribute(
                    "class",
                    `sezzle-logo ${this.imageClassName}`,
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
            case "sup": {
                const supNode = document.createElement("sup");
                supNode.textContent = "1";
                sezzleButtonText.appendChild(supNode);
                break;
            }
            case "link":
                const learnMoreNode = document.createElement("div");
                learnMoreNode.style.color = this.textColor;
                learnMoreNode.ariaLabel = `${this.translations.learnMoreAlt} Sezzle`;
                learnMoreNode.className =
                    "sezzle-learn-more sezzle-modal-open-link";
                const learnMoreText = document.createTextNode(
                    this.translations.learnMoreLink,
                );
                learnMoreNode.appendChild(learnMoreText);
                sezzleButtonText.appendChild(learnMoreNode);
                break;
            case "info":
                const infoIconNode = document.createElement("div");
                infoIconNode.ariaLabel = `${this.translations.clickToLearnMore} Sezzle`;
                infoIconNode.className =
                    "sezzle-info-icon sezzle-modal-open-link";
                infoIconNode.innerHTML = "&#9432;";
                sezzleButtonText.appendChild(infoIconNode);
                break;
            case "question-mark":
                const questionMarkButton = document.createElement("button");
                questionMarkButton.role = "button";
                questionMarkButton.type = "button";
                questionMarkButton.ariaLabel = `${this.translations.learnMoreLink} Sezzle`;
                const questionMarkIconNode = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg",
                );
                questionMarkIconNode.setAttribute("width", "14");
                questionMarkIconNode.setAttribute("height", "14");
                questionMarkIconNode.setAttribute("viewBox", "0 0 369 371");
                questionMarkButton.setAttribute(
                    "class",
                    "sezzle-question-mark-icon sezzle-modal-open-link",
                );
                questionMarkIconNode.innerHTML =
                    HelperClass.svgImages().questionMarkIcon;
                questionMarkButton.appendChild(questionMarkIconNode);
                sezzleButtonText.appendChild(questionMarkButton);
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
                const widgetTextNode = document.createTextNode(subtemplate);
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
        commaPrice.substring(commaPrice.indexOf(",") - 3, commaPrice.length)
      );
    } else if (parsedPrice.length > 6) {
      return (
        parsedPrice.substring(0, parsedPrice.indexOf(".") - 3) +
        "," +
        parsedPrice.substring(parsedPrice.indexOf(".") - 3, parsedPrice.length)
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
        return [12, 18, 24];
      case price > 300:
        return [6, 9, 12];
      default:
        return [3, 6, 9];
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
    let lastFocusableElement = focusableElements[focusableElements.length - 1];
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
          document.querySelector(".sezzle-checkout-button-wrapper").focus();
        }
      }
    });
  }

  renderModal() {
    if (
      !document.getElementsByClassName("sezzle-checkout-modal-lightbox").length
    ) {
      var modalNode = document.createElement("section");
      modalNode.className = "sezzle-checkout-modal-lightbox close-sezzle-modal";
      modalNode.style.display = "none";
      modalNode.role = "dialog";
      modalNode.lang = this.language;
      modalNode.ariaLabel = this.translations.sezzleInformation;
      modalNode.ariaDescription = this.translations.aboutSezzle;
      if (this.isProductEligibleLT(this.amount)) {
        let currency = String.fromCharCode(this.currencySymbol(this.amount));
        let priceString =
          this.amount.indexOf(currency) > -1
            ? this.amount.split(currency)[1]
            : this.amount;
        priceString =
          this.parseMode === "comma"
            ? priceString.replace(".", "").replace(",", ".")
            : priceString.replace(",", "");
        let terms = this.termsToShow(priceString);
        // Escape currency and price values for XSS protection
        const safeCurrency = escapeHTML(currency);
        const safePrice = escapeHTML(this.addDelimiters(priceString, this.parseMode));
        const safeBestAPR = escapeHTML(String(this.bestAPR));
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

							<header class="sezzle-header">${this.translations.LTsezzleHeader}</header>
        <div class="sezzle-row">${this.translations.LTsezzleRowChild}</div>
        <div class="sezzle-lt-payments">
            <div class="sezzle-lt-payment-header">${
                this.translations.LTsezzlePaymentHeader
            } <span>&nbsp${
              safeCurrency + safePrice
            }</span></div>
            <div class="sezzle-lt-payment-options ${terms[2]}-month" ${
                terms[2] === undefined
                    ? `style="display: none;"`
                    : `style="display: block;"`
            }>
                <div class="plan">
                    <div class="monthly-amount">
										<span>${
                                            safeCurrency +
                                            escapeHTML(this.formatMonthly(
                                                    priceString,
                                                    this.parseMode,
                                                    terms[2],
                                                    this.bestAPR
                                                ))
                                        }</span>
                        <span aria-label="${
                            this.translations.LTperMonth
                        }"><span class="per-month" aria-hidden="true">${
                            this.translations.LTmonthlyAmount
                        }<sup>*</sup></span></span>
                    </div>
                    <div class="term-length">${terms[2]} ${this.translations.LTtermLength}</div>
                </div>
                <div class="plan-details">
                    <div class="adjusted-total">${this.translations.LTadjustedTotal} <span>${
            safeCurrency +
            escapeHTML(this.formatAdjustedTotal(
              priceString,
              this.parseMode,
              terms[2],
              this.bestAPR
            ))
                    }</span></div>
                    <div class="interest-amount">${this.translations.LTinterest} <span>${
            safeCurrency +
            escapeHTML(this.formatTotalInterest(
              priceString,
              this.parseMode,
              terms[2],
              this.bestAPR
            ))
                    }</span></div>
                    <div class="sample-apr">
                        <span aria-label="${this.translations.LTreadApr} ${safeBestAPR} ${
                            this.translations.LTpercent
                        }">
                            <span class="apr-label" aria-hidden="true">${
                                this.translations.LTsampleApr
                            }</span><span aria-hidden="true">${
                                safeBestAPR
                            }%</span></span>
                    </div>
                </div>
            </div>
								<div class="sezzle-lt-payment-options ${terms[1]}-month">
                <div class="plan">
                    <div class="monthly-amount">
											<span>${
                        safeCurrency +
                        escapeHTML(this.formatMonthly(
                          priceString,
                          this.parseMode,
                          terms[1],
                          this.bestAPR
                        ))
                      }</span>
                        <span aria-label="${
                            this.translations.LTperMonth
                        }"><span class="per-month" aria-hidden="true">${
                            this.translations.LTmonthlyAmount
                        }<sup>*</sup></span></span>
                    </div>
                    <div class="term-length">${terms[1]} ${this.translations.LTtermLength}</div>
                </div>
                <div class="plan-details">
                    <div class="adjusted-total">${this.translations.LTadjustedTotal} <span>${
            safeCurrency +
            escapeHTML(this.formatAdjustedTotal(
              priceString,
              this.parseMode,
              terms[1],
              this.bestAPR
            ))
                    }</span></div>
                    <div class="interest-amount">${this.translations.LTinterest} <span>${
            safeCurrency +
            escapeHTML(this.formatTotalInterest(
              priceString,
              this.parseMode,
              terms[1],
              this.bestAPR
            ))
                    }</span></div>
                    <div class="sample-apr">
                        <span aria-label="${this.translations.LTreadApr} ${this.bestAPR} ${
                            this.translations.LTpercent
                        }">
                            <span class="apr-label" aria-hidden="true">${
                                this.translations.LTsampleApr
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
                        safeCurrency +
                        escapeHTML(this.formatMonthly(
                          priceString,
                          this.parseMode,
                          terms[0],
                          this.bestAPR
                        ))
                      }</span>
                        <span aria-label="${
                            this.translations.LTperMonth
                        }"><span class="per-month" aria-hidden="true">${
                            this.translations.LTmonthlyAmount
                        }<sup>*</sup></span></span>
                    </div>
                    <div class="term-length">${terms[0]} ${this.translations.LTtermLength}</div>
                </div>
                <div class="plan-details">
                    <div class="adjusted-total">${this.translations.LTadjustedTotal} <span>${
                        safeCurrency +
                        escapeHTML(this.formatAdjustedTotal(
                          priceString,
                          this.parseMode,
                          terms[0],
                          this.bestAPR
                        ))
                    }</span></div>
										<div class="interest-amount">${this.translations.LTinterest} <span>${
            safeCurrency +
            escapeHTML(this.formatTotalInterest(
              priceString,
              this.parseMode,
              terms[0],
              this.bestAPR
            ))
                    }</span></div>
                    <div class="sample-apr">
                        <span aria-label="${this.translations.LTreadApr} ${this.bestAPR} ${
                            this.translations.LTpercent
                        }">
                            <span class="apr-label" aria-hidden="true">${
                                this.translations.LTsampleApr
                            }</span><span aria-hidden="true">${
                                this.bestAPR
                            }%</span></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="details">${this.translations.LTsingleFeatureAffordable}</div>
        <div class="details">${this.translations.LTsingleFeaturePrequalify}</div>
        <div class="details">${this.translations.LTsingleFeatureTrusted}</div>
        <div class="terms">
            <p>${this.translations.LTterms1}</p>
            <p>${this.translations.LTterms2}</p>
            <p>${this.translations.LTterms3}</p>
        </div>
						</div>
					</div>
				</div>`;
        }
      } else if (this.altModalHTML) {
        modalNode.innerHTML = this.altModalHTML;
      } else {
        let modalHTML = `
        <div id="sezzle-modal-container" role="dialog" aria-label="Sezzle Modal" aria-description="${
            this.translations.aboutSezzle
        }" class="sezzle-checkout-modal-hidden sezzle-four-pay">
		<div class="sezzle-modal">
				<div><button role="button" aria-label="${
                    this.translations.closeSezzleModal
                }" class="close-sezzle-modal"></button></div>
				<div class="sezzle-logo" title="Sezzle"></div>
				<div id="sezzle-modal-core-content" class="sezzle-modal-content">
                    <div id="tp-widget-wrapper" class="tp-widget-wrapper visible">
                <a id="profile-link" target="_blank" href="https://www.trustpilot.com/review/sezzle.com?utm_medium=trustbox&amp;utm_source=MicroCombo">
                <div id="tp-review-status" class="tp-review-status">${
                    this.translations.PI4trustPilotReviewStatus
                }</div>
                    <!-- Stars -->
                    <div id="tp-widget-stars" class="tp-widget-stars">
                        <div class="">
                            <div class="tp-stars tp-stars--4 tp-stars--4--half">
                                <div style="position: relative; height: 0; width: 100%; padding: 0; padding-bottom: 18.326693227091635%;">

                                    <svg role="img" viewBox="0 0 251 46" xmlns="http://www.w3.org/2000/svg" style="position: absolute; height: 100%; width: 100%; left: 0; top: 0;">
                                        <title id="starRating-tfnn0cd6r0c" lang="en-US">${
                                            this.translations
                                            .PI4trustPilotTitle
                                        }</title>
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
                        <div id="tp-widget-review-count" class="tp-widget-review-count">${
                            this.translations.PI4trustPilotReviewsCount
                        }</div>
                        <div id="tp-widget-rating" class="tp-widget-rating">${
                            this.translations.PI4trustPilotReviews
                        }</div>
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

            <header class="sezzle-header">${this.translations.PI4sezzleHeader}</header>
            <p class="sezzle-row">
                <span>${this.translations.PI4sezzleHeaderChild}</span>
                <span>${this.translations.PI4sezzleHeaderChild2}</span>
            </p>
            <div class="sezzle-four-pay ${
                this.language !== "en" ? "sezzle-four-pay-fr-es" : ""
            }">
                    <div class="sezzle-pie-area">
                        <div class="due-today">
                            <div class="payment-item">
                                <div class="pie-icon" title="${this.translations.PI4pieAlt} 25%">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="47" viewBox="0 0 46 47" fill="none">
                                        <path d="M45.9594 23.0996C45.9594 35.7835 35.677 46.0659 22.9931 46.0659C10.3092 46.0659 0.0268555 35.7835 0.0268555 23.0996C0.0268555 10.4157 10.3092 0.133301 22.9931 0.133301C35.677 0.133301 45.9594 10.4157 45.9594 23.0996ZM11.51 23.0996C11.51 29.4415 16.6512 34.5827 22.9931 34.5827C29.3351 34.5827 34.4763 29.4415 34.4763 23.0996C34.4763 16.7576 29.3351 11.6164 22.9931 11.6164C16.6512 11.6164 11.51 16.7576 11.51 23.0996Z" fill="#8333D4" fill-opacity="0.05"/>
                                        <path d="M22.9927 0.133171C26.0086 0.133171 28.9951 0.727215 31.7815 1.88138C34.5679 3.03554 37.0997 4.72722 39.2323 6.85984C41.3649 8.99245 43.0566 11.5242 44.2107 14.3106C45.3649 17.097 45.9589 20.0835 45.9589 23.0994L34.4758 23.0994C34.4758 21.5915 34.1788 20.0982 33.6017 18.705C33.0246 17.3118 32.1788 16.0459 31.1125 14.9796C30.0462 13.9133 28.7803 13.0675 27.3871 12.4904C25.9939 11.9133 24.5007 11.6163 22.9927 11.6163L22.9927 0.133171Z" fill="#8333D4"/>
                                        <path d="M45.9589 23.0994C45.9589 26.2704 43.3884 28.8408 40.2174 28.8408C37.0464 28.8408 34.4758 26.2704 34.4758 23.0994C34.4758 19.9285 37.0464 17.3577 40.2174 17.3577C43.3884 17.3577 45.9589 19.9285 45.9589 23.0994Z" fill="#8333D4"/>
                                        <ellipse cx="40.2181" cy="23.0995" rx="5.74157" ry="5.74157" fill="#8333D4"/>
                                    </svg>
                                </div>
                                <div class="breakdown-row">
                                    <div class="percentage">25%</div>
                                    <div class="due">${this.translations.today}</div>
                                </div>
                            </div>
                        </div>
                        <div class="future-payments">
                            <div class="payment-item">
                                <div class="pie-icon" title="${this.translations.PI4pieAlt} 50%">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
                                        <path d="M46.1933 23.0998C46.1933 35.7837 35.9109 46.0661 23.227 46.0661C10.5431 46.0661 0.260742 35.7837 0.260742 23.0998C0.260742 10.4159 10.5431 0.133545 23.227 0.133545C35.9109 0.133545 46.1933 10.4159 46.1933 23.0998ZM11.7439 23.0998C11.7439 29.4418 16.8851 34.583 23.227 34.583C29.569 34.583 34.7101 29.4418 34.7101 23.0998C34.7101 16.7579 29.569 11.6167 23.227 11.6167C16.8851 11.6167 11.7439 16.7579 11.7439 23.0998Z" fill="#8333D4" fill-opacity="0.05"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2953 46.0655C35.9478 46.0287 46.1933 35.7605 46.1933 23.0993C46.1933 10.4154 35.911 0.133057 23.2271 0.133057V11.6162C29.569 11.6162 34.7102 16.7574 34.7102 23.0993C34.7102 29.4413 29.569 34.5825 23.2271 34.5825V34.5828C20.0562 34.5829 17.4858 37.1535 17.4858 40.3243C17.4858 43.4953 20.0564 46.0659 23.2274 46.0659C23.2501 46.0659 23.2727 46.0658 23.2953 46.0655Z" fill="#8333D4"/>
                                    </svg>
                                </div>
                                <div class="breakdown-row">
                                    <div class="percentage">25%</div>
                                    <div class="due">${this.translations.week} 2</div>
                                </div>
                            </div>
                            <div class="payment-item">
                                <div class="pie-icon" title="${this.translations.PI4pieAlt} 75%">
                                <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
                                    <path d="M46.0663 23.0996C46.0663 35.7835 35.784 46.0659 23.1001 46.0659C10.4161 46.0659 0.133789 35.7835 0.133789 23.0996C0.133789 10.4157 10.4161 0.133301 23.1001 0.133301C35.784 0.133301 46.0663 10.4157 46.0663 23.0996ZM11.6169 23.0996C11.6169 29.4415 16.7581 34.5827 23.1001 34.5827C29.442 34.5827 34.5832 29.4415 34.5832 23.0996C34.5832 16.7576 29.442 11.6164 23.1001 11.6164C16.7581 11.6164 11.6169 16.7576 11.6169 23.0996Z" fill="#8333D4" fill-opacity="0.05"/>
                                    <path d="M23.1001 0.133368C27.6424 0.133368 32.0826 1.48031 35.8594 4.00388C39.6362 6.52745 42.5799 10.1143 44.3181 14.3108C46.0564 18.5074 46.5112 23.1251 45.625 27.5801C44.7389 32.0352 42.5516 36.1274 39.3397 39.3392C36.1278 42.5511 32.0356 44.7385 27.5806 45.6246C23.1255 46.5108 18.5078 46.056 14.3112 44.3177C10.1147 42.5795 6.52787 39.6358 4.0043 35.859C1.48074 32.0822 0.133788 27.6419 0.133788 23.0996L11.6169 23.0996C11.6169 25.3708 12.2904 27.5909 13.5522 29.4793C14.814 31.3677 16.6074 32.8395 18.7057 33.7087C20.8039 34.5778 23.1128 34.8052 25.3403 34.3621C27.5678 33.9191 29.6139 32.8254 31.2199 31.2194C32.8258 29.6135 33.9195 27.5674 34.3625 25.3399C34.8056 23.1124 34.5782 20.8035 33.7091 18.7052C32.84 16.607 31.3681 14.8135 29.4797 13.5518C27.5914 12.29 25.3712 11.6165 23.1001 11.6165L23.1001 0.133368Z" fill="#8333D4"/>
                                    <path d="M11.6169 23.0996C11.6169 26.2706 9.04634 28.8412 5.87536 28.8412C2.70438 28.8412 0.133788 26.2706 0.133788 23.0996C0.133788 19.9287 2.70438 17.3581 5.87536 17.3581C9.04634 17.3581 11.6169 19.9287 11.6169 23.0996Z" fill="#8333D4"/>
                                    <ellipse cx="5.87536" cy="23.0997" rx="5.74157" ry="5.74157" fill="#8333D4"/>
                                </svg>
                                </div>
                                <div class="breakdown-row">
                                    <div class="percentage">25%</div>
                                    <div class="due">${this.translations.week} 4</div>
                                </div>
                            </div>
                            <div class="payment-item">
                                <div class="pie-icon" title="${this.translations.PI4pieAlt} 100%">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
                                        <path d="M46.4394 23.0996C46.4394 35.7835 36.157 46.0659 23.4731 46.0659C10.7892 46.0659 0.506836 35.7835 0.506836 23.0996C0.506836 10.4157 10.7892 0.133301 23.4731 0.133301C36.157 0.133301 46.4394 10.4157 46.4394 23.0996ZM11.99 23.0996C11.99 29.4415 17.1311 34.5827 23.4731 34.5827C29.8151 34.5827 34.9562 29.4415 34.9562 23.0996C34.9562 16.7576 29.8151 11.6164 23.4731 11.6164C17.1311 11.6164 11.99 16.7576 11.99 23.0996Z" fill="#8333D4"/>
                                    </svg>
                                </div>
                                <div class="breakdown-row">
                                    <div class="percentage">25%</div>
                                    <div class="due">${this.translations.week} 6<sup>3</sup></span></div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            <div class="sezzle-features">
                <p class="single-feature">
                ${this.translations.PI4selectSezzle}
                </p>
                <p class="single-feature">
                ${this.translations.PI4completePurchase}
                </p>
                <p class="single-feature">
                ${this.translations.PI4schedulePayments}
                </p>
            </div>
            <div class="terms-container">
                <p class="terms"><span><sup>1</sup>${
                    this.translations.terms1
                }</span><br /><span>${this.translations.termsHiw}</span></p>
                <p class="terms"><sup>2</sup>${this.translations.terms2}</p>
                <p class="terms">
                    <span class="webbank-terms"><sup>3</sup>${
                        this.translations.webBankTerms
                    }</span><span class="webbank-terms">${
                        this.translations.webBankTermsPI4
                    }</span>
                    <br />
                    <span>${this.translations.linkToCompleteTerms}</span>
                </p>
            </div>
            <div class="close-btn-container close-sezzle-modal">
                <button class="close-btn">${this.translations.PI4close}</button>
            </div>
				</div>
			</div>
		</div>`;
        const updatedModalHTML = modalHTML
          .replace(
            "%%min-price%%",
            escapeHTML(Intl.NumberFormat(this.language).format(this.minPrice / 100))
          )
          .replace(
            "%%max-price%%",
            escapeHTML(Intl.NumberFormat(this.language).format(this.maxPrice / 100))
          );
        modalNode.innerHTML = updatedModalHTML;
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
            this.modalTheme === "grayscale" ? "-grayscale" : "-color"
          } sezzle-checkout-modal-hidden`;
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
            document.querySelector(".sezzle-checkout-button-wrapper").focus();
          }
        });
      }
    );
    let sezzleModal = document.getElementsByClassName("sezzle-modal")[0];
    if (!sezzleModal)
      sezzleModal = document.getElementsByClassName("sezzle-checkout-modal")[0];
    sezzleModal.addEventListener("click", function (event) {
      event.stopPropagation();
    });
    this.modalKeyboardNavigation();
  }

  async getCompetitorModal(modalNode, competitorClass) {
    // competitorClass comes from hardcoded getCompetitorConfig() values
    // Validated to be non-empty; no sanitization needed for trusted internal values
    if (!competitorClass) {
        console.error("Invalid competitor class name");
        return;
    }

    const url = `https://media.sezzle.com/${competitorClass}/modal/${this.language}.html`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new error(
            `Failed to fetch ${competitorClass} modal, status: ${response.status}`,
        );
      }
      // HTML from Sezzle's own CDN is trusted
      modalNode.innerHTML = await response.text();
    } catch (error) {
      console.error(error);
    }
  }

  renderCompetitorModal(config) {
    // config.competitorClass comes from hardcoded getCompetitorConfig() values
    if (!config.competitorClass) {
        console.error("Invalid competitor class name");
        return;
    }

    const modalNode = document.createElement("section");
    modalNode.className = `sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-${config.competitorClass}-modal`;
    modalNode.style = "position: center";
    modalNode.style.display = "none";
    modalNode.role = "dialog";
    modalNode.ariaLabel = config.ariaLabel;
    modalNode.ariaDescription = `${this.translations.learnMoreAlt} ${config.ariaDescriptionName}`;

    if (config.modalHTML) {
      // modalHTML is provided by Sezzle configuration, considered trusted
      // CSS/styles are essential for modal rendering
      modalNode.innerHTML = config.modalHTML;
    } else {
      this.getCompetitorModal(modalNode, config.competitorClass);
    }

    document.getElementsByTagName("html")[0].appendChild(modalNode);
    Array.prototype.forEach.call(
      document.getElementsByClassName("close-sezzle-modal"),
      function (el) {
        el.addEventListener("click", function () {
          modalNode.style.display = "none";
          let newFocus = document.querySelector("#sezzle-modal-return");
          if (newFocus) {
            newFocus.focus();
            newFocus.removeAttribute("id");
          } else if (
              document.querySelector(
                  `.${config.competitorClass}-modal-info-link`,
              )
          ) {
              document
                  .querySelector(".sezzle-checkout-button-wrapper")
                  .getElementsByClassName(
                      `${config.competitorClass}-modal-info-link`,
                  )[0]
                  .focus();
          } else {
              document.querySelector(".sezzle-checkout-button-wrapper").focus();
          }
        });
      }
    );
    let sezzleModal = document.getElementsByClassName("sezzle-modal")[0];
    if (!sezzleModal)
      sezzleModal = document.getElementsByClassName("sezzle-checkout-modal")[0];
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
            if (!event.target.classList.contains("no-sezzle-info")) {
              var modalNode = document.getElementsByClassName(
                "sezzle-checkout-modal-lightbox"
              )[0];
              modalNode.style.display = "block";
              modalNode.getElementsByClassName("close-sezzle-modal")[0].focus();
              modalNode.getElementsByClassName(
                "sezzle-modal"
              )[0].className = `sezzle-modal sezzle-modal${
                this.modalTheme === "grayscale" ? "-grayscale" : "-color"
              }`;
              event.target.id = "sezzle-modal-return";
              event.preventDefault();
              event.stopPropagation();
            }
          }.bind(this)
        );
      }.bind(this)
    );

    const competitors = [
      "afterpay",
      "cash-app-afterpay",
      "zip",
      "affirm",
      "klarna",
      "shoppay"
    ];

    competitors.forEach(competitor => {
      const competitorModalLinks = sezzleElement.getElementsByClassName(
        `${competitor}-modal-info-link`
      );
      Array.prototype.forEach.call(
        competitorModalLinks,
        function (modalLink) {
          modalLink.addEventListener(
            "click",
            function (event) {
              const modalClass = `sezzle-${competitor}-modal`;
              document.getElementsByClassName(modalClass)[0].style.display = "block";
              document.getElementsByClassName(modalClass)[0].focus();
              event.target.id = "sezzle-modal-return";
              event.preventDefault();
              event.stopPropagation();
            }.bind(this)
          );
        }.bind(this)
      );
    });
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

      const competitors = [
        {
          competitorClass: "afterpay",
          ariaLabel: this.translations.afterpayInfo,
          ariaDescriptionName: "Afterpay",
          modalHTML: this.apModalHTML,
        },
        {
          competitorClass: "cash-app-afterpay",
          ariaLabel: this.translations.cashAppAfterpayInfo,
          ariaDescriptionName: "Cash App Afterpay",
          modalHTML: this.cashAppAfterpayModalHTML,
        },
        {
          competitorClass: "zip",
          ariaLabel: this.translations.zipInfo,
          ariaDescriptionName: "Zip",
          modalHTML: this.zipModalHTML,
        },
        {
          competitorClass: "affirm",
          ariaLabel: this.translations.affirmInfo,
          ariaDescriptionName: "Affirm",
          modalHTML: this.affirmModalHTML,
        },
        {
          competitorClass: "klarna",
          ariaLabel: this.translations.klarnaInfo,
          ariaDescriptionName: "Klarna",
          modalHTML: this.klarnaModalHTML,
        },
        {
          competitorClass: "shoppay",
          ariaLabel: this.translations.shoppayInfo,
          ariaDescriptionName: "Shoppay",
          modalHTML: this.shoppayModalHTML,
        }
      ];

      competitors.forEach(competitor => {
        if (
            document.getElementsByClassName(
                `${competitor.competitorClass}-modal-info-link`,
            ).length > 0
        ) {
            this.renderCompetitorModal(competitor);
        }
      });
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
