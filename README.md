# Set Piece 26/27 — Lineout playbook

Interactieve lineout-app: codes, calls per formatie en een quiz om te stampen.
Mobile-first, maar ook prettig op een laptop (breder scherm = tabbalk bovenin en kolommen naast elkaar).

## Bestanden
- `index.html` — structuur/inhoud
- `styles.css` — alle styling + responsive regels
- `script.js` — data (alle calls) + interactie (tikken, quiz, score opslaan)

Pas je de calls aan (bijv. `Red` of `Slice` verder invullen na de training)? Dat doe je allemaal in het bovenste data-blok van `script.js` (`NUMBERS` en `CALLS`).

## Online zetten via GitHub Pages

1. Maak op GitHub een nieuwe **public** repository, bijv. `lineout-playbook`.
2. Upload deze drie bestanden (`index.html`, `styles.css`, `script.js`) naar de repository
   - via de website: "Add file" → "Upload files" → sleep de bestanden erin → Commit
   - of via terminal:
     ```
     git init
     git add index.html styles.css script.js README.md
     git commit -m "Lineout playbook"
     git branch -M main
     git remote add origin https://github.com/<jouw-gebruikersnaam>/lineout-playbook.git
     git push -u origin main
     ```
3. Ga naar **Settings → Pages** in de repository.
4. Zet bij "Build and deployment" → **Source** op **Deploy from a branch**.
5. Kies branch **main** en map **/ (root)** → **Save**.
6. Na ongeveer een minuut staat de app live op:
   `https://<jouw-gebruikersnaam>.github.io/lineout-playbook/`

Zet die link als snelkoppeling/bladwijzer op je telefoon en laptop — klaar.

## Lokaal testen
Dubbelklik gewoon op `index.html`, of run in de map:
```
python3 -m http.server 8000
```
en open `http://localhost:8000`.
