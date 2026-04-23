import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function getSafe(v) {
  return v === null || v === undefined || v === "" ? "-" : String(v);
}

export function exportReportAsCSV(report) {
  if (!report) return;

  const rows = [
    ["Field", "Value"],
    ["Product ID", getSafe(report.productId)],
    ["Product Name", getSafe(report.productName)],
    ["Carbon Footprint", getSafe(report.carbonFootprint)],
    ["Shadow Cost", getSafe(report.shadowCost)],
    ["Eco Score", getSafe(report.ecoScore)],
    ["Water Footprint", getSafe(report.waterFootprint)],
    ["Energy Consumption", getSafe(report.energyConsumption)],
    ["Transport Emission", getSafe(report.transportEmission)],
    ["Recycling Score", getSafe(report.recyclingScore)],
    ["Overall Sustainability Score", getSafe(report.overallSustainabilityScore)],
    ["SDG 12 Impact", getSafe(report.sdg12Impact)],
    ["SDG 13 Impact", getSafe(report.sdg13Impact)],
    ["SDG 9 Impact", getSafe(report.sdg9Impact)],
  ];

  const csv = rows.map((row) => row.map(escapeCSV).join(",")).join("\n");
  downloadBlob(csv, "text/csv;charset=utf-8;", getFileName(report, "csv"));
}

export function exportReportAsPDF(report) {
  if (!report) return;

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("EcoScan Sustainability Report", 14, 18);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);

  const tableData = [
    ["Product ID", getSafe(report.productId)],
    ["Product Name", getSafe(report.productName)],
    ["Carbon Footprint", getSafe(report.carbonFootprint)],
    ["Shadow Cost", getSafe(report.shadowCost)],
    ["Eco Score", getSafe(report.ecoScore)],
    ["Water Footprint", getSafe(report.waterFootprint)],
    ["Energy Consumption", getSafe(report.energyConsumption)],
    ["Transport Emission", getSafe(report.transportEmission)],
    ["Recycling Score", getSafe(report.recyclingScore)],
    ["Overall Sustainability Score", getSafe(report.overallSustainabilityScore)],
    ["SDG 12 Impact", getSafe(report.sdg12Impact)],
    ["SDG 13 Impact", getSafe(report.sdg13Impact)],
    ["SDG 9 Impact", getSafe(report.sdg9Impact)],
  ];

  autoTable(doc, {
    startY: 34,
    head: [["Metric", "Value"]],
    body: tableData,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [34, 197, 94],
    },
  });

  doc.save(getFileName(report, "pdf"));
}

function getFileName(report, ext) {
  const base = String(report?.productName || "ecoscan_report")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${base || "ecoscan_report"}_${Date.now()}.${ext}`;
}

function escapeCSV(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function downloadBlob(content, mimeType, fileName) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}