/** Ecommerce dashboard backend for Google Apps Script.
 * Uses the active spreadsheet and locates fields by header name, not column number.
 */
const CONFIG = {
  SHEET_NAME: '', // Blank means use the active sheet. Set a tab name if preferred.
  REQUIRED_HEADERS: ['OrderID', 'Date', 'Product', 'Quantity', 'UnitPrice', 'OrderStatus'],
  ADDED_HEADERS: ['Category'],
  EXCLUDED_REVENUE_STATUSES: ['cancelled', 'returned'],
  CURRENCY: 'USD' // Change this to NGN, GBP, etc. to match your data.
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('DecodeLabs Dashboard')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getDashboardData() {
  const sheet = getSheet_();
  ensureCategoryColumn_(sheet);
  const snapshot = readSnapshot_(sheet); // One getValues() call for all sheet data.
  return { rows: snapshot.rows, headers: snapshot.headers, options: buildOptions_(snapshot.rows), currency: CONFIG.CURRENCY };
}

function saveOrder(payload) {
  return withWriteLock_(function () {
    const sheet = getSheet_();
    ensureCategoryColumn_(sheet);
    const snap = readSnapshot_(sheet);
    validatePayload_(payload, snap.headers, false);
    const idHeader = findHeader_(snap.headers, 'OrderID');
    const id = clean_(payload.OrderID) || makeOrderId_(snap.rows, snap.headers);
    if (idHeader && snap.rows.some(r => String(r.OrderID).trim() === id)) throw new Error('That OrderID already exists.');
    const rowObject = normalizePayload_(payload, snap.headers);
    rowObject.OrderID = id;
    writeObjectRow_(sheet, snap.headers, rowObject, null);
    return { success: true, message: 'Order added.', orderId: id };
  });
}

function updateOrder(orderId, payload) {
  return withWriteLock_(function () {
    const sheet = getSheet_();
    ensureCategoryColumn_(sheet);
    const snap = readSnapshot_(sheet);
    const idHeader = findHeader_(snap.headers, 'OrderID');
    if (!idHeader) throw new Error('The sheet needs an OrderID column to edit orders safely.');
    const target = snap.rows.find(r => String(r.OrderID).trim() === String(orderId).trim());
    if (!target) throw new Error('Order not found. Refresh the dashboard and try again.');
    validatePayload_(payload, snap.headers, true);
    const obj = Object.assign({}, target, normalizePayload_(payload, snap.headers));
    obj.OrderID = target.OrderID;
    writeObjectRow_(sheet, snap.headers, obj, target._rowNumber);
    return { success: true, message: 'Order updated.' };
  });
}

function deleteOrder(orderId) {
  return withWriteLock_(function () {
    const sheet = getSheet_();
    const snap = readSnapshot_(sheet);
    const target = snap.rows.find(r => String(r.OrderID).trim() === String(orderId).trim());
    if (!target) throw new Error('Order not found. Refresh the dashboard and try again.');
    sheet.deleteRow(target._rowNumber);
    return { success: true, message: 'Order deleted.' };
  });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No active spreadsheet found. Open Apps Script from the Google Sheet you imported.');
  const sheet = CONFIG.SHEET_NAME ? ss.getSheetByName(CONFIG.SHEET_NAME) : ss.getActiveSheet();
  if (!sheet) throw new Error('Could not find the configured sheet tab.');
  return sheet;
}

function ensureCategoryColumn_(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headerRow = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
  if (!findHeader_(headerRow, 'Category')) {
    sheet.getRange(1, lastCol + 1).setValue('Category');
  }
}

function readSnapshot_(sheet) {
  const range = sheet.getDataRange();
  const values = range.getValues(); // Read the sheet once; no cell-by-cell reads.
  if (!values.length || !values[0].some(v => clean_(v))) throw new Error('The sheet is empty. Put the CSV headers in row 1 and order data below them.');
  const headers = values[0].map(v => clean_(v));
  const missing = CONFIG.REQUIRED_HEADERS.filter(h => !findHeader_(headers, h));
  if (missing.length) throw new Error('Missing required column(s): ' + missing.join(', ') + '. Check the header row.');
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const raw = values[i];
    if (!raw.some(v => clean_(v))) continue; // Ignore fully blank rows.
    const obj = {};
    headers.forEach((h, j) => { if (h) obj[h] = raw[j]; });
    obj._rowNumber = i + 1;
    obj.OrderID = clean_(obj.OrderID);
    obj.Date = normalizeDate_(obj.Date);
    obj.Product = clean_(obj.Product);
    obj.Category = clean_(obj.Category) || 'Uncategorized';
    obj.OrderStatus = clean_(obj.OrderStatus) || 'Unknown';
    obj.CouponCode = clean_(obj.CouponCode) || 'No coupon';
    obj.Quantity = numeric_(obj.Quantity);
    obj.UnitPrice = numeric_(obj.UnitPrice);
    obj.TotalPrice = numeric_(obj.TotalPrice);
    // Fall back to quantity × unit price if TotalPrice is absent or malformed.
    if (obj.TotalPrice === null) obj.TotalPrice = (obj.Quantity || 0) * (obj.UnitPrice || 0);
    rows.push(obj);
  }
  return { headers: headers, rows: rows };
}

