# 🚀 Guide de Déploiement avec Variables d'Environnement

## 🔒 Sécurité : Variables d'environnement en production

Le fichier `.env` est correctement ignoré par Git (dans `.gitignore`). Pour la production, vous avez plusieurs options selon votre plateforme de déploiement.

## 📋 Options selon la plateforme

### Option 1 : Vercel (Recommandé pour Vite/React)

#### Configuration dans Vercel Dashboard

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les variables :
   - `VITE_SUPABASE_URL` = `https://votre-projet.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `votre-clé-anon-publique`
5. Sélectionnez les environnements (Production, Preview, Development)
6. Cliquez sur **Save**

#### Déploiement automatique depuis GitHub

1. Connectez votre repo GitHub à Vercel
2. Vercel détecte automatiquement les variables d'environnement
3. À chaque push sur `main`, le site est redéployé automatiquement

**✅ Avantages :**
- Variables sécurisées (non visibles dans le code)
- Déploiement automatique
- Gratuit pour les projets personnels

---

### Option 2 : Netlify

#### Configuration dans Netlify Dashboard

1. Allez sur https://app.netlify.com
2. Sélectionnez votre site
3. Allez dans **Site configuration** → **Environment variables**
4. Ajoutez les variables :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Cliquez sur **Save**

#### Déploiement depuis GitHub

1. Connectez votre repo GitHub à Netlify
2. Netlify utilise automatiquement les variables définies
3. Déploiement automatique à chaque push

---

### Option 3 : GitHub Pages (via GitHub Actions)

#### Créer un fichier `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### Configurer les secrets GitHub

1. Allez sur votre repo GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **New repository secret**
4. Ajoutez :
   - Nom : `VITE_SUPABASE_URL`
   - Valeur : `https://votre-projet.supabase.co`
5. Répétez pour `VITE_SUPABASE_PUBLISHABLE_KEY`

**⚠️ Important :** Les secrets GitHub sont utilisés uniquement dans les Actions, pas dans le code final.

---

### Option 4 : Serveur VPS/Dedicated (SSH)

#### Méthode 1 : Fichier `.env` sur le serveur

1. Connectez-vous en SSH à votre serveur
2. Clonez le repo :
   ```bash
   git clone https://github.com/votre-username/tzedakahTracker.git
   cd tzedakahTracker
   ```
3. Créez le fichier `.env` directement sur le serveur :
   ```bash
   nano .env
   ```
4. Ajoutez les variables (sans les commiter)
5. Installez et build :
   ```bash
   npm install
   npm run build
   ```

#### Méthode 2 : Variables d'environnement système

```bash
# Dans ~/.bashrc ou ~/.zshrc
export VITE_SUPABASE_URL=https://votre-projet.supabase.co
export VITE_SUPABASE_PUBLISHABLE_KEY=votre-clé-anon-publique
```

Puis :
```bash
source ~/.bashrc
npm run build
```

---

## 🔐 GitHub Secrets (pour CI/CD)

### Quand utiliser GitHub Secrets

- ✅ Pour les GitHub Actions (CI/CD)
- ✅ Pour les workflows de déploiement automatique
- ❌ **PAS** pour les variables accessibles côté client (comme `VITE_*`)

**⚠️ Important :** Les variables `VITE_*` sont incluses dans le bundle JavaScript final. Elles sont **publiques** par nature. C'est normal et sécurisé car :
- La clé `anon public` de Supabase est conçue pour être publique
- Le Row Level Security (RLS) protège vos données
- Seule la clé `service_role` doit rester secrète (et ne doit JAMAIS être utilisée côté client)

---

## 📝 Checklist de déploiement

### Avant de déployer

- [ ] Variables d'environnement configurées sur la plateforme de déploiement
- [ ] Tables Supabase créées (schema.sql exécuté)
- [ ] RLS activé sur toutes les tables
- [ ] Test local réussi (`npm run dev`)
- [ ] Build local réussi (`npm run build`)

### Après le déploiement

- [ ] Site accessible
- [ ] Page de connexion s'affiche
- [ ] Création de compte fonctionne
- [ ] Connexion fonctionne
- [ ] Données sauvegardées correctement

---

## 🆘 Dépannage en production

### Erreur "Variables d'environnement Supabase manquantes"

**Causes :**
1. Variables non définies sur la plateforme de déploiement
2. Serveur non redémarré après ajout des variables
3. Mauvais nom de variable

**Solution :**
1. Vérifiez les variables dans le dashboard de votre plateforme
2. Redéployez l'application
3. Vérifiez que les noms sont exacts : `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY`

### Variables non prises en compte après déploiement

**Solution :**
1. Vérifiez que les variables sont définies pour l'environnement correct (Production)
2. Redéployez l'application (les variables sont chargées au build)
3. Vérifiez les logs de build pour voir si les variables sont chargées

---

## 🔒 Bonnes pratiques de sécurité

### ✅ À faire

- ✅ Utiliser la clé `anon public` (publique par design)
- ✅ Activer RLS sur toutes les tables Supabase
- ✅ Ne jamais commiter le fichier `.env`
- ✅ Utiliser des variables d'environnement pour la production
- ✅ Limiter les permissions RLS au strict nécessaire

### ❌ À ne jamais faire

- ❌ Utiliser la clé `service_role` côté client
- ❌ Commiter le fichier `.env` dans Git
- ❌ Exposer des clés secrètes dans le code
- ❌ Désactiver RLS pour "tester"

---

## 📚 Ressources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)

