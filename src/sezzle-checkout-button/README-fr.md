Voici 4 méthodes pour installer le bouton de paiement Sezzle. La méthode `Installer en tant qu'actif` devrait fonctionner pour la plupart des installations.

## Installer en tant qu'actif

_La méthode Asset est une taille unique - compatible avec Shopify 2.0 et versions ultérieures, plaçant intuitivement le bouton Sezzle après le bouton de paiement Shopify et héritant des styles de page sélectionnés._

### Depuis le CDN

1. Connectez-vous à votre administrateur Shopify
2. Accédez à la boutique en ligne > Thèmes
3. À côté du thème applicable, cliquez sur « Actions » puis sur « Modifier le code ».
4. Collez l'extrait suivant au bas du fichier `layout/theme.liquid`, saisissez l'ID dans l'espace prévu, puis cliquez sur Enregistrer :

```html
{{ "//checkout-sdk.sezzle.com/sezzle-checkout-button.min.js" | script_tag }}
<script>
   var sezzleObserver = new MutationObserver(function(){
      if(!document.querySelector('.sezzle-checkout-button')){
         new SezzleCheckoutButton({
            merchantUUID : "enter ID here",  <!-- Your ID(format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
            cartTotal : {{ cart.total_price }},
         }).init();
      }
   });
   sezzleObserver.observe(document, {
      childList: true,
      subtree: true
   });
</script>
```

5. Cliquez sur Aperçu, puis accédez à la page du panier pour confirmer que le bouton apparaît correctement.

### Fichier local

> Utilisez cette méthode pour tester le fichier minifié

