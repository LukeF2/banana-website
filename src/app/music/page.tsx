"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Music, Upload, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import type { Song } from "@/lib/supabase";

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

export default function MusicPage() {
  const { toast } = useToast();
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [newSong, setNewSong] = useState({
    id: "",
    title: "",
    artist: "",
    url: "",
    description: ""
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Default playlist
  const defaultPlaylist = [
    {
      id: "1",
      title: "Night Drive",
      artist: "Sam Wills",
      url: "https://www.youtube.com/watch?v=1qYz7rfgLWE",
      description: "our sunset drives"
    },
    {
      id: "2",
      title: "Villain⤻ (feat. lIlBOI)",
      artist: "UNE, IIIBOI",
      url: "https://www.youtube.com/watch?v=nkVh5wcjmjM&ab_channel=UNE",
      description: "our late night drives"
    },
    {
      id: "3",
      title: "Cruel Summer",
      artist: "Taylor Swift",
      url: "https://www.youtube.com/watch?v=ic8j13piAhQ",
      description: "our summer drives"
    },
    {
      id: "4",
      title: "Come Inside Of My Heart",
      artist: "IV OF SPADES",
      url: "https://www.youtube.com/watch?v=1qYz7rfgLWE",
      description: "our sunset drives"
    },
    {
      id: "5",
      title: "Fly Love",
      artist: "Jamie Foxx",
      url: "https://www.youtube.com/watch?v=1qYz7rfgLWE",
      description: "our sunset drives"
    },
    {
      id: "6",
      title: "ETA",
      artist: "NewJeans",
      url: "https://www.youtube.com/watch?v=1qYz7rfgLWE",
      description: "our sunset drives"
    },
    {
      id: "7",
      title: "Pose For Me",
      artist: "John Mackk, Natalie Nunn",
      url: "https://www.youtube.com/watch?v=1qYz7rfgLWE",
      description: "our sunset drives"
    },
    {
      id: "8",
      title: "Made to Fall in Love",
      artist: "Daniel Caesar",
      url: "https://www.youtube.com/watch?v=1qYz7rfgLWE",
      description: "our sunset drives"
    },
    {
      id: "9",
      title: "I Don't Wanna Be Okay Without You",
      artist: "Charlie Burg",
      url: "https://www.youtube.com/watch?v=1qYz7rfgLWE",
      description: "our sunset drives"
    },
    {
      id: "10",
      title: "Kung Fu Fighting",
      artist: "CeeLo Green, Jack Black",
      url: "https://www.youtube.com/watch?v=1qYz7rfgLWE",
      description: "our sunset drives"
    }
  ];

  // Fetch songs on component mount
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/music');
      if (!response.ok) throw new Error('Failed to fetch songs');
      const data = await response.json();
      // If no songs in database, use default playlist
      setPlaylist(data.length > 0 ? data : defaultPlaylist);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching songs:', error);
      // On error, use default playlist
      setPlaylist(defaultPlaylist);
      setIsLoading(false);
    }
  };

  const handleAddSong = async () => {
    // Validate form
    if (!newSong.title || !newSong.artist || !newSong.url) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields"
      });
      return;
    }

    // Basic URL validation
    if (!newSong.url.includes('youtube.com/watch') && !newSong.url.includes('youtu.be/')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL"
      });
      return;
    }

    try {
      // Generate a unique ID for the new song
      const songToAdd = {
        ...newSong,
        id: crypto.randomUUID()
      };

      const response = await fetch('/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(songToAdd),
      });

      if (!response.ok) throw new Error('Failed to add song');

      const addedSong = await response.json();
      setPlaylist([...playlist, addedSong]);

      // Reset form
      setNewSong({
        id: "",
        title: "",
        artist: "",
        url: "",
        description: ""
      });

      setIsAddingNew(false);

      toast({
        title: "Song added",
        description: `"${addedSong.title}" has been added to your playlist`
      });
    } catch (error) {
      console.error('Error adding song:', error);
      toast({
        title: "Error",
        description: "Failed to add song. Please try again."
      });
    }
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      const response = await fetch('/api/music', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: songId }),
      });

      if (!response.ok) throw new Error('Failed to delete song');

      setPlaylist(playlist.filter(song => song.id !== songId));
      if (currentSong?.id === songId) setCurrentSong(null);

      toast({
        title: "Song deleted",
        description: "The song has been removed from your playlist"
      });
    } catch (error) {
      console.error('Error deleting song:', error);
      toast({
        title: "Error",
        description: "Failed to delete song. Please try again."
      });
    }
  };

  return (
    <div className="page-transition">
      <Navigation />

      <motion.main
        className="mt-8 pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-light tracking-wide text-center mb-8">our journey in sound</h2>

        <div className="max-w-6xl mx-auto px-4">
          {/* Currently playing section */}
          {currentSong && (
            <Card className="mb-8 shadow-md overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-light">Now Playing: {currentSong.title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentSong(null)}
                  >
                    Close
                  </Button>
                </div>
                <div className="aspect-video rounded-md overflow-hidden">
                  <ReactPlayer
                    url={currentSong.url}
                    width="100%"
                    height="100%"
                    controls
                    playing
                    config={{
                      youtube: {
                        playerVars: {
                          autoplay: 1,
                          modestbranding: 1,
                          rel: 0
                        }
                      }
                    }}
                  />
                </div>
                {currentSong.description && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    <p className="italic text-gray-700">{currentSong.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Add song button */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-light">Playlist</h3>
            <Button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Song
            </Button>
          </div>

          {/* Add new song form */}
          {isAddingNew && (
            <Card className="mb-6 shadow-sm">
              <CardContent className="p-6">
                <h4 className="text-lg font-medium mb-4">Add New Song</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
                    <Input
                      id="title"
                      value={newSong.title}
                      onChange={(e) => setNewSong({...newSong, title: e.target.value})}
                      placeholder="Song title"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="artist" className="block text-sm font-medium mb-1">Artist *</label>
                    <Input
                      id="artist"
                      value={newSong.artist}
                      onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
                      placeholder="Artist name"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="url" className="block text-sm font-medium mb-1">YouTube URL *</label>
                  <Input
                    id="url"
                    value={newSong.url}
                    onChange={(e) => setNewSong({...newSong, url: e.target.value})}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    id="description"
                    value={newSong.description}
                    onChange={(e) => setNewSong({...newSong, description: e.target.value})}
                    placeholder="Why is this song special?"
                    className="w-full"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingNew(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddSong}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Add to Playlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Playlist grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p>Loading songs...</p>
            </div>
          ) : playlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlist.map((song) => (
                <Card
                  key={song.id}
                  className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setCurrentSong(song)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-medium mb-1">{song.title}</h3>
                          <p className="text-gray-600">{song.artist}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSong(song.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                      {song.description && (
                        <p className="text-sm text-gray-500 mt-auto line-clamp-2">{song.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center min-h-[200px]">
                  <Music className="h-12 w-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-light mb-2">No songs yet</h3>
                  <p className="text-muted-foreground mb-6 font-light">
                    Add your favorite songs to share with her.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Spotify Playlist Embed */}
          <div className="mt-12">
            <h3 className="text-xl font-light mb-6">our story's still unfolding, click here to add a song to the next chapter!</h3>
            <iframe 
              style={{ borderRadius: "12px" }} 
              src="https://open.spotify.com/embed/playlist/3LVWNfFCNrOO2Knp09A4FZ?utm_source=generator" 
              width="100%" 
              height="352" 
              frameBorder="0" 
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            />
          </div>
        </div>
      </motion.main>
    </div>
  );
}
