import nodemailer from 'nodemailer';
import { User, GroupOrder } from '@/types';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  orderCreated: (order: GroupOrder, manager: User) => ({
    subject: `Order Created: ${order.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Order Created Successfully!</h2>
        <p>Hi ${manager.name},</p>
        <p>Your group order has been created and is now live!</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Title:</strong> ${order.title}</p>
          <p><strong>Price:</strong> $${order.group_price}</p>
          <p><strong>Min Orders:</strong> ${order.min_orders}</p>
          <p><strong>Deadline:</strong> ${new Date(order.deadline).toLocaleDateString()}</p>
        </div>
        
        <p>Share this link with your friends to start collecting orders:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.slug}" 
           style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Order
        </a>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The GOMFLOW Team
        </p>
      </div>
    `,
  }),

  orderJoined: (order: GroupOrder, participant: User, manager: User) => ({
    subject: `New Participant: ${order.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">New Order Participant!</h2>
        <p>Hi ${manager.name},</p>
        <p>Someone has joined your group order!</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Participant Details</h3>
          <p><strong>Name:</strong> ${participant.name}</p>
          <p><strong>Email:</strong> ${participant.email}</p>
          <p><strong>Order:</strong> ${order.title}</p>
        </div>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.slug}" 
           style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Order
        </a>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The GOMFLOW Team
        </p>
      </div>
    `,
  }),

  paymentVerified: (order: GroupOrder, participant: User) => ({
    subject: `Payment Verified: ${order.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Payment Verified!</h2>
        <p>Hi ${participant.name},</p>
        <p>Great news! Your payment has been verified for the group order.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order:</strong> ${order.title}</p>
          <p><strong>Amount:</strong> $${order.group_price}</p>
          <p><strong>Status:</strong> Payment Verified ✅</p>
        </div>
        
        <p>You'll receive updates as the order progresses!</p>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.slug}" 
           style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Order
        </a>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The GOMFLOW Team
        </p>
      </div>
    `,
  }),

  orderDeadline: (order: GroupOrder, participants: User[]) => ({
    subject: `Order Deadline Approaching: ${order.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Order Deadline Approaching!</h2>
        <p>Hi there,</p>
        <p>The deadline for this group order is approaching!</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order:</strong> ${order.title}</p>
          <p><strong>Deadline:</strong> ${new Date(order.deadline).toLocaleDateString()}</p>
          <p><strong>Current Orders:</strong> ${order.current_orders}/${order.min_orders}</p>
        </div>
        
        <p>Make sure to complete your payment before the deadline!</p>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.slug}" 
           style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Complete Payment
        </a>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The GOMFLOW Team
        </p>
      </div>
    `,
  }),

  orderCompleted: (order: GroupOrder, participants: User[]) => ({
    subject: `Order Completed: ${order.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Order Completed!</h2>
        <p>Hi there,</p>
        <p>Great news! Your group order has been completed successfully!</p>
        
        <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order:</strong> ${order.title}</p>
          <p><strong>Final Orders:</strong> ${order.current_orders}</p>
          <p><strong>Status:</strong> Completed ✅</p>
        </div>
        
        <p>The order manager will contact you with pickup/delivery details.</p>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.slug}" 
           style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Order
        </a>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The GOMFLOW Team
        </p>
      </div>
    `,
  }),
};

export const emailService = {
  async sendEmail(to: string, subject: string, html: string) {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  },

  async notifyOrderCreated(order: GroupOrder, manager: User) {
    const template = emailTemplates.orderCreated(order, manager);
    return this.sendEmail(manager.email, template.subject, template.html);
  },

  async notifyOrderJoined(order: GroupOrder, participant: User, manager: User) {
    const template = emailTemplates.orderJoined(order, participant, manager);
    return this.sendEmail(manager.email, template.subject, template.html);
  },

  async notifyPaymentVerified(order: GroupOrder, participant: User) {
    const template = emailTemplates.paymentVerified(order, participant);
    return this.sendEmail(participant.email, template.subject, template.html);
  },

  async notifyOrderDeadline(order: GroupOrder, participants: User[]) {
    const template = emailTemplates.orderDeadline(order, participants);
    const emails = participants.map(p => p.email);
    return this.sendEmail(emails.join(','), template.subject, template.html);
  },

  async notifyOrderCompleted(order: GroupOrder, participants: User[]) {
    const template = emailTemplates.orderCompleted(order, participants);
    const emails = participants.map(p => p.email);
    return this.sendEmail(emails.join(','), template.subject, template.html);
  },
};
