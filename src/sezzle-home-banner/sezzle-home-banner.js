import "./style.scss";
import enTranslations from "./translations/en.json";
import frTranslations from "./translations/fr.json";
import esTranslations from "./translations/es.json";

export default class SezzleCheckoutButton {
    constructor(options) {
        this.translations = {
            en: enTranslations,
            es: esTranslations,
            fr: frTranslations,
        };
        this.language = document.querySelector('html')?.lang || 'en';
        this.template = this.translations[this.language];
        this.supportedThemes = ["violet", "indigo", "black"];
        this.theme =
            this.supportedThemes.indexOf(options.theme) > -1
                ? options.theme
                : "indigo";
        this.renderToContainer = options.renderToContainer || '';
    }

    createBanner() {
        let banner = document.createElement('div');
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
                <span class="sezzle-banner-text">${this.template.shopNow} <a href="https://sezzle.com/how-it-works/" target="_blank" rel="noopener noreferrer" class="sezzle-banner-link">${this.template.learnMore}</a></span>
            </div>
        `;
        document.querySelector(this.renderToContainer)?.appendChild(banner);
        // return banner;
    }

    init() {
        try {
            this.createBanner();
        } catch (e) {
            console.log('Failed to render Sezzle banner: ', e)
        }
    }
}
