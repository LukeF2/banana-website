import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Plus } from 'lucide-react';
import type { TimelineMilestone } from '@/lib/supabase';
import { uploadImage } from '@/lib/supabase';
import { ImageIcon } from 'lucide-react';

interface AddMilestoneDialogProps {
  onAddMilestone: (milestone: Omit<TimelineMilestone, 'id'>) => void;
}

export default function AddMilestoneDialog({ onAddMilestone }: AddMilestoneDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songUrl, setSongUrl] = useState('');
  const [songDescription, setSongDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUploading(true);
      let imageUrl = '/timeline-images/default.jpg';
      
      if (imageFile) {
        const milestoneId = crypto.randomUUID();
        imageUrl = await uploadImage(imageFile, milestoneId);
      }

      const milestone = {
        date: format(date, 'yyyy-MM-dd'),
        formattedDate: format(date, 'MMMM d, yyyy'),
        title,
        description,
        imageSrc: imageUrl,
        song: {
          title: songTitle,
          artist: songArtist,
          url: songUrl,
          description: songDescription
        }
      };

      onAddMilestone(milestone);
      setOpen(false);
      
      // Reset form
      setDate(new Date());
      setTitle('');
      setDescription('');
      setSongTitle('');
      setSongArtist('');
      setSongUrl('');
      setSongDescription('');
      setImageFile(null);
    } catch (error) {
      console.error('Error handling image upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-purple-400/10 to-pink-400/10 hover:from-blue-500/20 hover:via-purple-400/20 hover:to-pink-400/20 border-none shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add New Milestone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Add New Milestone</DialogTitle>
          <DialogDescription>
            Create a new memory to add to your relationship timeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">Date</label>
            <DatePicker
              date={date}
              onSelect={setDate}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="First date, anniversary, etc."
              className="border-gray-300 focus:border-blue-400 focus:ring-blue-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about this memory..."
              className="border-gray-300 focus:border-blue-400 focus:ring-blue-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={handleImageClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {imageFile ? (
                <p className="text-sm text-gray-600">{imageFile.name}</p>
              ) : (
                <div>
                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload an image</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Song</label>
            <div className="space-y-2">
              <Input
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                placeholder="Song title"
                className="border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                required
              />
              <Input
                value={songArtist}
                onChange={(e) => setSongArtist(e.target.value)}
                placeholder="Artist"
                className="border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                required
              />
              <Input
                value={songUrl}
                onChange={(e) => setSongUrl(e.target.value)}
                placeholder="YouTube URL"
                className="border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                required
              />
              <Input
                value={songDescription}
                onChange={(e) => setSongDescription(e.target.value)}
                placeholder="Why is this song special?"
                className="border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600"
              disabled={isUploading}
            >
              {isUploading ? 'Adding...' : 'Add Milestone'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
