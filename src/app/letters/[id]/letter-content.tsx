"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Letter } from "@/lib/supabase";

export default function LetterContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLetter();
  }, [params.id]);

  const fetchLetter = async () => {
    try {
      const response = await fetch(`/api/letters/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch letter');
      const data = await response.json();
      setLetter(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching letter:', error);
      toast({
        title: "Error",
        description: "Failed to load letter. Please try again."
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-transition">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 mt-8">
          <div className="text-center py-12">
            <p>Loading letter...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="page-transition">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 mt-8">
          <div className="text-center py-12">
            <p>Letter not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <Navigation />

      <motion.main
        className="mt-8 pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push("/letters")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            back to letters
          </Button>

          <Card className="overflow-hidden shadow-md">
            <div className="h-24 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center p-6">
              <h2 className="text-2xl md:text-3xl font-light tracking-wide text-white">
                {letter.title}
              </h2>
            </div>

            <CardContent className="p-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap p-4 min-h-[300px] font-handwriting text-foreground/90">
                  {letter.content}
                </div>
                <div className="text-sm text-muted-foreground text-right mt-4">
                  {new Date(letter.date).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.main>
    </div>
  );
}
