import "./style.scss";
import { markup as sezzleModalMarkup, load as loadSezzleModal } from "@sezzle/sezzle-modal";
import enTranslations from "./translations/en.json";
import frTranslations from "./translations/fr.json";
import esTranslations from "./translations/es.json";

const Events = Object.freeze({
    Onload: "banner-onload",
    Onclick: "banner-onclick",
    Error: "banner-error",
});

// The banner has no product price, so the multi-plan modal opens at $50, the
// lowest price that shows both pay-in-4 and pay-in-5 (the banner offers no
// long-term plans, so it doesn't need how-sezzle-works' $150 long-term
// minimum); shoppers can change it in the modal
const DEFAULT_MODAL_PRICE = 50;
const MAX_MODAL_PRICE = 2500;
const FIVE_PAY_MIN_PRICE = 50;
// Pay-in-5 is offered only in these countries (mirrors installment-widget)
const FIVE_PAY_COUNTRIES = ["US", "GU", "PR", "VI", "AS", "MP"];
const DEFAULT_COUNTRY_CODE = "US";

class SezzleBanner {
    constructor(options) {
        this.translations = {
            en: enTranslations,
            es: esTranslations,
            fr: frTranslations,
        };
        this.language = document.querySelector("html")?.lang || "en";
        this.template = this.translations[this.language];
        this.supportedThemes = ["indigo", "black"];
        this.theme =
            this.supportedThemes.indexOf(options.theme) > -1
                ? options.theme
                : "indigo";
        this.renderToContainer =
            options.renderToContainer || "#sezzle-button-render-reference";
        this.countryCode = normalizeCountryCode(options.countryCode);
        this.eventLogger = new EventLogger({
            merchantUUID: options.merchantUUID,
            widgetServerBaseUrl: "https://widget.sezzle.com",
        });
    }

    disableBodyScroll(disable) {
        const bodyElement = document.body;
        if (disable) {
            this.scrollDistance =
                window.pageYOffset ||
                (document.documentElement.clientHeight
                    ? document.documentElement.scrollTop
                    : document.body.scrollTop) ||
                0;
            bodyElement.classList.add("sezzle-modal-open");
            bodyElement.style.top = `${this.scrollDistance * -1}px`;
        } else {
            bodyElement.classList.remove("sezzle-modal-open");
            window.scrollTo(0, this.scrollDistance);
            bodyElement.style.top = 0;
            if (document.querySelector(".sezzle-modal")) {
                document.querySelector(".sezzle-modal").scrollTop = 0;
            }
            this.scrollDistance = 0;
        }
    }

    handleModalClose(modalNode) {
        this.disableBodyScroll(false);
        // hide modal and replace focus
        modalNode.style.display = "none";
        modalNode.getElementsByClassName("sezzle-modal")[0].className =
            "sezzle-modal sezzle-checkout-modal-hidden";
        const newFocus =
            document.querySelector("#sezzle-modal-return") ||
            document.querySelector(".sezzle-banner-container");
        if (newFocus) {
            newFocus.focus();
            newFocus.removeAttribute("id");
        }
    }

    addModalCloseListeners(modalNode) {
        // Bound once, on the lightbox rather than on the buttons:
        // ModalUI.load() rebuilds the modal's inner content, so listeners on
        // elements inside it would be lost
        if (this.modalListenersBound) {
            return;
        }
        this.modalListenersBound = true;
        modalNode.addEventListener("click", (event) => {
            // the lightbox itself is the backdrop; inside the modal, only the
            // close buttons close it
            if (
                event.target === modalNode ||
                event.target.closest(".close-btn, button.close-sezzle-modal")
            ) {
                this.handleModalClose(modalNode);
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && modalNode.style.display === "block") {
                this.handleModalClose(modalNode);
            }
        });
    }

    isFivePayEligible(price) {
        return (
            FIVE_PAY_COUNTRIES.indexOf(this.countryCode) > -1 &&
            price >= FIVE_PAY_MIN_PRICE
        );
    }

