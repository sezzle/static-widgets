import "./style.scss";
import enTranslations from './translations/en.json'
import frTranslations from './translations/fr.json'
import esTranslations from './translations/es.json'

class SezzleCheckoutButton {
    constructor(options) {
        this.defaultTemplate = {
            en: enTranslations,
            es: esTranslations,
            fr: frTranslations,
        };
        this.theme = options.theme === "dark" ? "dark" : "light";
        this.language = this.defaultTemplate[document.documentElement.lang]
            ? document.documentElement.lang
            : "en";
        this.translation = this.defaultTemplate[this.language];
        this.template = this.getTranslation(options.template);
        this.eventLogger = new EventLogger({
            merchantUUID: options.merchantUUID,
            widgetServerBaseUrl:
                options.widgetServerBaseUrl || "https://widget.sezzle.com",
        });
        this.cartTotal = options.cartTotal;
        this.defaultPlacement =
            typeof options.defaultPlacement === "undefined"
                ? true
                : options.defaultPlacement === "true";
    }

    getTranslation(template) {
        const templateToGet =
            typeof template === "string" && template.split(" ")[0] === "Pay"
                ? "Pay"
                : "Checkout";
        return this.translation[templateToGet];
    }

    exceedsMaxPrice() {
        const maxPrice =
            document.longTermPaymentConfig?.maxPrice ||
            document.sezzleConfig?.maxPrice ||
            250000;
        return this.cartTotal && this.cartTotal > maxPrice;
    }

    parseButtonTemplate() {
        const sezzleImage = {
            light: "https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor_WhiteWM.svg",
            dark: "https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg",
        };
        const chosenImage = sezzleImage[this.theme];
        const templateString = this.template.replace(
            "%%logo%%",
            `<img class='sezzle-button-logo-img' alt='Sezzle' src=${chosenImage} />`
        );
        return templateString;
    }

    matchStyle(pageStyle) {
        const sezzleButtonStyle = document.createElement("style");
        sezzleButtonStyle.innerHTML = `
			.sezzle-checkout-button {
				display: ${pageStyle?.display === "block" ? "block" : "inline-block"};
				width: ${pageStyle.width || "fit-content"};
				margin: ${pageStyle.margin || "0px auto"};
				border-radius: ${pageStyle.borderRadius || "0px"};
			}
		`;
        document.head.appendChild(sezzleButtonStyle);
    }

    getMinPriceText(minPrice) {
        const minPriceText = document.createElement("div");
        minPriceText.className = `min-price`;
        minPriceText.innerHTML = this.translation.minPrice + minPrice / 100;
        minPriceText.style.display = "block";
        return minPriceText;
    }

    checkMinPrice(sezzleCheckoutButton) {
        const minPrice = document.sezzleConfig?.minPrice || 0;
        if (this.cartTotal && this.cartTotal < minPrice) {
            const minPriceText = this.getMinPriceText(minPrice);
            sezzleCheckoutButton.append(minPriceText);
        }
    }

    getButton() {
        const sezzleCheckoutButton = document.createElement("a");
        sezzleCheckoutButton.className = `sezzle-checkout-button sezzle-button-${this.theme}`;
        sezzleCheckoutButton.innerHTML = this.parseButtonTemplate();
        sezzleCheckoutButton.href = "";
        sezzleCheckoutButton.addEventListener(
            "click",
            function (e) {
                this.eventLogger.sendEvent("checkout-button-onclick");
                e.stopPropagation();
                e.preventDefault();
                try {
                    if (
                        document.querySelector(
                            ".sezzle-checkout-button-modal-overlay"
                        )
                    ) {
                        document.querySelector(
                            ".sezzle-checkout-button-modal-overlay"
                        ).style.display = "block";
                    } else {
                        this.renderModal();
                    }
                    this.eventLogger.sendEvent(
                        "checkout-button-modal-onload"
                    );
                } catch (e) {
                    this.eventLogger.sendEvent(
                        "checkout-button-modal-error",
                        e.message
                    );
                    location.assign(
                        "/checkout?shop_pay_logout=true&skip_shop_pay=true&shop_pay_checkout_as_guest=true"
                    );
                }
            }.bind(this)
        );
        this.checkMinPrice(sezzleCheckoutButton);
        return sezzleCheckoutButton;
    }

    renderUnderAPM(apmContainer) {
        const apmStyles = getComputedStyle(apmContainer);
        if (
            apmStyles.display !== "none" &&
            apmStyles.visibility === "visible" &&
            !apmContainer?.querySelector(".sezzle-checkout-button")
        ) {
            const sezzleCheckoutButton = this.getButton();
            const apmFirstChild = apmContainer.querySelector('[role="button"]');
            this.matchStyle(
                apmFirstChild
                    ? getComputedStyle(apmFirstChild)
                    : {
                          display: "inline-block",
                          width: "100%",
                          margin: "10px auto",
                          borderRadius: "4px",
                      }
            );
            apmContainer.appendChild(sezzleCheckoutButton);
        }
    }

