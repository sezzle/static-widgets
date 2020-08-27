import HelperClass from './awesomeHelper'
import '../css/global.scss';


class AwesomeSezzle {
  
  constructor(options){
    console.log('constructor');
    console.log(this.renderElementArray);
    if (!options) { options = {}; console.error('Config for widget is not supplied'); }
    this.numberOfPayments = options.numberOfPayments || 4;
    switch (typeof (options.language)) {
      case 'string':
        this.language = options.language;
        break;
      case 'function':
        this.language = options.language();
        break;
      default:
        this.language = "en";
    }
    if (this.language === 'french') this.language = 'fr';
    var templateString = this.widgetLanguageTranslation(this.language, this.numberOfPayments)
    this.widgetTemplate  = options.widgetTemplate ? options.widgetTemplate.split('%%') : templateString.split('%%');
    // this.renderElement = document.getElementById(options.renderElement) || document.getElementById('sezzle-widget')
    this.renderElementInitial = options.renderElement || 'sezzle-widget';
    this.assignConfigs(options);
  }

  assignConfigs (options) {
    console.log('assignConfigs');
    console.log(this.renderElementArray);
    this.amount = options.amount || null;
    this.minPrice = options.minPrice || 0;
    this.maxPrice = options.maxPrice || 250000;
    this.altModalHTML = options.altLightboxHTML || '';
    this.apModalHTML = options.apModalHTML || '';
    this.qpModalHTML = options.qpModalHTML || '';
    this.alignmentSwitchMinWidth = options.alignmentSwitchMinWidth || 760;
    this.alignmentSwitchType = options.alignmentSwitchType || '';
    this.alignment = options.alignment || 'left';
    this.fontWeight = options.fontWeight || 300;
    this.fontSize = options.fontSize || 12;
    this.fontFamily = options.fontFamily || "inherit";
    this.maxWidth = options.maxWidth || 'none';
    this.textColor = options.textColor || '#111';
    this.renderElementArray = typeof(this.renderElementInitial) === 'string' ? [this.renderElementInitial] : this.renderElementInitial;
    this.renderElement = this.renderElementInitial;
    this.apLink = options.apLink || 'https://www.afterpay.com/terms-of-service';
    this.widgetType = options.widgetType || 'product-page';
    this.bannerURL = options.bannerURL ||  '';
    this.bannerClass = options.bannerClass || '';
    this.bannerLink = options.bannerLink || '';
    this.marginTop = options.marginTop || 0;
    this.marginBottom = options.marginBottom || 0;
    this.marginLeft = options.marginLeft || 0;
    this.marginRight = options.marginRight || 0;
    this.logoSize = options.logoSize || 1.0;
    this.fixedHeight = options.fixedHeight || 0;
    this.logoStyle = options.logoStyle  || {};
    this.theme = options.theme || 'light';
    this.parseMode = options.parseMode || 'default'; // other available option is comma (For french)
    this.widgetTemplate = this.widgetTemplate;
  }

