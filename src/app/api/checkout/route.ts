import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@clerk/nextjs/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
})

export async function POST(req: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { priceId, echoId } = body

        if (!priceId) {
            return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: priceId.includes('one_time') || priceId.includes('oto') ? 'payment' : 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}${echoId ? `&echo_id=${echoId}` : ''}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/unlock/${echoId}`,
            metadata: {
                userId,
                echoId: echoId || 'none'
            },
        })

        return NextResponse.json({ sessionId: session.id })
    } catch (error: any) {
        console.error("Stripe Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
