import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email: email.toLowerCase().trim(),
          name: name?.trim() || null,
        },
      ])
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
        return NextResponse.json(
          { error: 'This email is already on the waitlist' },
          { status: 409 }
        );
      }

      // Check if table doesn't exist
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.error('Supabase error - Table not found:', error);
        return NextResponse.json(
          { error: 'Database table not found. Please run the migration SQL in Supabase.' },
          { status: 500 }
        );
      }

      // Check if RLS policy is blocking
      if (error.code === '42501' || error.message.includes('permission denied') || error.message.includes('policy')) {
        console.error('Supabase error - RLS policy issue:', error);
        return NextResponse.json(
          { error: 'Permission denied. Please check Row Level Security policies in Supabase.' },
          { status: 500 }
        );
      }

      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: `Failed to join waitlist: ${error.message || 'Please try again.'}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Successfully joined the waitlist!',
        data 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
