import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { TimelineMilestone } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('timeline_milestones')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const milestone: Omit<TimelineMilestone, 'id'> = await request.json();

  // Generate a unique ID for the new milestone
  const newMilestone = {
    ...milestone,
    id: crypto.randomUUID()
  };

  const { data, error } = await supabase
    .from('timeline_milestones')
    .insert([newMilestone])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}

export async function PUT(request: Request) {
  const milestone: TimelineMilestone = await request.json();

  const { data, error } = await supabase
    .from('timeline_milestones')
    .update(milestone)
    .eq('id', milestone.id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  const { error } = await supabase
    .from('timeline_milestones')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 