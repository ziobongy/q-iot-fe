# QIoT Frontend

## Architettura Generale

Questo progetto è una web app sviluppata con **React**, **TypeScript** e **Vite**. Utilizza **Material UI** per la UI, React Router per la navigazione e Axios per la comunicazione con backend REST. L’architettura è modulare e orientata alla gestione di esperimenti e sensori IoT.

### Struttura delle Cartelle Principali

- **src/**: Contiene tutto il codice applicativo.
  - **forms/**: Componenti per la gestione e la creazione dinamica di form (es. `DynamicFormBuilder`, `FieldEditor`, `ManageExperimentForm`, `ManageSensorForm`).
  - **model/**: Definizioni dei modelli dati TypeScript (es. `ExperimentModel`, `SensorModel`, `FormSchema`).
  - **pages/**: Pagine principali dell’applicazione, suddivise per funzionalità (es. dashboard, gestione esperimenti/sensori, liste).
    - **experiment-list/** e **sensor-list/**: Liste di esperimenti e sensori.
  - **theme/**: Gestione del tema grafico e layout principale (`MainTheme`).
  - **configurations/**: Configurazioni globali, come l’istanza Axios per le chiamate HTTP.
  - **App.tsx**: Entry point dell’applicazione, applica il tema e gestisce il layout.
  - **main.tsx**: Bootstrap dell’app React e setup del router.
  - **routes.tsx**: Definizione delle rotte principali dell’applicazione.

### Componenti e Funzionalità Principali

- **Gestione Esperimenti**
  - Creazione, modifica e visualizzazione di esperimenti tramite form dinamici (`ManageExperimentForm`).
  - Visualizzazione delle liste (`ExperimentList`) e dashboard dati (`ExperimentDashboard`).
- **Gestione Sensori**
  - Creazione, modifica e visualizzazione di sensori (`ManageSensorForm`, `SensorList`).
  - Supporto a schemi dinamici e dati JSON custom.
- **Form Dinamici**
  - `DynamicFormBuilder` e `FieldEditor` permettono la creazione e modifica di schemi di form JSON in modo visuale e dinamico.
  - Helpers per la gestione di campi annidati, array, oggetti e validazione.
- **Tema e Layout**
  - `MainTheme` gestisce la navigazione principale (menu laterale, app bar) e applica il tema Material UI.
- **Comunicazione con Backend**
  - Axios configurato in `AxiosConfig.ts` per gestire autenticazione e chiamate API.

### Modelli Dati Principali

- **ExperimentModel**: Definisce un esperimento con nome, dispositivi associati e servizi abilitati.
- **SensorModel**: Definisce un sensore, le sue caratteristiche, servizi e schema dinamico.
- **FormSchema**: Modello per la definizione di form dinamici (campi primitivi, oggetti, array).
- **LineChartDataModel**: Modello per la visualizzazione di dati su grafici.

### Routing

Le rotte principali sono definite in `routes.tsx` e includono:
- `/experiment`, `/experiment/create`, `/experiment/edit/:experimentId`, `/experiment/dashboard/:experimentId`
- `/sensor`, `/sensor/create`, `/sensor/edit/:sensorId`

Ogni rotta carica la pagina e il form/componenti appropriati.

## Avvio del Progetto

1. Installa le dipendenze:
   ```sh
   npm install
   ```
2. Avvia il server di sviluppo:
   ```sh
   npm run dev
   ```

## Note
- Il progetto è pensato per essere facilmente estendibile con nuovi moduli e modelli dati.
- La gestione dei form dinamici permette di adattare facilmente la UI a nuovi tipi di dati JSON.

---
Per dettagli su ogni componente, consultare i file sorgente nelle rispettive cartelle.
