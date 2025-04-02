"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Letter } from "@/lib/supabase";

const LETTER_CATEGORIES = [
  "Love Note",
  "Anniversary",
  "Special Occasion",
  "Just Because",
  "Memory",
  "Thank You",
  "Apology",
  "Future Dreams"
];

export default function LettersContent() {
  const { toast } = useToast();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);
  const [newLetter, setNewLetter] = useState({
    title: "",
    content: "",
    date: new Date().toISOString(),
    category: "Love Note"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch letters on component mount
  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const response = await fetch('/api/letters');
      if (!response.ok) throw new Error('Failed to fetch letters');
      const data = await response.json();
      setLetters(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching letters:', error);
      toast({
        title: "Error",
        description: "Failed to load letters. Please try again."
      });
      setIsLoading(false);
    }
  };

  const handleAddLetter = async () => {
    if (!newLetter.title || !newLetter.content || !newLetter.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      const response = await fetch('/api/letters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newLetter,
          id: crypto.randomUUID()
        }),
      });

      if (!response.ok) throw new Error('Failed to add letter');

      const addedLetter = await response.json();
      setLetters([addedLetter, ...letters]);

      // Reset form
      setNewLetter({
        title: "",
        content: "",
        date: new Date().toISOString(),
        category: "Love Note"
      });

      setIsAddingNew(false);

      toast({
        title: "Letter added",
        description: "Your new letter has been added successfully"
      });
    } catch (error) {
      console.error('Error adding letter:', error);
      toast({
        title: "Error",
        description: "Failed to add letter. Please try again."
      });
    }
  };

  const handleEditLetter = async () => {
    if (!editingLetter) return;

    if (!editingLetter.title || !editingLetter.content || !editingLetter.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      const response = await fetch('/api/letters', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingLetter),
      });

      if (!response.ok) throw new Error('Failed to update letter');

      const updatedLetter = await response.json();
      setLetters(letters.map(letter => 
        letter.id === updatedLetter.id ? updatedLetter : letter
      ));

      setEditingLetter(null);

      toast({
        title: "Letter updated",
        description: "Your letter has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating letter:', error);
      toast({
        title: "Error",
        description: "Failed to update letter. Please try again."
      });
    }
  };

  const handleDeleteLetter = async (letterId: string) => {
    try {
      const response = await fetch('/api/letters', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: letterId }),
      });

      if (!response.ok) throw new Error('Failed to delete letter');

      setLetters(letters.filter(letter => letter.id !== letterId));

      toast({
        title: "Letter deleted",
        description: "Your letter has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting letter:', error);
      toast({
        title: "Error",
        description: "Failed to delete letter. Please try again."
      });
    }
  };

  const filteredLetters = selectedCategory
    ? letters.filter(letter => letter.category === selectedCategory)
    : letters;

  return (
    <div className="page-transition">
      <Navigation />

      <motion.main
        className="mt-8 pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-light tracking-wide">letters</h2>
            <Button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Letter
            </Button>
          </div>

          {/* Category filter */}
          <div className="mb-6">
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {LETTER_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add/Edit letter form */}
          {(isAddingNew || editingLetter) && (
            <Card className="mb-8 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  {editingLetter ? "Edit Letter" : "Write a New Letter"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
                    <Input
                      id="title"
                      value={editingLetter ? editingLetter.title : newLetter.title}
                      onChange={(e) => {
                        if (editingLetter) {
                          setEditingLetter({ ...editingLetter, title: e.target.value });
                        } else {
                          setNewLetter({ ...newLetter, title: e.target.value });
                        }
                      }}
                      placeholder="Letter title"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">Category *</label>
                    <Select
                      value={editingLetter ? editingLetter.category : newLetter.category}
                      onValueChange={(value) => {
                        if (editingLetter) {
                          setEditingLetter({ ...editingLetter, category: value });
                        } else {
                          setNewLetter({ ...newLetter, category: value });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {LETTER_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-1">Content *</label>
                    <Textarea
                      id="content"
                      value={editingLetter ? editingLetter.content : newLetter.content}
                      onChange={(e) => {
                        if (editingLetter) {
                          setEditingLetter({ ...editingLetter, content: e.target.value });
                        } else {
                          setNewLetter({ ...newLetter, content: e.target.value });
                        }
                      }}
                      placeholder="Write your letter here..."
                      className="w-full min-h-[200px] font-handwriting"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingNew(false);
                        setEditingLetter(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={editingLetter ? handleEditLetter : handleAddLetter}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      {editingLetter ? "Update Letter" : "Save Letter"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Letters grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p>Loading letters...</p>
            </div>
          ) : filteredLetters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLetters.map((letter) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: filteredLetters.indexOf(letter) * 0.1
                  }}
                >
                  <Link href={`/letters/${letter.id}`} className="block w-full">
                    <Card className="letter-button h-48 overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-90" />
                      <div className="relative h-full flex flex-col justify-end p-6 text-white">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-light tracking-wide">{letter.title}</h3>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:text-white/80"
                              onClick={(e) => {
                                e.preventDefault();
                                setEditingLetter(letter);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:text-white/80"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteLetter(letter.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm opacity-90 font-light">
                          {letter.category} • {new Date(letter.date).toLocaleDateString()}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center min-h-[200px]">
                  <h3 className="text-xl font-light mb-2">No letters yet</h3>
                  <p className="text-muted-foreground mb-6 font-light">
                    Write your first letter to share your thoughts and feelings.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.main>
    </div>
  );
}
