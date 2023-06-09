const fs = require("fs");
const PDFDocument = require("pdfkit");

function crearFactura(datos, listaItems, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateCustomerInformation(doc, datos);
  generateInvoiceTable(doc, listaItems, datos);
  //generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateCustomerInformation(doc, datos) {
  doc.fillColor("#444444").fontSize(20).text(datos.encabezado, 200, 100);

  generateHr(doc, 140);

  const customerInformationTop = 150;

  doc
    .fontSize(10)
    .text("Mesa Nro.:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(datos.mesaId, 150, customerInformationTop)
    .font("Helvetica")
    .text("Restaurante:", 50, customerInformationTop + 15)
    .text(datos.nombreRestaurante, 150, customerInformationTop + 15)
    .text("Planta:", 50, customerInformationTop + 30)
    .text(datos.planta, 150, customerInformationTop + 30)
    .text("Fecha de Cierre:", 50, customerInformationTop + 60)
    .text(datos.fechaCierre, 150, customerInformationTop + 60)
    .text("Total de Gasto:", 50, customerInformationTop + 45)
    .text(datos.total, 150, customerInformationTop + 45)
    .fontSize("10")
    .text("Nombres:", 350, customerInformationTop + 10)
    .font("Helvetica")
    .fontSize("10")
    .text(datos.nombresCliente, 400, customerInformationTop + 10)
    .fontSize("10")
    .text("Apellidos:", 350, customerInformationTop + 30)
    .font("Helvetica")
    .fontSize("10")
    .text(datos.apellidosCliente, 400, customerInformationTop + 30)
    .fontSize("10")
    .text("Cédula:", 350, customerInformationTop + 50)
    .font("Helvetica")
    .fontSize("10")
    .text(datos.cedulaCliente, 400, customerInformationTop + 50)
    .moveDown();

  generateHr(doc, 225);
}

function generateInvoiceTable(doc, listaItems, datos) {
  let i;
  const invoiceTableTop = 250;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Producto",
    "Precio Unidad",
    "Cantidad",
    "Fecha/Hora",
    "Precio total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < listaItems.length; i++) {
    const item = listaItems[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.nombreProducto,
      item.precioUnitario,
      item.cantidad,
      item.fechaHora,
      item.precioTotal
    );

    generateHr(doc, position + 20);
  }

  const totalPosition = invoiceTableTop + (i + 1) * 30;
  doc.font("Helvetica-Bold");
  generateTotalRow(
    doc,
    totalPosition,
    "",
    "",
    "Total a Pagar",
    "",
    datos.total
  );
  doc.font("Helvetica");
}

function generateTableRow(
  doc,
  y,
  producto,
  precioUnitario,
  cantidad,
  fechaHora,
  preciototal
) {
  doc
    .fontSize(10)
    .text(producto, 50, y)
    .text(precioUnitario, 170, y, { width: 40, align: "center" })
    .text(cantidad, 270, y, { width: 90, align: "center" })
    .text(fechaHora, 380, y, { width: 90, align: "center" })
    .text(preciototal, 0, y, { align: "right" });
}

function generateTotalRow(
  doc,
  y,
  producto,
  precioUnitario,
  cantidad,
  fechaHora,
  preciototal
) {
  doc
    .fontSize("12")
    .text(producto, 50, y)
    .text(precioUnitario, 170, y, { width: 40, align: "center" })
    .text(cantidad, 270, y, { width: 90, align: "center" })
    .text(fechaHora, 380, y, { width: 90, align: "center" })
    .text(preciototal, 0, y, { align: "right" })
    .fontSize("10");
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

module.exports = {
  crearFactura,
};
