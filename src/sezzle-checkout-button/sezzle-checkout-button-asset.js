class SezzleCheckoutButton {

	constructor(options) {
		this.defaultTemplate = {
			Checkout: {
				en: 'Checkout with %%logo%%',
				fr: 'Achetez avec %%logo%%',
				es: 'Compra con %%logo%%'
			},
			Pay: {
				en: 'Pay with %%logo%%',
				fr: 'Payez avec %%logo%%',
				es: 'Paga con %%logo%%'
			},
			'%%logo%%': {
				en: '%%logo%%',
				fr: '%%logo%%',
				es: '%%logo%%'
			}
		}
		this.theme = options.theme === 'dark' ? 'dark' : 'light';
		this.template = this.getTranslation(options.template);
		this.eventLogger = new EventLogger({
			merchantUUID: options.merchantUUID,
			widgetServerBaseUrl: options.widgetServerBaseUrl || "https://widget.sezzle.com"
		});
		this.cartTotal = options.cartTotal;
		this.defaultPlacement = (typeof options.defaultPlacement === 'undefined') ? true : (options.defaultPlacement === 'true');
	}

	getTranslation(template) {
		let templateToGet = typeof template === "string" && this.defaultTemplate[template.split(" ")[0]] ? template.split(" ")[0] : "Checkout";
		let languageToGet = this.defaultTemplate[templateToGet][document.documentElement.lang] ? document.documentElement.lang : "en";
		return this.defaultTemplate[templateToGet][languageToGet];
	}

	parseButtonTemplate() {
		const sezzleImage = {
			light: 'https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor_WhiteWM.svg',
			dark: 'https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg'
		};
		const chosenImage = sezzleImage[this.theme] || sezzleImage.light;
		const templateString = this.template.replace('%%logo%%', `<img class='sezzle-button-logo-img' alt='Sezzle' src=${chosenImage} />`);
		return templateString;
	}

	addButtonStyle() {
		const sezzleButtonStyle = document.createElement('style');
		sezzleButtonStyle.innerHTML = `
			@import url(https://fonts.googleapis.com/css?family=Comfortaa);
			.sezzle-checkout-button {
				cursor: pointer;
				font-family: "Comfortaa", cursive !important;
				border: none;
				text-align: center;
				display: inline-block;
				min-width: fit-content;
				width: auto;
				text-decoration: none;
				text-transform: none;
				padding: 9px;
				font-size: 15px;
				line-height: 29px;
				justify-content: center;
			}
			.sezzle-button-light {
				background-color: #392558 !important;
				color: white !important;
			}
			.sezzle-button-light:hover, .sezzle-button-light:focus {
				background-color: #d784ff !important;
			}
			.sezzle-button-light:active {
				background-color: purple !important;
			}
			.sezzle-button-dark {
				background-color: #fff !important;
				color: #392558 !important;
			}
			.sezzle-button-dark:hover, .sezzle-button-dark:focus {
				background-color: #eee !important;
			}
			.sezzle-button-dark:active {
				background-color: #ccc !important;
			}
			.sezzle-checkout-button .sezzle-button-logo-img {
				width: 72px;
				height: 18px;
				position: relative;
				top: -2px;
				vertical-align: middle;
				display: inline;
				margin: 0px 2px;
			}
			#minPriceDiv {
             font-size: 12px;
            }
		`;
		document.head.appendChild(sezzleButtonStyle);
	}

	matchStyle(pageStyle, sezzleButton) {
		sezzleButton.style.display = pageStyle.display === "block" ? "block" : "inline-block";
		sezzleButton.style.width = pageStyle.width;
		sezzleButton.style.margin = pageStyle.margin;
		sezzleButton.style.borderRadius = pageStyle.borderRadius;
	}

	handleSezzleClick() {
		location.replace("/checkout?shop_pay_checkout_as_guest=true");
	}

	getMinPriceText(minPrice) {
		const minPriceText = document.createElement('div');
		minPriceText.id = `minPriceDiv`;
		if (document.documentElement.lang === "fr") {
			minPriceText.innerHTML = "pour les achats de plus de $" + minPrice / 100;
		} else if (document.documentElement.lang === "es") {
			minPriceText.innerHTML = "para compras de más de $" + minPrice / 100;
		} else {
			minPriceText.innerHTML = "on orders above $" + minPrice / 100;
		}
		minPriceText.style.display = "block";
		return minPriceText;
	}

	checkMinPrice(sezzleCheckoutButton) {
		const minPrice = document.sezzleConfig && document.sezzleConfig.minPrice || 0;
		if (this.cartTotal && this.cartTotal < minPrice) {
			const minPriceText = this.getMinPriceText(minPrice);
			sezzleCheckoutButton.append(minPriceText);
		}
	}

	getButton() {
		const sezzleCheckoutButton = document.createElement('a');
		sezzleCheckoutButton.className = `sezzle-checkout-button sezzle-button-${this.theme === 'dark' ? 'dark' : 'light'}`;
		sezzleCheckoutButton.innerHTML = this.parseButtonTemplate();
		sezzleCheckoutButton.href = "javascript:handleSezzleClick()"
		sezzleCheckoutButton.addEventListener('click', function (e) {
			this.eventLogger.sendEvent('checkout-button-onclick');
			e.stopPropagation();
			e.preventDefault();
			location.replace('/checkout?shop_pay_checkout_as_guest=true');
		}.bind(this));
		this.addButtonStyle();
		this.checkMinPrice(sezzleCheckoutButton);
		return sezzleCheckoutButton;
	}

	renderUnderAPM(apmContainer) {
		let apmStyles = getComputedStyle(apmContainer);
		if (apmContainer && apmStyles.display !== 'none' && apmStyles.visibility === 'visible' && !apmContainer.querySelector('.sezzle-checkout-button')) {
			let sezzleCheckoutButton = this.getButton();
			apmContainer.appendChild(sezzleCheckoutButton);
			this.matchStyle(getComputedStyle(apmContainer.querySelector('[role="button"]')), sezzleCheckoutButton)
		}
	}

	renderUnderButton(checkoutButton) {
		let sezzleCheckoutButton = this.getButton();
		let checkoutButtonParent = checkoutButton.parentElement ? checkoutButton.parentElement : checkoutButton;
		if (!checkoutButtonParent.querySelector('.sezzle-checkout-button')) {
			checkoutButton.nextElementSibling ? checkoutButtonParent.insertBefore(sezzleCheckoutButton, checkoutButton.nextElementSibling) : checkoutButtonParent.append(sezzleCheckoutButton);
			console.log('Sezzle button rendered')
			this.matchStyle(getComputedStyle(checkoutButton), sezzleCheckoutButton)
		}
	}

	createButton() {
		const maxPrice = document.longTermPaymentConfig && document.longTermPaymentConfig.maxPrice || document.sezzleConfig && document.sezzleConfig.maxPrice || 250000;
		if (this.cartTotal && this.cartTotal > maxPrice) {
			return;
		}
		// Shopify app blocks allows merchants to place widgets as per their wish.
		// If merchant doesn't want default placement, container is created in theme
		// app extension and the checkout button is rendered inside that container.
		if (!this.defaultPlacement) {
			let sezzleCheckoutButton = this.getButton();
			const customPlaceholder = document.querySelector('#sezzle-checkout-button-container');
			customPlaceholder.append(sezzleCheckoutButton);
			this.matchStyle({ display: "inline-block", width: "fit-content", margin: "0px auto", borderRadius: "0px" }, sezzleCheckoutButton)
			return;
		}
		const apmContainers = document.getElementsByClassName('additional-checkout-buttons');
		for (let i = 0; i < apmContainers.length; i++) {
			this.renderUnderAPM(apmContainers[i]);
		}
		if (document.querySelector('.sezzle-checkout-button')) {
			return;
		}
		const checkoutButtons = document.getElementsByName('checkout');
		for (let i = 0; i < checkoutButtons.length; i++) {
			this.renderUnderButton(checkoutButtons[i]);
		}
		if (!document.querySelector('.sezzle-checkout-button')) {
			console.log('Sezzle checkout button could not be rendered: Shopify checkout button not found.')
		}
	}

	init() {
		try {
			this.createButton()
			this.eventLogger.sendEvent("checkout-button-onload");
		} catch (e) {
			this.eventLogger.sendEvent("checkout-button-error", e.message);
		}
	}
}

