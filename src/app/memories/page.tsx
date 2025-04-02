"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import { useToast } from "@/components/ui/use-toast";
import ReactPlayer from "react-player/lazy";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowLeft, ArrowRight, Plus, Upload } from "lucide-react";

export default function MemoriesPage() {
  const { toast } = useToast();
  const [memories, setMemories] = useState<{ type: "image" | "video"; src: string; title?: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadingType, setUploadingType] = useState<"image" | "video" | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileType = file.type.startsWith("image") ? "image" : "video";
    const fileName = file.name;

    // Create object URL for the file
    const fileUrl = URL.createObjectURL(file);

    setMemories([...memories, {
      type: fileType as "image" | "video",
      src: fileUrl,
      title: fileName
    }]);

    toast({
      title: "memory added",
      description: `your ${fileType} has been added to the gallery.`,
    });

    // Reset the upload state
    setUploadingType(null);
    // Set current index to the new memory
    setCurrentIndex(memories.length);
  };

  const prevMemory = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : memories.length - 1
    );
  };

  const nextMemory = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < memories.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="page-transition">
      <Navigation />

      <motion.main
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-light tracking-wide text-center mb-6">memories</h2>

        <div className="flex flex-col items-center">
          <Card className="w-full max-w-3xl shadow-md overflow-hidden">
            <CardContent className="p-0 relative">
              {memories.length > 0 ? (
                <div className="memory-viewer">
                  {memories[currentIndex].type === "image" ? (
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={memories[currentIndex].src}
                        alt={memories[currentIndex].title || "Memory"}
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  ) : (
                    <AspectRatio ratio={16 / 9}>
                      <ReactPlayer
                        url={memories[currentIndex].src}
                        width="100%"
                        height="100%"
                        controls
                        playing
                      />
                    </AspectRatio>
                  )}

                  {memories.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full shadow-md"
                        onClick={prevMemory}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full shadow-md"
                        onClick={nextMemory}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {memories[currentIndex]?.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-2 text-white text-center backdrop-blur-sm">
                      <span className="font-light">{memories[currentIndex].title}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px] bg-muted/20">
                  <h3 className="text-xl font-light mb-2">no memories yet</h3>
                  <p className="text-muted-foreground mb-6 font-light">
                    add your first memory by uploading an image or video.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4 mt-6">
            {uploadingType === "image" ? (
              <div className="flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Upload className="mr-2 h-4 w-4" /> upload image
                  </Button>
                </label>
                <Button
                  variant="ghost"
                  onClick={() => setUploadingType(null)}
                  className="ml-2"
                >
                  cancel
                </Button>
              </div>
            ) : uploadingType === "video" ? (
              <div className="flex items-center">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Upload className="mr-2 h-4 w-4" /> upload video
                  </Button>
                </label>
                <Button
                  variant="ghost"
                  onClick={() => setUploadingType(null)}
                  className="ml-2"
                >
                  cancel
                </Button>
              </div>
            ) : (
              <>
                <Button onClick={() => setUploadingType("image")} className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="mr-2 h-4 w-4" /> add image
                </Button>
                <Button onClick={() => setUploadingType("video")} className="bg-pink-400 hover:bg-pink-500">
                  <Plus className="mr-2 h-4 w-4" /> add video
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
}
