# RoC Onboarding Form

Onboarding form για τους πελάτες της Roots of Carbon.

## Setup

### 1. Zoho Refresh Token

Άνοιξε αυτό το URL στον browser σου (αντικατέστησε το CLIENT_ID):

```
https://accounts.zoho.eu/oauth/v2/auth?scope=WorkDrive.files.ALL,ZohoMail.messages.ALL&client_id=1000.SM3V4GRY7QLY1UTA2A3RTFI920YQ2F&response_type=code&access_type=offline&redirect_uri=https://roc-onboarding.vercel.app/api/auth/callback
```

Θα σε ρωτήσει να δώσεις άδεια — πάτα "Accept". Μετά θα σε κάνει redirect και θα δεις το refresh token στη σελίδα.

### 2. Zoho WorkDrive Folder ID

1. Πήγαινε στο WorkDrive
2. Φτιάξε φάκελο "RoC Onboarding"
3. Άνοιξέ τον — το ID είναι στο URL: `workdrive.zoho.eu/ws/.../{FOLDER_ID}`

### 3. Zoho SMTP Password

1. Πήγαινε στο Zoho Mail → Settings → Security → App Passwords
2. Φτιάξε νέο App Password για "RoC Onboarding"
3. Αντέγραψε τον κωδικό

### 4. Vercel Environment Variables

Στο Vercel dashboard → Project → Settings → Environment Variables, πρόσθεσε:

```
ZOHO_CLIENT_ID=1000.SM3V4GRY7QLY1UTA2A3RTFI920YQ2F
ZOHO_CLIENT_SECRET=274bbd6f7862608f80523c9236eac863794b5e0378
ZOHO_REFRESH_TOKEN=<από βήμα 1>
ZOHO_WORKDRIVE_PARENT_FOLDER_ID=<από βήμα 2>
NOTIFICATION_EMAIL=info@rootsofcarbon.gr
ZOHO_SMTP_USER=info@rootsofcarbon.gr
ZOHO_SMTP_PASS=<από βήμα 3>
```

## Deploy

Κάνε push στο GitHub και το Vercel κάνει auto-deploy.
