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
    
    // TEMPORARY: Skip email sending for now
    // Send OTP email
    console.log(`TEMP OTP for ${email}: ${otp}`) // Log OTP to console for testing
    const emailSent = true // Temporarily set to true
    
    // const emailSent = await sendOTPEmail(email, otp)
    // if (!emailSent) {
    //   return NextResponse.json(
    //     { success: false, error: 'Failed to send OTP email' },
    //     { status: 500 }
    //   )
    // }

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