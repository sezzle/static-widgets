function renderSezzleButton (){
    var sezzleButtonContainer = document.querySelector('sezzle-button');

    //  creates sezzle button style
    var sezzleStyle = document.createElement('style');
    sezzleStyle.type = "style/css";
    sezzleStyle.innerText = `
    button {
        width:auto;
        height:40px;
        cursor:pointer;
        outline:none;
        border:transparent;
        font-family:'Comfortaa',cursive;
        margin-bottom: 10px;
        font-size: 0.8125em;
        padding-right: 20px;
        padding-left: 20px;
        letter-spacing: 0.15em;
      
    }
    .ripple {
        background-position: center;
        transition: background 0.8s;
        
      }
      .ripple:hover {
        background: #d784ff radial-gradient(circle, purple 70%, #d784ff 70%) center/15000%;
        color:white;
      }
      .ripple:active {
        background-color: #d784ff;
        background-size: 100%;
        color:white;
        transition: background 0s;
      }
      
    img {
        position: relative;
        width: 50px;
        top: 3px;
        }
    }
    `;
    sezzleButtonContainer.appendChild(sezzleStyle);

    // creates the button element
    var sezzleButton = document.createElement('button');
    sezzleButton.type = 'submit';
    sezzleButton.classList.add('sezzle-checkout-button');
    sezzleButtonContainer.appendChild(sezzleButton);

    // handles theme
    var sezzleLogo = '';
    if(sezzleButtonContainer.getAttribute('theme') === "dark"){
        sezzleLogo = 'https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg';
        sezzleButton.style.color = '#392558';
        sezzleButton.style.background = '#fff';
        sezzleButton.classList.add('sezzle-button-dark');
    } else {
        sezzleLogo = 'https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor_WhiteWM.svg';
        sezzleButton.style.color = 'white';
        sezzleButton.style.background = '#392558';
        sezzleButton.classList.add('sezzle-button-light');
    }

    // handles button template
  	var sezzleButtonTemplate = sezzleButtonContainer.getAttribute('template') || "Checkout with %%logo%%";
    var templateArray = sezzleButtonTemplate.split(' ');
    var templateString = '';
    templateArray.forEach((subtemplate) => {
      switch (subtemplate) {
        case '%%logo%%':
            templateString += `<img class='sezzle-button-logo-img' src=${sezzleLogo} />`;
          break;
        default:
          templateString += `${subtemplate} `;
      }
    })
    sezzleButton.innerHTML = templateString;

    // handles borderType
    switch (sezzleButtonContainer.getAttribute('borderType')) {
        case 'square':
          sezzleButton.style.borderRadius = '0px';
          break;
        case 'semi-rounded':
            sezzleButton.style.borderRadius = '5px';
          break;
        default:
            sezzleButton.style.borderRadius = '300px';
      }
    
    //  handles paddingX
    var sezzleButtonPadding = sezzleButtonContainer.getAttribute('paddingX') || '13px';
    sezzleButton.style.paddingLeft = sezzleButtonPadding;
    sezzleButton.style.paddingRight = sezzleButtonPadding;

    //  click event listener, redirects shopper to Shopify standard checkout
    sezzleButton.addEventListener('click', function (event) {
        event.stopPropagation();
        event.preventDefault();
        location.replace('/checkout');
      });
}
document.addEventListener("DOMContentLoaded", renderSezzleButton());