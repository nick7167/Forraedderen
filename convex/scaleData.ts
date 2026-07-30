// Built-in prompt pairs for "Måleren" (the scale game mode).
//
// Every prompt is answered privately on the same 1–5 scale. The imposter
// receives the related-but-different prompt, then everyone compares their
// revealed numbers to identify the odd answer out.

export type ScalePair = {
  crew: string;
  imposter: string;
};

export const SCALE_PAIRS: ScalePair[] = [
  { crew: "Hvor konkurrencemenneske er du?", imposter: "Hvor stædig er du?" },
  { crew: "Hvor god er du til at holde på en hemmelighed?", imposter: "Hvor god er du til at holde masken, når du lyver?" },
  { crew: "Hvor spontan er du?", imposter: "Hvor god er du til at planlægge?" },
  { crew: "Hvor god er du til at komme til tiden?", imposter: "Hvor utålmodig er du, når du venter?" },
  { crew: "Hvor eventyrlysten er du på ferie?", imposter: "Hvor tryghedselskende er du derhjemme?" },
  { crew: "Hvor god er du til at lave mad?", imposter: "Hvor kræsen er du med mad?" },
  { crew: "Hvor god er du til at huske navne?", imposter: "Hvor god er du til at huske ansigter?" },
  { crew: "Hvor meget danser du til en fest?", imposter: "Hvor meget synger du med på musik?" },
  { crew: "Hvor god er du til at spare penge?", imposter: "Hvor nemt køber du noget på impuls?" },
  { crew: "Hvor social er du i en stor gruppe?", imposter: "Hvor meget har du brug for alenetid?" },
  { crew: "Hvor god er du til at samle møbler?", imposter: "Hvor god er du til at læse en brugsanvisning?" },
  { crew: "Hvor modig er du i en rutsjebane?", imposter: "Hvor nervøs bliver du før en flyrejse?" },
  { crew: "Hvor god er du til at svare på beskeder hurtigt?", imposter: "Hvor ofte glemmer du at svare på beskeder?" },
  { crew: "Hvor god er du til at finde vej uden GPS?", imposter: "Hvor let farer du vild i et nyt område?" },
  { crew: "Hvor meget går du op i dit udseende?", imposter: "Hvor længe bruger du på at vælge tøj?" },
  { crew: "Hvor god er du til at holde orden?", imposter: "Hvor meget roder du derhjemme?" },
  { crew: "Hvor god er du til at tage imod kritik?", imposter: "Hvor god er du til at give kritik?" },
  { crew: "Hvor meget ser du reality-tv?", imposter: "Hvor meget følger du med i sladder?" },
  { crew: "Hvor god er du til at vågne om morgenen?", imposter: "Hvor meget bruger du snooze-knappen?" },
  { crew: "Hvor meget stoler du på din mavefornemmelse?", imposter: "Hvor meget overtænker du små ting?" },
  { crew: "Hvor god er du til at forhandle?", imposter: "Hvor meget hader du at prutte om prisen?" },
  { crew: "Hvor meget elsker du overraskelser?", imposter: "Hvor meget bryder du dig om at have kontrol?" },
  { crew: "Hvor god er du til at vinde et skænderi?", imposter: "Hvor ofte giver du dig for at bevare freden?" },
  { crew: "Hvor meget tør du prøve ny mad?", imposter: "Hvor meget holder du dig til det velkendte?" },
  { crew: "Hvor god er du til at holde en plante i live?", imposter: "Hvor god er du til at passe et kæledyr?" },
  { crew: "Hvor meget griner du af dårlige jokes?", imposter: "Hvor ofte fortæller du selv dårlige jokes?" },
  { crew: "Hvor god er du til at gemme en gavehemmelighed?", imposter: "Hvor god er du til at gætte en overraskelse?" },
  { crew: "Hvor meget savner du sommer om vinteren?", imposter: "Hvor meget savner du vinter om sommeren?" },
  { crew: "Hvor meget elsker du at være i centrum?", imposter: "Hvor nervøs bliver du, når alle kigger på dig?" },
  { crew: "Hvor god er du til at holde dig vågen sent?", imposter: "Hvor frisk er du tidligt om morgenen?" },
];
