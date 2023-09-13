# SDK de widget statique Sezzle

Ce SDK est un moyen d'installer le widget Sezzle sur le site Web d'un commerçant qui ne communique pas avec le serveur de Sezzle. Tout le code du widget, la configuration personnalisée, les images et les feuilles de style sont stockés localement dans le thème du magasin. Cette approche signifie une vitesse de chargement légèrement plus rapide et un plus grand contrôle du commerçant sur le widget - l'équipe Sezzle ne peut pas apporter de modifications au widget, pour le meilleur ou pour le pire.

## Implémentation du NPM

Utilisation de npm :
`npm install @sezzle/sezzle-static-widget`

Dans votre page produit, ajoutez l'extrait de code suivant à l'endroit où vous souhaitez que le widget s'affiche, en mettant à jour le chemin d'accès à `node_modules` pour votre structure de fichiers :
```js
<script type="text/javascript" src="../node_modules/@sezzle/sezzle-static-widget/dist/bundle.js"></script>
  <script>
    const renderSezzle = new AwesomeSezzle({
      amount: `${yourPriceVariableHere}`,
    });
    renderSezzle.init();
  </script>
```

Utilisez les options de configuration ci-dessous pour personnaliser l'apparence du widget comme vous le souhaitez.<br/>

## Implémentation HTML

* Remarque : la mise en œuvre varie considérablement selon la plateforme, le thème, etc. Vous trouverez ci-dessous un aperçu général du processus. Les extraits de code ci-dessous sont des <i>exemples</i> et devront peut-être être modifiés pour s'adapter à votre site. Pour les marchands Shopify, veuillez passer à la section suivante.

Créez un nouveau fichier Javascript dans le code de votre site, le cas échéant. <br/>
Copiez+collez <a href="https://github.com/sezzle/static-widgets/blob/production/dist/bundle.js">ce code minifié</a> dans le fichier nouvellement créé.<br/>
Importez le nouveau fichier dans la ou les pages où le widget Sezzle sera ajouté.<br/>
  ```html
   <script src="../scripts/sezzle-static-widget.js"></script>
  ```
Créez un élément d'espace réservé où le widget Sezzle doit être affiché sur la ou les pages, généralement sous l'élément conteneur de prix :<br/>
   ```html
     <div id="sezzle-widget"></div>
   ```
Ajoutez le script suivant sous l'élément d'espace réservé, en mettant à jour la valeur `price` pour refléter votre variable de prix qui restitue le prix actuel du produit ou le total du panier, le cas échéant.<br/>
   ```html
    <script>
    var renderSezzle = new AwesomeSezzle({
        amount: `${yourPriceVariableHere}`
    })
    renderSezzle.init();
    </script>
   ```
Prévisualisez vos modifications pour confirmer que le widget s'affiche correctement dans chacun des scénarios suivants<br/>
   - Prix régulier<br/>
   - Prix de vente<br/>
   - Sélection de variantes<br/>
   - Bureau<br/>
   -Mobile<br/>

Utilisez les options de configuration ci-dessous pour personnaliser l'apparence du widget comme vous le souhaitez.<br/>


## Implémentation de Shopify

Connectez-vous à l'administrateur de votre boutique Shopify<br/>
Cliquez sur Boutique en ligne > Thèmes<br/>
À côté du thème que vous souhaitez modifier, cliquez sur Actions, puis sélectionnez Modifier le code<br/>

Sous le dossier Actifs, cliquez sur « Ajouter un nouvel actif » <br/>
Dans l'onglet Créer un fichier vierge, nommez le fichier `sezzle-static-widget` et sélectionnez `.js` comme type de fichier, puis cliquez sur Ajouter un élément<br/>
Copiez le code du fichier de référentiel ci-dessous et collez-le dans ce nouveau fichier, puis cliquez sur Enregistrer<br/>
* `https://github.com/sezzle/static-widgets/blob/production/dist/bundle.js`

Ajoutez les lignes de code suivantes partout où le widget doit s'afficher sur la page du produit dans `templates/product.liquid` ou `sections/product-template.liquid`, selon le cas :

```html
<!-- Sezzle Static Widget -->
<div id="sezzle-widget"></div>
{{ 'sezzle-static-widget.js' | asset_url | script_tag }}
<script>
  var renderSezzle = new AwesomeSezzle({
      amount: '{{ product.selected_or_first_available_variant.price | money }}'
  })
  renderSezzle.init();
  document.onchange = function(){
    var newPrice = '{{product.selected_or_first_available_variant.price | money}}';
    renderSezzle.alterPrice(newPrice);
  }
</script>
<!-- End Sezzle Static Widget -->
```

