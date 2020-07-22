
var price = '$ 24,99';

function isProductEligible(){
    var new_price = parsePrice(price);
    var productPrice = new_price;
    var priceInCents = productPrice * 100;
    return priceInCents >= 0 && priceInCents <= 250000;
}

function parsePrice(price) {
    return parseFloat(parsePriceStringModeComma(price));
}

function   parsePriceString(price, includeComma) {
    var formattedPrice = '';
    for (var i = 0; i < price.length; i++) {
      if (this.isNumeric(price[i]) || price[i] == '.' || (includeComma && price[i] == ',')) {
        if (i > 0 && price[i] == '.' && this.isAlphabet(price[i - 1])) continue;
        formattedPrice += price[i];
      }
    }
    return formattedPrice;
}
function   parsePriceStringModeComma(price) {
    var formattedPrice = '';
    for (var i = 0; i < price.length; i++) {
      if (isNumeric(price[i]) || price[i] == ',') {
        if (i > 0 && price[i] == ',' && isAlphabet(price[i - 1])) continue;   
        if(price[i] === ',') {
            formattedPrice +=   '.';
        } else{
            formattedPrice += price[i];
        }
      }
    }
    
    return formattedPrice;
}

function isAlphabet(n) {
    return /^[a-zA-Z()]+$/.test(n);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

if (isProductEligible()) {
    console.log(parsePrice(price))
}