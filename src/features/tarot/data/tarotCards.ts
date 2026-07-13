export type TarotCard = {
  name: string;
  number: string; // roman numeral / arcana index
  keywords: string[];
  upright: string;
  guidance: string;
};

// The 22 Major Arcana — the emotional spine of a tarot deck.
export const tarotCards: TarotCard[] = [
  {
    name: "The Fool",
    number: "0",
    keywords: ["New beginnings", "Trust", "Adventure"],
    upright:
      "A fresh chapter is opening. The Fool invites you to step forward with an open heart, even without knowing the full path.",
    guidance:
      "Say yes to the thing that scares and excites you. Beginnings only ask for the first step.",
  },
  {
    name: "The Magician",
    number: "I",
    keywords: ["Manifestation", "Power", "Focus"],
    upright:
      "You already hold every tool you need. The Magician signals that intention plus action turns ideas into reality right now.",
    guidance:
      "Stop waiting for permission. Name what you want clearly, then take one concrete action toward it today.",
  },
  {
    name: "The High Priestess",
    number: "II",
    keywords: ["Intuition", "Mystery", "Inner voice"],
    upright:
      "There is knowledge inside you that logic can't reach. The High Priestess asks you to trust the quiet knowing beneath the noise.",
    guidance:
      "Before you ask others, get still and ask yourself. Your intuition already has an answer.",
  },
  {
    name: "The Empress",
    number: "III",
    keywords: ["Abundance", "Nurture", "Creativity"],
    upright:
      "Life is fertile around you. The Empress speaks of growth, comfort, and creative energy ready to be nourished.",
    guidance:
      "Tend to what you're growing — a project, a bond, yourself — with patience and care instead of force.",
  },
  {
    name: "The Emperor",
    number: "IV",
    keywords: ["Structure", "Authority", "Stability"],
    upright:
      "Order creates freedom. The Emperor points to leadership, boundaries, and building something that lasts.",
    guidance:
      "Bring structure to the chaos. A simple plan and a firm boundary will steady everything else.",
  },
  {
    name: "The Hierophant",
    number: "V",
    keywords: ["Tradition", "Guidance", "Belonging"],
    upright:
      "Wisdom passed down has value. The Hierophant highlights mentors, community, and proven paths.",
    guidance:
      "Seek out a teacher or a tradition that has walked this road before you. You don't have to reinvent everything.",
  },
  {
    name: "The Lovers",
    number: "VI",
    keywords: ["Union", "Choice", "Alignment"],
    upright:
      "A meaningful connection or an important choice stands before you. The Lovers is about harmony and choosing from your values.",
    guidance:
      "Choose what aligns with who you truly are, not who you think you should be.",
  },
  {
    name: "The Chariot",
    number: "VII",
    keywords: ["Willpower", "Drive", "Victory"],
    upright:
      "Momentum is on your side. The Chariot rewards discipline and directed focus with real forward motion.",
    guidance:
      "Point all your energy in one direction and hold the reins. You win this by staying the course.",
  },
  {
    name: "Strength",
    number: "VIII",
    keywords: ["Courage", "Patience", "Gentleness"],
    upright:
      "True strength is soft. This card is about mastering fear and impulse with compassion rather than force.",
    guidance:
      "Meet the hard thing with a calm heart. Gentleness is not weakness — it's control.",
  },
  {
    name: "The Hermit",
    number: "IX",
    keywords: ["Reflection", "Solitude", "Inner light"],
    upright:
      "A season of solitude is guiding you inward. The Hermit says the answers come from reflection, not more noise.",
    guidance:
      "Give yourself space to think. Time alone right now is not lonely — it's clarifying.",
  },
  {
    name: "Wheel of Fortune",
    number: "X",
    keywords: ["Cycles", "Change", "Destiny"],
    upright:
      "The wheel is turning. A shift in luck or circumstance is arriving — flow with the change instead of resisting it.",
    guidance:
      "What feels random is part of a larger cycle. Adapt, and let the turn carry you upward.",
  },
  {
    name: "Justice",
    number: "XI",
    keywords: ["Truth", "Fairness", "Accountability"],
    upright:
      "Cause meets effect. Justice asks for honesty and reminds you that your choices are shaping what returns to you.",
    guidance:
      "Act with integrity even when no one is watching. Balance the scales through honest choices.",
  },
  {
    name: "The Hanged Man",
    number: "XII",
    keywords: ["Surrender", "New perspective", "Pause"],
    upright:
      "A pause is not a defeat. The Hanged Man invites you to let go and see your situation from a completely new angle.",
    guidance:
      "Stop pushing. Surrender the need to control this, and a new perspective will reveal the way.",
  },
  {
    name: "Death",
    number: "XIII",
    keywords: ["Endings", "Transformation", "Release"],
    upright:
      "Something must end for something truer to begin. Death is transformation, not literal loss — a clearing of what no longer fits.",
    guidance:
      "Let the old version go without guilt. Release makes room for who you're becoming.",
  },
  {
    name: "Temperance",
    number: "XIV",
    keywords: ["Balance", "Patience", "Moderation"],
    upright:
      "Blend the extremes. Temperance is the art of the middle path — calm, measured, and quietly healing.",
    guidance:
      "Take the balanced route. Small, steady adjustments will bring more peace than any dramatic move.",
  },
  {
    name: "The Devil",
    number: "XV",
    keywords: ["Attachment", "Shadow", "Freedom"],
    upright:
      "A pattern is holding you tighter than you admit. The Devil shines light on the habits, fears, or ties that limit you.",
    guidance:
      "Name what's really binding you. The chains are looser than they feel — you hold the key.",
  },
  {
    name: "The Tower",
    number: "XVI",
    keywords: ["Upheaval", "Awakening", "Truth"],
    upright:
      "A sudden shake-up clears away what was built on shaky ground. The Tower is disruptive, but it frees you from illusion.",
    guidance:
      "Let the false thing fall. What survives this was always the part worth keeping.",
  },
  {
    name: "The Star",
    number: "XVII",
    keywords: ["Hope", "Renewal", "Faith"],
    upright:
      "After the storm, gentle light returns. The Star is healing, hope, and quiet faith that better days are near.",
    guidance:
      "Keep going. Your hope is not naive — it's the exact thing guiding you home.",
  },
  {
    name: "The Moon",
    number: "XVIII",
    keywords: ["Intuition", "Uncertainty", "Dreams"],
    upright:
      "Not everything is clear yet. The Moon asks you to trust your instincts through the fog and not fear what's unknown.",
    guidance:
      "Feel your way forward. Emotions and dreams are speaking — listen instead of forcing clarity.",
  },
  {
    name: "The Sun",
    number: "XIX",
    keywords: ["Joy", "Success", "Vitality"],
    upright:
      "Warmth and clarity arrive. The Sun is one of the brightest cards — success, confidence, and simple happiness.",
    guidance:
      "Let yourself enjoy this. Say yes to what makes you feel alive — the light is genuinely on your side.",
  },
  {
    name: "Judgement",
    number: "XX",
    keywords: ["Awakening", "Reckoning", "Renewal"],
    upright:
      "A moment of clarity calls you higher. Judgement is about honest self-review and answering a deeper calling.",
    guidance:
      "Forgive the past and rise. You're being called to a truer version of your life.",
  },
  {
    name: "The World",
    number: "XXI",
    keywords: ["Completion", "Wholeness", "Achievement"],
    upright:
      "A cycle reaches its fullness. The World is accomplishment, integration, and the satisfying close of a long chapter.",
    guidance:
      "Honor how far you've come before rushing to the next thing. This completion is earned.",
  },
];
