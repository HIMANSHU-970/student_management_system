import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { pdfStyles } from "../styles/feePdfStyles";

export const generateFeePdf = (selectedStudent, getPendingAmount) => {
  if (!selectedStudent) return;

  const doc = new jsPDF();

  // =========================
  // Header
  // =========================

  doc.setFillColor(...pdfStyles.header.bgColor);
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("CAMPUS QUANTUM", 14, 15);

  doc.setFontSize(10);
  doc.text("Official Fee Structure", 14, 23);

  doc.setTextColor(0, 0, 0);

  // =========================
  // Student Info
  // =========================

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Student Fee Structure", 14, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(
    `Student Name : ${selectedStudent.student.name}`,
    14,
    54
  );

  doc.text(
    `Email : ${selectedStudent.student.email}`,
    14,
    61
  );

  doc.text(
    `Generated : ${new Date().toLocaleDateString()}`,
    14,
    68
  );

  // =========================
  // Table
  // =========================

  const body = selectedStudent.records.map((f) => {

    const pending = f.amount - (f.paidAmount || 0);

    return [

      f.term,

      `₹${f.amount.toLocaleString()}`,

      `₹${(f.paidAmount || 0).toLocaleString()}`,

      `₹${pending.toLocaleString()}`,

      pending === 0
        ? "Paid"
        : pending < f.amount
        ? "Partial"
        : "Pending",

      f.dueDate,

    ];

  });

  autoTable(doc, {

    startY: 78,

    head: [[
      "Term",
      "Total Fee",
      "Paid",
      "Pending",
      "Status",
      "Due Date",
    ]],

    body,

    theme: "grid",

    headStyles: {

      fillColor: pdfStyles.table.headColor,

      textColor: 255,

      halign: "center",

      fontStyle: "bold",

    },

    bodyStyles: {

      halign: "center",

      fontSize: 10,

    },

    alternateRowStyles: {

      fillColor: pdfStyles.table.alternateColor,

    },

  });

  let y = doc.lastAutoTable.finalY + 15;

  // =========================
  // Summary
  // =========================

  doc.setFillColor(...pdfStyles.summary.bgColor);

  doc.roundedRect(14, y, 182, 35, 3, 3, "F");

  doc.setFontSize(13);

  doc.setFont("helvetica", "bold");

  doc.text(
    `Total Fee : Rs.${selectedStudent.totalFee.toLocaleString()}`,
    20,
    y + 10
  );

  doc.text(
    `Paid Fee : Rs.${selectedStudent.totalPaid.toLocaleString()}`,
    20,
    y + 20
  );

  doc.text(
    `Pending Fee : Rs.${getPendingAmount(selectedStudent).toLocaleString()}`,
    20,
    y + 30
  );

  // =========================
  // Signature
  // =========================

  y += 55;

  doc.line(20, y, 70, y);

  doc.line(140, y, 190, y);

  doc.setFontSize(11);

  doc.text("Accountant", 28, y + 7);

  doc.text("Principal / Dean", 145, y + 7);

  // =========================
  // Footer
  // =========================

  doc.setDrawColor(180);

  doc.line(10, 285, 200, 285);

  doc.setFontSize(9);

  doc.setTextColor(120);

  doc.text(
    "This is a computer generated fee structure. No signature required.",
    15,
    291
  );

  doc.save(`${selectedStudent.student.name}_Fee.pdf`);
};