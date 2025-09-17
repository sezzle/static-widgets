// handles initial render, then watches checkout total for change event, updates installment amounts
document.addEventListener('readystatechange', function (event) {
	var merchantLocale = "" // "['US', 'CA', 'IN', 'GU', 'PR', 'VI', 'AS', 'MP']" serves bi-weekly product, else serves monthly
	var currencySymbol = ""; // if not provided, it will attempt to detect the currency symbol from the price text. If site uses charset="ISO-8859-1", use String.fromCharCode() - param is HTML hex char code integer
	var checkoutTotal = document.querySelector('.payment-due__price'); // Shopify
	// var checkoutTotal = document.querySelector('.order-total').querySelector('.woocommerce-Price-amount'); // WooCommerce
	// var checkoutTotal = document.querySelector('.total').getElementsByTagName('SPAN')[1]; // CommentSold
	// var checkoutTotal = document.querySelector('.total_total') // 3DCart
	renderInstallmentWidget(checkoutTotal, merchantLocale, currencySymbol);

	// create an observer instance
	var observer = new MutationObserver(function () {
		document.querySelector('#sezzle-installment-widget-box').innerHTML = '';
		renderInstallmentWidget(checkoutTotal, merchantLocale, currencySymbol);
	});

	// configuration of the observer:
	var config = { attributes: true, childList: true, characterData: true };

	// pass in the target node, as well as the observer options
	observer.observe(checkoutTotal, config);
})

