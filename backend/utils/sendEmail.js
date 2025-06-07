import nodemailer from 'nodemailer';

/**
 * Sends an email using the configured SMTP transport.
 *
 * @param {Object} options - The email options.
 * @param {string} options.email - The recipient's email address.
 * @param {string} options.subject - The subject of the email.
 * @param {string} options.message - The body of the email.
 */
export const sendEmail = async (options) => {
    try {
        // Create a transporter object using SMTP configuration
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_MAIL, // Sender's email address
                pass: process.env.SMTP_PASSWORD, // Sender's email password
            },
        });

        // Define email options
        const mailOptions = {
            from: process.env.SMTP_MAIL, // Sender's email address
            to: options.email,          // Recipient's email address
            subject: options.subject,   // Email subject
            text: options.message,      // Email body (plain text)
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${options.email}`);
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Failed to send email. Please try again later.');
    }
};
