import jsPDF from "jspdf";
import { saveAs } from "file-saver";

// Tipe data untuk laporan
interface ReportData {
  score: number;
  positiveFactors: string[];
  negativeFactors: string[];
  recommendations: string[];
}

export const generatePdfReport = async (reportData: ReportData) => {
  try {
    // Metric conversion: mm untuk PDF (A4 = 210x297mm)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Set font untuk judul
    doc.setFontSize(24);
    doc.setTextColor(30, 41, 59); // slate-900
    const title = "Laporan Analisis Skor Kredit";
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, yPosition);

    yPosition += 12;

    // Tanggal
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105); // slate-600
    const date = `Tanggal: ${new Date().toLocaleDateString("id-ID")}`;
    const dateWidth = doc.getTextWidth(date);
    doc.text(date, (pageWidth - dateWidth) / 2, yPosition);

    yPosition += 16;

    // Skor Kredit
    doc.setFontSize(18);
    doc.setTextColor(14, 165, 233); // sky-500
    doc.text(`Skor Kredit Anda: ${reportData.score}`, 20, yPosition);

    yPosition += 14;

    // Faktor Positif
    doc.setFontSize(13);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text("Faktor Positif:", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85); // slate-700
    reportData.positiveFactors.forEach((factor) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      const lines = doc.splitTextToSize(`• ${factor}`, pageWidth - 40);
      doc.text(lines, 25, yPosition);
      yPosition += lines.length * 5 + 2;
    });

    yPosition += 6;

    // Faktor Negatif
    doc.setFontSize(13);
    doc.setTextColor(244, 63, 94); // rose-500
    doc.text("Faktor Negatif:", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85); // slate-700
    reportData.negativeFactors.forEach((factor) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      const lines = doc.splitTextToSize(`• ${factor}`, pageWidth - 40);
      doc.text(lines, 25, yPosition);
      yPosition += lines.length * 5 + 2;
    });

    yPosition += 6;

    // Rekomendasi
    doc.setFontSize(13);
    doc.setTextColor(245, 158, 11); // amber-500
    doc.text("Rekomendasi:", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85); // slate-700
    reportData.recommendations.forEach((rec) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      const lines = doc.splitTextToSize(`• ${rec}`, pageWidth - 40);
      doc.text(lines, 25, yPosition);
      yPosition += lines.length * 5 + 2;
    });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(120, 113, 108); // slate-500
    doc.text(
      "Aksesa - Platform Credit Scoring UMKM © 2026",
      20,
      pageHeight - 10,
    );

    // Simpan PDF
    doc.save("laporan-skor-kredit.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Handle PDF generation error
    alert("Gagal membuat PDF. Silakan coba lagi.");
  }
};
