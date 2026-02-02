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

    // Forward request to PHP OTP service for verification
    const response = await fetch('https://otp.bharatfirsttv.com/verify-otp.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp })
    })

    const result = await response.json()
    
    // Log for debugging
    console.log(`OTP verification for ${email}:`, result)
    
    if (!result.success) {
      return NextResponse.json(result, { status: response.status })
    }

    // OTP verified successfully - now check our user database
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