import HelperClass from './awesomeHelper'
import '../css/global.scss';


class AwesomeSezzle {

  constructor(options){
    if (!options) { options = {}; console.error('Config for widget is not supplied'); }
    switch (typeof (options.language)) {
      case 'string':
        this.language = options.language;
        break;
      case 'function':
        this.language = options.language();
        break;
      default:
        this.language = 'en';
    }
    if (this.language === 'french') this.language = 'fr';
    if(this.language === 'german' || this.language === 'deutsche') this.language = 'de';
    if(this.language === 'spanish' || this.language === 'espanol' || this.language === 'español') this.language = 'es';
		this.numberOfPayments = options.numberOfPayments || 4;
		this.aprTerms = options.aprTerms || 12;
		var templateString = this.widgetLanguageTranslation(this.language, this.numberOfPayments)
		var templateStringLT = this.widgetLanguageTranslationLT(this.language);
    this.widgetTemplate  = options.widgetTemplate ? options.widgetTemplate.split('%%') : templateString.split('%%');
		this.widgetTemplateLT = options.widgetTemplateLT ? options.widgetTemplateLT.split('%%') : templateStringLT.split('%%');
		this.renderElementInitial = options.renderElement || 'sezzle-widget';
    this.assignConfigs(options);
  }

  assignConfigs (options) {
    this.amount = options.amount || null;
    this.minPrice = options.minPrice || 0;
    this.maxPrice = options.maxPrice || 250000;
		this.minPriceLT = options.minPriceLT || 0;
		this.bestAPR = options.bestAPR || 0;
    this.altModalHTML = options.altLightboxHTML || '';
    this.apModalHTML = options.apModalHTML || '';
    this.qpModalHTML = options.qpModalHTML || '';
    this.affirmModalHTML = options.affirmModalHTML || '';
    this.klarnaModalHTML = options.klarnaModalHTML || '';
    this.alignmentSwitchMinWidth = options.alignmentSwitchMinWidth || 760;
    this.alignmentSwitchType = options.alignmentSwitchType || '';
    this.alignment = options.alignment || 'left';
    this.fontWeight = options.fontWeight || 300;
    this.fontSize = options.fontSize || 12;
    this.fontFamily = options.fontFamily || 'inherit';
    this.maxWidth = options.maxWidth || 'none';
    this.textColor = options.textColor || '#111';
    this.renderElementArray = typeof(this.renderElementInitial) === 'string' ? [this.renderElementInitial] : this.renderElementInitial;
    this.renderElement = this.renderElementInitial;
    this.apLink = options.apLink || 'https://www.afterpay.com/purchase-payment-agreement';
    this.widgetType = options.widgetType || 'product-page';
    this.bannerURL = options.bannerURL ||  '';
    this.bannerClass = options.bannerClass || '';
    this.bannerLink = options.bannerLink || '';
    this.marginTop = options.marginTop || 0;
    this.marginBottom = options.marginBottom || 0;
    this.marginLeft = options.marginLeft || 0;
    this.marginRight = options.marginRight || 0;
    this.logoSize = options.logoSize || 1.0;
    this.scaleFactor = options.scaleFactor || 1.0;
    this.fixedHeight = options.fixedHeight || 0;
    this.logoStyle = options.logoStyle  || {};
    this.theme = options.theme || 'light';
    this.parseMode = options.parseMode || 'default'; // other available option is comma (For french)
    this.widgetTemplate = this.widgetTemplate;
		this.widgetTemplateLT = this.widgetTemplateLT;
  }

  widgetLanguageTranslation(language, numberOfPayments) {
    const translations = {
      'en': 'or ' + numberOfPayments + ' interest-free payments of %%price%% with %%logo%% %%info%%',
      'fr': 'ou ' + numberOfPayments + ' paiements de %%price%% sans int%%&eacute;%%r%%&ecirc;%%ts avec %%logo%% %%info%%',
      'de': 'oder ' + numberOfPayments + ' zinslose Zahlungen von je %%price%% mit %%logo%% %%info%%',
      'es': 'o ' + numberOfPayments + ' pagos sin intereses de %%price%% con %%logo%% %%info%%'
    };
    return translations[language] || translations.en;
  };

	widgetLanguageTranslationLT(language) {
    const translations = {
      'en': 'or monthly payments as low as %%price%% with %%logo%% %%info%%',
      'fr': 'ou des paiements mensuels aussi bas que %%price%% avec %%logo%% %%info%%',
      'de': 'oder monatliche Zahlungen von nur %%price%% mit %%logo%% %%info%%',
      'es': 'o pagos mensuales tan bajos como %%price%% con %%logo%% %%info%%'
    };
    return translations[language] || translations.en;
  };

  addCSSAlignment(){
    var newAlignment = '';
    if (matchMedia && this.alignmentSwitchMinWidth && this.alignmentSwitchType) {
      var queryString = `(min-width: ${this.alignmentSwitchMinWidth}px)`;
      var mq = window.matchMedia(queryString);
      if (!mq.matches) {
        newAlignment = this.alignmentSwitchType
      }
    }
    switch (newAlignment || this.alignment) {
      case 'left':
        this.renderElement.children[0].children[0].className += ' sezzle-left';
        break;
      case 'right':
        this.renderElement.children[0].children[0].className += ' sezzle-right';
        break;
      case 'center':
        this.renderElement.children[0].children[0].className += ' sezzle-center';
      default:
        break;
    }
  }

  addCSSFontStyle(){
    if (this.fontWeight) {
      this.renderElement.children[0].children[0].style.fontWeight = this.fontWeight;
    }
    if (this.fontFamily) {
      this.renderElement.children[0].children[0].style.fontFamily = this.fontFamily;
    }
    if (this.fontSize != 'inherit') {
      this.renderElement.children[0].children[0].style.fontSize = `${this.fontSize}px`;
    }
  }

