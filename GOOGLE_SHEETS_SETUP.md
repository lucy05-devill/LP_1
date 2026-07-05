# Connecting the Contact Forms to Google Sheets

Both quote forms (on the homepage and on `contact.html`) submit to a Google Apps
Script "Web App" URL, which writes each enquiry into a Google Sheet as a new row.

## 1. Create the Sheet + Script

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet — name it something like **"SLS Enquiries"**.
2. Open **Extensions → Apps Script**.
3. Delete the placeholder `function myFunction() {}` code.
4. Open `google-apps-script/Code.gs` from this project, copy its contents, and paste it into the Apps Script editor.
5. Save the project (any name is fine, e.g. "SLS Form Handler").

## 2. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**.
5. Google will ask you to authorize the script — approve it (it's your own script, accessing your own sheet).
6. Copy the **Web app URL** shown. It looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

## 3. Connect the Website

1. Open `assets/js/config.js`.
2. Replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with the URL you copied.
3. Save and re-upload/redeploy the site.

That's it — submissions from either form will now appear as new rows in the
**Enquiries** tab of your spreadsheet, with a timestamp and which page they
came from.

## 4. Updating the script later

If you ever edit `Code.gs` again (e.g. to add a field), you must create a
**new version** of the deployment for changes to take effect:

**Deploy → Manage deployments → Edit (pencil icon) → Version: New version → Deploy**

## Notes

- The form uses `fetch(...)` with `mode: "no-cors"` because Apps Script Web
  Apps don't return CORS headers. This means the browser can't read the
  response back, so the site shows the success message as soon as the
  request is sent without errors — it can't distinguish "sheet rejected it"
  from "sheet accepted it". If you want stronger confirmation, you can wire
  up a Zapier/Make webhook instead, or check the sheet directly.
- No API keys or credentials are stored in the site's code — the Apps
  Script URL only allows appending rows, nothing else.