1. Clonez/déroulez le projet Static-Widgets[https://github.com/sezzle/static-widgets/], puis exécutez `npm run build`
2. Connectez-vous à votre administrateur Shopify
3. Accédez à la boutique en ligne > Thèmes
4. À côté du thème applicable, cliquez sur « Actions » puis sur « Modifier le code ».
5. Faites défiler jusqu'au dossier Actifs, puis cliquez sur Ajouter un nouvel actif.
6. Cliquez sur Créer un fichier vierge, nommez la section `sezzle-checkout-button`, sélectionnez `.js` comme type de fichier, puis cliquez sur Ajouter un actif.
7. Dans le dossier Assets, sélectionnez l'asset que vous venez de créer (vous devrez peut-être faire défiler, les fichiers ne sont pas classés par ordre alphabétique).
8. Remplacez le modèle d'actif par le contenu du code ici[../../../build/sezzle-checkout-button-asset.js], puis cliquez sur Enregistrer.
9. Collez l'extrait suivant au bas du fichier `layout/theme.liquid`, saisissez l'ID dans l'espace prévu, puis cliquez sur Enregistrer :

```html
{{ "sezzle-checkout-button.js" | asset_url | script_tag }}
<script>
   var sezzleObserver = new MutationObserver(function(){
      if(!document.querySelector('.sezzle-checkout-button')){
         new SezzleCheckoutButton({
            merchantUUID : "enter ID here",  <!-- Your ID(format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
            cartTotal : {{ cart.total_price }},
         }).init();
      }
   });
   sezzleObserver.observe(document, {
      childList: true,
      subtree: true
   });
</script>
```

9. Cliquez sur Aperçu, puis accédez à la page du panier pour confirmer que le bouton apparaît correctement.
    > Pour tester un fichier non minifié, le processus est le même, sauf que vous sautez l'étape 1 et qu'au lieu de l'étape 8, copiez+collez le contenu du fichier à partir d'ici[https://github.com/sezzle/static-widgets/blob/production/src/sezzle-checkout-button/sezzle-checkout-button-asset.js] mais supprimez la ligne `export default` en bas et mettez à jour le chemin du fichier d'extrait en conséquence.

### PERSONNALISATION DES STYLES

L'apparence du bouton peut désormais être personnalisée selon les besoins à l'aide des touches ci-dessous.

- `theme` : "light" est compatible avec les sites à fond clair (par défaut), "dark" est compatible avec les sites à fond sombre.
- `template` : contrôle le contenu du texte - `%%logo%%` est requis et sera remplacé par l'image du logo Sezzle. "Commander avec %%logo%%" est la valeur par défaut, mais "Payer avec %%logo%%" est une alternative approuvée.
   Voici un exemple de configuration par défaut :

```html
  {{ "sezzle-checkout-button.js" | asset_url | script_tag }}
  <script>
      new SezzleCheckoutButton({
        merchantUUID: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        theme: "light", // accepte "light" ou "dark" (basé sur l'arrière-plan du site)
        template: "Checkout with %%logo%%", // accepte "Checkout with %%logo%%", "Pay with %%logo%%", ou "%%logo%%"
        cartTotal : {{ cart.total_price }}
      }).init();
  </script>

```

## Installer en tant que section

_La méthode Section possède une matrice de personnalisation intégrée. Cependant, comme vous ne pouvez pas insérer une section dans une autre section, si le code de votre page de panier se trouve dans `sections/cart.liquid` ou si vous n'êtes pas sûr, veuillez suivre les instructions pour `Installer en tant qu'extrait` ou `Installer en tant que HTML`._

1. Connectez-vous à votre administrateur Shopify
2. Accédez à la boutique en ligne > Thèmes
3. À côté du thème applicable, cliquez sur « Actions » puis sur « Modifier le code ».
4. Faites défiler jusqu'au dossier Sections, puis cliquez sur Ajouter une nouvelle section.
5. Nommez la section `sezzle-checkout-button`, puis cliquez sur Créer une section
6. Remplacez le modèle de section par le contenu du code ici [https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button/sezzle-checkout-button-section.liquid].
7. Collez l'extrait suivant dans le fichier `templates/cart.liquid` où le bouton doit apparaître, puis cliquez sur Enregistrer :
    - Remarque : ceci se trouve généralement sous le bouton de paiement Shopify. Ouvrez le fichier, puis recherchez (Cmd+F ou Ctrl+F) le mot « checkout » – il s’agit généralement d’un bouton ou d’une entrée.

```
	{% section "sezzle-checkout-button" %}
```

8. Cliquez sur Personnaliser le thème
9. Ajoutez un produit au panier, puis accédez à la page du panier
10. Dans la barre d'outils de gauche, cliquez sur le bouton Sezzle Checkout.
11. Apportez les modifications souhaitées, puis cliquez sur Enregistrer
     - Si le bouton n'est pas dans la position souhaitée, modifiez l'emplacement de l'extrait de code ou ajoutez le style applicable si nécessaire.

## Installer en tant qu'extrait

_La méthode Snippet a le même code léger que la méthode HTML, mais peut être personnalisée via une configuration, et comme elle est enregistrée dans son propre fichier, la balise ajoutée à la page du panier est plus petite et plus facile à déplacer selon les besoins._

1. Connectez-vous à votre administrateur Shopify
2. Accédez à la boutique en ligne > Thèmes
3. À côté du thème applicable, cliquez sur « Actions » puis sur « Modifier le code ».
4. Faites défiler jusqu'au dossier Snippets, puis cliquez sur Ajouter un nouvel extrait.
5. Nommez le fichier `sezzle-checkout-button`, puis cliquez sur Créer un extrait
6. Remplacez le modèle d'extrait de code par le contenu du code ici [https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button/sezzle-checkout-button-snippet.liquid].
7. Collez l'extrait suivant dans le fichier `templates/cart.liquid` ou `sections/cart-template.liquid` où le bouton doit apparaître, puis cliquez sur Enregistrer :
    - Remarque : ceci se trouve sous le bouton de paiement Shopify. Ouvrez le fichier, puis recherchez (Cmd+F ou Ctrl+F) le mot « checkout » – il s’agit généralement d’un bouton ou d’une entrée.

```
	{% include "sezzle-checkout-button" %}
```

8. Modifiez les valeurs des balises « assign » en haut du fichier pour modifier les styles. Détails comme suit :
    - Le thème peut être `light` (clair) ou `dark` (sombre), correspondant à la couleur de fond de la page.
    - Le type de bordure peut être "square" (carré), "semi-rounded" (semi-arrondi) or "rounded" (arrondi) pour modifier la forme du bouton.
    - Le remplissage X peut être défini en px pour modifier l'espace à gauche et à droite du texte dans le bouton.
    - Les modifications du texte peuvent être apportées directement dans le HTML, par exemple `Payer avec <img>`

## Installer en HTML

_La méthode HTML est l'installation la plus légère mais la moins intuitive. Recommandé pour les commerçants qui sont à l'aise pour lire et écrire du code._

1. Connectez-vous à votre administrateur Shopify
2. Accédez à la boutique en ligne > Thèmes
3. À côté du thème applicable, cliquez sur « Actions » puis sur « Modifier le code ».
4. Collez l'extrait de code ici [https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button/sezzle-checkout-button.html] dans le fichier `templates/cart.liquid ` ou `sections/cart-template.liquid` où le bouton doit apparaître, puis cliquez sur Enregistrer :
    - Remarque : il se trouve généralement sous le bouton de paiement Shopify habituel. Ouvrez le fichier, puis recherchez (Cmd+F ou Ctrl+F) le mot « checkout » – il s’agit généralement d’un bouton ou d’une entrée.
5. Cliquez sur Enregistrer
6. Cliquez sur Aperçu, puis accédez à la page du panier pour confirmer que le bouton apparaît correctement.
    - Pour modifier la position du widget, coupez+collez le bloc de code dans le nouvel emplacement.

### PERSONNALISATION DES STYLES

Pour les sites à thème sombre :
Changez la classe `<button>` de `sezzle-button-light` en `sezzle-button-dark`
Remplacez le href `<img>` par `"https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg"`
Le texte à afficher peut être mis à jour à volonté, mais le logo Sezzle doit rester. Les trois variantes les plus courantes sont : - `Commander avec {logo}` - `Payer avec {logo}` - `{logo}`