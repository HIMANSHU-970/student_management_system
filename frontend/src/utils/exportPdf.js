import jsPDF from "jspdf";

export const exportPDF = (data) => {
  const doc = new jsPDF();

  doc.text("Student Report", 20, 10);

  data.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.name} - ${item.value}`,
      10,
      20 + index * 10
    );
  });

  doc.save("report.pdf");
};