Ajoutez les lignes de code suivantes partout où le widget doit s'afficher sur la page du panier dans `templates/cart.liquid` ou `sections/cart-template.liquid`, selon le cas :

```html
<!-- Sezzle Static Widget -->
<div id="sezzle-widget"></div>
{{ 'sezzle-static-widget.js' | asset_url | script_tag }}
<script>
  var renderSezzle = new AwesomeSezzle({
    amount: '{{ cart.total_price | money }}',
    alignment: 'right'
  })
  renderSezzle.init();
</script>
<!-- End Sezzle Static Widget -->
```

## Personnalisation de la configuration

Une fois le rendu du widget, des configurations supplémentaires peuvent être ajoutées à `AwesomeSezzle` pour modifier l'apparence. Vous trouverez ci-dessous un exemple présentant toutes les options. Cependant, `price` est la seule valeur requise.

```html
<script>
  var renderSezzle = new AwesomeSezzle({
    amount: '{{ product.selected_or_first_available_variant.price | money }}',
    renderElement: 'new-sezzle-widget-container-id',
    theme: 'light',
    modalTheme:'color',
    maxWidth: 400,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    alignment: 'left',
    alignmentSwitchMinWidth: 576,
    alignmentSwitchType: 'center',
    textColor: '#111',
    fontFamily: 'Comfortaa, sans-serif',
    fontSize: 12,
    fontWeight: 400,
    widgetType: 'product',
    fixedHeight: 0,
    logoSize: 1.0,
    logoStyle: {},
    language: 'en',
    parseMode: 'default',
    merchantLocale: 'North America'
  })
  renderSezzle.init();
</script>
```

`amount` (montant, obligatoire)

**objetif**: Le montant du prix cible, au format dollar.
**Type**: chaîne
**Défaut**: ''
**Détails supplémentaires**: fournissez la variable de prix du produit sous forme de modèle littéral,  Shopify.Liquid Exemple: `'{{ product.selected_or_first_available_variant.price | money }}'`

`renderElement` (élément de rendu, facultatif)

**objetif**: chemin depuis `targetXPath` vers l'élément de la page Web après lequel le widget Sezzle doit être rendu.
**Type**: chaîne
**Défaut**: `sezzle-widget`
**Détails supplémentaires**: fournissez le nom d'ID ou un tableau de noms d'ID qui correspondent aux éléments d'espace réservé du widget.

`theme` (thème, facultatif)

**objetif**: Met à jour la couleur du logo pour la coordonner et la contraster avec les différentes couleurs d'arrière-plan des sites Web.
**Type**: chaîne
**Options**: dark (sombre), light (clair), black-flat (noir mat), white-flat (blanc mat), grayscale (niveaux de gris), white (blanc)
**Défaut**: 'light'
**Détails supplémentaires**: Si le thème n'est pas spécifié, le widget tentera de détecter la couleur d'arrière-plan et d'appliquer le logo contrasté approprié. Utilisez `light` ou `black-flat` pour les arrière-plans clairs et `dark` ou `white-flat` pour les arrière-plans sombres.

`modalTheme` (Thème modal, facultatif)

**objetif**: met à jour la couleur modale pour la coordonner avec les sites couleur ou monochromes.
**Type**: chaîne
**Options**: color (couleur), grayscale (niveaux de gris)
**Défaut**: 'color'


`maxWidth` (largeur maximale, facultatif)

**objetif**: largeur maximale de l'élément widget en pixels.
**Type**: numéro
**Défaut**: 400
**Détails supplémentaires**: 200 pour un joli rendu du widget sur 2 lignes, 120 pour 3 lignes.

`marginTop` (marge en haut, facultatif)

**objetif**: quantité d'espace au-dessus du widget en pixels.
**Type**: numéro
**Défaut**: 0

`marginBottom` (marge du bas, facultatif)

**objetif**: quantité d'espace sous le widget en pixels.
**Type**: numéro
**Défaut**: 0

`marginLeft` (marge gauche, facultatif)

**objetif**: Quantité d'espace à gauche du widget en pixels.
**Type**: numéro
**Défaut**: 0

`marginRight` (marge droite, facultatif)

