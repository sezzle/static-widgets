// INSTALLATION
// 1. Create a copy of this entire file within your store

// 2.a (recommended) Add the following script to inject the placeholder element dynamically
// add the following lines of code to run when the page has loaded (un-commented) and update the query to match your page:
	// Note: our top four platforms are given as examples - choose one or create your own
		// <script type="text/javascript">
			// document.addEventListener('readystatechange', function(){
				// var sezzlePaymentLine = document.querySelector('[alt="Sezzle"]').parentElement.parentElement.parentElement; //Shopify
				// var sezzlePaymentLine = document.querySelector('.payment_method_sezzlepay'); // WooCommerce
				// var sezzlePaymentLine = document.querySelector('.sezzle'); // CommentSold
				// var sezzlePaymentLine = document.querySelector('.linkGateway'); //3DCart
			// var sezzleCheckoutWidget = document.createElement('div');
			// sezzleCheckoutWidget.id = 'sezzle-installment-widget-box';
			// sezzlePaymentLine.parentElement.insertBefore(sezzleCheckoutWidget, sezzlePaymentLine.nextElementSibling);
			// })
		// </script>

// 2.b Enter the following two lines of code (un-commented) where this widget should appear
	{/* <div id="sezzle-installment-widget-box"></div> */}
	{/* <script src="sezzle-checkout-installment-widget.js"></script> */}

// 3. Update the querySelector target in checkoutTotal below to indicate the cart total element
	// Note: our top four platforms are given as examples - choose one or create your own

// handles initial render, then watches checkout total for change event, updates installment amounts
document.addEventListener('readystatechange', function(event){
	var merchantLocale = "" // "['US', 'CA', 'IN', 'GU', 'PR', 'VI', 'AS', 'MP']" serves bi-weekly product, else serves monthly
	var currencySymbol = ""; // if not provided, it will attempt to detect the currency symbol from the price text. If site uses charset="ISO-8859-1", use String.fromCharCode() - param is HTML hex char code integer
	var checkoutTotal = document.querySelector('.payment-due__price'); // Shopify
	// var checkoutTotal = document.querySelector('.order-total').querySelector('.woocommerce-Price-amount'); // WooCommerce
	// var checkoutTotal = document.querySelector('.total').getElementsByTagName('SPAN')[1]; // CommentSold
	// var checkoutTotal = document.querySelector('.total_total') // 3DCart
	renderInstallmentWidget(checkoutTotal, merchantLocale, currencySymbol);

		// create an observer instance
		var observer = new MutationObserver(function(){
			document.querySelector('#sezzle-installment-widget-box').innerHTML = '';
			renderInstallmentWidget(checkoutTotal, merchantLocale, currencySymbol);
		});

		// configuration of the observer:
		var config = { attributes: true, childList: true, characterData: true };

		// pass in the target node, as well as the observer options
		observer.observe(checkoutTotal, config);
})

