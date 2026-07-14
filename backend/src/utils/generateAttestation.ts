import PDFDocument from 'pdfkit';
import { Response } from 'express';
import path from 'path';

export const generateAttestationPDF = (res: Response, user: any) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename=attestation_${user.lastName}.pdf`);

  doc.pipe(res);

  doc
    .fontSize(20)
    .text('Attestation de Stage', { align: 'center' })
    .moveDown(2);

  doc
    .fontSize(12)
    .text(`Nous soussignés, Orabank Togo, attestons que :`, { align: 'left' })
    .moveDown();

  doc
    .fontSize(14)
    .text(`${user.firstName} ${user.lastName}`, { align: 'center', underline: true })
    .moveDown();

  doc
    .fontSize(12)
    .text(`a effectué un stage au sein de notre institution du 01/02/2024 au 30/06/2024 en tant que stagiaire développeur.`)
    .moveDown();

  doc
    .text(`Ce stage s’est déroulé avec sérieux et implication.`, { align: 'left' })
    .moveDown(3);

  doc
    .text(`Fait à Lomé, le ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' })
    .text(`Signature RH`, { align: 'right' });

  doc.end();
};

 