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
    this.numberOfPayments = options.numberOfPayments === 5 ? 5 : 4;
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
    this.activeTab = 1;
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
            case "numberOfPayments":
                const widgetInstallmentNode = document.createTextNode(
                  this.numberOfPayments,
                );
                sezzleButtonText.appendChild(widgetInstallmentNode);
                break;
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

  getFormattedPrice(
    numberOfPayments = this.numberOfPayments,
    amount = this.amount,
  ) {
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
      : price / numberOfPayments;
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

  /** updateInstallmentContent
   * @description replaces text content of given element with new price
   * @param {HTMLElement} elements the element to update
   * @param {string} priceString the new price to populate
   * @returns none
   */
  updateInstallmentContent(elements, priceString) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].textContent = priceString;
    }
  }

  /** handleCarousel
   * @description rotates carousel and applies classes for conditional styling
   * @param none
   * @returns none
   */
  handleCarousel(modalNode) {
    const CAROUSEL_MIN_TAB = 1;
    const CAROUSEL_MAX_TAB = 3;

    // Prevent attaching listeners multiple times
    if (modalNode.dataset.carouselInitialized === "true") {
      return;
    }
    modalNode.dataset.carouselInitialized = "true";

    const arrows = modalNode.getElementsByClassName("arrow");
    for (let i = 0; i < arrows.length; i++) {
      arrows[i].addEventListener("click", (e) => {
        let btn = e.currentTarget;
        if (!btn.className.includes("disabled")) {
          if (btn.className.includes("arrow-right")) {
            this.activeTab++;
            btn.parentElement.firstElementChild.className = "arrow arrow-left";
            if (this.activeTab === CAROUSEL_MAX_TAB) {
              btn.className = "arrow arrow-right disabled";
            }
          } else {
            this.activeTab--;
            btn.parentElement.lastElementChild.className = "arrow arrow-right";
            if (this.activeTab === CAROUSEL_MIN_TAB) {
              btn.className = "arrow arrow-left disabled";
            }
          }
          let carouselWrapper = btn.parentElement.parentElement.parentElement;
          carouselWrapper.querySelector(".carousel").className =
            "carousel position-" + this.activeTab;
          let dots = carouselWrapper.querySelector(".carousel-dots").children;
          for (let j = 0; j < dots.length; j++) {
            dots[j].className = this.activeTab - 1 === j ? "dot active" : "dot";
          }
        }
      });
    }
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
            } <span>&nbsp${safeCurrency + safePrice}</span></div>
            <div class="sezzle-lt-payment-options ${terms[2]}-month" ${
              terms[2] === undefined
                ? `style="display: none;"`
                : `style="display: block;"`
            }>
                <div class="plan">
                    <div class="monthly-amount">
										<span>${
                      safeCurrency +
                      escapeHTML(
                        this.formatMonthly(
                          priceString,
                          this.parseMode,
                          terms[2],
                          this.bestAPR,
                        ),
                      )
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
                      escapeHTML(
                        this.formatAdjustedTotal(
                          priceString,
                          this.parseMode,
                          terms[2],
                          this.bestAPR,
                        ),
                      )
                    }</span></div>
                    <div class="interest-amount">${this.translations.LTinterest} <span>${
                      safeCurrency +
                      escapeHTML(
                        this.formatTotalInterest(
                          priceString,
                          this.parseMode,
                          terms[2],
                          this.bestAPR,
                        ),
                      )
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
                        escapeHTML(
                          this.formatMonthly(
                            priceString,
                            this.parseMode,
                            terms[1],
                            this.bestAPR,
                          ),
                        )
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
                      escapeHTML(
                        this.formatAdjustedTotal(
                          priceString,
                          this.parseMode,
                          terms[1],
                          this.bestAPR,
                        ),
                      )
                    }</span></div>
                    <div class="interest-amount">${this.translations.LTinterest} <span>${
                      safeCurrency +
                      escapeHTML(
                        this.formatTotalInterest(
                          priceString,
                          this.parseMode,
                          terms[1],
                          this.bestAPR,
                        ),
                      )
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
                        escapeHTML(
                          this.formatMonthly(
                            priceString,
                            this.parseMode,
                            terms[0],
                            this.bestAPR,
                          ),
                        )
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
                      escapeHTML(
                        this.formatAdjustedTotal(
                          priceString,
                          this.parseMode,
                          terms[0],
                          this.bestAPR,
                        ),
                      )
                    }</span></div>
										<div class="interest-amount">${this.translations.LTinterest} <span>${
                      safeCurrency +
                      escapeHTML(
                        this.formatTotalInterest(
                          priceString,
                          this.parseMode,
                          terms[0],
                          this.bestAPR,
                        ),
                      )
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
      } else if (this.numberOfPayments === 5) {
        let currency = String.fromCharCode(this.currencySymbol(this.amount));
        let priceString =
          this.amount.indexOf(currency) > -1
            ? this.amount.split(currency)[1]
            : this.amount;
        priceString =
          this.parseMode === "comma"
            ? priceString.replace(".", "").replace(",", ".")
            : priceString.replace(",", "");
        // Escape currency and price values for XSS protection
        let safeCurrency = escapeHTML(currency);
        let safePrice = escapeHTML(
          this.addDelimiters(priceString, this.parseMode),
        );
        modalNode.innerHTML = `
                <div id="sezzle-modal-container" role="dialog" aria-label="Sezzle Modal" aria-description="${
                  this.translations.aboutSezzle
                }" class="sezzle-checkout-modal-hidden sezzle-five-pay">
		<div class="sezzle-modal">
				<div><button role="button" aria-label="${
          this.translations.closeSezzleModal
        }" class="close-sezzle-modal"></button></div>
				<div class="sezzle-logo" title="Sezzle"></div>
				<div id="sezzle-modal-core-content" class="sezzle-modal-content">
                    <p class='trusted'>${this.translations.PI5trusted}</p>
            <header class='sezzle-header'>${this.translations.PI5header}</header>
            <div class='payment-plan-wrapper'>
                <p class='sample-payments ${
                  this.language === "fr" ? "sezzle-five-pay-fr" : ""
                }'>
                    <span class="sample-payments-title">${
                      this.translations.PI5SeePlans
                    }</span>
                    <span class="input-amount-container"> 
                        <label class="input-amount-label" for="PI5-input-amount">${
                          this.translations.PI5Amount
                        }</label>
                        <input class='price input-amount' id="PI5-input-amount" value='${
                          safeCurrency + safePrice
                        }'/>
                    </span>
                </p>
                <div class='payment-cards'>
                    <div class='payment-card 4-pay-installment-card'>
                        <div class='plan-summary'>
                            <div class='purple'>
                                <div class='left'>
                                    <span class='price 4-pay-installment'>${this.getFormattedPrice(
                                      4,
                                    )}</span> 
                                    <span class='due'>${
                                      this.translations.today
                                    }</span>
                                </div>
                                <div class='right'>
                                    <span class='pill'>${
                                      this.translations.PI5payIn
                                    } 4</span>
                                </div>
                            </div>
                            <div class='grey'>
                                <span class="4-pay-installment">${this.getFormattedPrice(
                                  4,
                                )}</span> ${this.translations.PI5every2Weeks}
                            </div>
                        </div>
                        <div class='payment-breakdown'>
                            <div class='installment'>
                                <div class='graphic'>
                                    <div class='dash left fourth'>
                                        <svg width="30" height="2" viewBox="0 0 30 2" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg" style="visibility: hidden">
                                            <rect x="0.75" width="30" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                    <div class='dot'>
                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 16C12.8183 16 16.4 12.4183 16.4 8C16.4 3.58172 12.8183 0 8.39999 0C3.98172 0 0.399994 3.58172 0.399994 8C0.399994 12.4183 3.98172 16 8.39999 16Z" fill="white"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 12C10.6091 12 12.4 10.2091 12.4 8C12.4 5.79086 10.6091 4 8.39999 4C6.19085 4 4.39999 5.79086 4.39999 8C4.39999 10.2091 6.19085 12 8.39999 12Z" fill="#8333D4"/>
                                        </svg>
                                    </div>
                                    <div class='dash right fourth'>
                                        <svg width="30" height="2" viewBox="0 0 30 2" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.75" width="30" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class='detail first-installment'>
                                    <div class='amount 4-pay-installment'>
                                        ${this.getFormattedPrice(4)}
                                    </div>
                                    <div class='due'>
                                        ${this.translations.today}
                                    </div>
                                </div>
                            </div>
                            <div class='installment'>
                                <div class='graphic'>
                                    <div class='dash left fourth'>
                                        <svg width="30" height="2" viewBox="0 0 30 2" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.75" width="30" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                    <div class='dot'>
                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 16C12.8183 16 16.4 12.4183 16.4 8C16.4 3.58172 12.8183 0 8.39999 0C3.98172 0 0.399994 3.58172 0.399994 8C0.399994 12.4183 3.98172 16 8.39999 16Z" fill="white"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 12C10.6091 12 12.4 10.2091 12.4 8C12.4 5.79086 10.6091 4 8.39999 4C6.19085 4 4.39999 5.79086 4.39999 8C4.39999 10.2091 6.19085 12 8.39999 12Z" fill="#8333D4"/>
                                        </svg>
                                    </div>
                                    <div class='dash right fourth'>
                                        <svg width="30" height="2" viewBox="0 0 30 2" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.75" width="30" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class='detail'>
                                    <div class='amount 4-pay-installment'>
                                        ${this.getFormattedPrice(4)}
                                    </div>
                                    <div class='due'>
                                        2 ${this.translations.PI5weeks}
                                    </div>
                                </div>
                            </div>
                            <div class='installment'>
                                <div class='graphic'>
                                    <div class='dash left fourth'>
                                        <svg width="30" height="2" viewBox="0 0 30 2" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.75" width="30" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                    <div class='dot'>
                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 16C12.8183 16 16.4 12.4183 16.4 8C16.4 3.58172 12.8183 0 8.39999 0C3.98172 0 0.399994 3.58172 0.399994 8C0.399994 12.4183 3.98172 16 8.39999 16Z" fill="white"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 12C10.6091 12 12.4 10.2091 12.4 8C12.4 5.79086 10.6091 4 8.39999 4C6.19085 4 4.39999 5.79086 4.39999 8C4.39999 10.2091 6.19085 12 8.39999 12Z" fill="#8333D4"/>
                                        </svg>
                                    </div>
                                    <div class='dash right fourth'>
                                        <svg width="30" height="2" viewBox="0 0 30 2" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.75" width="30" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class='detail'>
                                    <div class='amount 4-pay-installment'>
                                        ${this.getFormattedPrice(4)}
                                    </div>
                                    <div class='due'>
                                        4 ${this.translations.PI5weeks}
                                    </div>
                                </div>
                            </div>
                            <div class='installment'>
                                <div class='graphic'>
                                    <div class='dash left fourth'>
                                        <svg width="30" height="2" viewBox="0 0 30 2" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.75" width="30" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                    <div class='dot'>
                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 16C12.8183 16 16.4 12.4183 16.4 8C16.4 3.58172 12.8183 0 8.39999 0C3.98172 0 0.399994 3.58172 0.399994 8C0.399994 12.4183 3.98172 16 8.39999 16Z" fill="white"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 12C10.6091 12 12.4 10.2091 12.4 8C12.4 5.79086 10.6091 4 8.39999 4C6.19085 4 4.39999 5.79086 4.39999 8C4.39999 10.2091 6.19085 12 8.39999 12Z" fill="#8333D4"/>
                                        </svg>
                                    </div>
                                    <div class='dash right fourth'>
                                        <svg width="30" height="2" viewBox="0 0 30 2" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg" style="visibility: hidden">
                                            <rect x="0.75" width="30" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class='detail'>
                                    <div class='amount 4-pay-installment'>
                                        ${this.getFormattedPrice(4)}
                                    </div>
                                    <div class='due'>
                                        6 ${this.translations.PI5weeks}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='payment-card 5-pay-installment-card'>
                        <div class='plan-summary'>
                            <div class='purple'>
                                <div class='left'>
                                    <span class='price 5-pay-installment'>${this.getFormattedPrice(
                                      5,
                                    )}</span> 
                                    <span class='due'>${
                                      this.translations.today
                                    }</span>
                                </div>
                                <div class='right'>
                                    <span class='pill'>${
                                      this.translations.PI5payIn
                                    } 5</span>
                                </div>
                            </div>
                            <div class='grey'>
                                <span class="5-pay-installment">${this.getFormattedPrice(
                                  5,
                                )}</span> ${this.translations.PI5every2Weeks}
                            </div>
                        </div>
                        <div class='payment-breakdown'>
                            <div class='installment'>
                                <div class='graphic'>
                                    <div class='dash left fifth'>
                                        <svg width="22" height="2" viewBox="0 0 22 2" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg" style="visibility: hidden">
                                            <rect x="0.399994" width="22" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                    <div class='dot'>
                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 16C12.8183 16 16.4 12.4183 16.4 8C16.4 3.58172 12.8183 0 8.39999 0C3.98172 0 0.399994 3.58172 0.399994 8C0.399994 12.4183 3.98172 16 8.39999 16Z" fill="white"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 12C10.6091 12 12.4 10.2091 12.4 8C12.4 5.79086 10.6091 4 8.39999 4C6.19085 4 4.39999 5.79086 4.39999 8C4.39999 10.2091 6.19085 12 8.39999 12Z" fill="#8333D4"/>
                                        </svg>
                                    </div>
                                    <div class='dash right fifth'>
                                        <svg width="22" height="2" viewBox="0 0 22 2" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.399994" width="22" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class='detail first-installment'>
                                    <div class='amount 5-pay-installment'>
                                        ${this.getFormattedPrice(5)}
                                    </div>
                                    <div class='due'>
                                        ${this.translations.today}
                                    </div>
                                </div>
                            </div>
                            <div class='installment'>
                                <div class='graphic'>
                                    <div class='dash left fifth'>
                                        <svg width="22" height="2" viewBox="0 0 22 2" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.399994" width="22" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                    <div class='dot'>
                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 16C12.8183 16 16.4 12.4183 16.4 8C16.4 3.58172 12.8183 0 8.39999 0C3.98172 0 0.399994 3.58172 0.399994 8C0.399994 12.4183 3.98172 16 8.39999 16Z" fill="white"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 12C10.6091 12 12.4 10.2091 12.4 8C12.4 5.79086 10.6091 4 8.39999 4C6.19085 4 4.39999 5.79086 4.39999 8C4.39999 10.2091 6.19085 12 8.39999 12Z" fill="#8333D4"/>
                                        </svg>
                                    </div>
                                    <div class='dash right fifth'>
                                        <svg width="22" height="16" viewBox="0 0 22 16" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.399994" y="7" width="22" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class='detail'>
                                    <div class='amount 5-pay-installment'>
                                        ${this.getFormattedPrice(5)}
                                    </div>
                                    <div class='due'>
                                        2 ${this.translations.PI5weeks}
                                    </div>
                                </div>
                            </div>
                            <div class='installment'>
                                <div class='graphic'>
                                    <div class='dash left fifth'>
                                        <svg width="22" height="16" viewBox="0 0 22 16" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.399994" y="7" width="22" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                    <div class='dot'>
                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 16C12.8183 16 16.4 12.4183 16.4 8C16.4 3.58172 12.8183 0 8.39999 0C3.98172 0 0.399994 3.58172 0.399994 8C0.399994 12.4183 3.98172 16 8.39999 16Z" fill="white"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 12C10.6091 12 12.4 10.2091 12.4 8C12.4 5.79086 10.6091 4 8.39999 4C6.19085 4 4.39999 5.79086 4.39999 8C4.39999 10.2091 6.19085 12 8.39999 12Z" fill="#8333D4"/>
                                        </svg>
                                    </div>
                                    <div class='dash right fifth'>
                                        <svg width="22" height="16" viewBox="0 0 22 16" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.399994" y="7" width="22" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class='detail'>
                                    <div class='amount 5-pay-installment'>
                                        ${this.getFormattedPrice(5)}
                                    </div>
                                    <div class='due'>
                                        4 ${this.translations.PI5weeks}
                                    </div>
                                </div>
                            </div>
                            <div class='installment'>
                                <div class='graphic'>
                                    <div class='dash left fifth'>
                                        <svg width="22" height="16" viewBox="0 0 22 16" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.399994" y="7" width="22" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                    <div class='dot'>
                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 16C12.8183 16 16.4 12.4183 16.4 8C16.4 3.58172 12.8183 0 8.39999 0C3.98172 0 0.399994 3.58172 0.399994 8C0.399994 12.4183 3.98172 16 8.39999 16Z" fill="white"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 12C10.6091 12 12.4 10.2091 12.4 8C12.4 5.79086 10.6091 4 8.39999 4C6.19085 4 4.39999 5.79086 4.39999 8C4.39999 10.2091 6.19085 12 8.39999 12Z" fill="#8333D4"/>
                                        </svg>
                                    </div>
                                    <div class='dash right fifth'>
                                        <svg width="22" height="16" viewBox="0 0 22 16" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.399994" y="7" width="22" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class='detail'>
                                    <div class='amount 5-pay-installment'>
                                        ${this.getFormattedPrice(5)}
                                    </div>
                                    <div class='due'>
                                        6 ${this.translations.PI5weeks}
                                    </div>
                                </div>
                            </div>
                            <div class='installment'>
                                <div class='graphic'>
                                    <div class='dash left fifth'>
                                        <svg width="22" height="16" viewBox="0 0 22 16" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.399994" y="7" width="22" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                    <div class='dot'>
                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 16C12.8183 16 16.4 12.4183 16.4 8C16.4 3.58172 12.8183 0 8.39999 0C3.98172 0 0.399994 3.58172 0.399994 8C0.399994 12.4183 3.98172 16 8.39999 16Z" fill="white"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.39999 12C10.6091 12 12.4 10.2091 12.4 8C12.4 5.79086 10.6091 4 8.39999 4C6.19085 4 4.39999 5.79086 4.39999 8C4.39999 10.2091 6.19085 12 8.39999 12Z" fill="#8333D4"/>
                                        </svg>
                                    </div>
                                    <div class='dash right fifth'>
                                        <svg width="22" height="2" viewBox="0 0 22 2" fill="#E8E8E8" xmlns="http://www.w3.org/2000/svg" style="visibility: hidden">
                                            <rect x="0.399994" width="22" height="2" fill="#E8E8E8"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class='detail'>
                                    <div class='amount 5-pay-installment'>
                                        ${this.getFormattedPrice(5)}
                                    </div>
                                    <div class='due'>
                                        8 ${this.translations.PI5weeks}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='how-to-sezzle'>
                <div class='carousel-header'>
                    <div class='how-to-text-wrapper'>
                        <span class='how-to-text'>${
                          this.translations.PI5howToPay
                        }</span>
                        <div class='how-to-logo'>
                            <svg width="58" height="14" viewBox="0 0 58 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.969597 9.41471C2.2624 10.681 4.35809 10.681 5.65089 9.41471L5.7748 9.29334C6.42084 8.66055 5.12804 5.34085 5.7748 4.70805L0.969597 9.41471Z" fill="url(#paint0_linear_366_310)"/>
                                <path d="M5.89942 4.58599L5.77552 4.70736C5.12947 5.34015 6.42156 8.65985 5.77552 9.29265L10.5807 4.58599C9.93396 3.9532 9.08737 3.6368 8.24007 3.6368C7.39277 3.6361 6.54547 3.9532 5.89942 4.58599Z" fill="url(#paint1_linear_366_310)"/>
                                <path d="M0.969599 4.82942C-0.3232 6.09571 -0.3232 8.14843 0.969599 9.41471L5.90014 4.58529C7.19294 3.319 7.19294 1.26629 5.90014 0L0.969599 4.82942Z" fill="url(#paint2_linear_366_310)"/>
                                <path d="M5.65089 9.41471C4.35809 10.681 4.35809 12.7337 5.65089 14L10.5814 9.17058C11.8742 7.90429 11.8742 5.85157 10.5814 4.58529L5.65089 9.41471Z" fill="url(#paint3_linear_366_310)"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M29.3202 6.07817C29.5143 6.37212 29.6626 6.69132 29.7621 7.02526C29.8588 7.35007 29.6683 7.69172 29.3367 7.78713L24.1318 9.28212C24.3546 9.64552 24.6676 9.94228 25.0422 10.1422C25.6101 10.4453 26.2834 10.5161 26.9008 10.3386C27.183 10.2573 27.4437 10.131 27.6743 9.96262C27.685 9.94999 27.7058 9.93175 27.7273 9.91492C27.978 9.72129 28.1843 9.48417 28.3397 9.21197C28.4507 9.01694 28.6613 8.89627 28.8897 8.89627C28.9972 8.89627 29.1032 8.92363 29.197 8.97485C29.5 9.14111 29.6088 9.51784 29.4391 9.81459C29.3438 9.98226 29.2343 10.1429 29.1125 10.293L29.0824 10.3295C28.6061 10.9034 27.9758 11.3117 27.2532 11.5186C26.9115 11.6176 26.5598 11.6674 26.2075 11.6674C25.5944 11.6674 24.9834 11.5137 24.4405 11.2226C23.672 10.8115 23.1449 10.2608 22.8304 9.53959C22.8283 9.53538 22.7273 9.2716 22.6643 9.06535L22.6614 9.05623C22.3871 8.13019 22.4959 7.15504 22.9672 6.30828C23.4414 5.45731 24.2242 4.83995 25.1725 4.56915C26.1115 4.30116 27.1321 4.4085 27.9866 4.86521C28.5281 5.15564 28.9886 5.57517 29.3202 6.07817ZM27.3842 5.94348C27.0232 5.75125 26.62 5.64953 26.2175 5.64953C25.9861 5.64953 25.7534 5.6825 25.5256 5.74774C24.8996 5.92804 24.3832 6.33564 24.0709 6.89617C23.8632 7.26869 23.7601 7.68541 23.7716 8.10423L28.3032 6.80216C28.2942 6.78779 28.285 6.77342 28.2758 6.75933C28.2725 6.75415 28.2692 6.74902 28.2659 6.74394C28.0453 6.4107 27.7402 6.13359 27.3842 5.94348Z" fill="#382757"/>
                                <path d="M36.4424 10.4958H32.9988L36.85 4.955C36.923 4.85047 36.9302 4.71578 36.87 4.60353C36.8098 4.49128 36.6917 4.42183 36.562 4.42183H31.6659C31.3407 4.42183 31.0764 4.6807 31.0764 4.9992C31.0764 5.3177 31.3407 5.57657 31.6659 5.57657H34.9469L31.0972 11.1174C31.0241 11.2226 31.017 11.3573 31.0771 11.4688C31.1373 11.5811 31.2555 11.6498 31.3851 11.6498H36.4417C36.7669 11.6498 37.0312 11.391 37.0312 11.0725C37.0319 10.7554 36.7676 10.4958 36.4424 10.4958Z" fill="#382757"/>
                                <path d="M44.0717 10.4958H40.6288L44.4793 4.955C44.5523 4.85047 44.5595 4.71578 44.4993 4.60353C44.4391 4.49198 44.321 4.42253 44.1913 4.42253H39.2959C38.9707 4.42253 38.7064 4.6814 38.7064 4.9999C38.7064 5.3184 38.9707 5.57727 39.2959 5.57727H42.5769L38.7272 11.1181C38.6549 11.2233 38.647 11.358 38.7071 11.4695C38.768 11.5818 38.8855 11.6505 39.0151 11.6505H44.0717C44.3969 11.6505 44.6612 11.3917 44.6612 11.0732C44.6612 10.7554 44.3969 10.4958 44.0717 10.4958Z" fill="#382757"/>
                                <path d="M47.4717 1.29575C47.1465 1.29575 46.8822 1.55462 46.8822 1.87312V11.0935C46.8822 11.412 47.1465 11.6709 47.4717 11.6709C47.7968 11.6709 48.0611 11.4113 48.0611 11.0935V1.87312C48.0611 1.55462 47.7968 1.29575 47.4717 1.29575Z" fill="#382757"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M56.7003 6.07888C56.8937 6.37352 57.0427 6.69202 57.1415 7.02596C57.2382 7.35007 57.0477 7.69172 56.7161 7.78713L51.5105 9.28353C51.7325 9.64693 52.0462 9.94368 52.4208 10.1436C52.9888 10.4467 53.6628 10.5175 54.2795 10.3401C54.5624 10.2587 54.8231 10.1324 55.0537 9.96402C55.0652 9.9514 55.0852 9.93316 55.1074 9.91632C55.3574 9.72269 55.5637 9.48627 55.7191 9.21337C55.8301 9.01834 56.0407 8.89768 56.2691 8.89768C56.3766 8.89768 56.4826 8.92504 56.5764 8.97625C56.8794 9.14252 56.9882 9.51924 56.8185 9.816C56.7239 9.98156 56.6144 10.1422 56.4926 10.293L56.4618 10.3316C55.9862 10.9048 55.3559 11.3131 54.6333 11.52C54.2916 11.619 53.9392 11.6688 53.5876 11.6688C52.9745 11.6688 52.3635 11.5151 51.8206 11.224C51.0521 10.8122 50.525 10.2622 50.2105 9.54099C50.2084 9.53608 50.1074 9.2723 50.0444 9.06675L50.0415 9.05693C49.7679 8.13089 49.8761 7.15504 50.3481 6.30898C50.8215 5.45801 51.6043 4.84065 52.5526 4.56986C53.4923 4.30187 54.5115 4.4092 55.3667 4.86591C55.9074 5.15635 56.3687 5.57587 56.7003 6.07888ZM54.7643 5.94348C54.4033 5.75125 54.0001 5.64953 53.5976 5.64953C53.3655 5.64953 53.1328 5.6825 52.9057 5.74774C52.2797 5.92804 51.7633 6.33564 51.451 6.89617C51.2433 7.26869 51.1402 7.68471 51.1517 8.10423L55.6833 6.80216C55.6744 6.7878 55.6651 6.77344 55.656 6.75935C55.6526 6.75417 55.6493 6.74903 55.646 6.74394C55.4247 6.4107 55.1203 6.13359 54.7643 5.94348Z" fill="#382757"/>
                                <path d="M20.6867 8.44027C20.512 8.18982 20.2592 7.98076 19.9368 7.8194C19.409 7.55632 18.725 7.43566 18.0689 7.33534L17.9651 7.3199C17.5045 7.24975 17.0282 7.17679 16.7224 7.02525C16.4911 6.9102 16.4087 6.78112 16.4087 6.52926C16.4087 6.04169 16.9509 5.67408 17.6693 5.67408C18.5273 5.67408 19.0057 5.91962 19.5429 6.24023C19.6425 6.29986 19.7571 6.33143 19.8731 6.33143C20.0966 6.33143 20.2993 6.22058 20.416 6.03397C20.5041 5.89226 20.5313 5.72529 20.4912 5.56324C20.4511 5.40188 20.3494 5.26508 20.2047 5.17879C19.9075 5.0006 19.5823 4.81539 19.1719 4.67087C18.7099 4.50882 18.2186 4.42954 17.67 4.42954C17.0082 4.42954 16.3886 4.62668 15.9267 4.98446C15.4189 5.37733 15.1388 5.92593 15.1388 6.52926C15.1388 7.25185 15.4883 7.80747 16.1494 8.1351C16.635 8.37572 17.2123 8.46342 17.7702 8.5483L17.8734 8.56374C19.3044 8.78332 19.7184 8.98116 19.7184 9.44488C19.7184 10.0194 19.1311 10.3955 18.2222 10.4032H18.1892C17.2137 10.4032 16.6665 10.0363 16.3729 9.83914C16.3242 9.80687 16.2826 9.77811 16.2411 9.75285C16.1401 9.69112 16.0241 9.65885 15.9052 9.65885C15.6846 9.65885 15.4826 9.76829 15.3659 9.95139C15.1804 10.2425 15.2713 10.627 15.5685 10.8087C15.585 10.8185 15.6101 10.8353 15.638 10.8543L15.6552 10.8655C16.004 11.0991 16.8205 11.6477 18.1892 11.6477H18.2329C19.0222 11.6407 19.6998 11.4331 20.194 11.0458C20.7061 10.6438 20.9883 10.0756 20.9883 9.44558C20.9876 9.06324 20.8859 8.72579 20.6867 8.44027Z" fill="#382757"/>
                                <defs>
                                    <linearGradient id="paint0_linear_366_310" x1="6.70119" y1="8.23486" x2="4.07958" y2="5.85164" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#CE5DCB"/>
                                        <stop offset="0.2095" stop-color="#C558CC"/>
                                        <stop offset="0.5525" stop-color="#AC4ACF"/>
                                        <stop offset="0.9845" stop-color="#8534D4"/>
                                        <stop offset="1" stop-color="#8333D4"/>
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_366_310" x1="5.58896" y1="9.29233" x2="10.5806" y2="9.29233" gradientUnits="userSpaceOnUse">
                                        <stop offset="0.0237" stop-color="#FF5667"/>
                                        <stop offset="0.6592" stop-color="#FC8B82"/>
                                        <stop offset="1" stop-color="#FBA28E"/>
                                    </linearGradient>
                                    <linearGradient id="paint2_linear_366_310" x1="-0.000179058" y1="9.41484" x2="6.86972" y2="9.41484" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#00B874"/>
                                        <stop offset="0.5126" stop-color="#29D3A2"/>
                                        <stop offset="0.6817" stop-color="#53DFB6"/>
                                        <stop offset="1" stop-color="#9FF4D9"/>
                                    </linearGradient>
                                    <linearGradient id="paint3_linear_366_310" x1="4.6811" y1="14" x2="11.5509" y2="14" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#FCD77E"/>
                                        <stop offset="0.5241" stop-color="#FEA500"/>
                                        <stop offset="1" stop-color="#FF5B00"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                    <div class='arrows'>
                        <button type='button' class='arrow arrow-left disabled' aria-label='${this.translations.PI5previousSlide}' aria-disabled='true'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.5 16.4078C14.825 16.0828 14.825 15.5578 14.5 15.2328L11.2667 11.9995L14.5 8.76614C14.825 8.44114 14.825 7.91614 14.5 7.59114C14.175 7.26614 13.65 7.26614 13.325 7.59114L9.5 11.4161C9.175 11.7411 9.175 12.2661 9.5 12.5911L13.325 16.4161C13.6417 16.7328 14.175 16.7328 14.5 16.4078Z" fill="#8333D4"/>
                            </svg>
                        </button>
                        <button class='arrow arrow-right' aria-label='${this.translations.nextSlide}'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.5 7.59219C9.175 7.91719 9.175 8.44219 9.5 8.76719L12.7333 12.0005L9.5 15.2339C9.175 15.5589 9.175 16.0839 9.5 16.4089C9.825 16.7339 10.35 16.7339 10.675 16.4089L14.5 12.5839C14.825 12.2589 14.825 11.7339 14.5 11.4089L10.675 7.58386C10.3583 7.26719 9.825 7.26719 9.5 7.59219Z" fill="#8333D4"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class='carousel position-1'>
                    <div class='carousel-item'>
                        <div class='carousel-item-content'>
                            <div class='step-number'>
                                <span class='step-number-content'>1</span>
                            </div>
                            <div class='step-name'>${this.translations.PI5Step1}</div>
                            <div class='step-image'>
                                <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.20398 0.532364H23.2401C25.1839 0.532364 26.7606 2.10906 26.7606 4.05287V14.5919C26.7605 16.5356 25.1838 18.1115 23.2401 18.1115H4.20398C2.26027 18.1115 0.683633 16.5356 0.683472 14.5919V4.05287C0.683472 2.10906 2.26017 0.532364 4.20398 0.532364Z" fill="#F9F5FD" stroke="#E8E8E8" stroke-width="0.479474"/>
                                    <path d="M9.92301 11.1327C10.8766 12.0668 12.4225 12.0668 13.3761 11.1327L13.4675 11.0432C13.944 10.5764 12.9904 8.12767 13.4675 7.6609L9.92301 11.1327Z" fill="url(#paint0_linear_366_339)"/>
                                    <path d="M13.5596 7.57113L13.4682 7.66065C12.9917 8.12742 13.9447 10.5762 13.4682 11.0429L17.0127 7.57113C16.5356 7.10436 15.9112 6.87097 15.2861 6.87097C14.6611 6.87046 14.0361 7.10436 13.5596 7.57113Z" fill="url(#paint1_linear_366_339)"/>
                                    <path d="M9.9228 7.75064C8.96918 8.6847 8.96918 10.1989 9.9228 11.1329L13.5597 7.57055C14.5134 6.6365 14.5134 5.12234 13.5597 4.18828L9.9228 7.75064Z" fill="url(#paint2_linear_366_339)"/>
                                    <path d="M13.3763 11.1335C12.4226 12.0676 12.4226 13.5817 13.3763 14.5158L17.0132 10.9534C17.9668 10.0194 17.9668 8.50523 17.0132 7.57117L13.3763 11.1335Z" fill="url(#paint3_linear_366_339)"/>
                                    <path d="M24.8175 26.5304C25.9447 25.012 26.0538 22.3367 26.0538 21.1436V20.0229C26.0538 19.6975 25.9084 19.3721 25.6902 19.119C25.4356 18.866 25.1084 18.7575 24.7811 18.7575C24.5993 18.7575 24.4538 18.7937 24.3084 18.866C24.1993 18.2514 23.6902 17.7814 23.0357 17.7814C22.7447 17.7814 22.5266 17.8537 22.3084 17.9983C22.0902 17.5644 21.6538 17.2752 21.1448 17.2752C20.9266 17.2752 20.7448 17.3475 20.563 17.4198V13.9491C20.563 13.2261 19.9811 12.6476 19.2539 12.6476C18.5266 12.6476 17.9448 13.2261 17.9448 13.9491V20.4567L17.3993 19.119C17.2175 18.649 16.7448 18.3237 16.1994 18.3237C16.0175 18.3237 15.8721 18.3598 15.7266 18.4321C15.0721 18.7213 14.7448 19.4444 14.9994 20.0952L16.3448 24.4697C16.3812 24.6505 16.6721 25.9158 17.363 26.7112C17.2175 26.8558 17.1448 27.0004 17.1448 27.2174V28.4466C17.1448 28.8443 17.4721 29.1335 17.8357 29.1335H24.5629C24.9629 29.1335 25.2538 28.8081 25.2538 28.4466V27.1812C25.2902 26.892 25.1084 26.6389 24.8175 26.5304ZM17.0357 24.2889L15.6175 19.8059C15.5084 19.5167 15.6539 19.1552 15.9448 19.0467C16.2357 18.9383 16.2357 19.1913 16.3448 19.4806L17.6177 22.4361C17.6904 22.5807 18.163 22.5897 18.3448 22.5536C18.5266 22.5174 18.6357 22.3728 18.6357 22.1921V13.9491C18.6357 13.6237 18.8902 13.3707 19.2175 13.3707C19.5448 13.3707 19.5496 13.256 19.5496 13.5814V19.119C19.5496 19.2998 19.9448 19.4806 20.163 19.4806C20.3448 19.4806 20.5266 19.3359 20.5266 19.119V18.5406C20.5266 18.2152 20.7811 17.9621 21.1084 17.9621C21.4357 17.9621 21.497 18.2152 21.497 18.5406V19.7336C21.497 19.9144 21.8357 20.0952 22.0538 20.0952C22.2357 20.0952 22.4175 19.9506 22.4175 19.7336V19.0467C22.4175 18.7213 22.672 18.4683 22.9993 18.4683C23.3266 18.4683 23.5167 18.7213 23.5167 19.0467V20.3121C23.5167 20.4929 23.7266 20.6736 23.9447 20.6736C24.1629 20.6736 24.3084 20.529 24.3084 20.3121V19.6975C24.5266 19.4444 24.9629 19.3721 25.1811 19.6252C25.2902 19.7336 25.3629 19.8782 25.3629 20.059V21.1798C25.3993 23.7105 24.8538 25.6989 23.9447 26.4943H18.1993C17.5084 26.0605 17.1084 24.7589 17.0357 24.2889ZM24.5629 28.4466H17.8721V27.1812H24.5993V28.4466H24.5629Z" fill="#FCD7B6"/>
                                    <path d="M16.5722 27.7895C16.5722 27.0533 17.169 26.4564 17.9053 26.4564H24.7613C25.4976 26.4564 26.0944 27.0533 26.0944 27.7895C26.0944 28.5258 25.4976 29.1227 24.7613 29.1227H17.9053C17.169 29.1227 16.5722 28.5258 16.5722 27.7895Z" fill="#FF8100"/>
                                    <path d="M25.3768 20.9796V21.0547C25.4143 23.6819 24.8513 25.7462 23.913 26.5719H17.983C17.2699 26.1215 16.857 24.7704 16.7819 24.2824V24.2449L15.3182 19.6285C15.2056 19.3282 15.3557 18.9529 15.656 18.8403C15.9562 18.7277 16.3316 18.8778 16.4441 19.1781L17.7202 22.2557C17.7953 22.4058 17.9454 22.5184 18.1331 22.4809C18.3207 22.4434 18.4333 22.2933 18.4333 22.1056V13.5483C18.4333 13.2105 18.6961 12.9478 19.0339 12.9478C19.3716 12.9478 19.6344 13.2105 19.6344 13.5483V18.9154C19.6344 19.103 19.7845 19.2907 20.0097 19.2907C20.1973 19.2907 20.385 19.1406 20.385 18.9154V18.3149C20.385 17.9771 20.6477 17.7144 20.9855 17.7144C21.3233 17.7144 21.586 17.9771 21.586 18.3149V19.5534C21.586 19.7411 21.7362 19.9287 21.9613 19.9287C22.149 19.9287 22.3367 19.7786 22.3367 19.5534V18.8403C22.3367 18.5025 22.5994 18.2398 22.9372 18.2398C23.275 18.2398 23.5377 18.5025 23.5377 18.8403V20.1539C23.5377 20.3416 23.6878 20.5293 23.913 20.5293C24.1382 20.5293 24.2883 20.3791 24.2883 20.1539V19.5159C24.5135 19.2532 24.9639 19.1781 25.1891 19.4408C25.3017 19.5534 25.3768 19.7035 25.3768 19.8912V20.9796Z" fill="#FCD7B6"/>
                                    <defs>
                                        <linearGradient id="paint0_linear_366_339" x1="14.1508" y1="10.2624" x2="12.217" y2="8.50446" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#CE5DCB"/>
                                            <stop offset="0.2095" stop-color="#C558CC"/>
                                            <stop offset="0.5525" stop-color="#AC4ACF"/>
                                            <stop offset="0.9845" stop-color="#8534D4"/>
                                            <stop offset="1" stop-color="#8333D4"/>
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_366_339" x1="13.3306" y1="11.0427" x2="17.0126" y2="11.0427" gradientUnits="userSpaceOnUse">
                                            <stop offset="0.0237" stop-color="#FF5667"/>
                                            <stop offset="0.6592" stop-color="#FC8B82"/>
                                            <stop offset="1" stop-color="#FBA28E"/>
                                        </linearGradient>
                                        <linearGradient id="paint2_linear_366_339" x1="9.20745" y1="11.133" x2="14.2749" y2="11.133" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#00B874"/>
                                            <stop offset="0.5126" stop-color="#29D3A2"/>
                                            <stop offset="0.6817" stop-color="#53DFB6"/>
                                            <stop offset="1" stop-color="#9FF4D9"/>
                                        </linearGradient>
                                        <linearGradient id="paint3_linear_366_339" x1="12.6609" y1="14.5158" x2="17.7283" y2="14.5158" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FCD77E"/>
                                            <stop offset="0.5241" stop-color="#FEA500"/>
                                            <stop offset="1" stop-color="#FF5B00"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class='carousel-item'>
                        <div class='carousel-item-content'>
                            <div class='step-number'>
                                <span class='step-number-content'>2</span>
                            </div>
                            <div class='step-name'>${this.translations.PI5Step2}</div>
                            <div class='step-image'>
                                <svg width="26" height="34" viewBox="0 0 26 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.64778 0.579407H23.2738C24.6286 0.579407 25.7277 1.67775 25.7279 3.03253V10.9378H1.19466V3.03253C1.1948 1.67784 2.29309 0.579548 3.64778 0.579407Z" fill="#F9F5FD" stroke="#E8E8E8" stroke-width="0.54517"/>
                                    <path d="M23.2746 21.2961L3.64859 21.2961C2.29378 21.2961 1.19463 20.1978 1.19449 18.843L1.19449 10.9377L25.7277 10.9377L25.7277 18.843C25.7275 20.1977 24.6293 21.296 23.2746 21.2961Z" fill="#F9F5FD" stroke="#E8E8E8" stroke-width="0.54517"/>
                                    <path d="M8.00809 2.7605C9.6633 2.7605 11.0051 4.10238 11.0052 5.75757C11.0052 7.41283 9.66336 8.75464 8.00809 8.75464C6.35291 8.75454 5.01102 7.41277 5.01102 5.75757C5.01112 4.10244 6.35297 2.76059 8.00809 2.7605Z" stroke="#AEAEAE" stroke-width="0.54517"/>
                                    <path d="M8.00809 13.1184C9.6633 13.1184 11.0051 14.4603 11.0052 16.1155C11.0052 17.7707 9.66336 19.1125 8.00809 19.1125C6.35291 19.1125 5.01102 17.7707 5.01102 16.1155C5.01112 14.4604 6.35297 13.1185 8.00809 13.1184Z" stroke="#8333D4" stroke-width="0.54517"/>
                                    <path d="M14.5516 6.84883C15.1538 6.84883 15.6419 6.36067 15.6419 5.75849C15.6419 5.15631 15.1538 4.66815 14.5516 4.66815C13.9494 4.66815 13.4613 5.15631 13.4613 5.75849C13.4613 6.36067 13.9494 6.84883 14.5516 6.84883Z" fill="#E8E8E8"/>
                                    <path d="M14.5516 17.2077C15.1538 17.2077 15.6419 16.7195 15.6419 16.1173C15.6419 15.5151 15.1538 15.027 14.5516 15.027C13.9494 15.027 13.4613 15.5151 13.4613 16.1173C13.4613 16.7195 13.9494 17.2077 14.5516 17.2077Z" fill="#E8E8E8"/>
                                    <path d="M17.8224 6.84883C18.4246 6.84883 18.9128 6.36067 18.9128 5.75849C18.9128 5.15631 18.4246 4.66815 17.8224 4.66815C17.2203 4.66815 16.7321 5.15631 16.7321 5.75849C16.7321 6.36067 17.2203 6.84883 17.8224 6.84883Z" fill="#E8E8E8"/>
                                    <path d="M17.8224 17.2077C18.4246 17.2077 18.9128 16.7195 18.9128 16.1173C18.9128 15.5151 18.4246 15.027 17.8224 15.027C17.2203 15.027 16.7321 15.5151 16.7321 16.1173C16.7321 16.7195 17.2203 17.2077 17.8224 17.2077Z" fill="#E8E8E8"/>
                                    <path d="M21.0937 6.84883C21.6959 6.84883 22.1841 6.36067 22.1841 5.75849C22.1841 5.15631 21.6959 4.66815 21.0937 4.66815C20.4916 4.66815 20.0034 5.15631 20.0034 5.75849C20.0034 6.36067 20.4916 6.84883 21.0937 6.84883Z" fill="#E8E8E8"/>
                                    <path d="M21.0937 17.2077C21.6959 17.2077 22.1841 16.7195 22.1841 16.1173C22.1841 15.5151 21.6959 15.027 21.0937 15.027C20.4916 15.027 20.0034 15.5151 20.0034 16.1173C20.0034 16.7195 20.4916 17.2077 21.0937 17.2077Z" fill="#E8E8E8"/>
                                    <path d="M8.00952 18.2976C9.21388 18.2976 10.1902 17.3213 10.1902 16.1169C10.1902 14.9125 9.21388 13.9362 8.00952 13.9362C6.80517 13.9362 5.82884 14.9125 5.82884 16.1169C5.82884 17.3213 6.80517 18.2976 8.00952 18.2976Z" fill="#8333D4"/>
                                    <path d="M13.5528 31.0899C14.68 29.5714 14.7891 26.8961 14.7891 25.703V24.5823C14.7891 24.2569 14.6437 23.9315 14.4255 23.6785C14.171 23.4254 13.8437 23.3169 13.5164 23.3169C13.3346 23.3169 13.1891 23.3531 13.0437 23.4254C12.9346 22.8108 12.4255 22.3408 11.771 22.3408C11.4801 22.3408 11.2619 22.4131 11.0437 22.5577C10.8255 22.1239 10.3892 21.8346 9.88008 21.8346C9.6619 21.8346 9.48009 21.907 9.29827 21.9793V18.5085C9.29827 17.7855 8.71646 17.207 7.98919 17.207C7.26192 17.207 6.68011 17.7855 6.68011 18.5085V25.0161L6.13466 23.6785C5.95285 23.2085 5.48012 22.8831 4.93467 22.8831C4.75286 22.8831 4.6074 22.9192 4.46195 22.9915C3.80741 23.2808 3.48014 24.0038 3.73468 24.6546L5.08013 29.0291C5.11649 29.2099 5.4074 30.4753 6.0983 31.2706C5.95285 31.4153 5.88012 31.5599 5.88012 31.7768V33.006C5.88012 33.4037 6.20739 33.6929 6.57102 33.6929H13.2982C13.6982 33.6929 13.9891 33.3675 13.9891 33.006V31.7406C14.0255 31.4514 13.8437 31.1983 13.5528 31.0899ZM5.77103 28.8484L4.35286 24.3654C4.24377 24.0761 4.38922 23.7146 4.68013 23.6062C4.97104 23.4977 4.97104 23.7508 5.08013 24.04L6.353 26.9955C6.42573 27.1401 6.89829 27.1492 7.08011 27.113C7.26193 27.0769 7.37101 26.9323 7.37101 26.7515V18.5085C7.37101 18.1832 7.62556 17.9301 7.95283 17.9301C8.2801 17.9301 8.28494 17.8154 8.28494 18.1408V23.6785C8.28494 23.8592 8.68009 24.04 8.89827 24.04C9.08009 24.04 9.26191 23.8954 9.26191 23.6785V23.1C9.26191 22.7746 9.51645 22.5216 9.84372 22.5216C10.171 22.5216 10.2323 22.7746 10.2323 23.1V24.2931C10.2323 24.4738 10.571 24.6546 10.7892 24.6546C10.971 24.6546 11.1528 24.51 11.1528 24.2931V23.6062C11.1528 23.2808 11.4073 23.0277 11.7346 23.0277C12.0619 23.0277 12.252 23.2808 12.252 23.6062V24.8715C12.252 25.0523 12.4619 25.2331 12.6801 25.2331C12.8982 25.2331 13.0437 25.0884 13.0437 24.8715V24.2569C13.2619 24.0038 13.6982 23.9315 13.9164 24.1846C14.0255 24.2931 14.0982 24.4377 14.0982 24.6184V25.7392C14.1346 28.2699 13.5891 30.2584 12.6801 31.0537H6.93466C6.24375 30.6199 5.84376 29.3184 5.77103 28.8484ZM13.2982 33.006H6.60739V31.7406H13.3346V33.006H13.2982Z" fill="#FCD7B6"/>
                                    <path d="M5.3075 32.349C5.3075 31.6127 5.90436 31.0158 6.64062 31.0158H13.4966C14.2329 31.0158 14.8298 31.6127 14.8298 32.349C14.8298 33.0852 14.2329 33.6821 13.4966 33.6821H6.64062C5.90436 33.6821 5.3075 33.0852 5.3075 32.349Z" fill="#FF8100"/>
                                    <path d="M14.1121 25.5391V25.6142C14.1496 28.2414 13.5866 30.3057 12.6483 31.1314H6.71828C6.00517 30.681 5.59232 29.3298 5.51726 28.8419V28.8044L4.05351 24.1879C3.94092 23.8877 4.09104 23.5124 4.3913 23.3998C4.69155 23.2872 5.06687 23.4373 5.17947 23.7376L6.45556 26.8152C6.53062 26.9653 6.68075 27.0779 6.86841 27.0404C7.05607 27.0028 7.16866 26.8527 7.16866 26.6651V18.1078C7.16866 17.77 7.43139 17.5073 7.76917 17.5073C8.10696 17.5073 8.36968 17.77 8.36968 18.1078V23.4748C8.36968 23.6625 8.51981 23.8502 8.745 23.8502C8.93266 23.8502 9.12032 23.7 9.12032 23.4748V22.8743C9.12032 22.5365 9.38305 22.2738 9.72084 22.2738C10.0586 22.2738 10.3213 22.5365 10.3213 22.8743V24.1129C10.3213 24.3005 10.4715 24.4882 10.6967 24.4882C10.8843 24.4882 11.072 24.3381 11.072 24.1129V23.3998C11.072 23.062 11.3347 22.7993 11.6725 22.7993C12.0103 22.7993 12.273 23.062 12.273 23.3998V24.7134C12.273 24.9011 12.4231 25.0887 12.6483 25.0887C12.8735 25.0887 13.0236 24.9386 13.0236 24.7134V24.0754C13.2488 23.8126 13.6992 23.7376 13.9244 24.0003C14.037 24.1129 14.1121 24.263 14.1121 24.4507V25.5391Z" fill="#FCD7B6"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class='carousel-item'>
                        <div class='carousel-item-content'>
                            <div class='step-number'>
                                <span class='step-number-content'>3</span>
                            </div>
                            <div class='step-name'>${this.translations.PI5Step3}</div>
                            <div class='step-image'>
                                <svg width="27" height="34" viewBox="0 0 27 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect y="9.14136" width="24.6" height="9.6" rx="4.8" fill="#D39BD3"/>
                                    <path d="M16.2 6.22824C16.2 2.59102 19.7403 0.0333434 23.2058 1.14939C25.4037 1.85362 27 3.91967 27 6.34017C27 9.32499 24.5842 11.7175 21.6 11.6849H21.5384C18.5874 11.6242 16.2 9.19439 16.2 6.22824Z" fill="#29D3A2"/>
                                    <path d="M20.0227 6.58523L20.9311 7.50497L22.3518 6.06665L23.7725 4.62833C23.9609 4.43753 24.2702 4.43753 24.4587 4.62833C24.6471 4.81913 24.6471 5.12734 24.4587 5.31814L22.8664 6.93013L21.2742 8.54213C21.0858 8.73293 20.7813 8.73293 20.5929 8.54213L19.3413 7.27504C19.1529 7.08424 19.1529 6.77603 19.3413 6.58523C19.5298 6.39443 19.8342 6.39443 20.0227 6.58523Z" fill="white"/>
                                    <path d="M8.4 15.1413C9.06274 15.1413 9.6 14.6041 9.6 13.9413C9.6 13.2786 9.06274 12.7413 8.4 12.7413C7.73726 12.7413 7.2 13.2786 7.2 13.9413C7.2 14.6041 7.73726 15.1413 8.4 15.1413Z" fill="#E8E8E8"/>
                                    <path d="M12.6 15.1413C13.2627 15.1413 13.8 14.6041 13.8 13.9413C13.8 13.2786 13.2627 12.7413 12.6 12.7413C11.9373 12.7413 11.4 13.2786 11.4 13.9413C11.4 14.6041 11.9373 15.1413 12.6 15.1413Z" fill="#E8E8E8"/>
                                    <path d="M16.8 15.1413C17.4627 15.1413 18 14.6041 18 13.9413C18 13.2786 17.4627 12.7413 16.8 12.7413C16.1373 12.7413 15.6 13.2786 15.6 13.9413C15.6 14.6041 16.1373 15.1413 16.8 15.1413Z" fill="#E8E8E8"/>
                                    <path d="M16.5045 30.5119C17.6318 28.9934 17.7409 26.3181 17.7409 25.125V24.0043C17.7409 23.6789 17.5954 23.3535 17.3772 23.1005C17.1227 22.8474 16.7954 22.7389 16.4681 22.7389C16.2863 22.7389 16.1409 22.7751 15.9954 22.8474C15.8863 22.2328 15.3772 21.7628 14.7227 21.7628C14.4318 21.7628 14.2136 21.8351 13.9954 21.9797C13.7773 21.5459 13.3409 21.2566 12.8318 21.2566C12.6136 21.2566 12.4318 21.3289 12.25 21.4013V17.9305C12.25 17.2075 11.6682 16.629 10.9409 16.629C10.2136 16.629 9.63183 17.2075 9.63183 17.9305V24.4381L9.08638 23.1005C8.90457 22.6305 8.43184 22.3051 7.88639 22.3051C7.70458 22.3051 7.55912 22.3412 7.41367 22.4135C6.75913 22.7028 6.43186 23.4258 6.6864 24.0766L8.03185 28.4511C8.06821 28.6319 8.35912 29.8973 9.05002 30.6926C8.90457 30.8373 8.83184 30.9819 8.83184 31.1988V32.428C8.83184 32.8257 9.15911 33.1149 9.52274 33.1149H16.25C16.65 33.1149 16.9409 32.7895 16.9409 32.428V31.1626C16.9772 30.8734 16.7954 30.6203 16.5045 30.5119ZM8.72275 28.2704L7.30458 23.7874C7.19549 23.4981 7.34094 23.1366 7.63185 23.0282C7.92276 22.9197 7.92276 23.1728 8.03185 23.462L9.30472 26.4175C9.37745 26.5621 9.85001 26.5712 10.0318 26.535C10.2136 26.4989 10.3227 26.3543 10.3227 26.1735V17.9305C10.3227 17.6052 10.5773 17.3521 10.9045 17.3521C11.2318 17.3521 11.2367 17.2374 11.2367 17.5628V23.1005C11.2367 23.2812 11.6318 23.462 11.85 23.462C12.0318 23.462 12.2136 23.3174 12.2136 23.1005V22.522C12.2136 22.1966 12.4682 21.9436 12.7954 21.9436C13.1227 21.9436 13.1841 22.1966 13.1841 22.522V23.7151C13.1841 23.8958 13.5227 24.0766 13.7409 24.0766C13.9227 24.0766 14.1045 23.932 14.1045 23.7151V23.0282C14.1045 22.7028 14.3591 22.4497 14.6863 22.4497C15.0136 22.4497 15.2037 22.7028 15.2037 23.0282V24.2935C15.2037 24.4743 15.4136 24.655 15.6318 24.655C15.85 24.655 15.9954 24.5104 15.9954 24.2935V23.6789C16.2136 23.4258 16.65 23.3535 16.8681 23.6066C16.9772 23.7151 17.05 23.8597 17.05 24.0404V25.1612C17.0863 27.6919 16.5409 29.6803 15.6318 30.4757H9.88638C9.19547 30.0419 8.79548 28.7404 8.72275 28.2704ZM16.25 32.428H9.55911V31.1626H16.2863V32.428H16.25Z" fill="#FCD7B6"/>
                                    <path d="M8.25923 31.771C8.25923 31.0347 8.85609 30.4378 9.59235 30.4378H16.4484C17.1846 30.4378 17.7815 31.0347 17.7815 31.771C17.7815 32.5072 17.1846 33.1041 16.4484 33.1041H9.59235C8.85609 33.1041 8.25923 32.5072 8.25923 31.771Z" fill="#FF8100"/>
                                    <path d="M17.0638 24.9611V25.0362C17.1013 27.6634 16.5383 29.7277 15.6 30.5534H9.67C8.95689 30.103 8.54404 28.7518 8.46898 28.2639V28.2264L7.00523 23.6099C6.89264 23.3097 7.04277 22.9344 7.34302 22.8218C7.64328 22.7092 8.0186 22.8593 8.13119 23.1596L9.40728 26.2372C9.48234 26.3873 9.63247 26.4999 9.82013 26.4624C10.0078 26.4248 10.1204 26.2747 10.1204 26.0871V17.5298C10.1204 17.192 10.3831 16.9293 10.7209 16.9293C11.0587 16.9293 11.3214 17.192 11.3214 17.5298V22.8968C11.3214 23.0845 11.4715 23.2722 11.6967 23.2722C11.8844 23.2722 12.072 23.122 12.072 22.8968V22.2963C12.072 21.9585 12.3348 21.6958 12.6726 21.6958C13.0103 21.6958 13.2731 21.9585 13.2731 22.2963V23.5349C13.2731 23.7225 13.4232 23.9102 13.6484 23.9102C13.836 23.9102 14.0237 23.7601 14.0237 23.5349V22.8218C14.0237 22.484 14.2864 22.2213 14.6242 22.2213C14.962 22.2213 15.2247 22.484 15.2247 22.8218V24.1354C15.2247 24.3231 15.3749 24.5107 15.6 24.5107C15.8252 24.5107 15.9754 24.3606 15.9754 24.1354V23.4974C16.2006 23.2346 16.6509 23.1596 16.8761 23.4223C16.9887 23.5349 17.0638 23.685 17.0638 23.8727V24.9611Z" fill="#FCD7B6"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='carousel-dots'>
                    <div class="dot active">
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="6" height="6" rx="3" fill="#8333D4"/>
                        </svg>
                    </div>
                    <div class="dot">
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="6" height="6" rx="3" fill="#8333D4"/>
                        </svg>
                    </div>
                    <div class="dot">
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="6" height="6" rx="3" fill="#8333D4"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="terms-container">
                <p class="terms"><span>${
                  this.translations.terms1
                }</span><br /><span>${this.translations.termsHiw}</span></p>
                <p class="terms">${this.translations.terms2}</p>
                <p class="terms">
                    <span class="webbank-terms">${
                      this.translations.webBankTerms
                    }</span> <span class="webbank-terms">${
                      this.translations.webBankTermsPI5
                    }</span>
                    <br />
                    <span>${this.translations.linkToCompleteTerms}</span>
                </p>
            </div>
            </div></div></div>
        `;
        this.handleCarousel(modalNode);
        const input = modalNode.querySelector(".input-amount");
        const pay4Installments =
          modalNode.getElementsByClassName("4-pay-installment");
        const pay5Installments =
          modalNode.getElementsByClassName("5-pay-installment");
        if (input) {
          let debounceTimer;
          input.addEventListener("input", (event) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
              const amount = event.target.value.replace(/[^0-9,.$€£₤₹]/g, "");
              currency = String.fromCharCode(this.currencySymbol(amount)) || "$";
              priceString =
                amount.indexOf(currency) > -1
                  ? amount.split(currency)[1]
                  : amount;
              priceString =
                this.parseMode === "comma"
                  ? priceString.replace(".", "").replace(",", ".")
                  : priceString.replace(",", "");
              // Escape currency and price values for XSS protection
              safeCurrency = escapeHTML(currency);
              safePrice = escapeHTML(
                this.addDelimiters(priceString, this.parseMode),
              );
              this.updateInstallmentContent(
                pay4Installments,
                this.getFormattedPrice(4, safeCurrency + safePrice),
              );
              this.updateInstallmentContent(
                pay5Installments,
                this.getFormattedPrice(5, safeCurrency + safePrice),
              );
            }, 150);
          });
        }
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
                                          this.translations.PI4trustPilotTitle
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
                                    <div class="due">${this.translations.week} 6<sup>3</sup></div>
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
                <p class="terms"><span><sup role="doc-noteref" aria-label="${this.translations.PI4footnote} 1">1</sup>${
                  this.translations.terms1
                }</span><br /><span>${this.translations.termsHiw}</span></p>
                <p class="terms"><sup role="doc-noteref" aria-label="${this.translations.PI4footnote} 2">2</sup>${this.translations.terms2}</p>
                <p class="terms">
                    <span class="webbank-terms"><sup role="doc-noteref" aria-label="${this.translations.PI4footnote} 3">3</sup>${
                      this.translations.webBankTerms
                    } ${
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
