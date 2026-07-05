/**
 * Shubham Logistic Services — Contact Form Backend
 * ---------------------------------------------------
 * Deploy this as a Google Apps Script Web App bound to a Google Sheet.
 * Every enquiry submitted from index.html or contact.html is appended
 * as a new row.
 *
 * SETUP:
 * 1. Go to https://sheets.google.com and create a new spreadsheet
 *    (e.g. "SLS Enquiries").
 * 2. In the sheet, go to Extensions > Apps Script.
 * 3. Delete any starter code and paste this entire file in.
 * 4. Click "Deploy" > "New deployment".
 *    - Type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 5. Click Deploy, authorize the permissions it asks for.
 * 6. Copy the "Web app URL" it gives you (ends in /exec).
 * 7. Paste that URL into assets/js/config.js as GOOGLE_SCRIPT_URL.
 * 8. Re-deploy (Deploy > Manage deployments > Edit > New version)
 *    any time you edit this script.
 */

const SHEET_NAME = "Enquiries";

function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = JSON.parse(e.postData.contents);

    const row = [
      new Date(),
      data.page || "",
      data.name || "",
      data.company || "",
      data.email || "",
      data.phone || "",
      data.city || "",
      data.service || "",
      data.origin || "",
      data.destination || "",
      data.cargoDescription || "",
      data.weight || "",
      data.dimensions || "",
      data.additionalRequirements || ""
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "SLS enquiry endpoint is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Timestamp", "Source Page", "Name", "Company", "Email", "Phone",
      "City", "Service Required", "Origin", "Destination",
      "Cargo Description", "Approx. Weight", "Approx. Dimensions",
      "Additional Requirements"
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
