import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import ExcelJS from 'exceljs';

export async function POST(req: Request) {
  try {
    const { recipient, tableData } = await req.json();
    if (!recipient || !tableData || !Array.isArray(tableData)) {
      return NextResponse.json({ success: false, error: 'Missing recipient or table data.' });
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Category Table');
    worksheet.columns = [
      { header: 'Item', key: 'item', width: 30 },
      { header: 'Qty', key: 'pcsKg', width: 10 },
      { header: 'Unit', key: 'unit', width: 10 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
    ];
    tableData.forEach(row => worksheet.addRow(row));

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: recipient,
      subject: 'Category Table Excel',
      text: 'Attached is the category table in Excel format.',
      attachments: [
        {
          filename: 'category-table.xlsx',
          content: Buffer.from(buffer),
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
