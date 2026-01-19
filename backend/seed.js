const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Anime = require('./models/Anime');

dotenv.config();

const animeData = [
  {
    title: 'Attack on Titan',
    description: 'In a world where humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid creatures who devour humans seemingly without reason.',
    image: 'aot.png',
    genre: ['Action', 'Drama', 'Fantasy']
  },
  {
    title: 'Black Clover',
    description: 'Asta and Yuno were abandoned at the same church on the same day. While Yuno has talent with magic, Asta has none. They both dream of becoming the Wizard King.',
    image: 'black clover.png',
    genre: ['Action', 'Comedy', 'Fantasy']
  },
  {
    title: 'Bleach',
    description: 'High school student Ichigo Kurosaki, who has the ability to see ghosts, gains soul reaper powers from Rukia Kuchiki and sets out to save the world from evil spirits.',
    image: 'bleach.png',
    genre: ['Action', 'Adventure', 'Supernatural']
  },
  {
    title: 'Dragon Ball Z',
    description: 'After learning that he is from another planet, a warrior named Goku and his friends are prompted to defend it from an onslaught of extraterrestrial enemies.',
    image: 'dbz.png',
    genre: ['Action', 'Adventure', 'Comedy']
  },
  {
    title: 'Death Note',
    description: 'An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone whose name is written into it.',
    image: 'death notr.png',
    genre: ['Mystery', 'Psychological', 'Thriller']
  },
  {
    title: 'Demon Slayer',
    description: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer.',
    image: 'demon slayer.png',
    genre: ['Action', 'Supernatural', 'Historical']
  },
  {
    title: 'Jujutsu Kaisen',
    description: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman school to be able to locate the demons other body parts and thus exorcise himself.',
    image: 'jjk.png',
    genre: ['Action', 'Supernatural', 'School']
  },
  {
    title: 'My Hero Academia',
    description: 'In a world where most people have superpowers called Quirks, a boy born without them dreams of becoming a hero and enrolls in a prestigious hero academy.',
    image: 'my hero.png',
    genre: ['Action', 'Comedy', 'School']
  },
  {
    title: 'Naruto',
    description: 'Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village.',
    image: 'naruto.png',
    genre: ['Action', 'Adventure', 'Comedy']
  },
  {
    title: 'One Piece',
    description: 'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.',
    image: 'one piece.png',
    genre: ['Action', 'Adventure', 'Comedy']
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    await Anime.deleteMany({});
    console.log('Cleared existing anime data');

    await Anime.insertMany(animeData);
    console.log('Anime data seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