    renderUnderButton(checkoutButton) {
        const checkoutButtonStyles = getComputedStyle(checkoutButton);
        let checkoutButtonParent = checkoutButton.parentElement
            ? checkoutButton.parentElement
            : checkoutButton;
        if (
            checkoutButtonStyles.display !== "none" &&
            !checkoutButtonParent.querySelector(".sezzle-checkout-button")
        ) {
            const sezzleCheckoutButton = this.getButton();
            this.matchStyle(getComputedStyle(checkoutButton));
            checkoutButton.nextElementSibling
                ? checkoutButtonParent.insertBefore(
                      sezzleCheckoutButton,
                      checkoutButton.nextElementSibling
                  )
                : checkoutButtonParent.appendChild(sezzleCheckoutButton);
        }
    }

    createButton() {
        if (this.exceedsMaxPrice()) {
            return;
        }
        const containers = {
            customPlaceholder: document.querySelector(
                "#sezzle-checkout-button-container"
            ),
            apmContainers: document.getElementsByClassName(
                "additional-checkout-buttons"
            ),
            checkoutButtons: document.getElementsByName("checkout"),
        };
        if (containers.customPlaceholder && !this.defaultPlacement) {
            const sezzleCheckoutButton = this.getButton();
            this.matchStyle({});
            containers.customPlaceholder.append(sezzleCheckoutButton);
        } else if (containers.apmContainers.length) {
            for (let i = 0; i < containers.apmContainers.length; i++) {
                this.renderUnderAPM(containers.apmContainers[i]);
            }
        } else if (containers.checkoutButtons.length) {
            Array.prototype.slice
                .call(containers.checkoutButtons)
                .forEach((checkoutButton) => {
                    this.renderUnderButton(checkoutButton);
                });
        } else {
            console.log(
                "Sezzle checkout button could not be rendered: Shopify checkout button not found."
            );
        }
    }

