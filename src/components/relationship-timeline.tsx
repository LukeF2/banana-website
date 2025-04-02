"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { Heart, ChevronDown, ChevronUp, Image as ImageIcon, Plus } from 'lucide-react';
import AddMilestoneDialog from './add-milestone-dialog';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { TimelineMilestone } from "@/lib/supabase";
import { uploadImage, getImageUrl } from '@/lib/supabase';

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

// Random rotation angle for polaroid effect
const getRandomRotation = () => {
  const angles = [-3, -2, -1, 0, 1, 2, 3];
  return angles[Math.floor(Math.random() * angles.length)];
};

const TimelineImageCard: React.FC<{
  milestone: TimelineMilestone;
  onUploadImage: (id: string, file: File) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  rotationAngle?: number;
  onClick: () => void;
}> = ({ milestone, onUploadImage, isExpanded, onToggleExpand, rotationAngle = 0, onClick }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExpanded) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await onUploadImage(milestone.id, file);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <motion.div
      className={cn(
        "relative bg-white p-3 shadow-lg rounded-lg cursor-pointer transition-all duration-300",
        isExpanded ? "z-50 scale-105" : "hover:scale-105",
        "transform-gpu"
      )}
      style={{
        transform: `rotate(${rotationAngle}deg)`,
      }}
      onClick={onClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <div className="relative p-3 pt-3 pb-12">
        {milestone.imageSrc ? (
          <div 
            className="w-full h-[calc(100%-48px)] overflow-hidden bg-gray-100 relative group"
            onClick={handleImageClick}
          >
            <img
              src={getImageUrl(milestone.imageSrc)}
              alt={milestone.title}
              className="w-full h-full object-cover"
            />
            {!isExpanded && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-sm">Click to change image</p>
              </div>
            )}
          </div>
        ) : (
          <div 
            className="w-full h-[calc(100%-48px)] flex items-center justify-center bg-gray-100 cursor-pointer"
            onClick={handleImageClick}
          >
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to add image</p>
            </div>
          </div>
        )}
        <div className="mt-2 px-1">
          <p className={cn(
            "text-sm font-medium text-center font-handwriting",
            milestone.id === '16' ? "text-purple-400" : // lavender for 2 year anniversary
            milestone.title.includes("banana chen") ? "text-yellow-500" : // yellow for banana chen
            "text-gray-800"
          )}>
            {milestone.title}
          </p>
          <p className="text-xs text-gray-500 text-center font-mono">{milestone.formattedDate}</p>
        </div>
      </div>

      {/* Expand/collapse button */}
      <button
        onClick={onToggleExpand}
        className="absolute top-2 right-2 z-10 rounded-full bg-white/80 p-1 shadow-sm hover:bg-white transition-colors"
      >
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-600" />
        )}
      </button>
    </motion.div>
  );
};

const MemoryView: React.FC<{
  milestone: TimelineMilestone;
  onClose: () => void;
}> = ({ milestone, onClose }) => {
  console.log('MemoryView milestone:', milestone);
  console.log('Song data:', milestone.song);
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className={cn(
                "text-2xl font-medium mb-2",
                milestone.id === '16' ? "text-purple-400" : // lavender for 2 year anniversary
                milestone.title.includes("banana chen") ? "text-yellow-500" : // yellow for banana chen
                "text-gray-800"
              )}>
                {milestone.title}
              </h2>
              <p className="text-gray-600">{milestone.formattedDate}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {milestone.imageSrc && (
            <div className="mb-6">
              <img
                src={getImageUrl(milestone.imageSrc)}
                alt={milestone.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}

          <p className="text-gray-700 mb-6">{milestone.description}</p>

          {milestone.song && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">what this memory sounds like to me</h3>
              <div className="aspect-video rounded-md overflow-hidden">
                <ReactPlayer
                  url={milestone.song.url}
                  width="100%"
                  height="100%"
                  controls
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        rel: 0
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-2">
                <p className="font-medium">{milestone.song.title}</p>
                <p className="text-gray-600">{milestone.song.artist}</p>
                <p className="text-sm text-gray-500 mt-1">{milestone.song.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function RelationshipTimeline() {
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const response = await fetch('/api/timeline');
      if (!response.ok) throw new Error('Failed to fetch milestones');
      const data = await response.json();
      // Parse song data from JSON string to object
      const parsedData = data.map((milestone: any) => ({
        ...milestone,
        song: typeof milestone.song === 'string' ? JSON.parse(milestone.song) : milestone.song
      }));
      setMilestones(parsedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast({
        title: "Error",
        description: "Failed to load timeline. Please try again later."
      });
      setIsLoading(false);
    }
  };

  const handleUpdateMilestone = async (milestone: TimelineMilestone) => {
    try {
      const response = await fetch('/api/timeline', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(milestone),
      });

      if (!response.ok) throw new Error('Failed to update milestone');

      const updatedMilestone = await response.json();
      setMilestones(milestones.map(m => m.id === updatedMilestone.id ? updatedMilestone : m));
      toast({
        title: "Success",
        description: "Timeline updated successfully"
      });
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast({
        title: "Error",
        description: "Failed to update timeline. Please try again."
      });
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    try {
      const imageUrl = await uploadImage(file, id);
      const milestone = milestones.find(m => m.id === id);
      if (milestone) {
        const updatedMilestone = {
          ...milestone,
          imageSrc: imageUrl
        };
        await handleUpdateMilestone(updatedMilestone);
      }
    } catch (error) {
      console.error('Error handling image upload:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again."
      });
    }
  };

  const handleAddMilestone = async (milestone: Omit<TimelineMilestone, 'id'>) => {
    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(milestone),
      });

      if (!response.ok) throw new Error('Failed to add milestone');

      const newMilestone = await response.json();
      setMilestones([...milestones, newMilestone]);
      toast({
        title: "Success",
        description: "New milestone added successfully"
      });
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast({
        title: "Error",
        description: "Failed to add milestone. Please try again."
      });
    }
  };

  const getYearGroups = (milestones: TimelineMilestone[]) => {
    const groups: { [key: string]: TimelineMilestone[] } = {};
    milestones.forEach(milestone => {
      const year = new Date(milestone.date).getFullYear().toString();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(milestone);
    });
    return groups;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading timeline...</p>
      </div>
    );
  }

  const yearGroups = getYearGroups(milestones);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-light">Our Story</h1>
        <AddMilestoneDialog onAddMilestone={handleAddMilestone} />
      </div>
      <div className="space-y-24">
        {Object.entries(yearGroups).map(([year, yearMilestones], groupIndex) => (
          <div key={year} className="relative">
            <h2 className="text-4xl font-light mb-12 sticky top-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg z-10">
              {year}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {yearMilestones.map((milestone, index) => (
                <TimelineImageCard
                  key={milestone.id}
                  milestone={milestone}
                  onUploadImage={handleImageUpload}
                  isExpanded={selectedMilestone?.id === milestone.id}
                  onToggleExpand={() => setSelectedMilestone(selectedMilestone?.id === milestone.id ? null : milestone)}
                  rotationAngle={Math.random() * 6 - 3}
                  onClick={() => setSelectedMilestone(milestone)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedMilestone && (
        <MemoryView
          milestone={selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
        />
      )}
    </div>
  );
}
