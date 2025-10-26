const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Handle Stripe webhooks
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    // In production, verify the webhook signature
    // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    const event = JSON.parse(req.body);
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

async function handlePaymentSuccess(paymentIntent) {
  // Update service request with payment info
  const serviceRequestId = paymentIntent.metadata.serviceRequestId;
  
  if (serviceRequestId) {
    await admin.firestore()
      .collection('serviceRequests')
      .doc(serviceRequestId)
      .update({
        paymentId: paymentIntent.id,
        paid: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    
    console.log(`Payment succeeded for request: ${serviceRequestId}`);
  }
}

async function handleSubscriptionCreated(subscription) {
  const userId = subscription.metadata.userId;
  const plan = subscription.metadata.plan;
  
  if (userId && plan) {
    await admin.firestore()
      .collection('professionals')
      .doc(userId)
      .update({
        'subscription.plan': plan,
        'subscription.status': 'ACTIVE',
        'subscription.currentPeriodEnd': admin.firestore.Timestamp.fromDate(
          new Date(subscription.current_period_end * 1000)
        ),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    
    console.log(`Subscription created for user: ${userId}`);
  }
}

async function handleSubscriptionCancelled(subscription) {
  const userId = subscription.metadata.userId;
  
  if (userId) {
    await admin.firestore()
      .collection('professionals')
      .doc(userId)
      .update({
        'subscription.status': 'CANCELLED',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    
    console.log(`Subscription cancelled for user: ${userId}`);
  }
}

module.exports = {
  stripeWebhook: exports.stripeWebhook
};