    renderModal() {
        const sezzleButtonModal = document.createElement("div");
        sezzleButtonModal.className =
            "sezzle-checkout-button-modal-overlay sezzle-checkout-modal-close";
        sezzleButtonModal.innerHTML = `
                <div class="sezzle-checkout-button-modal">
				<button role="button" aria-label="${this.translation.closeSezzleModal}" class="sezzle-checkout-modal-close">
                    &#x2715;
                </button>
                <div class="sezzle-checkout-button-modal-content">
                    <h2 class="sezzle-checkout-button-modal-header">
                        ${this.translation.header}
                    </h2>
                    <div class="sezzle-checkout-button-modal-body">
                        <div class="sezzle-checkout-step">
                            <div alt="" class="sezzle-checkout-step-graphic">
                                <svg
                                    width="48"
                                    height="61"
                                    viewBox="0 0 48 61"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0.5 5C0.5 2.23858 2.73858 0 5.5 0H26.5C29.2614 0 31.5 2.23858 31.5 5V55C31.5 57.7614 29.2614 60 26.5 60H5.5C2.73858 60 0.5 57.7614 0.5 55V5Z"
                                        fill="#29D3A2"
                                    />
                                    <g clip-path="url(#clip0_195_11851)">
                                        <rect
                                            x="11.5"
                                            y="2"
                                            width="8"
                                            height="2"
                                            rx="1"
                                            fill="#00804A"
                                        />
                                    </g>
                                    <rect
                                        x="10.5"
                                        y="57"
                                        width="11"
                                        height="1"
                                        rx="0.5"
                                        fill="#00804A"
                                    />
                                    <rect
                                        x="5.75"
                                        y="22.25"
                                        width="20.7727"
                                        height="12.5"
                                        rx="2.75"
                                        fill="white"
                                        stroke="#E8E8E8"
                                        stroke-width="0.5"
                                    />
                                    <path
                                        d="M12.6944 30.3345C13.6203 31.2966 15.1212 31.2966 16.0471 30.3345L16.1358 30.2423C16.5985 29.7615 15.6726 27.2394 16.1358 26.7587L12.6944 30.3345Z"
                                        fill="url(#paint0_linear_195_11851)"
                                    />
                                    <path
                                        d="M16.2251 26.666L16.1364 26.7582C15.6737 27.2389 16.5991 29.761 16.1364 30.2418L19.5778 26.666C19.1146 26.1852 18.5083 25.9448 17.9015 25.9448C17.2946 25.9443 16.6878 26.1852 16.2251 26.666Z"
                                        fill="url(#paint1_linear_195_11851)"
                                    />
                                    <path
                                        d="M12.6944 26.8509C11.7685 27.8129 11.7685 29.3725 12.6944 30.3345L16.2256 26.6654C17.1515 25.7033 17.1515 24.1438 16.2256 23.1818L12.6944 26.8509Z"
                                        fill="url(#paint2_linear_195_11851)"
                                    />
                                    <path
                                        d="M16.0471 30.3345C15.1212 31.2966 15.1212 32.8561 16.0471 33.8181L19.5783 30.149C20.5042 29.187 20.5042 27.6275 19.5783 26.6654L16.0471 30.3345Z"
                                        fill="url(#paint3_linear_195_11851)"
                                    />
                                    <path
                                        d="M42.3531 44.6624C41.8458 41.2308 38.5172 37.6193 36.9698 36.0719L35.5161 34.6182C35.0941 34.1962 34.4834 33.9628 33.8722 33.9175C33.2138 33.9195 32.6486 34.2033 32.2241 34.6277C31.9883 34.8636 31.8466 35.0991 31.7517 35.3816C30.813 34.7259 29.5431 34.7766 28.6942 35.6256C28.3168 36.0029 28.1276 36.3796 28.0322 36.8502C27.1865 36.5705 26.2454 36.7613 25.5851 37.4216C25.3021 37.7046 25.1601 38.0342 25.018 38.3638L20.5164 33.8622C19.5785 32.9243 18.0736 32.9287 17.1303 33.872C16.187 34.8153 16.1827 36.3202 17.1205 37.258L25.5611 45.6986L23.1186 44.6711C22.2732 44.2973 21.238 44.4884 20.5306 45.1959C20.2948 45.4317 20.153 45.6673 20.0581 45.9497C19.5843 47.1738 20.0976 48.5361 21.2719 49.0501L28.6909 52.9789C28.9725 53.1662 30.9911 54.4301 32.9188 54.5656C32.9177 54.9418 33.011 55.2237 33.2923 55.5051L34.8867 57.0994C35.4025 57.6153 36.2021 57.5659 36.6738 57.0943L45.3992 48.3688C45.918 47.85 45.8733 47.0506 45.4044 46.5817L43.7632 44.9405C43.4352 44.5182 42.8711 44.4258 42.3531 44.6624ZM29.3526 51.8483L21.6985 47.8731C21.1819 47.6395 20.9016 46.9819 21.1383 46.4639C21.3749 45.9459 21.7032 46.2741 22.2198 46.5078L27.7042 48.6903C27.9861 48.7835 28.6107 48.1823 28.7997 47.8996C28.9886 47.6169 28.9425 47.2878 28.7081 47.0533L18.0167 36.3619C17.5946 35.9399 17.5965 35.2815 18.021 34.857C18.4455 34.4325 18.303 34.2775 18.7251 34.6995L25.9076 41.8821C26.1421 42.1166 26.8891 41.8385 27.1721 41.5555C27.4079 41.3197 27.4562 40.8963 27.1748 40.6149L26.4245 39.8647C26.0025 39.4426 26.0044 38.7842 26.4289 38.3597C26.8534 37.9353 27.2612 38.1839 27.6832 38.606L29.2307 40.1534C29.4651 40.3879 30.1388 40.1831 30.4218 39.9001C30.6576 39.6643 30.7059 39.2409 30.4245 38.9595L29.5336 38.0686C29.1115 37.6466 29.1135 36.9882 29.5379 36.5637C29.9624 36.1392 30.5373 36.2208 30.9593 36.6428L32.6005 38.2841C32.835 38.5185 33.3417 38.4808 33.6246 38.1978C33.9076 37.9148 33.9087 37.5386 33.6274 37.2572L32.8302 36.4601C32.7849 35.8488 33.2571 35.1891 33.8684 35.2343C34.1505 35.2335 34.4324 35.3268 34.6669 35.5612L36.1206 37.0149C39.4502 40.2502 41.3218 43.5367 41.1743 45.7475L33.7223 53.1995C32.2634 53.5329 30.0565 52.3636 29.3526 51.8483ZM44.5083 47.4778L35.83 56.1561L34.1887 54.5149L42.9142 45.7894L44.5554 47.4307L44.5083 47.4778Z"
                                        fill="#FCD7B6"
                                    />
                                    <path
                                        d="M33.2906 56.9898C32.3357 56.0349 32.3357 54.4866 33.2906 53.5316L42.1832 44.6391C43.1381 43.6841 44.6864 43.6841 45.6414 44.6391C46.5963 45.5941 46.5963 47.1423 45.6414 48.0973L36.7488 56.9898C35.7939 57.9448 34.2456 57.9448 33.2906 56.9898Z"
                                        fill="#FF8100"
                                    />
                                    <path
                                        d="M35.8787 36.737L35.976 36.8343C39.4323 40.1933 41.3796 43.6009 41.2335 45.8889L33.542 53.5804C32.0329 53.9211 29.7449 52.7041 29.0147 52.1687L28.966 52.12L21.0798 48.0308C20.5443 47.7874 20.2522 47.1059 20.4957 46.5704C20.7391 46.0349 21.4206 45.7428 21.9561 45.9862L27.603 48.3229C27.8951 48.4203 28.2358 48.3716 28.4306 48.0795C28.6253 47.7874 28.5766 47.4467 28.3332 47.2032L17.2341 36.1041C16.7959 35.666 16.7959 34.9845 17.2341 34.5463C17.6722 34.1082 18.3537 34.1082 18.7918 34.5463L25.7531 41.5076C25.9965 41.751 26.4347 41.7997 26.7267 41.5076C26.9701 41.2642 27.0188 40.8261 26.7267 40.534L25.9479 39.7551C25.5097 39.317 25.5097 38.6355 25.9479 38.1974C26.386 37.7592 27.0675 37.7592 27.5056 38.1974L29.1121 39.8038C29.3555 40.0472 29.7936 40.0959 30.0857 39.8038C30.3291 39.5604 30.3778 39.1223 30.0857 38.8302L29.1608 37.9053C28.7226 37.4672 28.7226 36.7856 29.1608 36.3475C29.5989 35.9094 30.2804 35.9094 30.7185 36.3475L32.4224 38.0513C32.6658 38.2947 33.1039 38.3434 33.396 38.0513C33.688 37.7592 33.688 37.3698 33.396 37.0777L32.5684 36.2501C32.5197 35.6173 33.0065 34.9358 33.6394 34.9845C33.9315 34.9845 34.2235 35.0818 34.4669 35.3252L35.8787 36.737Z"
                                        fill="#FCD7B6"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="paint0_linear_195_11851"
                                            x1="16.7993"
                                            y1="29.4381"
                                            x2="14.8221"
                                            y2="27.7438"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stop-color="#CE5DCB" />
                                            <stop
                                                offset="0.2095"
                                                stop-color="#C558CC"
                                            />
                                            <stop
                                                offset="0.5525"
                                                stop-color="#AC4ACF"
                                            />
                                            <stop
                                                offset="0.9845"
                                                stop-color="#8534D4"
                                            />
                                            <stop
                                                offset="1"
                                                stop-color="#8333D4"
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="paint1_linear_195_11851"
                                            x1="16.0028"
                                            y1="30.2416"
                                            x2="19.5777"
                                            y2="30.2416"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop
                                                offset="0.0237"
                                                stop-color="#FF5667"
                                            />
                                            <stop
                                                offset="0.6592"
                                                stop-color="#FC8B82"
                                            />
                                            <stop
                                                offset="1"
                                                stop-color="#FBA28E"
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="paint2_linear_195_11851"
                                            x1="11.9999"
                                            y1="30.3346"
                                            x2="16.92"
                                            y2="30.3346"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stop-color="#00B874" />
                                            <stop
                                                offset="0.5126"
                                                stop-color="#29D3A2"
                                            />
                                            <stop
                                                offset="0.6817"
                                                stop-color="#53DFB6"
                                            />
                                            <stop
                                                offset="1"
                                                stop-color="#9FF4D9"
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="paint3_linear_195_11851"
                                            x1="15.3525"
                                            y1="33.8182"
                                            x2="20.2726"
                                            y2="33.8182"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stop-color="#FCD77E" />
                                            <stop
                                                offset="0.5241"
                                                stop-color="#FEA500"
                                            />
                                            <stop
                                                offset="1"
                                                stop-color="#FF5B00"
                                            />
                                        </linearGradient>
                                        <clipPath id="clip0_195_11851">
                                            <rect
                                                x="11.5"
                                                y="2"
                                                width="8"
                                                height="2"
                                                rx="1"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <p class="sezzle-checkout-step-description">
                                ${this.translation.chooseSezzle}
                            </p>
                        </div>
                        <div class="sezzle-checkout-step">
                            <div alt="" class="sezzle-checkout-step-graphic">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="47"
                                    height="63"
                                    viewBox="0 0 47 63"
                                    fill="none"
                                >
                                    <path
                                        d="M1 5.88513C1 3.39985 3.01472 1.38513 5.5 1.38513H41.5C43.9853 1.38513 46 3.39985 46 5.88513V20.3851H1V5.88513Z"
                                        fill="#F9F5FD"
                                        stroke="#E8E8E8"
                                    />
                                    <path
                                        d="M46 34.8851C46 37.3704 43.9853 39.3851 41.5 39.3851L5.5 39.3851C3.01472 39.3851 1 37.3704 1 34.8851L0.999998 20.3851L46 20.3851L46 34.8851Z"
                                        fill="#F9F5FD"
                                        stroke="#E8E8E8"
                                    />
                                    <path
                                        d="M18.4952 10.9976C18.4952 14.0338 16.0338 16.4952 12.9976 16.4952C9.96136 16.4952 7.5 14.0338 7.5 10.9976C7.5 7.96136 9.96136 5.5 12.9976 5.5C16.0338 5.5 18.4952 7.96136 18.4952 10.9976Z"
                                        stroke="#AEAEAE"
                                    />
                                    <path
                                        d="M18.4952 29.9976C18.4952 33.0338 16.0338 35.4952 12.9976 35.4952C9.96136 35.4952 7.5 33.0338 7.5 29.9976C7.5 26.9614 9.96136 24.5 12.9976 24.5C16.0338 24.5 18.4952 26.9614 18.4952 29.9976Z"
                                        stroke="#8333D4"
                                    />
                                    <path
                                        d="M25 13C26.1046 13 27 12.1046 27 11C27 9.89543 26.1046 9 25 9C23.8954 9 23 9.89543 23 11C23 12.1046 23.8954 13 25 13Z"
                                        fill="#E8E8E8"
                                    />
                                    <path
                                        d="M25 32C26.1046 32 27 31.1046 27 30C27 28.8954 26.1046 28 25 28C23.8954 28 23 28.8954 23 30C23 31.1046 23.8954 32 25 32Z"
                                        fill="#E8E8E8"
                                    />
                                    <path
                                        d="M31 13C32.1046 13 33 12.1046 33 11C33 9.89543 32.1046 9 31 9C29.8954 9 29 9.89543 29 11C29 12.1046 29.8954 13 31 13Z"
                                        fill="#E8E8E8"
                                    />
                                    <path
                                        d="M31 32C32.1046 32 33 31.1046 33 30C33 28.8954 32.1046 28 31 28C29.8954 28 29 28.8954 29 30C29 31.1046 29.8954 32 31 32Z"
                                        fill="#E8E8E8"
                                    />
                                    <path
                                        d="M37 13C38.1046 13 39 12.1046 39 11C39 9.89543 38.1046 9 37 9C35.8954 9 35 9.89543 35 11C35 12.1046 35.8954 13 37 13Z"
                                        fill="#E8E8E8"
                                    />
                                    <path
                                        d="M37 32C38.1046 32 39 31.1046 39 30C39 28.8954 38.1046 28 37 28C35.8954 28 35 28.8954 35 30C35 31.1046 35.8954 32 37 32Z"
                                        fill="#E8E8E8"
                                    />
                                    <path
                                        d="M13 34C15.2091 34 17 32.2091 17 30C17 27.7909 15.2091 26 13 26C10.7909 26 9 27.7909 9 30C9 32.2091 10.7909 34 13 34Z"
                                        fill="#8333D4"
                                    />
                                    <path
                                        d="M23.6677 57.3503C25.7355 54.5651 25.9356 49.6577 25.9356 47.4693V45.4135C25.9356 44.8167 25.6688 44.2198 25.2686 43.7556C24.8016 43.2914 24.2013 43.0925 23.601 43.0925C23.2675 43.0925 23.0007 43.1588 22.7339 43.2914C22.5338 42.1641 21.6 41.3019 20.3994 41.3019C19.8658 41.3019 19.4656 41.4346 19.0654 41.6998C18.6652 40.9041 17.8648 40.3735 16.9309 40.3735C16.5307 40.3735 16.1972 40.5062 15.8637 40.6388V34.2725C15.8637 32.9462 14.7965 31.8851 13.4625 31.8851C12.1285 31.8851 11.0613 32.9462 11.0613 34.2725V46.2093L10.0607 43.7556C9.72724 42.8935 8.86013 42.2967 7.85961 42.2967C7.52611 42.2967 7.2593 42.363 6.9925 42.4956C5.79188 43.0262 5.19157 44.3525 5.65848 45.5461L8.12642 53.5703C8.19312 53.9019 8.72672 56.223 9.99404 57.6819C9.72724 57.9472 9.59384 58.2124 9.59384 58.6103V60.865C9.59384 61.5945 10.1941 62.125 10.8612 62.125H23.2008C23.9345 62.125 24.4681 61.5282 24.4681 60.865V58.544C24.5348 58.0135 24.2013 57.5493 23.6677 57.3503ZM9.39373 53.2388L6.7924 45.0156C6.59229 44.4851 6.8591 43.8219 7.3927 43.623C7.92631 43.424 7.92631 43.8883 8.12642 44.4188L10.4612 49.8401C10.5946 50.1053 11.4615 50.1219 11.795 50.0556C12.1285 49.9893 12.3286 49.724 12.3286 49.3925V34.2725C12.3286 33.6757 12.7955 33.2114 13.3958 33.2114C13.9961 33.2114 14.005 33.0011 14.005 33.5979V43.7556C14.005 44.0872 14.7298 44.4188 15.13 44.4188C15.4635 44.4188 15.797 44.1535 15.797 43.7556V42.6946C15.797 42.0977 16.2639 41.6335 16.8642 41.6335C17.4645 41.6335 17.5771 42.0977 17.5771 42.6946V44.883C17.5771 45.2146 18.1983 45.5461 18.5985 45.5461C18.932 45.5461 19.2655 45.2809 19.2655 44.883V43.623C19.2655 43.0262 19.7324 42.5619 20.3327 42.5619C20.933 42.5619 21.2818 43.0262 21.2818 43.623V45.944C21.2818 46.2756 21.6667 46.6072 22.0669 46.6072C22.4671 46.6072 22.7339 46.3419 22.7339 45.944V44.8167C23.1341 44.3525 23.9345 44.2198 24.3347 44.684C24.5348 44.883 24.6682 45.1483 24.6682 45.4798V47.5356C24.735 52.1777 23.7344 55.8251 22.0669 57.284H11.5282C10.2608 56.4882 9.52713 54.1009 9.39373 53.2388ZM23.2008 60.865H10.9279V58.544H23.2675V60.865H23.2008Z"
                                        fill="#FCD7B6"
                                    />
                                    <path
                                        d="M8.54272 59.6589C8.54272 58.3084 9.63753 57.2136 10.988 57.2136H23.564C24.9145 57.2136 26.0093 58.3084 26.0093 59.6589C26.0093 61.0095 24.9145 62.1043 23.564 62.1043H10.988C9.63753 62.1043 8.54272 61.0095 8.54272 59.6589Z"
                                        fill="#FF8100"
                                    />
                                    <path
                                        d="M24.6938 47.168V47.3057C24.7626 52.1248 23.7299 55.9113 22.0088 57.4259H11.1314C9.82335 56.5997 9.06606 54.1213 8.92837 53.2264V53.1575L6.24344 44.6896C6.0369 44.1389 6.31228 43.4504 6.86304 43.2439C7.41379 43.0374 8.10224 43.3127 8.30877 43.8635L10.6495 49.5087C10.7872 49.7841 11.0626 49.9907 11.4068 49.9218C11.751 49.853 11.9575 49.5776 11.9575 49.2334V33.5368C11.9575 32.9172 12.4394 32.4353 13.059 32.4353C13.6786 32.4353 14.1606 32.9172 14.1606 33.5368V43.3816C14.1606 43.7258 14.4359 44.07 14.849 44.07C15.1932 44.07 15.5374 43.7947 15.5374 43.3816V42.2801C15.5374 41.6605 16.0194 41.1786 16.639 41.1786C17.2586 41.1786 17.7405 41.6605 17.7405 42.2801V44.5519C17.7405 44.8962 18.0159 45.2404 18.4289 45.2404C18.7731 45.2404 19.1174 44.965 19.1174 44.5519V43.2439C19.1174 42.6243 19.5993 42.1424 20.2189 42.1424C20.8385 42.1424 21.3204 42.6243 21.3204 43.2439V45.6535C21.3204 45.9977 21.5958 46.3419 22.0088 46.3419C22.4219 46.3419 22.6973 46.0665 22.6973 45.6535V44.4831C23.1103 44.0012 23.9365 43.8635 24.3496 44.3454C24.5561 44.5519 24.6938 44.8273 24.6938 45.1715V47.168Z"
                                        fill="#FCD7B6"
                                    />
                                </svg>
                            </div>
                            <p class="sezzle-checkout-step-description">
                                ${this.translation.selectPlan}
                            </p>
                        </div>
                        <div class="sezzle-checkout-step">
                            <div alt="" class="sezzle-checkout-step-graphic">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="46px"
                                    height="57px"
                                    viewBox="0 0 46 57"
                                    fill="none"
                                >
                                    <rect
                                        x="0.5"
                                        y="13.8853"
                                        width="41"
                                        height="16"
                                        rx="8"
                                        fill="#382757"
                                    />
                                    <path
                                        d="M27.5 9.0302C27.5 2.96817 33.4006 -1.29463 39.1763 0.56545C42.8395 1.73917 45.5 5.18259 45.5 9.21675C45.5 14.1915 41.4737 18.1789 36.5 18.1246H36.3974C31.4789 18.0235 27.5 13.9738 27.5 9.0302Z"
                                        fill="#29D3A2"
                                    />
                                    <path
                                        d="M33.8711 9.62512L35.3852 11.158L37.753 8.76082L40.1208 6.36362C40.4349 6.04562 40.9503 6.04562 41.2644 6.36362C41.5785 6.68162 41.5785 7.1953 41.2644 7.5133L38.6107 10.2L35.957 12.8866C35.643 13.2046 35.1356 13.2046 34.8215 12.8866L32.7356 10.7748C32.4215 10.4568 32.4215 9.94312 32.7356 9.62512C33.0497 9.30712 33.557 9.30712 33.8711 9.62512Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M14.5 23.8853C15.6046 23.8853 16.5 22.9898 16.5 21.8853C16.5 20.7807 15.6046 19.8853 14.5 19.8853C13.3954 19.8853 12.5 20.7807 12.5 21.8853C12.5 22.9898 13.3954 23.8853 14.5 23.8853Z"
                                        fill="#E8E8E8"
                                    />
                                    <path
                                        d="M21.5 23.8853C22.6046 23.8853 23.5 22.9898 23.5 21.8853C23.5 20.7807 22.6046 19.8853 21.5 19.8853C20.3954 19.8853 19.5 20.7807 19.5 21.8853C19.5 22.9898 20.3954 23.8853 21.5 23.8853Z"
                                        fill="#E8E8E8"
                                    />
                                    <path
                                        d="M28.5 23.8853C29.6046 23.8853 30.5 22.9898 30.5 21.8853C30.5 20.7807 29.6046 19.8853 28.5 19.8853C27.3954 19.8853 26.5 20.7807 26.5 21.8853C26.5 22.9898 27.3954 23.8853 28.5 23.8853Z"
                                        fill="#E8E8E8"
                                    />
                                    <path
                                        d="M29.6677 51.8302C31.7355 49.0449 31.9356 44.1376 31.9356 41.9492V39.8934C31.9356 39.2965 31.6688 38.6997 31.2686 38.2355C30.8016 37.7713 30.2013 37.5723 29.601 37.5723C29.2675 37.5723 29.0007 37.6386 28.7339 37.7713C28.5338 36.6439 27.6 35.7818 26.3994 35.7818C25.8658 35.7818 25.4656 35.9144 25.0654 36.1797C24.6652 35.3839 23.8648 34.8534 22.9309 34.8534C22.5307 34.8534 22.1972 34.986 21.8637 35.1186V28.7524C21.8637 27.426 20.7965 26.365 19.4625 26.365C18.1285 26.365 17.0613 27.426 17.0613 28.7524V40.6892L16.0607 38.2355C15.7272 37.3734 14.8601 36.7765 13.8596 36.7765C13.5261 36.7765 13.2593 36.8429 12.9925 36.9755C11.7919 37.506 11.1916 38.8323 11.6585 40.026L14.1264 48.0502C14.1931 48.3818 14.7267 50.7028 15.994 52.1618C15.7272 52.427 15.5938 52.6923 15.5938 53.0902V55.3449C15.5938 56.0744 16.1941 56.6049 16.8612 56.6049H29.2008C29.9345 56.6049 30.4681 56.0081 30.4681 55.3449V53.0239C30.5348 52.4933 30.2013 52.0291 29.6677 51.8302ZM15.3937 47.7186L12.7924 39.4955C12.5923 38.965 12.8591 38.3018 13.3927 38.1029C13.9263 37.9039 13.9263 38.3681 14.1264 38.8986L16.4612 44.3199C16.5946 44.5852 17.4615 44.6018 17.795 44.5355C18.1285 44.4691 18.3286 44.2039 18.3286 43.8723V28.7524C18.3286 28.1555 18.7955 27.6913 19.3958 27.6913C19.9961 27.6913 20.005 27.481 20.005 28.0778V38.2355C20.005 38.5671 20.7298 38.8986 21.13 38.8986C21.4635 38.8986 21.797 38.6334 21.797 38.2355V37.1744C21.797 36.5776 22.2639 36.1134 22.8642 36.1134C23.4645 36.1134 23.5771 36.5776 23.5771 37.1744V39.3628C23.5771 39.6944 24.1983 40.026 24.5985 40.026C24.932 40.026 25.2655 39.7607 25.2655 39.3628V38.1029C25.2655 37.506 25.7324 37.0418 26.3327 37.0418C26.933 37.0418 27.2818 37.506 27.2818 38.1029V40.4239C27.2818 40.7555 27.6667 41.0871 28.0669 41.0871C28.4671 41.0871 28.7339 40.8218 28.7339 40.4239V39.2965C29.1341 38.8323 29.9345 38.6997 30.3347 39.1639C30.5348 39.3628 30.6682 39.6281 30.6682 39.9597V42.0155C30.735 46.6576 29.7344 50.3049 28.0669 51.7639H17.5282C16.2608 50.9681 15.5271 48.5807 15.3937 47.7186ZM29.2008 55.3449H16.9279V53.0239H29.2675V55.3449H29.2008Z"
                                        fill="#FCD7B6"
                                    />
                                    <path
                                        d="M14.5427 54.1389C14.5427 52.7884 15.6375 51.6936 16.988 51.6936H29.564C30.9145 51.6936 32.0093 52.7884 32.0093 54.1389C32.0093 55.4894 30.9145 56.5843 29.564 56.5843H16.988C15.6375 56.5843 14.5427 55.4894 14.5427 54.1389Z"
                                        fill="#FF8100"
                                    />
                                    <path
                                        d="M30.6938 41.6479V41.7856C30.7626 46.6047 29.7299 50.3911 28.0088 51.9057H17.1314C15.8234 51.0796 15.0661 48.6012 14.9284 47.7062V47.6374L12.2434 39.1695C12.0369 38.6187 12.3123 37.9303 12.863 37.7238C13.4138 37.5172 14.1022 37.7926 14.3088 38.3434L16.6495 43.9886C16.7872 44.264 17.0626 44.4705 17.4068 44.4017C17.751 44.3328 17.9575 44.0575 17.9575 43.7132V28.0167C17.9575 27.3971 18.4394 26.9152 19.059 26.9152C19.6786 26.9152 20.1606 27.3971 20.1606 28.0167V37.8614C20.1606 38.2057 20.4359 38.5499 20.849 38.5499C21.1932 38.5499 21.5374 38.2745 21.5374 37.8614V36.7599C21.5374 36.1403 22.0194 35.6584 22.639 35.6584C23.2586 35.6584 23.7405 36.1403 23.7405 36.7599V39.0318C23.7405 39.376 24.0159 39.7202 24.4289 39.7202C24.7731 39.7202 25.1174 39.4449 25.1174 39.0318V37.7238C25.1174 37.1042 25.5993 36.6222 26.2189 36.6222C26.8385 36.6222 27.3204 37.1042 27.3204 37.7238V40.1333C27.3204 40.4775 27.5958 40.8218 28.0088 40.8218C28.4219 40.8218 28.6973 40.5464 28.6973 40.1333V38.963C29.1103 38.481 29.9365 38.3434 30.3496 38.8253C30.5561 39.0318 30.6938 39.3072 30.6938 39.6514V41.6479Z"
                                        fill="#FCD7B6"
                                    />
                                </svg>
                            </div>
                            <p class="sezzle-checkout-step-description">
                                ${this.translation.completeOrder}
                            </p>
                        </div>
                        <button class="sezzle-checkout-button-modal-button">
                            ${this.translation.continue}
                        </button>
                    </div>
                </div>
            </div>
    `;
        document.body.append(sezzleButtonModal);
        sezzleButtonModal
            .querySelector(".sezzle-checkout-button-modal-button")
            .addEventListener(
                "click",
                function (e) {
                    this.eventLogger.sendEvent("checkout-button-modal-onclick");
                    e.stopPropagation();
                    e.preventDefault();
                    location.assign(
                        "/checkout?shop_pay_logout=true&skip_shop_pay=true&shop_pay_checkout_as_guest=true"
                    );
                }.bind(this)
            );
        const closeButtons = document.querySelectorAll(
            ".sezzle-checkout-modal-close"
        );
        closeButtons.forEach((button) => {
            button.addEventListener("click", function (e) {
                if (
                    e.target.className.indexOf("sezzle-checkout-modal-close") >
                    -1
                ) {
                    document.querySelector(
                        ".sezzle-checkout-button-modal-overlay"
                    ).style.display = "none";
                }
            });
        });
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
        this.merchantUUID = options.merchantUUID || "";
        this.widgetServerEventLogEndpoint = options.widgetServerBaseUrl
            ? `${options.widgetServerBaseUrl}/v1/event/log`
            : "https://widget.sezzle.com/v1/event/log";
    }

    sendEvent(eventName, description = "") {
        if (document.querySelector(".sezzle-checkout-button")) {
            const body = [
                {
                    event_name: eventName,
                    description: description,
                    merchant_uuid: this.merchantUUID,
                    merchant_site: window.location.hostname,
                },
            ];
            this.httpRequestWrapper(
                "POST",
                this.widgetServerEventLogEndpoint,
                body
            );
        }
    }

    async httpRequestWrapper(method, url, body = null) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            if (body !== null) {
                xhr.setRequestHeader("Content-Type", "application/json");
            }
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject(
                        new Error(
                            "Something went wrong, contact the Sezzle team!"
                        )
                    );
                }
            };
            xhr.onerror = function () {
                reject(
                    new Error("Something went wrong, contact the Sezzle team!")
                );
            };
            body === null ? xhr.send() : xhr.send(JSON.stringify(body));
        }).catch(function (e) {
            console.log(e.message);
        });
    }
}

export default SezzleCheckoutButton;
