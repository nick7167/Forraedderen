import type { QuestionPair } from "./types";

// Family-tier question pairs — the default Spørgsmål pool, safe for any table.
//
// Each pair is a CREW question + a related-but-different IMPOSTER question.
// There are no categories — pairs are drawn from one flat pool. There are no
// predefined answers either: players write their own one-word answer.
//
// Authoring rules (so the imposter blends by format and is only caught by the
// *content* of their answer):
//   1. Every question must have a ONE-WORD / single-value answer.
//   2. The crew and imposter questions must demand the SAME answer TYPE
//      (number↔number, name↔name, color↔color, …) — but never the same question.
//   3. Keep every `crew` question unique.
//   4. ALL questions must be subjective, personal, or behavior-based (NO trivia).
//   5. Vary the OPENER. "Hvor mange" and "Hvem i gruppen" are capped at 25% of
//      the pool each by convex/content-quality.test.ts — a pool that is 75% two
//      shapes feels repetitive long before it runs out of items.
//
// Stored on a round as: secretWord = crew question, decoyWord = imposter
// question (category is left empty for this mode).

export const QUESTIONS_FAMILY: QuestionPair[] = [
  {
    crew: "Hvor mange uåbnede faner har du åbne i din browser på mobilen?",
    imposter: "Hvor mange apps har du installeret, som du aldrig har åbnet?",
  },
  {
    crew: "Hvem i gruppen ville ende på skadestuen på den dummeste måde?",
    imposter: "Hvem i gruppen er mest tilbøjelig til at få en spontan skade under sport?",
  },
  {
    crew: "Hvor mange solbriller har du mistet eller trådt på i dit liv?",
    imposter: "Hvor mange paraplyer har du efterladt i toget eller bussen?",
  },
  {
    crew: "Hvem i gruppen ville udløse en brandalarm ved et uheld i køkkenet?",
    imposter: "Hvem i gruppen er mest tilbøjelig til at spilde rødvin på et hvidt tæppe?",
  },
  {
    crew: "Hvor mange gange om ugen spiser du mad direkte fra emballagen?",
    imposter: "Hvor mange gange om ugen genopvarmer du kaffe i mikroovnen?",
  },
  {
    crew: "Hvem i gruppen har den mest kaotiske natbords-skuffe?",
    imposter: "Hvem i gruppen har flest halvt tømte vandflasker stående på værelset?",
  },
  {
    crew: "Hvor mange ubesvarede beskeder har du i din familie-gruppechat?",
    imposter: "Hvor mange ulæste notifikationer har du på sociale medier lige nu?",
  },
  {
    crew: "Hvem i gruppen ville prøve at snakke sig ud af en fartbøde?",
    imposter: "Hvem i gruppen ville gå fuldstændig i panik hvis de fik en parkeringsbøde?",
  },
  {
    crew: "Hvor mange par uslidte strømper har du bagerst i din skuffe?",
    imposter: "Hvor mange slidte t-shirts nægter du at smide ud?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at synge operasang på toilettet?",
    imposter: "Hvem i gruppen nynner altid på den samme irriterende sang?",
  },
  {
    crew: "Hvor mange minutter kan du køre på bilens reservetank før du går i panik?",
    imposter: "Hvor mange procent strøm har din mobil før du panikker og leder efter en oplader?",
  },
  {
    crew: "Hvem i gruppen ville prøve at spise noget udløbet mad for at bevise det var ok?",
    imposter: "Hvem i gruppen smider mad ud dagen før udløbsdatoen for en sikkerheds skyld?",
  },
  {
    crew: "Hvor mange gange har du lades som om du sov i et offentligt transportmiddel?",
    imposter: "Hvor mange gange har du overhørt dit stoppested fordi du hørte musik?",
  },
  {
    crew: "Hvem i gruppen har de mest bizar-kombinerede natmads-snacks?",
    imposter: "Hvem i gruppen ville spise kold pizza til morgenmad tre dage i træk?",
  },
  {
    crew: "Hvor mange gange har du taget fejl af sukker og salt under madlavning?",
    imposter: "Hvor mange gange har du glemt en pizza i ovnen, så den blev kulsvart?",
  },
  {
    crew: "Hvem i gruppen ville overbevise et helt selskab om en opdigtet røverhistorie?",
    imposter: "Hvem i gruppen er dårligst til at holde masken, når der bliver fortalt en løgn?",
  },
  {
    crew: "Hvor mange glemte genstande har du bagerst i din fryser?",
    imposter: "Hvor mange glas syltede ting har du stående i bunden af dit køleskab?",
  },
  {
    crew: "Hvem i gruppen ville gå amok på et loppemarked og købe noget helt ubrugeligt?",
    imposter: "Hvem i gruppen er mest tilbøjelig til at prutte om prisen i en helt almindelig butik?",
  },
  {
    crew: "Hvor mange gange har du gennemsøgt hele huset efter noget du holdt i hånden?",
    imposter: "Hvor mange gange har du ledt efter din telefon mens du talte i den?",
  },
  {
    crew: "Hvem i gruppen ville bruge alle sine lommepenge på en forlystelsespark på én dag?",
    imposter: "Hvem i gruppen nægter at prøve de vilde forlystelser i Tivoli?",
  },
  {
    crew: "Hvor mange tøjklemmer eller elastikker har du liggende i din skuffe?",
    imposter: "Hvor mange genanvendelige poser har du samlet sammen under vasken?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at fare vild i et stormagasin?",
    imposter: "Hvem i gruppen bruger længst tid på at læse menukortet på en restaurant?",
  },
  {
    crew: "Hvor mange gange har du tabt en shampoo-flaske ned over din tå i bruseren?",
    imposter: "Hvor mange gange har du skoldet dig på for varmt badevand?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at starte en vild dans i en stumfilm?",
    imposter: "Hvem i gruppen laver altid de mest dramatiske armbevægelser når de fortæller noget?",
  },
  {
    crew: "Hvor mange gange har du spist chips til aftensmad fordi du var for dopet til at lave mad?",
    imposter: "Hvor mange gange har du bestilt takeaway to gange på samme dag?",
  },
  {
    crew: "Hvem i gruppen ville glemme sin egen bagage på bagagebåndet i lufthavnen?",
    imposter: "Hvem i gruppen stiller op ved gate'n to timer før flyet boarder?",
  },
  {
    crew: "Hvor mange uåbnede vitaminpiller eller kosttilskud har du i skabet?",
    imposter: "Hvor mange forskellige slags te eller kaffe har du stående i dit køkken?",
  },
  {
    crew: "Hvem i gruppen har den mest højlydte og smittende grineanfald?",
    imposter: "Hvem i gruppen fniser altid på de mest upassende tidspunkter?",
  },
  {
    crew: "Hvor mange par handsker eller vanter har du mistet kun den ene af?",
    imposter: "Hvor mange paraplyer har du haft, som blæste vrangen ud i blæsevejr?",
  },
  {
    crew: "Hvem i gruppen ville prøve at tæmme et vildt dyr hvis de stødte på det?",
    imposter: "Hvem i gruppen ville hoppe op på en stol hvis de så en lille mus?",
  },
  {
    crew: "Hvor mange gange har du skrevet en lang besked og slettet den hele igen?",
    imposter: "Hvor mange gange har du fortrudt en besked i det sekund du trykkede send?",
  },
  {
    crew: "Hvem i gruppen er den største udskydelses-konge, når der skal gøres rent?",
    imposter: "Hvem i gruppen sorterer sit vasketøj efter nøjagtige farvenuancer?",
  },
  {
    crew: "Hvor mange ubesvarede mails har du på din private mailadresse?",
    imposter: "Hvor mange spam-mails sletter du om dagen uden at åbne dem?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at falde over sine egne ben på flad vej?",
    imposter: "Hvem i gruppen går altid ind i dørkarme derhjemme?",
  },
  {
    crew: "Hvor mange gange har du trykket 'glemt adgangskode' i denne måned?",
    imposter: "Hvor mange forskellige koder har du prøvet før en konto blev spærret?",
  },
  {
    crew: "Hvem i gruppen tager de længste og mest luksuriøse karbade eller brusere?",
    imposter: "Hvem i gruppen bruger mest hårlak eller hårvoks før de går ud?",
  },
  {
    crew: "Hvor mange halvbrugte noter har du liggende i din note-app på mobilen?",
    imposter: "Hvor mange indkøbssedler har du lavet og derefter glemt at tage med i butikken?",
  },
  {
    crew: "Hvem i gruppen ville være den mest udholdende til en pubquiz?",
    imposter: "Hvem i gruppen gætter altid vildt forkert i et spil Trivial Pursuit?",
  },
  {
    crew: "Hvor mange gange har du prøvet at tænde fjernsynet med din mobil i stedet for fjernbetjeningen?",
    imposter: "Hvor mange gange har du ledt efter fjernbetjeningen mens den lå under dig i sofaen?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at købe matchende tøj til sit kæledyr?",
    imposter: "Hvem i gruppen taler til sine stueplanter som om de var mennesker?",
  },
  {
    crew: "Hvor mange gange har du tabt noget spiseligt på gulvet og brugt 5-sekunders-reglen?",
    imposter: "Hvor mange gange har du pustet på et stykke mad og spist det alligevel?",
  },
  {
    crew: "Hvem i gruppen ville hurtigst kunne gennemskue et magisk trick?",
    imposter: "Hvem i gruppen bliver altid fuldstændig blæst bagover af simple tryllekunstner?",
  },
  {
    crew: "Hvor mange uåbnede breve fra banken eller det offentlige har du liggende?",
    imposter: "Hvor mange kvitteringer gemmer du i din pung, som du aldrig får brug for?",
  },
  {
    crew: "Hvem i gruppen er den største snob når det kommer til kaffe eller vin?",
    imposter: "Hvem i gruppen kan absolut ikke smage forskel på en dyr og en billig vin?",
  },
  {
    crew: "Hvor mange gange har du haft en sang på hjernen i mere end tre dage i træk?",
    imposter: "Hvor mange gange har du sunget forkert på en sangtekst i flere år?",
  },
  {
    crew: "Hvem i gruppen ville være den mest tilbøjelige til at overleve en zombie-apokalypse?",
    imposter: "Hvem i gruppen ville overgive sig først til zombierne for at undgå motion?",
  },
  {
    crew: "Hvor mange tomme papkasser fra nethandel står der i dit hjem lige nu?",
    imposter: "Hvor mange ting har du bestilt på nettet og fortrudt før det overhovedet ankom?",
  },
  {
    crew: "Hvem i gruppen har den sjoveste eller mest unikke ringetone på mobilen?",
    imposter: "Hvem i gruppen har altid sin mobil på lydløs og opdager aldrig opkald?",
  },
  {
    crew: "Hvor mange gange har du sat noget i mikrobølgeovnen og glemt alt om det?",
    imposter: "Hvor mange gange har du fyldt en elkedel og glemt at tænde for den?",
  },
  {
    crew: "Hvem i gruppen ville være den mest tilbøjelige til at gå i panik over en fejl i GPS'en?",
    imposter: "Hvem i gruppen kører altid forkert fordi de tror de ved bedre end GPS'en?",
  },
  {
    crew: "Hvor mange gange har du ladet som om du ikke var hjemme, da det ringede på døren?",
    imposter: "Hvor mange gange har du kigget ud ad kighullet for at tjekke hvem der var i opgangen?",
  },
  {
    crew: "Hvem i gruppen har flest ubrugte træningsprogrammer gemt på mobilen?",
    imposter: "Hvem i gruppen har købt et fitnessabonnement uden at sætte sine ben der i et halvt år?",
  },
  {
    crew: "Hvor mange gange har du spist slik til aftensmad, da du var alene hjemme?",
    imposter: "Hvor mange gange har du spist en hel pakke kiks på ti minutter?",
  },
  {
    crew: "Hvem i gruppen ville først blive opslugt af en mærkelig konspirationsteori?",
    imposter: "Hvem i gruppen tror mest på at spøgelser og overnaturlige ting findes?",
  },
  {
    crew: "Hvor mange par slidte sneakers ejer du, som du aldrig vil smide ud?",
    imposter: "Hvor mange par fest-sko har du stående, som er for smertefulde at gå i?",
  },
  {
    crew: "Hvem i gruppen ville blive fanget i en teltlynlås under en campingtur?",
    imposter: "Hvem i gruppen nægter under alle omstændigheder at sove i et telt?",
  },
  {
    crew: "Hvor mange minutter bruger du på at finde den helt rigtige film på Netflix før du opgiver?",
    imposter: "Hvor mange trailers ser du igennem før du overhovedet vælger hvad du vil se?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at bruge en hel flaske ketchup på én uge?",
    imposter: "Hvem i gruppen putter altid alt for meget chilisauce på deres mad?",
  },
  {
    crew: "Hvor mange gange har du skiftede tøj tre gange før du gik ud ad døren?",
    imposter: "Hvor mange gange har du spurgt en ven om dit outfit så dumt ud?",
  },
  {
    crew: "Hvem i gruppen har den vildeste historik med knuste mobilskærme?",
    imposter: "Hvem i gruppen bruger det mest tykke og beskyttende mobilcover?",
  },
  {
    crew: "Hvor mange gange har du prøvet at hælde mælk i kaffemaskinen ved et uheld?",
    imposter: "Hvor mange gange har du stillet mælken ind i køkkenskabet i stedet for køleskabet?",
  },
  {
    crew: "Hvem i gruppen ville være den værste til at lægge et simpelt puslespil?",
    imposter: "Hvem i gruppen bliver mest frustreret hvis en brik mangler i et spil?",
  },
  {
    crew: "Hvor mange glemte mønter har du liggende i bunden af dine jakkelommer?",
    imposter: "Hvor mange brugte lommetørklæder finder du bagerst i dine jakker?",
  },
  {
    crew: "Hvem i gruppen ville prøve at reparere sit eget bliktag uden nogen erfaring?",
    imposter: "Hvem i gruppen tilkalder en håndværker til at skifte en helt almindelig pære?",
  },
  {
    crew: "Hvor mange gange har du prøvet at åbne en dåse uden dåseåbner og mislykkedes?",
    imposter: "Hvor mange gange har du skåret dig på en dåsekant ved et uheld?",
  },
  {
    crew: "Hvem i gruppen har den mest overfyldte fryser fyldt med gamle bær og is?",
    imposter: "Hvem i gruppen gemmer altid en mikroskopisk rest af mad i en plastikbeholder?",
  },
  {
    crew: "Hvor mange gange har du sagt 'hvad?' tre gange og derefter bare nikket uden at høre efter?",
    imposter: "Hvor mange gange har du ladet som om du forstod et fremmedsprog på en ferie?",
  },
  {
    crew: "Hvem i gruppen ville starte en udklædningsfest helt uden grund?",
    imposter: "Hvem i gruppen dukker altid op i det mest afdæmpede og neutrale tøj?",
  },
  {
    crew: "Hvor mange ulæste bøger står der i din reol som pynt?",
    imposter: "Hvor mange kogebøger har du stående, som du aldrig har lavet opskrifter fra?",
  },
  {
    crew: "Hvem i gruppen ville være den mest tilbøjelige til at fare vild på en simpel gåtur i skoven?",
    imposter: "Hvem i gruppen pakker altid en kæmpe rygsæk til en helt kort tur?",
  },
  {
    crew: "Hvor mange gange har du trådt på en LEGO-klods med bare tæer?",
    imposter: "Hvor mange gange har du stødt din lilletå mod et seneben?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at holde en tale der varer tre gange for længe?",
    imposter: "Hvem i gruppen bliver mest genert når alle kigger på dem til en fest?",
  },
  {
    crew: "Hvor mange gange har du prøvet at tage et billede af månen og været skuffet over resultatet?",
    imposter: "Hvor mange solnedgangsbilleder har du liggende på din telefon?",
  },
  {
    crew: "Hvem i gruppen ville først foreslå at tage på en spontan nat-svømmetur om sommeren?",
    imposter: "Hvem i gruppen synes altid at badevandet i Danmark er alt for koldt?",
  },
  {
    crew: "Hvor mange gange har du glemt at du havde noget i ovnen indtil det lugtede brændt?",
    imposter: "Hvor mange gange har du sat en gryde over og glemt alt om den?",
  },
  {
    crew: "Hvem i gruppen har den største samling af mærkelige krydderier de aldrig bruger?",
    imposter: "Hvem i gruppen spiser den mest uoriginale og kedelige mad hver dag?",
  },
  {
    crew: "Hvor mange gange har du prøvet at tage et koldt bad fordi du glemte at tænde for det varme?",
    imposter: "Hvor mange gange har du løbet tør for varmt vand midt i et bad?",
  },
  {
    crew: "Hvem i gruppen ville ende med at købe det dyreste udstyr før de overhovedet er startet på en ny hobby?",
    imposter: "Hvem i gruppen opgiver en ny hobby efter under en uge?",
  },
  {
    crew: "Hvor mange uåbnede dåser med sodavand eller øl har du stående i dit skur?",
    imposter: "Hvor mange tomme pantflasker har du stående i en pose derhjemme lige nu?",
  },
  {
    crew: "Hvem i gruppen tager altid flest billeder af deres mad før de spiser den?",
    imposter: "Hvem i gruppen begynder at spise før alle andre overhovedet har sat sig?",
  },
  {
    crew: "Hvor mange gange har du prøvet at smide noget i skraldespanden og ramt ved siden af?",
    imposter: "Hvor mange gange har du tabt noget ned i toilettet ved et uheld?",
  },
  {
    crew: "Hvem i gruppen er den mest tilbøjelige til at bruge fem timer på at samle et simpelt bord?",
    imposter: "Hvem i gruppen nægter at læse brugsanvisningen når noget skal sættes op?",
  },
  {
    crew: "Hvor mange glemte nøglereringe eller badges har du liggende i en skuffe?",
    imposter: "Hvor mange ubrugte klistermærker har du gemt gennem tiden?",
  },
  {
    crew: "Hvem i gruppen ville være den mest tilbøjelige til at melde sig til et tåbeligt verdensrekordforsøg?",
    imposter: "Hvem i gruppen er bedst til at udføre helt unyttige og mærkelige partertricks?",
  },
  {
    crew: "Hvor mange gange har du prøvet at åbne en dør med dit rejsekort eller betalingskort?",
    imposter: "Hvor mange gange har du prøvet at 'zoome' på et fysisk papirbillede med to fingre?",
  },
  {
    crew: "Hvem i gruppen har den mest kaotiske og usorterede slikpose til fredagsslik?",
    imposter: "Hvem i gruppen spiser kun én bestemt type slik fra en bland-selv-pose?",
  },
  {
    crew: "Hvor mange gange har du købt en plante og dræbt den inden for en måned?",
    imposter: "Hvor mange plastikplanter har du i dit hjem for at undgå at dræbe dem?",
  },
  {
    crew: "Hvem i gruppen ville overtale alle andre til at tage den dyreste taxi hjem fra byen?",
    imposter: "Hvem i gruppen vil hellere gå fem kilometer om natten for at spare taxapengene?",
  },
  {
    crew: "Hvor mange ulæste beskeder har du fra folk du bevidst undgår at svare?",
    imposter: "Hvor mange gange har du brugt 'dårligt batteri' som undskyldning for ikke at svare?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at falde i søvn i biografen under en actionfilm?",
    imposter: "Hvem i gruppen spiser alle sine popcorn før reklamerne i biografen er færdige?",
  },
  {
    crew: "Hvor mange gange har du haft dit tøj omvendt på uden at opdage det før middag?",
    imposter: "Hvor mange gange har du haft to forskellige strømper på på arbejde?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at synge forfærdeligt falsk men med enorm indlevelse?",
    imposter: "Hvem i gruppen tvinger altid andre til at lytte til deres yndlingsmusik i bilen?",
  },
  {
    crew: "Hvor mange gange har du prøvet at drikke af en tom kop fordi du var uopmærksom?",
    imposter: "Hvor mange gange har du spildt drikkevarer ud over dit eget tastatur?",
  },
  {
    crew: "Hvem i gruppen ville blive mest oppe at køre over et billigt kup i et supermarked?",
    imposter: "Hvem i gruppen tjekker altid tilbudsaviser igennem før de køber ind?",
  },
  {
    crew: "Hvor mange halvbrugte solcremer fra i forfjor har du liggende i skabet?",
    imposter: "Hvor mange lipbalms eller lypsyler har du mistet i løbet af vinteren?",
  },
  {
    crew: "Hvem i gruppen ville være den mest udholdende til at stå i en ti timer lang kø for billetter?",
    imposter: "Hvem i gruppen opgiver at handle hvis der er mere end tre personer i køen?",
  },
  {
    crew: "Hvor mange gange har du lades som om du kiggede intenst på din mobil for at undgå øjenkontakt?",
    imposter: "Hvor mange gange har du taget høretelefoner i uden at afspille noget for at være i fred?",
  },
  {
    crew: "Hvem i gruppen har den mest uforståelige og kaotiske tidsplan i løbet af en uge?",
    imposter: "Hvem i gruppen planlægger sine aftaler tre måneder ud i fremtiden?",
  },
  {
    crew: "Hvor mange gange har du skiftet kanal på TV'et og glemt hvad du ville se?",
    imposter: "Hvor mange gange har du haft TV'et kørende i baggrunden uden overhovedet at kigge på det?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at miste sin jakke på et diskotek eller en bar?",
    imposter: "Hvem i gruppen glemmer altid at tage sin pung med når I skal ud?",
  },
  // Originale par
  {
    crew: "Hvor mange timer sov du i nat?",
    imposter: "Hvor mange kopper kaffe drikker du om dagen?",
  },
  {
    crew: "Hvor mange par sko ejer du?",
    imposter: "Hvor mange puder har du i din seng?",
  },
  {
    crew: "Hvor gammel var du, da du fik din første mobil?",
    imposter: "Hvor mange lande har du besøgt?",
  },
  {
    crew: "Hvad er din yndlingsårstid?",
    imposter: "I hvilken årstid har du fødselsdag?",
  },
  {
    crew: "Hvilken årstid fryser du mest om?",
    imposter: "Hvilken årstid rejser du helst i?",
  },
  {
    crew: "Hvad er din yndlingsfarve?",
    imposter: "Hvilken farve er din yndlingstrøje?",
  },
  {
    crew: "Hvilken farve er din hoveddør?",
    imposter: "Hvilken farve er dit værelse?",
  },
  {
    crew: "Hvad spiste du til morgenmad?",
    imposter: "Hvad ville du ønske, du fik til morgenmad?",
  },
  {
    crew: "Hvad er din yndlingsret?",
    imposter: "Hvilken ret kan du slet ikke lide?",
  },
  {
    crew: "Hvad er din yndlingsfrugt?",
    imposter: "Hvilken frugt kan du ikke lide?",
  },
  {
    crew: "Hvilket land vil du helst rejse til?",
    imposter: "Hvilket land har du senest besøgt?",
  },
  {
    crew: "Hvilken by vil du helst bo i?",
    imposter: "Hvilken by er du født i?",
  },
  {
    crew: "Hvilken ugedag kan du bedst lide?",
    imposter: "Hvilken ugedag glæder du dig mindst til?",
  },
  {
    crew: "Hvad drikker du om morgenen?",
    imposter: "Hvad drikker du, når du skal slappe af?",
  },
  {
    crew: "Hvilket kæledyr vil du helst have?",
    imposter: "Hvilket dyr er du mest bange for?",
  },
  {
    crew: "Hvilket vildt dyr synes du er flottest?",
    imposter: "Hvilket dyr ville du helst være?",
  },
  {
    crew: "Hvilken sport ser du helst?",
    imposter: "Hvilken sport dyrker du selv?",
  },
  {
    crew: "Hvad laver du helst i weekenden?",
    imposter: "Hvad laver du, når du keder dig?",
  },

  // Vaner, tal og mængder
  {
    crew: "Hvor mange gange trykker du typisk snooze om morgenen?",
    imposter: "Hvor mange kopper kaffe drikker du før frokost?",
  },
  {
    crew: "Hvor mange gange om måneden spiser du fastfood?",
    imposter: "Hvor mange gange om ugen træner du reelt?",
  },
  {
    crew: "Hvor mange par sko bruger du til hverdag?",
    imposter: "Hvor mange jakker hænger der i din entré?",
  },
  {
    crew: "Hvor mange ubesvarede beskeder har du cirka på din telefon lige nu?",
    imposter: "Hvor mange apps bruger du faktisk dagligt?",
  },
  {
    crew: "Hvor mange kærester har du haft i dit liv?",
    imposter: "Hvor mange lande har du boet eller arbejdet i?",
  },
  {
    crew: "Hvor mange dage om ugen føler du dig helt udhvilet?",
    imposter: "Hvor mange dage om ugen spiser du slik eller kage?",
  },
  {
    crew: "Hvor mange tatoveringer overvejer du at få (eller har du allerede)?",
    imposter: "Hvor mange knogler har du brækket gennem tiden?",
  },
  {
    crew: "Hvor mange streamingtjenester betaler du for lige nu?",
    imposter: "Hvor mange abonnementer har du glemt at afmelde?",
  },
  {
    crew: "Hvor mange timer kan du maksimalt holde ud at være til en vild fest?",
    imposter: "Hvor mange timer drømmer du om at sove på en søndag?",
  },
  {
    crew: "Hvor mange gange om ugen kigger du dig grundigt i spejlet?",
    imposter: "Hvor mange gange om ugen stikker du en hvid løgn?",
  },
  {
    crew: "Hvor mange stueplanter har du dræbt det seneste år?",
    imposter: "Hvor mange bøger har du læst færdig i år?",
  },
  {
    crew: "Hvor mange børn drømmer du om at få (eller har du)?",
    imposter: "Hvor mange kæledyr ville du ønske, du havde plads til?",
  },
  {
    crew: "Hvor mange kilometer kan du løbe lige nu uden pause?",
    imposter: "Hvor mange kilometer har du cirka til dit arbejde eller studie?",
  },
  {
    crew: "Hvor mange gange i dit liv har du været rigtigt forelsket?",
    imposter: "Hvor mange gange har du skiftet frisure drastisk?",
  },
  {
    crew: "Hvor mange gange om måneden spiser du på restaurant?",
    imposter: "Hvor mange gange om måneden bager du noget fra bunden?",
  },
  {
    crew: "Hvor mange timer bruger du dagligt på sociale medier?",
    imposter: "Hvor mange timer ser du tv på en gennemsnitlig hverdagsaften?",
  },
  {
    crew: "Hvor mange gange om året er du typisk syg?",
    imposter: "Hvor mange gange om året holder du ferie i udlandet?",
  },
  {
    crew: "Hvor mange gange har du mistet din telefon?",
    imposter: "Hvor mange gange har du spærret dit dankort?",
  },
  {
    crew: "Hvor mange ex-kærester har du stadig kontakt med?",
    imposter: "Hvor mange af dine kollegaer ses du med privat?",
  },
  {
    crew: "Hvor mange timer bruger du typisk på at gøre rent om ugen?",
    imposter: "Hvor mange timer om ugen overvejer du at få en rengøringshjælp?",
  },

  // Farver i hverdagen
  {
    crew: "Hvilken farve har den tandbørste, du bruger lige nu?",
    imposter: "Hvilken farve er der mest af i din garderobe?",
  },
  {
    crew: "Hvilken farve har din absolutte yndlingstrøje?",
    imposter: "Hvilken farve har det sengetøj, du oftest sover i?",
  },
  {
    crew: "Hvilken farve er din yndlingskop derhjemme?",
    imposter: "Hvilken farve har din foretrukne vinterjakke?",
  },
  {
    crew: "Hvilken farve har sofaen hjemme i din stue?",
    imposter: "Hvilken farve drømmer du om at male dit soveværelse?",
  },
  {
    crew: "Hvilken farve ville du aldrig nogensinde tage på til en fest?",
    imposter: "Hvilken farve forbinder du allermest med stress?",
  },
  {
    crew: "Hvilken farve har de sko, du går mest i for tiden?",
    imposter: "Hvilken farve har din hverdagstaske eller rygsæk?",
  },
  {
    crew: "Hvilken farve beskriver bedst din personlighed?",
    imposter: "Hvilken farve forbinder du med ro og afslapning?",
  },
  {
    crew: "Hvilken farve har den bil, du oftest befinder dig i?",
    imposter: "Hvilken farve ville du vælge, hvis du skulle købe en sportsvogn?",
  },
  {
    crew: "Hvilken farve synes du, klæder dig allerbedst?",
    imposter: "Hvilken farve er det meste af dit undertøj?",
  },
  {
    crew: "Hvilken farve har stellet på din cykel?",
    imposter: "Hvilken farve har din hoveddør udenpå?",
  },

  // "Hvem i rummet..." (relationer og vurderinger)
  {
    crew: "Hvem i rummet er mest stædig under en diskussion?",
    imposter: "Hvem i rummet kommer oftest for sent til en aftale?",
  },
  {
    crew: "Hvem i rummet er den største flirt i byen?",
    imposter: "Hvem i rummet er mest tilbøjelig til at snuble over sine egne ben?",
  },
  {
    crew: "Hvem i rummet er absolut bedst til at holde en hemmelighed?",
    imposter: "Hvem i rummet vil du betegne som den mest loyale ven?",
  },
  {
    crew: "Hvem i rummet bruger flest penge på mærkevaretøj?",
    imposter: "Hvem i rummet har den dyreste smag, når det gælder mad?",
  },
  {
    crew: "Hvem i rummet ville overleve længst alene i ødemarken?",
    imposter: "Hvem i rummet er det største konkurrencemenneske i brætspil?",
  },
  {
    crew: "Hvem i rummet tager flest selfies på en bytur?",
    imposter: "Hvem i rummet er mest aktiv og synlig på Instagram?",
  },
  {
    crew: "Hvem i rummet er den mest kræsne, når I spiser ude?",
    imposter: "Hvem i rummet fryser altid og klager over kulden?",
  },
  {
    crew: "Hvem i rummet har generelt den dårligste musiksmag?",
    imposter: "Hvem i rummet tror du, synger højest (og falskest) i badet?",
  },
  {
    crew: "Hvem i rummet griner oftest på upassende tidspunkter?",
    imposter: "Hvem i rummet har den mest larmende og smitsomme latter?",
  },
  {
    crew: "Hvem i rummet starter oftest en joke, der falder til jorden?",
    imposter: "Hvem i rummet elsker sladder og drama allermest?",
  },
  {
    crew: "Hvem i rummet sover tungest og er umulig at vække?",
    imposter: "Hvem i rummet brokker sig mest over at være træt?",
  },
  {
    crew: "Hvem i rummet kunne realistisk set finde på at blive veganer i morgen?",
    imposter: "Hvem i rummet går mest op i at spise sundt?",
  },
  {
    crew: "Hvem i rummet bander allermest i hverdagen?",
    imposter: "Hvem i rummet har den korteste lunte i trafikken?",
  },
  {
    crew: "Hvem i rummet er den største romantiker?",
    imposter: "Hvem i rummet græder lettest under en sørgelig film?",
  },
  {
    crew: "Hvem i rummet giver generelt de bedste og mest modne råd?",
    imposter: "Hvem i rummet virker ældst af sind?",
  },
  {
    crew: "Hvem i rummet er den dårligste taber?",
    imposter: "Hvem i rummet kunne bedst finde på at snyde lidt i et spil?",
  },
  {
    crew: "Hvem i rummet bruger morgenen længst tid foran spejlet?",
    imposter: "Hvem i rummet går mest op i sin hudplejerutine?",
  },
  {
    crew: "Hvem i rummet ville du ringe til for at få hjælp til at samle et IKEA-skab?",
    imposter: "Hvem i rummet er mest praktisk anlagt med en skruemaskine?",
  },
  {
    crew: "Hvem i rummet kigger oftest på sin mobil, når I er samlet?",
    imposter: "Hvem i rummet er dårligst til at svare på beskeder?",
  },
  {
    crew: "Hvem i rummet drikker hurtigst sin øl eller drink?",
    imposter: "Hvem i rummet er mest tilbøjelig til at falde i søvn til festen?",
  },

  // Mad og drikke (subjektive præferencer)
  {
    crew: "Hvad er din absolutte livret, når du virkelig skal forkæles?",
    imposter: "Hvad bestiller du altid, når du har alvorlige tømmermænd?",
  },
  {
    crew: "Hvad er dit foretrukne pålæg på en flad rugbrødsmad?",
    imposter: "Hvad lugter allerværst i et køleskab?",
  },
  {
    crew: "Hvilken sodavand bestiller du oftest, hvis du er tørstig?",
    imposter: "Hvilken drik giver dig flest mavekneb?",
  },
  {
    crew: "Hvilken type ost kan du allerbedst lide?",
    imposter: "Hvad spiser du principielt aldrig, fordi konsistensen er klam?",
  },
  {
    crew: "Hvad er din faste go-to snack fredag aften?",
    imposter: "Hvad er den mest irriterende og larmende snack at sidde ved siden af i biografen?",
  },
  {
    crew: "Hvilken grøntsag fylder mest i dit køkken?",
    imposter: "Hvilken grøntsag piller du konsekvent ud af en ret?",
  },
  {
    crew: "Hvilken type is vælger du altid i vaffelbageriet?",
    imposter: "Hvad er den mest skuffende smag at finde i en æske chokolade?",
  },
  {
    crew: "Hvad drikker du allerhelst for at skyde en god fest i gang?",
    imposter: "Hvad drak du, da du kastede op efter en fest for første gang?",
  },
  {
    crew: "Hvilken type kage har du sværest ved at sige nej til?",
    imposter: "Hvad er den mest tørre og skuffende dessert, der findes?",
  },
  {
    crew: "Hvilken frugt synes du er allermest besværlig at skrælle eller spise?",
    imposter: "Hvilken frugt napper du oftest med på farten?",
  },
  {
    crew: "Hvad smører du typisk under dit pålæg?",
    imposter: "Hvad kunne du aldrig drømme om at putte i en burger?",
  },
  {
    crew: "Hvad er det absolut bedste at dyppe sine pommes frites i?",
    imposter: "Hvad smager overraskende godt på en pizza, selvom mange hader det?",
  },
  {
    crew: "Hvad spiser du oftest, hvis du spiser sen natmad?",
    imposter: "Hvad spiser du oftest til morgenmad på en stresset mandag?",
  },
  {
    crew: "Hvilken smagsvariant er din yndlings-te?",
    imposter: "Hvad smager mest af parfume og sæbe ifølge dine smagsløg?",
  },
  {
    crew: "Hvilket bær glæder du dig mest til om sommeren?",
    imposter: "Hvad fylder ofte alt for meget i en billig smoothie?",
  },
  {
    crew: "Hvilken fastfoodkæde er din svaghed?",
    imposter: "Hvor har du fået den dårligste madoplevelse for nylig?",
  },
  {
    crew: "Hvad spiser du oftest til frokost på en arbejdsdag?",
    imposter: "Hvad tager du med i madpakken, når du absolut ingen fantasi har?",
  },
  {
    crew: "Hvilken slags kød foretrækker du på grillen?",
    imposter: "Hvilket kødstykke synes du oftest bliver tørt og kedeligt?",
  },
  {
    crew: "Hvad er det dyreste, du plejer at bestille på en menu?",
    imposter: "Hvad spiser du, når det er sidst på måneden, og kontoen er tom?",
  },
  {
    crew: "Hvilken krydderurt bruger du oftest i din madlavning?",
    imposter: "Hvad smager konsekvent af jord ifølge dig?",
  },

  // Dyr, ting og associationer
  {
    crew: "Hvilket kæledyr synes du er det mest fantastiske selskab?",
    imposter: "Hvilket dyr lugter værst at have gående i et hjem?",
  },
  {
    crew: "Hvilket dyr er du allermest bange for at støde på?",
    imposter: "Hvilket dyr synes du, klammer sig mest desperat til sin ejer?",
  },
  {
    crew: "Hvilket vildt dyr fascinerer dig mest, når du ser naturprogrammer?",
    imposter: "Hvilket dyr ville du vælge som dit personlige åndedyr?",
  },
  {
    crew: "Hvilket insekt kan give dig det værste panikanfald?",
    imposter: "Hvilket krybdyr giver dig allermest myrekryb at se på?",
  },
  {
    crew: "Hvilket dyr minder dig om en gnaven, ældre mand?",
    imposter: "Hvilket dyr ser konstant træt og ugideligt ud?",
  },
  {
    crew: "Hvilket stykke tøj tager du absolut først på om morgenen?",
    imposter: "Hvad er det første stykke tøj, du smider, når du kommer træt hjem?",
  },
  {
    crew: "Hvad er den første app, du tjekker på din telefon hver morgen?",
    imposter: "Hvilken app stjæler allermest af din fritid generelt?",
  },
  {
    crew: "Hvilket møbel i dit hjem elsker du at slænge dig i?",
    imposter: "Hvor lægger du dig oftest for at slå mave efter et stort måltid?",
  },
  {
    crew: "Hvad glemmer du oftest at få med, når du stresser ud ad døren?",
    imposter: "Hvad har du oftest mistet eller glemt i byen på en fuld aften?",
  },
  {
    crew: "Hvad pakker du altid som det allervigtigste i din kuffert?",
    imposter: "Hvad er det mest overvurderede at slæbe med på ferie?",
  },
  {
    crew: "Hvad bruger du typisk til at vaske dit ansigt med?",
    imposter: "Hvad er den blødeste tekstil, du har liggende på dit badeværelse?",
  },
  {
    crew: "Hvad er det mest uundværlige redskab i hele dit køkken?",
    imposter: "Hvad er det farligste objekt at vaske op i hånden?",
  },
  {
    crew: "Hvad er den genstand på dit skrivebord, du rører alleroftest?",
    imposter: "Hvad samler helt ekstremt meget støv hjemme hos dig?",
  },
  {
    crew: "Hvad bruger du til at lukke larm ude, når du skal koncentrere dig?",
    imposter: "Hvad er dit dyreste stykke elektronik (udover din mobil)?",
  },
  {
    crew: "Hvilket smykke eller tilbehør bærer du stort set hver dag?",
    imposter: "Hvad er den mest personlige gave, du bærer på dig lige nu?",
  },

  // Steder, følelser og beskrivende ord
  {
    crew: "Hvilket ord beskriver bedst din nuværende sindstilstand?",
    imposter: "Hvilket ord beskriver bedst vejret udenfor netop nu?",
  },
  {
    crew: "Hvor i verden har du haft din allermest fantastiske ferie?",
    imposter: "Hvor drømmer du mest om at flygte hen lige nu?",
  },
  {
    crew: "Hvilket rum i dit hus synes du er det mest hyggelige?",
    imposter: "Hvor sætter du dig oftest for at fordybe dig i en god bog eller serie?",
  },
  {
    crew: "Hvilken by i Danmark synes du er den absolut smukkeste?",
    imposter: "Hvilken by vækker de stærkeste barndomsminder hos dig?",
  },
  {
    crew: "Hvilken årstid føler du dig mest frisk og produktiv i?",
    imposter: "Hvilken årstid synes du indbyder mest til lange, rolige gåture?",
  },
  {
    crew: "Hvilken ugedag føles konsekvent som ugens absolut længste?",
    imposter: "Hvilken ugedag er du oftest mest drænet for social energi?",
  },
  {
    crew: "Hvor på din krop er du allermest kilden?",
    imposter: "Hvor på kroppen er du oftest øm efter en lang, hård dag?",
  },
  {
    crew: "Hvilket ord beskriver bedst din arbejds- eller studieindsats i dag?",
    imposter: "Hvordan vil du med ét tillægsord beskrive din seneste bytur?",
  },
  {
    crew: "Hvilken overflade eller tekstur hader du at røre ved?",
    imposter: "Hvad er det mest ru og kradsende materiale, du ejer noget af?",
  },
  {
    crew: "Hvad er det absolut blødeste, du overhovedet kan forestille dig at røre ved?",
    imposter: "Hvad ligger dit hoved oftest på, når du virkelig skal koble af?",
  },
  {
    crew: "Hvilken specifik lugt minder dig øjeblikkeligt om din skoletid?",
    imposter: "Hvad er den mest syntetiske og kvalmende duft, du kender?",
  },
  {
    crew: "Hvor ville du bo, hvis du havde uendeligt mange penge?",
    imposter: "Hvor har du haft den mest luksuriøse oplevelse i dit liv?",
  },
  {
    crew: "Hvilket rum i dit hjem har det med at rode allermest?",
    imposter: "Hvor lægger du oftest breve og regninger, du ikke orker at åbne?",
  },
  {
    crew: "Hvor tager du hen, når du har brug for at være helt alene med dine tanker?",
    imposter: "Hvor i dit lokalområde føler du dig allermest afslappet?",
  },
  {
    crew: "Hvilket tillægsord beskriver bedst stemningen mandag morgen kl. 07:00?",
    imposter: "Hvordan har du det typisk i maven fem minutter inden en tandlægetid?",
  },
  {
    crew: "Hvor mange minutter er du om at trykke snoozeit om morgenen?",
    imposter: "Hvor mange minutter bruger du på at scrolle på mobilen før du står op?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at falde i søvn til en fest?",
    imposter: "Hvem i gruppen råber højest, når der synges karaoke?",
  },
  {
    crew: "Hvor mange uafsluttede projekter har du gang i lige nu?",
    imposter: "Hvor mange par usolgte sko har du stående bagerst i skabet?",
  },
  {
    crew: "Hvem i gruppen har den mest kaotiske kamerarulle på telefonen?",
    imposter: "Hvem i gruppen har flest uåbnede mails i sin indbakke?",
  },
  {
    crew: "Hvad er din største guilty pleasure-snack?",
    imposter: "Hvad spiser du altid, når ingen andre kigger?",
  },
  {
    crew: "Hvem i gruppen ville lade sig overtale til et faldskærmsudspring først?",
    imposter: "Hvem i gruppen ville gå i panik i et escape room?",
  },
  {
    crew: "Hvor mange dage i træk har du spist pizza eller fastfood?",
    imposter: "Hvor mange dåser energidrik drikker du på en hård uge?",
  },
  {
    crew: "Hvem i gruppen er den største dramadronning, når vedkommende er syg?",
    imposter: "Hvem i gruppen beklager sig mest over vejret?",
  },
  {
    crew: "Hvilken kendis ville du helst gå på date med?",
    imposter: "Hvilken kendis ville du mindst lide at strande i en elevator med?",
  },
  {
    crew: "Hvor mange stemmebeskeder sender du i gennemsnit om ugen?",
    imposter: "Hvor mange korte videoer sender du til venner om dagen?",
  },
  {
    crew: "Hvem i gruppen brænder oftest maden på?",
    imposter: "Hvem i gruppen smider mest mad ud?",
  },
  {
    crew: "Hvor mange abonnementer betaler du for uden at bruge dem?",
    imposter: "Hvor mange glemte ting har du liggende i bunden af din taske?",
  },
  {
    crew: "Hvem i gruppen ville flirte sig til en gratis drink i baren?",
    imposter: "Hvem i gruppen prutter mest ugenert i eget selskab?",
  },
  {
    crew: "Hvilket klichéfuldt realityshow ville du snige dig til at deltage i?",
    imposter: "Hvilket tv-program kan du absolut ikke holde ud at se i to minutter?",
  },
  {
    crew: "Hvor mange gange har du ladet som om du kender en på gaden?",
    imposter: "Hvor mange gange har du ladet som om du ikke hørte din alarm?",
  },
  {
    crew: "Hvem i gruppen har den mærkeligste vane derhjemme?",
    imposter: "Hvem i gruppen bruger længst tid på badeværelset?",
  },
  {
    crew: "Hvor mange tabte væddemål har du bag dig?",
    imposter: "Hvor mange dumme impulskøb har du foretaget i år?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at starte en modedille ved et uheld?",
    imposter: "Hvem i gruppen har den mest tvivlsomme musiksmag?",
  },
  {
    crew: "Hvor mange gange om måneden trykker du 'skip intro' på streamingtjenester?",
    imposter: "Hvor mange serieafsnit kan du kværne på én søndag?",
  },
  {
    crew: "Hvem i gruppen glemmer altid, hvor de har parkeret deres bil eller cykel?",
    imposter: "Hvem i gruppen leder altid efter sine nøgler i sidste øjeblik?",
  },
  {
    crew: "Hvor mange ubesvarede opkald har du haft på din mest travle dag?",
    imposter: "Hvor mange screenshots tager du på en uge?",
  },
  {
    crew: "Hvem i gruppen bruger de mest tåkrummende scorereplikker?",
    imposter: "Hvem i gruppen bliver hurtigst rød i hovedet?",
  },
  {
    crew: "Hvilken type fastfood ville du spise resten af livet?",
    imposter: "Hvilken tøjstil ville du nægte at bære for en million kroner?",
  },
  {
    crew: "Hvor mange gange har du sendt en besked til den forkerte person?",
    imposter: "Hvor mange gange har du set en besked uden at svare?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at blive smidt ud af et casino?",
    imposter: "Hvem i gruppen ville tage styringen under et kup?",
  },
  {
    crew: "Hvor mange timers søvn kræver du for at fungere om morgenen?",
    imposter: "Hvor mange kopper kaffe skal du have for at vågne ordentligt?",
  },
  {
    crew: "Hvem i gruppen har de sjoveste ansigtsudtryk under dyb koncentration?",
    imposter: "Hvem i gruppen taler højest i telefon i offentlig transport?",
  },
  {
    crew: "Hvor mange ting har du købt i genbrugsbutikker det seneste år?",
    imposter: "Hvor mange ubrugte gadgets ligger der i din skuffe?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at blive et internet-meme?",
    imposter: "Hvem i gruppen glemmer oftest navnet på folk, de lige har mødt?",
  },
  {
    crew: "Hvor mange gange har du glemt vådt tøj i vaskemaskinen?",
    imposter: "Hvor mange gange har du spist noget over udløbsdatoen?",
  },
  {
    crew: "Hvor mange gange om ugen spiser du i sengen?",
    imposter: "Hvor mange gange om ugen taber du din telefon på gulvet?",
  },
  {
    crew: "Hvem i gruppen ville først blive anholdt for en helt latterlig banal ting?",
    imposter: "Hvem i gruppen ville glemme sit eget pas på vej til lufthavnen?",
  },
  {
    crew: "Hvor mange glemte opgaver har du udskudt til sidste øjeblik i måneden?",
    imposter: "Hvor mange gange har du lades som om du var syg for at blive hjemme?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at overfaldsspise slik i smug?",
    imposter: "Hvem i gruppen lader sit batteri nå 1% før de lader op?",
  },
  {
    crew: "Hvor mange par sokker uden makker har du liggende i skuffen?",
    imposter: "Hvor mange tomme emballager står der i dit køkken lige nu?",
  },
  {
    crew: "Hvem i gruppen ville være mest pinlig på et dansegulv klokken tre om natten?",
    imposter: "Hvem i gruppen bruger flest emojis i en helt almindelig besked?",
  },
  {
    crew: "Hvor mange gange har du gået ud af døren med tøjet vrangen ud?",
    imposter: "Hvor mange gange har du gået ind i en lygtepæl mens du kiggede på mobilen?",
  },
  {
    crew: "Hvem i gruppen kunne finde på at bruge en hel weekend uden at se andre mennesker?",
    imposter: "Hvem i gruppen arrangerer altid de vildeste ture for vennerne?",
  },
  {
    crew: "Hvor mange uåbnede breve eller e-boksbeskeder har du stående?",
    imposter: "Hvor mange alarmer skal der til for at du tvinger dig selv op?",
  },
  {
    crew: "Hvem i gruppen har den mærkeligste samling af ting derhjemme?",
    imposter: "Hvem i gruppen har den mest kaotiske skrivebordsbaggrund?",
  },
  {
    crew: "Hvor mange gange om dagen tjekker du dit eget spejlbillede?",
    imposter: "Hvor mange gange om dagen tjekker du vejrappen?",
  },
  {
    crew: "Hvem i gruppen ville først lade sig overtale til at deltage i et realityshow?",
    imposter: "Hvem i gruppen ville glemme sin egen fødselsdag hvis ingen sagde noget?",
  },
  {
    crew: "Hvor mange ubrugte gavekort har du liggende i skuffen?",
    imposter: "Hvor mange stempler har du på dit yndlings-stempelkort?",
  },
  {
    crew: "Hvem i gruppen har den sjoveste grinelyd når de virkelig griner igennem?",
    imposter: "Hvem i gruppen nyser altid på den mest voldsomme måde?",
  },
  {
    crew: "Hvor mange gange har du ved et uheld sendt et screenshot til den person du tog screenshot af?",
    imposter: "Hvor mange gange har du skrevet en besked og fortrudt før du trykkede send?",
  },
  {
    crew: "Hvem i gruppen ville klare sig dårligst uden internet i et døgn?",
    imposter: "Hvem i gruppen ville gå i panik hvis strømmen gik i en time?",
  },
  {
    crew: "Hvor mange kopper halvfuld te eller kaffe lader du stå rundt omkring?",
    imposter: "Hvor mange flasker vand har du stående på dit natbord?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at bruge alle sine penge i den første uge af måneden?",
    imposter: "Hvem i gruppen prutter om prisen når de er på loppemarked?",
  },
  {
    crew: "Hvor mange gange har du lades som om du forstod en joke uden at fange den?",
    imposter: "Hvor mange gange har du grinet så meget at du mistede pusten i det forkerte øjeblik?",
  },
  {
    crew: "Hvem i gruppen lytter til den mest uventede og overraskende musik genre?",
    imposter: "Hvem i gruppen ser de mest mærkelige dokumentarprogrammer på tv?",
  },
  {
    crew: "Hvor mange gange har du prøvet at låse en dør op med den forkerte nøgle?",
    imposter: "Hvor mange gange har du gået forkert i et indkøbscenter?",
  },
  {
    crew: "Hvem i gruppen ville lade sig lokke til at spise en chili kun for opmærksomheden?",
    imposter: "Hvem i gruppen tager altid den sidste bid af maden uden at spørge?",
  },
  {
    crew: "Hvor mange gange har du spildt kaffe eller mad ud over dit rene tøj?",
    imposter: "Hvor mange gange har du trådt i en tyggegummi på gaden?",
  },
  {
    crew: "Hvem i gruppen har den sjoveste adfærd efter to øl eller et glas vin?",
    imposter: "Hvem i gruppen falder altid i søvn i sofaen før filmen er slut?",
  },
  {
    crew: "Hvor mange gange har du prøvet at skubbe til en dør hvor der stod træk?",
    imposter: "Hvor mange gange har du vinket tilbage til en person der vinkede til nogen bag dig?",
  },
  {
    crew: "Hvem i gruppen bruger de mærkeligste talemåder i dagligdagen?",
    imposter: "Hvem i gruppen retter altid på folks grammatik når de taler?",
  },
  {
    crew: "Hvor mange uåbnede emballager har du i dine badeværelsesskabe?",
    imposter: "Hvor mange halve shampoo flasker står der i din bruser?",
  },
  {
    crew: "Hvem i gruppen ville klare sig bedst som stand-up komiker?",
    imposter: "Hvem i gruppen fortæller de mest langstrakte og mærkelige historier?",
  },
  {
    crew: "Hvor mange gange har du spist aftensmad foran tv'et denne uge?",
    imposter: "Hvor mange gange har du bestilt takeaway fordi du ikke gad vaske op?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at købe en helt ubrugelig ting på nettet klokken tre om natten?",
    imposter: "Hvem i gruppen lader sig lettest overtale af en telefonsælger?",
  },
  {
    crew: "Hvor mange tabte genstande har du genfundet i bunden af dit køleskab?",
    imposter: "Hvor mange poser frysevarer har du liggende som du har glemt hvad er?",
  },
  {
    crew: "Hvem i gruppen ville hurtigst fare vild i sin egen hjemby uden GPS?",
    imposter: "Hvem i gruppen kan slet ikke finde vej uden kort på mobilen?",
  },
  {
    crew: "Hvor mange gange om ugen glemmer du hvad du gik ind i et rum for?",
    imposter: "Hvor mange gange om ugen glemmer du hvad du skulle til at søge på på Google?",
  },
  {
    crew: "Hvem i gruppen ville være den mest uorganiserede rejseleder på en ferie?",
    imposter: "Hvem i gruppen pakker sin kuffert mere end en uge før afrejse?",
  },
  {
    crew: "Hvor mange gange har du ladet telefonen op i bilen fordi du glemte det derhjemme?",
    imposter: "Hvor mange gange har du lånt en oplader og aldrig afleveret den tilbage?",
  },
  {
    crew: "Hvem i gruppen ville lade sig friste af et hurtigt lån til en spontan rejse?",
    imposter: "Hvem i gruppen har den tætteste sparerutine i hele selskabet?",
  },
  {
    crew: "Hvor mange solbriller har du knækket eller mistet i dit liv?",
    imposter: "Hvor mange paraplyer har du glemt i bussen eller toget?",
  },
  {
    crew: "Hvem i gruppen ville være den mest dramatiske under et brætspil?",
    imposter: "Hvem i gruppen jubler højest når de vinder et simpelt spil?",
  },
  {
    crew: "Hvor mange gange har du prøvet at betale med det forkerte kort i butikken?",
    imposter: "Hvor mange gange har du glet din pinkode og spærret dit kort?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at blive venner med betjeningen på en restaurant?",
    imposter: "Hvem i gruppen stiller flest mærkelige spørgsmål til menukortet?",
  },
  {
    crew: "Hvor mange gange har du ladet som om du sov for at undgå at rydde op?",
    imposter: "Hvor mange gange har du lades som om du havde travlt for at undgå en aftale?",
  },
  {
    crew: "Hvem i gruppen ville først glemme navnet på hovedpersonen i en film de lige har set?",
    imposter: "Hvem i gruppen spoiler altid slutningen på en film ved et uheld?",
  },
  {
    crew: "Hvor mange uåbnede pakker med madvarer har du i skabet som er for gamle?",
    imposter: "Hvor mange krydderier har du stående som du kun har brugt én gang?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at gå i panik over en lille edderkop?",
    imposter: "Hvem i gruppen råber højest hvis der kommer en hveps forbi bordet?",
  },
  {
    crew: "Hvor mange gange har du ved et uheld ringet til nogen op fra lommen?",
    imposter: "Hvor mange gange har du sendt en mærkelig besked pga. autokorrektur?",
  },
  {
    crew: "Hvem i gruppen ville hurtigst opgive at samle et IKEA-møbel og ringe efter hjælp?",
    imposter: "Hvem i gruppen har flest ubrugte skruer tilovers efter samling af møbler?",
  },
  {
    crew: "Hvor mange gange har du prøvet at åbne en bil der ikke var din?",
    imposter: "Hvor mange gange har du sat dig ind i den forkerte bil på en parkeringsplads?",
  },
  {
    crew: "Hvem i gruppen tager altid de mest akavede poseringer på fotos?",
    imposter: "Hvem i gruppen kræver altid at billedet skal tages om fire gange?",
  },
  {
    crew: "Hvor mange gange om måneden glemmer du at tage din genanvendelige indkøbspose med?",
    imposter: "Hvor mange plastikposer har du stoppet ind i en anden plastikpose derhjemme?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at bruge alle sine mobildata før måneden er omme?",
    imposter: "Hvem i gruppen spørger altid efter wi-fi-koden det øjeblik de træder ind i et rum?",
  },
  {
    crew: "Hvor mange ubesvarede beskeder har du liggende fra din mor eller far?",
    imposter: "Hvor mange gruppechats har du sat på 'lydløs' i din besked-app?",
  },
  {
    crew: "Hvem i gruppen ville være den værste til at holde en tale til et bryllup?",
    imposter: "Hvem i gruppen begynder altid at græde først til følelsesladede film?",
  },
  {
    crew: "Hvor mange gange har du købt noget tøj fordi det var på tilbud og aldrig brugt det?",
    imposter: "Hvor mange tøjstykker ligger i dit skab med prismærket på endnu?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at tabe mad på gulvet og spise det alligevel?",
    imposter: "Hvem i gruppen er mest bange for bakterier i offentlige rum?",
  },
  {
    crew: "Hvor mange gange har du glemt at slukke lyset da du gik fra din bolig?",
    imposter: "Hvor mange gange har du tjekket om komfuret var slukket mere end tre gange?",
  },
  {
    crew: "Hvem i gruppen har den mest uforståelige håndskrift i hele selskabet?",
    imposter: "Hvem i gruppen tegner de mærkeligste kruseduller under et telefonmøde?",
  },
  {
    crew: "Hvor mange gange har du tabt noget ned bag sofaen og ladet det ligge?",
    imposter: "Hvor mange glemte mønter har du fundet i bunden af vaskemaskinen?",
  },
  {
    crew: "Hvem i gruppen ville først melde sig til en vild overlevelsesudfordring i tv?",
    imposter: "Hvem i gruppen klager mest over komforten når I er på tur?",
  },
  {
    crew: "Hvor mange gange har du oprettet en ny konto fordi du glemte din adgangskode?",
    imposter: "Hvor mange gange har du brugt '1234' eller din fødselsdag som kode?",
  },
  {
    crew: "Hvem i gruppen ville lade sig overtale til at tage en spontan tatovering i en kaffepause?",
    imposter: "Hvem i gruppen har den skøreste historie bag et af sine ar?",
  },
  {
    crew: "Hvor mange gange har du skruet helt op for musikken i bilen og sunget med af fulde hals?",
    imposter: "Hvor mange gange har du danset foran spejlet derhjemme når ingen kiggede?",
  },
  {
    crew: "Hvem i gruppen ville være den første til at bruge alle sine penge på gourmetmad?",
    imposter: "Hvem i gruppen spiser altid den samme ret hver eneste gang I er ude?",
  },
  {
    crew: "Hvor mange uåbnede læsestof eller magasiner har du liggende på bordet?",
    imposter: "Hvor mange bøger har du startet på uden nogensinde at læse dem færdig?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at komme med en helt vanvittig bortforklaring?",
    imposter: "Hvem i gruppen afslører altid sig selv ved at begynde at fnise når de lyver?",
  },
  {
    crew: "Hvor mange gange har du tabt dine høretelefoner ned på gulvet i løbet af en uge?",
    imposter: "Hvor mange gange har du ledt efter dine briller eller solbriller mens de sad på hovedet?",
  },
  {
    crew: "Hvem i gruppen ville klare sig dårligst i et stumt skuespil uden ord?",
    imposter: "Hvem i gruppen bruger flest fagter med hænderne når de forklarer noget?",
  },
  {
    crew: "Hvor mange gange har du prøvet at tage et pænt billede af din mad til sociale medier?",
    imposter: "Hvor mange gange har du rettet på lyset i et rum for at lave det perfekte foto?",
  },
  {
    crew: "Hvem i gruppen er mest tilbøjelig til at tabe sit nøglebundt ned i et kloakgitter?",
    imposter: "Hvem i gruppen har flest nøgleringe siddende på sit nøglebundt?",
  },
  {
    crew: "Hvor mange gange har du drukket mælk direkte fra kartonen derhjemme?",
    imposter: "Hvor mange gange har du spist is direkte fra bøtten med en spiseske?",
  },
  {
    crew: "Hvem i gruppen ville være den hurtigste til at kede sig på en strandferie?",
    imposter: "Hvem i gruppen kan ligge i en liggestol en hel uge uden at lave noget som helst?",
  },

  // ——— Hvilken / Hvilket: farver, ting og valg ———
  { crew: "Hvilken farve har den trøje, du bruger allermest?", imposter: "Hvilken farve har det håndklæde, du helst tager?" },
  { crew: "Hvilken farve maler du helst en væg derhjemme?", imposter: "Hvilken farve ville du aldrig vælge til en bil?" },
  { crew: "Hvilken farve får dig i bedst humør?", imposter: "Hvilken farve forbinder du med at være træt?" },
  { crew: "Hvilken farve har det meste af dit tøj?", imposter: "Hvilken farve mangler du helt i skabet?" },
  { crew: "Hvilken farve havde dit værelse som barn?", imposter: "Hvilken farve havde din første cykel?" },
  { crew: "Hvilket dyr ville du helst være i et døgn?", imposter: "Hvilket dyr minder du mest om, når du er træt?" },
  { crew: "Hvilket dyr synes du er mest overvurderet?", imposter: "Hvilket dyr bliver du mest utryg ved?" },
  { crew: "Hvilket kæledyr ville du aldrig have?", imposter: "Hvilket dyr ville du helst passe en uge?" },
  { crew: "Hvilket dyr ville du helst møde i en skov?", imposter: "Hvilket dyr ville du nødigst møde i vandet?" },
  { crew: "Hvilken årstid passer bedst til dit humør?", imposter: "Hvilken årstid får dig til at rydde op?" },
  { crew: "Hvilken måned er den bedste i året?", imposter: "Hvilken måned føles allerlængst?" },
  { crew: "Hvilken ugedag er din bedste?", imposter: "Hvilken ugedag går langsomst?" },
  { crew: "Hvilken ugedag laver du mest hjemme?", imposter: "Hvilken ugedag holder du helst helt fri?" },
  { crew: "Hvilket måltid på dagen betyder mest for dig?", imposter: "Hvilket måltid springer du oftest over?" },
  { crew: "Hvilken ret laver du, når du skal imponere?", imposter: "Hvilken ret laver du, når du er alene hjemme?" },
  { crew: "Hvilken ret minder dig mest om din barndom?", imposter: "Hvilken ret spiste du alt for meget af som barn?" },
  { crew: "Hvilken frugt spiser du oftest?", imposter: "Hvilken frugt køber du og glemmer at spise?" },
  { crew: "Hvilken grøntsag kan du bedst lide?", imposter: "Hvilken grøntsag skubber du til side?" },
  { crew: "Hvilken slags kage vælger du på en café?", imposter: "Hvilken slags is vælger du en varm dag?" },
  { crew: "Hvilken drik starter din dag?", imposter: "Hvilken drik slutter din aften?" },
  { crew: "Hvilket krydderi bruger du mest?", imposter: "Hvilket krydderi tør du ikke bruge for meget af?" },
  { crew: "Hvilket møbel i dit hjem ville du redde først?", imposter: "Hvilket møbel trænger mest til at blive skiftet?" },
  { crew: "Hvilket rum gør du sjældnest rent?", imposter: "Hvilket rum bruger du mest tid i?" },
  { crew: "Hvilket sted i dit hjem samler mest rod?", imposter: "Hvilken skuffe tør du ikke åbne for gæster?" },
  { crew: "Hvilket redskab i køkkenet kunne du ikke undvære?", imposter: "Hvilket redskab har du købt og aldrig brugt?" },
  { crew: "Hvilket stykke tøj har du haft længst?", imposter: "Hvilket stykke tøj burde du have smidt ud?" },
  { crew: "Hvilke sko går du oftest med?", imposter: "Hvilke sko står bare og fylder?" },
  { crew: "Hvilket tal ville du vælge til en lodseddel?", imposter: "Hvilket tal dukker altid op i dit liv?" },
  { crew: "Hvilket bogstav synes du er pænest?", imposter: "Hvilket bogstav har du sværest ved at skrive pænt?" },
  { crew: "Hvilket ord bruger du alt for tit?", imposter: "Hvilket ord siger du, når noget går galt?" },
  { crew: "Hvilket ord beskriver din uge indtil nu?", imposter: "Hvilket ord beskriver din morgen i dag?" },
  { crew: "Hvilket ord vil du gerne høre oftere?", imposter: "Hvilket ord er du træt af at høre?" },
  { crew: "Hvilken lyd hader du mest?", imposter: "Hvilken lyd falder du bedst i søvn til?" },
  { crew: "Hvilken duft minder dig om jul?", imposter: "Hvilken duft minder dig om sommer?" },
  { crew: "Hvilken by kunne du bo i resten af livet?", imposter: "Hvilken by ville du gerne besøge igen?" },
  { crew: "Hvilket land står øverst på din rejseliste?", imposter: "Hvilket land ville du nødigt bo i?" },
  { crew: "Hvilket transportmiddel bruger du helst?", imposter: "Hvilket transportmiddel undgår du?" },
  { crew: "Hvilken sæson på året koster dig flest penge?", imposter: "Hvilken måned er hårdest for din økonomi?" },
  { crew: "Hvilken app åbner du flest gange om dagen?", imposter: "Hvilken app burde du slette?" },
  { crew: "Hvilken slags film vælger du en fredag aften?", imposter: "Hvilken slags musik sætter du på, når du gør rent?" },
  { crew: "Hvilket instrument ville du helst kunne spille?", imposter: "Hvilket instrument lyder værst i utrænede hænder?" },
  { crew: "Hvilken sport ville du helst prøve?", imposter: "Hvilken sport gider du slet ikke se?" },
  { crew: "Hvilket brætspil ender altid i skænderi?", imposter: "Hvilket spil er du bedst til?" },
  { crew: "Hvilken superkraft ville du vælge?", imposter: "Hvilken superkraft ville være mest ubrugelig?" },
  { crew: "Hvilket job ville du aldrig kunne holde ud?", imposter: "Hvilket job så du dig selv i som barn?" },
  { crew: "Hvilken fest på året glæder du dig mest til?", imposter: "Hvilken fest kunne du godt undvære?" },
  { crew: "Hvilken gave ville du blive gladest for?", imposter: "Hvilken gave giver du oftest til andre?" },
  { crew: "Hvilken vane ville du helst af med?", imposter: "Hvilken vane er du faktisk stolt af?" },
  { crew: "Hvilket vejr passer bedst til din bedste dag?", imposter: "Hvilket vejr ødelægger dine planer oftest?" },
  { crew: "Hvilken planet ville du besøge?", imposter: "Hvilket sted på Jorden virker mest fremmed?" },

  // ——— Hvad er det første / sidste ———
  { crew: "Hvad er det første, du gør, når du vågner?", imposter: "Hvad er det sidste, du gør, før du sover?" },
  { crew: "Hvad er det første, du pakker i en kuffert?", imposter: "Hvad er det sidste, du husker at pakke?" },
  { crew: "Hvad er det første, du kigger efter i et supermarked?", imposter: "Hvad er det sidste, du lægger i kurven?" },
  { crew: "Hvad er det første, du siger til en fremmed?", imposter: "Hvad er det første, du lægger mærke til hos folk?" },
  { crew: "Hvad er det første, du gør, når du kommer hjem?", imposter: "Hvad er det første, du gør, når du har fri?" },
  { crew: "Hvad er det første, du rydder op?", imposter: "Hvad er det sidste, du får ryddet op?" },
  { crew: "Hvad er det første, du tjekker om morgenen?", imposter: "Hvad er det første, du glemmer om morgenen?" },
  { crew: "Hvad er det første, du bestiller på en restaurant?", imposter: "Hvad er det første, du bestiller i en bar?" },
  { crew: "Hvad er det sidste, du købte til dig selv?", imposter: "Hvad er det sidste, du fortrød at købe?" },
  { crew: "Hvad er det sidste, du grinede rigtig meget af?", imposter: "Hvad er det sidste, der irriterede dig?" },
  { crew: "Hvad er det første, du gør ved en ny telefon?", imposter: "Hvad er det første, du sætter op på en ny computer?" },
  { crew: "Hvad er det første, du gør på en ferie?", imposter: "Hvad er det sidste, du gør inden hjemrejsen?" },

  // ——— Hvad ville du ———
  { crew: "Hvad ville du spise til dit sidste måltid?", imposter: "Hvad ville du servere for en vigtig gæst?" },
  { crew: "Hvad ville du tage med på en øde ø?", imposter: "Hvad ville du savne mest på en øde ø?" },
  { crew: "Hvad ville du bruge en uventet million på?", imposter: "Hvad ville du købe, hvis penge var lige meget?" },
  { crew: "Hvad ville du gerne være bedre til?", imposter: "Hvad er du hemmeligt ret god til?" },
  { crew: "Hvad ville du gøre på en helt fri dag?", imposter: "Hvad ville du gøre, hvis alle aflyste på dig?" },
  { crew: "Hvad ville du redde ud af et brændende hus?", imposter: "Hvad ville du savne mest, hvis du mistede alt?" },
  { crew: "Hvad ville du sige til dig selv som teenager?", imposter: "Hvad ville du advare et barn om?" },
  { crew: "Hvad ville du aldrig spise, uanset hvad?", imposter: "Hvad har du prøvet én gang og aldrig igen?" },
  { crew: "Hvad ville du tage med til en ubeboet hytte?", imposter: "Hvad ville du efterlade hjemme uden at tænke over det?" },
  { crew: "Hvad ville du gøre først, hvis du vandt i lotto?", imposter: "Hvad ville du gøre, hvis du fik en måned fri?" },

  // ——— Hvad er ... (holdning og vane) ———
  { crew: "Hvad er din bedste undskyldning for at komme for sent?", imposter: "Hvad er din bedste undskyldning for at aflyse?" },
  { crew: "Hvad er din største tidsrøver?", imposter: "Hvad bruger du mere tid på, end du vil indrømme?" },
  { crew: "Hvad er din værste madvane?", imposter: "Hvad er din bedste sundhedsvane?" },
  { crew: "Hvad er dit bedste trick til at falde i søvn?", imposter: "Hvad hjælper dig med at vågne rigtigt?" },
  { crew: "Hvad er det mest overvurderede måltid?", imposter: "Hvad er den mest undervurderede snack?" },
  { crew: "Hvad er den bedste lyd i verden?", imposter: "Hvad er den mest beroligende ting at kigge på?" },
  { crew: "Hvad er det bedste ved en mandag?", imposter: "Hvad er det bedste ved en søndag?" },
  { crew: "Hvad er dit yndlingssted derhjemme?", imposter: "Hvad er dit yndlingssted udenfor?" },
  { crew: "Hvad er det mest unødvendige, du ejer?", imposter: "Hvad er det mest nyttige, du har købt?" },
  { crew: "Hvad er din største luksus i hverdagen?", imposter: "Hvad sparer du bevidst på?" },
  { crew: "Hvad er den bedste gave, du har fået?", imposter: "Hvad er den bedste gave, du har givet?" },
  { crew: "Hvad er det sværeste ved at være voksen?", imposter: "Hvad savner du mest ved at være barn?" },
  { crew: "Hvad er dit bedste råd til en ny kollega?", imposter: "Hvad ville du sige til en, der starter forfra?" },
  { crew: "Hvad er det pinligste, du har på din telefon?", imposter: "Hvad ville du slette først, hvis nogen kiggede med?" },
  { crew: "Hvad er dit mest ubrugelige talent?", imposter: "Hvad kan du, som overrasker folk?" },

  // ——— Hvornår / tidspunkter ———
  { crew: "Hvornår på dagen har du mest energi?", imposter: "Hvornår på dagen falder du helt sammen?" },
  { crew: "Hvornår gik du sidst i seng før klokken ti?", imposter: "Hvornår stod du sidst op før klokken seks?" },
  { crew: "Hvornår spiser du typisk aftensmad?", imposter: "Hvornår spiser du typisk din frokost?" },
  { crew: "Hvornår begynder din weekend rigtigt?", imposter: "Hvornår slutter din weekend i hovedet?" },
  { crew: "Hvornår tjekker du din telefon første gang?", imposter: "Hvornår lægger du den sidste gang fra dig?" },
  { crew: "Hvornår begynder du at tænke på julen?", imposter: "Hvornår begynder du at glæde dig til sommeren?" },
  { crew: "Hvornår ringer dit vækkeur på en hverdag?", imposter: "Hvornår står du faktisk op?" },
  { crew: "Hvornår trænede du sidst?", imposter: "Hvornår gik du sidst en rigtig lang tur?" },

  // ——— Hvor lang tid / varighed (tal-svar) ———
  { crew: "Hvor lang tid bruger du i badet om morgenen?", imposter: "Hvor lang tid bruger du på at vælge tøj?" },
  { crew: "Hvor lang tid tager din vej på arbejde?", imposter: "Hvor lang tid bruger du på frokostpausen?" },
  { crew: "Hvor lang tid kan du holde ud at stå i kø?", imposter: "Hvor lang tid venter du på et svar, før du skriver igen?" },
  { crew: "Hvor lang tid går der, før du besvarer en mail?", imposter: "Hvor lang tid går der, før du rydder op efter maden?" },
  { crew: "Hvor lang tid holder du en telefon, før du skifter?", imposter: "Hvor lang tid beholder du et par sko?" },
  { crew: "Hvor lang tid bruger du på at lave aftensmad?", imposter: "Hvor lang tid bruger du på at spise den?" },

  // ——— Hvor gammel (tal-svar) ———
  { crew: "Hvor gammel var du, da du lærte at cykle?", imposter: "Hvor gammel var du, da du lærte at svømme?" },
  { crew: "Hvor gammel var du, da du flyttede hjemmefra?", imposter: "Hvor gammel var du, da du fik dit første job?" },
  { crew: "Hvor gammel føler du dig indeni?", imposter: "Hvor gammel tror folk, du er?" },
  { crew: "Hvor gammel var du, da du første gang rejste alene?", imposter: "Hvor gammel var du, da du første gang lavede mad selv?" },

  // ——— Hvor mange (tal-svar, nye vinkler) ———
  { crew: "Hvor mange vækkeure sætter du om aftenen?", imposter: "Hvor mange gange trykker du snooze?" },
  { crew: "Hvor mange kopper står der på dit skrivebord nu?", imposter: "Hvor mange glas har du stående i soveværelset?" },
  { crew: "Hvor mange ubetalte regninger ligger og venter?", imposter: "Hvor mange ulæste mails har du?" },
  { crew: "Hvor mange par sokker har du uden makker?", imposter: "Hvor mange stykker tøj mangler en knap?" },
  { crew: "Hvor mange gange om ugen spiser du take-away?", imposter: "Hvor mange gange om ugen laver du mad fra bunden?" },
  { crew: "Hvor mange nøgler har du på dit nøglebundt?", imposter: "Hvor mange af dem ved du hvad går til?" },
  { crew: "Hvor mange planter har du derhjemme?", imposter: "Hvor mange af dem er du ved at slå ihjel?" },
  { crew: "Hvor mange bøger har du liggende ulæste?", imposter: "Hvor mange serier er du gået i stå i?" },
  { crew: "Hvor mange gange flyttede du som barn?", imposter: "Hvor mange skoler nåede du at gå på?" },
  { crew: "Hvor mange minutter for tidligt møder du typisk op?", imposter: "Hvor mange minutter for sent kommer du typisk?" },

  // ——— Hvem i gruppen (nye vinkler) ———
  { crew: "Hvem i gruppen ville klare sig længst uden telefon?", imposter: "Hvem i gruppen ville overleve længst i en skov?" },
  { crew: "Hvem i gruppen ville græde først til en trist film?", imposter: "Hvem i gruppen griner mest upassende?" },
  { crew: "Hvem i gruppen ville glemme sit eget pas?", imposter: "Hvem i gruppen ville komme for sent til flyet?" },
  { crew: "Hvem i gruppen ville sige ja til hvad som helst?", imposter: "Hvem i gruppen siger nej til det meste?" },
  { crew: "Hvem i gruppen har det pæneste hjem?", imposter: "Hvem i gruppen har det største rod i bilen?" },
  { crew: "Hvem i gruppen ville blive rig først?", imposter: "Hvem i gruppen bruger flest penge på en måned?" },
  { crew: "Hvem i gruppen ville klare en eksamen uden at læse?", imposter: "Hvem i gruppen bluffer sig bedst igennem?" },
  { crew: "Hvem i gruppen ville tage sig af alle andre?", imposter: "Hvem i gruppen har mest brug for at blive passet på?" },
  { crew: "Hvem i gruppen taler mest i telefon?", imposter: "Hvem i gruppen svarer langsomst på beskeder?" },
  { crew: "Hvem i gruppen kender flest mennesker?", imposter: "Hvem i gruppen falder lettest i snak med fremmede?" },
  { crew: "Hvem i gruppen ville vinde en dansekonkurrence?", imposter: "Hvem i gruppen ville tage mikrofonen først?" },
  { crew: "Hvem i gruppen ville sove længst en lørdag?", imposter: "Hvem i gruppen står tidligst op i en ferie?" },

  // ——— Hverdag og rutiner ———
  { crew: "Hvad spiser du oftest til morgenmad?", imposter: "Hvad drikker du altid om morgenen?" },
  { crew: "Hvilken side af sengen sover du på?", imposter: "Hvilken side af sofaen sidder du altid i?" },
  { crew: "Hvad har du altid i lommen?", imposter: "Hvad har du altid i tasken?" },
  { crew: "Hvad glemmer du oftest, når du går hjemmefra?", imposter: "Hvad tjekker du altid to gange?" },
  { crew: "Hvor mange gange om ugen støvsuger du?", imposter: "Hvor mange gange om ugen vasker du tøj?" },
  { crew: "Hvad gør du, mens du børster tænder?", imposter: "Hvad gør du, mens du venter på kaffen?" },
  { crew: "Hvilket husarbejde hader du mest?", imposter: "Hvilket husarbejde finder du faktisk afslappende?" },
  { crew: "Hvad ligger der i din bilrude lige nu?", imposter: "Hvad ligger der under din seng?" },
  { crew: "Hvor mange gange tjekker du komfuret, inden du går?", imposter: "Hvor mange gange rykker du i døren?" },
  { crew: "Hvad er din faste bestilling på en café?", imposter: "Hvad er din faste bestilling på en burgerbar?" },
  { crew: "Hvilken rutine kunne du aldrig droppe?", imposter: "Hvilken rutine er du lige holdt op med?" },
  { crew: "Hvad hører du på vej på arbejde?", imposter: "Hvad hører du, når du træner?" },
  { crew: "Hvad laver du, når du ikke kan sove?", imposter: "Hvad laver du, når du ikke kan falde til ro?" },
  { crew: "Hvilken dag i ugen handler du ind?", imposter: "Hvilken dag i ugen gør du rent?" },
  { crew: "Hvad er det sværeste ved at stå op om vinteren?", imposter: "Hvad er det bedste ved at komme hjem i mørke?" },
  { crew: "Hvad tager du med, når du går en tur?", imposter: "Hvad tager du med i en madpakke?" },
  { crew: "Hvor mange alarmer har du i din telefon?", imposter: "Hvor mange påmindelser bruger du om ugen?" },
  { crew: "Hvad putter du på dit rugbrød?", imposter: "Hvad putter du på din morgenmad?" },
  { crew: "Hvad drikker du, når du er syg?", imposter: "Hvad spiser du, når du er trist?" },
  { crew: "Hvilket rum går du først ind i derhjemme?", imposter: "Hvilket rum lukker du helst døren til?" },

  // ——— Følelser og reaktioner ———
  { crew: "Hvad gør dig altid i godt humør?", imposter: "Hvad kan ødelægge din dag på et sekund?" },
  { crew: "Hvad gør du, når du bliver rigtig vred?", imposter: "Hvad gør du, når du bliver rigtig nervøs?" },
  { crew: "Hvilken følelse har du sværest ved at vise?", imposter: "Hvilken følelse skjuler du bedst?" },
  { crew: "Hvad får dig til at græde af glæde?", imposter: "Hvad får dig til at grine, når du ikke må?" },
  { crew: "Hvad beroliger dig hurtigst?", imposter: "Hvad stresser dig hurtigst?" },
  { crew: "Hvilket ord beskriver dig, når du er sulten?", imposter: "Hvilket ord beskriver dig, når du er træt?" },
  { crew: "Hvad er du mest taknemmelig for lige nu?", imposter: "Hvad glæder du dig allermest til?" },
  { crew: "Hvad gør du, når nogen roser dig?", imposter: "Hvad gør du, når nogen kritiserer dig?" },
  { crew: "Hvem ringer du til, når det brænder på?", imposter: "Hvem skriver du til, når du keder dig?" },
  { crew: "Hvad er du mest bange for at miste?", imposter: "Hvad er du mest bange for at glemme?" },
  { crew: "Hvad gør dig flov på andres vegne?", imposter: "Hvad gør dig stolt på andres vegne?" },
  { crew: "Hvad kan få dig til at holde op med at brokke dig?", imposter: "Hvad kan altid trøste dig?" },

  // ——— Venner, familie og relationer ———
  { crew: "Hvem i din familie ligner du mest?", imposter: "Hvem i din familie er du mest uenig med?" },
  { crew: "Hvem ville du tage med på en lang køretur?", imposter: "Hvem ville du dele et hotelværelse med?" },
  { crew: "Hvem ville du ringe til midt om natten?", imposter: "Hvem ville du bede om at låne penge?" },
  { crew: "Hvem kender dig bedst?", imposter: "Hvem overrasker dig oftest?" },
  { crew: "Hvem i din omgangskreds giver de bedste råd?", imposter: "Hvem fortæller de bedste historier?" },
  { crew: "Hvem har lært dig mest om livet?", imposter: "Hvem har lært dig noget praktisk, du bruger tit?" },
  { crew: "Hvem ville du helst bytte hverdag med i en uge?", imposter: "Hvem ville du helst arbejde sammen med?" },
  { crew: "Hvem siger du oftest godnat til?", imposter: "Hvem taler du oftest med i telefon?" },
  { crew: "Hvem skylder du at ringe til?", imposter: "Hvem savner du at se noget mere?" },
  { crew: "Hvem i gruppen minder mest om dig?", imposter: "Hvem i gruppen er din modsætning?" },
  { crew: "Hvem ville du vælge på dit hold i en gætteleg?", imposter: "Hvem ville du helst have på dit hold i sport?" },
  { crew: "Hvem ville du stole på med din adgangskode?", imposter: "Hvem ville du give en nøgle til dit hjem?" },

  // ——— Mad og drikke ———
  { crew: "Hvad er din yndlingssnack om aftenen?", imposter: "Hvad er din yndlingssnack i biografen?" },
  { crew: "Hvad bestiller du altid til take-away?", imposter: "Hvad bestiller du, når du ikke kan bestemme dig?" },
  { crew: "Hvilket pålæg er bedst?", imposter: "Hvilket pålæg ryger sidst ud af køleskabet?" },
  { crew: "Hvad putter du i din kaffe?", imposter: "Hvad putter du i din te?" },
  { crew: "Hvilken slags ost vælger du?", imposter: "Hvilken slags brød køber du oftest?" },
  { crew: "Hvad laver du, når køleskabet er tomt?", imposter: "Hvad køber du altid for meget af?" },
  { crew: "Hvilken mad kan du spise hver dag?", imposter: "Hvilken mad bliver du hurtigt træt af?" },
  { crew: "Hvad er den mærkeligste ting, du har spist?", imposter: "Hvad er det bedste, du har fået på en ferie?" },
  { crew: "Hvilken sovs hører til kartofler?", imposter: "Hvilket tilbehør skal der altid være?" },
  { crew: "Hvad drikker du til en festmiddag?", imposter: "Hvad drikker du til en almindelig hverdag?" },
  { crew: "Hvilken slik ville du vælge fra en blandet pose?", imposter: "Hvilken slik lader du altid ligge?" },
  { crew: "Hvad spiser du, når du kommer sent hjem?", imposter: "Hvad spiser du dagen efter en fest?" },
  { crew: "Hvilken ret vil du aldrig lære at lave?", imposter: "Hvilken ret kan du lave i søvne?" },
  { crew: "Hvor mange retter kan du lave uden opskrift?", imposter: "Hvor mange gange bruger du den samme opskrift?" },

  // ——— Arbejde, skole og penge ———
  { crew: "Hvad er det bedste ved din arbejdsdag?", imposter: "Hvad er det værste ved en mandag morgen?" },
  { crew: "Hvilket fag var du bedst til i skolen?", imposter: "Hvilket fag gav dig mest hovedpine?" },
  { crew: "Hvad ville dit drømmejob være?", imposter: "Hvad ville du lave, hvis løn var lige meget?" },
  { crew: "Hvad bruger du flest penge på om måneden?", imposter: "Hvad glemmer du, at du betaler for?" },
  { crew: "Hvilket abonnement kunne du ikke undvære?", imposter: "Hvilket abonnement burde du opsige?" },
  { crew: "Hvad sparer du op til lige nu?", imposter: "Hvad har du sparet op til og alligevel ikke købt?" },
  { crew: "Hvad var dit første job?", imposter: "Hvad var din første store indkøb for egne penge?" },
  { crew: "Hvor mange timer arbejder du på en typisk dag?", imposter: "Hvor mange pauser holder du på en dag?" },
  { crew: "Hvad ville få dig til at sige op i morgen?", imposter: "Hvad holder dig i dit job lige nu?" },
  { crew: "Hvilket møde kunne have været en mail?", imposter: "Hvilken opgave udskyder du længst?" },
  { crew: "Hvad er det bedste råd, du har fået om penge?", imposter: "Hvad er den dummeste ting, du har brugt penge på?" },
  { crew: "Hvor mange gange har du skiftet job?", imposter: "Hvor mange gange har du flyttet som voksen?" },

  // ——— Rejser og oplevelser ———
  { crew: "Hvad er det bedste sted, du har været?", imposter: "Hvad er det mest skuffende sted, du har besøgt?" },
  { crew: "Hvad køber du altid med hjem fra en rejse?", imposter: "Hvad glemmer du altid at pakke?" },
  { crew: "Hvilken slags ferie giver dig mest ro?", imposter: "Hvilken slags ferie giver dig mest energi?" },
  { crew: "Hvad laver du på et fly?", imposter: "Hvad laver du på en lang togtur?" },
  { crew: "Hvor mange lande vil du gerne nå at se?", imposter: "Hvor mange gange er du fløjet i år?" },
  { crew: "Hvad er det vildeste, du har prøvet på ferie?", imposter: "Hvad tør du ikke prøve, selvom du gerne vil?" },
  { crew: "Hvem rejser du helst sammen med?", imposter: "Hvem ville du aldrig dele et telt med?" },
  { crew: "Hvad savner du mest, når du er væk hjemmefra?", imposter: "Hvad nyder du mest ved at komme hjem?" },
  { crew: "Hvilken by har den bedste mad?", imposter: "Hvilket sted har den flotteste natur?" },
  { crew: "Hvad står øverst på din ønskeliste over oplevelser?", imposter: "Hvad har du krydset af, som du er stolt af?" },

  // ——— Barndom og minder ———
  { crew: "Hvad var din yndlingsleg som barn?", imposter: "Hvad var dit yndlingslegetøj?" },
  { crew: "Hvad drømte du om at blive som barn?", imposter: "Hvad var du sikker på, du aldrig ville blive?" },
  { crew: "Hvilken slik fik du oftest som barn?", imposter: "Hvilken mad nægtede du at spise som barn?" },
  { crew: "Hvad er dit tidligste minde?", imposter: "Hvad er dit bedste sommerminde?" },
  { crew: "Hvilken lugt sender dig direkte tilbage i tiden?", imposter: "Hvilken sang minder dig om ungdommen?" },
  { crew: "Hvad kom du oftest i klemme for som barn?", imposter: "Hvad blev du oftest rost for?" },
  { crew: "Hvem var dit forbillede som ung?", imposter: "Hvem så du mest op til i familien?" },
  { crew: "Hvor mange gange knækkede du noget som barn?", imposter: "Hvor mange gange endte du på skadestuen?" },
  { crew: "Hvad var det bedste ved din barndomsferie?", imposter: "Hvad var det kedeligste ved en familietur?" },
  { crew: "Hvilket fjernsynsprogram så du altid som barn?", imposter: "Hvilken bog læste du igen og igen?" },

  // ——— Personlighed og selvindsigt ———
  { crew: "Hvilket ord ville dine venner bruge om dig?", imposter: "Hvilket ord ville din chef bruge om dig?" },
  { crew: "Hvad er din største styrke?", imposter: "Hvad er den vane, du helst vil ændre?" },
  { crew: "Hvad tror folk om dig, som ikke passer?", imposter: "Hvad overrasker folk mest ved dig?" },
  { crew: "Hvad gør dig til en god ven?", imposter: "Hvad kunne du blive bedre til som ven?" },
  { crew: "Hvilken kompliment husker du bedst?", imposter: "Hvilken kritik sad længst i dig?" },
  { crew: "Hvad gør du, når du skal træffe et svært valg?", imposter: "Hvad gør du, når du er helt i tvivl?" },
  { crew: "Hvad er du hemmeligt konkurrencemenneske omkring?", imposter: "Hvad er du ligeglad med at tabe i?" },
  { crew: "Hvilken fejl begår du igen og igen?", imposter: "Hvilken lektie tog længst tid at lære?" },
  { crew: "Hvad gør dig rolig i en presset situation?", imposter: "Hvad får dig til at miste overblikket?" },
  { crew: "Hvad ville stå på dit CV, hvis det var helt ærligt?", imposter: "Hvad ville stå i din biografi som overskrift?" },

  // ——— Teknologi og medier ———
  { crew: "Hvilken app bruger du lige inden du sover?", imposter: "Hvilken app åbner du helt automatisk?" },
  { crew: "Hvad er baggrunden på din telefon?", imposter: "Hvad er baggrunden på din computer?" },
  { crew: "Hvor mange faner har du åbne lige nu?", imposter: "Hvor mange apps har du på forsiden?" },
  { crew: "Hvad ser du, når du bare vil slappe af?", imposter: "Hvad hører du, når du skal koncentrere dig?" },
  { crew: "Hvilken opfindelse kunne du bedst undvære?", imposter: "Hvilken opfindelse er du mest afhængig af?" },
  { crew: "Hvad googler du oftest?", imposter: "Hvad spørger du altid andre om i stedet?" },
  { crew: "Hvor mange billeder tog du sidste weekend?", imposter: "Hvor mange billeder sletter du om måneden?" },
  { crew: "Hvilken lyd har du på din telefon?", imposter: "Hvilken lyd bruger du som vækkeur?" },
  { crew: "Hvad var din første telefon?", imposter: "Hvad var din første computer?" },

  // ——— Hus, hjem og ting ———
  { crew: "Hvad er det mest værdifulde, du ejer?", imposter: "Hvad er det ældste, du ejer?" },
  { crew: "Hvilken ting kunne du aldrig smide ud?", imposter: "Hvilken ting burde du have smidt ud for år siden?" },
  { crew: "Hvad hænger på din væg?", imposter: "Hvad står der på din vindueskarm?" },
  { crew: "Hvilken farve er dit soveværelse?", imposter: "Hvilken farve er din yndlingskop?" },
  { crew: "Hvad mangler dit hjem?", imposter: "Hvad har du for meget af derhjemme?" },
  { crew: "Hvor mange fjernbetjeninger har du?", imposter: "Hvor mange opladere ligger fremme?" },
  { crew: "Hvad ville du vise frem først i dit hjem?", imposter: "Hvad ville du gemme væk før gæster?" },
  { crew: "Hvilket rum blev sidst malet hos dig?", imposter: "Hvilket rum trænger mest?" },
  { crew: "Hvad dufter der af i dit hjem?", imposter: "Hvad lyder der oftest i dit hjem?" },

  // ——— Sport, krop og fritid ———
  { crew: "Hvilken sport har du dyrket længst?", imposter: "Hvilken sport gav du hurtigst op på?" },
  { crew: "Hvad laver du for at få pulsen op?", imposter: "Hvad laver du for at slappe helt af?" },
  { crew: "Hvor mange skridt går du på en typisk dag?", imposter: "Hvor mange gange tager du trappen?" },
  { crew: "Hvilken hobby vil du gerne starte på?", imposter: "Hvilken hobby er du holdt op med?" },
  { crew: "Hvad er den bedste måde at bruge en søndag på?", imposter: "Hvad er den bedste måde at bruge en fredag aften på?" },
  { crew: "Hvilket hold holder du med?", imposter: "Hvilken sport ser du helst live?" },
  { crew: "Hvad gør du, når vejret ødelægger dine planer?", imposter: "Hvad gør du på en regnvejrssøndag?" },

  // ——— Meninger og præferencer ———
  { crew: "Hvad er den bedste pizza-topping?", imposter: "Hvad er den værste ting at putte på en pizza?" },
  { crew: "Hvad er det bedste tidspunkt at holde ferie på?", imposter: "Hvad er det dårligste tidspunkt at flytte på?" },
  { crew: "Hvilken bilfarve ville du vælge?", imposter: "Hvilken cykelfarve ville du vælge?" },
  { crew: "Hvad er den bedste film at se om vinteren?", imposter: "Hvad er den bedste serie at binge en weekend?" },
  { crew: "Hvilket sprog ville du gerne kunne?", imposter: "Hvilket sprog lyder pænest?" },
  { crew: "Hvad er den bedste sandwich?", imposter: "Hvad er den bedste suppe?" },
  { crew: "Hvilket tidspunkt på året er bedst at holde fest?", imposter: "Hvilket tidspunkt er bedst at rejse?" },
  { crew: "Hvad er den mest irriterende lyd i et hjem?", imposter: "Hvad er den mest beroligende lyd derhjemme?" },
  { crew: "Hvilken slags vejr er bedst at sove i?", imposter: "Hvilken slags vejr er bedst at gå tur i?" },
  { crew: "Hvad er den bedste madvare at have på lager?", imposter: "Hvad løber du altid tør for?" },
  { crew: "Hvilken slags ferie ville du aldrig tage på?", imposter: "Hvilken slags ferie tager du igen og igen?" },
  { crew: "Hvad er det bedste ved at bo, hvor du bor?", imposter: "Hvad er det værste ved at bo, hvor du bor?" },
  { crew: "Hvilken frugt hører til en morgenmad?", imposter: "Hvilken grøntsag hører til en aftensmad?" },
  { crew: "Hvad er den bedste dag at holde fri på?", imposter: "Hvad er den værste dag at arbejde på?" },
  { crew: "Hvilken slags kaffe drikker du?", imposter: "Hvilken slags te drikker du?" },
  { crew: "Hvad er det bedste ved efteråret?", imposter: "Hvad er det bedste ved foråret?" },
  { crew: "Hvilket møbel er vigtigst i en stue?", imposter: "Hvilket møbel er vigtigst i et soveværelse?" },
  { crew: "Hvad ville du vælge til en øde ø: bog eller musik?", imposter: "Hvad ville du vælge: bjerge eller strand?" },
  { crew: "Hvilken smag er bedst i en is?", imposter: "Hvilken smag er bedst i en kage?" },
  { crew: "Hvad er den bedste snack til en biograftur?", imposter: "Hvad er den bedste snack til en køretur?" },
  { crew: "Hvilken slags brød køber du helst?", imposter: "Hvilken slags mælk står i dit køleskab?" },
  { crew: "Hvad er den bedste gave til en, der har alt?", imposter: "Hvad er den nemmeste gave at give?" },
  { crew: "Hvilket dyr ville være det bedste kæledyr?", imposter: "Hvilket dyr ville være det værste kæledyr?" },
  { crew: "Hvad er den bedste måde at vågne på?", imposter: "Hvad er den værste måde at blive vækket på?" },
  { crew: "Hvilken årstid har det bedste tøj?", imposter: "Hvilken årstid har den bedste mad?" },

  // ——— Hypotetisk ———
  { crew: "Hvad ville du gøre, hvis du kunne blive usynlig en dag?", imposter: "Hvad ville du gøre, hvis du kunne flyve en dag?" },
  { crew: "Hvor ville du rejse hen, hvis rejsen var gratis?", imposter: "Hvor ville du bo, hvis du kunne vælge frit?" },
  { crew: "Hvad ville du tage med i en tidsmaskine?", imposter: "Hvilket årti ville du gerne besøge?" },
  { crew: "Hvad ville du lave, hvis du aldrig skulle sove?", imposter: "Hvad ville du lave med to timer ekstra hver dag?" },
  { crew: "Hvem ville du gerne spise middag med?", imposter: "Hvem ville du gerne have et råd fra?" },
  { crew: "Hvad ville du kalde din egen restaurant?", imposter: "Hvad ville du kalde din egen båd?" },
  { crew: "Hvilket dyr ville du gerne kunne tale med?", imposter: "Hvilket dyr ville du gerne kunne bevæge dig som?" },
  { crew: "Hvad ville du gøre med en ekstra fridag i næste uge?", imposter: "Hvad ville du gøre med en ekstra måneds ferie?" },
  { crew: "Hvad ville du lære, hvis du havde et helt år?", imposter: "Hvad ville du blive rigtig god til på en måned?" },
  { crew: "Hvilket job ville du prøve i en uge?", imposter: "Hvilket job ville du aldrig kunne klare en dag i?" },
  { crew: "Hvad ville du bygge, hvis du kunne alt?", imposter: "Hvad ville du opfinde, hvis du kunne?" },
  { crew: "Hvad ville du gøre, hvis du var chef for en dag?", imposter: "Hvad ville du ændre på din arbejdsplads?" },

  // ——— Situationer og adfærd ———
  { crew: "Hvad gør du, hvis du kommer til at gå forkert?", imposter: "Hvad gør du, hvis du har glemt en persons navn?" },
  { crew: "Hvad gør du, hvis maden er kold på en restaurant?", imposter: "Hvad gør du, hvis du får forkert vekselpenge?" },
  { crew: "Hvad gør du, hvis nogen tager din plads?", imposter: "Hvad gør du, hvis nogen springer køen over?" },
  { crew: "Hvad gør du, når du keder dig i et selskab?", imposter: "Hvad gør du, når en samtale går i stå?" },
  { crew: "Hvad gør du, hvis du taber noget på gulvet ude?", imposter: "Hvad gør du, hvis du spilder på dit tøj?" },
  { crew: "Hvad gør du, når du er helt alene en hel dag?", imposter: "Hvad gør du, når planerne bliver aflyst?" },
  { crew: "Hvad gør du, hvis du ikke kan finde dine nøgler?", imposter: "Hvad gør du, hvis din telefon er væk?" },
  { crew: "Hvad gør du, hvis du bliver forsinket?", imposter: "Hvad gør du, hvis du kommer alt for tidligt?" },
  { crew: "Hvad gør du, når du kun har få sekunder til at vælge?", imposter: "Hvad gør du, når du er i tvivl?" },
  { crew: "Hvad gør du, hvis en ven er ked af det?", imposter: "Hvad gør du, hvis en ven er vred på dig?" },
  { crew: "Hvad gør du, når du får en uventet regning?", imposter: "Hvad gør du, når du får penge til overs?" },
  { crew: "Hvad gør du, når du ikke gider lave mad?", imposter: "Hvad gør du, når køkkenet er et rod?" },

  // ——— Tal og mængder ———
  { crew: "Hvor mange gange om ugen ser du dine venner?", imposter: "Hvor mange gange om ugen taler du med din familie?" },
  { crew: "Hvor mange gange om året går du til tandlæge?", imposter: "Hvor mange gange om året går du til frisør?" },
  { crew: "Hvor mange par bukser ejer du?", imposter: "Hvor mange jakker hænger i din entré?" },
  { crew: "Hvor mange kopper har du i skabet?", imposter: "Hvor mange tallerkener bruger du faktisk?" },
  { crew: "Hvor mange gange har du prøvet at flytte?", imposter: "Hvor mange gange har du malet et rum?" },
  { crew: "Hvor mange gange om måneden spiser du ude?", imposter: "Hvor mange gange om måneden får du gæster?" },
  { crew: "Hvor mange podcasts eller playlister følger du?", imposter: "Hvor mange serier ser du samtidig?" },
  { crew: "Hvor mange gange tjekker du vejret om dagen?", imposter: "Hvor mange gange tjekker du din kalender?" },
  { crew: "Hvor mange gaver køber du i december?", imposter: "Hvor mange kort skriver du om året?" },
  { crew: "Hvor mange gange har du skiftet mening om noget vigtigt?", imposter: "Hvor mange gange har du fortrudt en stor beslutning?" },
  { crew: "Hvor mange minutter bruger du på din telefon i sengen?", imposter: "Hvor mange minutter tager din morgenrutine?" },
  { crew: "Hvor mange gange om ugen laver du noget helt nyt?", imposter: "Hvor mange gange om ugen gør du præcis det samme?" },

  // ——— Hvem i gruppen: flere vinkler ———
  { crew: "Hvem i gruppen ville planlægge hele turen?", imposter: "Hvem i gruppen ville bare møde op?" },
  { crew: "Hvem i gruppen ville læse manualen først?", imposter: "Hvem i gruppen ville bare gå i gang?" },
  { crew: "Hvem i gruppen ville tage sig af maden?", imposter: "Hvem i gruppen ville tage opvasken?" },
  { crew: "Hvem i gruppen ville komme først til en aftale?", imposter: "Hvem i gruppen ville komme sidst?" },
  { crew: "Hvem i gruppen ville huske alle fødselsdage?", imposter: "Hvem i gruppen ville glemme sin egen?" },
  { crew: "Hvem i gruppen ville tage den svære snak?", imposter: "Hvem i gruppen ville undgå den for enhver pris?" },
  { crew: "Hvem i gruppen ville vinde en quiz?", imposter: "Hvem i gruppen ville vinde en styrkeprøve?" },
  { crew: "Hvem i gruppen ville have flest ting med på en tur?", imposter: "Hvem i gruppen rejser med håndbagage kun?" },
  { crew: "Hvem i gruppen ville adoptere et herreløst dyr?", imposter: "Hvem i gruppen ville samle affald op på gaden?" },
  { crew: "Hvem i gruppen ville blive bedst til et nyt sprog?", imposter: "Hvem i gruppen ville give hurtigst op?" },
  { crew: "Hvem i gruppen ville tage ansvaret, hvis noget gik galt?", imposter: "Hvem i gruppen ville pege på en anden?" },
  { crew: "Hvem i gruppen bruger flest penge på mad?", imposter: "Hvem i gruppen laver mest mad selv?" },
  { crew: "Hvem i gruppen ville stå tidligst op på en ferie?", imposter: "Hvem i gruppen ville sove hele formiddagen?" },
  { crew: "Hvem i gruppen ville få os til at grine i en krise?", imposter: "Hvem i gruppen ville holde hovedet koldt?" },
  { crew: "Hvem i gruppen ville tage det længste bad?", imposter: "Hvem i gruppen ville bruge længst tid foran spejlet?" },

  // ——— Ting du gør / ikke gør ———
  { crew: "Hvad synger du i badet?", imposter: "Hvad fløjter du uden at tænke over det?" },
  { crew: "Hvad samler du på?", imposter: "Hvad har du alt for mange af?" },
  { crew: "Hvad læser du lige nu?", imposter: "Hvad ser du lige nu?" },
  { crew: "Hvad gemmer du i din skrivebordsskuffe?", imposter: "Hvad gemmer du øverst i skabet?" },
  { crew: "Hvad har du i din fryser lige nu?", imposter: "Hvad står bagerst i dit køleskab?" },
  { crew: "Hvad tager du altid med på arbejde?", imposter: "Hvad efterlader du altid på arbejdet?" },
  { crew: "Hvad putter du i en gaveæske, når du er i tvivl?", imposter: "Hvad ønsker du dig, når nogen spørger?" },
  { crew: "Hvad kalder du din bil eller cykel?", imposter: "Hvad ville du kalde en hund?" },
  { crew: "Hvad står der på din indkøbsseddel lige nu?", imposter: "Hvad står øverst på din to-do-liste?" },
  { crew: "Hvad er dit go-to måltid, når du har travlt?", imposter: "Hvad laver du, når du har god tid i køkkenet?" },
  { crew: "Hvad gør du for at få en dårlig dag til at blive bedre?", imposter: "Hvad gør du for at fejre en god dag?" },
  { crew: "Hvad hjælper dig med at koncentrere dig?", imposter: "Hvad forstyrrer dig mest?" },
  { crew: "Hvad tager du med til en picnic?", imposter: "Hvad tager du med til en fest?" },
  { crew: "Hvad er din faste plads i en biograf?", imposter: "Hvad er din faste plads i et tog?" },
  { crew: "Hvad gør du, mens du laver mad?", imposter: "Hvad gør du, mens du rydder op?" },
  { crew: "Hvad kigger du efter, når du køber tøj?", imposter: "Hvad kigger du efter, når du køber mad?" },
  { crew: "Hvad har du på dit natbord?", imposter: "Hvad har du i din entré?" },
  { crew: "Hvad giver du altid væk?", imposter: "Hvad låner du aldrig ud?" },
  { crew: "Hvad er dit bedste værktøj i køkkenet?", imposter: "Hvad er dit bedste værktøj i skuret?" },
  { crew: "Hvad gør du, når du har fri en time?", imposter: "Hvad gør du, når du har fri en hel dag?" },

  // ——— Vurderinger og skalaer i ord ———
  { crew: "Hvad er det sværeste husarbejde?", imposter: "Hvad er det nemmeste husarbejde?" },
  { crew: "Hvad er den dyreste ting, du har købt i år?", imposter: "Hvad er den billigste ting, du bruger dagligt?" },
  { crew: "Hvad tager længst tid i din morgen?", imposter: "Hvad tager længst tid i din aften?" },
  { crew: "Hvad er det mest overvurderede ved ferier?", imposter: "Hvad er det mest undervurderede ved at være hjemme?" },
  { crew: "Hvad er den bedste undskyldning for at blive hjemme?", imposter: "Hvad er den bedste grund til at gå ud?" },
  { crew: "Hvad er det bedste ved at være alene?", imposter: "Hvad er det bedste ved at være mange?" },
  { crew: "Hvad er det mest irriterende ved at handle ind?", imposter: "Hvad er det mest irriterende ved at rejse?" },
  { crew: "Hvilket råd giver du selv oftest videre?", imposter: "Hvilket råd har du selv ignoreret?" },
  { crew: "Hvad er den bedste beslutning, du har taget?", imposter: "Hvad er den sværeste beslutning, du har taget?" },
  { crew: "Hvad er det mest imponerende, en ven har gjort?", imposter: "Hvad er det sødeste, en fremmed har gjort?" },
  { crew: "Hvad er den bedste opfindelse i dit hjem?", imposter: "Hvad er den mest unødvendige ting i dit hjem?" },
  { crew: "Hvad er det bedste ved din bedste ven?", imposter: "Hvad er det bedste ved din familie?" },

  // ——— Hvornår / tid ———
  { crew: "Hvornår har du sidst prøvet noget for første gang?", imposter: "Hvornår har du sidst gjort noget du var bange for?" },
  { crew: "Hvornår griner du mest på en dag?", imposter: "Hvornår er du mest stille på en dag?" },
  { crew: "Hvornår tænker du bedst?", imposter: "Hvornår får du dine bedste idéer?" },
  { crew: "Hvornår begynder du at pakke til en rejse?", imposter: "Hvornår tjekker du ind til et fly?" },
  { crew: "Hvornår ringer du typisk til din familie?", imposter: "Hvornår skriver du typisk til dine venner?" },
  { crew: "Hvornår spiser du din første ting på dagen?", imposter: "Hvornår spiser du din sidste ting på dagen?" },
  { crew: "Hvornår har du sidst danset?", imposter: "Hvornår har du sidst sunget højt?" },
  { crew: "Hvornår er du mest produktiv?", imposter: "Hvornår er du mest kreativ?" },

  // ——— Hvor gammel / tal ———
  { crew: "Hvor gammel var du, da du fik dit første kæledyr?", imposter: "Hvor gammel var du, da du fik din første cykel?" },
  { crew: "Hvor gammel var du, da du første gang lavede mad til andre?", imposter: "Hvor gammel var du, da du første gang var alene hjemme?" },
  { crew: "Hvor mange sprog kan du sige goddag på?", imposter: "Hvor mange lande har du sat fod i?" },
  { crew: "Hvor mange telefonnumre kan du udenad?", imposter: "Hvor mange fødselsdage kan du huske?" },
  { crew: "Hvor mange gange har du prøvet at stå på ski?", imposter: "Hvor mange gange har du prøvet at sejle?" },
  { crew: "Hvor mange tasker ejer du?", imposter: "Hvor mange kasketter eller huer har du?" },
  { crew: "Hvor mange billeder har du på din væg?", imposter: "Hvor mange bøger står i din reol?" },
  { crew: "Hvor mange gange om ugen ser du en skærm efter midnat?", imposter: "Hvor mange gange om ugen går du i seng før ti?" },

  // ——— Hvem i gruppen ———
  { crew: "Hvem i gruppen ville klare sig bedst uden penge en uge?", imposter: "Hvem i gruppen ville bruge alt på én dag?" },
  { crew: "Hvem i gruppen ville huske at vande planterne?", imposter: "Hvem i gruppen ville glemme at fodre katten?" },
  { crew: "Hvem i gruppen ville få os alle op om morgenen?", imposter: "Hvem i gruppen ville sætte tempoet ned?" },
  { crew: "Hvem i gruppen fortæller de bedste historier?", imposter: "Hvem i gruppen stiller de bedste spørgsmål?" },
  { crew: "Hvem i gruppen ville tage det bedste billede?", imposter: "Hvem i gruppen ville stå bagerst på billedet?" },
  { crew: "Hvem i gruppen ville bygge et telt hurtigst?", imposter: "Hvem i gruppen ville tænde bålet?" },
  { crew: "Hvem i gruppen ville sige noget klogt i en svær situation?", imposter: "Hvem i gruppen ville bare give et kram?" },
  { crew: "Hvem i gruppen ville blive bedst til at lave mad?", imposter: "Hvem i gruppen ville bestille take-away hver dag?" },
  { crew: "Hvem i gruppen ville tage den længste omvej for en udsigt?", imposter: "Hvem i gruppen ville tage den hurtigste rute?" },
  { crew: "Hvem i gruppen ville huske alle navne til en fest?", imposter: "Hvem i gruppen ville tale med alle?" },

  // ——— Smag, stil og småting ———
  { crew: "Hvilken slags stol sidder du helst i?", imposter: "Hvilken slags pude sover du bedst med?" },
  { crew: "Hvad er din yndlingsblomst?", imposter: "Hvad er dit yndlingstræ?" },
  { crew: "Hvilken slags kage bager du helst?", imposter: "Hvilken slags mad laver du helst?" },
  { crew: "Hvad er den bedste duft i et hjem?", imposter: "Hvad er den værste lugt i et køleskab?" },
  { crew: "Hvilket materiale kan du bedst lide at røre ved?", imposter: "Hvilket materiale kan du slet ikke lide?" },
  { crew: "Hvad er den flotteste farve på en himmel?", imposter: "Hvad er den flotteste farve på et hav?" },
  { crew: "Hvilken slags smykke ville du bære?", imposter: "Hvilken slags ur ville du vælge?" },
  { crew: "Hvad er den bedste slags stof i en trøje?", imposter: "Hvad er det bedste stof i et sengetøj?" },
  { crew: "Hvilken slags lys kan du bedst lide om aftenen?", imposter: "Hvilken slags musik hører du om aftenen?" },
  { crew: "Hvad er det pæneste sted, du har været?", imposter: "Hvad er det mest rolige sted, du kender?" },
  { crew: "Hvilken slags kop drikker du af?", imposter: "Hvilken slags glas bruger du mest?" },
  { crew: "Hvad er det bedste ved en ny bog?", imposter: "Hvad er det bedste ved en ny film?" },
  { crew: "Hvilket ord lyder pænest på dansk?", imposter: "Hvilket ord lyder grimmest på dansk?" },
  { crew: "Hvad er den bedste slags gave at pakke ud?", imposter: "Hvad er den bedste slags overraskelse?" },
  { crew: "Hvilken slags dyr ville du have i en have?", imposter: "Hvilken slags fugl kan du bedst lide?" },

  // ——— Vaner ved bordet og i køkkenet ———
  { crew: "Hvad laver du altid for meget af?", imposter: "Hvad køber du altid for lidt af?" },
  { crew: "Hvad spiser du stående i køkkenet?", imposter: "Hvad spiser du i sofaen?" },
  { crew: "Hvad er det første, du skærer i en middag?", imposter: "Hvad er det, du gemmer til sidst på tallerkenen?" },
  { crew: "Hvad drikker du til maden?", imposter: "Hvad drikker du efter maden?" },
  { crew: "Hvad tager du altid en ekstra portion af?", imposter: "Hvad siger du altid nej tak til?" },
  { crew: "Hvad står der altid i dit skab?", imposter: "Hvad køber du kun til gæster?" },
  { crew: "Hvad laver du af rester?", imposter: "Hvad smider du oftest ud?" },
  { crew: "Hvad er dit bedste madtrick?", imposter: "Hvad er dit bedste oprydningstrick?" },

  // ——— Arbejde, læring og fremtid ———
  { crew: "Hvad vil du gerne kunne om fem år?", imposter: "Hvad vil du gerne have prøvet inden næste år?" },
  { crew: "Hvad er den vigtigste egenskab i et job?", imposter: "Hvad er den vigtigste egenskab i en ven?" },
  { crew: "Hvad ville du undervise i?", imposter: "Hvad ville du gerne have undervisning i?" },
  { crew: "Hvad er det sværeste at lære som voksen?", imposter: "Hvad er det nemmeste at lære som voksen?" },
  { crew: "Hvad ville du sætte på dit visitkort?", imposter: "Hvad ville du kalde din egen virksomhed?" },
  { crew: "Hvad motiverer dig mest på en dårlig dag?", imposter: "Hvad giver dig energi om morgenen?" },
  { crew: "Hvad ville du gerne stoppe med at gøre?", imposter: "Hvad ville du gerne begynde på?" },
  { crew: "Hvor mange år har du haft dit længste job?", imposter: "Hvor mange chefer har du haft?" },

  // ——— Natur, dyr og udendørs ———
  { crew: "Hvad kan du bedst lide at gøre udendørs?", imposter: "Hvad kan du bedst lide at gøre indendørs?" },
  { crew: "Hvilket vejr er bedst at være ude i?", imposter: "Hvilket vejr er bedst at kigge på indefra?" },
  { crew: "Hvad ville du plante i en have?", imposter: "Hvad ville du bygge i en have?" },
  { crew: "Hvilket dyr ser du oftest, hvor du bor?", imposter: "Hvilken fugl hører du oftest?" },
  { crew: "Hvad tager du med på en vandretur?", imposter: "Hvad tager du med på en cykeltur?" },
  { crew: "Hvad er det bedste ved en skovtur?", imposter: "Hvad er det bedste ved en strandtur?" },
  { crew: "Hvor mange gange om året er du i naturen en hel dag?", imposter: "Hvor mange gange om året sover du udenfor?" },

  // ——— Kultur og underholdning ———
  { crew: "Hvilken slags historie kan du bedst lide?", imposter: "Hvilken slags slutning foretrækker du?" },
  { crew: "Hvad ser du, når du skal grine?", imposter: "Hvad hører du, når du skal falde ned?" },
  { crew: "Hvilken figur ville du gerne være i en film?", imposter: "Hvilken rolle ville du få i et teaterstykke?" },
  { crew: "Hvad var den sidste koncert, du var til?", imposter: "Hvad var den sidste film, du så i biografen?" },
  { crew: "Hvilken slags musik hører du, når du kører?", imposter: "Hvilken slags musik hører du, når du arbejder?" },
  { crew: "Hvad ville du optræde med, hvis du skulle?", imposter: "Hvad ville du aldrig gøre på en scene?" },
  { crew: "Hvor mange bøger læser du på et år?", imposter: "Hvor mange film ser du på en måned?" },

  // ——— Hvem i gruppen ———
  { crew: "Hvem i gruppen ville tage det bedste initiativ?", imposter: "Hvem i gruppen ville følge med uden at spørge?" },
  { crew: "Hvem i gruppen ville lave den bedste playliste?", imposter: "Hvem i gruppen ville bestemme musikken alligevel?" },
  { crew: "Hvem i gruppen ville tåle en lang køretur bedst?", imposter: "Hvem i gruppen ville spørge er vi der snart?" },
  { crew: "Hvem i gruppen ville pakke for lidt med?", imposter: "Hvem i gruppen ville tage en ekstra kuffert?" },
  { crew: "Hvem i gruppen ville prøve den mærkeligste mad?", imposter: "Hvem i gruppen ville bestille det samme hver dag?" },
  { crew: "Hvem i gruppen ville rejse sig og danse først?", imposter: "Hvem i gruppen ville filme det hele?" },
  { crew: "Hvem i gruppen ville huske at sige tak?", imposter: "Hvem i gruppen ville sende en hilsen bagefter?" },
  { crew: "Hvem i gruppen ville tage den dårligste beslutning kl. 3?", imposter: "Hvem i gruppen ville sige lad os gå hjem?" },

  // ——— Sidste påfyld ———
  { crew: "Hvad er den bedste undskyldning for at tage en pause?", imposter: "Hvad er den bedste grund til at holde en fridag?" },
  { crew: "Hvilken slags aften er den perfekte for dig?", imposter: "Hvilken slags morgen er den perfekte for dig?" },
  { crew: "Hvad ville du gerne have mere af i din hverdag?", imposter: "Hvad ville du gerne have mindre af?" },
  { crew: "Hvad er den bedste ting at gøre i regnvejr?", imposter: "Hvad er den bedste ting at gøre i solskin?" },
  { crew: "Hvilket sted går du hen for at tænke?", imposter: "Hvilket sted går du hen for at slappe af?" },
  { crew: "Hvad er du bedst til at lave uden hjælp?", imposter: "Hvad beder du altid om hjælp til?" },
  { crew: "Hvad tager du med, når du skal overnatte hos nogen?", imposter: "Hvad glemmer du, når du overnatter ude?" },
  { crew: "Hvilken slags gave giver du en, du ikke kender godt?", imposter: "Hvilken slags gave giver du din bedste ven?" },
  { crew: "Hvad er den bedste måde at bruge en fridag?", imposter: "Hvad er den bedste måde at slutte en uge?" },
  { crew: "Hvad gør dig mest utålmodig?", imposter: "Hvad kan du vente længe på uden at klage?" },
  { crew: "Hvilken slags rod kan du leve med?", imposter: "Hvilken slags rod skal ryddes med det samme?" },
  { crew: "Hvad ville du tage med til en fest, du ikke kender værten til?", imposter: "Hvad ville du tage på til sådan en fest?" },
  { crew: "Hvad gør du, når du har spist for meget?", imposter: "Hvad gør du, når du er alt for træt?" },
  { crew: "Hvilken slags dag husker du bedst?", imposter: "Hvilken slags dag glemmer du hurtigst?" },
  { crew: "Hvad er dit bedste minde fra i år?", imposter: "Hvad er den bedste dag, du kan huske fra sidste år?" },
  { crew: "Hvilken slags samtale kan du bedst lide?", imposter: "Hvilken slags samtale undgår du?" },
  { crew: "Hvad tager du med i en nødsituation?", imposter: "Hvad har du liggende til alle tilfælde?" },
  { crew: "Hvad gør du, når du skal muntre nogen op?", imposter: "Hvad gør du, når du selv skal muntres op?" },
  { crew: "Hvilken slags plan holder du altid?", imposter: "Hvilken slags plan falder altid fra hinanden?" },
  { crew: "Hvad ville du tage med til en hyttetur?", imposter: "Hvad ville du efterlade hjemme på en hyttetur?" },
  { crew: "Hvad er den bedste ting ved en lang tur i bil?", imposter: "Hvad er det værste ved en lang flyvetur?" },
  { crew: "Hvad gør du, når du ikke kan finde noget at se?", imposter: "Hvad gør du, når du ikke kan finde noget at lave?" },
  { crew: "Hvilken slags gæst er du?", imposter: "Hvilken slags vært er du?" },
  { crew: "Hvad er det bedste ved at få besøg?", imposter: "Hvad er det bedste ved at være på besøg?" },
  { crew: "Hvad ville du gøre om, hvis du kunne?", imposter: "Hvad ville du gøre præcis ligesådan igen?" },
  { crew: "Hvad er den vigtigste ting i din taske?", imposter: "Hvad er den vigtigste ting i dit køkken?" },
  { crew: "Hvilken slags ferie ville din familie vælge?", imposter: "Hvilken slags ferie ville dine venner vælge?" },
  { crew: "Hvad gør du, når du skal vente en time?", imposter: "Hvad gør du, når du skal vente fem minutter?" },
  { crew: "Hvad ville du bruge en hel lørdag på?", imposter: "Hvad ville du bruge en hel søndag på?" },
  { crew: "Hvilket sted i din by holder du mest af?", imposter: "Hvilket sted i din by undgår du?" },
  { crew: "Hvad er den bedste snack til en filmaften?", imposter: "Hvad er den bedste drik til en filmaften?" },
  { crew: "Hvad gør du for at holde kontakten med gamle venner?", imposter: "Hvad gør du for at få nye venner?" },
  { crew: "Hvad ville du gerne kunne lave om ved din bolig?", imposter: "Hvad ville du gerne beholde præcis som det er?" },
  { crew: "Hvilken slags musik ville du vælge til en fest?", imposter: "Hvilken slags musik ville du vælge til en middag?" },
  { crew: "Hvad er den bedste tid på året at flytte?", imposter: "Hvad er den bedste tid på året at male?" },
  { crew: "Hvad gør du, når du får en god idé?", imposter: "Hvad gør du, når du glemmer en god idé?" },
  { crew: "Hvad er det mest praktiske, du ejer?", imposter: "Hvad er det mest pyntede, du ejer?" },
  { crew: "Hvilken slags kø kan du bedst holde ud?", imposter: "Hvilken slags ventetid er værst?" },
  { crew: "Hvad gør du, når du skal lære noget nyt?", imposter: "Hvad gør du, når noget er for svært?" },
  { crew: "Hvad er den bedste måde at sige undskyld på?", imposter: "Hvad er den bedste måde at sige tak på?" },
  { crew: "Hvad ville du gerne have haft som barn?", imposter: "Hvad er du glad for, du ikke fik som barn?" },
  { crew: "Hvilken slags pause holder du på arbejde?", imposter: "Hvilken slags pause holder du hjemme?" },
  { crew: "Hvad er den bedste dag i din uge?", imposter: "Hvad er den travleste dag i din uge?" },
  { crew: "Hvad gør du, når du har for mange planer?", imposter: "Hvad gør du, når du slet ingen planer har?" },
  { crew: "Hvad ville du vælge: et langt liv eller et vildt et?", imposter: "Hvad ville du vælge: mere tid eller flere penge?" },
  { crew: "Hvilken slags mad tager du med på arbejde?", imposter: "Hvilken slags mad køber du, når du har glemt madpakken?" },
  { crew: "Hvad er den bedste ting at vågne op til?", imposter: "Hvad er den bedste ting at komme hjem til?" },
  { crew: "Hvem i gruppen ville tage den svære vagt?", imposter: "Hvem i gruppen ville bytte sig fra en kedelig opgave?" },
  { crew: "Hvem i gruppen ville sige det, alle tænker?", imposter: "Hvem i gruppen ville tie for fredens skyld?" },
  { crew: "Hvem i gruppen ville lave den bedste overraskelse?", imposter: "Hvem i gruppen ville afsløre en hemmelighed ved et uheld?" },
  { crew: "Hvem i gruppen ville kunne bo alene i et år?", imposter: "Hvem i gruppen ville savne folk med det samme?" },
  { crew: "Hvem i gruppen ville få mest ud af en fridag?", imposter: "Hvem i gruppen ville bruge den på sofaen?" },
  { crew: "Hvem i gruppen ville lave den bedste morgenmad?", imposter: "Hvem i gruppen ville sove til middag?" },
  { crew: "Hvem i gruppen ville tage sig af en syg ven?", imposter: "Hvem i gruppen ville sende en sjov besked i stedet?" },
  { crew: "Hvem i gruppen ville sige nej til en gratis tur?", imposter: "Hvem i gruppen ville pakke med det samme?" },
  { crew: "Hvem i gruppen ville lære et instrument hurtigst?", imposter: "Hvem i gruppen ville synge højest uden at kunne?" },
  { crew: "Hvem i gruppen ville tage flest billeder på en tur?", imposter: "Hvem i gruppen ville aldrig se sine feriebilleder igen?" },
  { crew: "Hvem i gruppen ville huske at booke bordet?", imposter: "Hvem i gruppen ville komme uden reservation?" },
  { crew: "Hvem i gruppen ville få os til at gå den ekstra tur?", imposter: "Hvem i gruppen ville foreslå en pause?" },
  { crew: "Hvem i gruppen ville prøve at reparere noget selv?", imposter: "Hvem i gruppen ville ringe efter hjælp straks?" },
  { crew: "Hvem i gruppen ville få den bedste idé under pres?", imposter: "Hvem i gruppen ville fryse helt?" },
  { crew: "Hvem i gruppen ville læse en hel bog på en ferie?", imposter: "Hvem i gruppen ville se hele serien i stedet?" },
  { crew: "Hvem i gruppen ville stå op til solopgang?", imposter: "Hvem i gruppen ville blive oppe hele natten i stedet?" },
  { crew: "Hvem i gruppen ville lave den bedste quiz?", imposter: "Hvem i gruppen ville protestere mod svarene?" },
  { crew: "Hvem i gruppen ville vælge det dyreste på menuen?", imposter: "Hvem i gruppen ville lede efter dagens ret?" },
  { crew: "Hvem i gruppen ville huske en gammel aftale?", imposter: "Hvem i gruppen ville dukke op på den forkerte dag?" },
  { crew: "Hvem i gruppen ville tage initiativ til en genforening?", imposter: "Hvem i gruppen ville dukke op i sidste øjeblik?" },
  { crew: "Hvem i gruppen ville få mest ud af en uge alene?", imposter: "Hvem i gruppen ville ringe hjem hver dag?" },
  { crew: "Hvem i gruppen ville tage den længste rute for sjov?", imposter: "Hvem i gruppen ville følge kortet præcist?" },
  { crew: "Hvem i gruppen ville lave mad til alle uden at klage?", imposter: "Hvem i gruppen ville dække bord i stedet?" },
];