function buildOptions_(rows) {
  function unique(key) { return [...new Set(rows.map(r => clean_(r[key]) || (key === 'Category' ? 'Uncategorized' : 'Unknown')))].sort(); }
  const dates = rows.map(r => r.Date).filter(Boolean).sort();
  return { categories: unique('Category'), statuses: unique('OrderStatus'), minDate: dates[0] || '', maxDate: dates[dates.length - 1] || '' };
}

function validatePayload_(payload, headers, isUpdate) {
  if (!payload || typeof payload !== 'object') throw new Error('No order details were received.');
  const required = ['Date', 'Product', 'Quantity', 'UnitPrice', 'OrderStatus'];
  required.forEach(k => { if (!clean_(payload[k])) throw new Error(k + ' is required.'); });
  if (!isUpdate && payload.OrderID && clean_(payload.OrderID).length > 100) throw new Error('OrderID is too long.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(payload.Date)) || !isValidISODate_(String(payload.Date))) throw new Error('Enter a valid date.');
  const qty = Number(payload.Quantity), price = Number(payload.UnitPrice);
  if (!Number.isFinite(qty) || qty <= 0 || !Number.isInteger(qty)) throw new Error('Quantity must be a positive whole number.');
  if (!Number.isFinite(price) || price < 0) throw new Error('UnitPrice must be a valid number greater than or equal to zero.');
  if (payload.TotalPrice !== undefined && clean_(payload.TotalPrice) !== '') {
    const total = Number(payload.TotalPrice);
    if (!Number.isFinite(total) || total < 0) throw new Error('TotalPrice must be a valid non-negative number.');
  }
  const productHeader = findHeader_(headers, 'Product');
  if (!productHeader) throw new Error('The sheet needs a Product column.');
}

function normalizePayload_(payload, headers) {
  const out = {};
  headers.forEach(h => {
    if (!h) return;
    if (Object.prototype.hasOwnProperty.call(payload, h)) out[h] = payload[h];
  });
  out.Date = String(payload.Date || '');
  out.Product = clean_(payload.Product);
  out.Quantity = Number(payload.Quantity);
  out.UnitPrice = Number(payload.UnitPrice);
  if (findHeader_(headers, 'TotalPrice')) {
    out.TotalPrice = clean_(payload.TotalPrice) === '' ? out.Quantity * out.UnitPrice : Number(payload.TotalPrice);
  }
  if (findHeader_(headers, 'Category')) out.Category = clean_(payload.Category) || 'Uncategorized';
  if (findHeader_(headers, 'CouponCode')) out.CouponCode = clean_(payload.CouponCode) || 'No coupon';
  if (findHeader_(headers, 'OrderStatus')) out.OrderStatus = clean_(payload.OrderStatus) || 'Pending';
  return out;
}

function writeObjectRow_(sheet, headers, obj, rowNumber) {
  const row = headers.map(h => {
    if (!h) return '';
    if (!Object.prototype.hasOwnProperty.call(obj, h)) return '';
    if (h === 'Date') return parseISODate_(String(obj[h]));
    return obj[h];
  });
  if (rowNumber) sheet.getRange(rowNumber, 1, 1, headers.length).setValues([row]);
  else sheet.getRange(sheet.getLastRow() + 1, 1, 1, headers.length).setValues([row]);
}

function withWriteLock_(callback) {
  const lock = LockService.getDocumentLock();
  lock.waitLock(15000);
  try { return callback(); } finally { lock.releaseLock(); }
}
function findHeader_(headers, name) {
  const target = String(name).trim().toLowerCase();
  const i = headers.findIndex(h => String(h || '').trim().toLowerCase() === target);
  return i < 0 ? null : headers[i];
}
function clean_(value) { return value === null || value === undefined ? '' : String(value).trim(); }
function numeric_(value) {
  if (value === '' || value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const n = Number(String(value).replace(/[$£€,\s]/g, '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}
function normalizeDate_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const s = clean_(value);
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  return isNaN(d.getTime()) ? '' : Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}
function parseISODate_(s) {
  const parts = s.split('-').map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
}
function isValidISODate_(s) { const d = parseISODate_(s); return d.getFullYear() === +s.slice(0,4) && d.getMonth() === +s.slice(5,7)-1 && d.getDate() === +s.slice(8,10); }
function makeOrderId_(rows, headers) {
  const existing = new Set(rows.map(r => String(r.OrderID || '').trim()));
  let id;
  do { id = 'ORD-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random() * 900 + 100); } while (existing.has(id));
  return id;
}
