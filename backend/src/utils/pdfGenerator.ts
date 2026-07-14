import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateAttestationPDF = (user: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../../tmp/attestation-${user._id}.pdf`);
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(18).text('ATTESTATION DE STAGE', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Nom : ${user.firstName} ${user.lastName}`);
    doc.text(`E-mail : ${user.email}`);
    doc.text(`Date de validation : ${new Date().toLocaleDateString()}`);

    doc.moveDown();
    doc.text("Certifie que ce stagiaire a bien accompli son stage au sein de l’entreprise conformément aux attentes.");

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};