class EventLogger {
	constructor(options) {
		this.merchantUUID = options.merchantUUID || '';
		this.widgetServerEventLogEndpoint = options.widgetServerBaseUrl ? `${options.widgetServerBaseUrl}/v1/event/log` : 'https://widget.sezzle.com/v1/event/log';
	}

	sendEvent(eventName, description = "") {
		const body = [{
			event_name: eventName,
			description: description,
			merchant_uuid: this.merchantUUID,
			merchant_site: window.location.hostname,
		}];
		this.httpRequestWrapper('POST', this.widgetServerEventLogEndpoint, body);
	};

	async httpRequestWrapper(method, url, body = null) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open(method, url, true);
			if (body !== null) {
				xhr.setRequestHeader('Content-Type', 'application/json');
			}
			xhr.onload = function () {
				if (this.status >= 200 && this.status < 300) {
					resolve(xhr.response);
				} else {
					reject(new Error('Something went wrong, contact the Sezzle team!'));
				}
			};
			xhr.onerror = function () {
				reject(new Error('Something went wrong, contact the Sezzle team!'));
			};
			body === null ? xhr.send() : xhr.send(JSON.stringify(body));
		}).catch(function (e) {
			console.log(e.message);
		});
	}
}

export default SezzleCheckoutButton;
