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
			height: 210px;
			display:flex;
			justify-content: center;
			border-top: 1px solid #d9d9d9;
		}
		.sezzle-payment-schedule-container {
			width: 311px;
			height: 190px;
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
			height: 130px;
			width: 100%;
			margin: 15px 0px -45px 0px !important;
		}
		.sezzle-payment-schedule-prices, .sezzle-payment-schedule-frequency {
			width: 278px;
			display: flex;
			justify-content: space-around;
			font-family: Comfortaa;
			padding: 0 16px;
		}
		.sezzle-installment-amount {
			color: #392558 !important;
			font-size: 12px !important;
			font-family: Comfortaa !important;
			padding-top:5px;
			width: 25%;
			text-align: center;
		}
		.sezzle-payment-date {
			color: #737373 !important;
			font-size: 9px !important;
			font-family: Comfortaa !important;
			width: 25%;
			text-align: center;
		}
		.sezzle-installment-amount:first-child, .sezzle-payment-date:first-child {
			width: 87px !important;
    		padding-right: 8px;
		}
		.sezzle-installment-amount:last-child, .sezzle-payment-date:last-child {
			padding-right: 16px;
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
        sezzlePie.innerHTML = `<svg width="311" height="156" viewBox="0 0 311 156" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="311" height="156" rx="16" fill="#8333D4" fill-opacity="0.05"/>
<rect x="17" y="17" width="73" height="122" rx="8" fill="white"/>
<path d="M73 53C73 64.0457 64.0457 73 53 73C41.9543 73 33 64.0457 33 53C33 41.9543 41.9543 33 53 33C64.0457 33 73 41.9543 73 53ZM43 53C43 58.5228 47.4772 63 53 63C58.5228 63 63 58.5228 63 53C63 47.4772 58.5228 43 53 43C47.4772 43 43 47.4772 43 53Z" fill="#8333D4" fill-opacity="0.05"/>
<path d="M53 33C55.6264 33 58.2272 33.5173 60.6537 34.5224C63.0802 35.5275 65.285 37.0007 67.1421 38.8579C68.9993 40.715 70.4725 42.9198 71.4776 45.3463C72.4827 47.7728 73 50.3736 73 53L63 53C63 51.6868 62.7413 50.3864 62.2388 49.1732C61.7362 47.9599 60.9997 46.8575 60.0711 45.9289C59.1425 45.0003 58.0401 44.2638 56.8268 43.7612C55.6136 43.2587 54.3132 43 53 43L53 33Z" fill="#8333D4"/>
<path d="M73 53C73 55.7614 70.7614 57.9998 68 57.9998C65.2386 57.9998 63 55.7614 63 53C63 50.2386 65.2386 47.9998 68 47.9998C70.7614 47.9998 73 50.2386 73 53Z" fill="#8333D4"/>
<circle cx="68" cy="53" r="5" fill="#8333D4"/>
<rect x="98" y="17" width="196" height="122" rx="8" fill="white"/>
<path d="M155 53C155 64.0457 146.046 73 135 73C123.954 73 115 64.0457 115 53C115 41.9543 123.954 33 135 33C146.046 33 155 41.9543 155 53ZM125 53C125 58.5228 129.477 63 135 63C140.523 63 145 58.5228 145 53C145 47.4772 140.523 43 135 43C129.477 43 125 47.4772 125 53Z" fill="#8333D4" fill-opacity="0.05"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M155 53C155 64.0457 146.046 73 135 73C132.239 73 130 70.7614 130 68C130 65.2386 132.239 63 135 63C140.523 63 145 58.5228 145 53C145 47.4772 140.523 43 135 43V33C146.046 33 155 41.9543 155 53Z" fill="#8333D4"/>
<path d="M213.5 53C213.5 64.0457 204.546 73 193.5 73C182.454 73 173.5 64.0457 173.5 53C173.5 41.9543 182.454 33 193.5 33C204.546 33 213.5 41.9543 213.5 53ZM183.5 53C183.5 58.5228 187.977 63 193.5 63C199.023 63 203.5 58.5228 203.5 53C203.5 47.4772 199.023 43 193.5 43C187.977 43 183.5 47.4772 183.5 53Z" fill="#8333D4" fill-opacity="0.05"/>
<path d="M193.5 33C197.456 33 201.322 34.173 204.611 36.3706C207.9 38.5682 210.464 41.6918 211.978 45.3463C213.491 49.0009 213.887 53.0222 213.116 56.9018C212.344 60.7814 210.439 64.3451 207.642 67.1421C204.845 69.9392 201.281 71.844 197.402 72.6157C193.522 73.3874 189.501 72.9913 185.846 71.4776C182.192 69.9638 179.068 67.4004 176.871 64.1114C174.673 60.8224 173.5 56.9556 173.5 53L183.5 53C183.5 54.9778 184.086 56.9112 185.185 58.5557C186.284 60.2002 187.846 61.4819 189.673 62.2388C191.5 62.9957 193.511 63.1937 195.451 62.8079C197.391 62.422 199.173 61.4696 200.571 60.0711C201.97 58.6725 202.922 56.8907 203.308 54.9509C203.694 53.0111 203.496 51.0004 202.739 49.1732C201.982 47.3459 200.7 45.7841 199.056 44.6853C197.411 43.5865 195.478 43 193.5 43L193.5 33Z" fill="#8333D4"/>
<path d="M183.5 53C183.5 55.7614 181.261 58 178.5 58C175.739 58 173.5 55.7614 173.5 53C173.5 50.2386 175.739 48 178.5 48C181.261 48 183.5 50.2386 183.5 53Z" fill="#8333D4"/>
<circle cx="178.5" cy="53" r="5" fill="#8333D4"/>
<path d="M274.5 53C274.5 64.0457 265.546 73 254.5 73C243.454 73 234.5 64.0457 234.5 53C234.5 41.9543 243.454 33 254.5 33C265.546 33 274.5 41.9543 274.5 53ZM244.5 53C244.5 58.5228 248.977 63 254.5 63C260.023 63 264.5 58.5228 264.5 53C264.5 47.4772 260.023 43 254.5 43C248.977 43 244.5 47.4772 244.5 53Z" fill="#8333D4"/>
</svg>
`;
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
            currency
        ) {
            var installmentElement = document.createElement("span");
            installmentElement.className = "sezzle-installment-amount";
            installmentElement.tabIndex = 0;
            installmentElement.innerText =
                currency +
                (includeComma
                    ? installmentPrice.replace(".", ",")
                    : installmentPrice);
            document
                .querySelector(".sezzle-payment-schedule-prices")
                .appendChild(installmentElement);
        }

        // calculates installment price from total price element content
        var totalPriceText = checkoutTotal.innerText;
        var includeComma = commaDelimited(totalPriceText);
        var price = parsePriceString(totalPriceText, includeComma);
        var currency = currencyType(totalPriceText);
        var installmentAmount = (price / 4).toFixed(2);
        for (var i = 0; i < 3; i++) {
            createInstallmentPrice(installmentAmount, includeComma, currency);
        }
        // creates final installment as installment price + remainder if not divisible by 4
        var finalInstallmentAmount = (price - installmentAmount * 3).toFixed(2);
        createInstallmentPrice(finalInstallmentAmount, includeComma, currency);

        // creates container to receive the installment dates
        var installmentPlanContainer = document.createElement("div");
        installmentPlanContainer.className =
            "sezzle-payment-schedule-frequency";
        installmentContainer.appendChild(installmentPlanContainer);

        // creates the installment date elements
        function createPaymentPlan(date, i) {
            var installmentElement = document.querySelectorAll(
                ".sezzle-installment-amount"
            );
            installmentElement[i].innerText =
                installmentElement[i].innerText + "\n" + date;
        }

        // parses today's date to calculate each installment date
        // TODO: french date translation
        var todaysDate = new Date();
        for (var i = 0; i < 4; i++) {
            if (i === 0) {
                createPaymentPlan(translation[language].today, i);
            } else if (i > 0) {
                var installmentDate = new Date(
                    todaysDate.setDate(todaysDate.getDate() + interval)
                ).toLocaleDateString(language, {
                    month: "short",
                    day: "numeric",
                });
                createPaymentPlan(installmentDate, i);
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
            this.renderModal();
        });
    }
}

    function disableBodyScroll(disable) {
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

    function handleModalClose(modalNode) {
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

    function addModalCloseListeners(modalNode) {
        Array.prototype.forEach.call(
            document.querySelectorAll(".close-sezzle-modal, .close-btn"),
            (el) => {
                el.addEventListener("click", (event) => {
                    this.handleModalClose(modalNode);
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
            this.widgetEventLogger.logEvent(
                Events.Error,
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
            this.executeModalScript();
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