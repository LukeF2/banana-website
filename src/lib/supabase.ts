import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for our database tables
export interface TimelineMilestone {
  id: string;
  date: string;
  formattedDate: string;
  title: string;
  description: string;
  imageSrc: string;
  song: {
    title: string;
    artist: string;
    url: string;
    description: string;
  };
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  description: string;
}

export interface Letter {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
}

// Function to upload image to Supabase Storage
export async function uploadImage(file: File, milestoneId: string): Promise<string> {
  // If the file is already a URL (from local storage), return it
  if (typeof file === 'string' && file.startsWith('/timeline-images/')) {
    return file;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${milestoneId}.${fileExt}`;
  const filePath = `timeline-images/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('timeline-images')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('timeline-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

// Function to check if an image URL is from Supabase Storage
export function isSupabaseStorageUrl(url: string): boolean {
  return url.includes(supabaseUrl);
}

// Function to get the correct image URL
export function getImageUrl(url: string): string {
  if (isSupabaseStorageUrl(url)) {
    return url;
  }
  // If it's a local path, return it as is
  return url;
} 