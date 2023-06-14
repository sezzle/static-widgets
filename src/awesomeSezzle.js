import HelperClass from './awesomeHelper'
import '../css/global.scss';



class AwesomeSezzle {

	constructor(options) {
		if (!options) {
			options = {};
			console.error('Config for widget is not supplied');
		}
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
		switch (options.merchantLocale) {
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
		if (this.language === 'spanish' || this.language === 'espanol' || this.language === 'español') this.language = 'es';
		this.numberOfPayments = options.numberOfPayments || 4;
		var templateString = this.widgetLanguageTranslation(this.language, this.numberOfPayments, this.merchantLocale)
		var templateStringLT = this.widgetLanguageTranslationLT(this.language);
		this.widgetTemplate = options.widgetTemplate ? options.widgetTemplate.split('%%') : templateString.split('%%');
		this.widgetTemplateLT = options.widgetTemplateLT ? options.widgetTemplateLT.split('%%') : templateStringLT.split('%%');
		this.renderElementInitial = options.renderElement || 'sezzle-widget';
		this.assignConfigs(options);
	}

	assignConfigs(options) {
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
		this.renderElementArray = typeof (this.renderElementInitial) === 'string' ? [this.renderElementInitial] : this.renderElementInitial;
		this.renderElement = this.renderElementInitial;
		this.apLink = options.apLink || 'https://www.afterpay.com/purchase-payment-agreement';
		this.widgetType = options.widgetType || 'product-page';
		this.bannerURL = options.bannerURL || '';
		this.bannerClass = options.bannerClass || '';
		this.bannerLink = options.bannerLink || '';
		this.marginTop = options.marginTop || 0;
		this.marginBottom = options.marginBottom || 0;
		this.marginLeft = options.marginLeft || 0;
		this.marginRight = options.marginRight || 0;
		this.logoSize = options.logoSize || 1.0;
		this.scaleFactor = options.scaleFactor || 1.0;
		this.fixedHeight = options.fixedHeight || 0;
		this.logoStyle = options.logoStyle || {};
		this.theme = options.theme || 'light';
		this.parseMode = options.parseMode || 'default'; // other available option is comma (For french)
		this.widgetTemplate = this.widgetTemplate;
		this.widgetTemplateLT = this.widgetTemplateLT;
	}



	widgetLanguageTranslation(language, numberOfPayments, merchantLocale) {
		const translations = {
			'en': 'or ' + numberOfPayments + (merchantLocale === 'North America' ? ' interest-free' : '') + ' payments of %%price%% with %%logo%% %%info%%' + (merchantLocale === 'Europe' ? ' - no fee' : ''),
			'fr': 'ou ' + numberOfPayments + ' paiements de %%price%%' + (merchantLocale === 'North America' ? ' sans int%%&eacute;%%r%%&ecirc;%%ts' : '') + ' avec %%logo%% %%info%%' + (merchantLocale === 'Europe' ? ' - gratuit' : ''),
			'es': 'o ' + numberOfPayments + ' pagos' + (merchantLocale === 'North America' ? ' sin intereses' : '') + ' de %%price%% con %%logo%% %%info%%' + (merchantLocale === 'Europe' ? ' - gratis' : '')
		};
		return translations[language] || translations.en;
	};

	widgetLanguageTranslationLT(language) {
		const translations = {
			'en': 'or monthly payments as low as %%price%% with %%logo%% %%info%%',
			'fr': 'ou des paiements mensuels aussi bas que %%price%% avec %%logo%% %%info%%',
			'es': 'o pagos mensuales tan bajos como %%price%% con %%logo%% %%info%%'
		};
		return translations[language] || translations.en;
	};

	addCSSAlignment() {
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

	addCSSFontStyle() {
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

	setImageURL() {
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

	addCSSCustomisation() {
		this.addCSSAlignment();
		this.addCSSFontStyle();
		this.addCSSTextColor();
		this.addCSSTheme();
		this.addCSSWidth();
	}

	insertWidgetTypeCSSClassInElement() {
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
			this.renderElement.style.overflow = 'hidden';
		}
	}


	alterPrice(amt) {
		this.eraseWidget();
		this.assignConfigs(this);
		this.amount = amt;
		this.init()
	}

	eraseWidget() {
		this.renderElementArray.forEach(function (element, index) {
			let sezzleElement = document.getElementById(element);
			if (sezzleElement.innerHTML.length) {
				sezzleElement.removeChild(sezzleElement.querySelector('.sezzle-checkout-button-wrapper'));
			}
		})
		var modals = document.getElementsByClassName('sezzle-checkout-modal-lightbox')
		if (modals.length) {
			for (let i = modals.length - 1; modals.length > 0; i--) {
				modals[i].parentElement.removeChild(modals[i]);
			}
		}
	}

	setLogoSize(element) {
		element.style.transformOrigin = `top ${this.alignment}`;
		element.style.transform = `scale(${this.logoSize})`
	}

	setLogoStyle(element) {
		var newStyles = Object.keys(this.logoStyle);
		for (let i = 0; i < newStyles.length; i++) {
			element.style[newStyles[i]] = this.logoStyle[newStyles[i]];
		}
	}

	n(newVal) {
		var priceNode = document.getElementsByClassName('sezzle-payment-amount')[0];
		var priceValueText = document.createTextNode(this.getFormattedPrice(newVal));
		priceNode.innerHTML = '';
		priceNode.appendChild(priceValueText)
	}

	renderAwesomeSezzle() {
		if (!this.isProductEligible(this.amount)) return false;
		this.insertWidgetTypeCSSClassInElement();
		this.setElementMargins();
		if (this.scaleFactor || this.fixedHeight) this.setWidgetSize();
		var node = document.createElement('button');
		node.ariaHasPopup = "dialog";
		node.className = 'sezzle-checkout-button-wrapper sezzle-modal-link';
		// node.style.cursor = 'pointer';
		var sezzleButtonText = document.createElement('div');
		sezzleButtonText.className = 'sezzle-button-text';
		this.setImageURL();
		var widgetText = this.isProductEligibleLT(this.amount) ? this.widgetTemplateLT : this.widgetTemplate;
		var learnMoreTranslations = {
			en: 'Click here to learn more about',
			fr: 'Cliquez ici pour en savoir plus sur',
			de: 'Klicken Sie hier, um erfahren Sie mehr über',
			es: 'Clic aquí para aprender más sobre',
			'en-GB': 'Click to learn more about',
			'fr-FR': 'Cliquez ici pour en savoir plus sur',
			'de-DE': 'Klicken Sie hier, um erfahren Sie mehr über',
			'es-ES': 'Clic aquí para aprender más sobre',
			'it-IT': 'Clicca qui per ulteriori informazioni su'
		}
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
					var logoNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					logoNode.setAttribute('width', '798.16');
					logoNode.setAttribute('height', '199.56');
					logoNode.setAttribute('viewBox', '0 0 798.16 199.56');
					logoNode.setAttribute('class', `sezzle-logo ${this.imageClassName}`);
					logoNode.setAttribute('aria-label', 'Sezzle');
					logoNode.style.height = '18px !important';
					logoNode.innerHTML = this.imageInnerHTML;
					sezzleButtonText.appendChild(logoNode);
					if (this.logoStyle != {}) this.setLogoStyle(logoNode);
					this.setLogoSize(logoNode);
					if (this.theme === 'purple-pill' || this.theme == 'white-pill') {
						logoNode.style.transform = 'scale(12)';
					}
					break;
				case 'link':
					var learnMoreNode = document.createElement('button');
					learnMoreNode.role = 'button';
					learnMoreNode.type = 'button';
					learnMoreNode.ariaLabel = `${learnMoreTranslations[this.language]} Sezzle`;
					learnMoreNode.className = 'sezzle-learn-more sezzle-modal-open-link';
					var learnMoreText = document.createTextNode('Learn more');
					learnMoreNode.appendChild(learnMoreText);
					sezzleButtonText.appendChild(learnMoreNode);
					break;
				case 'info':
					var infoIconNode = document.createElement('div');
					infoIconNode.ariaLabel = `${learnMoreTranslations[this.language]} Sezzle`;
					infoIconNode.className = 'sezzle-info-icon sezzle-modal-open-link';
					infoIconNode.innerHTML = '&#9432;';
					sezzleButtonText.appendChild(infoIconNode);
					break;
				case 'question-mark':
					var questionMarkButton = document.createElement('button');
					questionMarkButton.role = 'button';
					questionMarkButton.type = 'button';
					questionMarkButton.ariaLabel = `${learnMoreTranslations[this.language]} Sezzle`;
					var questionMarkIconNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					questionMarkIconNode.setAttribute('width', '14');
					questionMarkIconNode.setAttribute('height', '14');
					questionMarkIconNode.setAttribute('viewBox', '0 0 369 371');
					questionMarkButton.setAttribute('class', 'sezzle-question-mark-icon sezzle-modal-open-link');
					questionMarkIconNode.innerHTML = HelperClass.svgImages().questionMarkIcon;
					questionMarkButton.appendChild(questionMarkIconNode);
					sezzleButtonText.appendChild(questionMarkButton);
					break;
				case 'afterpay-logo':
					var apNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					apNode.setAttribute('width', '115');
					apNode.setAttribute('height', '40');
					apNode.setAttribute('viewBox', '0 0 115 40');
					apNode.setAttribute('class', `sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`);
					apNode.setAttribute('style', `height: 24px !important;width: auto !important;margin-bottom: -8px;`);
					apNode.setAttribute('aria-label', 'Afterpay');
					apNode.innerHTML = HelperClass.svgImages().apNodeColor;
					sezzleButtonText.appendChild(apNode);
					this.setLogoSize(apNode);
					break;
				case 'afterpay-logo-grey':
					var apNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					apNode.setAttribute('width', '115');
					apNode.setAttribute('height', '40');
					apNode.setAttribute('viewBox', '0 0 115 40');
					apNode.setAttribute('class', `sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`);
					apNode.setAttribute('style', `height: 32px !important;width: auto !important;margin: -10px !important;`);
					apNode.setAttribute('aria-label', 'Afterpay');
					apNode.innerHTML = HelperClass.svgImages().apNodeGrey;
					sezzleButtonText.appendChild(apNode);
					this.setLogoSize(apNode);
					break;
				case 'afterpay-logo-white':
					var apNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					apNode.setAttribute('width', '115');
					apNode.setAttribute('height', '40');
					apNode.setAttribute('viewBox', '0 0 115 40');
					apNode.setAttribute('class', `sezzle-afterpay-logo ap-modal-info-link no-sezzle-info`);
					apNode.setAttribute('style', `height: 32px !important;width: auto !important;margin: -10px !important`);
					apNode.setAttribute('aria-label', 'Afterpay');
					apNode.innerHTML = HelperClass.svgImages().apNodeWhite;
					sezzleButtonText.appendChild(apNode);
					this.setLogoSize(apNode);
					break;
				case 'afterpay-info-icon':
					var apInfoIconNode = document.createElement('button');
					apInfoIconNode.role = 'button';
					apInfoIconNode.type = 'button';
					apInfoIconNode.ariaLabel = `${learnMoreTranslations[this.language]} Afterpay`;
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
					var qpNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					qpNode.setAttribute('width', '498');
					qpNode.setAttribute('height', '135');
					qpNode.setAttribute('viewBox', '0 0 498 135');
					qpNode.setAttribute('class', `sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`);
					qpNode.setAttribute('style', `height: 22px !important;width: auto !important;margin-bottom: -5px;`);
					qpNode.setAttribute('aria-label', 'Quadpay');
					qpNode.innerHTML = HelperClass.svgImages().qpNodeColor;
					sezzleButtonText.appendChild(qpNode);
					this.setLogoSize(qpNode);
					break;
				case 'quadpay-logo-grey':
					var qpNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					qpNode.setAttribute('width', '498');
					qpNode.setAttribute('height', '135');
					qpNode.setAttribute('viewBox', '0 0 498 135');
					qpNode.setAttribute('class', `sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`);
					qpNode.setAttribute('style', `height: 22px !important;width: auto !important;margin-bottom: -5px;`);
					qpNode.setAttribute('aria-label', 'Quadpay');
					qpNode.innerHTML = HelperClass.svgImages().qpNodeGrey;
					sezzleButtonText.appendChild(qpNode);
					this.setLogoSize(qpNode);
					break;
				case 'quadpay-logo-white':
					var qpNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					qpNode.setAttribute('width', '498');
					qpNode.setAttribute('height', '135');
					qpNode.setAttribute('viewBox', '0 0 498 135');
					qpNode.setAttribute('class', `sezzle-quadpay-logo quadpay-modal-info-link no-sezzle-info`);
					qpNode.setAttribute('style', `height: 22px !important;width: auto !important;margin-bottom: -5px;`);
					qpNode.setAttribute('aria-label', 'Quadpay');
					qpNode.innerHTML = HelperClass.svgImages().qpNodeWhite;
					sezzleButtonText.appendChild(qpNode);
					this.setLogoSize(qpNode);
					break;
				case 'quadpay-info-icon':
					var quadpayInfoIconNode = document.createElement('button');
					quadpayInfoIconNode.role = 'button';
					quadpayInfoIconNode.type = 'button';
					quadpayInfoIconNode.ariaLabel = `${learnMoreTranslations[this.language]} Quadpay`;
					quadpayInfoIconNode.className = 'quadpay-modal-info-link no-sezzle-info';
					quadpayInfoIconNode.innerHTML = '&#9432;';
					sezzleButtonText.appendChild(quadpayInfoIconNode);
					break;
				case 'affirm-logo':
					var affirmNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					affirmNode.setAttribute('width', '450');
					affirmNode.setAttribute('height', '170');
					affirmNode.setAttribute('viewBox', '0 0 450 170');
					affirmNode.setAttribute('class', `sezzle-affirm-logo affirm-modal-info-link no-sezzle-info`);
					affirmNode.setAttribute('style', `height: 24px !important;width: auto !important;`);
					affirmNode.setAttribute('aria-label', 'Affirm');
					affirmNode.innerHTML = HelperClass.svgImages().affirmNodeColor;
					sezzleButtonText.appendChild(affirmNode);
					this.setLogoSize(affirmNode);
					break;
				case 'affirm-logo-grey':
					var affirmNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					affirmNode.setAttribute('width', '450');
					affirmNode.setAttribute('height', '170');
					affirmNode.setAttribute('viewBox', '0 0 450 170');
					affirmNode.setAttribute('class', `sezzle-affirm-logo affirm-modal-info-link no-sezzle-info`);
					affirmNode.setAttribute('style', `height: 24px !important;width: auto !important;`);
					affirmNode.setAttribute('aria-label', 'Affirm');
					affirmNode.innerHTML = HelperClass.svgImages().affirmNodeGrey;
					sezzleButtonText.appendChild(affirmNode);
					this.setLogoSize(affirmNode);
					break;
				case 'affirm-logo-white':
					var affirmNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					affirmNode.setAttribute('width', '450');
					affirmNode.setAttribute('height', '170');
					affirmNode.setAttribute('viewBox', '0 0 450 170');
					affirmNode.setAttribute('class', `sezzle-affirm-logo affirm-modal-info-link no-sezzle-info`);
					affirmNode.setAttribute('style', `height: 24px !important;width: auto !important;`);
					affirmNode.setAttribute('aria-label', 'Affirm');
					affirmNode.innerHTML = HelperClass.svgImages().affirmNodeWhite;
					sezzleButtonText.appendChild(affirmNode);
					this.setLogoSize(affirmNode);
					break;
				case 'affirm-info-icon':
					var affirmInfoIconNode = document.createElement('button');
					affirmInfoIconNode.role = 'button';
					affirmInfoIconNode.type = 'button';
					affirmInfoIconNode.ariaLabel = `${learnMoreTranslations[this.language]} Affirm`;
					affirmInfoIconNode.className = 'affirm-modal-info-link no-sezzle-info';
					affirmInfoIconNode.innerHTML = '&#9432;';
					sezzleButtonText.appendChild(affirmInfoIconNode);
					break;
				case 'klarna-logo':
					var klarnaNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					klarnaNode.setAttribute('width', '45');
					klarnaNode.setAttribute('height', '25');
					klarnaNode.setAttribute('viewBox', '0 0 45 23');
					klarnaNode.setAttribute('class', `sezzle-klarna-logo klarna-modal-info-link no-sezzle-info`);
					klarnaNode.setAttribute('style', `height: 25px !important;width: auto !important; margin-bottom: -5px;`);
					klarnaNode.setAttribute('aria-label', 'Klarna');
					klarnaNode.innerHTML = HelperClass.svgImages().klarnaNodeColor;
					sezzleButtonText.appendChild(klarnaNode);
					this.setLogoSize(klarnaNode);
					break;
				case 'klarna-logo-grey':
					var klarnaNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					klarnaNode.setAttribute('width', '45');
					klarnaNode.setAttribute('height', '25');
					klarnaNode.setAttribute('viewBox', '0 0 45 23');
					klarnaNode.setAttribute('class', `sezzle-klarna-logo klarna-modal-info-link no-sezzle-info`);
					klarnaNode.setAttribute('style', `height: 25px !important;width: auto !important; margin-bottom: -5px;`);
					klarnaNode.setAttribute('aria-label', 'Klarna');
					klarnaNode.innerHTML = HelperClass.svgImages().klarnaNodeGrey;
					sezzleButtonText.appendChild(klarnaNode);
					this.setLogoSize(klarnaNode);
					break;
				case 'klarna-logo-white':
					var klarnaNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
					klarnaNode.setAttribute('width', '45');
					klarnaNode.setAttribute('height', '25');
					klarnaNode.setAttribute('viewBox', '0 0 45 23');
					klarnaNode.setAttribute('class', `sezzle-klarna-logo klarna-modal-info-link no-sezzle-info`);
					klarnaNode.setAttribute('style', `height: 25px !important;width: auto !important; margin-bottom: -5px;`);
					klarnaNode.setAttribute('aria-label', 'Klarna');
					klarnaNode.innerHTML = HelperClass.svgImages().klarnaNodeWhite;
					sezzleButtonText.appendChild(klarnaNode);
					this.setLogoSize(klarnaNode);
					break;
				case 'klarna-info-icon':
					var klarnaInfoIconNode = document.createElement('button');
					klarnaInfoIconNode.role = 'button';
					klarnaInfoIconNode.type = 'button';
					klarnaInfoIconNode.ariaLabel = `${learnMoreTranslations[this.language]} Klarna`;
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

	getElementToRender() {
		return this.renderElement;
	}

	isProductEligible(priceText) {
		var price = this.parseMode === 'default' ? HelperClass.parsePrice(priceText) : HelperClass.parsePrice(priceText, this.parseMode);
		this.productPrice = price;
		var priceInCents = price * 100;
		return priceInCents >= this.minPrice && priceInCents <= this.maxPrice;
	}

	isProductEligibleLT(priceText) {
		var price = this.parseMode === 'default' ? HelperClass.parsePrice(priceText) : HelperClass.parsePrice(priceText, this.parseMode);
		this.productPrice = price;
		var priceInCents = price * 100;
		return this.minPriceLT && priceInCents >= this.minPriceLT && priceInCents <= this.maxPrice;
	}

	getFormattedPrice(amount = this.amount) {
		const priceText = amount;
		const priceString = HelperClass.parsePriceString(priceText, true);
		const price = this.parseMode === 'default' ? HelperClass.parsePrice(priceText) : HelperClass.parsePrice(priceText, this.parseMode);
		const formatter = priceText.replace(priceString, '{price}');
		const terms = this.termsToShow(price);
		const sezzleInstallmentPrice = this.isProductEligibleLT(amount) ? this.calculateMonthlyWithInterest(price.toString(), terms[terms.length - 1], this.bestAPR) : (price / this.numberOfPayments);
		const sezzleInstallmentFormattedPrice = formatter.replace('{price}', this.addDelimiters(sezzleInstallmentPrice, this.parseMode));
		return sezzleInstallmentFormattedPrice;

	}

	addDelimiters(priceString, parseMode) {
		var parsedPrice = Number(priceString).toFixed(2);
		if (parsedPrice.length > 6 && parseMode === "comma") {
			var commaPrice = parsedPrice.replace('.', ',');
			return commaPrice.substring(0, commaPrice.indexOf(',') - 3) + '.' + commaPrice.substring(commaPrice.indexOf(',') - 3, commaPrice.length);
		} else if (parsedPrice.length > 6) {
			return parsedPrice.substring(0, parsedPrice.indexOf('.') - 3) + ',' + parsedPrice.substring(parsedPrice.indexOf('.') - 3, parsedPrice.length);
		} else {
			return parsedPrice;
		}
	}

	termsToShow(price) {
		switch (true) {
			case (price > 1000):
				return [24, 36, 48];
			case (price > 500):
				return [6, 12, 24];
			case (price > 250):
				return [3, 6, 12];
			default:
				return [3, 6];
		}
	}

	currencySymbol(priceText) {
		// var currency = this.amount.split('').filter(function(character){ return /[$|€|£]/.test(character)})[0] || '$';
		// doesn't work with ISO-8859-1
		var currency = 0;
		for (let i = 0; i < priceText.length; i++) {
			if (priceText.charCodeAt(i) === 8364 || priceText.charCodeAt(i) === 128 || priceText.charCodeAt(i) === 8356 || priceText.charCodeAt(i) === 163) {
				currency = priceText.charCodeAt(i)
			}
		}
		return currency || 36;
	}

	calculateMonthlyWithInterest(priceText, term, APR) {
		const price = Number(priceText);
		if (APR > 0) {
			const rate = (APR / 100) / 12;
			const numerator = price * rate * Math.pow(1 + rate, term);
			const denominator = Math.pow(1 + rate, term) - 1;
			const interestPayment = numerator / denominator
			return interestPayment;
		} else {
			return (price / term);
		}
	}
	formatMonthly(priceString, parseMode, term, APR) {
		const interestAmount = this.calculateMonthlyWithInterest(priceString, term, APR);
		return this.addDelimiters(interestAmount.toFixed(2), parseMode);
	}
	formatTotalInterest(priceString, parseMode, term, APR) {
		const adjustedTotal = this.calculateMonthlyWithInterest(priceString, term, APR) * term;
		return this.addDelimiters(adjustedTotal - priceString, parseMode);
	}
	formatAdjustedTotal(priceString, parseMode, term, APR) {
		const amountPlusInterest = this.calculateMonthlyWithInterest(priceString, term, APR);
		return this.addDelimiters((amountPlusInterest * term), parseMode);
	}

	modalKeyboardNavigation() {
		let focusableElements = document.querySelector('.sezzle-modal-content').childNodes;
		let firstFocusableElement = focusableElements[0];
		let lastFocusableElement = focusableElements[focusableElements.length - 1];
		document.addEventListener('keydown', function (event) {
			if (event.key === 'ArrowDown' && document.activeElement === lastFocusableElement) {
				firstFocusableElement.focus();
			} else if (event.key === 'ArrowUp' && document.activeElement === firstFocusableElement) {
				lastFocusableElement.focus();
			} else if (event.key === 'Escape') {
				let modals = document.getElementsByClassName('sezzle-checkout-modal-lightbox');
				for (let i = 0; i < modals.length; i++) {
					modals[i].style.display = 'none';
				}
				var newFocus = document.querySelector('#sezzle-modal-return');
				if (newFocus) {
					newFocus.focus();
					newFocus.removeAttribute('id');
				} else if (document.querySelector('.sezzle-checkout-button-wrapper').querySelector('.sezzle-info-icon')) {
					document.querySelector('.sezzle-checkout-button-wrapper').querySelector('.sezzle-info-icon').focus();
				} else {
					document.querySelector('.sezzle-checkout-button-wrapper').focus();
				}
			}
		})
	}

	renderModal() {
		const modalTranslations = {
			en: {
				closeSezzleModal: 'Close Sezzle modal.',
				sezzleHeader: 'Buy Now. Pay Later.',
				sezzleHeaderChild: 'Pay in 4 by selecting Sezzle at checkout.',
				sezzleHeaderLt: 'Make easy monthly payments on your order',
				sezzleRowChild: 'Flexible payment plans for your budget',
				sezzleRowLtChild: 'Checking eligibility won\'t affect your credit.',
				pieAlt: 'pie at',
				today: 'Today',
				week: 'Week',
				singleFeatureOptions: 'Instant approval decision',
				singleFeatureCredit: 'No credit check required',
				singleFeatureAffordable: 'Affordable monthly plans',
				singleFeaturePrequalify: 'Simple, quick pre-qualification',
				singleFeatureTrusted: 'Trusted by over 10 million consumers',
				singleFeatureCreditBuilding: 'Opt in to free credit building',

				sezzleLtPaymentHeader: 'Sample payments for',
				perMonth: 'per month',
				monthlyAmount: '/ month',
				termLength: 'months',
				adjustedTotal: 'Total Payment:',
				interest: 'Total Interest:',
				sampleApr: 'APR:',
				readApr: 'A.P.R.',
				percent: 'percent',
				terms1: 'Signing up for Sezzle will not impact your credit score. You may opt-in to our free credit reporting program, Sezzle Up, to have your payments reported to credit bureaus. Learn more about spending power <a href="https://sezzle.com/how-it-works" target="_blank">here</a>.',
				terms2: 'Subject to approval. <a href="https://www.sezzle.com/legal" target="_blank">Click here for complete terms.</a> First payment date and amount may fluctuate based on eligibility and time of merchant order completion.',
				termsLt1: 'Signing up for Sezzle will not impact your credit score. <a href="https://sezzle.com/how-it-works" target="_blank">Learn&nbsp;more&nbsp;here.</a>',
				termsLt2: 'Subject to approval. <a href="https://www.sezzle.com/legal" target="_blank">Click here for complete terms.</a> First payment date and amount may fluctuate based on eligibility and time of merchant order completion.',
				termsLt3: 'Subject to credit approval by a third party lender. Rates from 5.99% - 34.99% APR; terms from 3 months – 48 months, which may vary by lender. 0% APR options may be available. APRs will vary depending on credit qualifications, loan amount, term, and lender. Minimum purchase is required.',
			},
			fr: {
				closeSezzleModal: 'Fermer Sezzle modal.',
				sezzleHeader: 'Acheter maintenant. Payer&nbsp;plus&nbsp;tard.',
				sezzleHeaderChild: 'Payez en 4 en sélectionnant Sezzle à la caisse.',
				sezzleHeaderLt: 'Effectuez des paiements mensuels faciles sur votre&nbsp;achat',
				sezzleRowChild: 'Plans de paiement flexibles pour votre&nbsp;budget',
				sezzleRowLtChild: 'Vérifier l\'éligibilité n\'affectera pas votre crédit.',
				pieAlt: 'graphique circulaire à',
				today: 'Aujourd\'hui',
				week: 'Semaine',
				singleFeatureOptions: 'Décision d\'approbation instantanée',
				singleFeatureCredit: 'Aucune vérification de crédit requise',
				singleFeatureAffordable: 'Forfaits mensuels abordables',
				singleFeaturePrequalify: 'Pré-qualification simple et rapide',
				singleFeatureTrusted: 'Reconnu par plus de 10 millions de&nbsp;consommateurs',
				singleFeatureCreditBuilding: 'Optez pour la construction de crédit&nbsp;gratuite',
				sezzleLtPaymentHeader: 'Exemples de paiements pour',
				perMonth: 'par mois',
				monthlyAmount: '/ mois',
				termLength: 'mois',
				adjustedTotal: 'Paiement Total:',
				interest: 'Intérêt Total:',
				sampleApr: 'APR:',
				readApr: 'A.P.R.',
				percent: 'pour cent',
				terms1: 'L\'inscription à Sezzle n\'aura aucune incidence sur votre pointage de crédit. Vous pouvez accepter de participer à notre programme gratuit d\'évaluation du crédit, Sezzle Up, afin que vos paiements soient signalés aux bureaux de crédit. Pour en savoir plus sur le pouvoir d\'achat, <a href="https://sezzle.com/how-it-works" target="_blank">cliquez ici.</a>',
				terms2: 'Sous réserve d\'approbation. <a href="https://www.sezzle.com/legal" target="_blank">Cliquez ici pour l\'intégralité des conditions.</a> La date et le montant du premier paiement peuvent varier en fonction de l\'éligibilité et de la date de finalisation de la commande auprès du vendeu.',
				termsLt1: 'L\'inscription à Sezzle n\'aura aucune incidence sur votre pointage de crédit. <a href="https://sezzle.com/how-it-works" target="_blank">Pour en savoir plus, cliquez ici.</a>',
				termsLt2: 'Sous réserve d\'approbation. <a href="https://www.sezzle.com/legal" target="_blank">Cliquez ici pour l\'intégralité des conditions.</a> La date et le montant du premier paiement peuvent varier en fonction de l\'éligibilité et de la date de finalisation de la commande auprès du vendeu.',
				termsLt3: 'Sous réserve de l\'approbation du crédit par un prêteur tiers. Taux de 5,99 % à 34,99 % APR ; durées de 3 mois à 48 mois, qui peuvent varier selon le prêteur. Des options à 0 % APR peuvent être disponibles. Les APR varient en fonction des qualifications de crédit, du montant du prêt, de la durée et du prêteur. Un achat minimum est requis.',
			},
			es: {
				closeSezzleModal: 'Cerrar Sezzle modal.',
				sezzleHeader: 'Comprar ahora. Paga&nbsp;después.',
				sezzleHeaderChild: 'Paga en 4 seleccionando Sezzle al finalizar la&nbsp;compra.',
				sezzleHeaderLt: 'Realiza pagos mensuales fáciles en tu compra',
				sezzleRowChild: 'Planes de pago flexibles para su&nbsp;presupuesto',
				sezzleRowLtChild: 'Verificar la elegibilidad no afectará su crédito.',
				pieAlt: 'gráfico circular en',
				today: 'Hoy',
				week: 'Semana',
				singleFeatureOptions: 'Decisión de aprobación instantánea',
				singleFeatureCredit: 'No se requiere verificación de&nbsp;crédito',
				singleFeatureAffordable: 'Planes mensuales asequibles',
				singleFeaturePrequalify: 'Precalificación simple y rápida',
				singleFeatureTrusted: 'Con la confianza de más de 10 millones de consumidores',
				singleFeatureCreditBuilding: 'Optar por la construcción de crédito&nbsp;gratis',
				sezzleLtPaymentHeader: 'Ejemplos de pagos por',
				perMonth: 'por mes',
				monthlyAmount: '/ mes',
				termLength: 'meses',
				adjustedTotal: 'Pago Total:',
				interest: 'Interés Total:',
				sampleApr: 'TAE:',
				readApr: 'T.A.E.',
				percent: 'por ciento',
				terms1: 'Registrarse en Sezzle no afectará su puntaje de crédito. Puede aceptar participar en nuestro programa gratuito de informes crediticios, Sezzle Up, para que sus pagos sean informados a las agencias de crédito. Para obtener más información sobre el poder adquisitivo, <a href="https://sezzle.com/how-it-works" target="_blank">haga clic aquí.</a>',
				terms2: 'Sujeto a aprobación. <a href="https://www.sezzle.com/legal" target="_blank">Haga clic aquí para ver los términos completos.</a> La fecha y el monto del primer pago pueden variar según la elegibilidad y la fecha de finalización del pedido con el&nbsp;vendedor.',
				termsLt1: 'Registrarse en Sezzle no afectará su puntaje de crédito. <a href="https://sezzle.com/how-it-works" target="_blank">Para obtener más información, haga clic aquí.</a>',
				termsLt2: 'Sujeto a aprobación. <a href="https://www.sezzle.com/legal" target="_blank">Haga clic aquí para ver los términos completos.</a> La fecha y el monto del primer pago pueden variar según la elegibilidad y la fecha de finalización del pedido con el&nbsp;vendedor.',
				termsLt3: 'Sujeto a la aprobación de crédito por parte de un tercero prestamista. Tasas desde 5,99% - 34,99% TAE; plazos de 3 meses a 48 meses, que pueden variar según el prestamista. Las opciones de 0% APR pueden estar disponibles. Las APR variarán según las calificaciones crediticias, el monto del préstamo, el plazo y el prestamista. Se requiere compra mínima.',
			}
		}
		if (!document.getElementsByClassName('sezzle-checkout-modal-lightbox').length) {
			var modalNode = document.createElement('section');
			modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal';
			modalNode.style.display = 'none';
			modalNode.role = 'dialog';
			modalNode.lang = this.language;
			modalNode.ariaLabel = 'Sezzle Information';
			modalNode.ariaDescription = 'Learn more about Sezzle';
			if (this.isProductEligibleLT(this.amount)) {
				var currency = String.fromCharCode(this.currencySymbol(this.amount));
				var priceString = this.amount.indexOf(currency) > -1 ? this.amount.split(currency)[1] : this.amount;
				priceString = this.parseMode === "comma" ? priceString.replace('.', '').replace(',', '.') : priceString.replace(',', '');
				var terms = this.termsToShow(priceString);
				if (this.ltAltModalHTML) {
					modalNode.innerHTML = this.ltAltModalHTML;
				} else {
					modalNode.innerHTML = `
				<div id="sezzle-modal-container" role="dialog" aria-label="Sezzle Modal" aria-description="Learn more about Sezzle" class="sezzle-checkout-modal-hidden long-term">
					<div class="sezzle-modal">
						<div>
							<button role="button" aria-label="${modalTranslations[this.language].closeSezzleModal}" class="close-sezzle-modal"></button>
						</div>
						<div class="sezzle-logo" title="Sezzle"> </div>
						<div id="sezzle-modal-core-content" class="sezzle-modal-content">

							<header class="sezzle-header">${modalTranslations[this.language].sezzleHeaderLt}</header>
							<div class="sezzle-row">${modalTranslations[this.language].sezzleRowLtChild}</div>
							<div class="sezzle-lt-payments">
								<div class="sezzle-lt-payment-header">${modalTranslations[this.language].sezzleLtPaymentHeader} <span>${currency + this.addDelimiters(priceString, this.parseMode)}</span></div>
								<div class="sezzle-lt-payment-options ${terms[2]}-month" ${terms[2] === undefined ? `style="display: none;"` : `style="display: block;"`}>
									<div class="plan">
									<div class="monthly-amount">
										<span>${currency + this.formatMonthly(priceString, this.parseMode, terms[2], this.bestAPR)}</span>
										<span aria-label="${modalTranslations[this.language].perMonth}"><span class="per-month" aria-hidden="true">${modalTranslations[this.language].monthlyAmount}<sup>*</sup></span></span>
									</div>
									<div class="term-length">${terms[2]} ${modalTranslations[this.language].termLength}</div>
								</div>
									<div class="plan-details">
										<div class="adjusted-total">${modalTranslations[this.language].adjustedTotal} <span>${currency + this.formatAdjustedTotal(priceString, this.parseMode, terms[2], this.bestAPR)}</span></div>
										<div class="interest-amount">${modalTranslations[this.language].interest} <span>${currency + this.formatTotalInterest(priceString, this.parseMode, terms[2], this.bestAPR)}</span></div>
										<div class="sample-apr">
											<span aria-label="${modalTranslations[this.language].readApr} ${this.bestAPR} ${modalTranslations[this.language].percent}">
											<span aria-hidden="true">${modalTranslations[this.language].sampleApr}</span><span aria-hidden="true">${this.bestAPR}%</span></span>
										</div>
									</div>
								</div>
								<div class="sezzle-lt-payment-options ${terms[1]}-month">
									<div class="plan">
										<div class="monthly-amount">
											<span>${currency + this.formatMonthly(priceString, this.parseMode, terms[1], this.bestAPR)}</span>
											<span aria-label="${modalTranslations[this.language].perMonth}"><span class="per-month" aria-hidden="true">${modalTranslations[this.language].monthlyAmount}<sup>*</sup></span></span>
										</div>
										<div class="term-length">${terms[1]} ${modalTranslations[this.language].termLength}</div>
									</div>
									<div class="plan-details">
										<div class="adjusted-total">${modalTranslations[this.language].adjustedTotal} <span>${currency + this.formatAdjustedTotal(priceString, this.parseMode, terms[1], this.bestAPR)}</span></div>
										<div class="interest-amount">${modalTranslations[this.language].interest} <span>${currency + this.formatTotalInterest(priceString, this.parseMode, terms[1], this.bestAPR)}</span></div>
										<div class="sample-apr">
											<span aria-label="${modalTranslations[this.language].readApr} ${this.bestAPR} ${modalTranslations[this.language].percent}">
											<span aria-hidden="true">${modalTranslations[this.language].sampleApr}</span><span aria-hidden="true">${this.bestAPR}%</span></span>
										</div>
									</div>
								</div>
								<div class="sezzle-lt-payment-options ${terms[0]}-month">
									<div class="plan">
										<div class="monthly-amount">
											<span>${currency + this.formatMonthly(priceString, this.parseMode, terms[0], this.bestAPR)}</span>
											<span aria-label="${modalTranslations[this.language].perMonth}"><span class="per-month" aria-hidden="true">${modalTranslations[this.language].monthlyAmount}<sup>*</sup></span></span>
										</div>
										<div class="term-length">${terms[0]} ${modalTranslations[this.language].termLength}</div>
									</div>
									<div class="plan-details">
										<div class="adjusted-total">${modalTranslations[this.language].adjustedTotal} <span>${currency + this.formatAdjustedTotal(priceString, this.parseMode, terms[0], this.bestAPR)}</span></div>
										<div class="interest-amount">${modalTranslations[this.language].interest} <span>${currency + this.formatTotalInterest(priceString, this.parseMode, terms[0], this.bestAPR)}</span></div>
										<div class="sample-apr">
											<span aria-label="${modalTranslations[this.language].readApr} ${this.bestAPR} ${modalTranslations[this.language].percent}">
											<span aria-hidden="true">${modalTranslations[this.language].sampleApr}</span><span aria-hidden="true">${this.bestAPR}%</span></span>
										</div>
									</div>
								</div>
							</div>
							<div class="details">${modalTranslations[this.language].singleFeatureAffordable}</div>
							<div class="details">${modalTranslations[this.language].singleFeaturePrequalify}</div>
							<div class="details">${modalTranslations[this.language].singleFeatureTrusted}</div>
							<div class="terms">
								<p>${modalTranslations[this.language].termsLt1}</p>
								<p>${modalTranslations[this.language].termsLt2}</p>
								<p>${modalTranslations[this.language].termsLt3}</p>
							</div>
						</div>
					</div>
				</div>`;
				}
			} else if (this.altModalHTML) {
				modalNode.innerHTML = this.altModalHTML;
			} else {
				modalNode.innerHTML = `
        <div id="sezzle-modal-container" role="dialog" aria-label="Sezzle Modal" aria-description="Learn more about Sezzle" class="sezzle-checkout-modal-hidden">
		<div class="sezzle-modal">
				<div><button role="button" aria-label="${modalTranslations[this.language].closeSezzleModal}" class="close-sezzle-modal"></button></div>
				<div class="sezzle-logo" title="Sezzle"></div>
				<div id="sezzle-modal-core-content" class="sezzle-modal-content">
					<header class="sezzle-header">${modalTranslations[this.language].sezzleHeader}
					</header>
        			<p class="sezzle-row">
						${modalTranslations[this.language].sezzleHeaderChild}
					</p>
        		<div class="sezzle-four-pay">
            		<p class="sezzle-row">
						${modalTranslations[this.language].sezzleRowChild}
					</p>
					<div class="sezzle-pie-area">
						<div class="due-today">
							<div class="payment-item">
								<div title="${modalTranslations[this.language].pieAlt} 25%">
									<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20ZM10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20Z" fill="#8333D4" fill-opacity="0.05"/>
										<path d="M20 -7.62939e-05C22.6264 -7.64088e-05 25.2272 0.51724 27.6537 1.52233C30.0802 2.52743 32.285 4.00062 34.1421 5.85779C35.9993 7.71496 37.4725 9.91974 38.4776 12.3463C39.4827 14.7728 40 17.3735 40 19.9999L30 19.9999C30 18.6867 29.7413 17.3863 29.2388 16.1731C28.7362 14.9598 27.9997 13.8574 27.0711 12.9289C26.1425 12.0003 25.0401 11.2637 23.8268 10.7611C22.6136 10.2586 21.3132 9.99992 20 9.99992L20 -7.62939e-05Z" fill="#8333D4"/>
										<path d="M40 19.9999C40 22.7613 37.7614 24.9998 35 24.9998C32.2386 24.9998 30 22.7613 30 19.9999C30 17.2385 32.2386 14.9998 35 14.9998C37.7614 14.9998 40 17.2385 40 19.9999Z" fill="#8333D4"/>
										<circle cx="35" cy="20" r="5" fill="#8333D4"/>
									</svg>
								</div>
								<p class="breakdown-row">
									<span class="percentage">25%</span>
									<span class="due">${modalTranslations[this.language].today}</span>
								</p>
							</div>
						</div>
						<div class="future-payments">
							<div class="payment-item">
								<div title="${modalTranslations[this.language].pieAlt} 50%">
									<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20ZM10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20Z" fill="#8333D4" fill-opacity="0.05"/>
										<path fill-rule="evenodd" clip-rule="evenodd" d="M40 20C40 31.0457 31.0457 40 20 40C17.2386 40 15 37.7614 15 35C15 32.2386 17.2386 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10V0C31.0457 0 40 8.9543 40 20Z" fill="#8333D4"/>
									</svg>
								</div>
								<p class="breakdown-row">
									<span class="percentage">25%</span>
									<span class="due">${modalTranslations[this.language].week} 2</span>
								</p>
							</div>
							<div class="payment-item">
								<div title="${modalTranslations[this.language].pieAlt} 75%">
									<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20ZM10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20Z" fill="#8333D4" fill-opacity="0.05"/>
										<path d="M20 -8.74228e-07C23.9556 -1.04713e-06 27.8224 1.17298 31.1114 3.37061C34.4004 5.56824 36.9638 8.69181 38.4776 12.3463C39.9913 16.0009 40.3874 20.0222 39.6157 23.9018C38.844 27.7814 36.9392 31.3451 34.1421 34.1421C31.3451 36.9392 27.7814 38.844 23.9018 39.6157C20.0222 40.3874 16.0009 39.9913 12.3463 38.4776C8.69181 36.9638 5.56824 34.4004 3.37061 31.1114C1.17298 27.8224 -7.48492e-07 23.9556 -8.74228e-07 20L10 20C10 21.9778 10.5865 23.9112 11.6853 25.5557C12.7841 27.2002 14.3459 28.4819 16.1732 29.2388C18.0004 29.9957 20.0111 30.1937 21.9509 29.8079C23.8907 29.422 25.6725 28.4696 27.0711 27.0711C28.4696 25.6725 29.422 23.8907 29.8079 21.9509C30.1937 20.0111 29.9957 18.0004 29.2388 16.1732C28.4819 14.3459 27.2002 12.7841 25.5557 11.6853C23.9112 10.5865 21.9778 10 20 10L20 -8.74228e-07Z" fill="#8333D4"/>
										<path d="M10 20C10 22.7614 7.76142 25 5 25C2.23858 25 -8.74228e-07 22.7614 -8.74228e-07 20C-8.74228e-07 17.2386 2.23858 15 5 15C7.76142 15 10 17.2386 10 20Z" fill="#8333D4"/>
										<circle cx="5" cy="20" r="5" fill="#8333D4"/>
									</svg>
								</div>
								<p class="breakdown-row">
									<span class="percentage">25%</span>
									<span class="due">${modalTranslations[this.language].week} 4</span>
								</p>
							</div>
							<div class="payment-item">
								<div title="${modalTranslations[this.language].pieAlt} 100%">
									<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20ZM10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20Z" fill="#8333D4"/>
									</svg>
								</div>
								<p class="breakdown-row">
									<span class="percentage">25%</span>
									<span class="due">${modalTranslations[this.language].week} 6</span>
								</p>
							</div>
						</div>
					</div>
				</div>
						<div class="sezzle-features">
           					<p class="single-feature">
								${modalTranslations[this.language].singleFeatureCredit}
							</p>
            				<p class="single-feature">
								${modalTranslations[this.language].singleFeatureOptions}
							</p>
							<p class="single-feature">
								${modalTranslations[this.language].singleFeatureCreditBuilding}
							</p>
        				</div>
        			<p class="terms">${modalTranslations[this.language].terms1}</p>
        			<p class="terms">${modalTranslations[this.language].terms2}</p>
				</div>
			</div>
		</div>`;
			}
			document.getElementsByTagName('html')[0].appendChild(modalNode);
		} else {
			modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
		}
		Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
			el.addEventListener('click', function () {
				modalNode.style.display = 'none';
				modalNode.getElementsByClassName('sezzle-modal')[0].className = `sezzle-modal sezzle-modal${this.modalTheme === "grayscale" ? "-grayscale" : "-color"} sezzle-checkout-modal-hidden`;
				var newFocus = document.querySelector('#sezzle-modal-return');
				if (newFocus) {
					newFocus.focus();
					newFocus.removeAttribute('id');
				} else if (document.querySelector('.sezzle-checkout-button-wrapper').querySelector('.sezzle-info-icon')) {
					document.querySelector('.sezzle-checkout-button-wrapper').querySelector('.sezzle-info-icon').focus();
				} else {
					document.querySelector('.sezzle-checkout-button-wrapper').focus();
				}
			});
		});
		let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
		if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0];
		sezzleModal.addEventListener('click', function (event) {
			event.stopPropagation();
		});
		this.modalKeyboardNavigation();
	}

	renderAPModal() {
		var modalNode = document.createElement('section');
		modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-ap-modal';
		modalNode.style = 'position: center';
		modalNode.style.display = 'none';
		modalNode.role = 'dialog';
		modalNode.ariaLabel = 'Afterpay Information';
		modalNode.ariaDescription = 'Click to learn more about Afterpay';
		modalNode.innerHTML = this.apModalHTML;
		document.getElementsByTagName('html')[0].appendChild(modalNode);
		Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
			el.addEventListener('click', function () {
				modalNode.style.display = 'none';
				var newFocus = document.querySelector('#sezzle-modal-return');
				if (newFocus) {
					newFocus.focus();
					newFocus.removeAttribute('id');
				} else if (document.querySelector((`.ap-modal-info-link`))) {
					document.querySelector('.sezzle-checkout-button-wrapper').getElementsByClassName(`ap-modal-info-link`)[0].focus();
				} else {
					document.querySelector('.sezzle-checkout-button-wrapper').focus();
				}
			});
		});
		let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
		if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0];
		sezzleModal.addEventListener('click', function (event) {
			event.stopPropagation();
		});
	}

	renderQPModal() {
		var modalNode = document.createElement('section');
		modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-qp-modal';
		modalNode.style = 'position: center';
		modalNode.style.display = 'none';
		modalNode.role = 'dialog';
		modalNode.ariaLabel = 'Quadpay Information';
		modalNode.ariaDescription = 'Click to learn more about Quadpay';
		modalNode.innerHTML = this.qpModalHTML;
		document.getElementsByTagName('html')[0].appendChild(modalNode);
		Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
			el.addEventListener('click', function () {
				modalNode.style.display = 'none';
				var newFocus = document.querySelector('#sezzle-modal-return');
				if (newFocus) {
					newFocus.focus();
					newFocus.removeAttribute('id');
				} else if (document.querySelector((`.qp-modal-info-link`))) {
					document.querySelector('.sezzle-checkout-button-wrapper').getElementsByClassName(`qp-modal-info-link`)[0].focus();
				} else {
					document.querySelector('.sezzle-checkout-button-wrapper').focus();
				}
			});
		});
		let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
		if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0];
		sezzleModal.addEventListener('click', function (event) {
			event.stopPropagation();
		});
	}

	renderAffirmModal() {
		var modalNode = document.createElement('section');
		modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-affirm-modal';
		modalNode.style = 'position: center';
		modalNode.style.display = 'none';
		modalNode.role = 'dialog';
		modalNode.ariaLabel = 'Affirm Information';
		modalNode.ariaDescription = 'Click to learn more about Affirm';
		modalNode.innerHTML = this.affirmModalHTML;
		document.getElementsByTagName('html')[0].appendChild(modalNode);
		Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
			el.addEventListener('click', function () {
				modalNode.style.display = 'none';
				var newFocus = document.querySelector('#sezzle-modal-return');
				if (newFocus) {
					newFocus.focus();
					newFocus.removeAttribute('id');
				} else if (document.querySelector((`.affirm-modal-info-link`))) {
					document.querySelector('.sezzle-checkout-button-wrapper').getElementsByClassName(`affirm-modal-info-link`)[0].focus();
				} else {
					document.querySelector('.sezzle-checkout-button-wrapper').focus();
				}
			});
		});
		let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
		if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0];
		sezzleModal.addEventListener('click', function (event) {
			event.stopPropagation();
		});
	}

	renderKlarnaModal() {
		var modalNode = document.createElement('section');
		modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-klarna-modal';
		modalNode.style = 'position: center';
		modalNode.style.display = 'none';
		modalNode.role = 'dialog';
		modalNode.ariaLabel = 'Klarna Information';
		modalNode.ariaDescription = 'Click to learn more about Klarna';
		modalNode.innerHTML = this.klarnaModalHTML;
		document.getElementsByTagName('html')[0].appendChild(modalNode);
		Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), function (el) {
			el.addEventListener('click', function () {
				modalNode.style.display = 'none';
				var newFocus = document.querySelector('#sezzle-modal-return');
				if (newFocus) {
					newFocus.focus();
					newFocus.removeAttribute('id');
				} else if (document.querySelector((`.klarna-modal-info-link`))) {
					document.querySelector('.sezzle-checkout-button-wrapper').getElementsByClassName(`klarna-modal-info-link`)[0].focus();
				} else {
					document.querySelector('.sezzle-checkout-button-wrapper').focus();
				}
			});
		});
		let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
		if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0];
		sezzleModal.addEventListener('click', function (event) {
			event.stopPropagation();
		});
	}

	renderModalByfunction() {
		var modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
		modalNode.style.display = 'block';
		modalNode.getElementsByClassName('sezzle-modal')[0].className = `sezzle-modal sezzle-modal${this.modalTheme === "grayscale" ? "-grayscale" : "-color"}`;
	}

	addClickEventForModal(sezzleElement) {
		var modalLinks = document.getElementsByClassName('sezzle-modal-link');
		Array.prototype.forEach.call(modalLinks, function (modalLink) {
			modalLink.addEventListener('click', function (event) {
				event.preventDefault();
				if (!event.target.classList.contains('no-sezzle-info')) {
					var modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
					modalNode.style.display = 'block';
					modalNode.getElementsByClassName('close-sezzle-modal')[0].focus();
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
				event.target.id = 'sezzle-modal-return';
			}.bind(this));
		}.bind(this));
		var qpModalLinks = sezzleElement.getElementsByClassName('quadpay-modal-info-link');
		Array.prototype.forEach.call(qpModalLinks, function (modalLink) {
			modalLink.addEventListener('click', function (event) {
				document.getElementsByClassName('sezzle-qp-modal')[0].style.display = 'block';
				document.getElementsByClassName('sezzle-qp-modal')[0].focus();
				event.target.id = 'sezzle-modal-return';
			}.bind(this));
		}.bind(this));
		var affirmModalLinks = sezzleElement.getElementsByClassName('affirm-modal-info-link');
		Array.prototype.forEach.call(affirmModalLinks, function (modalLink) {
			modalLink.addEventListener('click', function (event) {
				document.getElementsByClassName('sezzle-affirm-modal')[0].style.display = 'block';
				document.getElementsByClassName('sezzle-affirm-modal')[0].focus();
				event.target.id = 'sezzle-modal-return';
			}.bind(this));
		}.bind(this));
		var klarnaModalLinks = sezzleElement.getElementsByClassName('klarna-modal-info-link');
		Array.prototype.forEach.call(klarnaModalLinks, function (modalLink) {
			modalLink.addEventListener('click', function (event) {
				document.getElementsByClassName('sezzle-klarna-modal')[0].style.display = 'block';
				document.getElementsByClassName('sezzle-klarna-modal')[0].focus();
				event.target.id = 'sezzle-modal-return';
			}.bind(this));
		}.bind(this));
	}

	isMobileBrowser() {
		return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4));
	}

	init() {
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
			this.renderElementArray.forEach(function (el, index) {
				els.push({
					element: document.getElementById(el),
				});
			})
			els.forEach(function (el, index) {
				if (!el.element.childElementCount) {
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