"use client";

import React from "react";
import { useParams } from "next/navigation";
import LetterContent from "./letter-content";

interface Params {
  id: string;
}

const letters = [
  {
    id: "1",
    title: "My Dearest",
    content: `My love,

    I just wanted to take a moment to remind you how much you mean to me. Every day with you is a new adventure, a new opportunity to fall deeper in love.

    You bring so much joy and laughter into my life. Your smile brightens my darkest days, and your love gives me the strength to face any challenge.

    I am so grateful for you, for us, for this beautiful love we share.

    Forever yours,
    Your love`
  },
  {
    id: "2",
    title: "Happy Anniversary",
    content: `My darling,

    Another year has passed, and my love for you has only grown stronger. I remember the day we first met as if it were yesterday - how nervous I was, how beautiful you looked, how time seemed to stop when our eyes met.

    Every moment since then has been a blessing. Thank you for another wonderful year of memories, laughter, and love.

    Here's to many more anniversaries to come.

    With all my heart,
    Forever yours`
  },
  {
    id: "3",
    title: "Just Because",
    content: `My sweetest love,

    No special occasion, no particular reason - I simply wanted to remind you how deeply and completely I love you.

    In the chaos of everyday life, I don't want you to ever forget how special you are to me. Your kindness, your strength, your compassion - every little thing about you makes my heart overflow with love.

    Thank you for being you.

    Yours always,
    Me`
  }
];

export default function LetterPage() {
  const params = useParams();
  const id = params.id as string;
  return <LetterContent params={{ id }} />;
}