  addCSSWidth(){
    if (this.maxWidth) {
        this.renderElement.children[0].children[0].style.maxWidth = `${this.maxWidth}px`;
    }
  }


  addCSSTextColor(){
    if (this.textColor) {
      this.renderElement.children[0].children[0].style.color = this.textColor;
    }
  }

  addCSSTheme(){
    switch (this.theme) {
        case 'dark':
          this.renderElement.children[0].children[0].className += ' szl-dark';
          break;
        case 'white':
					this.renderElement.children[0].children[0].className += 'szl-dark';
					break;
        case 'white-flat':
					this.renderElement.children[0].children[0].className += 'szl-dark';
					break;
				case 'white-pill':
					this.renderElement.children[0].children[0].className += 'szl-dark';
					break;
        default:
          this.renderElement.children[0].children[0].className += ' szl-light';
          break;
    }
  }

  setImageURL(){
    switch (this.theme) {
      case 'dark':
        this.imageClassName = 'szl-dark-image'
        this.imageInnerHTML = HelperClass.svgImages().sezzleDark
        break;
      case 'grayscale':
        this.imageClassName = 'szl-light-image'
        this.imageInnerHTML = HelperClass.svgImages().sezzleGrey
        break;
      case 'black-flat':
        this.imageClassName = 'szl-light-image'
        this.imageInnerHTML = HelperClass.svgImages().sezzleBlack
        break;
      case 'white':
        this.imageClassName = 'szl-dark-image'
        this.imageInnerHTML = HelperClass.svgImages().sezzleWhite
        break;
      case 'white-flat':
        this.imageClassName = 'szl-dark-image'
        this.imageInnerHTML = HelperClass.svgImages().sezzleWhiteAlt
				break;
			case 'purple-pill':
				this.imageClassName = 'szl-light-image'
				this.imageInnerHTML = HelperClass.svgImages().sezzlePurplePill
				break;
			case 'white-pill':
				this.imageClassName = 'szl-dark-image'
				this.imageInnerHTML = HelperClass.svgImages().sezzleWhitePill
				break;
      default:
        this.imageClassName = 'szl-light-image'
        this.imageInnerHTML = HelperClass.svgImages().sezzleLight
        break;
    }
  }

  addCSSCustomisation(){
    this.addCSSAlignment();
    this.addCSSFontStyle();
    this.addCSSTextColor();
    this.addCSSTheme();
    this.addCSSWidth();
  }

  insertWidgetTypeCSSClassInElement(){
    switch (this.widgetType) {
      case 'cart':
        this.renderElement.className += ' sezzle-cart-page-widget';
        break;
      case 'product-preview':
        this.renderElement.className += ' sezzle-product-preview-widget';
        break;
      default:
        this.renderElement.className += ' sezzle-product-page-widget';
        break;
      }
  }

  setElementMargins(){
    this.renderElement.style.marginTop = `${this.marginTop}px`;
    this.renderElement.style.marginBottom = `${this.marginBottom}px`;
    this.renderElement.style.marginLeft = `${this.marginLeft}px`;
    this.renderElement.style.marginRight = `${this.marginRight}px`;
  }

  setWidgetSize(){
    if(this.scaleFactor){
      this.renderElement.style.transformOrigin = `top ${this.alignment}`;
      this.renderElement.style.transform = `scale(${this.scaleFactor})`;
    }
    if (this.fixedHeight) {
      this.renderElement.style.height = `${this.fixedHeight}px`;
      this.renderElement.style.overflow = 'hidden';
    }
  }


  alterPrice(amt){
    this.eraseWidget();
    this.assignConfigs(this);
    this.amount = amt;
    this.init()
  }

  eraseWidget(){
    this.renderElementArray.forEach(function(element, index){
      let sezzleElement = document.getElementById(element);
      if(sezzleElement.innerHTML.length){
        sezzleElement.removeChild(sezzleElement.querySelector('.sezzle-checkout-button-wrapper'));
      }
    })
  }

  setLogoSize(element){
    element.style.transformOrigin = `top ${this.alignment}`;
    element.style.transform = `scale(${this.logoSize})`
  }

  setLogoStyle(element) {
    var newStyles = Object.keys(this.logoStyle);
    for(let i = 0; i< newStyles.length; i++){
      element.style[newStyles[i]] = this.logoStyle[newStyles[i]];
    }
  }

  n(newVal){
      var priceNode = document.getElementsByClassName('sezzle-payment-amount')[0];
      var priceValueText = document.createTextNode(this.getFormattedPrice(newVal));
      priceNode.innerHTML = '';
      priceNode.appendChild(priceValueText)
  }

