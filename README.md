<a name="readme-top"></a>


<br />
<div align="center">
  <a href="https://github.com/oeeve/renorsk">
    <img src="readme/reNorsk.png" alt="Logo" width="300" height=65">
  </a>

<h3 align="center">'<s>ny</s>Norskroboten'</h3>

  <p align="center">
    Retter aktive nettside fra nynorsk til norsk (bokmål), for økt leseglede &#9829;
    <br />
    <br />
    <a href="#demo"><strong>Demo</strong></a>
    ·
    <a href="#installasjon"><strong>Installasjonsguide</strong></a>

  </p>
</div>

## reNorsk · Nettleserutvidelse
Chrome-utvidelse & Arc Boost som tar bort smerten av å lese nettinnhold fra de ~25% offentlige nettpublikasjoner som på grunn av språkloven ikke blir tilgjengeliggjort på norsk (bokmål).

![Demo](readme/demo.gif)


### Forbehold
- Tidlig test / 'Proof of Concept'. Programmet gjør jobben, men enkelte feil må påregnes. Foreløpig ikke publisert i Chrome Webshop. Se installasjonsveiledning under.
- Benytter Apertium maskinoversettelsesplattform's åpne API (https://wiki.apertium.org/), og er underlagt deres ToC.

<a name="installasjon"></a>
## Installasjon
### Chrome-utvidelse

Utvidelsen kan benyttes på alle chromium-baserte nettlesere (som Chrome, Vivaldi, Arc, Brave, Opera m.fl.). Som nevnt til testing og foreløpig ikke tilgjengeliggjort i Chrome Webshop, og må derfor installeres manuelt på følgende vis:

1. Åpne Chrome (eller annen Chromium-basert nettleser) og gå til menyen for utvidelser: chrome://extensions/[^1].
2. Skru på 'Developer Mode' øverst i høyre hjørne.
3. I enkelte versjoner av Chrome kan du laste ned [reNorsk.crx](https://github.com/oeeve/reNorsk/raw/main/Chrome%20Extension/reNorsk.crx) (Chromium Extension) og dra/slippe denne rett i chrome://extensions/.
4. Hvis dette ikke går, laster du ned [reNorsk.zip](https://github.com/oeeve/reNorsk/raw/main/Chrome%20Extension/reNorsk.zip) (evt. endrer filnavn på .crx til .zip), og pakker ut.
5. Velg 'Load unpacked' fra menyen øverst til venstre, og velg mappen du pakket ut fra .zip-filen (reNorsk/).
6. Du kan nå skru av 'Developer Mode'.
7. Bruk: Benytt enten knappen fra utvidelsesikonet (rN), eller Cmd+Shift+Y[^2] når du måtte komme over en tekst som bare er publisert på nynorsk, for å 'rette' denne til norsk.

![Demo Install](readme/demo_install.gif)

#### Nedlastinger · Chrome

[![Download](https://custom-icon-badges.demolab.com/badge/Chrome--utvidelse:-reNorsk.crx-B5DAC0?style=flat&logo=download&logoColor=white)](https://github.com/oeeve/reNorsk/raw/main/Chrome%20Extension/reNorsk.crx)
[![Download](https://custom-icon-badges.demolab.com/badge/Chrome--utvidelse:-reNorsk.zip-B5DAC0?style=flat&logo=download&logoColor=white)](https://github.com/oeeve/reNorsk/raw/main/Chrome%20Extension/reNorsk.zip)


[^1]: Benytt tilsvarende adresse for å komme til menyen for utvidelser i andre Chromium-baserte nettlesere, f.eks: vivaldi://extensions/, arc://extensions/, brave://extensions.
[^2]: Mac: Cmd+Shift+Y/ Win: Ctrl+Shift+Y.

### Arc Boost

1. Last ned Arc Browser (https://arc.net).
2. Åpne: arc://boost/, eller Cmd+T og skriv 'New Legacy Boost (Advanced)'[^3].
3. Velg 'Replace' og 'All Websites'.
4. Kopier og lim inn følgende [JavaScript](Arc%20Boost/v0.3/content.js) til content.js.
5. Bruk Cmd+Ctrl+R[^4] når du måtte komme over en tekst som bare er publisert på nynorsk, for å 'rette' denne til norsk.

#### Nedlastinger · Arc Boost

[![Download](https://custom-icon-badges.demolab.com/badge/Arc_Boost:-content.js-3CC1E0?style=flat&logo=download&logoColor=white)](Arc%20Boost/v0.3/content.js)


[^3]: Mer informasjon om New Legacy Boosts: https://resources.arc.net/hc/en-us/articles/19212718608151-Boosts-Customize-Any-Website
[^4]: Mac: Cmd+Ctrl+R / Win: Ctrl+Alt+R (For å ikke komme i konflikt med Cmd+Shift+Y om du også tester chrome utvidelse).

<a name="demo"></a>
## Demo
[![reNorsk - Nettleserutvidelse](readme/vid.png)](https://vimeo.com/927772983/4c1ab2a336)


<br/>
<p align="right">(<a href="#readme-top">Tilbake til toppen</a>)</p>