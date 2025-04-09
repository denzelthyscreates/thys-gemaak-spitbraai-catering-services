
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { endpoint, pageId } = await req.json()
    
    // Get Facebook access token from environment variables
    const FB_ACCESS_TOKEN = Deno.env.get('FACEBOOK_ACCESS_TOKEN')
    
    if (!FB_ACCESS_TOKEN) {
      throw new Error('Missing Facebook access token')
    }

    if (!pageId) {
      throw new Error('Missing page ID')
    }

    let apiUrl = ''
    let responseData = {}

    // Log for debugging
    console.log(`Processing request for endpoint: ${endpoint}, pageId: ${pageId}`)

    if (endpoint === 'photos') {
      // Get photos from the page
      apiUrl = `https://graph.facebook.com/v19.0/${pageId}/photos?fields=id,source,name,created_time&access_token=${FB_ACCESS_TOKEN}`
      
      console.log(`Fetching from URL: ${apiUrl.replace(FB_ACCESS_TOKEN, 'REDACTED')}`)
      
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      console.log('Facebook API Response:', JSON.stringify(data).substring(0, 200) + '...')
      
      if (data.error) {
        throw new Error(`Facebook API Error: ${data.error.message}`)
      }
      
      responseData = {
        photos: data.data ? data.data.map((photo: any) => ({
          id: photo.id,
          source: photo.source,
          name: photo.name || '',
          created_time: photo.created_time
        })) : []
      }
    } else if (endpoint === 'reviews') {
      // Get reviews from the page
      apiUrl = `https://graph.facebook.com/v19.0/${pageId}/ratings?fields=reviewer{name,picture},rating,review_text,created_time&access_token=${FB_ACCESS_TOKEN}`
      
      console.log(`Fetching from URL: ${apiUrl.replace(FB_ACCESS_TOKEN, 'REDACTED')}`)
      
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      console.log('Facebook API Response:', JSON.stringify(data).substring(0, 200) + '...')
      
      if (data.error) {
        throw new Error(`Facebook API Error: ${data.error.message}`)
      }
      
      responseData = {
        reviews: data.data ? data.data.map((review: any) => ({
          id: review.id,
          reviewer: {
            name: review.reviewer.name,
            picture: review.reviewer.picture?.data?.url
          },
          rating: review.rating,
          review_text: review.review_text || '',
          created_time: review.created_time
        })) : []
      }
    } else {
      throw new Error('Invalid endpoint')
    }

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Edge Function Error:', error.message)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        tips: [
          "Verify your Facebook Page ID is correct",
          "Ensure your Facebook Access Token has the necessary permissions (pages_read_engagement, pages_show_list)",
          "Check that your token is not expired",
          "Verify the page exists and is accessible to your app"
        ]
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