function renderInstallmentWidget(checkoutTotal, serviceRegion, currencySymbol) {
	var language = document.querySelector('html').lang.substring(0, 2).toLowerCase() || navigator.language.substring(0, 2) || 'en';
	var merchantLocale = serviceRegion || document.querySelector('html').lang.split('-')[1] || "US";

	// sets payment plan based on given param
	var biWeeklyLocales = ['US', 'CA', 'IN', 'GU', 'PR', 'VI', 'AS', 'MP'];
	var interval = biWeeklyLocales.indexOf(merchantLocale) > -1 ? 14 : 30;

	// handles translations
	var translation = {
        en: {
            infoIcon: "Learn More about Sezzle",
            installmentWidget: {
                14: "4 payments over 6 weeks",
                30: "4 payments over 3 months. No Fee!",
            },
            paymentPieTitle: "Sezzle payment pie chart",
            today: "today",
        },
        fr: {
            infoIcon: "En savoir plus sur Sezzle",
            installmentWidget: {
                14: "4 versements sur 6 semaines",
                30: "4 versements sur 3 mois. Pas de frais!",
            },
            paymentPieTitle: "Graphique circulaire de paiement Sezzle",
            today: "aujourd'hui",
        },
        es: {
            infoIcon: "Más información sobre Sezzle",
            installmentWidget: {
                14: "4 pagos sin en 6 semanas",
                30: "4 pagos en 3 meses. ¡Sin cargo!",
            },
            paymentPieTitle: "Gráfico circular de pagos de Sezzle",
            today: "hoy",
        },
    };

	var installmentBox = document.querySelector('#sezzle-installment-widget-box');
	if (!installmentBox.querySelector('.sezzle-payment-schedule-container')) {
        // creates stylesheet for widget and modal
        // TODO: check all stylesheets and event listeners to ensure they will not conflict with local stylesheet or regular Sezzle widget!
		var sezzleStyle = document.createElement('style');
        sezzleStyle.innerHTML = `@import url("https://fonts.googleapis.com/css?family=Comfortaa");
		#sezzle-installment-widget-box button {
			display: inline;
			border: none;
			background: none !important;
			color: #392558 !important;
			cursor: pointer;
			font-size: 10px !important;
			font-family: Comfortaa !important;
			padding: 0px 0px 0px 5px !important;
		}
		#sezzle-installment-widget-box span {
			text-rendering: optimizeLegibility;
			font-weight: 400;
			letter-spacing: 0px;
			font-style: normal;
			line-height: 1.25 !important;
			list-style: none !important;
			box-sizing: border-box;
			font-family: Comfortaa !important;
			text-align: center !important;
		}
		.sezzle-modal-overlay div {
			font-family: Comfortaa !important;
			color: #392558 !important;
		}
		.sezzle-modal-overlay button {
			position: absolute !important;
			text-align: end !important;
			border: none !important;
			background: none !important;
			font-family: Comfortaa !important;
			color: #392558 !important;
		}
		.sezzle-modal-overlay h4 {
			font-family: Comfortaa !important;
			color: #392558 !important;
			text-align: center !important;
		}
		.sezzle-modal-overlay p {
			font-family: Comfortaa !important;
			color: #392558 !important;
			text-align: center !important;
		}
		.sezzle-modal-overlay span {
			font-family: Comfortaa !important;
			text-align: center !important;
			width: 25% !important;
		}
		#sezzle-installment-widget-box {
			background: #fafafa;
			width: 100%;
			height: fit-content;
			display:flex;
			justify-content: center;
			border-top: 1px solid #d9d9d9;
		}
		.sezzle-payment-schedule-container {
			width: fit-content;
			height: fit-content;
			padding: 10px 0px;
		}
		.sezzle-installment-widget {
			color: #392558 !important;
			font-size: 10px !important;
			text-align: center;
			font-family: Comfortaa !important;
		}
		.sezzle-installment-info-icon {
			display: inline !important;
			border: none !important;
			background: none !important;
			color: #392558 !important;
			cursor: pointer;
			font-size: 10px !important;
			font-family: Comfortaa !important;
			padding: 0px 0px 0px 5px !important;
		}
		.sezzle-total {
			display: none;
		}
		.sezzle-payment-pie {
			background: rgba(131, 51, 212, .05);
			border-radius: 11.483px;
			padding: 12px;
			width: fit-content;
			margin-top: 8px;
		}
		#sezzle-installment-widget-box .sezzle-pie-area {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 12px;
  		}
		#sezzle-installment-widget-box .sezzle-installment-container {
			display: flex;
			padding: 8px;
			flex-direction: row;
			align-items: flex-start;
			gap: 8px;
			border-radius: 11.483px;
			background: #ffffff;
		}
		#sezzle-installment-widget-box .sezzle-installment-container:first-child {
			align-items: center;
		}
		#sezzle-installment-widget-box .payment-item {
			display: inline-flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
  			gap: 8px;
		}
		#sezzle-installment-widget-box .pie-icon {
			position: relative;
		}
		#sezzle-installment-widget-box .pie-icon svg {
			width: 45.93px;
			height: 45.93px;
		}
		#sezzle-installment-widget-box .breakdown-row {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 2.3px;
		}
		#sezzle-installment-widget-box .installment-amount {
			text-align: center;
			color: #8333d4;
			font-size: 14px;
			font-family: Satoshi, "Open Sans", sans-serif;
			font-weight: 400;
			line-height: 16px;
			letter-spacing: 0.17px;
			word-wrap: break-word;
		}
		#sezzle-installment-widget-box .due-date {
			text-align: center;
			color: #5e5e5e;
			font-size: 10px;
			font-family: Satoshi, "Open Sans", sans-serif;
			font-weight: 400;
			line-height: 12px;
			letter-spacing: 0.46px;
			white-space: nowrap;
		}
		.sezzle-modal-open {
			position: fixed;
			top: 0;
			bottom: 0;
			right: 0;
			left: 0;
		}
		.sezzle-modal-overlay {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99999998;
			background-color: rgba(5,31,52,0.57);
			width: 100vw;
			height: 100vh;
			overflow-y: auto;
			overflow-x: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
			font-family: 'Comfortaa';
			color: #392558;
		}
		.sezzle-checkout-modal {
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			position: absolute;
			overflow: auto;
			border-radius: 10px;
			background: white;
			-ms-overflow-style: none;
			scrollbar-width: none;
			text-align: end;
			width:274px;
			max-width: 90%;
			max-height: 80%;
		}
		.sezzle-checkout-modal::-webkit-scrollbar {
			display: none;
		}
		.sezzle-checkout-modal .close-sezzle-modal {
			position: absolute;
			text-align: end;
			border: none;
			background: none;
			font-family: 'Comfortaa';
			color: #392558;
			right: 15px;
			padding: 0px;
			margin: 10px 0px -24px 0px;
		}
		.sezzle-modal-logo {
			background-image: url('https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg') !important;
			background-repeat: no-repeat  !important;
			background-position: center  !important;
			height: 20px  !important;
			margin: 20px 0px 35px  !important;
		}
		.sezzle-modal-title {
			text-align: center;
			font-size: 20px;
		}
		.sezzle-modal-overview {
			font-size: 10px;
			line-height:16px;
			text-align: center;
		}
		.sezzle-modal-overview p {
			margin: 10px 20px 0px 20px;
		}
		.sezzle-modal-payment-pie {
			background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDM4Ny41IDEwMi4zIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzODcuNSAxMDIuMzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+LnN0MHtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30uc3Qxe2ZpbGw6IzM4Mjc1Nzt9LnN0MntmaWxsOnVybCgjUGF0aF8xMF8pO30uc3Qze2ZpbGw6dXJsKCNQYXRoXzExXyk7fS5zdDR7ZmlsbDp1cmwoI1BhdGhfMTJfKTt9LnN0NXtmaWxsOnVybCgjUGF0aF8xM18pO30uc3Q2e2ZpbGw6dXJsKCNQYXRoXzE0Xyk7fS5zdDd7ZmlsbDp1cmwoI1BhdGhfMTVfKTt9LnN0OHtmaWxsOnVybCgjUGF0aF8xNl8pO30uc3Q5e2ZpbGw6dXJsKCNQYXRoXzE3Xyk7fS5zdDEwe2ZpbGw6dXJsKCNQYXRoXzE4Xyk7fS5zdDExe2ZpbGw6dXJsKCNQYXRoXzE5Xyk7fTwvc3R5bGU+PHRpdGxlPkdyb3VwPC90aXRsZT48ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz48ZyBpZD0iUGFnZS0xIj48ZyBpZD0iU2V6emxlLURlc2t0b3AtTW9kYWwiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MjEuMDAwMDAwLCAtMzY2LjAwMDAwMCkiPjxnIGlkPSJNb2RhbC1Qb3B1cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjk4LjAwMDAwMCwgOTcuMDAwMDAwKSI+PGcgaWQ9Ikdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMTguMDAwMDAwLCAyNjkuMDAwMDAwKSI+PGcgaWQ9IlBheW1lbnQtUGllLUdyYXBoaWMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI5LjAwMDAwMCwgMC4wMDAwMDApIj48ZyBpZD0iTmV3QnJhbmRfRm91clBheW1lbnRQaWUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMxNi4wMDAwMDAsIDAuMDAwMDAwKSI+PGxpbmVhckdyYWRpZW50IGlkPSJQYXRoXzEwXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItODc4LjQ2NjciIHkxPSI3LjE2NjciIHgyPSItODc3LjQ2NjciIHkyPSI3LjE2NjciIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMTggMCAwIDE4IDE1ODEyLjI2NTYgLTEwMCkiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I0NFNURDQiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC4yMDk1IiBzdHlsZT0ic3RvcC1jb2xvcjojQzU1OENDIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjU1MjUiIHN0eWxlPSJzdG9wLWNvbG9yOiNBQzRBQ0YiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjAuOTg0NSIgc3R5bGU9InN0b3AtY29sb3I6Izg1MzRENCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzgzMzNENCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PHBhdGggaWQ9IlBhdGgiIGNsYXNzPSJzdDIiIGQ9Ik0tMC4xLDIwYzAsOS45LDguMSwxOCwxOCwxOGwwLDBWMjBILTAuMXoiPjwvcGF0aD48bGluZWFyR3JhZGllbnQgaWQ9IlBhdGhfMTFfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii04NzguNDY2NyIgeTE9IjcuMTY2NyIgeDI9Ii04NzcuNDY2NyIgeTI9IjcuMTY2NyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOCAwIDAgMTggMTU4MzIuMjY1NiAtMTAwKSI+PHN0b3Agb2Zmc2V0PSIyLjM3MDAwMGUtMDIiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjU2NjciPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjAuNjU5MiIgc3R5bGU9InN0b3AtY29sb3I6I0ZDOEI4MiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I0ZCQTI4RSI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PHBhdGggaWQ9IlBhdGhfMV8iIGNsYXNzPSJzdDMiIGQ9Ik0zNy45LDIwYzAsOS45LTguMSwxOC0xOCwxOGwwLDBWMjBIMzcuOXoiPjwvcGF0aD48bGluZWFyR3JhZGllbnQgaWQ9IlBhdGhfMTJfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii04NzguNDY2NyIgeTE9IjcuMTY2NyIgeDI9Ii04NzcuNDY2NyIgeTI9IjcuMTY2NyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOCAwIDAgMTggMTU4MTIuMjY3NiAtMTIwKSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojRkNEN0I2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjUwNzEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRUE1MDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjgxMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxwYXRoIGlkPSJQYXRoXzJfIiBjbGFzcz0ic3Q0IiBkPSJNMTcuOSwwQzgsMC0wLjEsOC4xLTAuMSwxOGwwLDBoMThWMHoiPjwvcGF0aD48bGluZWFyR3JhZGllbnQgaWQ9IlBhdGhfMTNfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii04NzguNDY2NyIgeTE9IjcuMTY2NyIgeDI9Ii04NzcuNDY2NyIgeTI9IjcuMTY2NyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOCAwIDAgMTggMTU4MzIuMjY1NiAtMTIwKSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBCODc0Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjUxMjYiIHN0eWxlPSJzdG9wLWNvbG9yOiMyOUQzQTIiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjAuNjgxNyIgc3R5bGU9InN0b3AtY29sb3I6IzUzREZCNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzlGRjREOSI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PHBhdGggaWQ9IlBhdGhfM18iIGNsYXNzPSJzdDUiIGQ9Ik0xOS45LDBjOS45LDAsMTgsOC4xLDE4LDE4bDAsMGgtMThDMTkuOSwxOCwxOS45LDAsMTkuOSwweiI+PC9wYXRoPjwvZz48ZyBpZD0iTmV3QnJhbmRfRm91clBheW1lbnRQaWUtQ29weSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjA3LjAwMDAwMCwgMC4wMDAwMDApIj48bGluZWFyR3JhZGllbnQgaWQ9IlBhdGhfMTRfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii02NjAuNDY2NyIgeTE9IjcuMTY2NyIgeDI9Ii02NTkuNDY2NyIgeTI9IjcuMTY2NyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOCAwIDAgMTggMTE4ODguMjY1NiAtMTAwKSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojQ0U1RENCIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjIwOTUiIHN0eWxlPSJzdG9wLWNvbG9yOiNDNTU4Q0MiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjAuNTUyNSIgc3R5bGU9InN0b3AtY29sb3I6I0FDNEFDRiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC45ODQ1IiBzdHlsZT0ic3RvcC1jb2xvcjojODUzNEQ0Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojODMzM0Q0Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48cGF0aCBpZD0iUGF0aF80XyIgY2xhc3M9InN0NiIgZD0iTS0wLjEsMjBjMCw5LjksOC4xLDE4LDE4LDE4VjIwSC0wLjF6Ij48L3BhdGg+PGxpbmVhckdyYWRpZW50IGlkPSJQYXRoXzE1XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItNjYwLjQ2NjciIHkxPSI3LjE2NjciIHgyPSItNjU5LjQ2NjciIHkyPSI3LjE2NjciIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMTggMCAwIDE4IDExOTA4LjI2NTYgLTEwMCkiPjxzdG9wIG9mZnNldD0iMi4zNzAwMDBlLTAyIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY1NjY3Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjY1OTIiIHN0eWxlPSJzdG9wLWNvbG9yOiNGQzhCODIiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGQkEyOEUiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxwYXRoIGlkPSJQYXRoXzVfIiBjbGFzcz0ic3Q3IiBkPSJNMzcuOSwyMGMwLDkuOS04LjEsMTgtMTgsMThsMCwwVjIwSDM3Ljl6Ij48L3BhdGg+PGxpbmVhckdyYWRpZW50IGlkPSJQYXRoXzE2XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItNjYwLjQ2NjciIHkxPSI3LjE2NjciIHgyPSItNjU5LjQ2NjciIHkyPSI3LjE2NjciIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMTggMCAwIDE4IDExOTA4LjI2NTYgLTEyMCkiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzAwQjg3NCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC41MTI2IiBzdHlsZT0ic3RvcC1jb2xvcjojMjlEM0EyIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjY4MTciIHN0eWxlPSJzdG9wLWNvbG9yOiM1M0RGQjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiM5RkY0RDkiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxwYXRoIGlkPSJQYXRoXzZfIiBjbGFzcz0ic3Q4IiBkPSJNMTkuOSwwYzkuOSwwLDE4LDguMSwxOCwxOGwwLDBoLTE4QzE5LjksMTgsMTkuOSwwLDE5LjksMHoiPjwvcGF0aD48L2c+PGcgaWQ9Ik5ld0JyYW5kX0ZvdXJQYXltZW50UGllLUNvcHktMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTEzLjAwMDAwMCwgMC4wMDAwMDApIj48bGluZWFyR3JhZGllbnQgaWQ9IlBhdGhfMTdfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii00NzIuNDY2NyIgeTE9IjcuMTY2NyIgeDI9Ii00NzEuNDY2NyIgeTI9IjcuMTY2NyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOCAwIDAgMTggODUwNC4yNjU2IC0xMDApIj48c3RvcCBvZmZzZXQ9IjIuMzcwMDAwZS0wMiIgc3R5bGU9InN0b3AtY29sb3I6I0ZGNTY2NyI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC42NTkyIiBzdHlsZT0ic3RvcC1jb2xvcjojRkM4QjgyIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojRkJBMjhFIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48cGF0aCBpZD0iUGF0aF83XyIgY2xhc3M9InN0OSIgZD0iTTE3LjksMjBjMCw5LjktOC4xLDE4LTE4LDE4bDAsMFYyMEgxNy45eiI+PC9wYXRoPjxsaW5lYXJHcmFkaWVudCBpZD0iUGF0aF8xOF8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTQ3Mi40NjY3IiB5MT0iNy4xNjY3IiB4Mj0iLTQ3MS40NjY3IiB5Mj0iNy4xNjY3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDE4IDAgMCAxOCA4NTA0LjI2NTYgLTEyMCkiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzAwQjg3NCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC41MTI2IiBzdHlsZT0ic3RvcC1jb2xvcjojMjlEM0EyIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjY4MTciIHN0eWxlPSJzdG9wLWNvbG9yOiM1M0RGQjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiM5RkY0RDkiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxwYXRoIGlkPSJQYXRoXzhfIiBjbGFzcz0ic3QxMCIgZD0iTS0wLjEsMGM5LjksMCwxOCw4LjEsMTgsMThsMCwwaC0xOEMtMC4xLDE4LTAuMSwwLTAuMSwweiI+PC9wYXRoPjwvZz48ZyBpZD0iTmV3QnJhbmRfRm91clBheW1lbnRQaWUtQ29weS0zIj48bGluZWFyR3JhZGllbnQgaWQ9IlBhdGhfMTlfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii0yNDYuNDY2NyIgeTE9IjcuMTY2NyIgeDI9Ii0yNDUuNDY2NyIgeTI9IjcuMTY2NyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOCAwIDAgMTggNDQzNi4yNjYxIC0xMjApIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMEI4NzQiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjAuNTEyNiIgc3R5bGU9InN0b3AtY29sb3I6IzI5RDNBMiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC42ODE3IiBzdHlsZT0ic3RvcC1jb2xvcjojNTNERkI2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojOUZGNEQ5Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48cGF0aCBpZD0iUGF0aF85XyIgY2xhc3M9InN0MTEiIGQ9Ik0tMC4xLDBjOS45LDAsMTgsOC4xLDE4LDE4bDAsMGgtMThDLTAuMSwxOC0wLjEsMC0wLjEsMHoiPjwvcGF0aD48L2c+PGcgaWQ9IkxpbmUtMiI+PHBhdGggY2xhc3M9InN0MSIgZD0iTTgzLjYsMjAuMkM4My42LDIwLjIsODMuNiwyMC4yLDgzLjYsMjAuMmwtNDMuNS0wLjRjLTAuNiwwLTEtMC41LTEtMWMwLTAuNSwwLjUtMSwxLTFjMCwwLDAsMCwwLDBsNDMuNSwwLjRjMC42LDAsMSwwLjUsMSwxQzg0LjYsMTkuOCw4NC4xLDIwLjIsODMuNiwyMC4yeiI+PC9wYXRoPjwvZz48ZyBpZD0iTGluZS0yLUNvcHkiPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xODkuNiwyMC4yQzE4OS42LDIwLjIsMTg5LjYsMjAuMiwxODkuNiwyMC4ybC00My41LTAuNGMtMC42LDAtMS0wLjUtMS0xYzAtMC41LDAuNS0xLDEtMWMwLDAsMCwwLDAsMGw0My41LDAuNGMwLjYsMCwxLDAuNSwxLDFDMTkwLjYsMTkuOCwxOTAuMSwyMC4yLDE4OS42LDIwLjJ6Ij48L3BhdGg+PC9nPjxnIGlkPSJMaW5lLTItQ29weS0yIj48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzAzLjYsMjAuMkMzMDMuNiwyMC4yLDMwMy42LDIwLjIsMzAzLjYsMjAuMmwtNDMuNS0wLjRjLTAuNiwwLTEtMC41LTEtMWMwLTAuNSwwLjUtMSwxLTFjMCwwLDAsMCwwLDBsNDMuNSwwLjRjMC42LDAsMSwwLjUsMSwxQzMwNC42LDE5LjgsMzA0LjEsMjAuMiwzMDMuNiwyMC4yeiI+PC9wYXRoPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==);
			background-repeat: no-repeat;
			background-position: center;
			height: 63px;
			width: 100%;
			margin: 40px 0px -35px 0px;
		}
		.sezzle-modal-payment-percent, .sezzle-modal-payment-schedule {
			display: flex;
			justify-content: space-around;
			width: 100%;
		}
		.sezzle-modal-payment-schedule {
			margin-bottom: 20px;
		}
		.sezzle-modal-payment-percent span {
			color: #392558;
			font-size: 12px;
			font-family: Comfortaa !important;
			text-align: center;
			width: 25%;
			margin-top:5px;
		}
		.sezzle-modal-payment-schedule span {
			color: #737373;
			font-size: 9px;
			font-family: Comfortaa !important;
			text-align: center;
			width: 25%;
		}
		@media only screen and (min-width: 520px){
			.sezzle-checkout-modal {
				// transform: scale(1.5) translate(-50%, -50%);
				// top: 55%;
				// left: 55%;
				width: 430px;
				max-width: 80%;
				max-height: 80%;
			}
			.sezzle-checkout-modal .close-sezzle-modal {
				font-size: 18px;
			}
			.sezzle-modal-logo {
				height: 30px  !important;
			}
			.sezzle-modal-title {
				font-size: 30px;
			}
			.sezzle-modal-overview {
				font-size: 14px;
				line-height: 20px;
			}
			.sezzle-modal-overview p {
				margin: 10px 50px 0px 50px;
			}
			.sezzle-modal-installment-wrapper {
				margin: 0px 15px;
			}
			.sezzle-modal-payment-pie {
				height: 90px;
				margin: 30px 0px -55px 0px;
			}
			.sezzle-modal-payment-percent span {
				font-size: 18px;
			}
			.sezzle-modal-payment-schedule span {
				font-size: 12px;
			}
		}
		`;
        installmentBox.appendChild(sezzleStyle);

        // creates the wrapper
        var installmentContainer = document.createElement("div");
        installmentContainer.className = "sezzle-payment-schedule-container";
        installmentBox.appendChild(installmentContainer);

        // creates the intro verbiage
        var installmentWidget = document.createElement("div");
        installmentWidget.className = "sezzle-installment-widget";
        installmentContainer.appendChild(installmentWidget);
        installmentWidget.innerHTML =
            translation[language].installmentWidget[interval];
        installmentWidget.tabIndex = 0;

        // creates the pie graphic
        var sezzlePie = document.createElement("div");
        sezzlePie.className = "sezzle-payment-pie";
        sezzlePie.innerHTML = `<div class="sezzle-pie-area">
			<div class="sezzle-installment-container">
				<div class="payment-item">
					<div class="pie-icon" title="pie at 25%">
						<svg xmlns="http://www.w3.org/2000/svg" width="46" height="47" viewBox="0 0 46 47" fill="none">
							<path d="M45.9594 23.0996C45.9594 35.7835 35.677 46.0659 22.9931 46.0659C10.3092 46.0659 0.0268555 35.7835 0.0268555 23.0996C0.0268555 10.4157 10.3092 0.133301 22.9931 0.133301C35.677 0.133301 45.9594 10.4157 45.9594 23.0996ZM11.51 23.0996C11.51 29.4415 16.6512 34.5827 22.9931 34.5827C29.3351 34.5827 34.4763 29.4415 34.4763 23.0996C34.4763 16.7576 29.3351 11.6164 22.9931 11.6164C16.6512 11.6164 11.51 16.7576 11.51 23.0996Z" fill="#8333D4" fill-opacity="0.05"></path>
							<path d="M22.9927 0.133171C26.0086 0.133171 28.9951 0.727215 31.7815 1.88138C34.5679 3.03554 37.0997 4.72722 39.2323 6.85984C41.3649 8.99245 43.0566 11.5242 44.2107 14.3106C45.3649 17.097 45.9589 20.0835 45.9589 23.0994L34.4758 23.0994C34.4758 21.5915 34.1788 20.0982 33.6017 18.705C33.0246 17.3118 32.1788 16.0459 31.1125 14.9796C30.0462 13.9133 28.7803 13.0675 27.3871 12.4904C25.9939 11.9133 24.5007 11.6163 22.9927 11.6163L22.9927 0.133171Z" fill="#8333D4"></path>
							<path d="M45.9589 23.0994C45.9589 26.2704 43.3884 28.8408 40.2174 28.8408C37.0464 28.8408 34.4758 26.2704 34.4758 23.0994C34.4758 19.9285 37.0464 17.3577 40.2174 17.3577C43.3884 17.3577 45.9589 19.9285 45.9589 23.0994Z" fill="#8333D4"></path>
							<ellipse cx="40.2181" cy="23.0995" rx="5.74157" ry="5.74157" fill="#8333D4"></ellipse>
						</svg>
					</div>
					<div class="breakdown-row">
						<div class="installment-amount"></div>
						<div class="due-date"></div>
					</div>
				</div>
			</div>
			<div class="sezzle-installment-container">
				<div class="payment-item">
					<div class="pie-icon" title="pie at 50%">
						<svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
							<path d="M46.1933 23.0998C46.1933 35.7837 35.9109 46.0661 23.227 46.0661C10.5431 46.0661 0.260742 35.7837 0.260742 23.0998C0.260742 10.4159 10.5431 0.133545 23.227 0.133545C35.9109 0.133545 46.1933 10.4159 46.1933 23.0998ZM11.7439 23.0998C11.7439 29.4418 16.8851 34.583 23.227 34.583C29.569 34.583 34.7101 29.4418 34.7101 23.0998C34.7101 16.7579 29.569 11.6167 23.227 11.6167C16.8851 11.6167 11.7439 16.7579 11.7439 23.0998Z" fill="#8333D4" fill-opacity="0.05"></path>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M23.2953 46.0655C35.9478 46.0287 46.1933 35.7605 46.1933 23.0993C46.1933 10.4154 35.911 0.133057 23.2271 0.133057V11.6162C29.569 11.6162 34.7102 16.7574 34.7102 23.0993C34.7102 29.4413 29.569 34.5825 23.2271 34.5825V34.5828C20.0562 34.5829 17.4858 37.1535 17.4858 40.3243C17.4858 43.4953 20.0564 46.0659 23.2274 46.0659C23.2501 46.0659 23.2727 46.0658 23.2953 46.0655Z" fill="#8333D4"></path>
						</svg>
					</div>
					<div class="breakdown-row">
						<div class="installment-amount"></div>
						<div class="due-date"></div>
					</div>
				</div>
				<div class="payment-item">
					<div class="pie-icon" title="pie at 75%">
					<svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
						<path d="M46.0663 23.0996C46.0663 35.7835 35.784 46.0659 23.1001 46.0659C10.4161 46.0659 0.133789 35.7835 0.133789 23.0996C0.133789 10.4157 10.4161 0.133301 23.1001 0.133301C35.784 0.133301 46.0663 10.4157 46.0663 23.0996ZM11.6169 23.0996C11.6169 29.4415 16.7581 34.5827 23.1001 34.5827C29.442 34.5827 34.5832 29.4415 34.5832 23.0996C34.5832 16.7576 29.442 11.6164 23.1001 11.6164C16.7581 11.6164 11.6169 16.7576 11.6169 23.0996Z" fill="#8333D4" fill-opacity="0.05"></path>
						<path d="M23.1001 0.133368C27.6424 0.133368 32.0826 1.48031 35.8594 4.00388C39.6362 6.52745 42.5799 10.1143 44.3181 14.3108C46.0564 18.5074 46.5112 23.1251 45.625 27.5801C44.7389 32.0352 42.5516 36.1274 39.3397 39.3392C36.1278 42.5511 32.0356 44.7385 27.5806 45.6246C23.1255 46.5108 18.5078 46.056 14.3112 44.3177C10.1147 42.5795 6.52787 39.6358 4.0043 35.859C1.48074 32.0822 0.133788 27.6419 0.133788 23.0996L11.6169 23.0996C11.6169 25.3708 12.2904 27.5909 13.5522 29.4793C14.814 31.3677 16.6074 32.8395 18.7057 33.7087C20.8039 34.5778 23.1128 34.8052 25.3403 34.3621C27.5678 33.9191 29.6139 32.8254 31.2199 31.2194C32.8258 29.6135 33.9195 27.5674 34.3625 25.3399C34.8056 23.1124 34.5782 20.8035 33.7091 18.7052C32.84 16.607 31.3681 14.8135 29.4797 13.5518C27.5914 12.29 25.3712 11.6165 23.1001 11.6165L23.1001 0.133368Z" fill="#8333D4"></path>
						<path d="M11.6169 23.0996C11.6169 26.2706 9.04634 28.8412 5.87536 28.8412C2.70438 28.8412 0.133788 26.2706 0.133788 23.0996C0.133788 19.9287 2.70438 17.3581 5.87536 17.3581C9.04634 17.3581 11.6169 19.9287 11.6169 23.0996Z" fill="#8333D4"></path>
						<ellipse cx="5.87536" cy="23.0997" rx="5.74157" ry="5.74157" fill="#8333D4"></ellipse>
					</svg>
					</div>
					<div class="breakdown-row">
						<div class="installment-amount"></div>
						<div class="due-date">due-date</div>
					</div>
				</div>
				<div class="payment-item">
					<div class="pie-icon" title="pie at 100%">
						<svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
							<path d="M46.4394 23.0996C46.4394 35.7835 36.157 46.0659 23.4731 46.0659C10.7892 46.0659 0.506836 35.7835 0.506836 23.0996C0.506836 10.4157 10.7892 0.133301 23.4731 0.133301C36.157 0.133301 46.4394 10.4157 46.4394 23.0996ZM11.99 23.0996C11.99 29.4415 17.1311 34.5827 23.4731 34.5827C29.8151 34.5827 34.9562 29.4415 34.9562 23.0996C34.9562 16.7576 29.8151 11.6164 23.4731 11.6164C17.1311 11.6164 11.99 16.7576 11.99 23.0996Z" fill="#8333D4"></path>
						</svg>
					</div>
					<div class="breakdown-row">
						<div class="installment-amount"></div>
						<div class="due-date"><sup>3</sup></div>
					</div>
				</div>
			</div>
		</div>`;
        installmentContainer.appendChild(sezzlePie);
        sezzlePie.title = translation[language].paymentPieTitle;

        // creates container to receive the installment prices
        var installmentPriceContainer = document.createElement("div");
        installmentPriceContainer.className = "sezzle-payment-schedule-prices";
        installmentContainer.appendChild(installmentPriceContainer);

        // checks if character is numeric
        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        function isAlphabet(n) {
            return /^[a-zA-Z()]+$/.test(n);
        }

        function currencyType(priceText) {
            var currency = "";
            if (currencySymbol) {
                currency = currencySymbol;
            } else {
                for (var i = 0; i < priceText.length; i++) {
                    if (/[$|€||£|₤|₹]/.test(priceText[i])) {
                        currency = priceText[i];
                    }
                    // use this instead if on ISO-8859-1, expanding to include any applicable currencies
                    // https://html-css-js.com/html/character-codes/currency/
                    // if(priceText[i] == String.fromCharCode(8364)){ //€ = 8364, 128 = , 163 = £, 8377 = ₹
                    // 	currency = String.fromCharCode(8364)
                    // }
                }
            }
            return currency || "$";
        }

        // checks if price is comma (fr) format or period (en)
        function commaDelimited(priceText) {
            var priceOnly = "";
            for (var i = 0; i < priceText.length; i++) {
                if (
                    isNumeric(priceText[i]) ||
                    priceText[i] === "." ||
                    priceText[i] === ","
                ) {
                    priceOnly += priceText[i];
                }
            }
            var isComma = false;
            if (priceOnly.indexOf(",") > -1 && priceOnly.indexOf(".") > -1) {
                isComma = priceOnly.indexOf(",") > priceOnly.indexOf(".");
            } else if (priceOnly.indexOf(",") > -1) {
                isComma = priceOnly[priceOnly.length - 3] === ",";
            } else if (priceOnly.indexOf(".") > -1) {
                isComma = priceOnly[priceOnly.length - 3] !== ".";
            } else {
                isComma = false;
            }
            return isComma;
        }

        // parses the checkout total text to numerical digits only
        function parsePriceString(price, includeComma) {
            var formattedPrice = "";
            for (var i = 0; i < price.length; i++) {
                if (
                    isNumeric(price[i]) ||
                    (!includeComma && price[i] === ".") ||
                    (includeComma && price[i] === ",")
                ) {
                    // If current is a . and previous is a character, it can be something like Rs, ignore it
                    if (i > 0 && price[i] === "." && isAlphabet(price[i - 1]))
                        continue;
                    formattedPrice += price[i];
                }
            }
            if (includeComma) {
                formattedPrice = formattedPrice.replace(",", ".");
            }
            return parseFloat(formattedPrice);
        }

        // creates the installment price elements
        function createInstallmentPrice(
            installmentPrice,
            includeComma,
            currency,
            installmentElement
        ) {
            installmentElement.innerText =
                currency +
                (includeComma
                    ? installmentPrice.replace(".", ",")
                    : installmentPrice);
        }

        // calculates installment price from total price element content
        var totalPriceText = checkoutTotal.innerText;
        var includeComma = commaDelimited(totalPriceText);
        var price = parsePriceString(totalPriceText, includeComma);
        var currency = currencyType(totalPriceText);
        var installmentAmount = (price / 4).toFixed(2);
        const installmentPriceElements = document
            .querySelector("#sezzle-installment-widget-box")
            ?.getElementsByClassName("installment-amount");
        if (
            !installmentPriceElements ||
            installmentPriceElements.length !== 4
        ) {
            return;
        }
        for (var i = 0; i < 3; i++) {
            createInstallmentPrice(
                installmentAmount,
                includeComma,
                currency,
                installmentPriceElements[i]
            );
        }
        // creates final installment as installment price + remainder if not divisible by 4
        var finalInstallmentAmount = (price - installmentAmount * 3).toFixed(2);
        createInstallmentPrice(
            finalInstallmentAmount,
            includeComma,
            currency,
            installmentPriceElements[3]
        );

        // creates container to receive the installment dates
        var installmentPlanContainer = document.createElement("div");
        installmentPlanContainer.className =
            "sezzle-payment-schedule-frequency";
        installmentContainer.appendChild(installmentPlanContainer);

        // creates the installment date elements
        function createPaymentPlan(date, dateElement) {
            dateElement.innerHTML = date;
        }

        // parses today's date to calculate each installment date
        // TODO: french date translation
        var todaysDate = new Date();

        const dateElements = document
            .querySelector("#sezzle-installment-widget-box")
            ?.getElementsByClassName("due-date");
        if (!dateElements || dateElements.length !== 4) {
            return;
        }
        for (var i = 0; i < 4; i++) {
            if (i === 0) {
                createPaymentPlan(translation[language].today, dateElements[0]);
            } else if (i > 0) {
                var installmentDate = new Date(
                    todaysDate.setDate(todaysDate.getDate() + interval)
                ).toLocaleDateString(language, {
                    month: "short",
                    day: "numeric",
                });
                createPaymentPlan(installmentDate, dateElements[i]);
            }
        }

        // creates the info icon to open the modal
        var infoIcon = document.createElement("button");
        infoIcon.className = "sezzle-installment-info-icon";
        infoIcon.type = "button";
        infoIcon.title = translation[language].infoIcon;
        infoIcon.innerHTML = "&#9432;";
        infoIcon.tabIndex = 0;
        installmentWidget.appendChild(infoIcon);
        infoIcon.addEventListener("click", () => {
            renderModal();
        });
    }
}

    function disableBodyScroll(disable) {
        const bodyElement = document.body;
        if (disable) {
            scrollDistance =
                window.pageYOffset ||
                (document.documentElement.clientHeight
                    ? document.documentElement.scrollTop
                    : document.body.scrollTop) ||
                0;
            bodyElement.classList.add("sezzle-modal-open");
            bodyElement.style.top = `${scrollDistance * -1}px`;
        } else {
            bodyElement.classList.remove("sezzle-modal-open");
            window.scrollTo(0, scrollDistance);
            bodyElement.style.top = 0;
            if (document.querySelector(".sezzle-modal")) {
                document.querySelector(".sezzle-modal").scrollTop = 0;
            }
            scrollDistance = 0;
        }
    }

    function handleModalClose(modalNode) {
        disableBodyScroll(false);
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

    function addModalCloseListeners(modalNode) {
        Array.prototype.forEach.call(
            document.querySelectorAll(".close-sezzle-modal, .close-btn"),
            (el) => {
                el.addEventListener("click", (event) => {
                    handleModalClose(modalNode);
                });
            }
        );
        // prevent modal close on modal body click
        const sezzleModal = document.querySelector("#sezzle-modal-core-content");
        sezzleModal?.addEventListener("click", (event) => {
                event.stopPropagation()
            }
        );
    }

    function executeModalScript() {
        if (ModalUI) {
            ModalUI.load();
        } else {
            console.log(
                "ModalUI is undefined. Problem adding modal script to the document"
            );
        }
    }

    async function getModalContent(modalNode) {
        const sezzleModalURL =
            "https://media.sezzle.com/shopify-app/assets/sezzle-modal-4.0.4.html";
        try {
            const modalNodeContent = document.getElementById(
                "sezzle-modal-core-content"
            )
            if(modalNodeContent?.innerHTML){
                return;
            };
            const response = await httpRequestWrapper("GET", sezzleModalURL);
            modalNode.innerHTML = response;
            // // append modal JS to document head
            const head = document.head;
            const script = document.createElement("script");
            script.innerHTML = modalNode.querySelector("script").innerHTML;
            head.appendChild(script);
            executeModalScript();
        } catch (e) {
            console.error("Unable to fetch Sezzle modal content", e);
        }
    }

    function createModal() {
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

    function renderModal() {
        disableBodyScroll(true);
        let modalNode = createModal();
        getModalContent(modalNode);
        addModalCloseListeners(modalNode);
        modalNode.style.display = "block";
        modalNode.focus();
        const modals = modalNode.getElementsByClassName("sezzle-modal");
        if (modals.length) {
            modals[0].className = "sezzle-modal";
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
                throw new Error(
                    "Something went wrong, contact the Sezzle team!"
                );
            }
            return await response.text();
        } catch (e) {
            console.log(e.message);
        }
    }