**objetif**: quantité d'espace droite du le widget en pixels.
**Type**: numéro
**Défaut**: 0

`alignment` (alignement, facultatif)

**objetif**: Alignement du widget par rapport à l'élément parent.
**Type**: chaîne
**Options**: left (gauche), center (centre), right (droite), auto
**Défaut**: 'left'


`alignmentSwitchMinWidth` (largeur minimale du commutateur d'alignement, facultatif)

**objetif**: largeur d'écran en pixels en dessous de laquelle l'alignement passe à `alignmentSwitchType` au lieu de `alignment`.
**Type**: numéro
**Défaut**: 760
**Détails supplémentaires**: le point d'arrêt le plus courant est *768* (ordinateur de poche ou ordinateur de bureau). `alignmentSwitchMinWidth` n'est généralement nécessaire que lorsque `alignment` n'est pas automatique.


`alignmentSwitchType` (type de commutateur d'alignement, facultatif)

**objetif**: Alignement du widget par rapport à l'élément parent à appliquer lorsque la largeur de la fenêtre d'affichage est plus étroite que `alignmentSwitchMinWidth`.
**Type**: chaîne
**Options**: left (gauche), center (centre), right (droite), auto
**Défaut**: 'auto'

`textColor` (couleur du texte, facultatif)

**objetif**: Couleur du texte du widget.
**Type**: chaîne
**Défaut**: '#111'
**Détails supplémentaires**: Accepte toutes sortes de valeurs (hexadécimales, rgb(), hsl(), etc...)

`fontFamily` (famille de polices, facultatif)

**objetif**: Famille de polices du texte du widget.
**Type**: chaîne
**Défaut**: 'inherit' (hériter)

`fontSize` (taille de police, facultatif)

**objetif**: Taille de la police du texte du widget en pixels.
**Type**: numéro
**Défaut**: 12
**Détails supplémentaires**: Entrez uniquement des chiffres. N'entrez pas l'unité (par exemple px) !

`fontWeight` (police Poids, facultatif)

**objetif**: Audace du texte du widget.
**Type**: numéro
**Défaut**: 300
**Détails supplémentaires**: 100 est le plus léger, 900 est le plus audacieux.

`widgetType` (facultatif)

**objetif**: Spécifie la catégorie de page sur laquelle le widget est affiché.
**Type**: chaîne
**Options**: product-page (page produit), product-preview (aperçu du produit), cart (panier)
**Défaut**: 'product-page'

`fixedHeight` (Hauteur fixe, facultatif)

**objetif**: définit la valeur CSS de la hauteur fixe
**Type**: numéro
**Défaut**: 0

`logoSize` (taille du logo, facultatif)

**objetif**: rapport auquel mettre à l'échelle le logo Sezzle.
**Type**: numéro
**Défaut**: 1.0
**Détails supplémentaires**: L'espace qu'occupe le logo entre le texte du widget et le lien/l'icône Plus d'informations est déterminé par la taille de la police. Lors d'une mise à l'échelle considérable du widget, il peut être nécessaire de remplacer le style pour ajuster les marges gauche et droite du logo à l'aide de `logoStyle`.

`logoStyle` (facultatif)

**objetif**: style personnalisé à appliquer au logo Sezzle dans le widget.
**Type**: objet
**Défaut**: {}
**Détails supplémentaires**: L'objet acceptera n'importe quel style CSS au format JSON. Les clés doivent être entourées de '', données en casDeChameau au lieu de cas-de-kebab, et séparées de la clé suivante par une virgule au lieu d'un point-virgule.

`language` (langue, facultatif)

**objetif**: Langue dans laquelle le texte du widget doit être rendu.
**Type**: chaîne
**Options**: 'en'
**Défaut**: document.querySelector('html').lang
**Détails supplémentaires**: Actuellement, Sezzle widget ne prend en charge que `en`, `fr`, `es` et `de`. Si la langue spécifiée n'est pas prise en charge, la traduction sera par défaut l'anglais.

`parseMode` (mode d'analyse, facultatif)

**objetif**: Permet au prix échelonné du widget de calculer et de formater correctement les devises étrangères.
**Type**: chaîne
**Options**: 'default' (défaut), 'comma' (virgule)
**Défaut**: 'default'

`merchantLocale` (paramètres régionaux du marchand, facultatif)

**objetif**: permet au widget d'afficher les détails corrects du programme, selon que le commerçant est inscrit via Sezzle North America ou Sezzle Europe.
**Type**: chaîne
**Options**: North America (Amérique du Nord), Europe
**Défaut**: 'North America'

### <b>Veuillez discuter avec le point de contact Sezzle avant d'utiliser les options de configuration ci-dessous :</b>

`widgetTemplate` (Modèle de widget, facultatif)

**objetif**: Contenu texte du widget. Modifie également la disposition du prix, du logo et de l'icône d'informations/en savoir plus dans le widget.
**Type**: chaîne, ou objet
**Défaut**: {en: 'or 4 interest-free payments of %%price%% with %%logo%% %%info%%', fr: 'ou 4 paiements de %%price%% sans intérêts avec %%logo%% %%info%%'}
**Détails supplémentaires**: Les modèles disponibles incluent `%%price%%` (prix), `%%logo%%`, `%%link%%` (lien), `%%info%%`, `%%question-mark%%` (point d'interrogation), `%%line-break%%` (saut de ligne), `%%afterpay-logo%%`, `%%afterpay-logo-grey%%` (logo afterpay-gris), `%%afterpay-info-icon%%` (icône info afterpay), `%%afterpay-link-icon%%` (icône de lien afterpay), `%%quadpay-logo%%`, `%%quadpay-logo-grey%%` (logo quadpay-gris), `%%quadpay-logo-white%%` (logo quadpay-blanc), `%%quadpay-info-icon%%` (icône info quadpay), `%%affirm-logo%%`, `%%affirm-logo-grey%%` (affirm logo gris), `%%affirm-logo-white%%` (affirm logo blanc), `%%affirm-info-icon%%` (info icône affirm), `%%klarna-logo%%`, `%%klarna-logo-grey%%` (klarna logo gris), `%%klarna-logo-white%%` (klarna logo blanc), `%%klarna-info-icon%%` (icône info klarna).


`numberOfPayments` (nombre de paiements, facultatif)

**objetif**: numéro de versements par lesquels l'acheteur paiera le total, calcule le montant des versements dans le widget.
**Type**: numéro
**Défaut**: 4
**Détails supplémentaires**: Très peu de commerçants proposent autre chose qu'un modèle à 4 paiements. Cette sélection n'affecte pas l'apparence du modal.

`minPrice` (prix minimum, facultatif)

**objetif**: Prix minimum en centimes pour lequel Sezzle peut être sélectionné lors du paiement. Si le prix sur `targetXPath` est inférieur à ce numéro, le widget s'affichera avec une note indiquant le prix minimum éligible obligatoire.
**Type**: numéro
**Défaut**: 0
**Détails supplémentaires**: Cette configuration n'empêche pas un client de payer avec Sezzle en dessous de ce prix. Pour plus d'informations sur la définition d'une passerelle minimale, contactez votre représentant Merchant Success ou utilisez la section Contactez-nous du tableau de bord Sezzle Merchant.


`maxPrice` (prix maximum, facultatif)

**objetif**: Prix maximum en centimes pour lequel le widget doit être rendu. Si le prix sur `targetXPath` est supérieur à ce numéro, le widget ne s'affichera pas sur la page.
**Type**: numéro
**Défaut**: 250000

`altLightboxHTML` (visionneuse alternative HTML, facultatif)

**objetif**: remplace la conception modale par défaut par l'extrait de code fourni.
**Type**: chaîne
**Défaut**: ''

`qpModalHTML` (facultatif)

**objetif**: L'extrait de code du modal du concurrent, qui s'ouvrira lorsque l'on cliquera sur le logo du concurrent.
**Type**: chaîne
**Défaut**: ''

`apModalHTML` (facultatif)

**objetif**: L'extrait de code du modal du concurrent, qui s'ouvrira lorsque l'on cliquera sur le logo du concurrent.
**Type**: chaîne
**Défaut**: ''

`apLink` (lien Afterpay, facultatif)

**objetif**: L'URL de la page À propos du concurrent, qui s'ouvrira dans un nouvel onglet lorsque vous cliquerez sur le logo du concurrent.
**Type**: chaîne
**Défaut**: `https://www.afterpay.com/purchase-payment-agreement`

`affirmModalHTML` (facultatif)

**objetif**: L'extrait de code du modal du concurrent, qui s'ouvrira lorsque l'on cliquera sur le logo du concurrent.
**Type**: chaîne
**Défaut**: ''

`klarnaModalHTML` (facultatif)

**objetif**: L'extrait de code du modal du concurrent, qui s'ouvrira lorsque l'on cliquera sur le logo du concurrent.
**Type**: chaîne
**Défaut**: ''

### <b>Les éléments suivants sont réservés aux commerçants inscrits à notre programme de paiement à long terme. Veuillez en discuter avec le point de contact Sezzle avant d'utiliser les options de configuration ci-dessous :</b>

`minPriceLT` (prix minimum à long terme, facultatif)

**objetif**: Prix minimum en centimes pour lequel l'achat est éligible au prêt à long terme. Au-dessus de ce montant, les mensualités avec intérêts seront répercutées dans le widget et le modal. En dessous de ce montant, le widget et le modal à 4 paiements seront rendus.
**Type**: numéro
**Défaut**: 0
**Détails supplémentaires**: L'option `maxPrice` doit être remplacée par `4000000` à long terme.

`bestAPR` (meilleur APR, facultatif)

**objetif**: taux TAEG standard selon lequel les intérêts doivent être calculés.
**Type**: numéro
**Défaut**: 9.99

`widgetTemplateLT` (modèle de widget à long terme, facultatif)

**objetif**: Contenu texte du widget. Modifie également la disposition du prix, du logo et de l'icône d'informations/en savoir plus dans le widget.
**Type**: chaîne, ou objet
**Défaut**: `or monthly payments as low as %%price%% with %%logo%% %%info%%`
**Détails supplémentaires**: Les modèles disponibles incluent `%%price%%` (prix), `%%logo%%`, `%%link%%` (lien), `%%info%%`, `%%question-mark%%` (point d'interrogation), `%%line-break%%` (saut de ligne).

`ltAltModalHTML` (HTML modal alternatif à long terme, facultatif)

**objetif**: remplace la conception modale par défaut par l'extrait de code fourni.
**Type**: chaîne


## Functions
Les fonctions suivantes sont intégrées au widget statique et sont prêtes à être utilisées pour l'installation de votre widget. Ajoutez simplement l'extrait applicable au code de votre page Web, en mettant à jour l'écouteur d'événement et les variables si nécessaire.

1. `alterPrice(nouveauPrix)` - Modifie le prix sur le widget. Créez un écouteur d'événement après `renderSezzle.init()` qui appelle cette fonction où `nouveauPrix` est la nouvelle valeur de prix de la variante sélectionnée. Exemple:
     ```js
       document.onchange = function(){
         var nouveauPrix = '${votrePrixVariableIci}';
         renderSezzle.alterPrice(nouveauPrix);
       }
     ```

2. `renderModalByfunction()` - Rendu le modal Sezzle par une fonction. Créez un écouteur d'événement qui appelle cette fonction si l'emplacement de l'événement est autre que l'icône d'information.
     ```js
       var cliquezElement = document.querySelector('#votreElementCliquableEstIci')
       cliquezElement.addEventListener("click", function() { renderSezzle.renderModalByfunction() });
     ```

3. `isMobileBrowser()` - Renvoie vrai sur le navigateur mobile. Utilisez cet événement pour afficher ou masquer le widget dans différents emplacements de page en fonction du type d'appareil.
     ```js
       document.onreadystatechange = function(){
         if(renderSezzle.isMobileBrowser()){
           document.getElementById('sezzle-widget-mobile').style.display = "block";
           document.getElementById('sezzle-widget').style.display = "none";
         } else {
           document.getElementById('sezzle-widget').style.display = "block";
           document.getElementById('sezzle-widget-mobile').style.display = "none";
         }
       }
     ```

4. `getElementToRender()` - obtenir l'élément à restituer. Créez un écouteur d'événement qui appelle cette fonction si le widget doit apparaître lorsque l'événement se produit.
     ```js
       document.body.insertBefore(renderSezzle.getElementToRender(), document.getElementById('price').nextElementSibling);
     ```

5. `updateWidgetTemplate(nouveauModele)` (mettre à jour le modèle de widget) - Permet à l'appelant de mettre à jour le modèle de widget lorsque des scénarios spécifiques peuvent se produire. Les exemples pourraient inclure le cas où un texte personnalisé doit être affiché selon des règles de tarification personnalisées ou lorsque Sezzle n'est pas disponible en raison d'autres restrictions.

```js
document.onchange = function(){
    renderSezzle.updateWidgetTemplate('%%logo%% Payez en 4 paiements sans intérêt sur les achats supérieurs à 50 $. %%info%%');
}
```