    executeModalScript() {
        const formatAmount = (amount) => `$${amount.toFixed(2)}`;
        document.modalLanguage = this.language;
        // a falsy pi5InstallmentAmount hides the pay-in-5 card
        document.modalMultiPlan = {
            productPrice: formatAmount(DEFAULT_MODAL_PRICE),
            pi4InstallmentAmount: formatAmount(DEFAULT_MODAL_PRICE / 4),
            pi5InstallmentAmount: this.isFivePayEligible(DEFAULT_MODAL_PRICE)
                ? formatAmount(DEFAULT_MODAL_PRICE / 5)
                : "",
        };
        window.ModalUI.load();
        this.addAmountInputListener();
        this.addCarouselListeners();
    }

    addAmountInputListener() {
        const modalElement = document.querySelector(
            "#sezzle-modal-core-content"
        );
        const input = modalElement?.querySelector(".input-amount");
        if (!input) {
            return;
        }
        input.addEventListener("input", () => {
            const includeComma = isCommaDelimited(input.value);
            const price = parsePriceString(input.value, includeComma);
            if (isNaN(price) || price <= 0 || price > MAX_MODAL_PRICE) {
                input.classList.add("input-amount-error");
                return;
            }
            input.classList.remove("input-amount-error");

            const currencyMatch = input.value.match(/[$€£₤₹]/);
            const currency = currencyMatch ? currencyMatch[0] : "$";
            const formatAmount = (amount) => {
                const fixed = amount.toFixed(2);
                return (
                    currency + (includeComma ? fixed.replace(".", ",") : fixed)
                );
            };
            setText(
                modalElement.getElementsByClassName("4-pay-installment"),
                formatAmount(price / 4)
            );
            setText(
                modalElement.getElementsByClassName("5-pay-installment"),
                formatAmount(price / 5)
            );
            const pay5Cards = modalElement.getElementsByClassName(
                "5-pay-installment-card"
            );
            const showPay5 = this.isFivePayEligible(price);
            for (let i = 0; i < pay5Cards.length; i++) {
                pay5Cards[i].style.display = showPay5 ? "flex" : "none";
            }
        });
    }

    addCarouselListeners() {
        // ModalUI.load() builds the carousel at position 1
        let activeTab = 1;
        const modalElement = document.querySelector(
            "#sezzle-modal-core-content"
        );
        if (!modalElement) {
            return;
        }
        const arrows = modalElement.getElementsByClassName("arrow");
        for (let i = 0; i < arrows.length; i++) {
            arrows[i].addEventListener("click", (event) => {
                const btn = event.currentTarget;
                const arrowGroup = btn.parentElement;
                if (btn.className.indexOf("disabled") > -1 || !arrowGroup) {
                    return;
                }
                if (btn.className.indexOf("arrow-right") > -1) {
                    activeTab++;
                    arrowGroup.firstElementChild.className = "arrow arrow-left";
                    if (activeTab === 3) {
                        btn.className = "arrow arrow-right disabled";
                    }
                } else {
                    activeTab--;
                    arrowGroup.lastElementChild.className = "arrow arrow-right";
                    if (activeTab === 1) {
                        btn.className = "arrow arrow-left disabled";
                    }
                }
                const carouselWrapper = arrowGroup.parentElement?.parentElement;
                if (!carouselWrapper) {
                    return;
                }
                const carousel = carouselWrapper.querySelector(".carousel");
                if (carousel) {
                    carousel.className = `carousel position-${activeTab}`;
                }
                const dots =
                    carouselWrapper.querySelector(".carousel-dots")?.children;
                if (dots) {
                    for (let j = 0; j < dots.length; j++) {
                        dots[j].className =
                            activeTab - 1 === j ? "dot active" : "dot";
                    }
                }
            });
        }
    }

    // The modal markup and ModalUI come bundled from @sezzle/sezzle-modal, so
    // nothing is fetched from media.sezzle.com or re-executed at runtime
    // (MERCHANT-4918)
    getModalContent(modalNode) {
        const modalNodeContent = document.getElementById(
            "sezzle-modal-core-content"
        );
        if (modalNodeContent?.innerHTML) {
            return;
        }
        modalNode.innerHTML = sezzleModalMarkup;
        // sezzle-widget.js may already have set ModalUI on this page; keep it
        window.ModalUI ??= { load: loadSezzleModal };
        this.executeModalScript();
    }

