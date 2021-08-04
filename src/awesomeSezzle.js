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
		switch(options.merchantLocale){
			case 'North America':
			case 'US':
			case 'CA':
			case 'IN':
			case 'GU':
			case 'PR':
			case 'VI':
			case 'AS':
			case 'MP':
			case 'MX':
			case '':
			case undefined:
			case null:
				this.merchantLocale = 'North America';
				break;
			default:
				this.merchantLocale = 'Europe';
				break;
		}
    if (this.language === 'french') this.language = 'fr';
    if(this.language === 'german' || this.language === 'deutsche') this.language = 'de';
    if(this.language === 'spanish' || this.language === 'espanol' || this.language === 'español') this.language = 'es';
		this.numberOfPayments = options.numberOfPayments || 4;
		var templateString = this.widgetLanguageTranslation(this.language, this.numberOfPayments, this.merchantLocale)
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
    this.ltAltModalHTML = options.ltAltModalHTML || '';
    this.apModalHTML = options.apModalHTML || '';
    this.qpModalHTML = options.qpModalHTML || '';
    this.modalTheme = options.modalTheme || 'color';
    this.affirmModalHTML = options.affirmModalHTML || '';
    this.klarnaModalHTML = options.klarnaModalHTML || '';
    this.alignmentSwitchMinWidth = options.alignmentSwitchMinWidth || 760;
    this.alignmentSwitchType = options.alignmentSwitchType || '';
    this.alignment = options.alignment || 'left';
    this.fontWeight = options.fontWeight || 300;
    this.fontSize = options.fontSize || 12;
    this.fontFamily = options.fontFamily || 'inherit';
    this.maxWidth = options.maxWidth || 400;
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



  widgetLanguageTranslation(language, numberOfPayments, merchantLocale) {
    const translations = {
      'en': 'or ' + numberOfPayments + (merchantLocale === 'North America' ? ' interest-free' : '') + ' payments of %%price%% with %%logo%% %%info%%' + (merchantLocale === 'Europe' ? ' - no fee' : ''),
      'fr': 'ou ' + numberOfPayments + ' paiements de %%price%%' + (merchantLocale === 'North America' ? ' sans int%%&eacute;%%r%%&ecirc;%%ts' : '') + ' avec %%logo%% %%info%%' + (merchantLocale === 'Europe' ? ' - gratuit' : ''),
      'de': 'oder ' + numberOfPayments + (merchantLocale === 'North America' ? ' zinslose Zahlungen von je' : ' mal') + ' %%price%% mit %%logo%% %%info%%' + (merchantLocale === 'Europe' ? ' - kostenlos' : ''),
      'es': 'o ' + numberOfPayments + ' pagos' + (merchantLocale === 'North America' ? ' sin intereses' : '') + ' de %%price%% con %%logo%% %%info%%' + (merchantLocale === 'Europe' ? ' - gratis' : '')
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
		var modals = document.getElementsByClassName('sezzle-checkout-modal-lightbox')
		if(modals.length){
			for(let i = modals.length-1; modals.length > 0; i--){
				modals[i].parentElement.removeChild(modals[i]);
			}
		}
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
    node.tabIndex = 0;
    // node.style.cursor = 'pointer';
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
            learnMoreNode.ariaLabel = 'Learn More about Sezzle';
            learnMoreNode.className = 'sezzle-learn-more sezzle-modal-open-link';
            var learnMoreText = document.createTextNode('Learn more');
            learnMoreNode.appendChild(learnMoreText);
            sezzleButtonText.appendChild(learnMoreNode);
            break;
          case 'info':
            var infoIconNode = document.createElement('button');
            infoIconNode.role = 'button';
            infoIconNode.type = 'button';
            infoIconNode.ariaLabel = 'Learn More about Sezzle';
            infoIconNode.className = 'sezzle-info-icon sezzle-modal-open-link';
            infoIconNode.innerHTML = '&#9432;';
            infoIconNode.ariaHasPopup='true';
            sezzleButtonText.appendChild(infoIconNode);
            break;
          case 'question-mark':
            var questionMarkButton = document.createElement('button');
            questionMarkButton.role = 'button';
            questionMarkButton.type = 'button';
            questionMarkButton.ariaLabel = 'Learn More about Sezzle';
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
            apInfoIconNode.ariaLabel = 'Learn More about Afterpay';
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
            quadpayInfoIconNode.ariaLabel = 'Learn More about Quadpay';
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
            affirmInfoIconNode.ariaLabel = 'Learn More about Affirm';
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
            klarnaInfoIconNode.ariaLabel = 'Learn More about Klarna';
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
		var terms = this.termsToShow(price);
    var sezzleInstallmentPrice = this.isProductEligibleLT(amount) ? (price * (1+(this.bestAPR/100)) / (terms[terms.length - 1])).toFixed(2) : (price / this.numberOfPayments).toFixed(2);
		var sezzleInstallmentFormattedPrice = formatter.replace('{price}', this.addDelimiters(sezzleInstallmentPrice, this.parseMode));
    return sezzleInstallmentFormattedPrice;

  }

	addDelimiters(priceString, parseMode){
		var parsedPrice = Number(priceString).toFixed(2);
		if(parsedPrice.length > 6 && parseMode === "comma"){
			var commaPrice = parsedPrice.replace('.',',');
			return commaPrice.substring(0, commaPrice.indexOf(',')-3) + '.' + commaPrice.substring(commaPrice.indexOf(',')-3, commaPrice.length);
		} else if (parsedPrice.length > 6){
			return parsedPrice.substring(0, parsedPrice.indexOf('.')-3) + ',' + parsedPrice.substring(parsedPrice.indexOf('.')-3, parsedPrice.length);
		} else {
			return parsedPrice;
		}
	}

	termsToShow(price) {
		switch (true){
			case (price >= 4000):
				return [36,48,60];
			case (price >= 3000 && price < 4000):
				return [24,36,48];
			case (price >= 2000 && price < 3000):
				return [18,24,36];
			case (price >= 1500 && price < 2000):
				return [12,18,24];
			case (price >= 1000 && price < 1500):
				return [9,12,18];
			case (price >= 750 && price < 1000):
				return [6,9,12];
			case (price >= 500 && price < 750):
				return [3,6,9];
			case (price >= 250 && price < 500):
				return [3,6];
			default:
				return [3,6];
		}
	}

	currencySymbol(priceText) {
		// var currency = this.amount.split('').filter(function(character){ return /[$|€|£]/.test(character)})[0] || '$';
		// doesn't work with ISO-8859-1
		var currency = 0;
		for(let i = 0; i < priceText.length; i++){
			if(priceText.charCodeAt(i) === 8364 || priceText.charCodeAt(i) === 128 || priceText.charCodeAt(i) === 8356 || priceText.charCodeAt(i) === 163){
				currency = priceText.charCodeAt(i)
			}
		}
		return currency || 36;
	}

	calculateMonthly(priceString, parseMode, term, APR) {
		return this.addDelimiters(((priceString * ( 1+(APR/100) )) / term).toFixed(2), parseMode);
	}
	calculateAdjusted(priceString, parseMode, APR) {
		return this.addDelimiters((priceString * ( 1+(APR/100) )).toFixed(2), parseMode)
	}

	modalKeyboardNavigation (){
		let focusableElements = document.querySelector('.sezzle-checkout-modal-lightbox').querySelectorAll('[tabIndex="0"]');
		let firstFocusableElement = focusableElements[0];
		let lastFocusableElement = focusableElements[focusableElements.length - 1];
		document.addEventListener('keydown', function(event){
			if(event.key === 'Tab'){
				if(event.shiftKey && document.activeElement === firstFocusableElement){
					lastFocusableElement.focus();
					e.preventDefault()
				} else if(document.activeElement === lastFocusableElement){
					firstFocusableElement.focus();
					e.preventDefault();
				}
			} else if(event.key === 'Escape') {
				let modals = document.getElementsByClassName('sezzle-checkout-modal-lightbox');
				for(let i = 0; i < modals.length; i++) {
					modals[i].style.display = 'none';
				}
				var newFocus = document.querySelector('#sezzle-modal-return');
				if(newFocus){
					newFocus.focus();
					newFocus.removeAttribute('id');
				} else {
					document.querySelector('.sezzle-checkout-button-wrapper').getElementsByClassName('button')[0].focus();
				}
			}
		})
	}

  renderModal(){
		const modalTranslations = {
			en: {
				sezzleHeader: 'Sezzle it now.',
				sezzleHeaderChild: 'Pay&nbsp;us back later.',
				sezzleHeaderLt: 'Make easy monthly',
				sezzleHeaderLtChild: 'payments on your&nbsp;order',
				sezzleRowChild1: 'Check&nbsp;out with&nbsp;Sezzle and split your entire&nbsp;order into',
				sezzleRowChild2: '4&nbsp;interest-&#65279free payments over 6 weeks.',
				sezzleRowChild3: 'No&nbsp;fees if you pay&nbsp;on&nbsp;time.',
				sezzleRowLtChild1: 'Your total purchase will be split into&nbsp;payments,',
				sezzleRowLtChild2: 'depending on the plan&nbsp;you&nbsp;choose.',
				today: 'today',
				week: 'week',
				weeks: 'weeks',
				singleFeatureInterest: 'No Interest, Ever',
				subFeatureInterest: 'Plus no fees if you pay on time',
				singleFeatureCredit: 'No Impact to Your Credit&nbsp;Score',
				subFeatureCredit: '',
				singleFeatureApproval: 'Instant Approval Decisions',
				subFeatureApproval: '',
				sezzleLtPaymentHeader: 'Sample payments for',
				monthlyAmount: '/month',
				termLength: 'months',
				adjustedTotal: 'Total:',
				sampleApr: 'APR:',
				justSelectSezzle1: 'Just select',
				justSelectSezzleLt1: 'Just choose',
				justSelectSezzle2: 'at&nbsp;checkout',
				details: 'Provide a few pieces of information and get a real&nbsp;time approval decision. Checking&nbsp;eligibility will&nbsp;not affect your&nbsp;credit.',
				financing: 'FINANCED BY ALLY BANK MEMBER FDIC',
				terms1: 'Subject&nbsp;to&nbsp;approval.',
				terms2: 'Payment&nbsp;start&nbsp;date fluctuates based&nbsp;on time of merchant&nbsp;order&nbsp;completion.',
				termsLt: 'Sample&nbsp;offers are subject&nbsp;to&nbsp;eligibility. Not&nbsp;all&nbsp;applicants will qualify for the sample offer&nbsp;terms. Applicants subject&nbsp;to credit&nbsp;check and approval. See&nbsp;www.Sezzle.com/faqs for&nbsp;details.'
			},
			fr: {
				sezzleHeader: 'Sezzlez maintenant.',
				sezzleHeaderChild: 'Payez-nous plus tard.',
				sezzleHeaderLt: 'Effectuez facilement des paiements',
				sezzleHeaderLtChild: 'mensuels sur votre commande',
				sezzleRowChild1: 'Payez avec Sezzle pour r&#233;partir le montant de&nbsp;votre&nbsp;commande&nbsp;en',
				sezzleRowChild2: '4 versements sans int&#233;r&#234ts &#233;tal&#233;s sur 6 semaines.',
				sezzleRowChild3: 'Pas de frais non plus si vous payez aux dates pr&#233;vues',
				sezzleRowLtChild1: 'Votre achat total sera divis&#233; en paiements,',
				sezzleRowLtChild2: 'selon le plan que vous choisissez.',
				today: 'aujourd\'hui',
				week: 'semaine',
				weeks: 'semaines',
				singleFeatureInterest: 'Pas d\'int&#233;r&#234ts jamais.',
				subFeatureInterest: 'Pas de frais non plus si vous payez aux dates pr&#233;vues',
				singleFeatureCredit: 'Pas d\'impact sur votre cote de cr&#233;dit',
				subFeatureCredit: '',
				singleFeatureApproval: 'D&#233;cisions d\'approbation instantan&#233;es',
				subFeatureApproval: '',
				sezzleLtPaymentHeader: 'Exemples de paiements pour',
				monthlyAmount: '/mois',
				termLength: 'mois',
				adjustedTotal: 'Totale:',
				sampleApr: 'APR:',
				justSelectSezzle1: 'Vous n\'avez qu\' &#224; choisir',
				justSelectSezzleLt1: 'Vous n\'avez qu\' &#224; choisir',
				justSelectSezzle2: 'au moment de r&#233;gler',
				details: 'Fournissez quelques informations et obtenez une d&#233;cision d\'approbation en temps r&#233;el. La v&#233;rification de l\'&#233;ligibilit&#233; n\'affectera pas votre cr&#233;dit.',
				financing: 'FINANCÉ PAR LE MEMBRE DE LA BANQUE ALLY FDIC',
				terms1: 'Sous r&#233;serve d\'approbation.',
				terms2: 'La date de d&#233;but du paiement varie en fonction de l\'heure de fin de la commande du marchand.',
				termsLt: 'Les exemples d\'offres sont sujets &#224; &#233;ligibilit&#233;. Tous les candidats ne pourront pas b&#233;n&#233;ficier des conditions de l\'offre. Les candidats sont soumis &#224; une v&#233;rification de cr&#233;dit et &#224; une approbation. Voir www.Sezzle.com/faqs pour plus de d&#233;tails.'
			},
			de: {
				sezzleHeader: 'Jetzt kaufen.',
				sezzleHeaderChild: 'Sp&#228;ter zahlen.',
				sezzleHeaderLt: 'Machen Sie einfache monatliche',
				sezzleHeaderLtChild: 'Zahlungen f&#252;r Ihre Bestellung',
				sezzleRowChild1: 'W&#228;hle Sezzle beim Checkout und zahle deine gesamte Bestellung ganz einfach mit',
				sezzleRowChild2: '4 zinsfreien Raten in 3 Monaten.',
				sezzleRowChild3: 'Keine versteckten Kosten bei p&#252;nktlicher Zahlung.',
				sezzleRowLtChild1: 'Ihr Gesamtkauf wird je nach gew&#228;hltem',
				sezzleRowLtChild2: 'Plan in Zahlungen aufgeteilt.',
				today: 'heute',
				week: 'Woche',
				weeks: 'Wochen',
				singleFeatureApproval: 'Schnelles Zahlen.',
				subFeatureApproval: 'Einfach und zeitsparend',
				singleFeatureInterest: 'Zinsfrei.',
				subFeatureInterest: 'Keine versteckten Kosten bei p&#252;nktlicher Zahlung.',
				singleFeatureCredit: 'Kein Einfluss auf deine Kreditw&#252;rdigkeit',
				subFeatureCredit: '',
				sezzleLtPaymentHeader: 'Musterzahlungen f&#252;r',
				monthlyAmount: '/Monat',
				termLength: 'Monate',
				adjustedTotal: 'Gesamt:',
				sampleApr: 'APR:',
				justSelectSezzle1: 'Einfach',
				justSelectSezzleLt1: 'Einfach',
				justSelectSezzle2: 'beim Checkout w&#228;hlen',
				details: 'Geben Sie einige Informationen an und erhalten Sie eine Genehmigungsentscheidung in Echtzeit. Die &#0220;berpr&#252;fung der Berechtigung wirkt sich nicht auf Ihr Guthaben aus.',
				financing: 'FINANZIERT VON ALLY BANK MITGLIED FDIC',
				terms1: 'Vorbehaltlich unserer Zustimmung.',
				terms2: 'Das Startdatum der Zahlung schwankt je nach Zeitpunkt des Abschlusses der H&#228;ndlerbestellung.',
				termsLt: 'Musterangebote unterliegen der Berechtigung. Nicht alle Bewerber qualifizieren sich f&#252;r die Musterangebotsbedingungen. Bewerber, die einer Bonit&#228;tspr&#252;fung und Genehmigung unterliegen. Weitere Informationen finden Sie unter www.Sezzle.com/faqs.'
			},
			es: {
				sezzleHeader: 'Sezzle ahora.',
				sezzleHeaderChild: 'Pa&#769;ganos ma&#769;s tarde.',
				sezzleHeaderLt: 'Realice pagos mensuales',
				sezzleHeaderLtChild: 'sencillos en su pedido',
				sezzleRowChild1: 'Complete el pedido con Sezzle y divida toda su compra',
				sezzleRowChild2: 'en 4 pagos sin intereses durante 6 semanas.',
				sezzleRowChild3: 'Adema&#769;s, no hay tarifas si paga a tiempo',
				sezzleRowLtChild1: 'Su compra total se dividira&#769; en pagos,',
				sezzleRowLtChild2: 'segu&#769;n el plan que elija.',
				today: 'hoy',
				week: 'semana',
				weeks: 'semanas',
				singleFeatureInterest: 'Sin intere&#769;s, nunca',
				subFeatureInterest: 'Adema&#769;s, no hay tarifas si paga a tiempo',
				singleFeatureCredit: 'Sin impacto en su puntaje crediticio',
				subFeatureCredit: '',
				singleFeatureApproval: 'Decisiones de aprobacio&#769;n instanta&#769;neas',
				subFeatureApproval: '',
				sezzleLtPaymentHeader: 'Pagos de muestra por',
				monthlyAmount: '/mes',
				termLength: 'meses',
				adjustedTotal: 'Total:',
				sampleApr: 'APR:',
				justSelectSezzle1: '&#161;Simplemente seleccione',
				justSelectSezzleLt1: 'Solo elige',
				justSelectSezzle2: 'al finalizar la compra',
				details: 'Proporcione algunos datos y obtenga una decisio&#769;n de aprobacio&#769;n en tiempo real. Verificar la elegibilidad no afectara&#769; su cre&#769;dito.',
				financing: 'FINANCIADA POR ALLY BANK MIEMBRO FDIC',
				terms1: 'Sujeto a aprobacio&#769;n.',
				terms2: 'La fecha de inicio del pago vari&#769;a segu&#769;n el momento en que se completa la orden comercial.',
				termsLt: 'Las ofertas de muestra esta&#769;n sujetas a elegibilidad. No todos los solicitantes calificara&#769;n para los te&#769;rminos de la oferta de muestra. Solicitantes sujetos a verificacio&#769;n de cre&#769;dito y aprobacio&#769;n. Consulte www.Sezzle.com/faqs para obtener ma&#769;s detalles.'
			}
		}
    if (!document.getElementsByClassName('sezzle-checkout-modal-lightbox').length) {
      var modalNode = document.createElement('div');
      modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal';
      modalNode.style.display = 'none';
      modalNode.tabIndex=0;
      modalNode.role = 'dialog';
      modalNode.ariaModal= 'true';
      modalNode.ariaLabel= 'Sezzle Information';
			if(this.isProductEligibleLT(this.amount)){
				var currency = String.fromCharCode(this.currencySymbol(this.amount));
				var priceString = this.amount.split(currency)[1];
				priceString = this.parseMode === "comma" ? priceString.replace('.','').replace(',','.') : priceString.replace(',','');
				var terms = this.termsToShow(priceString);
				if(this.ltAltModalHTML){
					modalNode.innerHTML = this.ltAltModalHTML;
				} else {
					modalNode.innerHTML = `<style>
					.sezzle-checkout-modal-hidden .sezzle-modal {
						background-image: none;
						max-width: 712px;
					}
					.sezzle-checkout-modal-hidden .sezzle-logo {
						background-repeat: no-repeat;
						background-position: center;
						height: 26px;
						margin: 30px auto;
					}
					.sezzle-checkout-modal-hidden .close-sezzle-modal:before, .sezzle-checkout-modal-hidden .close-sezzle-modal:after {
						background-color: #737373;
						width: 2px;
						height: 15px;
					}
					.sezzle-checkout-modal-hidden .sezzle-header {
						font-size: 20px;
						line-height: 25px;
						margin: 20px auto;
					}
					.sezzle-checkout-modal-hidden .sezzle-row {
						font-size: 12px;
						line-height: 16px;
						width: 80%;
						margin: 10px auto;
					}
					.sezzle-checkout-modal-hidden .sezzle-row .desktop div {
						display: inline;
					}
					.sezzle-checkout-modal-hidden .sezzle-lt-payments {
						width: 80%;
						height: fit-content;
						margin: 20px auto;
						padding: 20px 0px 0px;
						border: 1px solid #E5E5E5;
						border-radius: 5px;
						max-width: 502px;
					}
					.sezzle-checkout-modal-hidden .sezzle-lt-payment-header {
						font-size: 12px;
						line-height: 5px;
						font-weight: bold;
					}
					.sezzle-checkout-modal-hidden .sezzle-lt-payment-header span {
						font-size: 18px;
						line-height: 5px;
						color: #8333D4;
					}
					.sezzle-checkout-modal-hidden .sezzle-lt-payment-options {
						font-size: 12px;
						line-height: 14px;
						margin: 20px 20px 0px;
						padding-bottom: 20px;
						border-bottom: 1px solid #E5E5E5;
					}
					.sezzle-checkout-modal-hidden .sezzle-lt-payment-options:last-child {
						border: none;
					}
					.sezzle-checkout-modal-hidden .sezzle-lt-payment-options .plan {
						display: flex;
						justify-content: space-between;
					}
					.sezzle-checkout-modal-hidden .sezzle-lt-payment-options .monthly-amount span {
						font-size: 18px;
						line-height: 22px;
					}
					.sezzle-checkout-modal-hidden .sezzle-lt-payment-options .plan-details {
						text-align: left;
						display: flex;
						justify-content: space-evenly;
					}
					.sezzle-checkout-modal-hidden .sezzle-lt-payment-options .plan-details div {
						color: #737373;
						width: 100%;
						display: inline;
						font-size: 13px;
					}
					.sezzle-checkout-modal-hidden .just-select-sezzle-mobile, .sezzle-checkout-modal-hidden .just-select-sezzle {
						font-size: 14px;
						line-height: 15px;
						font-weight: normal;
						color: #382757;
						margin: 20px auto;
					}
					.sezzle-checkout-modal-hidden .just-select-sezzle-mobile div, .sezzle-checkout-modal-hidden .just-select-sezzle div {
						display:inline;
					}
					.sezzle-checkout-modal-hidden .just-select-sezzle-mobile .sezzle-logo, .sezzle-checkout-modal-hidden .desktop .just-select-sezzle .sezzle-logo {
						width: 56px;
						height: 14px;
						margin: -2px 2px;
						display: inline-block;
					}
					.sezzle-checkout-modal-hidden .details {
						font-size: 12px;
						line-height: 16px;
						width: 80%;
						margin: 20px auto 30px;
						max-width: 436px;
					}
					.sezzle-checkout-modal-hidden .terms {
						font-size: 9px;
						line-height: 13px;
						color: #737373;
						width: 80%;
						margin: 10px auto 0px;
						padding: 20px 0px 0px;
						border-top: 1px solid #E5E5E5;
						max-width: 436px;
					}
				</style>
				<div class="sezzle-checkout-modal-hidden">
					<div aria-label="Sezzle Modal" class="sezzle-modal">
						<div class="sezzle-modal-content" tabIndex="0">
							<div class="sezzle-logo" title="Sezzle logo"></div>
							<button aria-label="Close Sezzle Modal" class="close-sezzle-modal" role="button"></button>
							<div tabIndex="0" class="sezzle-header">${modalTranslations[this.language].sezzleHeaderLt}
								<span class="header-desktop">${modalTranslations[this.language].sezzleHeaderLtChild}</span>
								<div class="header-mobile">${modalTranslations[this.language].sezzleHeaderLtChild}</div>
							</div>
							<div tabIndex="0" class="sezzle-row">
								<div class="desktop">${modalTranslations[this.language].sezzleRowLtChild1}
									<div>${modalTranslations[this.language].sezzleRowLtChild2}</div>
								</div>
								<div class="mobile">${modalTranslations[this.language].sezzleRowLtChild1} ${modalTranslations[this.language].sezzleRowLtChild2}</div>
							</div>
							<div class="sezzle-lt-payments">
								<div tabIndex="0" class="sezzle-lt-payment-header">${modalTranslations[this.language].sezzleLtPaymentHeader} <span>${currency + this.addDelimiters(priceString, this.parseMode)}</span></div>
								<div class="sezzle-lt-payment-options ${terms[2]}-month" ${terms[2] === undefined ? `style="display: none;"` : `style="display: block;"`}>
									<div class="plan" tabIndex="0" ><div class="monthly-amount"><span>${currency + this.calculateMonthly(priceString, this.parseMode, terms[2], this.bestAPR)}</span> ${modalTranslations[this.language].monthlyAmount}</div>	<div class="term-length">${terms[2]} ${modalTranslations[this.language].termLength}</div></div>
									<div class="plan-details" tabIndex="0"><div class="adjusted-total">${modalTranslations[this.language].adjustedTotal} <span>${currency + this.calculateAdjusted(priceString, this.parseMode, this.bestAPR)}</span></div>	<div class="sample-apr">${modalTranslations[this.language].sampleApr} <span>${this.bestAPR}</span>%</div></div>
								</div>
								<div class="sezzle-lt-payment-options ${terms[1]}-month" ${terms[2] === undefined ? `style="border: none;"` : `style="display: block;"`}>
									<div class="plan" tabIndex="0"><div class="monthly-amount"><span>${currency + this.calculateMonthly(priceString, this.parseMode, terms[1], this.bestAPR)}</span> ${modalTranslations[this.language].monthlyAmount}</div>	<div class="term-length">${terms[1]} ${modalTranslations[this.language].termLength}</div></div>
									<div class="plan-details" tabIndex="0"><div class="adjusted-total">${modalTranslations[this.language].adjustedTotal} <span>${currency + this.calculateAdjusted(priceString, this.parseMode, this.bestAPR)}</span></div>	<div class="sample-apr">${modalTranslations[this.language].sampleApr} <span>${this.bestAPR}</span>%</div></div>
								</div>
								<div class="sezzle-lt-payment-options ${terms[0]}-month">
									<div class="plan" tabIndex="0"><div class="monthly-amount"><span>${currency + this.calculateMonthly(priceString, this.parseMode, terms[0], this.bestAPR)}</span> ${modalTranslations[this.language].monthlyAmount}</div>	<div class="term-length">${terms[0]} ${modalTranslations[this.language].termLength}</div></div>
									<div class="plan-details" tabIndex="0"><div class="adjusted-total">${modalTranslations[this.language].adjustedTotal} <span>${currency + this.calculateAdjusted(priceString, this.parseMode, this.bestAPR)}</span></div>	<div class="sample-apr">${modalTranslations[this.language].sampleApr} <span>${this.bestAPR}</span>%</div></div>
								</div>
							</div>
							<div class="sezzle-row">
								<div class="desktop" tabIndex="0"> <div class="just-select-sezzle">${modalTranslations[this.language].justSelectSezzleLt1} <div class="sezzle-logo" title="Sezzle logo"></div> ${modalTranslations[this.language].justSelectSezzle2}</div></div>
								<div class="mobile" tabIndex="0"> <div class="just-select-sezzle-mobile"> <div>${modalTranslations[this.language].justSelectSezzleLt1} <div class="sezzle-logo" title="Sezzle logo"></div> </div><div>${modalTranslations[this.language].justSelectSezzle2}</div></div></div>
							</div>
							<div class="details" tabIndex="0">${modalTranslations[this.language].details}</div>
							<div class="sezzle-ally-logo" title="Financed by Ally Bank Member FDIC">${HelperClass.svgImages().ltAllyLogo}</div>
							<div class="terms" tabIndex="0">${modalTranslations[this.language].termsLt}</div>
						</div>
					</div>
				</div>`;
							}
			} else if (this.minPriceLT){
				if (this.altModalHTML) {
					modalNode.innerHTML = this.altModalHTML;
				} else {
          modalNode.innerHTML = `<style>
						.sezzle-checkout-modal-hidden .sezzle-modal {
							background-image: none !important;
							max-width: 712px;
						}
						.sezzle-checkout-modal-hidden .sezzle-logo {
							background-repeat: no-repeat;
							background-position: center;
							height: 26px;
							margin: 30px auto;
						}
						.sezzle-checkout-modal-hidden .close-sezzle-modal:before, .sezzle-checkout-modal-hidden .close-sezzle-modal:after {
							background-color: #737373;
							width: 2px;
							height: 15px;
						}
						.sezzle-checkout-modal-hidden .sezzle-header {
							font-size: 20px !important;
							line-height: 25px !important;
							margin: 20px auto;
						}
						.sezzle-checkout-modal-hidden .sezzle-row {
							font-size: 14px;
              line-height: 18px;
							text-align: center;
              width: 80%;
							margin: 10px auto;
						}
						.sezzle-hiw-pie-bg {
							width: 80%;
							margin: 20px auto 10px;
							height: 80px;
							padding: 10px 0px;
							border-top: 1px solid #C4C4C4;
							border-bottom: 1px solid #C4C4C4;
						}
						.sezzle-checkout-modal-hidden .sezzle-payment-pie-lt {
							margin: 0px auto -50px;
						}
						.sezzle-hiw-pie-bg .breakdown-row {
							min-width: 250px;
							max-width: 250px;
							position: static;
							margin: 0px auto;
						}
						.sezzle-hiw-pie-bg .breakdown-row .breakdown {
							font-size: 16px;
							font-weight: normal;
							line-height: 14px
						}
						.sezzle-hiw-pie-bg .breakdown-row .breakdown span {
							font-size: 12px;
							color: #737373;
							line-height: 14px;
						}
						.sezzle-checkout-modal-hidden .sezzle-features {
							width: 80%;
							margin: -10px auto 20px;
							border-bottom: 1px solid #C4C4C4;
							padding: 0px 0px 10px;
						}
						.sezzle-checkout-modal-hidden .single-feature {
							font-size: 16px;
              line-height: 19px;
							font-weight: normal;
							color: #8333D4;
							padding: 12px 0px;
							text-transform: lowercase;
						}
						.sezzle-checkout-modal-hidden .single-feature:first-letter {
							text-transform: uppercase;
						}
						.sezzle-checkout-modal-hidden .single-feature div {
							display: inline;
						}
						.sezzle-checkout-modal-hidden .just-select-sezzle-mobile, .sezzle-checkout-modal-hidden .just-select-sezzle {
							font-size: 14px;
              line-height: 15px;
							font-weight: normal;
							color: #382757;
							margin: 20px auto 40px;
						}
						.sezzle-checkout-modal-hidden .just-select-sezzle-mobile div, .sezzle-checkout-modal-hidden .just-select-sezzle div {
							display: inline;
						}
						.sezzle-checkout-modal-hidden .just-select-sezzle-mobile .sezzle-logo, .sezzle-checkout-modal-hidden .just-select-sezzle .sezzle-logo {
							width: 56px;
							height: 14px;
							margin: -2px 2px;
							display: inline-block;
						}
						.sezzle-checkout-modal-hidden .terms {
							font-size: 9px;
							line-height: 13px;
							color: #737373;
							text-align: center;
							width: 80%;
							margin: 40px auto 10px;
							max-width: 264px;
						}
					</style>
          <div class="sezzle-checkout-modal-hidden"> <div aria-label="Sezzle Modal" class="sezzle-modal"> <div class="sezzle-modal-content" tabIndex="0"> <div class="sezzle-logo" title="Sezzle logo"></div><button aria-label="Close Sezzle Modal" class="close-sezzle-modal" role="button"></button>
            <div tabIndex="0" class="sezzle-header" >${modalTranslations[this.language].sezzleHeader}
              <span class="header-desktop">${modalTranslations[this.language].sezzleHeaderChild}</span>
              <div class="header-mobile">${modalTranslations[this.language].sezzleHeaderChild}</div>
            </div>
            <div tabIndex="0" class="sezzle-row">
              <div class="desktop">${modalTranslations[this.language].sezzleRowChild1}<div>${modalTranslations[this.language].sezzleRowChild2} ${modalTranslations[this.language].sezzleRowChild3}</div></div>
              <div class="mobile">${modalTranslations[this.language].sezzleRowChild1} ${modalTranslations[this.language].sezzleRowChild2} ${modalTranslations[this.language].sezzleRowChild3}</div>
            </div>
            <div class="sezzle-hiw-pie-bg">
							<div class="sezzle-payment-pie-lt" title="25% today, 25% biweekly for the next 6 weeks" style="background-image: none;">${HelperClass.svgImages().ltPaymentPie}</div>
							<div class="sezzle-row breakdown-row">
								<p tabIndex="0" class="breakdown" style="text-transform: capitalize;">25%<br /><span>${modalTranslations[this.language].today}</span></p>
								<p tabIndex="0" class="breakdown">25%<br /><span>2 ${modalTranslations[this.language].weeks}</span></p>
								<p tabIndex="0" class="breakdown">25%<br /><span>4 ${modalTranslations[this.language].weeks}</span></p>
								<p tabIndex="0" class="breakdown">25%<br /><span>6 ${modalTranslations[this.language].weeks}</span></p>
							</div>
            </div>
            <div class="sezzle-features">
							<div tabIndex="0" class="single-feature"> <div>${modalTranslations[this.language].singleFeatureApproval}</div></div>
							<div tabIndex="0" class="single-feature"> <div>${modalTranslations[this.language].singleFeatureInterest}</div></div>
							<div tabIndex="0" class="single-feature"> <div>${modalTranslations[this.language].singleFeatureCredit}</div></div>
            </div>
            <div class="sezzle-row">
              <div class="desktop" tabIndex="0"> <div class="just-select-sezzle">${modalTranslations[this.language].justSelectSezzleLt1} <div class="sezzle-logo" title="Sezzle logo"></div> ${modalTranslations[this.language].justSelectSezzle2}!</div></div>
              <div class="mobile" tabIndex="0"> <div class="just-select-sezzle-mobile"> <div>${modalTranslations[this.language].justSelectSezzleLt1} <div class="sezzle-logo" title="Sezzle logo"></div> </div><div>${modalTranslations[this.language].justSelectSezzle2}!</div></div></div>
            </div>
            <div tabIndex="0" class="terms">${modalTranslations[this.language].terms1} ${modalTranslations[this.language].terms2}</div>
          </div></div></div>`;
				}
			} else if (this.altModalHTML) {
        modalNode.innerHTML = this.altModalHTML;
      }
      else {
					modalNode.innerHTML = `<div class="sezzle-checkout-modal-hidden"> <div aria-label="Sezzle Modal" class="sezzle-modal sezzle-modal${this.modalTheme==="grayscale" ? "-grayscale" : "-color"}"> <div class="sezzle-modal-content" tabIndex="0"> <div class="sezzle-logo${this.modalTheme==="grayscale" ? "-grayscale" : ""}" title="Sezzle logo"></div><button tabIndex="0" aria-label="Close Sezzle Modal" class="close-sezzle-modal" role="button"></button>
					<div tabIndex="0" class="sezzle-header">${modalTranslations[this.language].sezzleHeader}
						<span class="header-desktop">${modalTranslations[this.language].sezzleHeaderChild}</span>
						<div class="header-mobile">${modalTranslations[this.language].sezzleHeaderChild}</div>
					</div>
					<div tabIndex="0" class="sezzle-row">
						<div class="desktop">${modalTranslations[this.language].sezzleRowChild1}
							<div>${modalTranslations[this.language].sezzleRowChild2}</div>
						</div>
						<div class="mobile">${modalTranslations[this.language].sezzleRowChild1} ${modalTranslations[this.language].sezzleRowChild2}</div>
					</div>
					<div class="sezzle-hiw-pie-bg">
						<div class="sezzle-payment-pie-de${this.modalTheme==="grayscale" ? "-grayscale" : ""}"></div>
						<div class="sezzle-row breakdown-row">
							<p tabIndex="0" class="breakdown">25%<br /><span>${modalTranslations[this.language].today}</span></p>
							<p tabIndex="0" class="breakdown">25%<br /><span>${modalTranslations[this.language].week} 2</span></p>
							<p tabIndex="0" class="breakdown">25%<br /><span>${modalTranslations[this.language].week} 4</span></p>
							<p tabIndex="0" class="breakdown">25%<br /><span>${modalTranslations[this.language].week} 6</span></p>
						</div>
					</div>
					<div class="sezzle-features">
						<div tabIndex="0" class="single-feature">
							<div>${modalTranslations[this.language].singleFeatureInterest}</div>
							<div class="sub-feature">${modalTranslations[this.language].subFeatureInterest} </div>
						</div>
						<div tabIndex="0" class="single-feature">
							<div style="line-height: 1.2;">${modalTranslations[this.language].singleFeatureCredit} </div>
							<div class="sub-feature">${modalTranslations[this.language].subFeatureCredit}</div>
						</div>
						<div tabIndex="0" class="single-feature">
							<div>${modalTranslations[this.language].singleFeatureApproval}</div>
							<div class="sub-feature">${modalTranslations[this.language].subFeatureApproval}</div>
						</div>
					</div>
					<div tabIndex="0" class="sezzle-row">
						<div class="desktop">
							<div class="just-select-sezzle${this.modalTheme==="grayscale" ? "-grayscale" : ""}">${modalTranslations[this.language].justSelectSezzle1} <span>Sezzle</span> ${modalTranslations[this.language].justSelectSezzle2}!</div>
						</div>
						<div class="mobile">
							<div class="just-select-sezzle-mobile${this.modalTheme==="grayscale" ? "-grayscale" : ""}">
								<div>${modalTranslations[this.language].justSelectSezzle1} Sezzle</div><div> ${modalTranslations[this.language].justSelectSezzle2}</div>
							</div>
						</div>
					</div>
					<div tabIndex="0" class="terms">${modalTranslations[this.language].terms1}</div>
				</div></div></div>`;
      }
      document.getElementsByTagName('html')[0].appendChild(modalNode);
    } else {
      modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
    }
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
      el.addEventListener('click', function () {
        modalNode.style.display = 'none';
        document.body.ariaHidden = false;
        modalNode.getElementsByClassName('sezzle-modal')[0].className = `sezzle-modal sezzle-modal${this.modalTheme === "grayscale" ? "-grayscale" : "-color"} sezzle-checkout-modal-hidden`;
		var newFocus = document.querySelector('#sezzle-modal-return');
		if(newFocus){
			newFocus.focus();
			newFocus.removeAttribute('id');
		} else {
			document.querySelector('.sezzle-checkout-button-wrapper').querySelector('.sezzle-info-icon').focus();
		}
      });
    });
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0];
    sezzleModal.addEventListener('click', function (event) {
      event.stopPropagation();
    });
		////closes modal when escape key is hit
		window.addEventListener('keydown', this.modalKeyboardNavigation);
  }

  renderAPModal(){
    var modalNode = document.createElement('div');
    modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-ap-modal';
    modalNode.style = 'position: center';
    modalNode.style.display = 'none';
    modalNode.tabIndex=0;
    modalNode.role = 'dialog';
		modalNode.ariaModal= 'true';
		modalNode.ariaLabel= 'Afterpay Information';
    modalNode.innerHTML = this.apModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNode);
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
      el.addEventListener('click', function () {
        modalNode.style.display = 'none';
        document.body.ariaHidden = false;
		var newFocus = document.querySelector('#sezzle-modal-return');
		if(newFocus){
			newFocus.focus();
			newFocus.removeAttribute('id');
		} else {
			document.querySelector('.sezzle-checkout-button-wrapper').querySelector('.ap-modal-info-link').focus();
		}
      });
    });
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0];
    sezzleModal.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  renderQPModal(){
    var modalNode = document.createElement('div');
    modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-qp-modal';
    modalNode.style = 'position: center';
    modalNode.style.display = 'none';
    modalNode.tabIndex=0;
    modalNode.role = 'dialog';
		modalNode.ariaModal= 'true';
		modalNode.ariaLabel= 'Quadpay Information';
    modalNode.innerHTML = this.qpModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNode);
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
      el.addEventListener('click', function () {
        modalNode.style.display = 'none';
        document.body.ariaHidden = false;
		var newFocus = document.querySelector('#sezzle-modal-return');
		if(newFocus){
			newFocus.focus();
			newFocus.removeAttribute('id');
		} else {
			document.querySelector('.sezzle-checkout-button-wrapper').querySelector('.quadpay-modal-info-link').focus();
		}
      });
    });
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0];
    sezzleModal.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  renderAffirmModal(){
    var modalNode = document.createElement('div');
    modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-affirm-modal';
    modalNode.style = 'position: center';
    modalNode.style.display = 'none';
    modalNode.tabIndex=0;
    modalNode.role = 'dialog';
		modalNode.ariaModal= 'true';
		modalNode.ariaLabel= 'Affirm Information';
    modalNode.innerHTML = this.affirmModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNode);
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
      el.addEventListener('click', function () {
        modalNode.style.display = 'none';
        document.body.ariaHidden = false;
		var newFocus = document.querySelector('#sezzle-modal-return');
		if(newFocus){
			newFocus.focus();
			newFocus.removeAttribute('id');
		} else {
			document.querySelector('.sezzle-checkout-button-wrapper').querySelector('.affirm-modal-info-link').focus();
		}
      });
    });
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0];
    sezzleModal.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  renderKlarnaModal(){
    var modalNode = document.createElement('div');
    modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-klarna-modal';
    modalNode.style = 'position: center';
    modalNode.style.display = 'none';
    modalNode.tabIndex=0;
    modalNode.role = 'dialog';
		modalNode.ariaModal= 'true';
		modalNode.ariaLabel= 'Klarna Information';
    modalNode.innerHTML = this.klarnaModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNode);
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
      el.addEventListener('click', function () {
        modalNode.style.display = 'none';
        document.body.ariaHidden = false;
		var newFocus = document.querySelector('#sezzle-modal-return');
		if(newFocus){
			newFocus.focus();
			newFocus.removeAttribute('id');
		} else {
			document.querySelector('.sezzle-checkout-button-wrapper').querySelector('.klarna-modal-info-link').focus();
		}
      });
    });
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0];
    sezzleModal.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  renderModalByfunction(){
    var modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
    modalNode.style.display = 'block';
    document.body.ariaHidden = true;
    modalNode.getElementsByClassName('sezzle-modal')[0].className = `sezzle-modal sezzle-modal${this.modalTheme === "grayscale" ? "-grayscale" : "-color"}`;
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
          modalNode.getElementsByClassName('sezzle-modal')[0].className = `sezzle-modal sezzle-modal${this.modalTheme === "grayscale" ? "-grayscale" : "-color"}`;
		  event.target.id = 'sezzle-modal-return';
        }
      }.bind(this));
    }.bind(this));
    var apModalLinks = sezzleElement.getElementsByClassName('ap-modal-info-link');
    Array.prototype.forEach.call(apModalLinks, function (modalLink) {
      modalLink.addEventListener('click', function (event) {
        document.getElementsByClassName('sezzle-ap-modal')[0].style.display = 'block';
        document.getElementsByClassName('sezzle-ap-modal')[0].focus();
        document.body.ariaHidden = true;
		event.target.id = 'sezzle-modal-return';
	}.bind(this));
    }.bind(this));
    var qpModalLinks = sezzleElement.getElementsByClassName('quadpay-modal-info-link');
    Array.prototype.forEach.call(qpModalLinks, function (modalLink) {
      modalLink.addEventListener('click', function (event) {
        document.getElementsByClassName('sezzle-qp-modal')[0].style.display = 'block';
        document.getElementsByClassName('sezzle-qp-modal')[0].focus();
        document.body.ariaHidden = true;
		event.target.id = 'sezzle-modal-return';
	}.bind(this));
    }.bind(this));
    var affirmModalLinks = sezzleElement.getElementsByClassName('affirm-modal-info-link');
    Array.prototype.forEach.call(affirmModalLinks, function (modalLink) {
      modalLink.addEventListener('click', function (event) {
        document.getElementsByClassName('sezzle-affirm-modal')[0].style.display = 'block';
        document.getElementsByClassName('sezzle-affirm-modal')[0].focus();
        document.body.ariaHidden = true;
		event.target.id = 'sezzle-modal-return';
	}.bind(this));
    }.bind(this));
    var klarnaModalLinks = sezzleElement.getElementsByClassName('klarna-modal-info-link');
    Array.prototype.forEach.call(klarnaModalLinks, function (modalLink) {
      modalLink.addEventListener('click', function (event) {
        document.getElementsByClassName('sezzle-klarna-modal')[0].style.display = 'block';
        document.getElementsByClassName('sezzle-klarna-modal')[0].focus();
        document.body.ariaHidden = true;
		event.target.id = 'sezzle-modal-return';
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
