import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Appointment } from '../appointments/entities/appointment.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: Number(this.configService.get<number>('SMTP_PORT', 587)),
      secure: this.configService.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user,
        pass,
      },
    });
  }

  /**
   * Send beautiful appointment confirmation email
   */
  async sendAppointmentConfirmation(appointment: Appointment): Promise<boolean> {
    if (!appointment.email) {
      this.logger.warn(`No email address found for appointment ${appointment.id}`);
      return false;
    }

    const from = this.configService.get<string>(
      'SMTP_FROM',
      'Ayush Multi Speciality Hospital <hepziba.sagayadoss99@gmail.com>',
    );

    const formattedDate = appointment.preferredDate || 'To be scheduled';
    const formattedTime = appointment.preferredTime || 'Standard Slot';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      color: #1e293b;
    }
    .email-wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 32px 12px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
      color: #ffffff;
      padding: 36px 28px;
      text-align: center;
    }
    .header-badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 14px;
      color: #ccfbf1;
    }
    .content {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 16px;
      margin-top: 0;
      margin-bottom: 16px;
      color: #334155;
    }
    .alert-box {
      background-color: #f0fdf4;
      border-left: 4px solid #16a34a;
      padding: 14px 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      font-size: 14px;
      color: #166534;
      line-height: 1.5;
    }
    .appointment-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .card-title {
      font-size: 13px;
      font-weight: 700;
      color: #0d9488;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0;
      margin-bottom: 16px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 8px;
    }
    .detail-grid {
      display: table;
      width: 100%;
    }
    .detail-row {
      display: table-row;
    }
    .detail-label {
      display: table-cell;
      padding: 8px 0;
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
      width: 40%;
    }
    .detail-value {
      display: table-cell;
      padding: 8px 0;
      color: #0f172a;
      font-size: 14px;
      font-weight: 600;
      text-align: right;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      background-color: #fef3c7;
      color: #92400e;
    }
    .info-notes {
      font-size: 13px;
      color: #64748b;
      line-height: 1.6;
      border-top: 1px solid #f1f5f9;
      padding-top: 20px;
    }
    .info-notes ul {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }
    .info-notes li {
      margin-bottom: 4px;
    }
    .footer {
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .footer a {
      color: #0d9488;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      
      <!-- Header -->
      <div class="header">
        <span class="header-badge">Booking Received</span>
        <h1>Ayush Multi Speciality Hospital</h1>
        <p>Comprehensive Healthcare & Wellness</p>
      </div>

      <!-- Main Content -->
      <div class="content">
        <p class="greeting">Dear <strong>${appointment.patientName}</strong>,</p>
        
        <div class="alert-box">
          Thank you for choosing Ayush Hospital. We have successfully registered your appointment request.
        </div>

        <div class="appointment-card">
          <div class="card-title">Appointment Details</div>
          <div class="detail-grid">
            <div class="detail-row">
              <span class="detail-label">Appointment ID</span>
              <span class="detail-value" style="font-family: monospace; color: #475569;">#${appointment.id.substring(0, 8)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Doctor / Specialist</span>
              <span class="detail-value">${appointment.doctor}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Department</span>
              <span class="detail-value">${appointment.service}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Scheduled Date</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Preferred Time</span>
              <span class="detail-value">${formattedTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone Number</span>
              <span class="detail-value">${appointment.phone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status</span>
              <span class="detail-value">
                <span class="status-badge">${appointment.status}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="info-notes">
          <strong>Important Instructions:</strong>
          <ul>
            <li>Please arrive 15 minutes before your scheduled slot.</li>
            <li>Bring any previous medical reports, prescriptions, and a valid ID proof.</li>
            <li>If you need to reschedule or cancel, please contact our helpline.</li>
          </ul>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 6px 0;"><strong>Ayush Multi Speciality Hospital</strong></p>
        <p style="margin: 0 0 10px 0;">Providing compassionate healthcare with modern facilities.</p>
        <p style="margin: 0;">This is an automated email notification. Please do not reply directly to this email.</p>
      </div>

    </div>
  </div>
</body>
</html>
`;

    try {
      const info = await this.transporter.sendMail({
        from,
        to: appointment.email,
        subject: `Appointment Confirmation - Ayush Hospital (${formattedDate})`,
        html: htmlContent,
      });

      this.logger.log(
        `Confirmation email successfully sent to ${appointment.email}. Message ID: ${info.messageId}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send appointment confirmation email to ${appointment.email}: ${error instanceof Error ? error.message : error}`,
      );
      return false;
    }
  }
}
