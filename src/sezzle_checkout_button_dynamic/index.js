class SezzleCheckoutButton {
  constructor(options){
    this.theme =  options.theme  || "light";
    this.template = options.template || "Checkout with %%logo%%";
    this.paddingX =  options.paddingX ||  "13px";
    this.borderType =  options.borderType || "rounded";
   }

/**
 * This function will parse template  to generate inner html of the button
 * @return templateString  -  Inner Html of the button
 */
   parseButtonTemplate () {
     const sezzleImage = {
       light: 'https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor_WhiteWM.svg',
       dark: 'https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg'
     };
     const chosenImage = sezzleImage[this.theme];
     const templateArray = this.template.split(' ');
     var templateString = '';
     templateArray.forEach((subtemplate)=>{
       switch(subtemplate) {
         case  "%%logo%%":
           templateString += `<img class='sezzle-button-logo-img' src=${chosenImage} />`;
           break;
         default:
           templateString += `${subtemplate} `;
       } 
     })
     return templateString;
   }
/*
 * This function will add border-radius to the button
 */
   styleButtonBorder(el) {
    switch (this.borderType) {
      case 'square':
        el.style.borderRadius = '0px';
        break;
      case 'semi-rounded':
        el.style.borderRadius = '5px';
        break;
      default:
        el.style.borderRadius = '300px';
    }
   }
/*
 * This function will add styling and classes to the button
 * This function will load comforta to DOM for the button
 */
   addButtonStyle(el) {
    this.styleButtonBorder(el);
    el.classList.add('sezzle-checkout-button');
    el.classList.add(`sezzle-button-${this.theme}`);
    el.style.paddingLeft = this.paddingX;
    el.style.paddingRight = this.paddingX;
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'https://fonts.googleapis.com/css?family=Comfortaa&display=swap" rel="stylesheet');
    document.head.appendChild(link);
   }
/**
 * This function will render the checkout button
 * This function  also adds event listeners  to the  button
 *
 */
   createButton () {
       var  checkoutButton = document.getElementsByName('checkout')[0];
       var checkoutButtonParent = checkoutButton  ? checkoutButton.parentElement : null;
       if (checkoutButtonParent) {
         var  sezzleCheckoutButton = document.createElement('button');
         sezzleCheckoutButton.innerHTML = this.parseButtonTemplate();
         this.addButtonStyle(sezzleCheckoutButton);
         sezzleCheckoutButton.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            location.replace('/checkout');
          });
        checkoutButtonParent.append(sezzleCheckoutButton);
       } else {
           console.error('Sezzle Checkout Button works only  on the  cart page.')
       }
   }

   init() {
    this.createButton()
   }

}
