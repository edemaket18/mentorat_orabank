import PDFDocument from 'pdfkit';
import fs from 'fs';

/**
 * Génère un PDF d'attestation de stage.
 * @param outputPath Chemin de sortie du fichier PDF
 * @param data Données à afficher dans l'attestation
 */
export function generateAttestationPDF(
  outputPath: string,
  data: {
    fullName: string;
    stageTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    issuedAt?: string;
  }
) {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(22).text('Attestation de Stage', { align: 'center' });
  doc.moveDown();

  doc.fontSize(14).text(
    `Nous certifions que ${data.fullName} a effectué un stage intitulé "${data.stageTitle}" au sein de ${data.company}.`
  );
  doc.moveDown();

  doc.text(
    `Période du stage : du ${data.startDate} au ${data.endDate}.`
  );
  doc.moveDown();

  doc.text(
    `Fait à ${data.company}, le ${data.issuedAt || new Date().toLocaleDateString()}`
  );

  doc.moveDown(2);
  doc.text('Signature :', { align: 'right' });

  doc.end();
}

