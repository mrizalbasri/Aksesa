import jsPDF from "jspdf";
import { saveAs } from "file-saver";

interface ReportData {
  score: number;
  riskCategory: string;
  positiveFactors: string[];
  negativeFactors: string[];
  recommendations: string[];
  businessName?: string;
  dataSource?: "invoice" | "marketplace" | "manual" | "mixed";
  submittedAt?: string;
  invoiceFileName?: string;
  loanAmount?: number;
  interestRate?: number;
}

const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

const calculateMonthlyPayment = (
  principal: number,
  tenorMonths: number,
  interestPercent: number,
): number => {
  const principalPerMonth = principal / tenorMonths;
  const interestPerMonth = principal * (interestPercent / 100);
  return principalPerMonth + interestPerMonth;
};

const getRiskCategoryLabel = (category: string, score: number): string => {
  if (score >= 71) return "Layak Kredit";
  if (score >= 41) return "Risiko Sedang";
  return "Risiko Tinggi";
};

const getDataSourceLabel = (
  source?: "invoice" | "marketplace" | "manual" | "mixed",
  invoiceFileName?: string,
): string => {
  if (invoiceFileName && invoiceFileName !== "-") {
    return `Data Nota/Invoice: ${invoiceFileName}`;
  }
  switch (source) {
    case "invoice":
      return "Data Nota/Invoice Penjualan";
    case "marketplace":
      return "Data Marketplace (Tokopedia/Shopee)";
    case "manual":
      return "Input Transaksi Harian";
    case "mixed":
      return "Kombinasi Multiple Data";
    default:
      return "Data Alternatif";
  }
};

export const generatePdfReport = async (reportData: ReportData) => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    doc.setFont("helvetica", "bold");

    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text("AKSESA", margin, y + 8);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Laporan Analisis Skor Kredit", margin, y + 15);

    y += 25;

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Skor Utama Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("HASIL ANALISIS KREDIT", margin, y);
    y += 10;

    // Score box
    const scoreBoxHeight = 35;
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, y, contentWidth, scoreBoxHeight, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.setTextColor(37, 99, 235);
    doc.text(`${reportData.score}`, margin + 15, y + 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("/ 100", margin + 35, y + 18);

    const riskLabel = getRiskCategoryLabel(
      reportData.riskCategory,
      reportData.score,
    );
    const riskColor =
      reportData.score >= 71
        ? [34, 197, 94]
        : reportData.score >= 41
          ? [234, 179, 8]
          : [239, 68, 68];
    doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.setFontSize(14);
    doc.text(riskLabel, margin + 60, y + 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const dateStr = reportData.submittedAt
      ? new Date(reportData.submittedAt).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
    doc.text(`Tanggal Analisis: ${dateStr}`, margin + 60, y + 28);

    y += scoreBoxHeight + 10;

    // Ringkasan Bisnis
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("RINGKASAN BISNIS", margin, y);
    y += 8;

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, y, contentWidth, 20, 3, 3, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);

    if (reportData.businessName) {
      doc.text(`Nama Bisnis: ${reportData.businessName}`, margin + 5, y + 8);
    }
    doc.text(
      `Sumber Data: ${getDataSourceLabel(reportData.dataSource, reportData.invoiceFileName)}`,
      margin + 5,
      reportData.businessName ? y + 15 : y + 8,
    );

    y += 30;

    // Faktor Pembentuk Skor
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("FAKTOR PEMBENTUK SKOR", margin, y);
    y += 8;

    // Positive Factors
    if (reportData.positiveFactors.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(22, 163, 74);
      doc.text("Faktor Positif", margin, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      reportData.positiveFactors.forEach((factor) => {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = margin;
        }
        const lines = doc.splitTextToSize(`• ${factor}`, contentWidth - 10);
        doc.text(lines, margin + 5, y);
        y += lines.length * 5 + 2;
      });
      y += 4;
    }

    // Negative Factors
    if (reportData.negativeFactors.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(220, 38, 38);
      doc.text("Faktor Negatif", margin, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      reportData.negativeFactors.forEach((factor) => {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = margin;
        }
        const lines = doc.splitTextToSize(`• ${factor}`, contentWidth - 10);
        doc.text(lines, margin + 5, y);
        y += lines.length * 5 + 2;
      });
      y += 4;
    }

    y += 6;

    // Rekomendasi
    if (reportData.recommendations.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("REKOMENDASI", margin, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      reportData.recommendations.forEach((rec, index) => {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = margin;
        }
        const lines = doc.splitTextToSize(
          `${index + 1}. ${rec}`,
          contentWidth - 10,
        );
        doc.text(lines, margin + 5, y);
        y += lines.length * 5 + 2;
      });
      y += 6;
    }

    // Simulasi Pinjaman
    const loanAmount = reportData.loanAmount || 10000000;
    const interestRate = reportData.interestRate || 1.5;
    const tenorOptions = [6, 12, 18, 24];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("ESTIMASI SIMULASI PINJAMAN", margin, y);
    y += 8;

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Berdasarkan jumlah pinjaman: ${formatRupiah(loanAmount)} dengan bunga ${interestRate}% flat per bulan`,
      margin,
      y + 4,
    );
    y += 12;

    // Table header
    doc.setFillColor(55, 65, 81);
    doc.rect(margin, y, contentWidth, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Tenor", margin + 5, y + 5.5);
    doc.text("Cicilan per Bulan", margin + 50, y + 5.5);
    doc.text("Total Pengembalian", margin + 100, y + 5.5);
    y += 8;

    // Table rows
    doc.setFont("helvetica", "normal");
    tenorOptions.forEach((tenor, index) => {
      const monthlyPayment = calculateMonthlyPayment(
        loanAmount,
        tenor,
        interestRate,
      );
      const totalPayment = monthlyPayment * tenor;

      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, y, contentWidth, 8, "F");
      }

      doc.setTextColor(51, 65, 85);
      doc.text(`${tenor} Bulan`, margin + 5, y + 5.5);
      doc.text(formatRupiah(monthlyPayment), margin + 50, y + 5.5);
      doc.text(formatRupiah(totalPayment), margin + 100, y + 5.5);
      y += 8;
    });

    y += 10;

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      "Dokumen ini generated oleh Aksesa dan tidak bersifat mengikat. Keputusan final ada pada lembaga pembiayaan.",
      margin,
      y,
    );
    y += 4;
    doc.text(
      "Aksesa - Platform Credit Scoring UMKM © 2026",
      margin,
      y,
    );

    // Save PDF
    const fileName = `laporan-skor-kredit-${
      reportData.businessName || "aksesa"
    }-${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Gagal membuat PDF. Silakan coba lagi.");
  }
};