  renderAwesomeSezzle(){
    if (!this.isProductEligible(this.amount)) return false;
    this.insertWidgetTypeCSSClassInElement();
    this.setElementMargins();
    if (this.scaleFactor || this.fixedHeight) this.setWidgetSize();
    var node = document.createElement('div');
    node.className = 'sezzle-checkout-button-wrapper sezzle-modal-link';
    node.tabindex = 0;
    node.style.cursor = 'pointer';
    var sezzleButtonText = document.createElement('div');
    sezzleButtonText.className = 'sezzle-button-text';
    this.setImageURL();
		var widgetText = this.isProductEligibleLT(this.amount) ? this.widgetTemplateLT : this.widgetTemplate;
		widgetText.forEach(function (subtemplate) {
        switch (subtemplate) {
          case 'price':
            var priceSpanNode = document.createElement('span');
            priceSpanNode.className = 'sezzle-payment-amount sezzle-button-text';
            var priceValueText = document.createTextNode(this.getFormattedPrice());
            priceSpanNode.appendChild(priceValueText);
            sezzleButtonText.appendChild(priceSpanNode);
            break;
          case 'logo':
            var logoNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
            logoNode.setAttribute('width','798.16');
            logoNode.setAttribute('height','199.56');
            logoNode.setAttribute('viewBox','0 0 798.16 199.56');
            logoNode.setAttribute('class',`sezzle-logo ${this.imageClassName}`);
						logoNode.setAttribute('alt', 'Sezzle');
            logoNode.style.height = '18px !important';
            logoNode.innerHTML = this.imageInnerHTML;
            sezzleButtonText.appendChild(logoNode);
            if(this.logoStyle != {}) this.setLogoStyle(logoNode);
            this.setLogoSize(logoNode);
						if(this.theme === 'purple-pill' || this.theme == 'white-pill'){
							logoNode.style.transform = 'scale(12)';
						}
            break;
          case 'link':
            var learnMoreNode = document.createElement('button');
            learnMoreNode.role = 'button';
            learnMoreNode.type = 'button';
            learnMoreNode.title = 'Learn More about Sezzle';
            learnMoreNode.className = 'sezzle-learn-more sezzle-modal-open-link';
            var learnMoreText = document.createTextNode('Learn more');
            learnMoreNode.appendChild(learnMoreText);
            sezzleButtonText.appendChild(learnMoreNode);
            break;
          case 'info':
            var infoIconNode = document.createElement('button');
            infoIconNode.role = 'button';
            infoIconNode.type = 'button';
            infoIconNode.title = 'Learn More about Sezzle';
            infoIconNode.className = 'sezzle-info-icon sezzle-modal-open-link';
            infoIconNode.innerHTML = '&#9432;';
            sezzleButtonText.appendChild(infoIconNode);
            break;
          case 'question-mark':
            var questionMarkButton = document.createElement('button');
            questionMarkButton.role = 'button';
            questionMarkButton.type = 'button';
            questionMarkButton.title = 'Learn More about Sezzle';
            var questionMarkIconNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
            questionMarkIconNode.setAttribute('width','14');
            questionMarkIconNode.setAttribute('height','14');
            questionMarkIconNode.setAttribute('viewBox','0 0 369 371');
            questionMarkButton.setAttribute('class','sezzle-question-mark-icon sezzle-modal-open-link');
            questionMarkIconNode.innerHTML = HelperClass.svgImages().questionMarkIcon;
            questionMarkButton.appendChild(questionMarkIconNode);
            sezzleButtonText.appendChild(questionMarkButton);
            break;
          case 'afterpay-logo':
            var apNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
            apNode.setAttribute('width','115');
            apNode.setAttribute('height','40');
            apNode.setAttribute('viewBox','0 0 115 40');
            apNode.setAttribute('class',`sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`);
            apNode.setAttribute('style', `height: 24px !important;width: auto !important;margin-bottom: -8px;`);
            apNode.setAttribute('alt', 'Afterpay');
            apNode.innerHTML = HelperClass.svgImages().apNodeColor;
            sezzleButtonText.appendChild(apNode);
            this.setLogoSize(apNode);
            break;
          case 'afterpay-logo-grey':
            var apNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
            apNode.setAttribute('width','115');
            apNode.setAttribute('height','40');
            apNode.setAttribute('viewBox','0 0 115 40');
            apNode.setAttribute('class',`sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`);
            apNode.setAttribute('style', `height: 32px !important;width: auto !important;margin: -10px !important;`);
            apNode.setAttribute('alt', 'Afterpay');
            apNode.innerHTML = HelperClass.svgImages().apNodeGrey;
            sezzleButtonText.appendChild(apNode);
            this.setLogoSize(apNode);
            break;
					case 'afterpay-logo-white':
						var apNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
						apNode.setAttribute('width','115');
						apNode.setAttribute('height','40');
						apNode.setAttribute('viewBox','0 0 115 40');
						apNode.setAttribute('class',`sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`);
						apNode.setAttribute('style', `height: 32px !important;width: auto !important;margin: -10px !important`);
						apNode.setAttribute('alt', 'Afterpay');
						apNode.innerHTML = HelperClass.svgImages().apNodeWhite;
						sezzleButtonText.appendChild(apNode);
						this.setLogoSize(apNode);
						break;
          case 'afterpay-info-icon':
            var apInfoIconNode = document.createElement('button');
            apInfoIconNode.role = 'button';
            apInfoIconNode.type = 'button';
            apInfoIconNode.title = 'Learn More about Afterpay';
            apInfoIconNode.className = 'ap-modal-info-link no-sezzle-info';
            apInfoIconNode.innerHTML = '&#9432;';
            sezzleButtonText.appendChild(apInfoIconNode);
            break;
          case 'afterpay-link-icon':
            var apAnchor = document.createElement('a');
            apAnchor.href = this.apLink;
            apAnchor.target = '_blank';
            var apLinkIconNode = document.createElement('code');
            apLinkIconNode.className = 'ap-info-link';
            apLinkIconNode.innerHTML = '&#9432;';
            apAnchor.appendChild(apLinkIconNode)
            sezzleButtonText.appendChild(apAnchor);
            break;
          case 'quadpay-logo':
            var qpNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
            qpNode.setAttribute('width','498');
            qpNode.setAttribute('height','135');
            qpNode.setAttribute('viewBox','0 0 498 135');
            qpNode.setAttribute('class',`sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`);
            qpNode.setAttribute('style', `height: 22px !important;width: auto !important;margin-bottom: -5px;`);
            qpNode.setAttribute('alt', 'Quadpay');
            qpNode.innerHTML = HelperClass.svgImages().qpNodeColor;
            sezzleButtonText.appendChild(qpNode);
            this.setLogoSize(qpNode);
            break;
          case 'quadpay-logo-grey':
						var qpNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
						qpNode.setAttribute('width','498');
						qpNode.setAttribute('height','135');
						qpNode.setAttribute('viewBox','0 0 498 135');
						qpNode.setAttribute('class',`sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`);
						qpNode.setAttribute('style', `height: 22px !important;width: auto !important;margin-bottom: -5px;`);
						qpNode.setAttribute('alt', 'Quadpay');
						qpNode.innerHTML = HelperClass.svgImages().qpNodeGrey;
						sezzleButtonText.appendChild(qpNode);
						this.setLogoSize(qpNode);
						break;
          case 'quadpay-logo-white':
						var qpNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
						qpNode.setAttribute('width','498');
						qpNode.setAttribute('height','135');
						qpNode.setAttribute('viewBox','0 0 498 135');
						qpNode.setAttribute('class',`sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`);
						qpNode.setAttribute('style', `height: 22px !important;width: auto !important;margin-bottom: -5px;`);
						qpNode.setAttribute('alt', 'Quadpay');
						qpNode.innerHTML = HelperClass.svgImages().qpNodeWhite;
						sezzleButtonText.appendChild(qpNode);
						this.setLogoSize(qpNode);
						break;
          case 'quadpay-info-icon':
            var quadpayInfoIconNode = document.createElement('button');
            quadpayInfoIconNode.role = 'button';
            quadpayInfoIconNode.type = 'button';
            quadpayInfoIconNode.title = 'Learn More about Quadpay';
            quadpayInfoIconNode.className = 'quadpay-modal-info-link no-sezzle-info';
            quadpayInfoIconNode.innerHTML = '&#9432;';
            sezzleButtonText.appendChild(quadpayInfoIconNode);
            break;
          case 'affirm-logo':
            var affirmNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
            affirmNode.setAttribute('width','450');
            affirmNode.setAttribute('height','170');
            affirmNode.setAttribute('viewBox','0 0 450 170');
            affirmNode.setAttribute('class',`sezzle-affirm-logo affirm-modal-info-link no-sezzle-info`);
            affirmNode.setAttribute('style', `height: 24px !important;width: auto !important;`);
            affirmNode.setAttribute('alt', 'Affirm');
            affirmNode.innerHTML = HelperClass.svgImages().affirmNodeColor;
            sezzleButtonText.appendChild(affirmNode);
            this.setLogoSize(affirmNode);
            break;
          case 'affirm-logo-grey':
						var affirmNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
						affirmNode.setAttribute('width','450');
						affirmNode.setAttribute('height','170');
						affirmNode.setAttribute('viewBox','0 0 450 170');
						affirmNode.setAttribute('class',`sezzle-affirm-logo affirm-modal-info-link no-sezzle-info`);
						affirmNode.setAttribute('style', `height: 24px !important;width: auto !important;`);
						affirmNode.setAttribute('alt', 'Affirm');
						affirmNode.innerHTML = HelperClass.svgImages().affirmNodeGrey;
						sezzleButtonText.appendChild(affirmNode);
						this.setLogoSize(affirmNode);
						break;
          case 'affirm-logo-white':
						var affirmNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
						affirmNode.setAttribute('width','450');
						affirmNode.setAttribute('height','170');
						affirmNode.setAttribute('viewBox','0 0 450 170');
						affirmNode.setAttribute('class',`sezzle-affirm-logo affirm-modal-info-link no-sezzle-info`);
						affirmNode.setAttribute('style', `height: 24px !important;width: auto !important;`);
						affirmNode.setAttribute('alt', 'Affirm');
						affirmNode.innerHTML = HelperClass.svgImages().affirmNodeWhite;
						sezzleButtonText.appendChild(affirmNode);
						this.setLogoSize(affirmNode);
						break;
          case 'affirm-info-icon':
            var affirmInfoIconNode = document.createElement('button');
            affirmInfoIconNode.role = 'button';
            affirmInfoIconNode.type = 'button';
            affirmInfoIconNode.title = 'Learn More about Affirm';
            affirmInfoIconNode.className = 'affirm-modal-info-link no-sezzle-info';
            affirmInfoIconNode.innerHTML = '&#9432;';
            sezzleButtonText.appendChild(affirmInfoIconNode);
            break;
          case 'klarna-logo':
            var klarnaNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
            klarnaNode.setAttribute('width','45');
            klarnaNode.setAttribute('height','25');
            klarnaNode.setAttribute('viewBox','0 0 45 23');
            klarnaNode.setAttribute('class',`sezzle-klarna-logo klarna-modal-info-link no-sezzle-info`);
            klarnaNode.setAttribute('style', `height: 25px !important;width: auto !important; margin-bottom: -5px;`);
            klarnaNode.setAttribute('alt', 'Klarna');
            klarnaNode.innerHTML = HelperClass.svgImages().klarnaNodeColor;
            sezzleButtonText.appendChild(klarnaNode);
            this.setLogoSize(klarnaNode);
            break;
          case 'klarna-logo-grey':
						var klarnaNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
						klarnaNode.setAttribute('width','45');
						klarnaNode.setAttribute('height','25');
						klarnaNode.setAttribute('viewBox','0 0 45 23');
						klarnaNode.setAttribute('class',`sezzle-klarna-logo klarna-modal-info-link no-sezzle-info`);
						klarnaNode.setAttribute('style', `height: 25px !important;width: auto !important; margin-bottom: -5px;`);
						klarnaNode.setAttribute('alt', 'Klarna');
						klarnaNode.innerHTML = HelperClass.svgImages().klarnaNodeGrey;
						sezzleButtonText.appendChild(klarnaNode);
						this.setLogoSize(klarnaNode);
						break;
          case 'klarna-logo-white':
						var klarnaNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
						klarnaNode.setAttribute('width','45');
						klarnaNode.setAttribute('height','25');
						klarnaNode.setAttribute('viewBox','0 0 45 23');
						klarnaNode.setAttribute('class',`sezzle-klarna-logo klarna-modal-info-link no-sezzle-info`);
						klarnaNode.setAttribute('style', `height: 25px !important;width: auto !important; margin-bottom: -5px;`);
						klarnaNode.setAttribute('alt', 'Klarna');
						klarnaNode.innerHTML = HelperClass.svgImages().klarnaNodeWhite;
						sezzleButtonText.appendChild(klarnaNode);
						this.setLogoSize(klarnaNode);
						break;
          case 'klarna-info-icon':
            var klarnaInfoIconNode = document.createElement('button');
            klarnaInfoIconNode.role = 'button';
            klarnaInfoIconNode.type = 'button';
            klarnaInfoIconNode.title = 'Learn More about Klarna';
            klarnaInfoIconNode.className = 'klarna-modal-info-link no-sezzle-info';
            klarnaInfoIconNode.innerHTML = '&#9432;';
            sezzleButtonText.appendChild(klarnaInfoIconNode);
            break;
          case 'line-break':
            var lineBreakNode = document.createElement('br');
            sezzleButtonText.appendChild(lineBreakNode);
            break;
          case '&eacute;':
            var eacute = document.createElement('span');
            eacute.innerHTML = '&#233;';
            sezzleButtonText.appendChild(eacute);
            break;
					case '&ecirc;':
						var ecirc = document.createElement('span');
						ecirc.innerHTML = '&#234;';
						sezzleButtonText.appendChild(ecirc);
						break;
					case '&auml;':
						var auml = document.createElement('span');
						auml.innerHTML = '&#228;';
						sezzleButtonText.appendChild(auml);
						break;
					case '&uuml;':
						var uuml = document.createElement('span');
						uuml.innerHTML = '&#252;';
						sezzleButtonText.appendChild(uuml);
						break;
          default:
            var widgetTextNode = document.createTextNode(subtemplate);
            sezzleButtonText.appendChild(widgetTextNode);
            break;
      }
    }.bind(this));
    node.appendChild(sezzleButtonText);
    this.renderElement.appendChild(node);
    this.addCSSAlignment();
    this.addCSSCustomisation();
  }

