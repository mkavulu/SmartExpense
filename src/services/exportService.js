import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ExportService = {
  exportCSV: (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Transactions");
    XLSX.writeFile(wb, "transactions.csv");
  },

  exportExcel: (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
  },

  exportPDF: (data) => {
    const doc = new jsPDF();
    doc.text("Transactions Report", 14, 15);
    doc.autoTable({
      startY: 20,
      head: [["Title", "Type", "Category", "Amount", "Date"]],
      body: data.map((t) => [
        t.title,
        t.transaction_type,
        t.category_name,
        t.amount,
        t.date,
      ]),
    });
    doc.save("transactions.pdf");
  },
};

export default ExportService;
