import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Letter } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const letter: Letter = await request.json();

  const { data, error } = await supabase
    .from('letters')
    .insert([letter])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}

export async function PUT(request: Request) {
  const letter: Letter = await request.json();

  const { data, error } = await supabase
    .from('letters')
    .update(letter)
    .eq('id', letter.id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  const { error } = await supabase
    .from('letters')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 