  getElementToRender(){
    return this.renderElement;
  }

  isProductEligible(priceText){
    var price = this.parseMode ==='default' ? HelperClass.parsePrice(priceText) : HelperClass.parsePrice(priceText,this.parseMode);
    this.productPrice = price;
    var priceInCents = price * 100;
    return priceInCents >= this.minPrice && priceInCents <= this.maxPrice;
  }

	isProductEligibleLT(priceText){
    var price = this.parseMode ==='default' ? HelperClass.parsePrice(priceText) : HelperClass.parsePrice(priceText,this.parseMode);
    this.productPrice = price;
    var priceInCents = price * 100;
    return this.minPriceLT && priceInCents >= this.minPriceLT && priceInCents <= this.maxPrice;
  }

  getFormattedPrice(amount = this.amount){
    var priceText = amount;
    var priceString =  HelperClass.parsePriceString(priceText, true);
    var price = this.parseMode ==='default' ? HelperClass.parsePrice(priceText) : HelperClass.parsePrice(priceText,this.parseMode);
    var formatter =  priceText.replace(priceString, '{price}');
    var sezzleInstallmentPrice = this.isProductEligibleLT(amount) ? (price * (1+(this.bestAPR/100)) / this.aprTerms).toFixed(2): (price / this.numberOfPayments).toFixed(2);
    if(this.parseMode  === 'comma') {
      var sezzleInstallmentFormattedPrice = formatter.replace('{price}', this.formatCommaPrice(sezzleInstallmentPrice));
    } else {
      var sezzleInstallmentFormattedPrice = formatter.replace('{price}', sezzleInstallmentPrice);
    }
    return sezzleInstallmentFormattedPrice;

  }

