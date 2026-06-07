/* =============================================================================
   "Wer wird Millionär" - bilingual (DE/EN) procurement quiz + game config.
   General, fun procurement knowledge (NOT Lio-specific). ✏️ Add/adjust freely.
   ============================================================================= */

export type Locale = "de" | "en";

export interface QuizQuestion {
  de: { q: string; a: [string, string, string, string] };
  en: { q: string; a: [string, string, string, string] };
  /** index (0-3) of the correct answer */
  c: number;
}

/** Prize ladder (€). 15 rungs; safe havens at indexes in SAFE. */
export const LEVELS = [
  50, 100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000,
  500000, 1000000,
];
export const SAFE = [5, 9];

export function fmtPrize(n: number): string {
  if (n >= 1_000_000) return "€" + n / 1_000_000 + " Mio.";
  if (n >= 1000) return "€" + n / 1000 + "K";
  if (n === 0) return "€0";
  return "€" + n;
}

export const QUIZ_T: Record<Locale, Record<string, string | string[]>> = {
  de: {
    start: "Spiel starten",
    play_again: "Nochmal spielen",
    leaderboard: "Bestenliste",
    welcome:
      '"Willkommen! Ich bin Vladi, und heute teste ich dein Procurement-Wissen. Bist du bereit für die Million?"',
    name_ph: "Wie heißt du?",
    q_intro: [
      "Fangen wir leicht an...",
      "Noch eine zum Aufwärmen!",
      "Wird schon spannender!",
      "Das solltest du wissen...",
      "Letzte leichte Frage!",
      "Sicherheitsstufe! Ab hier wird's ernst.",
      "Jetzt brauchst du echtes Wissen!",
      "Kennst du deine Procurement-Fakten?",
      "Das ist schon Fortgeschritten!",
      "Auf zur zweiten Sicherheitsstufe!",
      "Hier trennt sich die Spreu vom Weizen!",
      "Procurement-Profi gefragt!",
      "Nur noch drei bis zur Million...",
      "Fast geschafft! Traust du dich?",
      "Die Millionenfrage!",
    ],
    correct: ["Richtig!", "Genau! Weiter geht's!", "Korrekt!", "Sehr gut!", "Bravo!", "Perfekt!", "Stark!", "Procurement-Profi!"],
    wrong: "Leider falsch!",
    timeup: "Die Zeit ist abgelaufen!",
    won: "Du hast gewonnen!",
    lost: "Spiel vorbei",
    won_sub: '"Unglaublich! Du bist ein echter Procurement-Profi und hast die Million geknackt!"',
    lost_sub_safe: '"Nicht schlecht! Du gehst mit {amt} nach Hause. Beim nächsten Mal schaffst du mehr!"',
    lost_sub_zero: '"Das war wohl nichts! Aber hey, beim nächsten Mal wird\'s besser!"',
    aud_title: "Publikums-Voting",
    phone_names: ["Till, Lio Co-Founder", "Lukas, Lio CTO", "A category manager who has seen it all", "Your favourite CPO"],
    phone_pre: "Hmm, ich bin mir ziemlich sicher, dass es ",
    phone_suf: " ist!",
    safe_msg: "Sicherheitsstufe! Du kannst nicht unter {amt} fallen. ",
  },
  en: {
    start: "Start Game",
    play_again: "Play Again",
    leaderboard: "Leaderboard",
    welcome: '"Welcome! I\'m Vladi, and today I\'ll test your procurement knowledge. Ready for the million?"',
    name_ph: "What's your name?",
    q_intro: [
      "Let's start easy...",
      "Another warm-up!",
      "Getting more interesting!",
      "You should know this...",
      "Last easy one!",
      "Safety net! Now it gets serious.",
      "Real knowledge needed now!",
      "Know your procurement facts?",
      "This is advanced!",
      "On to the second safety net!",
      "This is where it gets real!",
      "Procurement pro needed!",
      "Only three to the million...",
      "Almost there! Do you dare?",
      "The Million-Euro Question!",
    ],
    correct: ["Correct!", "Right! Let's go!", "That's it!", "Very good!", "Bravo!", "Perfect!", "Amazing!", "Procurement pro!"],
    wrong: "Wrong answer!",
    timeup: "Time's up!",
    won: "You won!",
    lost: "Game over",
    won_sub: '"Incredible! You\'re a true procurement pro and you cracked the million!"',
    lost_sub_safe: '"Not bad! You\'re taking home {amt}. Next time you\'ll go further!"',
    lost_sub_zero: '"That didn\'t work out! But hey, next time will be better!"',
    aud_title: "Audience Poll",
    phone_names: ["Till, Lio Co-Founder", "Lukas, Lio CTO", "A category manager who has seen it all", "Your favourite CPO"],
    phone_pre: "Hmm, I'm pretty sure it's ",
    phone_suf: "!",
    safe_msg: "Safety net! You can't drop below {amt}. ",
  },
};

