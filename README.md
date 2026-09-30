# DaBubble

DaBubble ist eine mit Angular 15 und Firebase umgesetzte Chat-Anwendung.

## Voraussetzungen

- Node.js und npm (für Angular 15 am besten eine unterstützte LTS-Version)
- Ein Firebase-Projekt mit aktivierter Authentication, Cloud Firestore und Storage

## Lokale Einrichtung

1. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

2. Die lokale Environment-Datei aus der Vorlage erzeugen:

   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   ```

3. In `src/environments/environment.ts` die Werte unter `firebase` durch die
   Web-App-Konfiguration des eigenen Firebase-Projekts ersetzen. Sie ist in der
   Firebase Console unter **Projekteinstellungen > Allgemein > Deine Apps > SDK
   setup and configuration** zu finden.

   Die Datei muss diese Struktur behalten:

   ```ts
   export const environment = {
     production: false,
     firebase: {
       apiKey: '...',
       authDomain: '...',
       projectId: '...',
       storageBucket: '...',
       messagingSenderId: '...',
       appId: '...',
     },
   };
   ```

   `environment.ts` wird absichtlich nicht versioniert. Die Firebase-Web-App-
   Konfiguration wird zwar an den Browser ausgeliefert und ist kein Ersatz für
   Firestore-/Storage-Sicherheitsregeln, dennoch gehören dort niemals private
   Service-Account-Schlüssel oder andere Server-Geheimnisse hinein.

4. Entwicklungsserver starten:

   ```bash
   npm start
   ```

   Die Anwendung ist anschließend unter <http://localhost:4200/> erreichbar und
   wird bei Quellcodeänderungen automatisch neu geladen.

## Build

```bash
npm run build
```

Das Build-Ergebnis wird in `dist/da-bubble/` abgelegt.

## Tests

```bash
npm test
```

Die Unit-Tests werden mit Karma ausgeführt.