  formatCommaPrice(price) {
    var alteredPrice,beforeDecimal,afterDecimal;
    beforeDecimal = Math.floor(price);
    afterDecimal  = (price - beforeDecimal).toFixed(2).split('.')[1];
    alteredPrice = `${beforeDecimal},${afterDecimal}`
    return alteredPrice;
  }

  renderModal(){
    if (!document.getElementsByClassName('sezzle-checkout-modal-lightbox').length) {
      var modalNode = document.createElement('div');
      modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal';
      modalNode.style.display = 'none';
      modalNode.tabindex='-1';
      modalNode.role = 'dialog';
			if(this.isProductEligibleLT(this.amount)){
				modalNode.innerHTML = `<style>.sezzle-modal::-webkit-scrollbar {display: none;}</style><meta name="viewport" content="width=device-width, initial-scale=1.0"><div class="sezzle-checkout-modal-hidden"> <div class="sezzle-modal" title="" style="background-image: none;"> <div class="sezzle-modal-content"> <div class="sezzle-logo" title="Sezzle logo" style="height: 30px; background-repeat: no-repeat; background-position: center; width: 100%;"></div><button title="Close Sezzle Modal" class="close-sezzle-modal" tabindex="0" role="button"></button><div class="sezzle-header" style="font-size: 20px; margin-bottom: 40px;"> Sezzle it now. <span class="header-desktop"  style="font-size: 20px;">Pay us back later.</span> <div class="header-mobile" style="font-size: 20px;">Pay us back later.</div></div><div class="sezzle-row"> <div class="desktop" style="font-size: 16px; font-weight: bold;">6 monthly payments<div style="font-weight: normal; font-size: 14px;">pay 1/6th each month starting today</div></div><div class="mobile" style="font-size: 16px; font-weight: bold;">6 monthly payments<div style="font-weight: normal; font-size: 14px;">pay 1/6th each month starting today</div></div></div><!--<div class="sezzle-payment-pie" title="25% today, 25% week 2, 25% week 4, 25% week 6"> </div>--><div class="sezzle-features" style="display: flex; flex-direction: column; align-items: center; width: 100%; margin: 40px 0px 0px 0px;"><div style="width: 50%; background: #392558; font-weight: bold; border-radius: 5px 5px 0px 0px; color: white; font-size: 12px; padding: 5px;">Benefits</div> <style>@media only screen and (min-width: 698px){.sezzle-benefit-list {display: flex}}</style><div class="sezzle-benefit-list" style="border: 1px solid lightgray; border-radius: 5px; width: 80%; text-align: left; padding: 20px;"><div class="single-feature" style="font-weight: normal; padding: 5px; font-size: 14px; display: flex;"><div style="padding-right: 5px;">${HelperClass.svgImages().checkMarkIcon}</div><div>No interest, ever</div><!--<div class="sub-feature">Plus no fees if you pay on time</div>--></div><div class="single-feature" style="font-weight: normal; padding: 5px; font-size: 14px; display: flex;"><div style="padding-right: 5px;">${HelperClass.svgImages().checkMarkIcon}</div><div>No impact to your credit score</div></div><div class="single-feature"  style="font-weight: normal; padding: 5px; font-size: 14px; display: flex;"><div style="padding-right: 5px;">${HelperClass.svgImages().checkMarkIcon}</div><div>Instant approval decisions</div></div></div></div><div class="sezzle-row"> <div class="desktop"> <div class="just-select-sezzle" style="color: #8427d7; font-size: 20px; padding: 20px 0px;">Just select <span>Sezzle</span> at checkout!</div></div><div class="mobile"> <div class="just-select-sezzle-mobile" style="color: #8427d7; font-weight: normal; font-size: 20px; padding: 20px 0px;"> <div>Just select Sezzle</div><div>at checkout!</div></div></div></div><button title="Close Sezzle Modal" tabindex="1" role="button" style=" width: 120px; background: #392558; color: white; padding: 8px; border-radius: 50px; font-size: 16px; font-family: Comfortaa; border: none; font-weight: bold;">close</button><div class="terms" style="font-size: 8px; color: lightslategray; margin: 15px 0px 30px;">Subject to eligibility check and approval.</div></div></div></div>`;
			} else if (this.altModalHTML) {
        modalNode.innerHTML = this.altModalHTML;
      } else {
        if (this.language === 'fr') {
          modalNode.innerHTML = `<meta name="viewport" content="width=device-width, initial-scale=1.0" /><div class="sezzle-checkout-modal-hidden"><div class="sezzle-modal" title=""><div class="sezzle-modal-content"><div class="sezzle-logo" title="Sezzle logo"></div><button title="Close Sezzle Modal" class="close-sezzle-modal" tabindex="0" role="button"></button><div class="sezzle-header">Sezzlez maintenant. <span class="header-desktop">Payez-nous plus tard.</span><div class="header-mobile">Payez-nous plus tard.</div></div><div class="sezzle-row"><div class="desktop">Payez avec Sezzle pour r&#233;partir le montant de votre commande en 4 versements sans int&#233;r&#234;ts <div>&#233;tal&#233;s sur 6 semaines.</div></div><div class="mobile">Payez avec Sezzle pour r&#233;partir le montant de votre commande en 4 versements sans int&#233;r&#234;ts &#233;tal&#233;s sur 6 semaines.</div></div><div class="sezzle-payment-pie-fr"  title="25% aujourd'hui, 25% semaine 2, 25% semaine 4, 25% semaine 6"></div><div class="sezzle-features"><div class="single-feature"><div>Pas d'int&#233;r&#234;ts jamais.</div><div class="sub-feature">Pas de frais non plus si vous payez aux dates pr&#233;vues </div></div><div class="single-feature"><div style="line-height: 1.2;">Pas d'impact sur<div> votre cote de cr&#233;dit</div></div></div><div class="single-feature"><div>D&#233;cisions d'approbation</div><div>instantan&#233;es</div></div></div><div class="sezzle-row"><div class="desktop"><div class="just-select-sezzle"> Vous n'avez qu'	&#224; choisir <span>Sezzle</span> au moment de r&#233;gler&nbsp;!</div></div><div class="mobile"><div class="just-select-sezzle-mobile"><div>Vous n'avez qu'	&#224; choisir Sezzle</div><div>au moment de r&#233;gler&nbsp;!</div></div></div></div><div class="terms">Sous r&#233;serve d'approbation.</div></div></div></div>`;
        } else if (this.language === 'de'){
          modalNode.innerHTML = `<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<div class="sezzle-checkout-modal-hidden">
						<div class="sezzle-modal" title="">
							<div class="sezzle-modal-content">
								<div class="sezzle-logo" title="Sezzle logo"></div>

								<button title="Close Sezzle Modal" class="close-sezzle-modal" tabindex="0" role="button"></button>

								<div class="sezzle-header">
									Jetzt kaufen.
									<span class="header-desktop">Sp&#228;ter zahlen.</span>
									<div class="header-mobile">Sp&#228;ter zahlen.</div>
								</div>

								<div class="sezzle-row">
									<div class="desktop">
										W&#228;hle Sezzle beim Checkout <br/>und zahle deine gesamte Bestellung ganz einfach mit
										<div>4 zinsfreien Raten in 3 Monaten.</div>
									</div>
									<div class="mobile">
										W&#228;hle Sezzle beim Checkout und zahle deine gesamte Bestellung ganz einfach mit 4 zinsfreien Raten in 3 Monaten.
									</div>
								</div>

								<div class="sezzle-hiw-pie-bg">
									<div class="sezzle-payment-pie-de"></div>
										<div class="sezzle-row breakdown-row">
											<p class="breakdown">25%<br /><span>heute</span></p>
											<p class="breakdown">25%<br /><span>30 Tage</span></p>
											<p class="breakdown">25%<br /><span>60 Tage</span></p>
											<p class="breakdown">25%<br /><span>90 Tage</span></p>
										</div>
								</div>

								<div class="sezzle-features">
									<div class="single-feature">
										<div>Schnelles Zahlen.</div>
										<div class="sub-feature">
											Einfach und zeitsparend
										</div>
									</div>
									<div class="single-feature">
										<div style="line-height: 1.2;">
											Zinsfrei.
											<div class="sub-feature">Keine versteckten Kosten bei p&#252;nktlicher Zahlung.</div>
										</div>
									</div>
									<div class="single-feature">
										<div>Kein Einfluss auf deine</div>
										<div>Kreditw&#252;rdigkeit</div>
									</div>
								</div>

								<div class="sezzle-row">
									<div class="desktop">
										<div class="just-select-sezzle">
											Einfach Sezzle<span> beim Checkout w&#228;hlen</span>!
										</div>
									</div>
									<div class="mobile">
										<div class="just-select-sezzle-mobile">
											<div>Einfach Sezzle</div>
											<div> beim Checkout w&#228;hlen!</div>
										</div>
									</div>
								</div>

								<div class="terms">Vorbehaltlich unserer Zustimmung.</div>
							</div>
						</div>
					</div>
					`;
        } else if (this.language === 'es'){
          modalNode.innerHTML = `<meta name="viewport" content="width=device-width, initial-scale=1.0"><div class="sezzle-checkout-modal-hidden"> <div class="sezzle-modal" title=""> <div class="sezzle-modal-content"> <div class="sezzle-logo" title="Sezzle logo"></div><button title="Close Sezzle Modal" class="close-sezzle-modal" tabindex="0" role="button"></button><div class="sezzle-header"> Sezzle ahora. <span class="header-desktop">Pa&#769;ganos ma&#769;s tarde.</span> <div class="header-mobile">Pa&#769;ganos ma&#769;s tarde.</div></div><div class="sezzle-row"> <div class="desktop"> Complete el pedido con Sezzle y divida toda su compra en <div>4 pagos sin intereses durante 6 semanas.</div></div><div class="mobile"> Complete el pedido con Sezzle y divida toda su compra en 4 pagos sin intereses durante 6 semanas.</div></div>          <div class="sezzle-hiw-pie-bg">
          <div class="sezzle-payment-pie-es"></div>
            <div class="sezzle-row breakdown-row">
              <p class="breakdown">25%<br /><span>hoy</span></p>
              <p class="breakdown">25%<br /><span>semana 2</span></p>
              <p class="breakdown">25%<br /><span>semana 4</span></p>
              <p class="breakdown">25%<br /><span>semana 6</span></p>
            </div>
          </div><div class="sezzle-features"> <div class="single-feature"> <div>Sin intere&#769;s, nunca</div><div class="sub-feature">Adema&#769;s, no hay tarifas si paga a tiempo</div></div><div class="single-feature"> <div style="line-height: 1.2;">Sin impacto en su<div>puntaje crediticio</div></div></div><div class="single-feature"> <div>Decisiones de</div><div>aprobacio&#769;n instanta&#769;neas</div></div></div><div class="sezzle-row"> <div class="desktop"> <div class="just-select-sezzle">¡Simplemente seleccione <span>Sezzle</span> al finalizar la compra!</div></div><div class="mobile"> <div class="just-select-sezzle-mobile"> <div>¡Simplemente seleccione Sezzle</div><div>al finalizar la compra!</div></div></div></div><div class="terms">Sujeto a aprobacio&#769;n.</div></div></div></div>`
        } else {
          modalNode.innerHTML = `<meta name="viewport" content="width=device-width, initial-scale=1.0"><div class="sezzle-checkout-modal-hidden"> <div class="sezzle-modal" title=""> <div class="sezzle-modal-content"> <div class="sezzle-logo" title="Sezzle logo"></div><button title="Close Sezzle Modal" class="close-sezzle-modal" tabindex="0" role="button"></button><div class="sezzle-header"> Sezzle it now. <span class="header-desktop">Pay us back later.</span> <div class="header-mobile">Pay us back later.</div></div><div class="sezzle-row"> <div class="desktop"> Check out with Sezzle and split your entire order into <div>4 interest-free payments over 6 weeks.</div></div><div class="mobile"> Check out with Sezzle and split your entire order into 4 interest-free payments over 6 weeks. </div></div><div class="sezzle-payment-pie" title="25% today, 25% week 2, 25% week 4, 25% week 6"> </div><div class="sezzle-features"> <div class="single-feature"> <div>No Interest, Ever</div><div class="sub-feature">Plus no fees if you pay on time</div></div><div class="single-feature"> <div style="line-height: 1.2;">No Impact to Your<div>Credit Score</div></div></div><div class="single-feature"> <div>Instant Approval</div><div>Decisions</div></div></div><div class="sezzle-row"> <div class="desktop"> <div class="just-select-sezzle">Just select <span>Sezzle</span> at checkout!</div></div><div class="mobile"> <div class="just-select-sezzle-mobile"> <div>Just select Sezzle</div><div>at checkout!</div></div></div></div><div class="terms">Subject to approval.</div></div></div></div>`;
        }

      }
      document.getElementsByTagName('html')[0].appendChild(modalNode);
    } else {
      modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
    }
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
      el.addEventListener('click', function () {
        modalNode.style.display = 'none';
        document.body.ariaHidden = false;
        modalNode.getElementsByClassName('sezzle-modal')[0].className = 'sezzle-modal sezzle-checkout-modal-hidden';
        document.querySelector('.sezzle-checkout-button-wrapper').getElementsByTagName('button')[0].focus();
      });
    });
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0]
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0]
    sezzleModal.addEventListener('click', function (event) {
      event.stopPropagation();
    });
    }

  renderAPModal(){
    var modalNode = document.createElement('div');
    modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-ap-modal';
    modalNode.style = 'position: center';
    modalNode.style.display = 'none';
    modalNode.tabindex='-1';
    modalNode.role = 'dialog';
    modalNode.innerHTML = this.apModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNode);
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
      el.addEventListener('click', function () {
        modalNode.style.display = 'none';
        document.body.ariaHidden = false;
        document.querySelector('.sezzle-checkout-button-wrapper').getElementsByClassName('no-sezzle-info')[0].focus();
      });
    });
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0]
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0]
    sezzleModal.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  renderQPModal(){
    var modalNode = document.createElement('div');
    modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-qp-modal';
    modalNode.style = 'position: center';
    modalNode.style.display = 'none';
    modalNode.tabindex='-1';
    modalNode.role = 'dialog';
    modalNode.innerHTML = this.qpModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNode);
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
      el.addEventListener('click', function () {
        modalNode.style.display = 'none';
        document.body.ariaHidden = false;
        document.querySelector('.sezzle-checkout-button-wrapper').getElementsByClassName('no-sezzle-info')[0].focus();
      });
    });
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0]
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0]
    sezzleModal.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  renderAffirmModal(){
    var modalNode = document.createElement('div');
    modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-affirm-modal';
    modalNode.style = 'position: center';
    modalNode.style.display = 'none';
    modalNode.tabindex='-1';
    modalNode.role = 'dialog';
    modalNode.innerHTML = this.affirmModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNode);
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
      el.addEventListener('click', function () {
        modalNode.style.display = 'none';
        document.body.ariaHidden = false;
        document.querySelector('.sezzle-checkout-button-wrapper').getElementsByClassName('no-sezzle-info')[0].focus();
      });
    });
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0]
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0]
    sezzleModal.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  renderKlarnaModal(){
    var modalNode = document.createElement('div');
    modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-klarna-modal';
    modalNode.style = 'position: center';
    modalNode.style.display = 'none';
    modalNode.tabindex='-1';
    modalNode.role = 'dialog';
    modalNode.innerHTML = this.klarnaModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNode);
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
      el.addEventListener('click', function () {
        modalNode.style.display = 'none';
        document.body.ariaHidden = false;
        document.querySelector('.sezzle-checkout-button-wrapper').getElementsByClassName('no-sezzle-info')[0].focus();
      });
    });
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0]
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0]
    sezzleModal.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  renderModalByfunction(){
    var modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
    modalNode.style.display = 'block';
    document.body.ariaHidden = true;
    modalNode.getElementsByClassName('sezzle-modal')[0].className = 'sezzle-modal';
  }

  addClickEventForModal(sezzleElement){
    var modalLinks = sezzleElement.getElementsByClassName('sezzle-modal-open-link');
    Array.prototype.forEach.call(modalLinks, function (modalLink) {
      modalLink.addEventListener('click', function (event) {
        if (!event.target.classList.contains('no-sezzle-info')) {
          var modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
          modalNode.style.display = 'block';
          modalNode.getElementsByClassName('close-sezzle-modal')[0].focus();
          document.body.ariaHidden = true;
          modalNode.getElementsByClassName('sezzle-modal')[0].className = 'sezzle-modal';
        }
      }.bind(this));
    }.bind(this));
    var apModalLinks = sezzleElement.getElementsByClassName('ap-modal-info-link');
    Array.prototype.forEach.call(apModalLinks, function (modalLink) {
      modalLink.addEventListener('click', function () {
        document.getElementsByClassName('sezzle-ap-modal')[0].style.display = 'block';
        document.getElementsByClassName('sezzle-ap-modal')[0].getElementsByClassName('close-sezzle-modal')[0].focus();
        document.body.ariaHidden = true;
      }.bind(this));
    }.bind(this));
    var qpModalLinks = sezzleElement.getElementsByClassName('quadpay-modal-info-link');
    Array.prototype.forEach.call(qpModalLinks, function (modalLink) {
      modalLink.addEventListener('click', function () {
        document.getElementsByClassName('sezzle-qp-modal')[0].style.display = 'block';
        document.getElementsByClassName('sezzle-qp-modal')[0].getElementsByClassName('close-sezzle-modal')[0].focus();
        document.body.ariaHidden = true;
      }.bind(this));
    }.bind(this));
    var affirmModalLinks = sezzleElement.getElementsByClassName('affirm-modal-info-link');
    Array.prototype.forEach.call(affirmModalLinks, function (modalLink) {
      modalLink.addEventListener('click', function () {
        document.getElementsByClassName('sezzle-affirm-modal')[0].style.display = 'block';
        document.getElementsByClassName('sezzle-affirm-modal')[0].getElementsByClassName('close-sezzle-modal')[0].focus();
        document.body.ariaHidden = true;
      }.bind(this));
    }.bind(this));
    var klarnaModalLinks = sezzleElement.getElementsByClassName('klarna-modal-info-link');
    Array.prototype.forEach.call(klarnaModalLinks, function (modalLink) {
      modalLink.addEventListener('click', function () {
        document.getElementsByClassName('sezzle-klarna-modal')[0].style.display = 'block';
        document.getElementsByClassName('sezzle-klarna-modal')[0].getElementsByClassName('close-sezzle-modal')[0].focus();
        document.body.ariaHidden = true;
      }.bind(this));
    }.bind(this));
  }

  isMobileBrowser(){
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4));
  }

  init(){
    var els = [];
    function renderModals() {
      this.renderModal();
      if (document.getElementsByClassName('ap-modal-info-link').length > 0) {
        this.renderAPModal();
      }
      if (document.getElementsByClassName('quadpay-modal-info-link').length > 0) {
        this.renderQPModal();
      }
      if (document.getElementsByClassName('affirm-modal-info-link').length > 0) {
        this.renderAffirmModal();
      }
      if (document.getElementsByClassName('klarna-modal-info-link').length > 0) {
        this.renderKlarnaModal();
      }
    };
    function sezzleWidgetCheckInterval() {
        this.renderElementArray.forEach(function(el, index){
          els.push({
            element: document.getElementById(el),
          });
        })
      els.forEach(function (el, index) {
        if (!el.element.hasAttribute('data-sezzleindex')) {
          this.renderElement = el.element;
          var sz = this.renderAwesomeSezzle();
          this.addClickEventForModal(document)
        }
      }.bind(this));
      els = els.filter(function (e) {
        return e !== undefined;
      })
    };
    sezzleWidgetCheckInterval.call(this);
    renderModals.call(this);
  }
}

export default AwesomeSezzle;
