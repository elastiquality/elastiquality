const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Update user profile when user document is created/updated
 */
async function updateUserProfile(user, userId) {
  try {
    console.log(`Updating profile for user: ${userId}`);
    
    // Update user's display name in auth if it has changed
    if (user.name) {
      await admin.auth().updateUser(userId, {
        displayName: user.name
      });
    }
    
    // Set user's custom claims
    await admin.auth().setCustomUserClaims(userId, {
      userType: user.userType,
      verified: user.profile?.verified || false
    });
    
    console.log(`Profile updated for user: ${userId}`);
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
}

/**
 * Update professional profile
 */
async function updateProfessionalProfile(professional, userId) {
  try {
    console.log(`Updating professional profile: ${userId}`);
    
    // Any additional processing for professional profile
    // For example, calculate average rating, etc.
    
  } catch (error) {
    console.error('Error updating professional profile:', error);
  }
}

module.exports = {
  updateUserProfile,
  updateProfessionalProfile
};