export const Q_EASY: QuizQuestion[] = [
  { de: { q: "Wofür steht 'RFQ' im Einkauf?", a: ["Request for Quality", "Rapid Funding Quote", "Request for Quotation", "Return for Quotation"] }, en: { q: "What does 'RFQ' stand for in procurement?", a: ["Request for Quality", "Rapid Funding Quote", "Request for Quotation", "Return for Quotation"] }, c: 2 },
  { de: { q: "Was bedeutet 'Maverick Spend'?", a: ["Einkauf beim günstigsten Anbieter", "Einkauf an Prozessen und Verträgen vorbei", "Einkauf großer Mengen", "Einkauf auf Vorrat"] }, en: { q: "What is 'maverick spend'?", a: ["Buying from the cheapest vendor", "Purchasing outside agreed processes and contracts", "Buying in bulk", "Buying in advance"] }, c: 1 },
  { de: { q: "Wofür steht 'P2P' im Einkauf?", a: ["Peer-to-Peer", "Procure-to-Pay", "Plan-to-Produce", "Pay-to-Play"] }, en: { q: "What does 'P2P' mean in procurement?", a: ["Peer-to-Peer", "Procure-to-Pay", "Plan-to-Produce", "Pay-to-Play"] }, c: 1 },
  { de: { q: "Was ist 'Tail Spend'?", a: ["Die größten Verträge", "Viele kleine, nicht gemanagte Einkäufe", "Ausgaben zum Jahresende", "Retouren"] }, en: { q: "What is 'tail spend'?", a: ["The biggest contracts", "Many small, unmanaged purchases", "End-of-year spending", "Returns"] }, c: 1 },
  { de: { q: "Wofür steht 'PO'?", a: ["Payment Option", "Purchase Order", "Product Offer", "Preferred Order"] }, en: { q: "What does 'PO' stand for?", a: ["Payment Option", "Purchase Order", "Product Offer", "Preferred Order"] }, c: 1 },
  { de: { q: "Wofür steht 'SRM'?", a: ["Supplier Risk Management", "Strategic Resource Management", "Supplier Relationship Management", "Sales Revenue Model"] }, en: { q: "What does 'SRM' stand for?", a: ["Supplier Risk Management", "Strategic Resource Management", "Supplier Relationship Management", "Sales Revenue Model"] }, c: 2 },
  { de: { q: "Was bedeutet 'MOQ'?", a: ["Maximum Order Quota", "Minimum Order Quantity", "Monthly Order Quote", "Mandatory Order Quality"] }, en: { q: "What does 'MOQ' mean?", a: ["Maximum Order Quota", "Minimum Order Quantity", "Monthly Order Quote", "Mandatory Order Quality"] }, c: 1 },
  { de: { q: "Was ist die 'Lead Time'?", a: ["Zeit für Verhandlungen", "Zeit von Bestellung bis Lieferung", "Haltbarkeit eines Produkts", "Das Zahlungsziel"] }, en: { q: "What is 'lead time'?", a: ["Time spent negotiating", "Time from order to delivery", "How long a product lasts", "The payment term"] }, c: 1 },
  { de: { q: "Wofür ist ein CPO verantwortlich?", a: ["Produktion", "Einkauf (Procurement)", "Personal", "Partnerschaften"] }, en: { q: "What does a CPO lead?", a: ["Production", "Procurement", "Payroll", "Partnerships"] }, c: 1 },
  { de: { q: "Was bedeutet das Zahlungsziel 'Netto 30'?", a: ["30 % Rabatt", "Zahlung innerhalb von 30 Tagen", "30 Stück Mindestbestellung", "30 Tage Lieferzeit"] }, en: { q: "What do 'Net 30' payment terms mean?", a: ["A 30% discount", "Pay within 30 days", "Order at least 30 units", "30-day delivery time"] }, c: 1 },
  { de: { q: "Was ist 'indirekter' Einkauf?", a: ["Material, das ins Endprodukt geht", "Güter & Services, die NICHT ins Endprodukt gehen", "Einkauf über Zwischenhändler", "Einkauf im Ausland"] }, en: { q: "What is 'indirect' spend?", a: ["Material that goes into the end product", "Goods & services NOT in the end product", "Buying via middlemen", "Buying abroad"] }, c: 1 },
  { de: { q: "Wozu dient ein 'Rahmenvertrag'?", a: ["Einmalkauf zum Sonderpreis", "Wiederholt zu vorab vereinbarten Konditionen einkaufen", "Einen Lieferanten zu sperren", "Skonto zu sichern"] }, en: { q: "What does a 'framework agreement' let you do?", a: ["Make a one-off discounted buy", "Buy repeatedly on pre-agreed terms", "Block a supplier", "Lock in an early-payment discount"] }, c: 1 },
  { de: { q: "Was regeln 'Incoterms'?", a: ["Steuersätze", "Pflichten & Risiko beim internationalen Versand", "Wechselkurse", "Nur Zollgebühren"] }, en: { q: "What do 'Incoterms' govern?", a: ["Tax rates", "Responsibilities & risk in international shipping", "Exchange rates", "Customs duties only"] }, c: 1 },
  { de: { q: "Wofür steht 'RFP'?", a: ["Request for Payment", "Request for Proposal", "Rapid Free Pricing", "Return for Profit"] }, en: { q: "What does 'RFP' stand for?", a: ["Request for Payment", "Request for Proposal", "Rapid Free Pricing", "Return for Profit"] }, c: 1 },
  { de: { q: "Was misst 'Spend under Management'?", a: ["Gesamtausgaben minus Gehälter", "Anteil der aktiv vom Einkauf gesteuerten Ausgaben", "Noch nicht verplantes Budget", "Ausgaben über Plan"] }, en: { q: "What does 'spend under management' measure?", a: ["Total spend minus salaries", "Share of spend actively managed by procurement", "Budget not yet allocated", "Spending over plan"] }, c: 1 },
  { de: { q: "Was ist ein 'bevorzugter Lieferant' (preferred supplier)?", a: ["Der billigste Anbieter", "Ein vorab geprüfter, empfohlener Lieferant", "Der nächstgelegene Anbieter", "Ein Lieferant ohne Vertrag"] }, en: { q: "What is a 'preferred supplier'?", a: ["The cheapest vendor", "A pre-vetted, recommended supplier", "The closest vendor", "A supplier with no contract"] }, c: 1 },
];

