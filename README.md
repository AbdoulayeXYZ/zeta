# SaaS pour la détection de tumeurs cérébrales par Deep Learning

Ce projet est une plateforme SaaS (Software as a Service) utilisant le deep learning pour la détection de tumeurs cérébrales à partir d'images IRM. Il est construit avec la stack MEAN (MongoDB, Express.js, Angular, Node.js) et utilise un modèle YOLO-NAS pour la détection et la classification des tumeurs.

## Repositories

Ce projet est divisé en deux repositories principaux :

1. [brain-tumor-irm](https://github.com/AbdoulayeXYZ/brain-tumor-irm) : Contient les données d'entraînement et le modèle de deep learning.
2. [zeta](https://github.com/AbdoulayeXYZ/zeta) : Contient le code source de la plateforme SaaS.

## Fonctionnalités

- Détection et classification de trois types de tumeurs cérébrales : gliomes, méningiomes et tumeurs hypophysaires
- Authentification sécurisée pour les hôpitaux, professionnels de santé et administrateurs
- Téléversement et analyse des images IRM
- Visualisation des résultats avec localisation et segmentation des tumeurs
- Téléchargement direct des résultats d'analyse
- Gestion des dossiers médicaux des patients
- Collaboration et partage des résultats entre spécialistes
- Transfert de dossiers médicaux entre différents Workspace
- Administration technique des Workspace

## Prérequis

- Node.js (v14.0.0 ou supérieur)
- MongoDB (v4.4 ou supérieur)
- Angular CLI (v12.0.0 ou supérieur)
- Python (v3.8 ou supérieur) pour le modèle de deep learning

## Installation

1. Clonez les deux repositories :
`git clone https://github.com/AbdoulayeXYZ/brain-tumor-irm.git`
`git clone https://github.com/AbdoulayeXYZ/zeta.git`

2. Installez les dépendances pour le backend (dans le dossier `zeta`) :
`cd zeta/backend`
`npm install`

3. Installez les dépendances pour le frontend (dans le dossier `zeta`) :
`cd zeta/frontend`
`npm install`

4. Configurez l'environnement :
- Créez un fichier `.env` dans le dossier `backend` en vous basant sur le fichier `.env.example`
- Configurez les variables d'environnement nécessaires (URL de la base de données, clés API, etc.)

## Utilisation

1. Démarrez le serveur backend :
`cd zeta/backend`
`npm run dev`

2. Démarrez l'application frontend :
`cd zeta/frontend`
`ng serve`

3. Accédez à l'application dans votre navigateur à l'adresse `http://localhost:4200`


## Auteur
- [Abdoulaye NIASSE](https://github.com/AbdoulayeXYZ)
- [Mariama FALL](https://github.com/kalpafall)