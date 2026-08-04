import type { SeedPack } from "./types";

// "Dansk kultur" word packs — Danish traditions, dishes and places.
//
// NO brand names, company names or TV-programme titles: they are trademarks,
// they date fast, and many are regional. Traditions, dishes, institutions and
// place names carry the Danishness without any of that.


export const PACKS_DANSK: SeedPack[] = [
  {
    name: "Danske Traditioner",
    emoji: "🇩🇰",
    words: [
      "hygge", "fredagshygge", "sofahygge", "levende lys", "stearinlys", "fyrfadslys", "lysestage", "kaffekande",
      "kagebord", "morgenbrød", "julefrokost", "juleaften", "juletræ", "julepynt", "julekugle", "julestjerne",
      "kravlenisse", "julehjerte", "julekalender", "pakkekalender", "adventskrans", "adventslys", "glögg", "æbleskiver",
      "klejner", "pebernødder", "brunkager", "vaniljekranse", "risalamande", "mandelgave", "julesang", "julegave",
      "julemand", "nissehue", "julefrokostsang", "andesteg", "flæskesteg", "rødkål", "brunede kartofler", "brun sovs",
      "nytårsaften", "nytårstale", "kransekage", "champagne", "fyrværkeri", "raket", "stjernekaster", "bordbombe",
      "nytårsforsæt", "nytårstorsk", "fastelavn", "fastelavnsris", "fastelavnsbolle", "tøndeslagning", "kattekonge", "kattedronning",
      "udklædning", "maske", "fastelavnsboller", "slikpose", "påske", "påskefrokost", "påskeæg", "påskebryg",
      "gækkebrev", "vintergæk", "påskeharen", "påskelilje", "påskepynt", "æggejagt", "pinse", "pinsesol",
      "sankthans", "sankthansbål", "heks på bål", "midsommervise", "bålaften", "grillaften", "høstfest", "mortensaften",
      "konfirmation", "konfirmandkjole", "konfirmationsfest", "studenterhue", "studenterkørsel", "dimission", "translokation", "studentersang",
      "taffel", "festtale", "fødselsdagsflag", "flagstang", "dannebrog", "flagdug", "fødselsdagssang", "lagkage",
      "kagemand", "kagekone", "sodavand", "slikskål", "sølvbryllup", "guldbryllup", "barnedåb", "navngivning",
      "fadder", "kirkegang", "salmebog", "højskolesang", "fællessang", "sangbog", "foreningsliv", "generalforsamling",
      "arbejdsdag", "fællesspisning", "banko", "dilettant", "byfest", "gadefest", "sommerfest", "loppemarked",
    ],
  },
  {
    name: "Dansk Mad og Bagværk",
    emoji: "🥐",
    words: [
      "rugbrød", "franskbrød", "grovbrød", "sigtebrød", "surdejsbrød", "bolle", "rundstykke", "håndværker",
      "birkes", "tebirkes", "morgenbrød", "croissant dansk", "spandauer", "wienerbrød", "kanelsnegl", "romsnegl",
      "direktørsnegl", "kringle", "smørkage", "brunsviger", "frøsnapper", "hindbærsnitte", "træstamme", "othellolagkage",
      "sarah bernhardt", "napoleonshat", "kokosmakron", "drømmekage", "gulerodskage", "citronmåne", "lagkage", "kagemand",
      "æblekage", "rødgrød", "koldskål", "kammerjunker", "risengrød", "øllebrød", "havregrød", "frugtgrød",
      "smørrebrød", "håndmad", "leverpostej", "rullepølse", "spegepølse", "hamburgerryg", "roastbeef", "remoulade",
      "ristede løg", "agurkesalat", "sildemad", "marineret sild", "karrysild", "stjerneskud", "dyrlægens natmad", "sol over gudhjem",
      "pariserbøf", "æggesalat", "rejemad", "kartoffelmad", "frikadelle", "medisterpølse", "hakkebøf", "bløde løg",
      "brun sovs", "persillesovs", "stuvet hvidkål", "sursød rødkål", "brunede kartofler", "hvide kartofler", "flæskesteg", "andesteg",
      "gåsesteg", "kalvesteg", "forloren hare", "boller i karry", "biksemad", "stegt flæsk", "æggekage", "tarteletter",
      "fiskefrikadelle", "stegt rødspætte", "paneret fisk", "torskerogn", "klipfisk", "gravad laks", "røget laks", "røget makrel",
      "fiskefilet", "remoulade fisk", "gule ærter", "grønlangkål", "brændende kærlighed", "millionbøf", "hønsekødssuppe", "aspargessuppe",
      "klar suppe", "boller i suppe", "melboller", "urtesuppe", "lakrids", "saltlakrids", "vingummi", "flødebolle",
      "skummand", "romkugle", "studenterbrød", "konfekt", "marcipan", "nougat", "snaps", "akvavit",
      "bitter", "hyldeblomstsaft", "solbærsaft", "kærnemælk", "ymer", "tykmælk", "kakaomælk", "hjemmebryg",
    ],
  },
  {
    name: "Danmark Rundt",
    emoji: "🗺️",
    words: [
      "sjælland", "fyn", "jylland", "bornholm", "lolland", "falster", "møn", "langeland",
      "ærø", "samsø", "anholt", "læsø", "fanø", "rømø", "mandø", "endelave",
      "tunø", "orø", "sejerø", "femø", "nordjylland", "vestjylland", "østjylland", "sønderjylland",
      "midtjylland", "himmerland", "thy", "mors", "salling", "djursland", "vendsyssel", "hanherred",
      "vestsjælland", "nordsjælland", "sydsjælland", "amager", "refshaleøen", "stevns", "odsherred", "hornsherred",
      "limfjorden", "roskilde fjord", "isefjord", "mariager fjord", "vejle fjord", "kolding fjord", "horsens fjord", "randers fjord",
      "ringkøbing fjord", "nissum fjord", "vesterhavet", "nordsøen", "østersøen", "kattegat", "skagerrak", "øresund",
      "storebælt", "lillebælt", "vadehavet", "guldborgsund", "grenen", "råbjerg mile", "rubjerg knude", "bulbjerg",
      "hanstholm", "thyborøn", "hvide sande", "blåvandshuk", "henne strand", "marielyst", "møns klint", "stevns klint",
      "dueodde", "hammershus", "helligdomsklipperne", "ertholmene", "christiansø", "jyske ås", "himmelbjerget", "yding skovhøj",
      "møllehøj", "ejer bavnehøj", "rold skov", "gribskov", "dyrehaven", "hareskoven", "silkeborgsøerne", "gudenåen",
      "skjern å", "susåen", "kronborg", "frederiksborg", "rosenborg", "amalienborg", "egeskov", "valdemars slot",
      "koldinghus", "nyborg slot", "dragsholm", "spøttrup", "storebæltsbroen", "øresundsbroen", "lillebæltsbroen", "den gamle by",
      "jelling høje", "lindholm høje", "trelleborg", "ladbyskibet", "kongernes jelling", "ribe domkirke", "roskilde domkirke", "aarhus domkirke",
      "marmorkirken", "rundetårn", "nyhavn", "den lille havfrue", "tivoli have", "bakken skov", "legoland by", "skagens gren",
    ],
  },
];