function renderInstallmentWidget(checkoutTotal, serviceRegion, currencySymbol){
	var language = document.querySelector('html').lang.substring(0,2).toLowerCase() || navigator.language.substring(0,2) || 'en';
	var merchantLocale = serviceRegion || document.querySelector('html').lang.split('-')[1] || "US";

	// sets payment plan based on given param
	var biWeeklyLocales = ['US', 'CA', 'IN', 'GU', 'PR', 'VI', 'AS', 'MP'];
	var interval = biWeeklyLocales.indexOf(merchantLocale) > -1 ? 14 : 30;

	// handles translations
	var translation = {
		'en': {
			'today': 'today',
			'days': 'days',
			'week': 'week',
			'month': 'month',
			'installmentWidget': {
				14: `4 interest-free payments over 6 weeks`,
				30: `4 payments over 3 months. No Fee!`
			},
			'modalTitle': 'How it works',
			'firstParagraph': {
				14: `Split your entire order into 4 interest-free payments over 6 weeks. No fees if you pay on time with zero impact to your credit.`,
				30: `Split your entire order into 4 payments over 3 months. No Fee!`
			},
			'secondParagraph': 'After clicking "Complete Order" on this site, you will be redirected to Sezzle to complete your purchase securely.',
			'infoIcon': 'Learn More about Sezzle',
            'paymentPieTitle': 'Sezzle payment pie chart',
            'closeModalTitle': 'Close Modal',
            'modalPie': 'Sezzle modal payment pie chart'
		},
		'fr': {
			'today': 'aujourd\'hui',
			'days': 'jours',
			'week': 'semaine',
			'month': 'mois',
			'installmentWidget': {
				14: `4 paiement sans inte&#769;re&#770;ts r&#233;partis sur 6 semaines`,
				30: `4 paiement r&#233;partis sur 3 mois. Pas de frais!`,
			},
			'modalTitle': 'Comment &#231;a marche',
			'firstParagraph': {
				14: `R&#233;partissez le montant de votre commande en 4 versements sans int&#233;r&#234;ts &#233;tal&#233;s sur 6 semaines. Pas de frais si vous payez &#224; temps, pas d\'impact sur votre cote de cr&#233;dit.`,
				30:	`R&#233;partissez le montant de votre commande en 4 versements sur 3 mois. Pas de frais!`
			},
			'secondParagraph': 'Apr&#232;s avoir cliqu&#233; sur &#171;&nbsp;Terminer la commande&nbsp;&#187; sur ce site, vous serez redirig&#233;(e) vers Sezzle pour finaliser votre achat en toute s&#233;curit&#233;.',
			'infoIcon': 'En savoir plus sur Sezzle',
            'paymentPieTitle': 'Graphique circulaire de paiement Sezzle',
            'closeModalTitle': 'Fermer modal',
            'modalPie': 'Graphique circulaire de paiement modal Sezzle'
		},
		'de': {
			'today': 'heute',
			'days': 'Tage',
			'week': 'Woche',
			'month': 'Monat',
			'installmentWidget': {
				14: `4 zinslose Raten &#252;ber 6 Wochen verteilt`,
				30: `4 Raten &#252;ber 3 Monate verteilt - Kostenlos!`,
			},
			'modalTitle': 'So funktioniert\'s',
			'firstParagraph': {
				14: `Dein Gesamtbestellwert wird auf 4 Raten &#252;ber 6 Wochen verteilt. Diese sind komplett zinsfrei, sofern du p&#252;nktlich bezahlst. Kein Einfluss auf deine Kreditw&#252;rdigkeit.`,
				30: `Dein Gesamtbestellwert wird auf 4 Raten &#252;ber 3 Monate verteilt. Diese sind komplett kostenlos.`
			},
			'secondParagraph':'Sobald du auf den Button &#8222;Bestellung abschlie&#223;en&#8220; klickst, wirst du zu Sezzle umgeleitet ' + (interval === 30 ? 'um' : 'und kannst') + ' deinen Einkauf sicher '+ (interval === 30 ? 'abzuschlie&#223;en.' : 'abschlie&#223;en.'),
			'infoIcon': 'Erfahren Sie mehr über Sezzle',
            'paymentPieTitle': 'Sezzle-Zahlungskreisdiagramm',
            'closeModalTitle': 'Modal schließen',
            'modalPie': 'Sezzle Kreisdiagramm für modale Zahlungen'
		},
		'es': {
			'today': 'hoy',
			'days': 'dias',
			'week': 'semana',
			'month': 'mes',
			'installmentWidget': {
				14: `4 pagos sin intereses durante 6 semanas`,
				30: `4 pagos durante 3 mes. &#161;Sin cargo!`
			},
			'modalTitle': 'C&#243;mo funciona',
			'firstParagraph': {
				14: `Divida su pedido completo en 4 pagos sin intereses durante 6 semanas. Sin cargos si paga a tiempo sin impacto en su cr&#233;dito.`,
				30: `Divida su pedido completo en 4 pagos durante 3 meses. &#161;Sin cargo!`
			},
			'secondParagraph': 'Despu&#233;s de hacer clic en &quot;Completar pedido&quot; en este sitio, ser&#225; redirigido a Sezzle para completar su compra de forma segura.',
			'infoIcon': 'Más información sobre Sezzle',
            'paymentPieTitle': 'Gráfico circular de pagos de Sezzle',
            'closeModalTitle': 'Cerrar modal',
            'modalPie': 'Gráfico circular de pago modal de Sezzle'
		},
		'it': {
		    'today': 'oggi',
		    'days': 'giorni',
		    'week': 'settimana',
		    'month': 'mese',
		    'installmentWidget': {
			14: `4 rate senza interessi in 6 settimane`,
			30: `4 rate in 3 mesi. Senza costi!`
		    },
		    'modalTitle': 'Come funziona',
		    'firstParagraph': {
			14: `Dividi l&lsquo;intero ordine in 4 rate senza interessi in 6 settimane. Nessuna commissione se paghi in tempo e con impatto zero sul tuo credito.`,
			30: `Dividi l&rsquo;intero ordine in 4 rate in 3 mesi. Senza costi!`
		    },
		    'secondParagraph': 'Dopo aver cliccato su &ldquo;Completa l&rsquo;ordine&rdquo; in questa pagina, verrai reindirizzato a Sezzle per completare l&rsquo;acquisto in modo sicuro',
		    'infoIcon': 'Maggiori informazioni riguardo Sezzle',
            'paymentPieTitle': 'Grafico a torta di pagamento Sezzle',
            'closeModalTitle': 'Chiudere modale',
            'modalPie': 'Grafico a torta di pagamento modale Sezzle'
		}
	}

	var installmentBox = document.querySelector('#sezzle-installment-widget-box');
	if(!installmentBox.querySelector('.sezzle-payment-schedule-container')){
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
			width: 25% !important;
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
			height: 140px;
			display:flex;
			justify-content: center;
			border-top: 1px solid #d9d9d9;
		}
		.sezzle-payment-schedule-container {
			width: 290px;
			height: 100px;
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
			background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDM4Ny41IDEwMi4zIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzODcuNSAxMDIuMzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+LnN0MHtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30uc3Qxe2ZpbGw6IzM4Mjc1Nzt9LnN0MntmaWxsOnVybCgjUGF0aF8xMF8pO30uc3Qze2ZpbGw6dXJsKCNQYXRoXzExXyk7fS5zdDR7ZmlsbDp1cmwoI1BhdGhfMTJfKTt9LnN0NXtmaWxsOnVybCgjUGF0aF8xM18pO30uc3Q2e2ZpbGw6dXJsKCNQYXRoXzE0Xyk7fS5zdDd7ZmlsbDp1cmwoI1BhdGhfMTVfKTt9LnN0OHtmaWxsOnVybCgjUGF0aF8xNl8pO30uc3Q5e2ZpbGw6dXJsKCNQYXRoXzE3Xyk7fS5zdDEwe2ZpbGw6dXJsKCNQYXRoXzE4Xyk7fS5zdDExe2ZpbGw6dXJsKCNQYXRoXzE5Xyk7fTwvc3R5bGU+PHRpdGxlPkdyb3VwPC90aXRsZT48ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz48ZyBpZD0iUGFnZS0xIj48ZyBpZD0iU2V6emxlLURlc2t0b3AtTW9kYWwiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MjEuMDAwMDAwLCAtMzY2LjAwMDAwMCkiPjxnIGlkPSJNb2RhbC1Qb3B1cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjk4LjAwMDAwMCwgOTcuMDAwMDAwKSI+PGcgaWQ9Ikdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMTguMDAwMDAwLCAyNjkuMDAwMDAwKSI+PGcgaWQ9IlBheW1lbnQtUGllLUdyYXBoaWMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI5LjAwMDAwMCwgMC4wMDAwMDApIj48ZyBpZD0iTmV3QnJhbmRfRm91clBheW1lbnRQaWUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMxNi4wMDAwMDAsIDAuMDAwMDAwKSI+PGxpbmVhckdyYWRpZW50IGlkPSJQYXRoXzEwXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItODc4LjQ2NjciIHkxPSI3LjE2NjciIHgyPSItODc3LjQ2NjciIHkyPSI3LjE2NjciIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMTggMCAwIDE4IDE1ODEyLjI2NTYgLTEwMCkiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I0NFNURDQiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC4yMDk1IiBzdHlsZT0ic3RvcC1jb2xvcjojQzU1OENDIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjU1MjUiIHN0eWxlPSJzdG9wLWNvbG9yOiNBQzRBQ0YiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjAuOTg0NSIgc3R5bGU9InN0b3AtY29sb3I6Izg1MzRENCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzgzMzNENCI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PHBhdGggaWQ9IlBhdGgiIGNsYXNzPSJzdDIiIGQ9Ik0tMC4xLDIwYzAsOS45LDguMSwxOCwxOCwxOGwwLDBWMjBILTAuMXoiPjwvcGF0aD48bGluZWFyR3JhZGllbnQgaWQ9IlBhdGhfMTFfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii04NzguNDY2NyIgeTE9IjcuMTY2NyIgeDI9Ii04NzcuNDY2NyIgeTI9IjcuMTY2NyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOCAwIDAgMTggMTU4MzIuMjY1NiAtMTAwKSI+PHN0b3Agb2Zmc2V0PSIyLjM3MDAwMGUtMDIiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjU2NjciPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjAuNjU5MiIgc3R5bGU9InN0b3AtY29sb3I6I0ZDOEI4MiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I0ZCQTI4RSI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PHBhdGggaWQ9IlBhdGhfMV8iIGNsYXNzPSJzdDMiIGQ9Ik0zNy45LDIwYzAsOS45LTguMSwxOC0xOCwxOGwwLDBWMjBIMzcuOXoiPjwvcGF0aD48bGluZWFyR3JhZGllbnQgaWQ9IlBhdGhfMTJfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii04NzguNDY2NyIgeTE9IjcuMTY2NyIgeDI9Ii04NzcuNDY2NyIgeTI9IjcuMTY2NyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOCAwIDAgMTggMTU4MTIuMjY3NiAtMTIwKSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojRkNEN0I2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjUwNzEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRUE1MDAiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjgxMDAiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxwYXRoIGlkPSJQYXRoXzJfIiBjbGFzcz0ic3Q0IiBkPSJNMTcuOSwwQzgsMC0wLjEsOC4xLTAuMSwxOGwwLDBoMThWMHoiPjwvcGF0aD48bGluZWFyR3JhZGllbnQgaWQ9IlBhdGhfMTNfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii04NzguNDY2NyIgeTE9IjcuMTY2NyIgeDI9Ii04NzcuNDY2NyIgeTI9IjcuMTY2NyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOCAwIDAgMTggMTU4MzIuMjY1NiAtMTIwKSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBCODc0Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjUxMjYiIHN0eWxlPSJzdG9wLWNvbG9yOiMyOUQzQTIiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjAuNjgxNyIgc3R5bGU9InN0b3AtY29sb3I6IzUzREZCNiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzlGRjREOSI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PHBhdGggaWQ9IlBhdGhfM18iIGNsYXNzPSJzdDUiIGQ9Ik0xOS45LDBjOS45LDAsMTgsOC4xLDE4LDE4bDAsMGgtMThDMTkuOSwxOCwxOS45LDAsMTkuOSwweiI+PC9wYXRoPjwvZz48ZyBpZD0iTmV3QnJhbmRfRm91clBheW1lbnRQaWUtQ29weSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjA3LjAwMDAwMCwgMC4wMDAwMDApIj48bGluZWFyR3JhZGllbnQgaWQ9IlBhdGhfMTRfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii02NjAuNDY2NyIgeTE9IjcuMTY2NyIgeDI9Ii02NTkuNDY2NyIgeTI9IjcuMTY2NyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOCAwIDAgMTggMTE4ODguMjY1NiAtMTAwKSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojQ0U1RENCIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjIwOTUiIHN0eWxlPSJzdG9wLWNvbG9yOiNDNTU4Q0MiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjAuNTUyNSIgc3R5bGU9InN0b3AtY29sb3I6I0FDNEFDRiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC45ODQ1IiBzdHlsZT0ic3RvcC1jb2xvcjojODUzNEQ0Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojODMzM0Q0Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48cGF0aCBpZD0iUGF0aF80XyIgY2xhc3M9InN0NiIgZD0iTS0wLjEsMjBjMCw5LjksOC4xLDE4LDE4LDE4VjIwSC0wLjF6Ij48L3BhdGg+PGxpbmVhckdyYWRpZW50IGlkPSJQYXRoXzE1XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItNjYwLjQ2NjciIHkxPSI3LjE2NjciIHgyPSItNjU5LjQ2NjciIHkyPSI3LjE2NjciIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMTggMCAwIDE4IDExOTA4LjI2NTYgLTEwMCkiPjxzdG9wIG9mZnNldD0iMi4zNzAwMDBlLTAyIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY1NjY3Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjY1OTIiIHN0eWxlPSJzdG9wLWNvbG9yOiNGQzhCODIiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGQkEyOEUiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxwYXRoIGlkPSJQYXRoXzVfIiBjbGFzcz0ic3Q3IiBkPSJNMzcuOSwyMGMwLDkuOS04LjEsMTgtMTgsMThsMCwwVjIwSDM3Ljl6Ij48L3BhdGg+PGxpbmVhckdyYWRpZW50IGlkPSJQYXRoXzE2XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItNjYwLjQ2NjciIHkxPSI3LjE2NjciIHgyPSItNjU5LjQ2NjciIHkyPSI3LjE2NjciIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMTggMCAwIDE4IDExOTA4LjI2NTYgLTEyMCkiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzAwQjg3NCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC41MTI2IiBzdHlsZT0ic3RvcC1jb2xvcjojMjlEM0EyIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjY4MTciIHN0eWxlPSJzdG9wLWNvbG9yOiM1M0RGQjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiM5RkY0RDkiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxwYXRoIGlkPSJQYXRoXzZfIiBjbGFzcz0ic3Q4IiBkPSJNMTkuOSwwYzkuOSwwLDE4LDguMSwxOCwxOGwwLDBoLTE4QzE5LjksMTgsMTkuOSwwLDE5LjksMHoiPjwvcGF0aD48L2c+PGcgaWQ9Ik5ld0JyYW5kX0ZvdXJQYXltZW50UGllLUNvcHktMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTEzLjAwMDAwMCwgMC4wMDAwMDApIj48bGluZWFyR3JhZGllbnQgaWQ9IlBhdGhfMTdfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii00NzIuNDY2NyIgeTE9IjcuMTY2NyIgeDI9Ii00NzEuNDY2NyIgeTI9IjcuMTY2NyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOCAwIDAgMTggODUwNC4yNjU2IC0xMDApIj48c3RvcCBvZmZzZXQ9IjIuMzcwMDAwZS0wMiIgc3R5bGU9InN0b3AtY29sb3I6I0ZGNTY2NyI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC42NTkyIiBzdHlsZT0ic3RvcC1jb2xvcjojRkM4QjgyIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojRkJBMjhFIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48cGF0aCBpZD0iUGF0aF83XyIgY2xhc3M9InN0OSIgZD0iTTE3LjksMjBjMCw5LjktOC4xLDE4LTE4LDE4bDAsMFYyMEgxNy45eiI+PC9wYXRoPjxsaW5lYXJHcmFkaWVudCBpZD0iUGF0aF8xOF8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTQ3Mi40NjY3IiB5MT0iNy4xNjY3IiB4Mj0iLTQ3MS40NjY3IiB5Mj0iNy4xNjY3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDE4IDAgMCAxOCA4NTA0LjI2NTYgLTEyMCkiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzAwQjg3NCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC41MTI2IiBzdHlsZT0ic3RvcC1jb2xvcjojMjlEM0EyIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjY4MTciIHN0eWxlPSJzdG9wLWNvbG9yOiM1M0RGQjYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiM5RkY0RDkiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxwYXRoIGlkPSJQYXRoXzhfIiBjbGFzcz0ic3QxMCIgZD0iTS0wLjEsMGM5LjksMCwxOCw4LjEsMTgsMThsMCwwaC0xOEMtMC4xLDE4LTAuMSwwLTAuMSwweiI+PC9wYXRoPjwvZz48ZyBpZD0iTmV3QnJhbmRfRm91clBheW1lbnRQaWUtQ29weS0zIj48bGluZWFyR3JhZGllbnQgaWQ9IlBhdGhfMTlfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii0yNDYuNDY2NyIgeTE9IjcuMTY2NyIgeDI9Ii0yNDUuNDY2NyIgeTI9IjcuMTY2NyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOCAwIDAgMTggNDQzNi4yNjYxIC0xMjApIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMEI4NzQiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjAuNTEyNiIgc3R5bGU9InN0b3AtY29sb3I6IzI5RDNBMiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC42ODE3IiBzdHlsZT0ic3RvcC1jb2xvcjojNTNERkI2Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojOUZGNEQ5Ij48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48cGF0aCBpZD0iUGF0aF85XyIgY2xhc3M9InN0MTEiIGQ9Ik0tMC4xLDBjOS45LDAsMTgsOC4xLDE4LDE4bDAsMGgtMThDLTAuMSwxOC0wLjEsMC0wLjEsMHoiPjwvcGF0aD48L2c+PGcgaWQ9IkxpbmUtMiI+PHBhdGggY2xhc3M9InN0MSIgZD0iTTgzLjYsMjAuMkM4My42LDIwLjIsODMuNiwyMC4yLDgzLjYsMjAuMmwtNDMuNS0wLjRjLTAuNiwwLTEtMC41LTEtMWMwLTAuNSwwLjUtMSwxLTFjMCwwLDAsMCwwLDBsNDMuNSwwLjRjMC42LDAsMSwwLjUsMSwxQzg0LjYsMTkuOCw4NC4xLDIwLjIsODMuNiwyMC4yeiI+PC9wYXRoPjwvZz48ZyBpZD0iTGluZS0yLUNvcHkiPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xODkuNiwyMC4yQzE4OS42LDIwLjIsMTg5LjYsMjAuMiwxODkuNiwyMC4ybC00My41LTAuNGMtMC42LDAtMS0wLjUtMS0xYzAtMC41LDAuNS0xLDEtMWMwLDAsMCwwLDAsMGw0My41LDAuNGMwLjYsMCwxLDAuNSwxLDFDMTkwLjYsMTkuOCwxOTAuMSwyMC4yLDE4OS42LDIwLjJ6Ij48L3BhdGg+PC9nPjxnIGlkPSJMaW5lLTItQ29weS0yIj48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzAzLjYsMjAuMkMzMDMuNiwyMC4yLDMwMy42LDIwLjIsMzAzLjYsMjAuMmwtNDMuNS0wLjRjLTAuNiwwLTEtMC41LTEtMWMwLTAuNSwwLjUtMSwxLTFjMCwwLDAsMCwwLDBsNDMuNSwwLjRjMC42LDAsMSwwLjUsMSwxQzMwNC42LDE5LjgsMzA0LjEsMjAuMiwzMDMuNiwyMC4yeiI+PC9wYXRoPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==);
			background-repeat: no-repeat;
			background-position: center;
			height: 70px;
			width: 100%;
			margin: 15px 0px -45px 0px !important;
		}
		.sezzle-payment-schedule-prices, .sezzle-payment-schedule-frequency {
			width: 100%;
			display: flex;
			justify-content: space-around;
			font-family: Comfortaa;
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
			color: #565656 !important;
			font-size: 9px !important;
			font-family: Comfortaa !important;
			width: 25%;
			text-align: center;
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
			color: #595959;
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
		var installmentContainer = document.createElement('div');
		installmentContainer.className = 'sezzle-payment-schedule-container';
		installmentBox.appendChild(installmentContainer);

		// creates the intro verbiage
		var installmentWidget = document.createElement('div');
		installmentWidget.className = 'sezzle-installment-widget';
		installmentContainer.appendChild(installmentWidget);
		installmentWidget.innerHTML = translation[language].installmentWidget[interval];
        installmentWidget.tabIndex = 0;

		// creates the pie graphic
		var sezzlePie = document.createElement('div');
		sezzlePie.className = 'sezzle-payment-pie';
		installmentContainer.appendChild(sezzlePie);
        sezzlePie.title = translation[language].paymentPieTitle

		// creates container to receive the installment prices
		var installmentPriceContainer = document.createElement('div');
		installmentPriceContainer.className = 'sezzle-payment-schedule-prices';
		installmentContainer.appendChild(installmentPriceContainer);

		// checks if character is numeric
		function isNumeric(n){
			return !isNaN(parseFloat(n)) && isFinite(n);
		}

		function isAlphabet(n){
			return /^[a-zA-Z()]+$/.test(n)
		}

		function currencyType (priceText){
			var currency = '';
			if(currencySymbol){
				currency = currencySymbol;
			} else {
				for(var i = 0; i < priceText.length; i++){
					if(/[$|€||£|₤|₹]/.test(priceText[i])){
						currency = priceText[i];
					};
					// use this instead if on ISO-8859-1, expanding to include any applicable currencies
					// https://html-css-js.com/html/character-codes/currency/
					// if(priceText[i] == String.fromCharCode(8364)){ //€ = 8364, 128 = , 163 = £, 8377 = ₹
					// 	currency = String.fromCharCode(8364)
					// }
				}
			}
			return currency || '$';
		}


		// checks if price is comma (fr) format or period (en)
		function commaDelimited (priceText){
			var priceOnly = '';
			for (var i = 0; i < priceText.length; i++) {
				if (isNumeric(priceText[i]) || priceText[i] === '.' || priceText[i] === ',') {
				priceOnly += priceText[i];
				}
			}
			var isComma = false;
			if (priceOnly.indexOf(',') > -1 && priceOnly.indexOf('.') > -1) {
				isComma = priceOnly.indexOf(',') > priceOnly.indexOf('.');
			} else if (priceOnly.indexOf(',') > -1) {
				isComma = priceOnly[priceOnly.length - 3] === ',';
			} else if (priceOnly.indexOf('.') > -1) {
				isComma = priceOnly[priceOnly.length - 3] !== '.';
			} else {
				isComma = false;
			}
			return isComma;
		}

		// parses the checkout total text to numerical digits only
		function parsePriceString(price, includeComma) {
			var formattedPrice = '';
			for (var i = 0; i < price.length; i++) {
			  if (isNumeric(price[i]) || (!includeComma && price[i] === '.') || (includeComma && price[i] === ',')) {
				// If current is a . and previous is a character, it can be something like Rs, ignore it
				if (i > 0 && price[i] === '.' && isAlphabet(price[i-1])) continue;
				formattedPrice += price[i];
			  }
			}
			if (includeComma) {
				formattedPrice = formattedPrice.replace(',', '.');
			}
			return parseFloat(formattedPrice);
		}

		// creates the installment price elements
		function createInstallmentPrice (installmentPrice, includeComma, currency){
			var installmentElement = document.createElement('span');
			installmentElement.className = 'sezzle-installment-amount';
            installmentElement.tabIndex = 0;
			installmentElement.innerText = currency + (includeComma ? installmentPrice.replace('.',',') : installmentPrice)
			document.querySelector('.sezzle-payment-schedule-prices').appendChild(installmentElement);
		}

		// calculates installment price from total price element content
		var totalPriceText = checkoutTotal.innerText;
		var includeComma = commaDelimited(totalPriceText);
		var price = parsePriceString(totalPriceText, includeComma);
		var currency = currencyType(totalPriceText);
		var installmentAmount = (price/4).toFixed(2);
		for(var i = 0; i < 3; i++){
			createInstallmentPrice(installmentAmount, includeComma, currency);
		}
		// creates final installment as installment price + remainder if not divisible by 4
		var finalInstallmentAmount = (price - installmentAmount*3).toFixed(2);
		createInstallmentPrice(finalInstallmentAmount, includeComma, currency);

		// creates container to receive the installment dates
		var installmentPlanContainer = document.createElement('div');
		installmentPlanContainer.className = 'sezzle-payment-schedule-frequency';
		installmentContainer.appendChild(installmentPlanContainer);

		// creates the installment date elements
        function createPaymentPlan (date, i){
            var installmentElement = document.querySelectorAll(".sezzle-installment-amount")
			installmentElement[i].innerText = installmentElement[i].innerText + "\n" + date;
		}

		// parses today's date to calculate each installment date
		// TODO: french date translation
		var todaysDate = new Date();
		for(var i = 0; i < 4; i++){
            if (i === 0) {
                createPaymentPlan(translation[language].today, i);
            } else if (i > 0) {
                var installmentDate = new Date(todaysDate.setDate(todaysDate.getDate() + interval)).toLocaleDateString(language, {month: 'short', day: 'numeric'});
                createPaymentPlan(installmentDate, i);
            }
		}

		// create the modal container
		var modalOverlay = document.createElement('section');
		modalOverlay.className = 'sezzle-modal-overlay close-sezzle-modal';
		modalOverlay.style.display = 'none';
		document.body.appendChild(modalOverlay);

		// creates the modal content wrapper
		var modalContent = document.createElement('div');
		modalContent.className = 'sezzle-checkout-modal';
		modalOverlay.appendChild(modalContent);

		// creates the close modal button
		var closeModal = document.createElement('button');
		closeModal.className = 'close-sezzle-modal';
		closeModal.role = 'button';
		closeModal.type = 'button';
		closeModal.title = translation[language].modalTitle;
		closeModal.innerText = 'X';
        closeModal.tabIndex = 0;
		modalContent.appendChild(closeModal);

		// creates the Sezzle logo
		var sezzleLogo = document.createElement('div');
		sezzleLogo.className = 'sezzle-modal-logo';
		sezzleLogo.title = 'Sezzle';
		modalContent.appendChild(sezzleLogo);

		// creates the modal title
		var modalTitle = document.createElement('h1');
		modalTitle.className = 'sezzle-modal-title';
		modalContent.appendChild(modalTitle);
        modalTitle.tabIndex = 0;
		modalTitle.innerHTML = translation[language].modalTitle;

		// creates the description container
		var overview = document.createElement('div');
		overview.className = 'sezzle-modal-overview';
		modalContent.appendChild(overview);
        overview.tabIndex = 0;

		// creates the first overview paragraph
		var firstParagraph = document.createElement('p');
		overview.appendChild(firstParagraph);
		firstParagraph.innerHTML = translation[language].firstParagraph[interval];

		// creates the second overview paragraph
		var secondParagraph = document.createElement('p');
		overview.appendChild(secondParagraph);
		secondParagraph.innerHTML = translation[language].secondParagraph;

		// creates the modal content wrapper
		var installmentWrapper = document.createElement('div');
		installmentWrapper.className = 'sezzle-modal-installment-wrapper';
		modalContent.appendChild(installmentWrapper);

		// creates the modal pie graphic
		var modalPie = document.createElement('div');
		modalPie.className = 'sezzle-modal-payment-pie';
		installmentWrapper.appendChild(modalPie);
        modalPie.title = translation[language].modalPie;

		// creates the installment schedule container
		var percentages = document.createElement('div');
		percentages.className = 'sezzle-modal-payment-percent';
        percentages.tabIndex = 0;
		installmentWrapper.appendChild(percentages);

		// creates each percentage
		for(var i = 0; i < 4; i++){
			var percent = document.createElement('span');
			percent.innerText = '25%';
			percentages.appendChild(percent);
		}

		// creates the installment schedule container
		var sampleSchedule = document.createElement('div');
		sampleSchedule.className = 'sezzle-modal-payment-schedule';
        sampleSchedule.tabIndex = 0;
		installmentWrapper.appendChild(sampleSchedule);

		// creates each installment
        for(var i = 0; i < 4; i++){
			var payment = document.querySelector(".sezzle-modal-payment-percent").getElementsByTagName("span")
			if (i === 0){
				payment[i].innerText = payment[i].innerText + "\n" + translation[language].today;
			}  else if( i > 0 && interval === 30){
				payment[i].innerText = payment[i].innerText + (i*30) + " " + translation[language].days;
			} else if (i > 0){
                payment[i].innerText = payment[i].innerText + "\n" + translation[language].week + " " + (i*2); 
            } else {
				payment.innerTextinnerText = translation[language].week + "\n" + " " + (i*2);
			}
		}

		// creates the info icon to open the modal
		var infoIcon = document.createElement('button');
		infoIcon.className = 'sezzle-installment-info-icon';
		infoIcon.role = 'button';
		infoIcon.type = 'button';
		infoIcon.title = translation[language].infoIcon;
		infoIcon.innerHTML = '&#9432;';
		installmentWidget.appendChild(infoIcon);

		// watches info icon for click event, opens modal
		function openSezzleModal (){
			document.querySelector('.sezzle-modal-overlay').style.display = "block";
			document.body.classList.add('sezzle-modal-open');
            modalKeyboardNavigation()
		}
		infoIcon.addEventListener('click', openSezzleModal);
        infoIcon.addEventListener('click', () => {
            document.querySelector(".sezzle-checkout-modal").getElementsByClassName("close-sezzle-modal")[0].focus();
            console.log("OPEN MODAL")
        });

		// watches overlay and modal X for click event, closes modal
		function closeSezzleModal (){
			document.querySelector('.sezzle-modal-overlay').style.display = "none";
			document.body.classList.remove('sezzle-modal-open')
		}
		var sezzleModalClose = document.getElementsByClassName('close-sezzle-modal');
		if(sezzleModalClose.length){
			for(var i = 0; i < sezzleModalClose.length; i++){
				sezzleModalClose[i].addEventListener('click', closeSezzleModal);
                sezzleModalClose[i].addEventListener('click', () => {
                    document.querySelector(".sezzle-installment-info-icon").focus();
                    console.log("CLOSE MODAL")
                });
			}
		}
	}

    // allows for proper screen reader navigation through modal
    function modalKeyboardNavigation (){
		let focusableElements = document.querySelector('.sezzle-checkout-modal').querySelectorAll('[tabIndex="0"]');
		let firstFocusableElement = focusableElements[0];
		let lastFocusableElement = focusableElements[focusableElements.length - 1];
		document.addEventListener('keydown', function(event){
			if(event.key === 'Tab'){
				if(event.shiftKey && document.activeElement === firstFocusableElement){
					lastFocusableElement.focus();
				} else if(document.activeElement === lastFocusableElement){
					firstFocusableElement.focus();
				}
			} else if(event.key === 'Escape') {
				let modals = document.getElementsByClassName('sezzle-modal-overlay');
				for(let i = 0; i < modals.length; i++) {
					modals[i].style.display = 'none';
				}
				var newFocus = document.querySelector('#sezzle-modal-return');
				if(newFocus){
					newFocus.focus();
					newFocus.removeAttribute('id');
				} else if (document.querySelector('.sezzle-payment-schedule-container').querySelector('.sezzle-installment-info-icon')){
					document.querySelector('.sezzle-payment-schedule-container').querySelector('.sezzle-installment-info-icon').focus();
				  } else {
					document.querySelector('.sezzle-payment-schedule-container').focus();
				  }
			}
		})
	}
}


