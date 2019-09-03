import HelperClass from './awesomeHelper'
import '../css/global.scss';
import '../css/sezzle.css';
import '../css/style.css';


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

class AwesomeSezzle {
    constructor(options){
        if (!options) {
            options = {}
            console.error('Config for widget is not supplied')
        }
       
        this.amount = options.amount || null;
        this.numberOfPayments = options.numberOfPayments || 4;
        this.minPrice = options.minPrice || 0; // in cents
        this.maxPrice = options.maxPrice || 250000; // in cents
        this.altModalHTML = options.altLightboxHTML || '';
        // if doing widget with both Sezzle or afterpay - the modal to display:
        this.apModalHTML = options.apModalHTML || '';
        // if doing widget with both Sezzle or quadpay - the modal to display:
        this.qpModalHTML = options.qpModalHTML || '';

        var templateString  = options.widgetTemplate || 'or ' + this.numberOfPayments + ' interest-free payments of %%price%% with %%logo%% %%info%%';
        this.widgetTemplate  = templateString.split('%%');
        this.alignmentSwitchMinWidth = options.alignmentSwitchMinWidth || 760;
        this.alignmentSwitchType = options.alignmentSwitchType || '';
        this.alignment = options.alignment || 'left';

        this.fontWeight = options.fontWeight || 300;
        this.fontSize = options.fontSize || 12; //pixels
        this.fontFamily = options.fontFamily || "inherit";

        this.maxWidth = options.maxWidth || 400;

        this.textColor = options.textColor || '#111';
        this.renderElement = document.getElementById(options.renderElement) || document.getElementById('sezzle-widget');
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

    }
    //2
    /**
     * This function loads up CSS dynamically to clients page
     * @return void
     */
    loadCSS(callback){
      callback();
        // this.getCSSVersionForMerchant(function () {
        //     var head = document.head;
        //     var link = document.createElement('link');
        //     link.type = 'text/css';
        //     link.rel = 'stylesheet';
        //     link.href = '../css/style.css';
        //     head.appendChild(link);
        //     link.onload = callback;
        //   }.bind(this));
    }

    addCSSAlignment(){
        var newAlignment = '';
        if (matchMedia && this.alignmentSwitchMinWidth && this.alignmentSwitchType) {
          var queryString = '(min-width: ' + this.alignmentSwitchMinWidth + 'px)';
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
            // if there is no alignment specified, it will be auto
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
          this.renderElement.children[0].children[0].style.fontSize = this.fontSize + 'px';
        }
    }
    //6
    addCSSWidth(){
        if (this.maxWidth) {
            this.renderElement.children[0].children[0].style.maxWidth = this.maxWidth + 'px';
        }
    }
    //7
    addCSSTextColor(){
        if (this.textColor) {
          this.renderElement.children[0].children[0].style.color = this.textColor;
        }
    }
    //8
     addCSSTheme(){
        switch (this.theme) {
            case 'dark':
              this.renderElement.children[0].children[0].className += ' szl-dark'; 
              break;
            case 'grayscale':
              this.renderElement.children[0].children[0].className = 'szl-grayscale-image';
            default:
              this.renderElement.children[0].children[0].className += ' szl-light';
              break;
        }
    }

