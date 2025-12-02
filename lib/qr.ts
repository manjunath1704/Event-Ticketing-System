import QRCode from 'qrcode';

export async function generateQRCode(ticketId: string): Promise<string> {
  try {
    const qrCodeData = `ticket:${ticketId}`;
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}
