import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const usePdfExport = () => {
  const exportToPdf = async (elementId, filename = 'report.pdf') => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        alert('❌ Element not found');
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#0f1419',
        scale: 2,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }

      pdf.save(filename);
      alert('✅ PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      alert('❌ Failed to export PDF');
    }
  };

  return { exportToPdf };
};