        //8
        setImageURL(){
          switch (this.theme) {
              case 'dark':
                this.imageClassName = 'szl-dark-image'
                this.imageInnerHTML = `<g fill="none" fill-rule="nonzero">
                    <path fill="#B2D971" d="M11.653.015c.383 1.679.796 3.402 1.809 4.8 2.693 3.924 6.565 6.79 9.015 10.926.801 1.335 1.447 2.917 1.195 4.533-.297 1.435-1.246 2.58-2.13 3.66-.378-1.72-1.064-3.365-2.075-4.774-2.312-3.277-5.327-5.88-8.007-8.803-1.254-1.346-2.195-3.152-2.088-5.094-.045-2.024 1.086-3.776 2.28-5.248z"/>
                    <path fill="#75C856" d="M7.068 4.9c.225 1.93.903 3.816 2.055 5.341 2.75 3.708 6.437 6.572 8.8 10.614.695 1.262 1.322 2.708 1.134 4.207-.292 1.486-1.262 2.67-2.146 3.813-.426-1.635-1.019-3.243-1.991-4.61-2.37-3.398-5.502-6.069-8.244-9.11-1.165-1.28-2.02-2.978-1.961-4.79-.083-2.108 1.048-3.98 2.353-5.465z"/>
                    <path fill="#4BB63F" d="M2.338 9.907c.362 1.68.798 3.396 1.8 4.794 2.729 3.96 6.652 6.857 9.096 11.059.81 1.386 1.458 3.053 1.05 4.703-.39 1.279-1.213 2.342-2.052 3.328-.424-1.763-1.123-3.461-2.187-4.899-2.334-3.186-5.28-5.774-7.922-8.658C.883 18.9-.053 17.12.076 15.191c-.094-2.041 1.026-3.827 2.262-5.284z"/>
                    <path fill="#FFF" d="M85.84 8.725h2.583c.021 5.685 0 11.37.01 17.055h-2.597c.003-5.685-.004-11.37.003-17.055zM33.757 12.55c2.88-.143 5.767-.011 8.65-.064-.003.941-.003 1.879-.003 2.816-2.82-.011-5.635-.007-8.45-.004.003.862.01 1.724.017 2.586 2.333.022 4.67-.042 7.003.019 1.058.026 2.008 1.073 2.02 2.188.035 1.259.056 2.522-.019 3.776-.11 1.21-1.282 2-2.372 1.913-2.98.008-5.96-.004-8.94-.004.007-.907.014-1.81.036-2.714 2.908.012 5.813-.015 8.722.02v-2.54c-2.216 0-4.435.048-6.65-.012-1.068.007-2.126-.794-2.187-1.98a26.587 26.587 0 0 1 .014-4.098c.136-1.112 1.133-1.89 2.159-1.902zm10.987 2.23c.021-1.22 1.08-2.252 2.226-2.23 2.415-.124 4.838-.049 7.253-.041 1.158-.053 2.466.654 2.648 1.961.157 1.3.143 2.628.04 3.932-.054 1.232-1.158 2.135-2.284 2.124-2.462.072-4.927-.004-7.389.03v2.51c3.048.095 6.12-.204 9.154.17-.014.84-.021 1.682-.032 2.521-3.126.034-6.26.042-9.386.008-1.262.008-2.37-1.281-2.244-2.608.01-2.794-.018-5.587.014-8.377zm2.487.526c.003.858.007 1.72.014 2.578 2.38.004 4.76-.004 7.14.004.003-.866.003-1.735.006-2.605-2.386.027-4.773 0-7.16.023zm23.4-2.812l-.021 1.459c-2.64 3-5.203 6.082-7.832 9.098 2.583.026 5.17.019 7.753.004.05.903.093 1.807.118 2.71-4.12.03-8.24.008-12.363.015v-1.485c2.594-3.017 5.242-5.984 7.857-8.982-2.615-.034-5.234-.01-7.85-.015-.007-.937-.007-1.87-.003-2.804 4.112 0 8.229-.008 12.341 0zm1.222-.004c4.124.004 8.247 0 12.37.004l.033 1.315c-2.59 3.126-5.296 6.142-7.89 9.265.815 0 1.63-.004 2.444-.012 1.772.012 3.541 0 5.313-.011.072.907.129 1.814.133 2.725-4.135.008-8.269.004-12.403.004-.003-.51-.003-1.024-.003-1.535 2.683-2.933 5.216-6.021 7.914-8.943-2.633-.015-5.27-.004-7.907-.004-.004-.937-.007-1.87-.004-2.808zm18.495 2.366c-.09-1.368 1.168-2.393 2.39-2.325 2.39-.079 4.788-.053 7.179-.019 1.132-.045 2.315.753 2.519 1.977.128 1.248.089 2.51.043 3.765-.015 1.195-.994 2.22-2.116 2.26-2.519.095-5.041.012-7.564.03v2.53c3.026-.023 6.056.003 9.083-.015.01.907.018 1.81.021 2.717-3.073-.003-6.146.02-9.218-.003-1.165.049-2.366-.983-2.334-2.26a388.346 388.346 0 0 1-.003-8.657zm2.444.442c.007.862.014 1.728.025 2.59 2.415-.008 4.834 0 7.25-.004.007-.862.01-1.72.018-2.582-2.43-.011-4.864-.004-7.293-.004z"/>
                </g>`
                break;
              case 'grayscale':
                this.imageClassName = 'szl-grayscale-image'
                  this.imageInnerHTML = `<g fill="none" fill-rule="nonzero">
                      <path fill="#606060" d="M11.653.015c.383 1.679.796 3.402 1.809 4.8 2.693 3.924 6.565 6.79 9.015 10.926.801 1.335 1.447 2.917 1.195 4.533-.297 1.435-1.246 2.58-2.13 3.66-.378-1.72-1.064-3.365-2.075-4.774-2.312-3.277-5.327-5.88-8.007-8.803-1.254-1.346-2.195-3.152-2.088-5.094-.045-2.024 1.086-3.776 2.28-5.248z"/>
                      <path fill="#434343" d="M7.068 4.9c.225 1.93.903 3.816 2.055 5.341 2.75 3.708 6.437 6.572 8.8 10.614.695 1.262 1.322 2.708 1.134 4.207-.292 1.486-1.262 2.67-2.146 3.813-.426-1.635-1.019-3.243-1.991-4.61-2.37-3.398-5.502-6.069-8.244-9.11-1.165-1.28-2.02-2.978-1.961-4.79-.083-2.108 1.048-3.98 2.353-5.465z"/>
                      <path fill="#000" d="M2.338 9.907c.362 1.68.798 3.396 1.8 4.794 2.729 3.96 6.652 6.857 9.096 11.059.81 1.386 1.458 3.053 1.05 4.703-.39 1.279-1.213 2.342-2.052 3.328-.424-1.763-1.123-3.461-2.187-4.899-2.334-3.186-5.28-5.774-7.922-8.658C.883 18.9-.053 17.12.076 15.191c-.094-2.041 1.026-3.827 2.262-5.284zM85.84 8.725h2.583c.021 5.685 0 11.37.01 17.055h-2.597c.003-5.685-.004-11.37.003-17.055zM33.757 12.55c2.88-.143 5.767-.011 8.65-.064-.003.941-.003 1.879-.003 2.816-2.82-.011-5.635-.007-8.45-.004.003.862.01 1.724.017 2.586 2.333.022 4.67-.042 7.003.019 1.058.026 2.008 1.073 2.02 2.188.035 1.259.056 2.522-.019 3.776-.11 1.21-1.282 2-2.372 1.913-2.98.008-5.96-.004-8.94-.004.007-.907.014-1.81.036-2.714 2.908.012 5.813-.015 8.722.02v-2.54c-2.216 0-4.435.048-6.65-.012-1.068.007-2.126-.794-2.187-1.98a26.587 26.587 0 0 1 .014-4.098c.136-1.112 1.133-1.89 2.159-1.902zm10.987 2.23c.021-1.22 1.08-2.252 2.226-2.23 2.415-.124 4.838-.049 7.253-.041 1.158-.053 2.466.654 2.648 1.961.157 1.3.143 2.628.04 3.932-.054 1.232-1.158 2.135-2.284 2.124-2.462.072-4.927-.004-7.389.03v2.51c3.048.095 6.12-.204 9.154.17-.014.84-.021 1.682-.032 2.521-3.126.034-6.26.042-9.386.008-1.262.008-2.37-1.281-2.244-2.608.01-2.794-.018-5.587.014-8.377zm2.487.526c.003.858.007 1.72.014 2.578 2.38.004 4.76-.004 7.14.004.003-.866.003-1.735.006-2.605-2.386.027-4.773 0-7.16.023zm23.4-2.812l-.021 1.459c-2.64 3-5.203 6.082-7.832 9.098 2.583.026 5.17.019 7.753.004.05.903.093 1.807.118 2.71-4.12.03-8.24.008-12.363.015v-1.485c2.594-3.017 5.242-5.984 7.857-8.982-2.615-.034-5.234-.01-7.85-.015-.007-.937-.007-1.87-.003-2.804 4.112 0 8.229-.008 12.341 0zm1.222-.004c4.124.004 8.247 0 12.37.004l.033 1.315c-2.59 3.126-5.296 6.142-7.89 9.265.815 0 1.63-.004 2.444-.012 1.772.012 3.541 0 5.313-.011.072.907.129 1.814.133 2.725-4.135.008-8.269.004-12.403.004-.003-.51-.003-1.024-.003-1.535 2.683-2.933 5.216-6.021 7.914-8.943-2.633-.015-5.27-.004-7.907-.004-.004-.937-.007-1.87-.004-2.808zm18.495 2.366c-.09-1.368 1.168-2.393 2.39-2.325 2.39-.079 4.788-.053 7.179-.019 1.132-.045 2.315.753 2.519 1.977.128 1.248.089 2.51.043 3.765-.015 1.195-.994 2.22-2.116 2.26-2.519.095-5.041.012-7.564.03v2.53c3.026-.023 6.056.003 9.083-.015.01.907.018 1.81.021 2.717-3.073-.003-6.146.02-9.218-.003-1.165.049-2.366-.983-2.334-2.26a388.346 388.346 0 0 1-.003-8.657zm2.444.442c.007.862.014 1.728.025 2.59 2.415-.008 4.834 0 7.25-.004.007-.862.01-1.72.018-2.582-2.43-.011-4.864-.004-7.293-.004z"/>
                  </g>`

              default:
                this.imageClassName = 'szl-light-image'
                this.imageInnerHTML = `<g fill="none" fill-rule="nonzero">
                    <path fill="#B2D971" d="M11.653.015c.383 1.679.796 3.402 1.809 4.8 2.693 3.924 6.565 6.79 9.015 10.926.801 1.335 1.447 2.917 1.195 4.533-.297 1.435-1.246 2.58-2.13 3.66-.378-1.72-1.064-3.365-2.075-4.774-2.312-3.277-5.327-5.88-8.007-8.803-1.254-1.346-2.195-3.152-2.088-5.094-.045-2.024 1.086-3.776 2.28-5.248z"/>
                    <path fill="#75C856" d="M7.068 4.9c.225 1.93.903 3.816 2.055 5.341 2.75 3.708 6.437 6.572 8.8 10.614.695 1.262 1.322 2.708 1.134 4.207-.292 1.486-1.262 2.67-2.146 3.813-.426-1.635-1.019-3.243-1.991-4.61-2.37-3.398-5.502-6.069-8.244-9.11-1.165-1.28-2.02-2.978-1.961-4.79-.083-2.108 1.048-3.98 2.353-5.465z"/>
                    <path fill="#4BB63F" d="M2.338 9.907c.362 1.68.798 3.396 1.8 4.794 2.729 3.96 6.652 6.857 9.096 11.059.81 1.386 1.458 3.053 1.05 4.703-.39 1.279-1.213 2.342-2.052 3.328-.424-1.763-1.123-3.461-2.187-4.899-2.334-3.186-5.28-5.774-7.922-8.658C.883 18.9-.053 17.12.076 15.191c-.094-2.041 1.026-3.827 2.262-5.284z"/>
                    <path fill="#000" d="M85.84 8.725h2.583c.021 5.685 0 11.37.01 17.055h-2.597c.003-5.685-.004-11.37.003-17.055zM33.757 12.55c2.88-.143 5.767-.011 8.65-.064-.003.941-.003 1.879-.003 2.816-2.82-.011-5.635-.007-8.45-.004.003.862.01 1.724.017 2.586 2.333.022 4.67-.042 7.003.019 1.058.026 2.008 1.073 2.02 2.188.035 1.259.056 2.522-.019 3.776-.11 1.21-1.282 2-2.372 1.913-2.98.008-5.96-.004-8.94-.004.007-.907.014-1.81.036-2.714 2.908.012 5.813-.015 8.722.02v-2.54c-2.216 0-4.435.048-6.65-.012-1.068.007-2.126-.794-2.187-1.98a26.587 26.587 0 0 1 .014-4.098c.136-1.112 1.133-1.89 2.159-1.902zm10.987 2.23c.021-1.22 1.08-2.252 2.226-2.23 2.415-.124 4.838-.049 7.253-.041 1.158-.053 2.466.654 2.648 1.961.157 1.3.143 2.628.04 3.932-.054 1.232-1.158 2.135-2.284 2.124-2.462.072-4.927-.004-7.389.03v2.51c3.048.095 6.12-.204 9.154.17-.014.84-.021 1.682-.032 2.521-3.126.034-6.26.042-9.386.008-1.262.008-2.37-1.281-2.244-2.608.01-2.794-.018-5.587.014-8.377zm2.487.526c.003.858.007 1.72.014 2.578 2.38.004 4.76-.004 7.14.004.003-.866.003-1.735.006-2.605-2.386.027-4.773 0-7.16.023zm23.4-2.812l-.021 1.459c-2.64 3-5.203 6.082-7.832 9.098 2.583.026 5.17.019 7.753.004.05.903.093 1.807.118 2.71-4.12.03-8.24.008-12.363.015v-1.485c2.594-3.017 5.242-5.984 7.857-8.982-2.615-.034-5.234-.01-7.85-.015-.007-.937-.007-1.87-.003-2.804 4.112 0 8.229-.008 12.341 0zm1.222-.004c4.124.004 8.247 0 12.37.004l.033 1.315c-2.59 3.126-5.296 6.142-7.89 9.265.815 0 1.63-.004 2.444-.012 1.772.012 3.541 0 5.313-.011.072.907.129 1.814.133 2.725-4.135.008-8.269.004-12.403.004-.003-.51-.003-1.024-.003-1.535 2.683-2.933 5.216-6.021 7.914-8.943-2.633-.015-5.27-.004-7.907-.004-.004-.937-.007-1.87-.004-2.808zm18.495 2.366c-.09-1.368 1.168-2.393 2.39-2.325 2.39-.079 4.788-.053 7.179-.019 1.132-.045 2.315.753 2.519 1.977.128 1.248.089 2.51.043 3.765-.015 1.195-.994 2.22-2.116 2.26-2.519.095-5.041.012-7.564.03v2.53c3.026-.023 6.056.003 9.083-.015.01.907.018 1.81.021 2.717-3.073-.003-6.146.02-9.218-.003-1.165.049-2.366-.983-2.334-2.26a388.346 388.346 0 0 1-.003-8.657zm2.444.442c.007.862.014 1.728.025 2.59 2.415-.008 4.834 0 7.25-.004.007-.862.01-1.72.018-2.582-2.43-.011-4.864-.004-7.293-.004z"/>
                </g>
            `
                break;
          }


      }

