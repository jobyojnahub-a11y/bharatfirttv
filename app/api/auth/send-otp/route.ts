import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, sendOTPEmail } from '@/lib/emailService'
import { mockAPI } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    
    // Store OTP session in database
    mockAPI.createOTPSession(email, otp)
    
    // Send OTP email
    console.log(`Sending OTP to ${email}: ${otp}`) // Log for debugging
    const emailSent = await sendOTPEmail(email, otp)
    
    if (!emailSent) {
      // Still log OTP for backup
      console.log(`BACKUP - OTP for ${email}: ${otp}`)
      return NextResponse.json(
        { success: false, error: 'Failed to send OTP email. Check server logs for OTP.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your email'
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}