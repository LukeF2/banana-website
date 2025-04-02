import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Song } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const song: Song = await request.json();

  const { data, error } = await supabase
    .from('songs')
    .insert([song])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}

export async function PUT(request: Request) {
  const song: Song = await request.json();

  const { data, error } = await supabase
    .from('songs')
    .update(song)
    .eq('id', song.id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 