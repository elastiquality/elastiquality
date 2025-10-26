import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

// Disable body parsing, Stripe needs the raw body
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        console.log(`✅ Payment succeeded: ${paymentIntent.id}`)
        console.log(`Metadata:`, paymentIntent.metadata)

        // Update service request or transaction in Firestore
        // This will be handled by our Cloud Function
        
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        console.log(`❌ Payment failed: ${paymentIntent.id}`)
        
        // Update transaction status in Firestore
        // This will be handled by our Cloud Function
        
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log(`🔔 Checkout session completed: ${session.id}`)
        console.log(`Metadata:`, session.metadata)
        
        // Handle subscription or one-time payment
        // This will be handled by our Cloud Function
        
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log(`📅 Subscription event: ${event.type}`)
        console.log(`Subscription ID: ${subscription.id}`)

        // Update professional subscription in Firestore
        // This will be handled by our Cloud Function
        
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log(`🗑️ Subscription cancelled: ${subscription.id}`)

        // Update professional subscription status in Firestore
        // This will be handled by our Cloud Function
        
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

