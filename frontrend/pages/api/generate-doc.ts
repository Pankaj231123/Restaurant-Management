// pages/api/generate-doc.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { writeFileSync } from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { name, email, subject, message } = req.body;

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ children: [new TextRun({ text: "Mail from Contact Form", bold: true, size: 32 })] }),
        new Paragraph(" "),
        new Paragraph(`Name: ${name}`),
        new Paragraph(`Email: ${email}`),
        new Paragraph(`Subject: ${subject}`),
        new Paragraph(" "),
        new Paragraph("Message:"),
        new Paragraph({ children: [new TextRun({ text: message, break: 1 })] })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(process.cwd(), "public", "mail.docx");
  writeFileSync(outputPath, buffer);

  return res.status(200).json({ message: "Mail saved successfully!" });
}
