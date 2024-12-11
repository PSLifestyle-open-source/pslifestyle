
# Step-by-Step Instructions for Setting Up the Google Cloud Environments

---

## 1. Create a New Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click **Select a Project** (Dropdown) > **New Project**.
3. Enter a name for the project (e.g., `pslifestyle-cloud`).
4. Click **Create**.

---

## 2. Link the Cloud Project to Firebase
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Get started with a firebase project**.
3. Click **Add Firebase to Google Cloud project** link in the bottom instead of giving name to your project.
4. Select the Cloud project you created earlier (e.g., `pslifestyle-cloud`).
5. Complete the setup and enable Google Analytics if needed.

---

## 3. Set Up Firebase Web App
1. In the Firebase Console, go to **Project Overview**.
2. Add Web App to your project by clicking on the **Web** (</>) icon.
3. Register the app by giving it a name (e.g., `pslifestyle-cloud`).
4. Click checkbox to set up Firebase Hosting for the app.
5. Select default value from the dropdown for Firebase Hosting.
6. Click **Register app**.
7. Copy the Firebase configuration object and replace the values in `firebaseInit.ts` file in the `enduser-ui` folder.
8. Replace values in `.firebaserc` file in the `enduser-ui` folder and `functions` folder with your project ID (e.g., `pslifestyle-cloud`).
Example `.firebaserc` files:

   functions
   ```json
   {
      "projects": {
         "default": "pslifestyle-cloud"
      }
   }
   ```
   enduser-ui
   ```json
   {
     "projects": {
       "default": "pslifestyle-cloud"
     },
     "targets": {
       "pslifestyle-cloud": {
         "hosting": {
           "enduser-ui": [
             "pslifestyle-cloud"
           ]
         }
       }
     }
   }
   ```
9. Complete Wizard and click **Continue to console**.

---

## 4. Set Up Firestore Database
1. In the Firebase Console, go to **Build** > **Firestore Database** > and click **Create database**.
2. Follow the instructions to set up the database. Use default as Database ID. Select **Start in production mode** and choose the appropriate location.

---

## 5. Set Up Functions
1. In the Firebase Console, go to **Build** > **Functions**.
2. Click **Get Started** and follow the prompts to set up Cloud Functions for your project.
3. Dashboard should read "Waiting for your first deploy..."

---

## 6. Enable Authentication (Email and Password)
1. In the Firebase Console, go to **Build** > **Authentication**.
2. Click **Get started**.
3. Enable **Email/Password** and click **Save**.

---

## 7. Enable Firebase Storage
1. In the Firebase Console, go to **Build** > **Storage**.
2. Click **Get started**.
3. Choose location according to your needs. Access frequency should be **Standard**.
4. Select **Start in production mode** and click **Create**.

---

