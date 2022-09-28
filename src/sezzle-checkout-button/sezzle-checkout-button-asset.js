class SezzleCheckoutButton {

	constructor(options) {
		this.theme = options.theme || 'light';
		this.template = options.template || 'Checkout with %%logo%%';
		this.eventLogger = new EventLogger({
			merchantUUID: options.merchantUUID,
			widgetServerBaseUrl: options.widgetServerBaseUrl
		});
		this.defaultPlacement = (typeof options.defaultPlacement === 'undefined') ? true : (options.defaultPlacement === 'true');
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
				font-family: "Comfortaa", cursive;
				background-position: center;
				transition: background 0.8s;
				border: none;
				vertical-align: middle;
				text-align: center;
				display: block;
				min-width: fit-content;
				text-decoration: none;
				padding: 9px;
			}
			.sezzle-button-light {
				background-color: #392558;
				color: white;
			}
			.sezzle-button-light:hover, .sezzle-button-light:focus {
				background-color: #d784ff;
				color: white;
			}
			.sezzle-button-light:active {
				background-color: purple;
				color: white;
			}
			.sezzle-button-dark {
				background-color: #fff;
				color: #392558;
			}
			.sezzle-button-dark:hover, .sezzle-button-dark:focus {
				background-color: #eee;
				color: #392558;
			}
			.sezzle-button-dark:active {
				background-color: #ccc;
				color: #392558;
			}
			.sezzle-checkout-button .sezzle-button-logo-img {
				width: 70px;
				position: relative;
				top: -2px;
				vertical-align: middle;
			}
		`;
		document.head.appendChild(sezzleButtonStyle);
	}

	matchStyle(pageStyle, sezzleButton) {
		sezzleButton.style.fontSize = pageStyle.fontSize;
		sezzleButton.style.width = pageStyle.width;
		sezzleButton.style.margin = pageStyle.margin;
		sezzleButton.style.borderRadius = pageStyle.borderRadius;
	}

	inheritButtonStyles(sezzleCheckoutButton) {
		const shopifyButton = document.querySelector('[name="checkout"]');
		const apmContainer = document.querySelector('.additional-checkout-buttons');
		const apmButtonStyle = apmContainer && apmContainer.querySelector('[role="button"]') ? getComputedStyle(apmContainer.querySelector('[role="button"]')) : null;
		if (apmButtonStyle) {
			this.matchStyle(apmButtonStyle, sezzleCheckoutButton);
		} else if (shopifyButton) {
			this.matchStyle(getComputedStyle(shopifyButton), sezzleCheckoutButton);
		} else {
			const defaultStyle = {
				fontSize: "15px",
				width: "auto",
				margin: "0px",
				borderRadius: "0px",
			}
			this.matchStyle(defaultStyle, sezzleCheckoutButton);
		}
	}

	handleSezzleClick() {
		location.replace("/checkout?skip_shopify_pay=true");
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
			location.replace('/checkout?skip_shopify_pay=true');
		}.bind(this));
		this.addButtonStyle();
		this.inheritButtonStyles(sezzleCheckoutButton);
		return sezzleCheckoutButton;
	}

	createButton() {
		const sezzleCheckoutButton = this.getButton();
		// Shopify app blocks allows merchants to place widgets as per their wish.
		// If merchant doesn't want default placement, container is created in theme
		// app extension and the checkout button is rendered inside that container.
		if (!this.defaultPlacement) {
			const customPlaceholder = document.querySelector('#sezzle-checkout-button-container');
			customPlaceholder.append(sezzleCheckoutButton);
			return;
		}
		const checkoutButtons = document.getElementsByClassName('additional-checkout-buttons').length ? document.getElementsByClassName('additional-checkout-buttons') : document.getElementsByName('checkout');
		for (let i = 0; i < checkoutButtons.length; i++) {
			const checkoutButtonParent = checkoutButtons[i].parentElement ? checkoutButtons[i].parentElement : checkoutButtons[i];
			if (checkoutButtonParent && !checkoutButtonParent.querySelector('.sezzle-checkout-button')) {
				checkoutButtonParent.append(sezzleCheckoutButton);
			}
		}
	}

	init() {
		try {
			this.createButton();
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
