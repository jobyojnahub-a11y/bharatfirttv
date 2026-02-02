import { NextRequest, NextResponse } from 'next/server'
import { mockAPI } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // TEMPORARY: Allow default OTP for testing
    let otpResult;
    if (otp === '123456') {
      // Default OTP for testing
      otpResult = { success: true }
    } else {
      // Verify actual OTP
      otpResult = mockAPI.verifyOTP(email, otp)
    }
    
    if (!otpResult.success) {
      return NextResponse.json(
        { success: false, error: otpResult.error || 'Invalid OTP. Try 123456 for testing.' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = mockAPI.findUserByEmail(email)
    
    if (existingUser) {
      // User exists - login
      const loginResult = mockAPI.loginWithOTP(email)
      return NextResponse.json({
        success: true,
        user: loginResult.user,
        isNewUser: false,
        message: 'Login successful'
      })
    } else {
      // New user - needs to complete registration
      return NextResponse.json({
        success: true,
        isNewUser: true,
        email: email,
        message: 'OTP verified. Please complete your registration.'
      })
    }

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}