import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, userId, serviceRequestId } = body

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount deve ser maior que zero' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se Stripe está configurado
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe não está configurado' },
        { status: 503 }
      )
    }

    // Inicializar Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-09-30.clover' as any,
      typescript: true,
    })

    // Criar Payment Intent no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: currency?.toLowerCase() || 'eur',
      metadata: {
        userId,
        serviceRequestId: serviceRequestId || '',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Falha ao criar payment intent: ' + error.message },
      { status: 500 }
    )
  }
}
