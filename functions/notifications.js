const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Send email notifications to users
 */
exports.sendEmailNotifications = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, type, title, body } = data;

  try {
    // Create notification document
    await admin.firestore().collection('notifications').add({
      userId,
      type,
      title,
      body,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Notification created for user: ${userId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new functions.https.HttpsError('internal', 'Error creating notification');
  }
});

module.exports = {
  sendEmailNotifications: exports.sendEmailNotifications
};