  widgetLanguageTranslation(language, numberOfPayments) {
    const translations = {
      'en': 'or ' + numberOfPayments + ' interest-free payments of %%price%% with %%logo%% %%info%%',
      'fr': 'ou ' + numberOfPayments + ' paiements de %%price%% sans int%%&eacute;%%r%%&ecirc;%%ts avec %%logo%% %%info%%'
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
        case 'grayscale':
          this.renderElement.children[0].children[0].className = 'szl-light';
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
        this.imageClassName = 'szl-grayscale-image'
        this.imageInnerHTML = HelperClass.svgImages().sezzleGrey
        break;
      case 'black':
        this.imageClassName = 'szl-light-image'
        this.imageInnerHTML = HelperClass.svgImages().sezzleBlack
        break;
      case 'white':
        this.imageClassName = 'szl-light-image'
        this.imageInnerHTML = HelperClass.svgImages().sezzleWhite
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
      case 'product-page':
        this.renderElement.className += ' sezzle-product-page-widget';
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
    this.renderElement.style.transformOrigin = `top ${this.alignment}`;
    this.renderElement.style.transform = `scale(${this.scaleFactor})`;
      if (this.fixedHeight) {
        this.renderElement.style.height = `${this.fixedHeight}px`;
        this.renderElement.style.overflow = 'hidden';
      }
  }


  alterPrice(amt){
    console.log('alterPrice');
    console.log(this.renderElementArray);
    this.eraseWidget();
    this.assignConfigs(this);
    this.amount = amt;
    this.init()
  }

  eraseWidget(){
    this.renderElementArray.forEach(function(element, index){
      let sezzleElement = document.getElementById(element);
      console.log(sezzleElement)
      sezzleElement.removeChild(sezzleElement.childNodes[0])
    })
  }

  setLogoSize(element){
    element.style.transformOrigin = `top ${this.alignment}`;
    element.style.transform = `scale(${this.logoSize})`
  }

  setLogoStyle(element) {
    element.style = this.logoStyle;
  }

  n(newVal){
      var priceNode = document.getElementsByClassName('sezzle-payment-amount')[0];
      var priceValueText = document.createTextNode(this.getFormattedPrice(newVal));
      priceNode.innerHTML = '';
      priceNode.appendChild(priceValueText)
  }

  renderAwesomeSezzle(){
    console.log('renderAwesomeSezzle');
    console.log(this.renderElementArray);
    if (!this.isProductEligible(this.amount)) return false;
    this.insertWidgetTypeCSSClassInElement();
    this.setElementMargins();
    if (this.scaleFactor) this.setWidgetSize();
    var node = document.createElement('div');
    node.className = 'sezzle-checkout-button-wrapper sezzle-modal-link';
    node.style.cursor = 'pointer';
    var sezzleButtonText = document.createElement('div');
    sezzleButtonText.className = 'sezzle-button-text';
    this.setImageURL();
      this.widgetTemplate.forEach(function (subtemplate) {
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
            logoNode.innerHTML = this.imageInnerHTML;
            sezzleButtonText.appendChild(logoNode);
            this.setLogoSize(logoNode);
            if(this.logoStyle != {}) this.setLogoStyle(logoNode);
            break;
          case 'link':
            var learnMoreNode = document.createElement('span');
            learnMoreNode.className = 'sezzle-learn-more sezzle-modal-open-link';
            var learnMoreText = document.createTextNode('Learn more');
            learnMoreNode.appendChild(learnMoreText);
            sezzleButtonText.appendChild(learnMoreNode);
            break;
          case 'info':
            var infoIconNode = document.createElement('code');
            infoIconNode.className = 'sezzle-info-icon sezzle-modal-open-link';
            infoIconNode.innerHTML = '&#9432;';
            sezzleButtonText.appendChild(infoIconNode);
            break;
          case 'question-mark':
            var questionMarkIconNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
            questionMarkIconNode.setAttribute('width','369');
            questionMarkIconNode.setAttribute('height','371');
            questionMarkIconNode.setAttribute('viewBox','0 0 369 371');
            questionMarkIconNode.setAttribute('class','sezzle-question-mark-icon sezzle-modal-open-link');
            questionMarkIconNode.innerHTML = HelperClass.svgImages().questionMarkIcon
            sezzleButtonText.appendChild(questionMarkIconNode);
            break;
          case 'afterpay-logo':
            var apNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
            apNode.setAttribute('width','140');
            apNode.setAttribute('height','29');
            apNode.setAttribute('viewBox','0 0 140 29');
            apNode.setAttribute('class',`sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`);
            apNode.setAttribute('style', `height: 18px !important;width: auto !important;margin-bottom: -5px;`)
            apNode.innerHTML = HelperClass.svgImages().apNodeColor;
            sezzleButtonText.appendChild(apNode);
            this.setLogoSize(apNode);
            break;
          case 'afterpay-logo-grey':
            var apNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
            apNode.setAttribute('width','140');
            apNode.setAttribute('height','29');
            apNode.setAttribute('viewBox','0 0 140 29');
            apNode.setAttribute('class',`sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`);
            apNode.setAttribute('style', `height: 18px !important;width: auto !important;margin-bottom: -5px;`)
            apNode.innerHTML = HelperClass.svgImages().apNodeGrey;
            sezzleButtonText.appendChild(apNode);
            this.setLogoSize(apNode);
            break;
            case 'afterpay-logo-white':
              var apNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
              apNode.setAttribute('width','140');
              apNode.setAttribute('height','29');
              apNode.setAttribute('viewBox','0 0 140 29');
              apNode.setAttribute('class',`sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`);
              apNode.setAttribute('style', `height: 18px !important;width: auto !important;margin-bottom: -5px;`)
              apNode.innerHTML = HelperClass.svgImages().apNodeWhite;
              sezzleButtonText.appendChild(apNode);
              this.setLogoSize(apNode);
              break;
          case 'afterpay-info-icon':
            var apInfoIconNode = document.createElement('code');
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
            qpNode.setAttribute('width','118');
            qpNode.setAttribute('height','22');
            qpNode.setAttribute('viewBox','0 0 118 22');
            qpNode.setAttribute('class',`sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`);
            qpNode.innerHTML = HelperClass.svgImages().qpNodeColor;
            sezzleButtonText.appendChild(qpNode);
            this.setLogoSize(qpNode);
            break;
          case 'quadpay-logo-grey':
              var qpNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
              qpNode.setAttribute('width','118');
              qpNode.setAttribute('height','22');
              qpNode.setAttribute('viewBox','0 0 118 22');
              qpNode.setAttribute('class',`sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`);
              qpNode.innerHTML = HelperClass.svgImages().qpNodeGrey;;
              sezzleButtonText.appendChild(qpNode);
              this.setLogoSize(qpNode);
              break;
          case 'quadpay-logo-white':
                var qpNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
              qpNode.setAttribute('width','118');
              qpNode.setAttribute('height','22');
              qpNode.setAttribute('viewBox','0 0 118 22');
              qpNode.setAttribute('class',`sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`);
              qpNode.innerHTML = HelperClass.svgImages().qpNodeWhite;;
              sezzleButtonText.appendChild(qpNode);
              this.setLogoSize(qpNode);
              break;
          case 'quadpay-info-icon':
            var quadpayInfoIconNode = document.createElement('code');
            quadpayInfoIconNode.className = 'quadpay-modal-info-link no-sezzle-info';
            quadpayInfoIconNode.innerHTML = '&#9432;';
            sezzleButtonText.appendChild(quadpayInfoIconNode);
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
    console.log('getElementToRender');
    console.log(this.renderElementArray);
    return this.renderElement; 
  }

  isProductEligible(priceText){
    var price = this.parseMode ==='default' ? HelperClass.parsePrice(priceText) : HelperClass.parsePrice(priceText,this.parseMode);
    this.productPrice = price;
    var priceInCents = price * 100;
    return priceInCents >= this.minPrice && priceInCents <= this.maxPrice;
  }

  getFormattedPrice(amount = this.amount){
    var priceText = amount;
    var priceString =  HelperClass.parsePriceString(priceText, true);
    var price = this.parseMode ==='default' ? HelperClass.parsePrice(priceText) : HelperClass.parsePrice(priceText,this.parseMode);
    var formatter =  priceText.replace(priceString, '{price}');
    var sezzleInstallmentPrice = (price / this.numberOfPayments).toFixed(2);
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
    afterDecimal  = (price - beforeDecimal).toFixed(2).split(".")[1];
    alteredPrice = `${beforeDecimal},${afterDecimal}`
    return alteredPrice;
  }

  renderModal(){
    if (!document.getElementsByClassName('sezzle-checkout-modal-lightbox').length) {
      var modalNode = document.createElement('div');
      modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal';
      modalNode.style.display = 'none';
      if (this.altModalHTML) {
        modalNode.innerHTML = this.altModalHTML;
      } else {
        if (this.language === "en") {
          modalNode.innerHTML = `<meta name="viewport" content="width=device-width, initial-scale=1.0"><div class="sezzle-checkout-modal-hidden"> <div class="sezzle-modal"> <div class="sezzle-modal-content"> <div class="sezzle-logo"></div><div class="close-sezzle-modal"></div><div class="sezzle-header"> Sezzle it now. <span class="header-desktop">Pay us back later.</span> <div class="header-mobile">Pay us back later.</div></div><div class="sezzle-row"> <div class="desktop"> Check out with Sezzle and split your entire order into <div>4 interest-free payments over 6 weeks.</div></div><div class="mobile"> Check out with Sezzle and split your entire order into 4 interest-free payments over 6 weeks. </div></div><div class="sezzle-payment-pie"> </div><div class="sezzle-features"> <div class="single-feature"> <div>No Interest, Ever</div><div class="sub-feature">Plus no fees if you pay on time</div></div><div class="single-feature"> <div style="line-height: 1.2;">No Impact to Your<div>Credit Score</div></div></div><div class="single-feature"> <div>Instant Approval</div><div>Decisions</div></div></div><div class="sezzle-row"> <div class="desktop"> <div class="just-select-sezzle">Just select <span>Sezzle</span> at checkout!</div></div><div class="mobile"> <div class="just-select-sezzle-mobile"> <div>Just select Sezzle</div><div>at checkout!</div></div></div></div><div class="terms">Subject to approval.</div></div></div></div>`;
        } else {
          modalNode.innerHTML = `<meta name="viewport" content="width=device-width, initial-scale=1.0" /><div class="sezzle-checkout-modal-hidden"><div class="sezzle-modal"><div class="sezzle-modal-content"><div class="sezzle-logo"></div><div class="close-sezzle-modal"></div><div class="sezzle-header">Sezzlez maintenant. <span class="header-desktop">Payez-nous plus tard.</span><div class="header-mobile">Payez-nous plus tard.</div></div><div class="sezzle-row"><div class="desktop">Payez avec Sezzle pour r&#233;partir le montant de votre commande en 4 versements sans int&#233;r&#234;ts <div>&#233;tal&#233;s sur 6 semaines.</div></div><div class="mobile">Payez avec Sezzle pour r&#233;partir le montant de votre commande en 4 versements sans int&#233;r&#234;ts &#233;tal&#233;s sur 6 semaines.</div></div><div class="sezzle-payment-pie-fr"></div><div class="sezzle-features"><div class="single-feature"><div>Pas d'int&#233;r&#234;ts jamais.</div><div class="sub-feature">Pas de frais non plus si vous payez aux dates pr&#233;vues </div></div><div class="single-feature"><div style="line-height: 1.2;">Pas d'impact sur<div> votre cote de cr&#233;dit</div></div></div><div class="single-feature"><div>D&#233;cisions d'approbation</div><div>instantan&#233;es</div></div></div><div class="sezzle-row"><div class="desktop"><div class="just-select-sezzle"> Vous n'avez qu'	&#224; choisir <span>Sezzle</span> au moment de r&#233;gler&nbsp;!</div></div><div class="mobile"><div class="just-select-sezzle-mobile"><div>Vous n'avez qu'	&#224; choisir Sezzle</div><div>au moment de r&#233;gler&nbsp;!</div></div></div></div><div class="terms">Sous r&#233;serve d'approbation.</div></div></div></div>`;
        }
       
      }
      document.getElementsByTagName('html')[0].appendChild(modalNode);
    } else {
      modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
    } 
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
      el.addEventListener('click', function () {
        modalNode.style.display = 'none';
        modalNode.getElementsByClassName('sezzle-modal')[0].className = 'sezzle-modal sezzle-checkout-modal-hidden';
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
    modalNode.innerHTML = this.apModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNode);
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
      el.addEventListener('click', function () {
        modalNode.style.display = 'none';
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
    modalNode.innerHTML = this.qpModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNode);
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
      el.addEventListener('click', function () {
        modalNode.style.display = 'none';
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
    modalNode.getElementsByClassName('sezzle-modal')[0].className = 'sezzle-modal';
  }

  addClickEventForModal(sezzleElement){
    var modalLinks = sezzleElement.getElementsByClassName('sezzle-modal-open-link');
    Array.prototype.forEach.call(modalLinks, function (modalLink) {
      modalLink.addEventListener('click', function (event) {
        if (!event.target.classList.contains('no-sezzle-info')) {
          var modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
          modalNode.style.display = 'block';
          modalNode.getElementsByClassName('sezzle-modal')[0].className = 'sezzle-modal'; 
        }
      }.bind(this));
    }.bind(this));
    var apModalLinks = sezzleElement.getElementsByClassName('ap-modal-info-link');
    Array.prototype.forEach.call(apModalLinks, function (modalLink) {
      modalLink.addEventListener('click', function () {
        document.getElementsByClassName('sezzle-ap-modal')[0].style.display = 'block';
      }.bind(this));
    }.bind(this));
    var qpModalLinks = sezzleElement.getElementsByClassName('quadpay-modal-info-link');
    Array.prototype.forEach.call(qpModalLinks, function (modalLink) {
      modalLink.addEventListener('click', function () {
        document.getElementsByClassName('sezzle-qp-modal')[0].style.display = 'block';
      }.bind(this));
    }.bind(this));
  }

  isMobileBrowser(){
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4));
  }

  init(){
    console.log('init');
    console.log(this.renderElementArray);
    var els = [];
    function renderModals() {
      this.renderModal();
      if (document.getElementsByClassName('ap-modal-info-link').length > 0) {
        this.renderAPModal();
      }
      if (document.getElementsByClassName('quadpay-modal-info-link').length > 0) {
        this.renderQPModal();
      }
    };
    function sezzleWidgetCheckInterval() {
      // if (!this.renderElement.hasAttribute('data-sezzleindex')) {
        this.renderElementArray.forEach(function(el, index){
          els.push({
            element: document.getElementById(el),
          });
        })
        console.log(els)
      // }
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