    createModal() {
        try {
            // check for existing modal nodes
            const modalNodes = document.getElementsByClassName(
                "sezzle-checkout-modal-lightbox"
            );
            if (modalNodes.length) {
                return modalNodes[0];
            } else {
                // render modal container
                const modalNode = document.createElement("section");
                modalNode.className =
                    "sezzle-checkout-modal-lightbox close-sezzle-modal";
                modalNode.style.display = "none";
                modalNode.role = "dialog";
                modalNode.style.maxHeight = "100%";
                modalNode.lang = this.language;
                document.querySelector("body").appendChild(modalNode);
                return modalNode;
            }
        } catch {
            console.log("failed to render Sezzle modal");
        }
    }

    renderModal() {
        this.disableBodyScroll(true);
        let modalNode = this.createModal();
        this.getModalContent(modalNode);
        this.addModalCloseListeners(modalNode);
        modalNode.style.display = "block";
        modalNode.focus();
        const modals = modalNode.getElementsByClassName("sezzle-modal");
        if (modals.length) {
            modals[0].className = "sezzle-modal";
        }
    }

    addBannerClickListener() {
        document.querySelector(".sezzle-banner-link")?.addEventListener(
            "click",
            function (e) {
                this.eventLogger.sendEvent(Events.Onclick);
                e.stopPropagation();
                e.preventDefault();
                e.target.id = "sezzle-modal-return";
                this.renderModal();
            }.bind(this)
        );
    }

    createBanner() {
        let banner = document.createElement("div");
        banner.className = `sezzle-banner-container ${this.theme}`;
        banner.innerHTML = `
            <div class="sezzle-banner-content">
                <div class="sezzle-banner-logo">
                    <svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.92773 13.7592C3.83039 15.5682 6.91468 15.5682 8.81734 13.7592L8.99969 13.5858C9.95049 12.6818 8.04784 7.93939 8.99969 7.0354L1.92773 13.7592Z" fill="url(#paint0_linear_771_40642)"/>
                        <path d="M9.18144 6.86087L8.99908 7.03425C8.04828 7.93824 9.94988 12.6807 8.99908 13.5847L16.071 6.86087C15.1192 5.95688 13.8732 5.50488 12.6262 5.50488C11.3792 5.50388 10.1322 5.95688 9.18144 6.86087Z" fill="url(#paint1_linear_771_40642)"/>
                        <path d="M1.92699 7.20876C0.0243372 9.01774 0.0243372 11.9502 1.92699 13.7592L9.18342 6.85999C11.0861 5.05101 11.0861 2.11855 9.18342 0.30957L1.92699 7.20876Z" fill="url(#paint2_linear_771_40642)"/>
                        <path d="M8.81566 13.759C6.91301 15.568 6.91301 18.5005 8.81566 20.3095L16.0721 13.4103C17.9747 11.6013 17.9747 8.66884 16.0721 6.85986L8.81566 13.759Z" fill="url(#paint3_linear_771_40642)"/>
                        <defs>
                            <linearGradient id="paint0_linear_771_40642" x1="10.3631" y1="12.0737" x2="6.60897" y2="8.55785" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#CE5DCB"/>
                                <stop offset="0.2095" stop-color="#C558CC"/>
                                <stop offset="0.5525" stop-color="#AC4ACF"/>
                                <stop offset="0.9845" stop-color="#8534D4"/>
                                <stop offset="1" stop-color="#8333D4"/>
                            </linearGradient>
                            <linearGradient id="paint1_linear_771_40642" x1="8.72452" y1="13.5842" x2="16.0708" y2="13.5842" gradientUnits="userSpaceOnUse">
                                <stop offset="0.0237" stop-color="#FF5667"/>
                                <stop offset="0.6592" stop-color="#FC8B82"/>
                                <stop offset="1" stop-color="#FBA28E"/>
                            </linearGradient>
                            <linearGradient id="paint2_linear_771_40642" x1="0.499736" y1="13.7594" x2="10.6104" y2="13.7594" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#00B874"/>
                                <stop offset="0.5126" stop-color="#29D3A2"/>
                                <stop offset="0.6817" stop-color="#53DFB6"/>
                                <stop offset="1" stop-color="#9FF4D9"/>
                            </linearGradient>
                            <linearGradient id="paint3_linear_771_40642" x1="7.38839" y1="20.3095" x2="17.4989" y2="20.3095" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FCD77E"/>
                                <stop offset="0.5241" stop-color="#FEA500"/>
                                <stop offset="1" stop-color="#FF5B00"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <span class="sezzle-banner-text">${this.template.shopNow} <div aria-haspopup="dialog" role="button" class="sezzle-banner-link">${this.template.learnMore}</div></span>
            </div>
        `;
        return banner;
    }