    //9
    addCSSCustomisation(){
        this.addCSSAlignment();
        this.addCSSFontStyle();
        this.addCSSTextColor();
        this.addCSSTheme();
        this.addCSSWidth();
    }


    //11
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
    //12
    setElementMargins(){
        this.renderElement.style.marginTop = this.marginTop + 'px';
        this.renderElement.style.marginBottom = this.marginBottom + 'px';
        this.renderElement.style.marginLeft = this.marginLeft + 'px';
        this.renderElement.style.marginRight = this.marginRight + 'px';
    }
    //13
    setWidgetSize(){
      this.renderElement.style.transformOrigin = 'top ' + this.alignment;
      this.renderElement.style.transform = 'scale(' + this.scaleFactor + ')';
        if (this.fixedHeight) {
          this.renderElement.style.height = this.fixedHeight + 'px';
          this.renderElement.style.overflow = 'hidden';
        }
    }
    //14
    setLogoSize(element){
        element.style.transformOrigin = 'top ' + this.alignment;
        element.style.transform = 'scale(' + this.logoSize + ')'
    }
    //15
    renderAwesomeSezzle(){

        // Do not render this product if it is not eligible
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

        console.log(this.imageURL)
      
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
              logoNode.setAttribute('width','103');
              logoNode.setAttribute('height','34');
              logoNode.setAttribute('viewBox','0 0 103 34');
              logoNode.setAttribute('class',`sezzle-logo ${this.imageClassName}`);
              logoNode.innerHTML = this.imageInnerHTML;
              sezzleButtonText.appendChild(logoNode);
              this.setLogoSize(logoNode);
              break;
            // changed from learn-more to link as that is what current altVersionTemplates use
            case 'link':
              var learnMoreNode = document.createElement('span');
              learnMoreNode.className = 'sezzle-learn-more';
              var learnMoreText = document.createTextNode('Learn more');
              learnMoreNode.appendChild(learnMoreText);
              sezzleButtonText.appendChild(learnMoreNode);
              break;
      
            case 'info':
              var infoIconNode = document.createElement('code');
              infoIconNode.className = 'sezzle-info-icon';
              infoIconNode.innerHTML = '&#9432;';
              sezzleButtonText.appendChild(infoIconNode);
              break;
      
            case 'question-mark':
              var questionMarkIconNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
              questionMarkIconNode.setAttribute('width','369');
              questionMarkIconNode.setAttribute('height','371');
              questionMarkIconNode.setAttribute('viewBox','0 0 369 371');
              questionMarkIconNode.setAttribute('class','sezzle-question-mark-icon');
              questionMarkIconNode.innerHTML = `<g transform="translate(0.000000,371.000000) scale(0.100000,-0.100000)"
              fill="#000000" stroke="none">
              <path d="M1579 3595 c-659 -107 -1193 -556 -1399 -1174 -73 -219 -84 -295 -84
              -566 0 -212 2 -252 22 -345 155 -712 670 -1227 1382 -1382 93 -20 133 -22 345
              -22 212 0 252 2 345 22 712 155 1227 670 1382 1382 20 93 22 133 22 345 0 212
              -2 252 -22 345 -154 710 -671 1229 -1377 1380 -130 28 -483 37 -616 15z m419
              -286 c648 -70 1172 -559 1289 -1202 23 -125 23 -379 0 -504 -52 -286 -185
              -546 -384 -754 -157 -163 -320 -275 -513 -350 -364 -143 -741 -142 -1098 4
              -462 187 -798 604 -889 1100 -23 125 -23 379 0 504 91 496 434 920 894 1103
              233 93 463 125 701 99z"/>
              <path d="M1798 2920 c-264 -48 -444 -199 -512 -429 -27 -91 -31 -87 102 -101
              64 -7 125 -13 136 -14 14 -1 21 10 30 44 30 116 107 213 204 258 50 24 69 27
              162 27 86 0 113 -4 151 -21 60 -28 118 -86 149 -149 22 -44 25 -63 25 -160 0
              -102 -2 -114 -29 -165 -41 -78 -73 -117 -227 -277 -75 -77 -149 -162 -165
              -188 -41 -71 -54 -142 -54 -307 l0 -148 129 0 129 0 4 153 c3 147 4 154 33
              206 20 35 71 93 148 165 241 228 317 364 317 571 0 159 -51 286 -153 381 -76
              71 -137 105 -237 134 -84 24 -265 35 -342 20z"/>
              <path d="M1825 1001 c-50 -22 -91 -69 -105 -119 -12 -46 -12 -48 1 -95 23 -83
              116 -145 200 -134 179 24 219 274 55 348 -52 23 -100 24 -151 0z"/>
              </g>`
              sezzleButtonText.appendChild(questionMarkIconNode);
              break;
      
            case 'afterpay-logo':
              var apNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
              apNode.setAttribute('width','140');
              apNode.setAttribute('height','29');
              apNode.setAttribute('viewBox','0 0 140 29');
              apNode.setAttribute('class',`sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`);
              apNode.innerHTML = `<g fill="none" fill-rule="nonzero">
              <path fill="#31322F" d="M68.615 14.612c0-1.918-1.57-3.517-3.43-3.517s-3.43 1.599-3.43 3.517c0 1.89 1.57 3.517 3.43 3.517s3.43-1.628 3.43-3.517zM70.098 9.7c1.308 1.337 2.034 3.08 2.034 4.912 0 1.831-.726 3.575-2.034 4.912-1.308 1.308-3.052 2.006-4.912 2.006-1.221 0-2.326-.436-3.285-1.308l-.146-.116v7.784L58.24 29V7.955h3.517v1.047l.145-.146c1.047-1.017 2.238-1.162 3.285-1.162 1.83 0 3.575.698 4.912 2.006zM76.9 14.612c0 1.918 1.57 3.517 3.43 3.517s3.43-1.599 3.43-3.517c0-1.89-1.57-3.517-3.43-3.517s-3.43 1.628-3.43 3.517zm-1.483 4.912c-1.308-1.337-2.034-3.08-2.034-4.912 0-1.831.726-3.575 2.034-4.912 1.308-1.308 3.052-2.006 4.913-2.006 1.22 0 2.325.436 3.284 1.308l.146.116V7.955h3.517v13.313H83.76v-1.046l-.146.145c-1.046 1.017-2.238 1.163-3.284 1.163a6.979 6.979 0 0 1-4.913-2.006zM90.794 29l3.169-7.703-5.32-13.342h3.895l3.314 8.285 3.372-8.285h3.866L94.602 29h-3.808M6.804 9.935c-2.562 0-4.647 2.098-4.647 4.677 0 2.578 2.085 4.676 4.647 4.676 2.563 0 4.648-2.098 4.648-4.676 0-2.579-2.085-4.677-4.648-4.677zm0 11.452a6.852 6.852 0 0 1-4.821-1.956A6.866 6.866 0 0 1 0 14.61c0-1.8.705-3.512 1.986-4.82a6.85 6.85 0 0 1 4.818-1.955c1.841 0 3.391.974 4.367 1.791l.281.236V8.127h2.157v12.97h-2.157v-1.736l-.281.235c-.976.817-2.526 1.791-4.367 1.791zM17.514 21.097v-10.93h-1.976v-2.04h1.976V4.293c0-2.349 1.866-4.189 4.247-4.189h2.713l-.548 2.041H21.82c-1.144 0-2.148 1.031-2.148 2.207v3.775h4.099v2.04H19.67v10.93h-2.157M31.905 21.097a4.252 4.252 0 0 1-4.247-4.247v-6.682h-1.977V8.127h1.977V.104h2.157v8.023h4.098v2.04h-4.098v6.625c0 1.185 1.024 2.264 2.148 2.264h2.107l.547 2.041h-2.712M41.194 10.022c-1.668 0-3.216 1.203-3.853 2.992l-.021.039-.124.248h7.997l-.155-.307c-.598-1.768-2.146-2.972-3.844-2.972zM41.19 21.33a5.79 5.79 0 0 1-4.374-1.977 6.668 6.668 0 0 1-1.76-4.084c-.028-.203-.028-.395-.028-.598 0-.508.058-1.024.17-1.532a6.843 6.843 0 0 1 1.617-3.149 5.935 5.935 0 0 1 4.379-1.95c1.67 0 3.236.694 4.409 1.952.841.931 1.4 2.018 1.614 3.141.169.993.173 1.61.155 1.919H37.098v.23c.301 2.297 2.035 4.035 4.035 4.066 1.23-.06 2.442-.563 3.283-1.353l1.8 1.075a7.617 7.617 0 0 1-1.594 1.297c-.95.57-2.136.903-3.432.963zM49.49 21.097V8.127h2.158v1.64l.298-.33c.765-.844 3.013-1.532 4.508-1.596l-.526 2.154c-2.373.068-4.28 1.918-4.28 4.18v6.922H49.49"/>
              <path fill="#306E9A" d="M121.714 11.632l3.777-2.186c-.417-.733-.315-.557-.696-1.248-.403-.732-.25-1.02.582-1.026 2.423-.017 4.847-.019 7.27-.006.72.004.894.312.533.947a632.803 632.803 0 0 1-3.634 6.302c-.39.669-.732.667-1.14.013-.42-.672-.308-.506-.756-1.268l-3.765 2.187c.074.194.169.318.246.453.933 1.623 1.35 2.398 2.313 4.003 1.142 1.902 3.536 2.016 4.895.259.151-.196.29-.403.413-.617 2.287-3.962 4.575-7.922 6.849-11.892.23-.401.438-.84.538-1.289a2.85 2.85 0 0 0-2.79-3.486c-4.9-.026-9.803-.03-14.704.014-2.232.02-3.574 2.254-2.593 4.219.32.64.703 1.247 1.062 1.867.676 1.166.854 1.473 1.6 2.754"/>
              <path fill="#1F4066" d="M110.817 23.871l.006-4.348s-.603-.006-1.417-.006c-.83 0-1-.293-.591-1.01a585.204 585.204 0 0 1 3.617-6.241c.362-.616.682-.67 1.078.015 1.203 2.083 2.41 4.164 3.597 6.257.379.668.207.96-.558.985l-1.464-.001v4.361h5.099c2.2-.032 3.49-2.028 2.66-4.07a5.465 5.465 0 0 0-.323-.662c-2.26-3.936-4.518-7.872-6.79-11.8-.23-.398-.503-.795-.838-1.104a2.827 2.827 0 0 0-4.38.657c-2.465 4.192-4.91 8.395-7.315 12.621-1.096 1.926.153 4.19 2.328 4.328.707.044 3.73.018 5.29.018"/>
              </g>`;
              sezzleButtonText.appendChild(apNode);
              this.setLogoSize(apNode);
              break;
      
            case 'afterpay-logo-grey':
              var apNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
              apNode.setAttribute('width','140');
              apNode.setAttribute('height','29');
              apNode.setAttribute('viewBox','0 0 140 29');
              apNode.setAttribute('class',`sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`);
              apNode.innerHTML = ` <g fill="#31322F" fill-rule="nonzero">
              <path d="M68.615 14.612c0-1.918-1.57-3.517-3.43-3.517s-3.43 1.599-3.43 3.517c0 1.89 1.57 3.517 3.43 3.517s3.43-1.628 3.43-3.517zM70.098 9.7c1.308 1.337 2.034 3.08 2.034 4.912 0 1.831-.726 3.575-2.034 4.912-1.308 1.308-3.052 2.006-4.912 2.006-1.221 0-2.326-.436-3.285-1.308l-.146-.116v7.784L58.24 29V7.955h3.517v1.047l.145-.146c1.047-1.017 2.238-1.162 3.285-1.162 1.83 0 3.575.698 4.912 2.006zM76.9 14.612c0 1.918 1.57 3.517 3.43 3.517s3.43-1.599 3.43-3.517c0-1.89-1.57-3.517-3.43-3.517s-3.43 1.628-3.43 3.517zm-1.483 4.912c-1.308-1.337-2.034-3.08-2.034-4.912 0-1.831.726-3.575 2.034-4.912 1.308-1.308 3.052-2.006 4.913-2.006 1.22 0 2.325.436 3.284 1.308l.146.116V7.955h3.517v13.313H83.76v-1.046l-.146.145c-1.046 1.017-2.238 1.163-3.284 1.163a6.979 6.979 0 0 1-4.913-2.006zM90.794 29l3.169-7.703-5.32-13.342h3.895l3.314 8.285 3.372-8.285h3.866L94.602 29h-3.808M6.804 9.935c-2.562 0-4.647 2.098-4.647 4.677 0 2.578 2.085 4.676 4.647 4.676 2.563 0 4.648-2.098 4.648-4.676 0-2.579-2.085-4.677-4.648-4.677zm0 11.452a6.852 6.852 0 0 1-4.821-1.956A6.866 6.866 0 0 1 0 14.61c0-1.8.705-3.512 1.986-4.82a6.85 6.85 0 0 1 4.818-1.955c1.841 0 3.391.974 4.367 1.791l.281.236V8.127h2.157v12.97h-2.157v-1.736l-.281.235c-.976.817-2.526 1.791-4.367 1.791zM17.514 21.097v-10.93h-1.976v-2.04h1.976V4.293c0-2.349 1.866-4.189 4.247-4.189h2.713l-.548 2.041H21.82c-1.144 0-2.148 1.031-2.148 2.207v3.775h4.099v2.04H19.67v10.93h-2.157M31.905 21.097a4.252 4.252 0 0 1-4.247-4.247v-6.682h-1.977V8.127h1.977V.104h2.157v8.023h4.098v2.04h-4.098v6.625c0 1.185 1.024 2.264 2.148 2.264h2.107l.547 2.041h-2.712M41.194 10.022c-1.668 0-3.216 1.203-3.853 2.992l-.021.039-.124.248h7.997l-.155-.307c-.598-1.768-2.146-2.972-3.844-2.972zM41.19 21.33a5.79 5.79 0 0 1-4.374-1.977 6.668 6.668 0 0 1-1.76-4.084c-.028-.203-.028-.395-.028-.598 0-.508.058-1.024.17-1.532a6.843 6.843 0 0 1 1.617-3.149 5.935 5.935 0 0 1 4.379-1.95c1.67 0 3.236.694 4.409 1.952.841.931 1.4 2.018 1.614 3.141.169.993.173 1.61.155 1.919H37.098v.23c.301 2.297 2.035 4.035 4.035 4.066 1.23-.06 2.442-.563 3.283-1.353l1.8 1.075a7.617 7.617 0 0 1-1.594 1.297c-.95.57-2.136.903-3.432.963zM49.49 21.097V8.127h2.158v1.64l.298-.33c.765-.844 3.013-1.532 4.508-1.596l-.526 2.154c-2.373.068-4.28 1.918-4.28 4.18v6.922H49.49M121.714 11.632l3.777-2.186c-.417-.733-.315-.557-.696-1.248-.403-.732-.25-1.02.582-1.026 2.423-.017 4.847-.019 7.27-.006.72.004.894.312.533.947a632.803 632.803 0 0 1-3.634 6.302c-.39.669-.732.667-1.14.013-.42-.672-.308-.506-.756-1.268l-3.765 2.187c.074.194.169.318.246.453.933 1.623 1.35 2.398 2.313 4.003 1.142 1.902 3.536 2.016 4.895.259.151-.196.29-.403.413-.617 2.287-3.962 4.575-7.922 6.849-11.892.23-.401.438-.84.538-1.289a2.85 2.85 0 0 0-2.79-3.486c-4.9-.026-9.803-.03-14.704.014-2.232.02-3.574 2.254-2.593 4.219.32.64.703 1.247 1.062 1.867.676 1.166.854 1.473 1.6 2.754M110.817 23.871l.006-4.348s-.603-.006-1.417-.006c-.83 0-1-.293-.591-1.01a585.204 585.204 0 0 1 3.617-6.241c.362-.616.682-.67 1.078.015 1.203 2.083 2.41 4.164 3.597 6.257.379.668.207.96-.558.985l-1.464-.001v4.361h5.099c2.2-.032 3.49-2.028 2.66-4.07a5.465 5.465 0 0 0-.323-.662c-2.26-3.936-4.518-7.872-6.79-11.8-.23-.398-.503-.795-.838-1.104a2.827 2.827 0 0 0-4.38.657c-2.465 4.192-4.91 8.395-7.315 12.621-1.096 1.926.153 4.19 2.328 4.328.707.044 3.73.018 5.29.018"/>
              </g>`;
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
              qpNode.innerHTML = `<g fill="none" fill-rule="evenodd">
              <path fill="#1D75EC" d="M20.249 16.342a.47.47 0 0 1 .101.292.48.48 0 0 1-.484.474h-2.598l.001 4.34c0 .096-.03.19-.085.27a.49.49 0 0 1-.673.12l-2.542-1.717a.472.472 0 0 1-.21-.39v-2.622h-.683l-4.27-.001a40.892 40.892 0 0 1-.79-.037C3.66 16.663.374 13.094.374 8.769c0-4.598 3.79-8.34 8.449-8.34 4.46 0 8.165 3.441 8.433 7.835.002.038.005.973.007 2.805a.48.48 0 0 1-.483.475h-2.537a.48.48 0 0 1-.483-.474V8.357l-.005-.085c-.119-1.242-.464-2.391-1.412-3.236a5.185 5.185 0 0 0-3.46-1.312c-2.833 0-5.138 2.255-5.138 5.025 0 2.585 1.978 4.734 4.6 4.999h9.613c.15 0 .29.067.382.183l1.91 2.411z"/>
              <path fill="#13131F" d="M22.087 10.842V.692c0-.238.217-.453.459-.453h2.975c.266 0 .46.215.46.453v9.959c0 1.743 1.257 2.722 2.975 2.722 1.741 0 3.023-.979 3.023-2.722V.692c0-.238.193-.453.46-.453h2.975c.241 0 .46.215.46.453v10.15c0 3.63-3.097 6.352-6.918 6.352-3.798 0-6.87-2.722-6.87-6.352zm16.375 6.114c-.363 0-.556-.31-.41-.621L45.621.263a.491.491 0 0 1 .41-.263h.243c.17 0 .338.12.41.263l7.571 16.072c.146.31-.048.62-.41.62H51.16c-.436 0-.63-.143-.847-.596l-.87-1.887h-6.58l-.87 1.91a.9.9 0 0 1-.871.574h-2.66zm5.852-5.732h3.676l-1.838-3.94h-.024l-1.814 3.94zm12.818 5.278V.692c0-.238.193-.453.435-.453h5.902c4.668 0 8.49 3.749 8.49 8.334 0 4.633-3.822 8.382-8.49 8.382h-5.902c-.242 0-.435-.215-.435-.453zm3.774-3.08h2.54c2.733 0 4.499-2.126 4.499-4.849 0-2.698-1.766-4.824-4.499-4.824h-2.54v9.672zm14.9 3.08V.692c0-.238.192-.453.459-.453h5.829c3.193 0 5.418 2.388 5.418 5.277 0 2.962-2.225 5.374-5.395 5.374h-2.539v5.612a.473.473 0 0 1-.46.454h-2.853a.456.456 0 0 1-.46-.454zm3.774-9.099h2.443c1.04 0 1.766-.812 1.766-1.887 0-1.003-.725-1.767-1.766-1.767H79.58v3.654zm8.32 9.553c-.362 0-.556-.31-.41-.621L95.06.263A.49.49 0 0 1 95.471 0h.242c.169 0 .338.12.411.263l7.57 16.072c.146.31-.048.62-.41.62h-2.685c-.436 0-.63-.143-.847-.596l-.87-1.887h-6.58l-.87 1.91a.9.9 0 0 1-.87.574H87.9zm5.854-5.732h3.677l-1.838-3.94h-.025l-1.814 3.94zm14.585 5.278V8.907L102.994.931c-.194-.31 0-.692.387-.692h3.144c.193 0 .315.119.387.215l3.363 4.895 3.361-4.895c.072-.096.17-.215.387-.215h3.145c.387 0 .58.382.387.692l-5.418 7.953v7.618a.473.473 0 0 1-.46.453H108.8a.456.456 0 0 1-.46-.453z"/>
              </g>`;
              sezzleButtonText.appendChild(qpNode);
              this.setLogoSize(qpNode);
              break;
      
            case 'quadpay-logo-grey':
                var qpNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
                qpNode.setAttribute('width','118');
                qpNode.setAttribute('height','22');
                qpNode.setAttribute('viewBox','0 0 118 22');
                qpNode.setAttribute('class',`sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`);
                qpNode.innerHTML = `<g fill="#13131F" fill-rule="evenodd">
                <path d="M20.249 16.342a.47.47 0 0 1 .101.292.48.48 0 0 1-.484.474h-2.598l.001 4.34c0 .096-.03.19-.085.27a.49.49 0 0 1-.673.12l-2.542-1.717a.472.472 0 0 1-.21-.39v-2.622h-.683l-4.27-.001a40.892 40.892 0 0 1-.79-.037C3.66 16.663.374 13.094.374 8.769c0-4.598 3.79-8.34 8.449-8.34 4.46 0 8.165 3.441 8.433 7.835.002.038.005.973.007 2.805a.48.48 0 0 1-.483.475h-2.537a.48.48 0 0 1-.483-.474V8.357l-.005-.085c-.119-1.242-.464-2.391-1.412-3.236a5.185 5.185 0 0 0-3.46-1.312c-2.833 0-5.138 2.255-5.138 5.025 0 2.585 1.978 4.734 4.6 4.999h9.613c.15 0 .29.067.382.183l1.91 2.411zM22.087 10.842V.692c0-.238.217-.453.459-.453h2.975c.266 0 .46.215.46.453v9.959c0 1.743 1.257 2.722 2.975 2.722 1.741 0 3.023-.979 3.023-2.722V.692c0-.238.193-.453.46-.453h2.975c.241 0 .46.215.46.453v10.15c0 3.63-3.097 6.352-6.918 6.352-3.798 0-6.87-2.722-6.87-6.352zm16.375 6.114c-.363 0-.556-.31-.41-.621L45.621.263a.491.491 0 0 1 .41-.263h.243c.17 0 .338.12.41.263l7.571 16.072c.146.31-.048.62-.41.62H51.16c-.436 0-.63-.143-.847-.596l-.87-1.887h-6.58l-.87 1.91a.9.9 0 0 1-.871.574h-2.66zm5.852-5.732h3.676l-1.838-3.94h-.024l-1.814 3.94zm12.818 5.278V.692c0-.238.193-.453.435-.453h5.902c4.668 0 8.49 3.749 8.49 8.334 0 4.633-3.822 8.382-8.49 8.382h-5.902c-.242 0-.435-.215-.435-.453zm3.774-3.08h2.54c2.733 0 4.499-2.126 4.499-4.849 0-2.698-1.766-4.824-4.499-4.824h-2.54v9.672zm14.9 3.08V.692c0-.238.192-.453.459-.453h5.829c3.193 0 5.418 2.388 5.418 5.277 0 2.962-2.225 5.374-5.395 5.374h-2.539v5.612a.473.473 0 0 1-.46.454h-2.853a.456.456 0 0 1-.46-.454zm3.774-9.099h2.443c1.04 0 1.766-.812 1.766-1.887 0-1.003-.725-1.767-1.766-1.767H79.58v3.654zm8.32 9.553c-.362 0-.556-.31-.41-.621L95.06.263A.49.49 0 0 1 95.471 0h.242c.169 0 .338.12.411.263l7.57 16.072c.146.31-.048.62-.41.62h-2.685c-.436 0-.63-.143-.847-.596l-.87-1.887h-6.58l-.87 1.91a.9.9 0 0 1-.87.574H87.9zm5.854-5.732h3.677l-1.838-3.94h-.025l-1.814 3.94zm14.585 5.278V8.907L102.994.931c-.194-.31 0-.692.387-.692h3.144c.193 0 .315.119.387.215l3.363 4.895 3.361-4.895c.072-.096.17-.215.387-.215h3.145c.387 0 .58.382.387.692l-5.418 7.953v7.618a.473.473 0 0 1-.46.453H108.8a.456.456 0 0 1-.46-.453z"/>
                </g>`;
                sezzleButtonText.appendChild(qpNode);
                this.setLogoSize(qpNode);
                break;

            case 'quadpay-logo-white':
                 var qpNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
                qpNode.setAttribute('width','118');
                qpNode.setAttribute('height','22');
                qpNode.setAttribute('viewBox','0 0 118 22');
                qpNode.setAttribute('class',`sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`);
                qpNode.innerHTML = `<g fill="#FFF" fill-rule="evenodd">
                <path d="M20.249 16.342a.47.47 0 0 1 .101.292.48.48 0 0 1-.484.474h-2.598l.001 4.34c0 .096-.03.19-.085.27a.49.49 0 0 1-.673.12l-2.542-1.717a.472.472 0 0 1-.21-.39v-2.622h-.683l-4.27-.001a40.892 40.892 0 0 1-.79-.037C3.66 16.663.374 13.094.374 8.769c0-4.598 3.79-8.34 8.449-8.34 4.46 0 8.165 3.441 8.433 7.835.002.038.005.973.007 2.805a.48.48 0 0 1-.483.475h-2.537a.48.48 0 0 1-.483-.474V8.357l-.005-.085c-.119-1.242-.464-2.391-1.412-3.236a5.185 5.185 0 0 0-3.46-1.312c-2.833 0-5.138 2.255-5.138 5.025 0 2.585 1.978 4.734 4.6 4.999h9.613c.15 0 .29.067.382.183l1.91 2.411zM22.087 10.842V.692c0-.238.217-.453.459-.453h2.975c.266 0 .46.215.46.453v9.959c0 1.743 1.257 2.722 2.975 2.722 1.741 0 3.023-.979 3.023-2.722V.692c0-.238.193-.453.46-.453h2.975c.241 0 .46.215.46.453v10.15c0 3.63-3.097 6.352-6.918 6.352-3.798 0-6.87-2.722-6.87-6.352zm16.375 6.114c-.363 0-.556-.31-.41-.621L45.621.263a.491.491 0 0 1 .41-.263h.243c.17 0 .338.12.41.263l7.571 16.072c.146.31-.048.62-.41.62H51.16c-.436 0-.63-.143-.847-.596l-.87-1.887h-6.58l-.87 1.91a.9.9 0 0 1-.871.574h-2.66zm5.852-5.732h3.676l-1.838-3.94h-.024l-1.814 3.94zm12.818 5.278V.692c0-.238.193-.453.435-.453h5.902c4.668 0 8.49 3.749 8.49 8.334 0 4.633-3.822 8.382-8.49 8.382h-5.902c-.242 0-.435-.215-.435-.453zm3.774-3.08h2.54c2.733 0 4.499-2.126 4.499-4.849 0-2.698-1.766-4.824-4.499-4.824h-2.54v9.672zm14.9 3.08V.692c0-.238.192-.453.459-.453h5.829c3.193 0 5.418 2.388 5.418 5.277 0 2.962-2.225 5.374-5.395 5.374h-2.539v5.612a.473.473 0 0 1-.46.454h-2.853a.456.456 0 0 1-.46-.454zm3.774-9.099h2.443c1.04 0 1.766-.812 1.766-1.887 0-1.003-.725-1.767-1.766-1.767H79.58v3.654zm8.32 9.553c-.362 0-.556-.31-.41-.621L95.06.263A.49.49 0 0 1 95.471 0h.242c.169 0 .338.12.411.263l7.57 16.072c.146.31-.048.62-.41.62h-2.685c-.436 0-.63-.143-.847-.596l-.87-1.887h-6.58l-.87 1.91a.9.9 0 0 1-.87.574H87.9zm5.854-5.732h3.677l-1.838-3.94h-.025l-1.814 3.94zm14.585 5.278V8.907L102.994.931c-.194-.31 0-.692.387-.692h3.144c.193 0 .315.119.387.215l3.363 4.895 3.361-4.895c.072-.096.17-.215.387-.215h3.145c.387 0 .58.382.387.692l-5.418 7.953v7.618a.473.473 0 0 1-.46.453H108.8a.456.456 0 0 1-.46-.453z"/>
                </g>`;
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
      
            default:
              var widgetTextNode = document.createTextNode(subtemplate);
              sezzleButtonText.appendChild(widgetTextNode);
              break;
          }
        }.bind(this));
      
        node.appendChild(sezzleButtonText);
      
        // Adding main node to sezzle node
        this.renderElement.appendChild(node);
        this.addCSSAlignment();
        this.addCSSCustomisation();
    }
    //16
    getElementToRender(){
      return this.renderElement
    }
    //17
    isProductEligible(priceText){
        var price = HelperClass.parsePrice(priceText);
        this.productPrice = price;
        var priceInCents = price * 100;
        return priceInCents >= this.minPrice && priceInCents <= this.maxPrice;
    }

    getFormattedPrice(){


          var priceText = this.amount;
     
        // Get the price string - useful for formtting Eg: 120.00(string)
        var priceString = HelperClass.parsePriceString(priceText, true);
      
        // Get the price in float from the element - useful for calculation Eg : 120.00(float)
        var price = HelperClass.parsePrice(priceText);
      
        // Will be used later to replace {price} with price / this.numberOfPayments Eg: ${price} USD
        var formatter = priceText.replace(priceString, '{price}');

        var sezzleInstallmentPrice = (price / this.numberOfPayments).toFixed(2);
      
        // format the string
        var sezzleInstallmentFormattedPrice = formatter.replace('{price}', sezzleInstallmentPrice);
      
        return sezzleInstallmentFormattedPrice;
        
        
    }

    renderModal(){
        if (!document.getElementsByClassName('sezzle-checkout-modal-lightbox').length) {
            var modalNode = document.createElement('div');
            modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal';
            modalNode.style.display = 'none';
            if (this.altModalHTML) {
              modalNode.innerHTML = this.altModalHTML;
            } else {
              modalNode.innerHTML = '<style>@import url("https://fonts.googleapis.com/css?family=Raleway:500,700");.sezzle-no-thanks:hover {transition: 0.15s; cursor: pointer;} @media (max-width: 650px) { .sezzle-modal { position: relative; top: 0 !important; left: 0; padding: 50px 0px 0px; height: 100%; max-width: 100%; min-width: 320px; overflow: auto; margin-left: -50% !important; margin-top: 0 !important; } .sezzle-modal-logo{ margin-left: 30% !important; } .bg_footer {height: 140px !important; padding: 20px 30px !important; } .sezzle-footer-text-link { line-height: 1.68 !important; padding-bottom: 0 !important;}} @media(height: 812px) {.sezzle-modal {height: 95%;}} @media(height: 823px) {.sezzle-modal {height: 90%;}}@media (max-width: 320px) { .bg_footer { height: 140px !important; } </style> <div class="sezzle-checkout-modal-hidden"> <div class="sezzle-modal" id="sezzle-modal" style="position: fixed; top: 50%; left: 50%; margin-top: -340px; margin-left: -220px; z-index:99999998;background-color:#fff; box-shadow: 0 10px 20px rgba(5, 31, 52, 0.19), 0 6px 6px rgba(5, 31, 52, 0.2); color: #000; text-transform: none; font-family: Raleway; transition: all 0.4s ease; max-width: 440px;"> <div class="top-content" style="padding: 30px 30px 20px;"> <div class="sezzle-row"><img src="https://sezzlemedia.s3.amazonaws.com/branding/sezzle-logos/sezzle-logo.svg" class="sezzle-modal-logo" style="width: 120px; height: auto; margin-bottom: 20px; margin-left: 125px;"><span style="font-size: 40pt; color: #b6bdc4; text-transform: none; font-family: Raleway, sans-serif; opacity: 0.6; transition: 0.15s; position: absolute; top: 15px; right: 40px;" onmouseout="this.style.color=\"#b6bdc4\"" onmouseover="this.style.color=\"rgba(23, 23, 23, 0.6)\"" class="sezzle-no-thanks close-sezzle-modal">×</span> </div> <div class="sezzle-modal-title-top"> <div class="sezzle-modal-title-text-center" style="text-transform: none; font-family: Raleway; font-size: 18px; font-weight: 500; line-height: 1.24; text-align: center; color: #000000; margin-bottom: 20px; margin-top: 10px">Split your purchase into four <br />easy installments</div> </div> <div class="sezzle-row modal-point"> <div class="sezzle-modal-icon" style="text-align: center;"> <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"> <g fill="none" fill-rule="evenodd"> <path fill="#FFF" d="M0 0h60v60H0z" /> <path fill="#000" d="M26.817 37.549a2.69 2.69 0 0 1-1.738.629 2.687 2.687 0 0 1-1.9-.772 2.552 2.552 0 0 1-.797-1.858c0-.693.277-1.328.723-1.793-.84-.944-1.059-2.071-.833-3.071a3.314 3.314 0 0 1 1.95-2.329c1.023-.422 2.307-.358 3.638.535 1.482.993 2.915 2 4.287 3.007.79.578 1.548 1.157 2.28 1.729V8.29c0-.514-.212-.97-.556-1.307a1.908 1.908 0 0 0-1.336-.543H17.619c-.526 0-.993.207-1.337.543a1.814 1.814 0 0 0-.555 1.307v29.385c0 .508.212.971.555 1.307.344.336.811.543 1.337.543h10.818a36.082 36.082 0 0 0-1.6-1.95l-.022-.029.002.002zm9.554-2.692l2.045 2c.41.4.416 1.057 0 1.465a1.088 1.088 0 0 1-1.504.008l-1.826-1.793a.893.893 0 0 1-.314-.172 74.55 74.55 0 0 0-3.783-2.95 115.381 115.381 0 0 0-4.23-2.964c-.71-.478-1.328-.535-1.782-.35a1.282 1.282 0 0 0-.511.385 1.49 1.49 0 0 0-.3.608c-.116.492.03 1.07.533 1.55 1.345 1.277 2.52 2.457 3.616 3.7a36.874 36.874 0 0 1 2.835 3.67.907.907 0 0 1 .38.622.817.817 0 0 1 .052.293c0 .043 0 .086-.008.129.146 1.4.387 2.457.817 3.377.468.987 1.169 1.864 2.22 2.865.38.363.393.965.022 1.336a.985.985 0 0 1-1.373.021c-1.22-1.164-2.052-2.213-2.623-3.436-.46-.979-.745-2.036-.921-3.335l-5.981.043c-.432.008-.694.193-.812.443l-.014.051a1.333 1.333 0 0 0-.073.565c.022.215.08.422.181.6.182.328.52.556.965.492.564-.086.927-.15 1.243-.2 1.293-.228 1.95-.341 3.586-.042.308.056.577.25.71.543.533 1.172 1.358 2.25 2.307 3.243.965 1.008 2.074 1.942 3.162 2.82a.94.94 0 0 1 .336.415l.388.95.241.629c.498.5 2.651.37 4.785-.086.913-.194 1.79-.45 2.541-.758.702-.293 1.285-.622 1.637-.966.19-.177.285-.336.255-.443a.742.742 0 0 1-.074-.242 173.42 173.42 0 0 0-.687-3.878c-.643-3.529-1.023-5.564-.86-10.014a2.648 2.648 0 0 0-.578-1.75c-.416-.544-1.06-1.015-1.796-1.45-1.359-.794-2.082-2.028-2.805-3.279-.556-.957-1.125-1.928-2.002-2.55v7.837-.002zm-6.444-13.642c0-4-5.98-2.908-5.98-4.822 0-.535.503-.8 1.242-.8.92 0 2.425.472 3.622 1.152l1.08-2.2c-.97-.614-2.293-1.057-3.651-1.2V11.09h-2.134v2.336c-1.958.364-3.185 1.536-3.185 3.23 0 3.92 5.982 2.75 5.982 4.706 0 .635-.57.965-1.477.965-1.176 0-2.92-.664-4.083-1.656l-1.117 2.164c1.037.836 2.425 1.436 3.878 1.657v2.45h2.133v-2.386c2.118-.236 3.688-1.379 3.688-3.335l.002-.005zm-5.91 13.435a1.344 1.344 0 0 0 .067 1.865c.255.25.605.4.993.4a1.4 1.4 0 0 0 .883-.306 46.848 46.848 0 0 0-1.944-1.957l.002-.002zm16.033-6.014c.6 1.036 1.19 2.05 2.118 2.593.927.543 1.752 1.164 2.345 1.936.644.82 1.01 1.785.965 2.942-.146 4.265.212 6.22.84 9.622.197 1.1.43 2.342.67 3.813.336.9.03 1.721-.715 2.436-.533.514-1.322.971-2.25 1.35-.876.364-1.877.664-2.878.88-2.907.613-6.025.478-6.873-.815a1.24 1.24 0 0 1-.102-.207 13.763 13.763 0 0 0-.264-.686l-.285-.715c-1.089-.88-2.206-1.829-3.207-2.872-.965-1.014-1.818-2.1-2.44-3.292-.97-.135-1.497-.043-2.416.113-.394.073-.856.15-1.301.215-1.373.207-2.39-.478-2.937-1.457a3.347 3.347 0 0 1-.41-1.336 2.983 2.983 0 0 1 .176-1.393l.036-.094c.036-.078.074-.164.116-.242h-3.622a3.864 3.864 0 0 1-2.709-1.1 3.695 3.695 0 0 1-1.125-2.65V8.293c0-1.036.432-1.972 1.125-2.65a3.864 3.864 0 0 1 2.71-1.1h14.915c1.05 0 2.008.422 2.709 1.1a3.719 3.719 0 0 1 1.125 2.65V24.87c1.93.743 2.815 2.265 3.684 3.765z" /> <path fill="#CEF3DA" d="M17.619 6.441c-1.49.8-.932-1.321-1.892 3.215-.96 4.535.17 28.8.675 29.87.32.683 7.218-.404 12.283-1.28 1.198-.208-3.386-.476-5.01-2.089-.538-.532 1.814-2.138 1.402-2.708-1.342-1.855-.76-3.897-.692-3.897.03 0 1.84-.03 3.447.97 2.893 1.8 6.37 4.984 6.418 3.797.294-7.28.424-25.365-.245-26.268-.839-1.131-5.06-2.068-6.173-2.068-.377 0-3.011.548-4.158.458-2.242-.176-5.07-.53-6.055 0z" style="mix-blend-mode:multiply" /> </g> </svg> </div> <div class="col-xs-12 col-sm-12 modal-description"> <h2 class="sezzle-header" style="text-transform: none; font-family: Raleway; font-size: 16px; font-weight: 700; text-align: center; color: #000000;">No Interest</h2> <p class="sezzle-description" style="text-transform: none; font-family: Raleway; font-size: 14px; font-weight: 500; line-height: 1.29; text-align: center; color: #44474b; margin-bottom: 20px;">Sezzle is FREE. You only pay the purchase price.</p> </div> </div> <div class="sezzle-row modal-point"> <div class="sezzle-modal-icon" style="text-align: center;"> <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"> <g fill="none" fill-rule="evenodd"> <path fill="#FFF" d="M0 0h60v60H0z" /> <path fill="#000" d="M17.65 10.445a1.11 1.11 0 0 0-1.007 1.111v3.335h-6.112v-.002h-.104A1.112 1.112 0 0 0 9.419 16v26.676a1.11 1.11 0 0 0 1.112 1.112h37.787a1.11 1.11 0 0 0 1.112-1.112V16c0-.612-.497-1.109-1.112-1.111h-6.112v-3.335.002a1.11 1.11 0 0 0-1.008-1.111.833.833 0 0 0-.104 0H36.65a1.11 1.11 0 0 0-1.112 1.111v3.335H23.312v-3.335a1.11 1.11 0 0 0-1.112-1.111h-4.445a.833.833 0 0 0-.104 0zm1.216 2.223h2.223v6.669h-2.223v-6.669zm18.894 0h2.223v6.669H37.76v-6.669zm-26.118 4.446h5.001v3.335-.003a1.11 1.11 0 0 0 1.112 1.112H22.2a1.11 1.11 0 0 0 1.112-1.112v-3.334h12.225v3.334a1.11 1.11 0 0 0 1.112 1.112h4.445a1.11 1.11 0 0 0 1.112-1.112v-3.334h5v6.669H11.643v-6.67.003zm0 8.892h35.565v15.561H11.642V26.006zm6.669 3.89c-2.749 0-5.002 2.254-5.002 5.002 0 2.748 2.253 5.002 5.002 5.002 2.366 0 4.352-1.672 4.862-3.89h6.251l-1.77 1.32v-.003a1.111 1.111 0 1 0 1.319 1.79l4.446-3.335a1.114 1.114 0 0 0 0-1.789l-4.446-3.335a1.111 1.111 0 0 0-1.32 1.789l1.771 1.337h-6.251c-.51-2.218-2.496-3.89-4.862-3.89v.002zm18.789.556v-.002a1.112 1.112 0 0 0-1.007 1.111v6.67a1.11 1.11 0 0 0 1.111 1.11h6.668a1.11 1.11 0 0 0 1.112-1.11v-6.67a1.11 1.11 0 0 0-1.112-1.111h-6.668a.836.836 0 0 0-.104 0v.002zm-18.79 1.665a2.762 2.762 0 0 1 2.779 2.779 2.762 2.762 0 0 1-2.778 2.779 2.762 2.762 0 0 1-2.779-2.78 2.762 2.762 0 0 1 2.779-2.778zm20.006.556h4.445v4.446h-4.445v-4.446z" /> <path fill="#CEF3DA" d="M37.675 29.77c11.08-.709 1.72 11.614.421.377M17.15 31.12c-10.537 9.838 9.471 7.32 2.828.555l-2.827-.556zM44.984 17.171c-.8-1.49-.628.122-5.16-.84-4.532-.96-28.776.171-29.846.676-.682.321.403 7.224 1.28 12.294.207 1.198.475-3.389 2.086-5.016.532-.537 2.137 1.817 2.707 1.404 1.853-1.343 3.893-.76 3.893-.692 0 .03 4.645-2.32 3.646-.712-1.8 2.896 23.617 1.114 23.617 0 0-.377-.09-.41 0-1.558.176-2.243-1.694-4.57-2.223-5.556z" style="mix-blend-mode:multiply" /> </g> </svg> </div> <div class="col-xs-12 col-sm-12 modal-description"> <h2 class="sezzle-header" style="text-transform: none; font-family: Raleway; font-size: 16px; font-weight: 700; text-align: center; color: #000000;">Need to Reschedule?</h2> <p class="sezzle-description" style="text-transform: none; font-family: Raleway; font-size: 14px; font-weight: 500; line-height: 1.29; text-align: center; color: #44474b; margin-bottom: 20px">It happens! Reschedule your first payment for free.</p> </div> </div> <div class="sezzle-row modal-point"> <div class="sezzle-modal-icon" style="text-align: center;"> <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"> <g fill="none" fill-rule="evenodd"> <path fill="#FFF" d="M0 0h60v60H0z" /> <path fill="#000" d="M45.369 20.02v-.06c0-.06 0-.06-.063-.117 0-.059-.063-.059-.063-.116 0 0 0-.06-.063-.06-.063-.059-.063-.116-.123-.116l-5.578-5.259a1.18 1.18 0 0 0-.744-.292H23.487c-.31 0-.556.116-.743.292l-5.578 5.26c-.063.059-.063.116-.123.116l-.063.059c0 .06-.063.06-.063.116 0 .06 0 .06-.063.117v22.265c0 .524.496.992 1.053.992h3.965c.124 0 .187 0 .31-.06.31 1.87 2.046 3.331 4.152 3.331 2.046 0 3.782-1.401 4.092-3.273H46.79c.373 1.87 2.046 3.273 4.092 3.273 2.045 0 3.781-1.401 4.091-3.273h3.162c.557 0 1.053-.468 1.053-.993V31.88c0-2.63-.806-4.851-2.292-6.369-1.426-1.46-3.41-2.22-5.641-2.22H45.43v-3.098c-.061-.057-.061-.114-.061-.174zM31.98 15.987h6.322l3.471 3.273H31.98v-3.273zm-8.118 0h5.951v3.273h-9.42l3.47-3.273zm2.356 28.574c-1.116 0-2.046-.877-2.046-1.93 0-1.052.93-1.928 2.046-1.928 1.116 0 2.046.876 2.046 1.929-.003 1.052-.932 1.929-2.046 1.929zM43.2 24.285v17.006H30.493c-.123 0-.247 0-.31.06-.556-1.578-2.106-2.69-3.965-2.69-1.86 0-3.409 1.169-3.966 2.69a1.181 1.181 0 0 0-.433-.117h-2.852V21.19h24.295v3.095h-.063zm7.56 20.277c-1.115 0-2.045-.877-2.045-1.93 0-1.052.93-1.928 2.046-1.928 1.116 0 2.046.876 2.046 1.929 0 1.052-.93 1.929-2.046 1.929zm.434-19.284c3.595 0 5.825 2.513 5.825 6.604v9.35h-2.293c-.556-1.52-2.106-2.63-3.965-2.63-1.797 0-3.346 1.11-3.905 2.63h-1.426V25.277h5.764zM5.578 24.81h8.12c.557 0 1.054.468 1.054.993 0 .525-.497.993-1.053.993h-8.12c-.558 0-1.054-.468-1.054-.993 0-.525.494-.993 1.053-.993zM0 31.238c0-.525.496-.993 1.053-.993h12.582c.557 0 1.054.468 1.054.993 0 .525-.497.993-1.054.993H1.053C.496 32.23 0 31.822 0 31.238zm14.752 5.435c0 .525-.497.993-1.054.993h-8.12c-.557 0-1.053-.468-1.053-.993 0-.525.496-.993 1.053-.993h8.12c.618 0 1.054.409 1.054.993zm9.42-5.319c0-.525.496-.993 1.053-.993h8.18l-1.426-1.344c-.433-.409-.433-1.052 0-1.402.434-.408 1.116-.408 1.487 0l3.222 3.039c.063.059.063.116.124.116 0 0 0 .06.063.06 0 .059.063.059.063.116 0 .06 0 .06.063.116v.471c0 .059 0 .059-.063.116 0 .06-.063.06-.063.116 0 0 0 .06-.063.06-.063.059-.063.116-.124.116l-3.409 3.214a1.18 1.18 0 0 1-.743.292 1.18 1.18 0 0 1-.743-.292c-.433-.409-.433-1.052 0-1.402l1.612-1.52-8.18-.002c-.557.119-1.053-.35-1.053-.877z" /> <path fill="#CEF3DA" d="M20.697 20.563c-2.038.49-1.275-.81-2.588 1.97-1.314 2.78.233 17.651.922 18.307.44.418 9.556.401 16.485-.136 1.638-.127 5.396-.477 7.594.136 3.958 1.104.27-2.464.335-3.191.402-4.462.58-15.546-.335-16.1-1.147-.693-6.922-1.267-8.444-1.267-.515 0-4.118.336-5.687.28-3.066-.107-6.935-.324-8.282 0z" style="mix-blend-mode:multiply" /> </g> </svg> </div> <div class="col-xs-12 col-sm-12 modal-description"> <h2 class="sezzle-header" style="text-transform: none; font-family: Raleway; font-size: 16px; font-weight: 700; text-align: center; color: #000000;">Shipped Right Away</h2> <p class="sezzle-description" style="text-transform: none; font-family: Raleway; font-size: 14px; font-weight: 500; line-height: 1.29; text-align: center; color: #44474b; margin-bottom: 25px;">Your order is processed and shipped right away.</p> </div> </div> <div class="bg_footer" style="margin: 40px -30px -30px; padding-top: 20px; height: auto; background-color: #f4f4f4;"> <div class="sezzle-buy-now" style=" height: 24px; text-transform: none; font-family: Raleway; font-size: 16px; font-weight: 500; letter-spacing: 1.6px; text-align: center; color: #000000;">BUY NOW. <span class="sezzle-bold-pay-later" style="height: 24px; text-transform: none; font-family: Raleway; font-size: 16px; font-weight: 700; letter-spacing: 1.6px; text-align: center; color: #000000;">PAY LATER.</span></div> <div class="sezzle-footer-select-text" style="height: 31.3px; text-transform: none; font-family: Raleway, sans-serif; font-size: 16px; font-weight: 700; text-align: center; color: #000000;">Just Select Sezzle at Checkout </div> <div class="sezzle-footer-text-link" style="text-transform: none; font-family: Raleway, sans-serif; font-size: 9px; font-weight: 500; line-height: 1.48; text-align: center; color: #44474b; margin: 0 25px; padding-bottom: 25px;">Subject to approval. Estimated payment amount excludes taxes and shipping fees. Your actual installment payments will be presented for confirmation in your checkout with Sezzle. </div> </div> </div>'
            }
            document.getElementsByTagName('html')[0].appendChild(modalNode);
          } else {
            modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
          }
        
          // Event listener for close in modal
          Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
            el.addEventListener('click', function () {
              // Display the modal node
              modalNode.style.display = 'none';
              // Add hidden class hide the item
              modalNode.getElementsByClassName('sezzle-modal')[0].className = 'sezzle-modal sezzle-checkout-modal-hidden';
            });
          });
        
          // Event listener to prevent close in modal if click happens within sezzle-checkout-modal
          let sezzleModal = document.getElementsByClassName('sezzle-modal')[0]
          // backwards compatability check
          if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0]
          sezzleModal.addEventListener('click', function (event) {
            // stop propagating the event to the parent sezzle-checkout-modal-lightbox to prevent the closure of the modal
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
      
        // Event listener for close in modal
        Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
          el.addEventListener('click', function () {
            // Display the modal node
            modalNode.style.display = 'none';
          });
        });
      
        // Event listener to prevent close in modal if click happens within sezzle-checkout-modal
        let sezzleModal = document.getElementsByClassName('sezzle-modal')[0]
        // backwards compatability check
        if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0]
        sezzleModal.addEventListener('click', function (event) {
          // stop propagating the event to the parent sezzle-checkout-modal-lightbox to prevent the closure of the modal
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
      
        // Event listener for close in modal
        Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
          el.addEventListener('click', function () {
            // Display the modal node
            modalNode.style.display = 'none';
          });
        });
      
        // Event listener to prevent close in modal if click happens within sezzle-checkout-modal
        let sezzleModal = document.getElementsByClassName('sezzle-modal')[0]
        // backwards compatability check
        if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0]
        sezzleModal.addEventListener('click', function (event) {
          // stop propagating the event to the parent sezzle-checkout-modal-lightbox to prevent the closure of the modal
          event.stopPropagation();
        });
    }
    renderModalByfunction(){
      var modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
      modalNode.style.display = 'block';
      modalNode.getElementsByClassName('sezzle-modal')[0].className = 'sezzle-modal';
    }
    addClickEventForModal(sezzleElement){
        var modalLinks = sezzleElement.getElementsByClassName('sezzle-modal-link');
        Array.prototype.forEach.call(modalLinks, function (modalLink) {
          modalLink.addEventListener('click', function (event) {
            if (!event.target.classList.contains('no-sezzle-info')) {
              var modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
              // Show modal node
              modalNode.style.display = 'block';
              // Remove hidden class to show the item
              modalNode.getElementsByClassName('sezzle-modal')[0].className = 'sezzle-modal';
            
            }
          }.bind(this));
        }.bind(this));
      
        // for AfterPay
        var apModalLinks = sezzleElement.getElementsByClassName('ap-modal-info-link');
        Array.prototype.forEach.call(apModalLinks, function (modalLink) {
          modalLink.addEventListener('click', function () {
            // Show modal node
            document.getElementsByClassName('sezzle-ap-modal')[0].style.display = 'block';
            // log on click event
           
          }.bind(this));
        }.bind(this));
      
        // for QuadPay
        var qpModalLinks = sezzleElement.getElementsByClassName('quadpay-modal-info-link');
        Array.prototype.forEach.call(qpModalLinks, function (modalLink) {
          modalLink.addEventListener('click', function () {
            // Show modal node
            document.getElementsByClassName('sezzle-qp-modal')[0].style.display = 'block';
            // log on click event
           
          }.bind(this));
        }.bind(this));
    }
    getCSSVersionForMerchant(callback){
      callback()
    }

    isMobileBrowser(){
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4));
    }
    init(){
        // no widget to render
        this.loadCSS(this.initWidget.bind(this));
        //var win = window.frames.szl;
        
    }

    initWidget(){
        const intervalInMs = 2000;
        var els = [];
        // only render the modal once for all widgets
        function renderModals() {
            // This should always happen before rendering the widget

            this.renderModal();
            // only render APModal if ap-modal-link exists
            if (document.getElementsByClassName('ap-modal-info-link').length > 0) {
            this.renderAPModal();
            }
            // only render QPModal if ap-modal-link exists
            if (document.getElementsByClassName('quadpay-modal-info-link').length > 0) {
            this.renderQPModal();
            }
        };

        function sezzleWidgetCheckInterval() {
            
                if (!this.renderElement.hasAttribute('data-sezzleindex')) {
                els.push({
                    element: this.renderElement,
                });
                }
            // add the sezzle widget to the price elements
            els.forEach(function (el, index) {
            if (!el.element.hasAttribute('data-sezzleindex')) {
                var sz = this.renderAwesomeSezzle();
                sz?this.addClickEventForModal(sz):delete els[index]; 
            }
            }.bind(this));
            // refresh the array
            els = els.filter(function (e) {
            return e !== undefined;
            })
        };
        sezzleWidgetCheckInterval.call(this);
        renderModals.call(this);

        }
        
}


export default AwesomeSezzle;