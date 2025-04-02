const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Initial timeline data
const timelineData = [
  {
    id: '1',
    date: '2022-05-14',
    formattedDate: 'May 14, 2022',
    title: 'when we first met',
    description: 'the day we first met',
    imageSrc: '/timeline-images/new1.jpg',
    song: {
      title: 'Traingazing (feat. Honey Mooncie)',
      artist: 'Sam Wills',
      url: 'https://www.youtube.com/watch?v=urFJik-gPdQ&ab_channel=SamWills',
      description: 'how our relationship easily could have gone, glad it didnt tho!!'
    }
  },
  {
    id: '2',
    date: '2022-10-16',
    formattedDate: 'October 16, 2022',
    title: 'knotts scary farm',
    description: 'knotts scary farm',
    imageSrc: '/timeline-images/new2.jpg',
    song: {
      title: 'Time Of Our Lives',
      artist: 'Pitbull, Ne-Yo',
      url: 'https://www.youtube.com/watch?v=bTXJQ5ql5Fw&ab_channel=PitbullVEVO',
      description: 'when everyone ditched us for the g-wagon and we had car karaoke back to my house'
    }
  },
  {
    id: '3',
    date: '2023-01-11',
    formattedDate: 'January 11, 2023',
    title: 'Joshua Tree Trip',
    description: 'joshua tree trip',
    imageSrc: '/timeline-images/new3.jpg',
    song: {
      title: 'light',
      artist: 'wave to earth',
      url: 'https://www.youtube.com/watch?v=6DLLVIOBRmQ&ab_channel=wavetoearth-Topic',
      description: 'it mightve been a frustrating trip but without it theres a good chance we wouldnt be together now! + that view from the hot tub was amazing'
    }
  },
  {
    id: '4',
    date: '2023-04-02',
    formattedDate: 'April 2, 2023',
    title: 'officially started dating!!',
    description: 'when we officially started dating!!',
    imageSrc: '/timeline-images/1.jpg',
    song: {
      title: 'Come Inside Of My Heart',
      artist: 'IV OF SPADES',
      url: 'https://www.youtube.com/watch?v=dluPeE6PA-I',
      description: 'come inside of my heart (:'
    }
  },
  {
    id: '5',
    date: '2023-05-02',
    formattedDate: 'May 2, 2023',
    title: 'first official date',
    description: 'our first official date at kobe gyukatsu!!',
    imageSrc: '/timeline-images/2.jpg',
    song: {
      title: 'Fly Love',
      artist: 'Jamie Foxx',
      url: 'https://www.youtube.com/watch?v=BuoqQx_ZZJ4',
      description: 'kobe gyukatsu + vantage point'
    }
  },
  {
    id: '6',
    date: '2023-07-21',
    formattedDate: 'July 21, 2023',
    title: 'lavender farm date',
    description: 'lavender farm date (:)',
    imageSrc: '/timeline-images/3.jpg',
    song: {
      title: 'Drive Safe',
      artist: 'Rich Brian',
      url: 'https://www.youtube.com/watch?v=7bFFaTGOVI8&ab_channel=RichBrian',
      description: 'food, music, and lavender!!'
    }
  },
  {
    id: '7',
    date: '2023-08-09',
    formattedDate: 'August 9, 2023',
    title: 'first trip together',
    description: 'first trip together!! (hawaii)',
    imageSrc: '/timeline-images/4.jpg',
    song: {
      title: 'Cruel Summer',
      artist: 'Taylor Swift',
      url: 'https://www.youtube.com/watch?v=ic8j13piAhQ',
      description: 'our summer drives'
    }
  },
  {
    id: '8',
    date: '2024-04-14',
    formattedDate: 'April 14, 2024',
    title: 'one year celebration',
    description: 'first trip to huntington to celebrate 1 year!!',
    imageSrc: '/timeline-images/5.jpg',
    song: {
      title: 'Henny in the Hamptons',
      artist: 'Bren Joy',
      url: 'https://www.youtube.com/watch?v=T2NLoljpzkA&ab_channel=BrenJoy',
      description: 'clean vibes even though it was cloudy'
    }
  },
  {
    id: '9',
    date: '2024-06-21',
    formattedDate: 'June 21, 2024',
    title: 'rafting trip',
    description: 'rafting trip at kern river!!',
    imageSrc: '/timeline-images/6.jpg',
    song: {
      title: '小鎮姑娘',
      artist: 'David Tao',
      url: 'https://www.youtube.com/watch?v=dD4JHeZNvF4&ab_channel=TimelessMusic',
      description: 'sitting around the campfire, listening to your dads music'
    }
  },
  {
    id: '10',
    date: '2024-07-07',
    formattedDate: 'July 7, 2024',
    title: 'celebrating hannas bday at zinque',
    description: 'lido marina village',
    imageSrc: '/timeline-images/7.jpg',
    song: {
      title: 'Fashion Killa',
      artist: 'A$AP Rocky',
      url: 'https://www.youtube.com/watch?v=F6VfsJ7LAlE&ab_channel=LIVELOVEASAPVEVO',
      description: 'bang bang boom boom pop pop'
    }
  },
  {
    id: '11',
    date: '2024-08-07',
    formattedDate: 'August 7, 2024',
    title: 'first trip to knotts',
    description: 'first trip to knotts',
    imageSrc: '/timeline-images/8.jpg',
    song: {
      title: 'ETA',
      artist: 'NewJeans',
      url: 'https://www.youtube.com/watch?v=QrBJUEwxKcc',
      description: 'summer song + dance party'
    }
  },
  {
    id: '12',
    date: '2024-08-09',
    formattedDate: 'August 9, 2024',
    title: 'summer trip to huntington',
    description: 'summer trip to huntington!!',
    imageSrc: '/timeline-images/9.jpg',
    song: {
      title: 'Put Your Records On',
      artist: 'Ritt Momney',
      url: 'https://www.youtube.com/watch?v=WyVfkr6nsrk&ab_channel=RittMomneyVEVO',
      description: 'beautiful garden, summer vibes, banana chen!!'
    }
  },
  {
    id: '13',
    date: '2024-10-13',
    formattedDate: 'October 13, 2024',
    title: 'first disney trip',
    description: 'first disney trip',
    imageSrc: '/timeline-images/10.jpg',
    song: {
      title: 'Pose For Me',
      artist: 'John Mackk, Natalie Nunn',
      url: 'https://www.youtube.com/watch?v=dluPeE6PA-I',
      description: 'tiktoks and beignets'
    }
  },
  {
    id: '14',
    date: '2024-10-19',
    formattedDate: 'October 19, 2024',
    title: 'apple picking',
    description: 'apple picking',
    imageSrc: '/timeline-images/11.jpg',
    song: {
      title: 'Made to Fall in Love',
      artist: 'Daniel Caesar',
      url: 'https://www.youtube.com/watch?v=dluPeE6PA-I',
      description: 'such a autumn-y song, wouldve put roommmates but this one is still better'
    }
  },
  {
    id: '15',
    date: '2024-12-16',
    formattedDate: 'December 16, 2024',
    title: 'first clippers game',
    description: 'first clippers game',
    imageSrc: '/timeline-images/12.jpg',
    song: {
      title: 'Fly Love',
      artist: 'Jamie Foxx',
      url: 'https://www.youtube.com/watch?v=BuoqQx_ZZJ4',
      description: 'we got to see harden drop like 40 in 3 quarter wowie'
    }
  },
  {
    id: '16',
    date: '2024-12-27',
    formattedDate: 'December 27, 2024',
    title: 'celebrated 21st with bubas!!',
    description: 'SD + cake',
    imageSrc: '/timeline-images/13.jpg',
    song: {
      title: 'Name',
      artist: 'Justin Bieber, Tori Kelly',
      url: 'https://www.youtube.com/watch?v=-7_x8Unut1k&ab_channel=JustinBieber',
      description: 'celebrated my 21st with you and i wouldnt want to do it any other way'
    }
  },
  {
    id: '17',
    date: '2025-01-26',
    formattedDate: 'January 26, 2025',
    title: 'spocha + build a bear date',
    description: 'so much fun bubas',
    imageSrc: '/timeline-images/14.jpg',
    song: {
      title: 'Villain⤻ (feat. lIlBOI)',
      artist: 'UNE, IIIBOI',
      url: 'https://www.youtube.com/watch?v=nkVh5wcjmjM&ab_channel=UNE',
      description: 'ik we werent listening to this at the time, but the whimsicalness of this song reminds me of our time at spocha'
    }
  },
  {
    id: '18',
    date: '2025-01-27',
    formattedDate: 'January 27, 2025',
    title: 'bubas leaves for asia',
    description: 'bubas leaves for asia :(',
    imageSrc: '/timeline-images/15.jpg',
    song: {
      title: 'I Don\'t Wanna Be Okay Without You',
      artist: 'Charlie Burg',
      url: 'https://www.youtube.com/watch?v=dluPeE6PA-I',
      description: 'i wont be okay without you :( come back soon'
    }
  },
  {
    id: '19',
    date: '2025-04-02',
    formattedDate: 'April 2, 2025',
    title: 'our 2 year anniversary',
    description: 'our 2 year anniversary!!! i lova you so much',
    imageSrc: '/timeline-images/16.jpg',
    song: {
      title: 'Kung Fu Fighting',
      artist: 'CeeLo Green, Jack Black',
      url: 'https://www.youtube.com/watch?v=bmfudW7rbG0',
      description: 'good vibes ending song but isnt really an ending bc you know there are many more adventures to come hehe'
    }
  }
];