export const Q_MED: QuizQuestion[] = [
  { de: { q: "Wonach klassifiziert die 'Kraljic-Matrix' Einkaufsgüter?", a: ["Umsatz pro Lieferant", "Versorgungsrisiko & Ergebniseinfluss", "Vertragslaufzeit", "Zahlungsbedingungen"] }, en: { q: "How does the 'Kraljic Matrix' classify purchases?", a: ["Revenue per supplier", "Supply risk & profit impact", "Contract duration", "Payment terms"] }, c: 1 },
  { de: { q: "Welches Unternehmen hat 'Just-in-Time' bekannt gemacht?", a: ["Ford", "Toyota", "Amazon", "Walmart"] }, en: { q: "Which company popularized 'just-in-time'?", a: ["Ford", "Toyota", "Amazon", "Walmart"] }, c: 1 },
  { de: { q: "Der '3-Way-Match' gleicht Bestellung, Wareneingang und … ab?", a: ["Vertrag", "Angebot", "Rechnung", "Lieferschein"] }, en: { q: "A '3-way match' matches the PO, the goods receipt and the …?", a: ["Contract", "Quote", "Invoice", "Delivery note"] }, c: 2 },
  { de: { q: "Was passiert bei einer 'Reverse Auction'?", a: ["Käufer bieten sich hoch", "Lieferanten unterbieten sich im Preis", "Preise werden ausgelost", "Es gibt keinen Gewinner"] }, en: { q: "What happens in a 'reverse auction'?", a: ["Buyers bid each other up", "Suppliers bid the price down", "Prices are drawn at random", "There is no winner"] }, c: 1 },
  { de: { q: "Was umfasst 'Total Cost of Ownership' (TCO)?", a: ["Nur den Kaufpreis", "Kaufpreis + alle Folgekosten über den Lebenszyklus", "Nur Wartungskosten", "Kaufpreis minus Rabatt"] }, en: { q: "What does 'Total Cost of Ownership' (TCO) include?", a: ["Just the purchase price", "Purchase price + all lifecycle costs", "Maintenance only", "Purchase price minus discount"] }, c: 1 },
  { de: { q: "Welches Schiff blockierte 2021 den Suezkanal?", a: ["Ever Given", "Titanic II", "MSC Oscar", "Black Pearl"] }, en: { q: "Which ship blocked the Suez Canal in 2021?", a: ["Ever Given", "Titanic II", "MSC Oscar", "Black Pearl"] }, c: 0 },
  { de: { q: "Was bedeutet 'Nearshoring'?", a: ["Beschaffung ins ferne Ausland verlagern", "Beschaffung in ein nahegelegenes Land verlagern", "Lager näher zum Kunden bringen", "Komplett lokal produzieren"] }, en: { q: "What does 'nearshoring' mean?", a: ["Moving sourcing far overseas", "Moving sourcing to a nearby country", "Moving warehouses closer to customers", "Producing fully in-house"] }, c: 1 },
  { de: { q: "Was beschreibt der 'Bullwhip-Effekt'?", a: ["Preisverfall bei Massenware", "Aufschaukelnde Nachfrageschwankungen entlang der Lieferkette", "Plötzlicher Lieferantenausfall", "Saisonale Rabatte"] }, en: { q: "What does the 'bullwhip effect' describe?", a: ["Falling prices on commodities", "Demand swings amplifying up the supply chain", "Sudden supplier failure", "Seasonal discounts"] }, c: 1 },
  { de: { q: "Wofür steht 'EDI'?", a: ["Electronic Data Interchange", "Enterprise Digital Index", "Early Delivery Incentive", "External Demand Input"] }, en: { q: "What does 'EDI' stand for?", a: ["Electronic Data Interchange", "Enterprise Digital Index", "Early Delivery Incentive", "External Demand Input"] }, c: 0 },
  { de: { q: "Was bedeutet 'Konsignationslager'?", a: ["Der Lieferant besitzt den Bestand, bis du ihn nutzt", "Du zahlst alles im Voraus", "Lager beim Spediteur", "Ein reines Retourenlager"] }, en: { q: "What is 'consignment stock'?", a: ["The supplier owns the stock until you use it", "You pay everything upfront", "Stock held by the carrier", "A returns-only warehouse"] }, c: 0 },
  { de: { q: "Was schätzt eine 'Should-Cost'-Analyse?", a: ["Den Marktpreis", "Was ein Produkt in der Herstellung kosten SOLLTE", "Den Wiederverkaufswert", "Die Inflationsrate"] }, en: { q: "What does a 'should-cost' analysis estimate?", a: ["The market price", "What a product SHOULD cost to make", "The resale value", "The inflation rate"] }, c: 1 },
  { de: { q: "Welcher Standard wird häufig zur Spend-Klassifizierung genutzt?", a: ["UNSPSC", "IBAN", "SWIFT", "ISO 9001"] }, en: { q: "Which standard is widely used to classify spend?", a: ["UNSPSC", "IBAN", "SWIFT", "ISO 9001"] }, c: 0 },
  { de: { q: "Was bedeutet 'Sole Sourcing'?", a: ["Du wählst freiwillig einen Lieferanten", "Es gibt nur einen möglichen Lieferanten", "Du kaufst nur online", "Du nutzt nur einen Vertrag"] }, en: { q: "What does 'sole sourcing' mean?", a: ["You voluntarily pick one supplier", "Only one possible supplier exists", "You only buy online", "You use a single contract"] }, c: 1 },
  { de: { q: "Was misst 'DPO' (Days Payable Outstanding)?", a: ["Tage bis zur Lieferung", "Durchschnittliche Tage bis zur Zahlung an Lieferanten", "Tage bis Vertragsende", "Lagerreichweite in Tagen"] }, en: { q: "What does 'DPO' (Days Payable Outstanding) measure?", a: ["Days until delivery", "Average days taken to pay suppliers", "Days until contract end", "Inventory cover in days"] }, c: 1 },
  { de: { q: "Welches Gut steuert das Kartell 'OPEC'?", a: ["Gold", "Öl", "Weizen", "Lithium"] }, en: { q: "Which commodity does the 'OPEC' cartel manage?", a: ["Gold", "Oil", "Wheat", "Lithium"] }, c: 1 },
  { de: { q: "Was ist ein 'Letter of Intent' (LOI)?", a: ["Ein verbindlicher Kaufvertrag", "Eine Absichtserklärung vor dem finalen Vertrag", "Eine Rechnung", "Eine Lieferbestätigung"] }, en: { q: "What is a 'Letter of Intent' (LOI)?", a: ["A binding purchase contract", "A statement of intent before the final contract", "An invoice", "A delivery confirmation"] }, c: 1 },
];

