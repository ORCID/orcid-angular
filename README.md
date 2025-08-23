## Download and install

```bash
   git clone https://github.com/ORCID/orcid-angular
   cd orcid-angular
   yarn
```

## If You Are Running ORCID Backend on Your Local

If you are also running the **ORCID backend locally** as describe on [Orcid Source DEVSETUP](https://github.com/ORCID/ORCID-Source/blob/main/DEVSETUP.md), you should connect the front-end to your local backend with:

   ```bash
   npm run start:local
   ```

---

## If You Intend to Only Run the Front-End on Your Local

If you only want to run the front-end locally (without the backend), it will connect to the **QA backend** by default:

   ```bash
   npm run start
   ```

---

## Serve the Front-End in Other Languages

Currently, the only way to run the application in development mode with a translation file is by using:

1. **Generate translation files**

   ```bash
   yarn build:i18n
   ```

2. **Run the application in a specific language**

   ```bash
   yarn start:en    # English
   yarn start:fr    # French
   yarn start:ar    # Arabic
   yarn start:es    # Spanish
   yarn start:ca    # Catalan
   yarn start:cs    # Czech
   yarn start:it    # Italian
   yarn start:ja    # Japanese
   yarn start:ko    # Korean
   yarn start:pt    # Portuguese
   yarn start:ru    # Russian
   yarn start:uk    # Ukrainian
   yarn start:zh_CN # Simplified Chinese
   yarn start:zh_TW # Traditional Chinese
   ```

   Additional testing-only configurations:

   ```bash
   yarn start:lr
   yarn start:rl
   yarn start:xx
   yarn start:source
   ```