// Initial songs data
const songsData = [
  {
    id: '1',
    title: "Traingazing (feat. Honey Mooncie)",
    artist: "Sam Wills",
    url: "https://www.youtube.com/watch?v=urFJik-gPdQ&ab_channel=SamWills",
    description: "how our relationship easily could have gone, glad it didnt tho!!"
  },
  {
    id: '2',
    title: "Time Of Our Lives",
    artist: "Pitbull, Ne-Yo",
    url: "https://www.youtube.com/watch?v=bTXJQ5ql5Fw&ab_channel=PitbullVEVO",
    description: "when everyone ditched us for the g-wagon and we had car karaoke back to my house"
  },
  {
    id: '3',
    title: "light",
    artist: "wave to earth",
    url: "https://www.youtube.com/watch?v=6DLLVIOBRmQ&ab_channel=wavetoearth-Topic",
    description: "it mightve been a frustrating trip but without it theres a good chance we wouldnt be together now! + that view from the hot tub was amazing"
  },
  {
    id: '4',
    title: "Come Inside Of My Heart",
    artist: "IV OF SPADES",
    url: "https://www.youtube.com/watch?v=dluPeE6PA-I",
    description: "come inside of my heart (:"
  },
  {
    id: '5',
    title: "Fly Love",
    artist: "Jamie Foxx",
    url: "https://www.youtube.com/watch?v=BuoqQx_ZZJ4",
    description: "kobe gyukatsu + vantage point"
  },
  {
    id: '6',
    title: "Drive Safe",
    artist: "Rich Brian",
    url: "https://www.youtube.com/watch?v=7bFFaTGOVI8&ab_channel=RichBrian",
    description: "food, music, and lavender!!"
  },
  {
    id: '7',
    title: "Cruel Summer",
    artist: "Taylor Swift",
    url: "https://www.youtube.com/watch?v=ic8j13piAhQ",
    description: "our summer drives"
  },
  {
    id: '8',
    title: "Henny in the Hamptons",
    artist: "Bren Joy",
    url: "https://www.youtube.com/watch?v=T2NLoljpzkA&ab_channel=BrenJoy",
    description: "clean vibes even though it was cloudy"
  },
  {
    id: '9',
    title: "小鎮姑娘",
    artist: "David Tao",
    url: "https://www.youtube.com/watch?v=dD4JHeZNvF4&ab_channel=TimelessMusic",
    description: "sitting around the campfire, listening to your dads music"
  },
  {
    id: '10',
    title: "Fashion Killa",
    artist: "A$AP Rocky",
    url: "https://www.youtube.com/watch?v=F6VfsJ7LAlE&ab_channel=LIVELOVEASAPVEVO",
    description: "bang bang boom boom pop pop"
  },
  {
    id: '11',
    title: "ETA",
    artist: "NewJeans",
    url: "https://www.youtube.com/watch?v=QrBJUEwxKcc",
    description: "summer song + dance party"
  },
  {
    id: '12',
    title: "Put Your Records On",
    artist: "Ritt Momney",
    url: "https://www.youtube.com/watch?v=WyVfkr6nsrk&ab_channel=RittMomneyVEVO",
    description: "beautiful garden, summer vibes, banana chen!!"
  },
  {
    id: '13',
    title: "Pose For Me",
    artist: "John Mackk, Natalie Nunn",
    url: "https://www.youtube.com/watch?v=dluPeE6PA-I",
    description: "tiktoks and beignets"
  }
];

async function initializeDatabase() {
  try {
    // Insert timeline data
    const { error: timelineError } = await supabase
      .from('timeline_milestones')
      .upsert(timelineData, { onConflict: 'id' });

    if (timelineError) throw timelineError;

    // Insert songs data
    const { error: songsError } = await supabase
      .from('songs')
      .upsert(songsData, { onConflict: 'id' });

    if (songsError) throw songsError;

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase(); 