# Configuration Supabase pour Tzedakah Tracker

## 📋 Étapes à réaliser sur la plateforme Supabase

### 1. Créer les tables dans Supabase

1. Connectez-vous à votre projet Supabase : https://supabase.com/dashboard
2. Allez dans **SQL Editor**
3. Copiez-collez le contenu du fichier `supabase/schema.sql`
4. Exécutez le script SQL

### 2. Vérifier les variables d'environnement

Assurez-vous que votre fichier `.env` (ou `.env.local`) contient :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=votre-clé-publique
```

Ces valeurs se trouvent dans :
- **Supabase Dashboard** → **Settings** → **API**

### 3. Structure de la base de données

Le schéma crée les tables suivantes :

#### `profiles`
- Étend les utilisateurs Supabase avec des informations supplémentaires
- Créée automatiquement lors de l'inscription

#### `beneficiaries`
- Liste des bénéficiaires (synagogue, yeshiva, etc.)
- Liée à l'utilisateur via `user_id`

#### `incomes`
- Revenus de l'utilisateur
- Calcule automatiquement `maasser_due` (10% du revenu)

#### `donations`
- Dons effectués
- Liés à un bénéficiaire et à l'utilisateur

### 4. Sécurité (Row Level Security - RLS)

Toutes les tables ont des politiques RLS activées :
- ✅ Les utilisateurs ne peuvent voir que leurs propres données
- ✅ Les utilisateurs ne peuvent modifier que leurs propres données
- ✅ Les utilisateurs ne peuvent supprimer que leurs propres données

### 5. Fonctionnalités automatiques

- **Création de profil** : Un profil est automatiquement créé lors de l'inscription
- **Mise à jour des timestamps** : `updated_at` est mis à jour automatiquement

### 6. Indexes

Des index ont été créés pour optimiser les performances :
- Recherche par `user_id`
- Recherche par `date`
- Recherche par `beneficiary_id`

## 🔧 Vérification

Après avoir exécuté le script SQL, vérifiez que :

1. ✅ Les 4 tables sont créées (`profiles`, `beneficiaries`, `incomes`, `donations`)
2. ✅ Les politiques RLS sont activées
3. ✅ Les triggers sont créés
4. ✅ Les fonctions sont créées

## 📝 Notes importantes

- Les données sont automatiquement isolées par utilisateur grâce au RLS
- L'authentification utilise le système Supabase Auth (sécurisé)
- Les mots de passe sont hashés automatiquement par Supabase
- Les sessions sont gérées automatiquement par Supabase