    renderBanner() {
        let banner = this.createBanner();
        document.querySelector(this.renderToContainer)?.appendChild(banner);
        this.addBannerClickListener();
    }

    init() {
        try {
            this.renderBanner();
            this.eventLogger.sendEvent(Events.Onload);
        } catch (e) {
            console.log("Failed to render Sezzle banner: ", e);
            this.eventLogger.sendEvent(Events.Error, e);
        }
    }
}

class EventLogger {
    constructor(options) {
        this.merchantUUID = options.merchantUUID || "";
        this.widgetServerEventLogEndpoint = "https://widget.sezzle.com/v1/event/log";
    }

    sendEvent(eventName, description = "") {
        const body = [
            {
                event_name: eventName,
                description: description,
                merchant_uuid: this.merchantUUID,
                merchant_site: window.location.hostname,
            },
        ];
        httpRequestWrapper("POST", this.widgetServerEventLogEndpoint, body);
    }
}

async function httpRequestWrapper(method, url, body = null) {
    try {
        const options = {
            method,
            headers: {},
        };
        if (body !== null) {
            options.headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(body);
        }
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error("Something went wrong, contact the Sezzle team!");
        }
        return await response.text();
    } catch (e) {
        console.log(e.message);
    }
}

function setText(elements, text) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].textContent = text;
    }
}

// Runs in the constructor, outside init()'s try/catch, so it must not throw on
// whatever a merchant's snippet passes
function normalizeCountryCode(countryCode) {
    if (countryCode == null || countryCode === "") {
        return DEFAULT_COUNTRY_CODE;
    }
    const code = String(countryCode).trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code)) {
        console.warn(
            `Sezzle banner: countryCode "${countryCode}" is not a 2-letter ISO country code; using "${DEFAULT_COUNTRY_CODE}"`
        );
        return DEFAULT_COUNTRY_CODE;
    }
    return code;
}

// Price parsing for the modal's amount input, ported from installment-widget's
// Helper so both widgets read "$1.234,56" and "$1,234.56" the same way
function isCommaDelimited(priceText) {
    // drop a symbol's "." ("Rs.") the same way parsePriceString does
    const priceOnly = priceText
        .replace(/([a-zA-Z])\./g, "$1")
        .replace(/[^0-9.,]/g, "");
    const commaPos = priceOnly.indexOf(",");
    const decimalPos = priceOnly.indexOf(".");
    if (commaPos > -1 && decimalPos > -1) {
        return commaPos > decimalPos;
    }
    // With a single kind of separator, it's a thousands separator only when
    // exactly 3 digits follow it ("1.234", "1,234"); otherwise it's the
    // decimal ("12.5", "1,5"), including mid-typing ("50.5" on the way to
    // "50.50")
    if (commaPos > -1) {
        return priceOnly.length - priceOnly.lastIndexOf(",") - 1 !== 3;
    }
    if (decimalPos > -1) {
        return priceOnly.length - priceOnly.lastIndexOf(".") - 1 === 3;
    }
    return false;
}

function parsePriceString(price, includeComma) {
    let formattedPrice = "";
    for (let i = 0; i < price.length; i++) {
        const char = price[i];
        if (
            /[0-9]/.test(char) ||
            (!includeComma && char === ".") ||
            (includeComma && char === ",")
        ) {
            // a "." right after a letter belongs to a symbol like "Rs."
            if (i > 0 && char === "." && /[a-zA-Z]/.test(price[i - 1])) {
                continue;
            }
            formattedPrice += char;
        }
    }
    if (includeComma) {
        formattedPrice = formattedPrice.replace(",", ".");
    }
    return parseFloat(formattedPrice);
}

export default SezzleBanner;
