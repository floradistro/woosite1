import { NextRequest, NextResponse } from 'next/server';

// Lazy import to avoid build-time issues
let supabase: any = null;

async function getSupabaseClient() {
  if (!supabase) {
    try {
      const { supabase: client } = await import('@/lib/supabase');
      supabase = client;
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      return null;
    }
  }
  return supabase;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileName = searchParams.get('file');
    const category = searchParams.get('category') || 'FLOWER';
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    const client = await getSupabaseClient();
    if (!client) {
      return NextResponse.json(
        { error: 'Storage service unavailable' },
        { status: 503 }
      );
    }

    // Get the file from Supabase Storage
    const { data, error } = await client.storage
      .from('coa')
      .download(`${category}/${fileName}`);

    if (error) {
      console.error('Error downloading file:', error);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'File data not available' },
        { status: 404 }
      );
    }

    // Convert blob to buffer
    const buffer = await data.arrayBuffer();

    // Return the PDF with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (err) {
    console.error('Unexpected error in PDF proxy:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 