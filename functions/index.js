const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Simple HTTP function for testing
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("✅ Hello from Firebase Cloud Functions! Elastiquality is ready!");
});

// Callable function to get server time
exports.getServerTime = functions.https.onCall(async (data, context) => {
  return {
    timestamp: admin.firestore.Timestamp.now().toMillis(),
    date: new Date().toISOString(),
    message: "Elastiquality Cloud Functions are active!"
  };
});

// HTTP function for Stripe webhook
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  console.log('🔔 Stripe webhook received');
  
  // Handle webhook events
  const event = req.body;
  
  console.log(`Event type: ${event?.type || 'unknown'}`);
  
  // Just return success for now
  res.json({ received: true });
});
