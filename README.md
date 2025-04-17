# Projet Bot Santé

Ce projet contient deux composants principaux :
- **datasets/** : Contient les jeux de données nécessaires.
- **bot_sante/** : Contient le backend et le frontend de l'application.

## Structure du projet

```
.
├── datasets/
├── bot_sante/
│   ├── backend/
│   │   ├── main.py
│   │   └── requirements.txt
│   └── frontend/
│       ├── package.json
│       └── ...
```

## 🚀 Backend (FastAPI)

Le backend est une API développée avec FastAPI.

### Installation

1. Accédez au dossier backend :
   ```bash
   cd bot_sante/backend
   ```

2. Créez un environnement virtuel (optionnel mais recommandé) :
   ```bash
   python -m venv venv
   source venv/bin/activate  # Sur Windows : venv\Scripts\activate
   ```

3. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

### Lancement

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 4000
```

L'application sera accessible sur `http://localhost:4000`.

## 💻 Frontend (React)

Le frontend est une application React.

### Installation

1. Accédez au dossier frontend :
   ```bash
   cd bot_sante/frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

### Lancement

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`.

## 📁 Datasets

Le dossier `datasets/` contient les fichiers de données utilisés dans le projet. Assurez-vous que les fichiers nécessaires sont bien présents avant de lancer les scripts du backend.

---

## 📌 Remarques

- Assurez-vous d'avoir Python 3.8+ et Node.js installés sur votre machine.
- Le backend et le frontend peuvent être lancés en parallèle.

---

## 📄 Licence

Ce projet est sous licence [à compléter].

