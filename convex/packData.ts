// Built-in Danish word packs. Plain common nouns/categories — no licensed
// content. Seeded into the `packs` table by packs.seedBuiltInPacks.

export type SeedPack = { name: string; emoji: string; words: string[] };

export const DANISH_PACKS: SeedPack[] = [
  {
    name: "Dyr",
    emoji: "🦊",
    words: [
      "Hund", "Kat", "Hest", "Ko", "Gris", "Får", "Ged", "Høne", "And", "Gås",
      "Kanin", "Mus", "Rotte", "Egern", "Pindsvin", "Ræv", "Ulv", "Bjørn", "Elg",
      "Hjort", "Løve", "Tiger", "Elefant", "Giraf", "Zebra", "Næsehorn", "Abe",
      "Delfin", "Hval", "Haj", "Sæl", "Pingvin", "Ørn", "Ugle", "Krage", "Måge",
      "Slange", "Frø", "Skildpadde", "Krokodille", "Edderkop", "Myre",
    ],
  },
  {
    name: "Mad & Drikke",
    emoji: "🍔",
    words: [
      "Pizza", "Burger", "Pasta", "Lasagne", "Sushi", "Suppe", "Salat", "Sandwich",
      "Pølse", "Frikadelle", "Smørrebrød", "Rugbrød", "Kage", "Pandekage", "Vaffel",
      "Is", "Chokolade", "Slik", "Popcorn", "Chips", "Ost", "Æg", "Bacon", "Kylling",
      "Fisk", "Kartoffel", "Ris", "Brød", "Sovs", "Ketchup", "Kaffe", "Te", "Mælk",
      "Juice", "Vand", "Sodavand", "Øl", "Vin", "Smoothie", "Kakao",
    ],
  },
  {
    name: "Frugt & Grønt",
    emoji: "🍎",
    words: [
      "Æble", "Pære", "Banan", "Appelsin", "Citron", "Lime", "Jordbær", "Hindbær",
      "Blåbær", "Kirsebær", "Drue", "Melon", "Vandmelon", "Ananas", "Mango", "Kiwi",
      "Fersken", "Blomme", "Tomat", "Agurk", "Gulerod", "Kartoffel", "Løg", "Hvidløg",
      "Peberfrugt", "Broccoli", "Blomkål", "Spinat", "Salat", "Majs", "Ærter", "Bønner",
      "Svamp", "Aubergine", "Squash", "Rødbede", "Selleri", "Porre", "Radise", "Græskar",
    ],
  },
  {
    name: "Sport",
    emoji: "⚽",
    words: [
      "Fodbold", "Håndbold", "Basketball", "Volleyball", "Tennis", "Badminton",
      "Bordtennis", "Golf", "Svømning", "Løb", "Cykling", "Ridning", "Boksning",
      "Brydning", "Karate", "Judo", "Gymnastik", "Atletik", "Stavspring", "Højdespring",
      "Længdespring", "Skøjteløb", "Ishockey", "Skiløb", "Snowboard", "Surfing",
      "Sejlsport", "Roning", "Kajak", "Klatring", "Dart", "Bowling", "Curling",
      "Fægtning", "Triatlon", "Spydkast", "Diskos", "Vægtløftning", "Dans", "Parkour",
    ],
  },
  {
    name: "Danske byer",
    emoji: "🏙️",
    words: [
      "København", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding",
      "Horsens", "Vejle", "Roskilde", "Herning", "Silkeborg", "Næstved", "Fredericia",
      "Viborg", "Køge", "Holstebro", "Slagelse", "Helsingør", "Hillerød", "Sønderborg",
      "Svendborg", "Hjørring", "Holbæk", "Frederikshavn", "Nørresundby", "Ringsted",
      "Haderslev", "Skive", "Nykøbing", "Kalundborg", "Aabenraa", "Ribe", "Skagen",
      "Frederikssund", "Grenaa", "Thisted", "Varde", "Middelfart", "Nyborg",
    ],
  },
  {
    name: "Natur",
    emoji: "🌲",
    words: [
      "Skov", "Træ", "Blomst", "Græs", "Busk", "Mose", "Sø", "Å", "Flod", "Hav",
      "Strand", "Klit", "Bjerg", "Bakke", "Dal", "Eng", "Mark", "Klippe", "Sten",
      "Sand", "Jord", "Regn", "Sne", "Tåge", "Sky", "Sol", "Måne", "Stjerne", "Vind",
      "Storm", "Lyn", "Torden", "Regnbue", "Vandfald", "Ø", "Fjord", "Gletsjer",
      "Vulkan", "Ørken", "Jungle",
    ],
  },
  {
    name: "Køkken",
    emoji: "🍳",
    words: [
      "Gryde", "Pande", "Kniv", "Gaffel", "Ske", "Tallerken", "Skål", "Glas", "Kop",
      "Krus", "Komfur", "Ovn", "Køleskab", "Fryser", "Mikroovn", "Opvaskemaskine",
      "Brødrister", "Elkedel", "Kaffemaskine", "Blender", "Røremaskine", "Si",
      "Rivejern", "Dåseåbner", "Proptrækker", "Skærebræt", "Viskestykke", "Forklæde",
      "Grydeske", "Piskeris", "Spatel", "Saks", "Vægt", "Målebæger", "Bageform",
      "Rullepind", "Termometer", "Tang", "Tragt", "Dørslag",
    ],
  },
  {
    name: "Transport",
    emoji: "🚗",
    words: [
      "Bil", "Bus", "Tog", "Cykel", "Knallert", "Motorcykel", "Lastbil", "Varevogn",
      "Taxa", "Ambulance", "Brandbil", "Politibil", "Traktor", "Gravko", "Sporvogn",
      "Metro", "Fly", "Helikopter", "Raket", "Ballon", "Skib", "Færge", "Båd",
      "Sejlbåd", "Kano", "Kajak", "Jetski", "Ubåd", "Scooter", "Løbehjul", "Rulleskøjter",
      "Skateboard", "Trillebør", "Slæde", "Elevator", "Rulletrappe", "Svævebane",
      "Gondol", "Hangglider", "Faldskærm",
    ],
  },
  {
    name: "Erhverv",
    emoji: "👷",
    words: [
      "Læge", "Sygeplejerske", "Tandlæge", "Lærer", "Pædagog", "Politibetjent",
      "Brandmand", "Soldat", "Pilot", "Stewardesse", "Kok", "Tjener", "Bager",
      "Slagter", "Frisør", "Mekaniker", "Tømrer", "Murer", "Elektriker", "Blikkenslager",
      "Maler", "Landmand", "Fisker", "Gartner", "Advokat", "Dommer", "Revisor",
      "Ingeniør", "Arkitekt", "Programmør", "Journalist", "Fotograf", "Musiker",
      "Skuespiller", "Forfatter", "Dyrlæge", "Astronaut", "Bibliotekar", "Postbud", "Chauffør",
    ],
  },
  {
    name: "Tøj",
    emoji: "👕",
    words: [
      "Trøje", "Skjorte", "T-shirt", "Bluse", "Sweater", "Cardigan", "Jakke", "Frakke",
      "Bukser", "Jeans", "Shorts", "Nederdel", "Kjole", "Strømper", "Sokker", "Undertøj",
      "Sko", "Støvler", "Sandaler", "Sneakers", "Hjemmesko", "Hue", "Hat", "Kasket",
      "Halstørklæde", "Vanter", "Handsker", "Bælte", "Slips", "Butterfly", "Vest",
      "Badedragt", "Badebukser", "Pyjamas", "Kjole", "Regnjakke", "Dunjakke", "Habit",
      "Smykke", "Solbriller",
    ],
  },
  {
    name: "Kroppen",
    emoji: "🫀",
    words: [
      "Hoved", "Hår", "Pande", "Øjne", "Øre", "Næse", "Mund", "Læber", "Tænder",
      "Tunge", "Hage", "Kind", "Hals", "Nakke", "Skulder", "Arm", "Albue", "Håndled",
      "Hånd", "Finger", "Tommel", "Negl", "Bryst", "Mave", "Ryg", "Hofte", "Ben",
      "Knæ", "Lægge", "Ankel", "Fod", "Tå", "Hjerte", "Lunge", "Hjerne", "Mavesæk",
      "Lever", "Nyre", "Knogle", "Muskel",
    ],
  },
  {
    name: "Musikinstrumenter",
    emoji: "🎸",
    words: [
      "Guitar", "Klaver", "Flygel", "Violin", "Bratsch", "Cello", "Kontrabas",
      "Harpe", "Trommer", "Tromme", "Bækken", "Tamburin", "Xylofon", "Marimba",
      "Trompet", "Basun", "Tuba", "Valdhorn", "Saxofon", "Klarinet", "Obo", "Fagot",
      "Tværfløjte", "Blokfløjte", "Mundharmonika", "Harmonika", "Orgel", "Synthesizer",
      "Banjo", "Mandolin", "Ukulele", "Bas", "Triangel", "Castagnetter", "Sækkepibe",
      "Lyre", "Cembalo", "Theremin", "Konga", "Bongotromme",
    ],
  },
];
