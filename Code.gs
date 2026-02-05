function doGet(e) {
  var output = JSON.stringify({
    status: 'success',
    production: getProductionData(),
    rejections: getRejectionsData()
  });

  return ContentService.createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}

function getProductionData() {
  // ID Hoja Producción: 1bAQm-hHlUF55ZGxs6UxtsgnOfQKuqAhYzwxeMPO5udk
  var ss = SpreadsheetApp.openById('1bAQm-hHlUF55ZGxs6UxtsgnOfQKuqAhYzwxeMPO5udk');
  var sheet = ss.getSheets()[0]; // Asumimos que está en la primera hoja
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = data.slice(1);

  return rows.map(function(row) {
    var item = {};
    headers.forEach(function(header, index) {
      // Normalizamos nombres de cabeceras para usar como claves
      var key = normalizeHeader(header);
      item[key] = row[index];
    });
    return item;
  });
}

function getRejectionsData() {
  // ID Hoja Rechazos: 13ANb7j0OHlo-HFOCdpGSCJvjITSqHlkruVF1SE5smr8
  var ss = SpreadsheetApp.openById('13ANb7j0OHlo-HFOCdpGSCJvjITSqHlkruVF1SE5smr8');
  var sheet = ss.getSheets()[0]; // Asumimos primera hoja
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = data.slice(1);

  return rows.map(function(row) {
    var item = {};
    headers.forEach(function(header, index) {
      var key = normalizeHeader(header);
      item[key] = row[index];
    });
    return item;
  });
}

function normalizeHeader(header) {
  // Convierte "Fecha de Producción" a "fechaDeProduccion" o similar simple
  if (!header) return 'columna_' + Math.random().toString(36).substr(2, 5);
  return header.toString()
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/\s+/g, '_') // Espacios a guiones bajos
    .replace(/[^a-z0-9_]/g, ''); // Eliminar caracteres especiales
}
