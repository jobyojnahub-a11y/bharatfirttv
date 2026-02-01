// OpenAI API integration for image generation

export interface ImageGenerationRequest {
  prompt: string
  size?: '256x256' | '512x512' | '1024x1024'
  n?: number
}

export interface ImageGenerationResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

export async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  // API key will be set via environment variable on VPS
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY

  if (!apiKey) {
    console.warn('OpenAI API key not found. Image generation disabled.')
    return {
      success: false,
      error: 'OpenAI API key not configured'
    }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: request.prompt,
        n: request.n || 1,
        size: request.size || '512x512',
        response_format: 'url'
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.data && data.data.length > 0) {
      return {
        success: true,
        imageUrl: data.data[0].url
      }
    } else {
      return {
        success: false,
        error: 'No image generated'
      }
    }
  } catch (error) {
    console.error('Error generating image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Helper function to generate news-related images
export async function generateNewsImage(title: string, category: string): Promise<string> {
  const prompt = `Create a professional news image for: "${title}". Category: ${category}. Style: Modern, clean, news-appropriate, Indian context, high quality, realistic`
  
  const result = await generateImage({
    prompt,
    size: '1024x1024',
    n: 1
  })

  if (result.success && result.imageUrl) {
    return result.imageUrl
  }

  // Fallback to Unsplash if OpenAI fails
  const fallbackImages = {
    'World': 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop',
    'Politics': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
    'Sports': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop',
    'Entertainment': 'https://images.unsplash.com/photo-1489599904472-af35ff2c7c3d?w=800&h=400&fit=crop',
    'Technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
    'Business': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
  }

  return fallbackImages[category as keyof typeof fallbackImages] || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop'
}