## 8. Make a Copy of the Public Google Sheet
1. Sign in to your Google Account and go to the public [Google Sheet](https://docs.google.com/spreadsheets/d/1eyCMW3RcFu_49pqsvZj3G5VD84c0mWIwIg3oxYMzrmg/edit).
2. Click **File** > **Make a copy**. Make sure your new sheet is in GSheet format. .xlsx format is not supported in the export scripts. You can do this by clicking **File** > **Save as Google Sheets**.
3. Give the service account **Viewer** access to the Google Sheet by using the **Share** button and adding the service account email address. You can find the service account email from Firebase  **Project Settings** > **Service Accounts**.
4. Change the spreadsheet id in `packages/functions/src/Scripts/Factory/createGoogleSheetsFetchSettings.ts` to the new spreadsheet id. The Spreadsheet ID can be extracted directly from the Google Sheets URL. It is the long alphanumeric string found between /d/ and /edit in the URL.
5. Example: `https://docs.google.com/spreadsheets/d/<speadsheetId>/edit`

---

## 9. Enable Google Sheets API
1. Go to the Google Cloud Console [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com).
2. Click **Enable** to activate the API for your project.
3. Navigate to APIs & Services > Credentials.
4. Click from the Actions column (three dots)to edit the API key you’re using `Browser key (auto created by Firebase)`.
5. Check for API Restrictions. Allow it to access the Google Sheets API.
6. Click **Save**.

---

## 10. Add App Engine
1. Go to the [App Engine Setup](https://console.cloud.google.com/appengine/start) in Google Cloud Console.
2. Click **Create Application**.
3. Set up App Engine by choosing a region.
4. Select use the Service Account that Firebase created for your project from the dropdown.
5. Click **Next**
6. You should also check the region value `FUNCTION_DEPLOY_REGION` in file `enduser-ui/src/firebase/api/utils.ts` matches the region you selected.

---

## 11. Add Secrets to Secret Manager
1. Go to the [Secret Manager](https://console.cloud.google.com/security/secret-manager) in Google Cloud Console.
2. Enable the Secret Manager API if not already enabled.
3. Click **Create Secret** for each secret your Cloud Functions require.
4. Add the following secrets:

| Name             | Description  (secret value)                                                                                                                                                      |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| FM_ACCOUNT_ID    | Account ID for Flowmailer (used for optional login process, magic link). This can be empty string ("") at first before Flowmailer is set up https://flowmailer.com/              |
| FM_CLIENT_ID     | Client ID for Flowmailer.   This can be empty string ("") at first  before Flowmailer is set up                                                                                  |
| FM_CLIENT_SECRET | Client Secret for Flowmailer. This can be empty string ("") at first before Flowmailer is set up                                                                                 |
| MAIL_HASHKEY     | Key for hashing email data for security. Can be any string. Beware! If you change this later on, it will invalidate all registered user accounts!                                |
| RSA_PRIVATE_KEY  | Private key for login functionality. You can generate a new key-pair using bash and openssl  `openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048` |
| RSA_PUBLIC_KEY   | Private key for login functionality. Extract the Public Key from the Private Key `openssl rsa -pubout -in private_key.pem -out public_key.pem`                                   |

---

## 12. Generate Service Account Credentials for Deployment
1. Go to Firebase Console. In the left-hand menu, click on the **gear icon** ⚙️ next to "Project Overview."
2. Select **Project settings**.
3. In the **Project settings** page, click on the **Service Accounts** tab.
4. Click on **Generate new private key**.
5. A confirmation dialog will appear; click **Generate key**.
6. `.json` file containing your service account credentials will automatically be downloaded to your computer.
7. Encode the content of that file with **Base64** example with macOS Terminal:
   ```bash
   base64 -i private-key.json -o encoded-key
   ```
   and run the following command in terminal to set up the service account in your terminal:
   ```bash
   export SERVICE_ACCOUNT=changeThisToEncodedKey
   ```
   or you can add the service account to `.env` file in the `functions` folder:
   ```bash
   SERVICE_ACCOUNT=changeThisToEncodedKey
   ```
- **Do not commit the file to version control (e.g., GitHub).**
- Store it securely, such as in an environment variable or a secrets management tool.

---

## 13. Run Export Scripts
1. Run PNPM scripts in `./packages/functions/` folder to export data to Firebase Storage.
   ```bash
   pnpm run export:scripts
   ```
   ```bash
   pnpm run export:translations
   ```
2. If nothing is exported to the storage but script runs fine, make sure store bucket reference is correct in `createFirebaseApp.ts`.

---

## 14. Deploy Frontend (`enduser-ui`)
1. Navigate to the `enduser-ui` folder in your terminal.
2. Build your app
   ```bash
   pnpm run build
   ```
3. Make sure service account is encoded in `.env` file or set in Terminal with export command.
4. Login to firebase (if not already authenticated):
   ```bash
   firebase login
   ```
5. Select default project and check it's the right one
   ```bash
   firebase use default
   ```
6. Deploy the frontend:
   ```bash
   firebase deploy
   ```

---

## 15. Deploy Backend (`functions`)
1. Navigate to the `functions` folder in your terminal.
2. Build your app
   ```bash
   pnpm run build
   ```
3. Make sure service account is encoded in `.env` file or set in Terminal with export command.
4. Login to firebase (if not already authenticated):
   ```bash
   firebase login
   ```
5. Select default project
   ```bash
   firebase use default
   ```
6. Deploy the backend:
   ```bash
   firebase deploy
   ```
7. The deployment might take a while, just be patient. If your first deploy fails in `requestLink` function, you can try to run deploy command again.

---

## 16. Check your website
1. Go to the Firebase Console and navigate to **Hosting**.
2. Click on the **URL** to view your website.
3. If the translations are not loading, it might be due to CORS settings. Check the next step.

---

## 17. CORS Configuration
1. You might need to configure CORS for your Firebase Storage.
2. Go to the Google Cloud Console and navigate to **Cloud Storage**.
3. Click **View Buckets List** link
3. Click on the bucket you are using for Firebase Storage. It should be named `your-project-id.firebasestorage.app `.
4. Run Activate Cloud Shell (icon in the top right of the console) and run the following command to see if CORS is set:
   ```bash
   gcloud storage buckets describe gs://your-bucket-name --format="default(cors_config)"
   ```
5. If CORS is not set (returns null), you can create a cors.json with nano. Run `nano cors.json` in the Cloud console and paste the following configuration (you can adjust the values as needed):
   ```json
   [
      {
      "origin": ["*"],
      "method": ["GET", "HEAD", "OPTIONS"],
      "responseHeader": ["Content-Type", "Authorization"],
      "maxAgeSeconds": 3600
      }
   ]
   ```
   Press `Ctrl + X` to exit and save the file.
6. Update the CORS configuration with the following command:
   ```bash
   gcloud storage buckets update gs://your-bucket-name --cors-file=cors.json
   ```
7. Run the following command again to verify the CORS configuration:
   ```bash
   gcloud storage buckets describe gs://your-bucket-name --format="default(cors_config)"
   ```

## 18. Setting Up Optional Login Functionality

If you wish to enable the optional login functionality in the app, you will need to set up your own Flowmailer ([Flowmailer is now Spotler](https://spotler.com/flowmailer-is-now-spotler)) instance. This includes configuring the necessary accounts, keys, and settings to integrate Flowmailer with your project. Please note that the setup and configuration of Flowmailer is not covered in this installation document, as it involves third-party account management and configurations outside the scope of this guide. Refer to Flowmailer’s official documentation for detailed instructions on how to set it up.

See also the [users-and-sessions](./detailed_feature_doc/users-and-sessions.md) documentation for more information on how the optional login functionality works in the app.
