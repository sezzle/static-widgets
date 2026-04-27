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

1. Clonez/déroulez le projet Static-Widgets[https://github.com/sezzle/static-widgets/], puis exécutez `npm run build-button`
2. Connectez-vous à votre administrateur Shopify
3. Accédez à la boutique en ligne > Thèmes
4. À côté du thème applicable, cliquez sur « Actions » puis sur « Modifier le code ».
5. Faites défiler jusqu'au dossier Actifs, puis cliquez sur Ajouter un nouvel actif.
6. Cliquez sur Créer un fichier vierge, nommez la section `sezzle-checkout-button`, sélectionnez `.js` comme type de fichier, puis cliquez sur Ajouter un actif.
7. Dans le dossier Assets, sélectionnez l'asset que vous venez de créer (vous devrez peut-être faire défiler, les fichiers ne sont pas classés par ordre alphabétique).
8. Remplacez le modèle d'actif par le contenu du code ici[../../build/sezzle-checkout-button-asset.js], puis cliquez sur Enregistrer.
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
    > Pour tester un fichier non minifié, le processus est le même, sauf que vous sautez l'étape 1 et qu'au lieu de l'étape 8, copiez+collez le contenu du fichier à partir d'ici[./sezzle-checkout-button-asset.js] mais supprimez la ligne `export default` en bas et mettez à jour le chemin du fichier d'extrait en conséquence.

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

## Installer en HTML

_La méthode HTML est l'installation la plus légère mais la moins intuitive. Recommandé pour les commerçants qui sont à l'aise pour lire et écrire du code._

1. Connectez-vous à votre administrateur Shopify
2. Accédez à la boutique en ligne > Thèmes
3. À côté du thème applicable, cliquez sur « Actions » puis sur « Modifier le code ».
4. Collez l'extrait de code ici [./sezzle-checkout-button.html] dans le fichier `templates/cart.liquid ` ou `sections/cart-template.liquid` où le bouton doit apparaître, puis cliquez sur Enregistrer :
    - Remarque : il se trouve généralement sous le bouton de paiement Shopify habituel. Ouvrez le fichier, puis recherchez (Cmd+F ou Ctrl+F) le mot « checkout » – il s’agit généralement d’un bouton ou d’une entrée.
5. Cliquez sur Enregistrer
6. Cliquez sur Aperçu, puis accédez à la page du panier pour confirmer que le bouton apparaît correctement.
    - Pour modifier la position du widget, coupez+collez le bloc de code dans le nouvel emplacement.

### PERSONNALISATION DES STYLES

Pour les sites à thème sombre :
Changez la classe `<button>` de `sezzle-button-light` en `sezzle-button-dark`
Remplacez le href `<img>` par `"https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg"`
Le texte à afficher peut être mis à jour à volonté, mais le logo Sezzle doit rester. Les trois variantes les plus courantes sont : - `Commander avec {logo}` - `Payer avec {logo}` - `{logo}`