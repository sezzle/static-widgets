# Bannière Sezzle

Ajoutez une bannière Sezzle à votre boutique en ligne pour faire savoir aux clients qu'ils peuvent acheter maintenant et payer plus tard

## Installation

Sélectionnez l'implémentation qui correspond à vos besoins :

### Shopify :
- [Ressource du CDN](#depuis-le-cdn)
- [Ressource en tant que fichier local](#fichier-local)
- [HTML brut](#installer-au-format-html)
### Toutes les plateformes :
- [Ressource du CDN](#depuis-un-cdn)
- [Ressource en tant que fichier local](#fichier-local-1)
- [HTML brut](#installer-au-format-html-1)

---

## Shopify

### Installer en tant que ressource

#### Depuis le CDN

1. Connectez-vous à votre interface administrateur Shopify
1. Accédez à `Boutique en ligne` > `Thèmes`
1. À côté du thème concerné, cliquez sur `Actions` puis sur `Modifier le code`
1. Collez l'extrait suivant dans le fichier `sections/header.liquid` où la bannière doit apparaître.
- Remarque : ce fichier se trouve généralement sous la balise de fermeture `header` ou `sticky-header`. Ouvrez le fichier, puis recherchez (Cmd+F ou Ctrl+F) le mot `sticky-header`.
1. Mettez à jour la valeur « merchantUUID », puis cliquez sur « Enregistrer »
- [Trouvez-la ici](https://dashboard.sezzle.com/merchant/settings/business)

```
{{ "//checkout-sdk.sezzle.com/sezzle-home-banner.min.js" | script_tag }}
<div id="sezzle-banner-render-reference"></div>
<script>
new SezzleBanner({
    merchantUUID: "entrez l'ID ici",  <!-- Votre identifiant (format : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
    theme: "indigo",  <!-- Options: "indigo" and "black" -->
    renderToContainer: "#sezzle-banner-render-reference", <!-- Cela utilisera `querySelector` pour afficher la bannière, utilisez donc un identifiant ou une classe unique -->
}).init();
</script>
```

#### Fichier local

1. Clonez/déposez le projet [Static-Widgets](https://github.com/sezzle/static-widgets/), puis exécutez `npm run build-banner`.
1. Connectez-vous à votre interface administrateur Shopify.
1. Accédez à `Boutique en ligne` > `Thèmes`.
1. À côté du thème concerné, cliquez sur `Actions`, puis sur `Modifier le code`.
1. Faites défiler jusqu'au dossier `Actifs`, puis cliquez sur `Ajouter un nouvel actif`.
1. Cliquez sur `Créer un fichier vierge`, nommez la section `sezzle-home-banner`, sélectionnez `.js` comme type de fichier, puis cliquez sur `Ajouter un actif`.
1. Dans le dossier `Actifs`, sélectionnez l'actif que vous venez de créer (vous devrez peut-être faire défiler la liste, car les fichiers ne sont pas classés par ordre alphabétique). 1. Remplacez le modèle de ressource par le code ici: `static-widgets/build/sezzle-home-banner.js`, puis cliquez sur `Enregistrer`.
1. Collez l'extrait suivant dans le fichier `sections/header.liquid` où la bannière doit apparaître.
- Remarque : ce champ se trouve généralement sous la balise de fermeture `header` ou `sticky-header`. Ouvrez le fichier, puis recherchez (Cmd+F ou Ctrl+F) le mot `sticky-header`.
1. Mettez à jour la valeur « merchantUUID », puis cliquez sur « Enregistrer »
- [Trouvez-la ici](https://dashboard.sezzle.com/merchant/settings/business)

```
{{ "sezzle-home-banner.js" | asset_url | script_tag }}
<div id="sezzle-banner-render-reference"></div>
<script>
new SezzleBanner({
    merchantUUID: "entrez l'ID ici",  <!-- Votre identifiant (format : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
    theme: "indigo",  <!-- Options: "indigo" and "black" -->
    renderToContainer: "#sezzle-banner-render-reference", <!-- Cela utilisera `querySelector` pour afficher la bannière, utilisez donc un identifiant ou une classe unique -->
}).init();
</script>
```

### Installer au format HTML

1. Connectez-vous à votre interface administrateur Shopify
1. Accédez à `Boutique en ligne` > `Thèmes`
1. À côté du thème concerné, cliquez sur `Actions` puis sur `Modifier le code`
1. Collez l'extrait de code [ici](https://github.com/sezzle/static-widgets/tree/production/src/sezzle-home-banner/sezzle-home-banner.html) dans le fichier `sections/header.liquid` où la bannière doit apparaître, puis cliquez sur `Enregistrer`.
- Remarque : cet extrait se trouve généralement sous la balise de fermeture `header` ou `sticky-header`. Ouvrez le fichier, puis recherchez (Cmd+F ou Ctrl+F) le mot `sticky-header`.

#### PERSONNALISATION

- Modifiez le nom de la classe de l'élément wrapper avec la couleur de thème souhaitée (indigo ou noir).
- Modifiez l'URL href `En savoir plus` pour qu'elle pointe vers votre page [Fonctionnement de Sezzle](https://docs.sezzle.com/docs/guides/about-sezzle), le cas échéant.

## Autres plateformes

### Depuis un CDN

Collez le texte suivant à l'emplacement où la bannière doit apparaître, par exemple sous `</header>`, et modifiez la valeur `merchantUUID`.
- [Trouvez-la ici](https://dashboard.sezzle.com/merchant/settings/business)

```
<script src="https://checkout-sdk.sezzle.com/sezzle-home-banner.min.js"></script>
<div id="sezzle-banner-render-reference"></div>
<script>
new SezzleBanner({
    merchantUUID: "entrez l'ID ici",  <!-- Votre identifiant (format : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
    theme: "indigo",  <!-- Options: "indigo" and "black" -->
    renderToContainer: "#sezzle-banner-render-reference", <!-- Cela utilisera `querySelector` pour afficher la bannière, utilisez donc un identifiant ou une classe unique -->
}).init();
</script>
```

### Fichier local

Clonez/déposez le projet [Static-Widgets](https://github.com/sezzle/static-widgets/), puis exécutez `npm run build-banner`.
Créez un fichier .js et intégrez-y le code suivant: `static-widgets/build/sezzle-home-banner.js`.
Collez le code suivant à l'emplacement où la bannière doit apparaître, par exemple sous `</header>`, puis modifiez le chemin d'accès au fichier et la valeur `merchantUUID`.
- [Trouvez-la ici](https://dashboard.sezzle.com/merchant/settings/business)

```
<script src="VOTRE_CHEMIN_DE_FICHIER_ICI.js"></script>
<div id="sezzle-banner-render-reference"></div>
<script>
new SezzleBanner({
    merchantUUID: "entrez l'ID ici",  <!-- Votre identifiant (format : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) -->
    theme: "indigo",  <!-- Options: "indigo" and "black" -->
    renderToContainer: "#sezzle-banner-render-reference", <!-- Cela utilisera `querySelector` pour afficher la bannière, utilisez donc un identifiant ou une classe unique -->
}).init();
</script>
```

### Installer au format HTML

Collez l'extrait de code [ici](https://github.com/sezzle/static-widgets/tree/production/src/sezzle-home-banner/sezzle-home-banner.html) à l'endroit où la bannière doit apparaître, par exemple sous `</header>`.

#### PERSONNALISATION

- Modifiez le nom de la classe de l'élément wrapper avec la couleur de thème souhaitée (indigo ou noir).
- Modifiez l'URL href `En savoir plus` pour qu'elle pointe vers votre page [Fonctionnement de Sezzle](https://docs.sezzle.com/docs/guides/about-sezzle), le cas échéant.