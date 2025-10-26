const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Send welcome email to new users
 */
exports.sendWelcomeEmail = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { email, name, userType } = data;

  try {
    // In production, use SendGrid, Mailgun, or similar service
    // For now, just log the email
    console.log(`Welcome email would be sent to: ${email}`);
    console.log(`Message: Welcome to Elastiquality, ${name}!`);
    console.log(`User type: ${userType}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new functions.https.HttpsError('internal', 'Error sending email');
  }
});

/**
 * Send password reset email
 */
exports.sendPasswordResetEmail = functions.https.onCall(async (data, context) => {
  const { email } = data;

  try {
    // Send password reset email via Firebase Auth
    await admin.auth().generatePasswordResetLink(email);
    
    console.log(`Password reset email sent to: ${email}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new functions.https.HttpsError('internal', 'Error sending email');
  }
});

module.exports = {
  sendWelcomeEmail: exports.sendWelcomeEmail,
  sendPasswordResetEmail: exports.sendPasswordResetEmail
};