export const Q_HARD: QuizQuestion[] = [
  { de: { q: "Das Wort 'procurement' kommt vom lateinischen 'procurare' - was heißt das?", a: ["erobern", "verwalten / sich kümmern", "bezahlen", "verkaufen"] }, en: { q: "'Procurement' comes from Latin 'procurare' - meaning?", a: ["to conquer", "to manage / take care of", "to pay", "to sell"] }, c: 1 },
  { de: { q: "Neben 'Just-in-Time' - wie heißt die zweite Säule des Toyota-Produktionssystems?", a: ["Jidoka", "Six Sigma", "Scrum", "Lean Canvas"] }, en: { q: "Besides 'just-in-time', what is the other pillar of the Toyota Production System?", a: ["Jidoka", "Six Sigma", "Scrum", "Lean Canvas"] }, c: 0 },
  { de: { q: "Was besagt das 'Pareto-Prinzip' beim Spend grob?", a: ["50 % Spend bei 50 % der Lieferanten", "~80 % des Spends bei ~20 % der Lieferanten", "20 % Spend bei 80 % der Lieferanten", "Alle Lieferanten gleich groß"] }, en: { q: "Roughly, what does the 'Pareto principle' say about spend?", a: ["50% of spend with 50% of suppliers", "~80% of spend with ~20% of suppliers", "20% of spend with 80% of suppliers", "All suppliers equal"] }, c: 1 },
  { de: { q: "Welches davon ist KEIN echter Incoterm?", a: ["FOB", "CIF", "DDP", "FYI"] }, en: { q: "Which of these is NOT a real Incoterm?", a: ["FOB", "CIF", "DDP", "FYI"] }, c: 3 },
  { de: { q: "Bei 'Vendor-Managed Inventory' (VMI) - wer steuert die Bestände?", a: ["Der Käufer", "Der Lieferant", "Ein Logistiker", "Die Bank"] }, en: { q: "Under 'Vendor-Managed Inventory' (VMI), who manages stock levels?", a: ["The buyer", "The supplier", "A logistics firm", "The bank"] }, c: 1 },
  { de: { q: "Was sind 'Scope-3-Emissionen' im Einkauf?", a: ["Eigene direkte Emissionen", "Emissionen aus eingekaufter Energie", "Indirekte Emissionen entlang der Lieferkette", "Nur CO₂ aus dem Fuhrpark"] }, en: { q: "What are 'Scope 3 emissions' in procurement?", a: ["Your own direct emissions", "Emissions from purchased energy", "Indirect emissions across the supply chain", "Fleet CO₂ only"] }, c: 2 },
  { de: { q: "Von wem stammt 'Price is what you pay, value is what you get'?", a: ["Jeff Bezos", "Warren Buffett", "Adam Smith", "Elon Musk"] }, en: { q: "Who said 'Price is what you pay, value is what you get'?", a: ["Jeff Bezos", "Warren Buffett", "Adam Smith", "Elon Musk"] }, c: 1 },
  { de: { q: "Wie funktioniert eine 'holländische Auktion' (Dutch auction)?", a: ["Startet niedrig und steigt", "Startet hoch und sinkt, bis jemand bietet", "Verdeckte Gebote", "Fester Einheitspreis"] }, en: { q: "How does a 'Dutch auction' work?", a: ["Starts low and rises", "Starts high and falls until someone bids", "Sealed bids", "Fixed flat price"] }, c: 1 },
  { de: { q: "Die ältesten bekannten schriftlichen Verträge (Tontafeln) stammen aus …?", a: ["dem alten Rom", "Mesopotamien / Sumer", "dem alten Ägypten", "der Han-Dynastie"] }, en: { q: "The earliest known written contracts (clay tablets) come from …?", a: ["ancient Rome", "Mesopotamia / Sumer", "ancient Egypt", "the Han dynasty"] }, c: 1 },
  { de: { q: "Was hebt den Gewinn direkter: 1 € im Einkauf gespart oder 1 € mehr Umsatz?", a: ["1 € mehr Umsatz", "1 € gespart (fließt direkt in den Gewinn)", "Beides exakt gleich", "Kommt nur auf die Steuer an"] }, en: { q: "What lifts profit more directly: €1 saved in procurement or €1 of extra revenue?", a: ["€1 of extra revenue", "€1 saved (drops straight to the bottom line)", "Exactly the same", "Depends only on tax"] }, c: 1 },
  { de: { q: "Was bedeutet 'Cherry Picking' beim Sourcing?", a: ["Nur Premium-Lieferanten wählen", "Einzelne Lose an die jeweils günstigsten Bieter vergeben", "Lieferanten ausschließen", "Nur regional einkaufen"] }, en: { q: "What is 'cherry picking' in sourcing?", a: ["Choosing only premium suppliers", "Awarding individual lots to the cheapest bidder each", "Excluding suppliers", "Buying only locally"] }, c: 1 },
  { de: { q: "Was deckt eine 'Force Majeure' (Höhere Gewalt)-Klausel ab?", a: ["Preiserhöhungen", "Unvorhersehbare Ereignisse, die die Erfüllung verhindern", "Qualitätsmängel", "Zahlungsverzug"] }, en: { q: "What does a 'force majeure' clause cover?", a: ["Price increases", "Unforeseeable events preventing fulfillment", "Quality defects", "Late payment"] }, c: 1 },
  { de: { q: "Welches Metall wird über den zweimal täglichen 'London Fix' bepreist?", a: ["Kupfer", "Gold", "Aluminium", "Stahl"] }, en: { q: "Which metal is priced via the twice-daily 'London Fix'?", a: ["Copper", "Gold", "Aluminium", "Steel"] }, c: 1 },
  { de: { q: "Was bedeutet 'Kaizen'?", a: ["Null Fehler", "Kontinuierliche Verbesserung", "Just-in-Time", "Massenfertigung"] }, en: { q: "What does 'Kaizen' mean?", a: ["Zero defects", "Continuous improvement", "Just-in-time", "Mass production"] }, c: 1 },
  { de: { q: "Welches Ereignis der 1970er erschütterte Lieferketten weltweit?", a: ["Die Dotcom-Blase", "Die OPEC-Ölkrise", "Der Brexit", "Die Finanzkrise 2008"] }, en: { q: "Which 1970s event shook global supply chains?", a: ["The dot-com bubble", "The OPEC oil crisis", "Brexit", "The 2008 financial crisis"] }, c: 1 },
];

/** Build a 15-question run: 5 easy → 5 medium → 5 hard, each tier shuffled. */
export function pickQuestions(): QuizQuestion[] {
  const pick = (arr: QuizQuestion[], n: number) =>
    [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  return [...pick(Q_EASY, 5), ...pick(Q_MED, 5), ...pick(Q_HARD, 5)];
}
