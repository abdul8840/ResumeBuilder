import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportToPDF = async (elementId, filename = "resume.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Resume element not found");
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    width: element.scrollWidth,
    height: element.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/jpeg", 1.0);

  // A4 dimensions in mm
  const pdfWidth = 210;
  const pdfHeight = 297;

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = imgWidth / imgHeight;

  let finalWidth = pdfWidth;
  let finalHeight = pdfWidth / ratio;

  const pdf = new jsPDF({
    orientation: finalHeight > pdfHeight ? "portrait" : "portrait",
    unit: "mm",
    format: "a4",
  });

  // Handle multi-page resumes
  if (finalHeight > pdfHeight) {
    let yPosition = 0;
    let pageNumber = 0;

    while (yPosition < finalHeight) {
      if (pageNumber > 0) {
        pdf.addPage();
      }

      const sourceY = (yPosition / finalHeight) * imgHeight;
      const sourceHeight = (pdfHeight / finalHeight) * imgHeight;

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = imgWidth;
      pageCanvas.height = Math.min(sourceHeight, imgHeight - sourceY);

      const ctx = pageCanvas.getContext("2d");
      ctx.drawImage(
        canvas,
        0,
        sourceY,
        imgWidth,
        Math.min(sourceHeight, imgHeight - sourceY),
        0,
        0,
        imgWidth,
        Math.min(sourceHeight, imgHeight - sourceY)
      );

      const pageImgData = pageCanvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage(pageImgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

      yPosition += pdfHeight;
      pageNumber++;
    }
  } else {
    pdf.addImage(imgData, "JPEG", 0, 0, finalWidth, finalHeight);
  }

  pdf.save(filename);
  return true;
};

export const getResumeFilename = (resume) => {
  const name = resume?.personalInfo
    ? `${resume.personalInfo.firstName}_${resume.personalInfo.lastName}`
    : resume?.title || "Resume";
  const cleanName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const date = new Date().toISOString().split("T")[0];
  return `${cleanName}_resume_${date}.pdf`;
};