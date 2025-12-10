# Configuration des Variables d'Environnement Supabase

## 📍 Où trouver les variables Supabase

### Étape 1 : Accéder à votre projet Supabase
1. Allez sur https://supabase.com/dashboard
2. Connectez-vous à votre compte
3. Sélectionnez votre projet (ou créez-en un nouveau)

### Étape 2 : Récupérer les variables
1. Dans le menu de gauche, cliquez sur **Settings** (⚙️)
2. Cliquez sur **API** dans le sous-menu
3. Vous verrez deux sections importantes :

#### 🔑 **Project URL** (VITE_SUPABASE_URL)
- C'est l'URL de base de votre projet
- Format : `https://[votre-projet-id].supabase.co`
- Exemple : `https://baziwuqdijzbtsqcfkzy.supabase.co`

#### 🔑 **anon public key** (VITE_SUPABASE_PUBLISHABLE_KEY)
- C'est la clé publique anonyme (sécurisée pour le frontend)
- Format : Une longue chaîne JWT
- Cette clé est publique et peut être utilisée côté client

### Étape 3 : Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
VITE_SUPABASE_URL=https://votre-projet-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=votre-clé-anon-publique
```

**⚠️ Important :**
- Remplacez les valeurs par celles de VOTRE projet Supabase
- Ne commitez JAMAIS le fichier `.env` dans Git (il est déjà dans `.gitignore`)
- Le fichier `.env` doit être à la racine du projet, au même niveau que `package.json`

### Étape 4 : Redémarrer le serveur de développement

Après avoir créé/modifié le fichier `.env`, vous devez redémarrer votre serveur :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez-le
npm run dev
```

## 🔒 Sécurité

- ✅ La clé `anon public` est sécurisée pour être utilisée côté client
- ✅ Le Row Level Security (RLS) protège vos données
- ✅ Ne partagez JAMAIS votre `service_role key` (clé secrète)
- ✅ Le fichier `.env` est automatiquement ignoré par Git

## 📝 Variables utilisées dans le projet

| Variable | Description | Où la trouver |
|----------|-------------|---------------|
| `VITE_SUPABASE_URL` | URL de base de votre projet Supabase | Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clé publique anonyme (anon key) | Settings → API → anon public |

## 🆘 Dépannage

### Le fichier `.env` n'est pas pris en compte
1. Vérifiez que le fichier s'appelle bien `.env` (avec le point au début)
2. Vérifiez qu'il est à la racine du projet
3. Redémarrez le serveur de développement
4. Vérifiez qu'il n'y a pas d'espaces autour du `=` dans le fichier

### Erreur "Invalid API key"
1. Vérifiez que vous utilisez la clé `anon public` et non la `service_role key`
2. Vérifiez que l'URL et la clé correspondent au même projet
3. Vérifiez qu'il n'y a pas de guillemets supplémentaires dans le fichier `.env`

