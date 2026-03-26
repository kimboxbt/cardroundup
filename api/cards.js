// /api/cards.js — Card data served from backend
// This keeps benefit data, affiliate links, and card details out of the frontend HTML
// Swap this for a real database read when ready

module.exports = (req, res) => {
  // Cache for 1 hour — data doesn't change that fast
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.setHeader('Content-Type', 'application/json');

  const AFF={
  csr:'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve?ICID=AFFL_KBYLI_CJ',
  csp:'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred?ICID=AFFL_KBYLI_CJ',
  cf:'https://creditcards.chase.com/cash-back-credit-cards/freedom/flex?ICID=AFFL_KBYLI_CJ',
  cfu:'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited?ICID=AFFL_KBYLI_CJ',
  ink:'https://creditcards.chase.com/business-credit-cards/ink/preferred?ICID=AFFL_KBYLI_CJ',
  hyatt:'https://creditcards.chase.com/travel-credit-cards/world-of-hyatt?ICID=AFFL_KBYLI_CJ',
  unitedq:'https://creditcards.chase.com/travel-credit-cards/united/quest?ICID=AFFL_KBYLI_CJ',
  swpri:'https://creditcards.chase.com/travel-credit-cards/southwest/priority?ICID=AFFL_KBYLI_CJ',
  ihg:'https://creditcards.chase.com/travel-credit-cards/ihg?ICID=AFFL_KBYLI_CJ',
  marriottbon:'https://creditcards.chase.com/travel-credit-cards/marriott-bonvoy/boundless?ICID=AFFL_KBYLI_CJ',
  chaseaero:'https://creditcards.chase.com/travel-credit-cards/united/aeroplan?ICID=AFFL_KBYLI_CJ',
  amexp:'https://www.americanexpress.com/us/credit-cards/card/platinum/?eep=AFFL_KBYLI_IMP',
  amexbp:'https://www.americanexpress.com/us/credit-cards/card/business-platinum/?eep=AFFL_KBYLI_IMP',
  amexg:'https://www.americanexpress.com/us/credit-cards/card/gold-card/?eep=AFFL_KBYLI_IMP',
  amexbg:'https://www.americanexpress.com/us/credit-cards/card/business-gold-card/?eep=AFFL_KBYLI_IMP',
  amexgrn:'https://www.americanexpress.com/us/credit-cards/card/green-card/?eep=AFFL_KBYLI_IMP',
  amexbcp:'https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/?eep=AFFL_KBYLI_IMP',
  amexeday:'https://www.americanexpress.com/us/credit-cards/card/amex-everyday-preferred/?eep=AFFL_KBYLI_IMP',
  deltagrn:'https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-gold/?eep=AFFL_KBYLI_IMP',
  deltag:'https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-gold-business/?eep=AFFL_KBYLI_IMP',
  deltares:'https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-reserve/?eep=AFFL_KBYLI_IMP',
  aspire:'https://www.americanexpress.com/us/credit-cards/card/hilton-honors-aspire/?eep=AFFL_KBYLI_IMP',
  hiltsurp:'https://www.americanexpress.com/us/credit-cards/card/hilton-honors-surpass/?eep=AFFL_KBYLI_IMP',
  brilliant:'https://www.americanexpress.com/us/credit-cards/card/marriott-bonvoy-brilliant/?eep=AFFL_KBYLI_IMP',
  mariottbiz:'https://www.americanexpress.com/us/credit-cards/card/marriott-bonvoy-business/?eep=AFFL_KBYLI_IMP',
  hiltbiz:'https://www.americanexpress.com/us/credit-cards/card/hilton-honors-business/?eep=AFFL_KBYLI_IMP',
  venturex:'https://creditcards.capitalone.com/venture-x-credit-card/?external_id=AFFL_KBYLI_IMP',
  venture:'https://creditcards.capitalone.com/venture-rewards-credit-card/?external_id=AFFL_KBYLI_IMP',
  sparkcash:'https://creditcards.capitalone.com/spark-business-credit-cards/miles/?external_id=AFFL_KBYLI_IMP',
  sparkcash2:'https://creditcards.capitalone.com/spark-business-credit-cards/cash-plus/?external_id=AFFL_KBYLI_IMP',
  savor:'https://creditcards.capitalone.com/savor-cash-rewards-credit-card/?external_id=AFFL_KBYLI_IMP',
  strata:'https://www.citi.com/credit-cards/citi-strata-premier-credit-card/?ICID=AFFL_KBYLI_CJ',
  aaexec:'https://www.citi.com/credit-cards/american-airlines/aadvantage-executive/?ICID=AFFL_KBYLI_CJ',
  aaplatpres:'https://www.citi.com/credit-cards/american-airlines/aadvantage-platinum-select/?ICID=AFFL_KBYLI_CJ',
  doublecash:'https://www.citi.com/credit-cards/citi-double-cash-credit-card/?ICID=AFFL_KBYLI_CJ',
  custcash:'https://www.citi.com/credit-cards/citi-custom-cash-card/?ICID=AFFL_KBYLI_CJ',
  rewardsp:'https://www.citi.com/credit-cards/citi-rewards-plus-credit-card/?ICID=AFFL_KBYLI_CJ',
  bilt:'https://www.biltrewards.com/card?ref=KBYLI',
  wfauto:'https://creditcards.wellsfargo.com/autograph-journey-visa-credit-card/?product_code=AFFL_KBYLI',
  altres:'https://www.usbank.com/credit-cards/altitude-reserve-visa-infinite-credit-card.html?pid=KBYLI',
  altconn:'https://www.usbank.com/credit-cards/altitude-connect-visa-signature-credit-card.html?pid=KBYLI',
  boapre:'https://www.bankofamerica.com/credit-cards/products/premium-rewards-elite-credit-card/?ref=KBYLI',
  boatrav:'https://www.bankofamerica.com/credit-cards/products/travel-rewards-credit-card/?ref=KBYLI',
  aadvbiz:'https://cards.barclay.com/aviator/silver?ref=KBYLI',
  jbtravel:'https://cards.barclay.com/jetblue-plus?ref=KBYLI',
  aadvsel:'https://cards.barclay.com/aviator-red?ref=KBYLI',
};

  const PROMOS=[
  {currency:'Amex MR',partner:'Air France/Flying Blue',bonus:'+30%',expires:'2026-04-15',cards:['amexp','amexbp','amexg','amexbg','amexgrn','amexeday','deltares','aspire','brilliant','mariottbiz','deltagrn','deltag']},
  {currency:'Amex MR',partner:'Avianca LifeMiles',bonus:'+20%',expires:'2026-03-31',cards:['amexp','amexbp','amexg','amexbg','amexgrn']},
  {currency:'Chase UR',partner:'United MileagePlus',bonus:'+25%',expires:'2026-05-01',cards:['csr','csp','cf','cfu','ink']},
  {currency:'Citi TY',partner:'Turkish Miles&Smiles',bonus:'+20%',expires:'2026-04-30',cards:['strata','aaexec','aaplatpres','doublecash','custcash','rewardsp']},
  {currency:'Capital One',partner:'Air Canada Aeroplan',bonus:'+10%',expires:'2026-03-28',cards:['venturex','venture','sparkcash','sparkcash2','savor']},
  {currency:'Bilt Points',partner:'World of Hyatt',bonus:'+25%',expires:'2026-04-01',cards:['bilt']},
];

  const ISSUERS=['Chase','American Express','Capital One','Citi','Wells Fargo','U.S. Bank','Bank of America','Barclays'];

  const CARDS=[
// ── CHASE ────────────────────────────────────────────────────────────
{id:'csr',name:'Chase Sapphire Reserve',short:'CSR',issuer:'Chase',fee:795,c:'#082050',cm:'#4A80D8',verified:'2026-03',
  sources:{primary:'https://account.chase.com/sapphire/reserve/benefits',secondary:'https://thepointsguy.com/credit-cards/chase-sapphire-reserve-credits/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'125,000 Ultimate Rewards points',req:'$6,000 in 3 months',tags:['t']},
  credits:{monthly:[{n:'Lyft rides',a:'$10/mo',note:'Link card. Valid through Sept 2027. Excludes Wait & Save, bike/scooter.'},{n:'DoorDash promos',a:'$25/mo',note:'2x$10 non-restaurant + 1x$5 restaurant. Requires DashPass. Unused balance forfeited if order does not exhaust credit.'},{n:'Peloton membership',a:'Up to $10/mo',note:'Through Dec 2027. Pay Peloton directly. Activation required.'}],quarterly:[],semiannual:[{n:'The Edit hotel credit',a:'$500/yr (2 uses of $250)',note:'Prepaid 2-night min via Chase Travel. 2026: flexible — both credits usable anytime, no H1/H2 restriction.'},{n:'Exclusive Tables dining',a:'$150/half ($300/yr)',note:'At Sapphire Reserve Exclusive Tables / OpenTable Visa Dining.'},{n:'StubHub / Viagogo',a:'$150/half ($300/yr)',note:'Activation required.'}],annual:[{n:'NEW 2026: Select hotel credit',a:'$250 (thru 12/31/26)',note:'IHG, Omni, Virgin, Montage, Pendry, Minor Hotels, Pan Pacific via Chase Travel. 2-night min. 2026 only.'},{n:'Travel credit — Anniversary-based',a:'$300/yr',warn:true,note:'Resets on cardmember anniversary — NOT Jan 1. Covers flights, hotels, transit, rideshare. Auto-applied.'},{n:'The Shops at Chase',a:'Up to $250',note:'Dyson, Sony, Tumi, Therabody. Resets Jan 1.'},{n:'Apple TV+ & Apple Music',a:'Compl. (~$250)',note:'Through June 22, 2027.'},{n:'DashPass membership',a:'Compl. (~$120)',note:'Activate by Dec 31, 2027.'}],multiyear:[{n:'Global Entry / TSA PreCheck / NEXUS',a:'Up to $120/4 yrs',note:''}],static:[{n:'Points Boost',a:'Up to 2x pts value',note:'Points worth up to 2x on top-booked hotels & select premium flights via Chase Travel.'},{n:'IHG Platinum Elite status',a:'Compl. thru 12/31/27',note:'Activate in Benefits section on chase.com or Chase Mobile app.'},{n:'Lounge access',a:'Unlimited + 2 guests',note:'Chase Sapphire Lounges + Priority Pass Select (1,300+) + Air Canada Maple Leaf Lounges.'},{n:'8x Chase Travel',a:'8x UR pts',note:'Flights, hotels, rentals, cruises, activities via Chase Travel incl. The Edit.'},{n:'4x direct bookings',a:'4x UR pts',note:'Flights & hotels booked directly with airline or hotel.'},{n:'Trip cancellation/interruption',a:'$10k/traveler, $20k/trip',note:''},{n:'Trip delay reimbursement',a:'Up to $500/ticket',note:'6+ hour delay.'},{n:'Primary auto rental CDW',a:'Included',note:''},{n:'Points transfers',a:'1:1 to 14 partners',note:'United, Hyatt, SW, BA, Singapore, AF/KLM, Marriott.'}]},
  summary:{rows:[{l:'Monthly (ann.)',a:'Up to $540',v:540},{l:'Semi-annual',a:'Up to $1,100',v:1100},{l:'Annual credits',a:'Up to $1,050',v:1050}],total:'~$2,690+',totalV:2690,note:'Plus Points Boost, IHG Platinum Elite, Apple TV/Music, DashPass, lounge access.'}},

{id:'csp',name:'Chase Sapphire Preferred',short:'CSP',issuer:'Chase',fee:95,c:'#0A2868',cm:'#3A6EC4',verified:'2026-03',
  sources:{primary:'https://account.chase.com/sapphire/preferred/benefits',secondary:'https://www.nerdwallet.com/credit-cards/learn/benefits-chase-sapphire-preferred',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'75,000 UR points',req:'$5,000 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Hotel credit via Chase Travel',a:'Up to $50/yr',note:'Resets on cardmember anniversary.'},{n:'10% anniversary points boost',a:'10% of prior year purchases',note:'Bonus points each anniversary equal to 10% of total purchases made prior year. No cap.'},{n:'DashPass membership',a:'Complimentary',note:'Must activate by 12/31/27.'}],multiyear:[],static:[{n:'3x dining & streaming',a:'3x UR pts',note:''},{n:'5x Chase Travel',a:'5x UR pts',note:''},{n:'Points transfers',a:'1:1 to 14 partners',note:''}]},
  summary:{rows:[{l:'Annual hotel credit',a:'Up to $50',v:50}],total:'~$50+',totalV:50,note:'Value is in 1:1 transfers to Hyatt/United/SW at $95 fee.'}},

{id:'cf',name:'Chase Freedom Flex',short:'Freedom Flex',issuer:'Chase',fee:0,c:'#0E3878',cm:'#3878C8',verified:'2026-03',
  sources:{primary:'https://creditcards.chase.com/cash-back-credit-cards/freedom/flex',secondary:'https://upgradedpoints.com/credit-cards/reviews/chase-freedom-flex-card/benefits/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'$200 cash + 5% gas/grocery yr 1',req:'$500 in 3 months',tags:['c']},
  credits:{monthly:[],quarterly:[{n:'5% rotating categories',a:'5% (up to $1,500/qtr)',note:'Must activate quarterly.'}],semiannual:[],annual:[],multiyear:[],static:[{n:'3x dining & drugstores',a:'3x UR pts',note:''},{n:'Cell phone protection',a:'Up to $800/claim',note:'Max 2 claims per 12 months, $1,000/yr cap. $50 deductible per claim. Phone must be on bill paid with card.'},{n:'Peacock credit',a:'$3/mo ($36/yr)',note:'Mastercard World Elite benefit. Statement credit on Peacock subscription.'}]},
  summary:{rows:[{l:'Quarterly 5% categories',a:'Up to $300/yr',v:300}],total:'~$300+',totalV:300,note:'Pairs with CSR/CSP to unlock travel transfers.'}},

{id:'cfu',name:'Chase Freedom Unlimited',short:'Freedom Unlimited',issuer:'Chase',fee:0,c:'#103070',cm:'#3268B8',verified:'2026-03',
  sources:{primary:'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited',secondary:'https://www.nerdwallet.com/credit-cards/learn/benefits-of-the-chase-freedom-and-chase-freedom-unlimited',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'Extra 1.5% all purchases yr 1',req:'None',tags:['c']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[],multiyear:[],static:[{n:'1.5x everywhere',a:'1.5x UR pts',note:''},{n:'3x dining & drugstores',a:'3x UR pts',note:''},{n:'5x Chase Travel',a:'5x UR pts',note:''}]},
  summary:{rows:[],total:'$0 fee',totalV:0,note:'Value is 1.5x UR on everything.'}},

{id:'ink',name:'Ink Business Preferred',short:'Ink Preferred',issuer:'Chase',fee:95,c:'#0C2C60',cm:'#2C5CA8',verified:'2026-03',
  sources:{primary:'https://creditcards.chase.com/business-credit-cards/ink/business-preferred',secondary:'https://awardwallet.com/credit-cards/chase-ultimate-rewards/chase-ink-preferred-benefits/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'90,000 UR points',req:'$8,000 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[],multiyear:[],static:[{n:'3x on first $150k (travel, shipping, ads, internet)',a:'3x UR pts',note:'$150k cap then 1x.'},{n:'Cell phone protection',a:'Up to $1,000/claim',note:'$100 deductible.'},{n:'Points transfers',a:'1:1 to 14 partners',note:''}]},
  summary:{rows:[],total:'~$0 in credits',totalV:0,note:'Value: 90k sign-on + best 3x business earning.'}},

{id:'hyatt',name:'Chase World of Hyatt',short:'Hyatt',issuer:'Chase',fee:95,c:'#164870',cm:'#3A80C0',verified:'2026-03',
  sources:{primary:'https://creditcards.chase.com/travel-credit-cards/world-of-hyatt',secondary:'https://thepointsguy.com/credit-cards/chase-world-of-hyatt-card-benefits/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'30,000 Hyatt pts + up to 30k more',req:'$3,000 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Free Night Cert (Cat 1-4)',a:'1 cert/yr',note:'On anniversary. Typically $100-$350+.'},{n:'2nd Free Night at $15k spend',a:'Cat 1-4 cert',note:''}],multiyear:[],static:[{n:'Hyatt Discoverist status',a:'Complimentary',note:''},{n:'5 Elite Night Credits',a:'Annually',note:'Plus 2 per $5k spend.'},{n:'4x at Hyatt',a:'4x WoH pts',note:''}]},
  summary:{rows:[{l:'Annual cert (Cat 1-4)',a:'~$100-$350',v:200}],total:'~$150-$700+',totalV:200,note:'Two certs at $15k spend = $500-$700 value.'}},

{id:'unitedq',name:'Chase United Quest',short:'United Quest',issuer:'Chase',fee:350,c:'#1A3878',cm:'#4070D0',verified:'2026-03',
  sources:{primary:'https://cardmembers.united.com/Quest',secondary:'https://www.nerdwallet.com/travel/learn/united-quest-card-underrated-reasons',tracker:'https://www.asksebby.com/articles/huge-update-to-chase-united-cards',date:'2026-03-26'},
  sob:{offer:'80,000 United miles + 3,000 PQP',req:'$4,000 in 3 months',tags:['t']},
  credits:{monthly:[{n:'Rideshare credit',a:'Up to $100/yr',note:'$8 back/mo Jan-Nov, $12 Dec. Enrollment required. On rideshare purchases.'}],quarterly:[],semiannual:[],annual:[{n:'United TravelBank cash',a:'$200/yr',note:'Automatically credited on account anniversary for United/United Express flights.'},{n:'10,000-mile award flight discount',a:'Annually',note:'On any eligible United award flight. Additional 10k discount after $20k annual spend.'},{n:'Renowned Hotels credit',a:'Up to $150/yr (anniversary year)',note:'Prepaid stays via Renowned Hotels and Resorts for United Cardmembers. Earns 5x miles.'}],multiyear:[{n:'Global Entry / TSA PreCheck / NEXUS',a:'Up to $120/4 yrs',note:''}],static:[{n:'2 free checked bags',a:'Cardholder + 1 companion',note:'On United-operated flights. Must include MileagePlus number and book with card.'},{n:'Priority boarding',a:'Included',note:''},{n:'25% back on inflight',a:'Statement credit',note:'Food, beverages, Wi-Fi on United flights. Premium Club drinks.'},{n:'PQP from spend',a:'Up to 18,000/yr',note:'1 PQP per $20 spent. Up to 18k PQP/yr toward Premier status.'},{n:'1,000 Card Bonus PQP annually',a:'Starting 2026',note:'Deposited ~Feb 1 each year. Counts toward Premier 1K.'},{n:'3x on United',a:'3x United miles',note:''},{n:'2x on travel, dining, streaming',a:'2x United miles',note:''}]},
  summary:{rows:[{l:'TravelBank cash',a:'$200',v:200},{l:'Award flight discount',a:'10k miles (~$150)',v:150},{l:'Renowned Hotels credit',a:'Up to $150',v:150},{l:'Rideshare credit',a:'Up to $100',v:100}],total:'~$600+',totalV:600,note:'United Club passes removed. $125 credit replaced by $200 TravelBank. Numerous new credits added.'}},
{id:'swpri',name:'Chase Southwest Priority',short:'SW Priority',issuer:'Chase',fee:229,c:'#1E3888',cm:'#4878D8',verified:'2026-03',
  sources:{primary:'https://creditcards.chase.com/travel-credit-cards/southwest/priority',secondary:'https://www.nerdwallet.com/credit-cards/news/southwest-cards-hike-fees-and-welcome-offers-add-perks-and-bonus-categories',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'40,000 Rapid Rewards + Companion Pass thru 2/28/27',req:'$5,000 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Anniversary bonus points',a:'7,500 pts/yr',note:'Posted each cardmember anniversary. Worth ~$112.'},{n:'First checked bag free',a:'Cardholder + 8 passengers',note:'On any Southwest reservation. Saves up to $280 roundtrip for family of 4.'},{n:'Preferred seat at booking',a:'Complimentary',note:'Select Preferred or Standard seat at booking for you + up to 8. Applies to 2026+ flights with assigned seating.'},{n:'Extra Legroom upgrade',a:'Unlimited (48hr prior)',note:'Upgrade to Extra Legroom seat within 48 hours of departure at no charge. You + up to 8.'},{n:'Group 5 priority boarding',a:'Complimentary',note:'You + up to 8 passengers.'},{n:'10k Companion Pass qualifying pts',a:'Annual boost',note:'Reduces annual 135k requirement to 125k.'},{n:'25% back on inflight purchases',a:'Statement credit',note:'Food, beverages, Wi-Fi on Southwest flights.'}],multiyear:[],static:[{n:'2,500 TQPs per $5k spend',a:'Toward A-List status',note:'Accelerate to A-List (35k TQPs/yr required). Uncapped annually.'},{n:'4x on Southwest',a:'4x Rapid Rewards',note:''},{n:'2x gas stations & restaurants',a:'2x Rapid Rewards',note:''},{n:'No foreign transaction fees',a:'Included',note:''}]},
  summary:{rows:[{l:'Anniversary bonus',a:'7,500 pts (~$112)',v:112},{l:'Bag savings (family of 4 round trip)',a:'Up to $280',v:140}],total:'~$250+ (depends on travel)',totalV:250,note:'$75 travel credit and 4 upgraded boardings ended 12/31/2025. Replaced by seat/bag perks.'}},
{id:'ihg',name:'IHG One Rewards Premier',short:'IHG Premier',issuer:'Chase',fee:99,c:'#123068',cm:'#2C5CB8',verified:'2026-03',
  sources:{primary:'https://creditcards.chase.com/travel-credit-cards/ihg-rewards-club/premier',secondary:'https://thepointsguy.com/credit-cards/ihg-one-rewards-premier-credit-card/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'140,000 IHG points',req:'$3,000 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Free Night Cert (<=40k pts)',a:'1 cert/yr',note:'Holiday Inn to select InterContinental.'},{n:'4th Night Free on award stays',a:'Complimentary',note:'4th night free on consecutive 4-night award stays at same hotel.'},{n:'$100 credit + 10k bonus pts',a:'After $20k/calendar yr',note:'Earn $100 statement credit and 10,000 IHG bonus points after $20,000 in calendar year purchases.'}],multiyear:[{n:'Global Entry / TSA PreCheck',a:'Up to $100/4 yrs',note:''}],static:[{n:'$50 United TravelBank Cash/yr',a:'After MileagePlus registration',note:'Register IHG Premier card with MileagePlus account to receive $50 United TravelBank Cash per year.'},{n:'DashPass membership',a:'Complimentary 1 yr',note:'Activate by 12/31/27.'},{n:'Diamond Elite after $40k spend',a:'Through 12/31 following year',note:'Spend $40k in calendar year to unlock IHG Diamond Elite Status.'},{n:'IHG Platinum Elite status',a:'Complimentary',note:''},{n:'26x at IHG properties',a:'26x IHG pts',note:''}]},
  summary:{rows:[{l:'Annual free night',a:'<=40k pts (~$100-$300)',v:200}],total:'~$100-$300+',totalV:200,note:'4th night free is a hidden gem.'}},

{id:'marriottbon',name:'Chase Bonvoy Boundless',short:'Bonvoy Boundless',issuer:'Chase',fee:95,c:'#0E2858',cm:'#2858A8',verified:'2026-03',
  sources:{primary:'https://creditcards.chase.com/travel-credit-cards/marriott-bonvoy/boundless',secondary:'https://thepointsguy.com/credit-cards/marriott-bonvoy-boundless/',tracker:'https://awardwallet.com/credit-cards/chase-credit-card-offer-history/',date:'2026-03-26'},
  sob:{offer:'3 Free Night Awards (<=50k pts each)',req:'$3,000 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[{n:'Airline credit (2026 exclusive)',a:'$50/half ($100/yr)',note:'After $500 eligible airline spend per half-year. Through 12/31/2026 only.'}],annual:[{n:'Free Night Award (<=35k pts)',a:'1 cert/yr',note:'Cat 1-5 Marriott.'}],multiyear:[],static:[{n:'Marriott Silver Elite',a:'Complimentary',note:''},{n:'15 Elite Night Credits',a:'Annually',note:''},{n:'6x at Marriott',a:'6x Marriott pts',note:''}]},
  summary:{rows:[{l:'Annual free night',a:'<=35k pts (~$100-$250)',v:175},{l:'2026 airline credit',a:'Up to $100',v:100}],total:'~$175-$350+',totalV:275,note:''}},

{id:'chaseaero',name:'Chase Aeroplan',short:'Chase Aeroplan',issuer:'Chase',fee:95,c:'#163A80',cm:'#3870C8',verified:'2026-03',
  sources:{primary:'https://creditcards.chase.com/travel-credit-cards/united/aeroplan',secondary:'https://awardwallet.com/credit-cards/chase-credit-card-offer-history/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'100,000 Aeroplan pts',req:'$4,000 in 3 months',tags:['t']},
  credits:{monthly:[{n:'DoorDash credit',a:'Up to $5/mo ($60/yr)',note:'Requires DashPass.'}],quarterly:[],semiannual:[],annual:[{n:'250 Status Qualifying Dollars',a:'Toward Air Canada status',note:''}],multiyear:[{n:'Global Entry / TSA PreCheck',a:'Up to $100/4 yrs',note:''}],static:[{n:'500 bonus pts per $2k/mo spend',a:'Up to 1,500 pts/mo',note:'Earn 500 bonus Aeroplan points for every $2,000 spent in a calendar month (max 1,500 pts/mo).'},{n:'10% bonus on UR→Aeroplan transfers',a:'Bonus miles on transfer',note:'Transfer Chase Ultimate Rewards to Aeroplan and get 10% more Aeroplan points.'},{n:'Aeroplan 25K Status after $15k/yr',a:'Valid following calendar year',note:'Spend $15,000 in a calendar year to earn Aeroplan 25K Status for the following year.'},{n:'3x Air Canada & Aeroplan partners',a:'3x Aeroplan pts',note:''},{n:'3x dining & grocery',a:'3x Aeroplan pts',note:''},{n:'Free first bag',a:'Complimentary',note:'On Air Canada.'}]},
  summary:{rows:[{l:'Monthly DoorDash (ann.)',a:'Up to $60',v:60}],total:'~$60+',totalV:60,note:'Best card for Aeroplan loyalists.'}},

// ── AMERICAN EXPRESS ────────────────────────────────────────────────────────
{id:'amexp',name:'Amex Platinum Personal',short:'Plat Personal',issuer:'American Express',fee:895,c:'#A87800',cm:'#D4A820',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/en-us/credit-cards/credit-intel/platinum-fee/',secondary:'https://thepointsguy.com/credit-cards/amex-platinum-use-credits-before-end-quarter/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'Up to 175,000 MR points (personalized)',req:'$12,000 in 6 months',tags:['t']},
  credits:{monthly:[{n:'Uber Cash',a:'$15/mo (Jan-Nov), $35 Dec',warn:true,note:'Expires end of month — no rollover. U.S. only.'},{n:'Digital entertainment',a:'Up to $25/mo',note:'Disney+, Hulu, ESPN+, Peacock, Paramount+, YouTube Premium, YouTube TV, NYT, WSJ.'},{n:'Walmart+ membership',a:'Up to $12.95/mo',note:'Covers monthly cost.'}],quarterly:[{n:'Resy dining',a:'Up to $100/qtr ($400/yr)',note:'Any U.S. Resy-affiliated restaurant. No rollover. New Sept 2025.'},{n:'Lululemon',a:'Up to $75/qtr ($300/yr)',note:'U.S. stores (excl. outlets). No rollover.'}],semiannual:[{n:'Saks Fifth Avenue',a:'$50/half ($100/yr)',note:'Two $50 credits per year. No minimum purchase. H1/H2.'},{n:'Fine Hotels + Resorts / Hotel Collection',a:'$300/half ($600/yr)',note:'Prepaid AmexTravel.com. H1/H2.'}],annual:[{n:'Airline incidental fees',a:'Up to $200/yr',note:'ONE qualifying airline. Bags, upgrades — NOT airfare.'},{n:'CLEAR Plus',a:'Up to $209/yr',note:''},{n:'OURA Ring',a:'Up to $200/yr',note:'OURAring.com only.'},{n:'Equinox membership',a:'Up to $300/yr',note:''},{n:'Uber One membership',a:'Up to $120/yr',note:'Separate from monthly Uber Cash.'}],multiyear:[{n:'Global Entry / TSA PreCheck',a:'Up to $120/4 yrs',note:''}],static:[{n:'Centurion Lounge access',a:'Unlimited (solo)',note:'Guest access requires $75k annual spend.'},{n:'Priority Pass Select',a:'Unlimited visits',note:''},{n:'Delta Sky Club',a:'10 visits/year',note:''},{n:'Marriott Bonvoy Gold',a:'Complimentary',note:''},{n:'Hilton Honors Gold',a:'Complimentary',note:''},{n:'Points transfers',a:'1:1 to 20+ partners',note:''}]},
  summary:{rows:[{l:'Monthly (ann.)',a:'Up to $575',v:575},{l:'Quarterly (ann.)',a:'Up to $700',v:700},{l:'Semi-annual',a:'Up to $700',v:700},{l:'Annual credits',a:'Up to $1,029',v:1029}],total:'~$3,004+',totalV:3004,note:'Plus Centurion Lounge, hotel/car status, transfer partners.'}},

{id:'amexbp',name:'Amex Biz Platinum',short:'Biz Platinum',issuer:'American Express',fee:895,c:'#907000',cm:'#C09818',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/business-platinum/',secondary:'https://www.cnbc.com/select/amex-business-platinum-card-2025-changes/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'200,000 MR points',req:'$20,000 in 3 months',tags:['t']},
  credits:{monthly:[{n:'Wireless phone service',a:'Up to $10/mo ($120/yr)',note:'U.S. wireless providers only.'}],quarterly:[{n:'Indeed',a:'Up to $90/qtr ($360/yr)',note:'Indeed.com purchases.'},{n:'Hilton (via Hilton for Business)',a:'Up to $50/qtr ($200/yr)',note:'Direct Hilton purchases.'}],semiannual:[{n:'Fine Hotels + Resorts / Hotel Collection',a:'$300/half ($600/yr)',note:'H1/H2.'}],annual:[{n:'Dell Technologies credit',a:'Up to $1,150/yr',note:'$150 base/yr + $1,000 more after $5k Dell spend/yr. Enrollment required.'},{n:'Adobe credit',a:'$250/yr',note:'After spending $600+ at Adobe per calendar year. Enrollment required.'},{n:'Airline incidental fees',a:'Up to $200/yr',note:''},{n:'CLEAR Plus',a:'Up to $209/yr',note:''},{n:'35% Pay with Points rebate',a:'Up to 35% back in pts',note:'Select airline bookings via Amex Travel.'}],multiyear:[{n:'Global Entry / TSA PreCheck',a:'Up to $120/4 yrs',note:''}],static:[{n:'Centurion Lounge access',a:'Unlimited (solo)',note:''},{n:'Leaders Club Sterling Status',a:'Complimentary',note:'New 2025. Breakfast for 2 at Leading Hotels of the World.'},{n:'Points transfers',a:'1:1 to 20+ partners',note:''}]},
  summary:{rows:[{l:'Monthly (ann.)',a:'Up to $120',v:120},{l:'Quarterly (ann.)',a:'Up to $560',v:560},{l:'Semi-annual',a:'Up to $600',v:600},{l:'Annual credits',a:'Up to $1,809',v:1809}],total:'~$3,089+',totalV:3089,note:'Dell/Adobe credits make this exceptional for tech-spending businesses.'}},

{id:'amexg',name:'Amex Gold Personal',short:'Gold Personal',issuer:'American Express',fee:325,c:'#B87C08',cm:'#E0A030',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/gold-card/',secondary:'https://moorewithmiles.com/2026/01/why-the-american-express-gold-card-is-worth-it-in-2026/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'Up to 100,000 MR points',req:'$6,000 in 6 months',tags:['t']},
  credits:{monthly:[{n:'Dining credit',a:'Up to $10/mo ($120/yr)',note:'Grubhub, Cheesecake Factory, Goldbelly, Wine.com, Milk Bar, select Shake Shack.'},{n:'Uber Cash',a:'Up to $10/mo ($120/yr)',note:'Uber rides or Eats. No rollover.'},{n:'Dunkin',a:'Up to $7/mo ($84/yr)',note:'U.S. locations. No rollover.'}],quarterly:[],semiannual:[{n:'Resy dining credit',a:'$50/half ($100/yr)',note:'$50 H1 (Jan-Jun) + $50 H2 (Jul-Dec) at any U.S. Resy restaurant. Enrollment required.'}],annual:[{n:'Hotel Collection credit',a:'Up to $100/stay',note:'Via AmexTravel.com. 2-night min. Once per year.'}],multiyear:[],static:[{n:'4x restaurants worldwide',a:'4x MR pts',note:'No cap.'},{n:'4x U.S. supermarkets',a:'4x MR (up to $25k/yr)',note:''},{n:'3x on flights',a:'3x MR pts',note:''}]},
  summary:{rows:[{l:'Monthly (ann.)',a:'Up to $324',v:324},{l:'Semi-annual Resy',a:'Up to $100',v:100},{l:'Annual credit',a:'Up to $100',v:100}],total:'~$524+',totalV:524,note:''}},

{id:'amexbg',name:'Amex Business Gold',short:'Biz Gold',issuer:'American Express',fee:375,c:'#A07008',cm:'#C89020',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/business-gold-card/',secondary:'https://thepointsguy.com/credit-cards/amex-business-gold-card/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'100,000 MR points',req:'$15,000 in 3 months',tags:['t']},
  credits:{monthly:[{n:'Dining & wireless credits',a:'Up to $20/mo ($240/yr)',note:'Eligible U.S. restaurants + wireless.'}],quarterly:[],semiannual:[],annual:[],multiyear:[],static:[{n:'4x in top 2 categories/month',a:'4x MR per billing cycle',note:'Auto-selects highest 2 from 6 eligible.'}]},
  summary:{rows:[{l:'Monthly credits (ann.)',a:'Up to $240',v:240}],total:'~$240+',totalV:240,note:''}},

{id:'amexgrn',name:'Amex Green Card',short:'Green',issuer:'American Express',fee:150,c:'#1A6A38',cm:'#28A050',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/green-card/',secondary:'https://thepointsguy.com/credit-cards/american-express-green-card/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-critics-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'40,000 MR points',req:'$3,000 in 6 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'CLEAR Plus',a:'Up to $209/yr',note:'Annual CLEAR+ membership reimbursement.'}],multiyear:[],static:[{n:'3x travel worldwide',a:'3x MR pts',note:'Flights, hotels, transit, rideshare — very broad.'},{n:'3x dining worldwide',a:'3x MR pts',note:''},{n:'Points transfers',a:'1:1 to 20+ partners',note:''}]},
  summary:{rows:[{l:'Annual credits',a:'Up to $209',v:209}],total:'~$209+',totalV:209,note:'Credits more than cover the $150 fee.'}},

{id:'amexbcp',name:'Amex Blue Cash Preferred',short:'BCP',issuer:'American Express',fee:95,c:'#1A5A30',cm:'#258840',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/',secondary:'https://www.nerdwallet.com/credit-cards/reviews/blue-cash-preferred-card-from-american-express',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'$250 statement credit',req:'$3,000 in 6 months',tags:['c']},
  credits:{monthly:[{n:'Disney Bundle credit',a:'Up to $7/mo ($84/yr)',note:'Disney+ Bundle. Auto applied.'}],quarterly:[],semiannual:[],annual:[],multiyear:[],static:[{n:'6% U.S. supermarkets',a:'6% cash (up to $6k/yr)',note:''},{n:'6% streaming',a:'6% cash',note:''},{n:'3% transit & gas',a:'3% cash',note:''}]},
  summary:{rows:[{l:'Monthly Disney Bundle',a:'Up to $84/yr',v:84}],total:'~$84+',totalV:84,note:''}},

{id:'amexeday',name:'Amex EveryDay Preferred',short:'EveryDay Pref',issuer:'American Express',fee:95,c:'#1E6438',cm:'#2A9048',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/amex-everyday-preferred/',secondary:'https://thepointsguy.com/credit-cards/amex-everyday-preferred/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'15,000 MR points',req:'$2,000 in 6 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[],multiyear:[],static:[{n:'No longer available to new applicants',a:'Existing cardholders only',warn:true,note:'Amex EveryDay Preferred is not open for new applications. Existing cardholders may keep their card.'},{n:'3x U.S. supermarkets',a:'3x MR (up to $6k/yr)',note:''},{n:'2x U.S. gas stations',a:'2x MR pts',note:''},{n:'50% bonus at 30+ uses/month',a:'1.5x all pts earned',note:''}]},
  summary:{rows:[],total:'~$0 in credits',totalV:0,note:''}},

{id:'deltagrn',name:'Delta SkyMiles Gold',short:'Delta Gold',issuer:'American Express',fee:150,c:'#903010',cm:'#C85020',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-gold/',secondary:'https://thepointsguy.com/credit-cards/delta-skymiles-gold-american-express-card/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'70k + 20k Delta miles (elevated)',req:'$3,000 + $2,000 in 6 months',tags:['t']},
  credits:{monthly:[{n:'Uber One credit',a:'Up to $9.99/mo',note:'Thru June 25, 2026 only.'}],quarterly:[],semiannual:[],annual:[{n:'Delta Stays credit',a:'$100/yr',note:'On prepaid Delta Stays bookings. Resets calendar year.'},{n:'Delta Flight Credit',a:'Up to $200/yr',note:'After $10k spend in calendar year on Delta purchases.'}],multiyear:[],static:[{n:'First bag free',a:'Complimentary',note:'Cardholder + up to 8.'},{n:'2x Delta, dining, supermarkets',a:'2x SkyMiles',note:''}]},
  summary:{rows:[{l:'Annual Delta credit',a:'Up to $200',v:200}],total:'~$200+',totalV:200,note:''}},

{id:'deltag',name:'Delta SkyMiles Gold Biz',short:'Delta Gold Biz',issuer:'American Express',fee:150,c:'#802808',cm:'#B04018',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-gold-business/',secondary:'https://awardwallet.com/credit-cards/use-statement-credits/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'90,000 Delta miles (elevated)',req:'$6,000 in 6 months',tags:['t']},
  credits:{monthly:[{n:'Uber One credit',a:'Up to $9.99/mo',note:'Thru June 25, 2026 only (6 months). Pay for Uber One monthly membership.'}],quarterly:[],semiannual:[{n:'Companion certificate',a:'1 cert/yr after renewal',note:'Delta Main domestic, Caribbean, or Central American round-trip. Taxes/fees apply.'},{n:'Delta Stays credit',a:'$100/yr',note:'On prepaid Delta Stays bookings. Resets calendar year.'},{n:'Delta travel credit',a:'Up to $250/yr',note:''}],multiyear:[],static:[{n:'First bag free for cardholder + 8',a:'Complimentary',note:''},{n:'2x Delta, restaurants, shipping, advertising',a:'2x SkyMiles',note:''}]},
  summary:{rows:[{l:'Annual Delta credit',a:'Up to $250',v:250}],total:'~$250+',totalV:250,note:''}},

{id:'deltares',name:'Delta SkyMiles Reserve',short:'Delta Reserve',issuer:'American Express',fee:650,c:'#601808',cm:'#903018',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-reserve/',secondary:'https://awardwallet.com/credit-cards/use-statement-credits/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'100k + 25k Delta SkyMiles (elevated)',req:'$6,000 + $3,000 in 6 months',tags:['t']},
  credits:{monthly:[{n:'Resy dining credit',a:'Up to $25/mo ($300/yr)',note:'At eligible U.S. Resy restaurants. Enrollment required.'},{n:'Uber One credit',a:'Up to $9.99/mo',note:'Thru June 25, 2026. Pay for Uber One monthly membership.'}],quarterly:[],semiannual:[],annual:[{n:'Domestic companion cert',a:'1 cert/yr',note:'Domestic first class or main cabin. Taxes/fees apply.'},{n:'$2,500 MQD head start',a:'Toward Medallion status',note:''}],multiyear:[{n:'Global Entry / TSA PreCheck',a:'Up to $120/4 yrs',note:''}],static:[{n:'Delta Sky Club',a:'15 visits/year',note:'Unlimited at $75k annual spend.'},{n:'Centurion Lounge (when flying Delta)',a:'Complimentary',note:''},{n:'3x on Delta',a:'3x SkyMiles',note:''}]},
  summary:{rows:[{l:'Monthly Resy dining (ann.)',a:'Up to $300',v:300},{l:'Companion cert',a:'Varies by route',v:400}],total:'~$700+ (incl. companion cert)',totalV:700,note:''}},

{id:'aspire',name:'Hilton Honors Aspire',short:'Aspire',issuer:'American Express',fee:550,c:'#5A1010',cm:'#903030',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/hilton-honors-aspire/',secondary:'https://thepointsguy.com/credit-cards/why-keep-hilton-amex-aspire-card/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'175,000 Hilton Honors points',req:'$6,000 in 6 months',tags:['t']},
  credits:{monthly:[],quarterly:[{n:'Airline & flight credit',a:'Up to $50/qtr ($200/yr)',note:'Eligible flight purchases directly with any airline or AmexTravel.com.'}],semiannual:[{n:'Hilton resort credit',a:'$200/half ($400/yr)',note:'Participating Hilton resorts. Verify qualifying charges. H1/H2.'}],annual:[{n:'CLEAR Plus',a:'Up to $209/yr',note:'After enrollment. Effective July 1, 2025.'},{n:'Free Night Reward (any Hilton property)',a:'1 cert/yr',note:'On anniversary. No points cap — valid at any Hilton worldwide. 2nd cert after $30k spend, 3rd after $60k.'}],multiyear:[],static:[{n:'Hilton Diamond status',a:'Complimentary',note:'Top-tier. Exec lounge, upgrades, breakfast at many properties.'},{n:'14x at Hilton',a:'14x Hilton pts',note:''}]},
  summary:{rows:[{l:'Quarterly airline (ann.)',a:'Up to $200',v:200},{l:'Semi-annual resort',a:'Up to $400',v:400},{l:'Annual free night (any prop)',a:'~$300-$800+',v:500}],total:'~$900-$1,400+',totalV:1000,note:'Priority Pass removed Oct 2023. Free night has no point cap.'}},

{id:'hiltsurp',name:'Hilton Honors Surpass',short:'Hilton Surpass',issuer:'American Express',fee:150,c:'#6A1818',cm:'#A03838',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/hilton-honors-surpass/',secondary:'https://upgradedpoints.com/news/hilton-honors-aspire-surpass-card-changes/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'130,000 pts + Free Night Reward',req:'$3,000 in 6 months',tags:['t']},
  credits:{monthly:[],quarterly:[{n:'Hilton resort credit',a:'Up to $50/qtr ($200/yr)',note:'Participating Hilton resorts.'}],semiannual:[],annual:[{n:'Free Night Reward (<=85k pts)',a:'1 cert (at $15k spend)',note:''}],multiyear:[],static:[{n:'Hilton Gold status',a:'Complimentary',note:''},{n:'Priority Pass Select',a:'10 visits/yr',note:''},{n:'12x at Hilton',a:'12x Hilton pts',note:''},{n:'4x online retail',a:'4x Hilton pts',note:'U.S. online purchases.'}]},
  summary:{rows:[{l:'Quarterly resort (ann.)',a:'Up to $200',v:200},{l:'Annual free night (at $15k)',a:'<=85k (~$200-$500)',v:350}],total:'~$200-$550+',totalV:400,note:''}},

{id:'brilliant',name:'Marriott Bonvoy Brilliant',short:'Brilliant',issuer:'American Express',fee:650,c:'#780A0A',cm:'#B83030',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/marriott-bonvoy-brilliant/',secondary:'https://awardwallet.com/credit-cards/marriott-bonvoy/amex-bonvoy-brilliant/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'95,000 Marriott Bonvoy points',req:'$6,000 in 6 months',tags:['t']},
  credits:{monthly:[{n:'Dining statement credit',a:'Up to $25/mo ($300/yr)',note:'Restaurants worldwide. Automatic. No rollover.'}],quarterly:[],semiannual:[],annual:[{n:'Free Night Award (<=85k pts)',a:'1 cert/yr',note:'Typically $200-$600+.'},{n:'St. Regis / Ritz-Carlton credit',a:'$100/stay',note:'Book Luxury Card Rate 2+ nights. Applies to spa, dining, activities.'}],multiyear:[{n:'Global Entry / TSA PreCheck',a:'Up to $120/4 yrs',note:''}],static:[{n:'Marriott Platinum Elite',a:'Complimentary',note:''},{n:'Priority Pass Select',a:'Up to 6 visits/yr',note:''},{n:'25 Elite Night Credits',a:'Annually',note:''}]},
  summary:{rows:[{l:'Monthly dining (ann.)',a:'Up to $300',v:300},{l:'Annual free night',a:'<=85k (~$200-$600)',v:400},{l:'Property credit',a:'$100/stay',v:100}],total:'~$600-$1,000+',totalV:800,note:''}},

{id:'mariottbiz',name:'Amex Bonvoy Business',short:'Bonvoy Biz',issuer:'American Express',fee:125,c:'#680808',cm:'#A02828',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/marriott-bonvoy-business/',secondary:'https://thepointsguy.com/credit-cards/marriott-bonvoy-business-amex/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'3 Free Night Awards (<=50k pts each)',req:'$6,000 in 6 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Free Night Award (<=35k pts)',a:'1 cert/yr after renewal',note:'Cat 1-5 Marriott. Can top up with 25k pts.'},{n:'Additional free night at $60k spend',a:'After $60k/calendar yr',note:'Earn extra free night (<=35k pts) after $60,000 in purchases in a calendar year.'}],multiyear:[],static:[{n:'Marriott Bonvoy Gold Elite',a:'Complimentary',note:'25% bonus points on paid stays, late checkout, room upgrades when available.'},{n:'7% room rate discount',a:'Amex Biz Card Rate',note:'Book directly through eligible Marriott channel for 7% off standard room rates.'},{n:'6x at Marriott',a:'6x Marriott pts',note:''},{n:'4x restaurants, gas, wireless, shipping, advertising',a:'4x Marriott pts',note:''},{n:'15 Elite Night Credits',a:'Annually',note:''}]},
  summary:{rows:[{l:'Annual free night',a:'<=35k (~$100-$250)',v:175}],total:'~$100-$250+',totalV:175,note:''}},

{id:'hiltbiz',name:'Hilton Honors Business',short:'Hilton Biz',issuer:'American Express',fee:195,c:'#501010',cm:'#882828',verified:'2026-03',
  sources:{primary:'https://www.americanexpress.com/us/credit-cards/card/hilton-honors-business/',secondary:'https://thepointsguy.com/credit-cards/hilton-honors-business-card/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'130,000 Hilton Honors points',req:'$3,000 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[{n:'Hilton resort credit',a:'Up to $60/qtr ($240/yr)',note:'Participating Hilton resorts.'}],semiannual:[],annual:[{n:'Free Night Reward (<=130k pts)',a:'1 cert (at $15k spend)',note:''}],multiyear:[],static:[{n:'Hilton Gold status',a:'Complimentary',note:''},{n:'Diamond status at $40k/yr',a:'Through following yr',note:'Spend $40,000 in calendar year to upgrade to Diamond status through end of next calendar year.'},{n:'12x at Hilton',a:'12x Hilton pts',note:''}]},
  summary:{rows:[{l:'Quarterly resort (ann.)',a:'Up to $240',v:240},{l:'Annual free night (at $15k)',a:'<=130k (~$500+)',v:400}],total:'~$240-$640+',totalV:500,note:''}},

// ── CAPITAL ONE ────────────────────────────────────────────────────────
{id:'venturex',name:'Capital One Venture X',short:'Venture X',issuer:'Capital One',fee:395,c:'#7A0808',cm:'#C02828',verified:'2026-03',
  sources:{primary:'https://www.capitalone.com/credit-cards/venture-x/',secondary:'https://awardwallet.com/credit-cards/capital-one-rewards/venture-x/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'75,000 miles',req:'$4,000 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Travel credit (Cap1 Travel)',a:'$300/yr',note:'Automatic on Cap1 Travel portal bookings.'},{n:'Anniversary bonus miles',a:'10,000 miles (~$100)',note:'On each anniversary.'}],multiyear:[{n:'Global Entry / TSA PreCheck',a:'Up to $100/4 yrs',note:''}],static:[{n:'Priority Pass Select',a:'Unlimited (solo)',note:'As of Feb 1 2026: guest access costs $35/person/visit for PP lounges. Capital One Lounge guests: $45/adult.'},{n:'Capital One Lounge',a:'Unlimited access',note:'DFW, DEN, IAD, LAS, JFK expanding. Authorized users $125/yr for lounge access (as of Feb 1, 2026).'},{n:'2x miles everywhere',a:'2x miles',note:''},{n:'10x hotels & car rentals',a:'10x miles',note:'Via Cap1 Travel.'},{n:'Primary auto rental CDW',a:'Included',note:''}]},
  summary:{rows:[{l:'Annual travel credit',a:'$300',v:300},{l:'Anniversary miles',a:'10k (~$100)',v:100}],total:'~$400+',totalV:400,note:'$300+$100 essentially offsets $395 fee.'}},

{id:'venture',name:'Capital One Venture',short:'Venture',issuer:'Capital One',fee:95,c:'#8A1010',cm:'#C83030',verified:'2026-03',
  sources:{primary:'https://www.capitalone.com/credit-cards/venture/',secondary:'https://thepointsguy.com/credit-cards/capital-one-venture-rewards-credit-card/',tracker:'https://www.doctorofcredit.com/best-current-credit-card-sign-bonuses/',date:'2026-03-26'},
  sob:{offer:'75,000 miles',req:'$4,000 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[],multiyear:[{n:'Global Entry / TSA PreCheck',a:'Up to $100/4 yrs',note:''}],static:[{n:'2x miles everywhere',a:'2x miles',note:''},{n:'5x hotels & car rentals',a:'5x miles',note:''},{n:'Transfer to 15+ partners',a:'1:1 to most',note:''}]},
  summary:{rows:[],total:'Global Entry credit only',totalV:0,note:''}},

{id:'sparkcash',name:'Cap1 Spark Miles',short:'Spark Miles',issuer:'Capital One',fee:95,c:'#6A0808',cm:'#A82020',verified:'2026-03',
  sources:{primary:'https://www.capitalone.com/small-business/credit-cards/spark-miles/',secondary:'https://awardwallet.com/credit-cards/capital-one-rewards/spark-miles/',tracker:'https://www.doctorofcredit.com/best-current-credit-card-sign-bonuses/',date:'2026-03-26'},
  sob:{offer:'50,000 miles',req:'$4,500 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[],multiyear:[{n:'Global Entry / TSA PreCheck',a:'Up to $100/4 yrs',note:''}],static:[{n:'2x miles everywhere',a:'2x miles',note:''},{n:'5x hotels & car rentals',a:'5x miles',note:''}]},
  summary:{rows:[],total:'~$100 (Global Entry)',totalV:100,note:''}},

{id:'sparkcash2',name:'Cap1 Spark Cash Plus',short:'Spark Cash+',issuer:'Capital One',fee:150,c:'#901818',cm:'#D03030',verified:'2026-03',
  sources:{primary:'https://www.capitalone.com/small-business/credit-cards/spark-cash-plus/',secondary:'https://thepointsguy.com/credit-cards/spark-cash-plus/',tracker:'https://www.doctorofcredit.com/best-current-credit-card-sign-bonuses/',date:'2026-03-26'},
  sob:{offer:'$1,200 cash bonus',req:'$5k then $50k in yr 1',tags:['c']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Annual cash bonus',a:'$200 (at $200k spend)',note:''}],multiyear:[],static:[{n:'2% cash back everywhere',a:'2% cash',note:''},{n:'5% hotels & car rentals',a:'5% cash',note:''}]},
  summary:{rows:[{l:'Annual cash bonus',a:'$200 (at $200k)',v:200}],total:'~$200+',totalV:200,note:''}},

{id:'savor',name:'Capital One Savor',short:'Savor',issuer:'Capital One',fee:0,c:'#9A1A10',cm:'#D84030',verified:'2026-03',
  sources:{primary:'https://www.capitalone.com/credit-cards/savor-cash-rewards/',secondary:'https://www.nerdwallet.com/credit-cards/reviews/capital-one-savor-cash-rewards-credit-card',tracker:'https://www.doctorofcredit.com/best-current-credit-card-sign-bonuses/',date:'2026-03-26'},
  sob:{offer:'$200 cash bonus',req:'$500 in 3 months',tags:['c']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[],multiyear:[],static:[{n:'3% dining, entertainment, groceries',a:'3% cash',note:''},{n:'8% Cap1 Entertainment',a:'8% cash',note:''},{n:'3% streaming',a:'3% cash',note:''}]},
  summary:{rows:[],total:'$0 fee',totalV:0,note:''}},

// ── CITI ────────────────────────────────────────────────────────────
{id:'strata',name:'Citi Strata Premier',short:'Strata Premier',issuer:'Citi',fee:95,c:'#1A4AA0',cm:'#4080D8',verified:'2026-03',
  sources:{primary:'https://www.citi.com/credit-cards/citi-strata-premier-credit-card',secondary:'https://frequentmiler.com/citi-strata-premier-credit-card-review/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'75,000 ThankYou Points',req:'$4,000 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Hotel credit (CitiTravel.com)',a:'Up to $100/yr',note:'On hotel stays $500+ via CitiTravel.com.'}],multiyear:[],static:[{n:'10x Citi Travel',a:'10x TY pts',note:'Hotels, car rentals, attractions via cititravel.com.'},{n:'3x hotels, air, travel',a:'3x ThankYou pts',note:''},{n:'3x dining & groceries',a:'3x ThankYou pts',note:''},{n:'3x gas & EV charging',a:'3x ThankYou pts',note:''},{n:'Transfer to 18+ partners',a:'1:1 to most',note:'Turkish, Flying Blue, Avianca, Wyndham.'}]},
  summary:{rows:[{l:'Annual hotel credit',a:'Up to $100',v:100}],total:'~$100+',totalV:100,note:''}},

{id:'aaexec',name:'Citi AAdvantage Executive',short:'AA Executive',issuer:'Citi',fee:595,c:'#102888',cm:'#2850C0',verified:'2026-03',
  sources:{primary:'https://www.citi.com/credit-cards/american-airlines/aadvantage-executive',secondary:'https://thepointsguy.com/credit-cards/citi-aadvantage-executive/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'70,000 AAdvantage miles',req:'$7,000 in 3 months',tags:['t']},
  credits:{monthly:[{n:'Lyft credit',a:'Up to $10/mo ($120/yr)',note:'Must take 3+ eligible rides/month.'},{n:'Grubhub credit',a:'Up to $10/mo ($120/yr)',note:''}],quarterly:[],semiannual:[],annual:[{n:'Anniversary bonus miles',a:'10,000 miles/yr',note:''},{n:'Global Entry / TSA PreCheck / NEXUS',a:'Up to $120/4 yrs',note:''}],multiyear:[],static:[{n:'Admirals Club membership',a:'Compl. (~$800/yr)',note:'Full Admirals Club. Cardholder + family or 2 guests.'},{n:'First bag free',a:'Complimentary',note:'Cardholder + up to 8.'},{n:'4x on AA',a:'4x AAdvantage miles',note:''}]},
  summary:{rows:[{l:'Monthly credits (ann.)',a:'Up to $240',v:240},{l:'Admirals Club membership',a:'~$800 standalone',v:800}],total:'~$1,040+ (Club value)',totalV:1040,note:''}},

{id:'aaplatpres',name:'Citi AA Platinum Select',short:'AA Platinum Select',issuer:'Citi',fee:99,c:'#0E2070',cm:'#2248B0',verified:'2026-03',
  sources:{primary:'https://www.citi.com/credit-cards/american-airlines/aadvantage-platinum-select',secondary:'https://thepointsguy.com/credit-cards/citi-aadvantage-platinum-select/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'50,000 AAdvantage miles',req:'$2,500 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Companion cert (at $30k spend)',a:'After $30k/yr',note:'Domestic economy round-trip.'}],multiyear:[],static:[{n:'First bag free',a:'Complimentary',note:'Cardholder + up to 4.'},{n:'2x AA, restaurants, gas',a:'2x AAdvantage miles',note:''}]},
  summary:{rows:[{l:'Companion cert (at $30k)',a:'Domestic economy',v:250}],total:'~$250+',totalV:250,note:''}},

{id:'doublecash',name:'Citi Double Cash',short:'Double Cash',issuer:'Citi',fee:0,c:'#2A50A8',cm:'#5080D8',verified:'2026-03',
  sources:{primary:'https://www.citi.com/credit-cards/citi-double-cash-credit-card',secondary:'https://www.nerdwallet.com/credit-cards/reviews/citi-double-cash-card',tracker:'https://www.doctorofcredit.com/best-current-credit-card-sign-bonuses/',date:'2026-03-26'},
  sob:{offer:'$200 cash back',req:'$1,500 in 6 months',tags:['c']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[],multiyear:[],static:[{n:'2% everywhere',a:'2% cash',note:'1% buy + 1% pay.'},{n:'ThankYou Points conversion',a:'Convertible',note:'Pair with Strata Premier.'}]},
  summary:{rows:[],total:'$0 fee',totalV:0,note:''}},

{id:'custcash',name:'Citi Custom Cash',short:'Custom Cash',issuer:'Citi',fee:0,c:'#305090',cm:'#5888C8',verified:'2026-03',
  sources:{primary:'https://www.citi.com/credit-cards/citi-custom-cash-card',secondary:'https://www.nerdwallet.com/credit-cards/reviews/citi-custom-cash-card',tracker:'https://www.doctorofcredit.com/best-current-credit-card-sign-bonuses/',date:'2026-03-26'},
  sob:{offer:'$200 cash back',req:'$1,500 in 6 months',tags:['c']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[],multiyear:[],static:[{n:'5% top eligible category',a:'5% cash (up to $500/mo)',note:'Auto-selects highest of 10 eligible categories.'},{n:'ThankYou Points conversion',a:'Convertible',note:'Pair with Strata Premier.'}]},
  summary:{rows:[],total:'$0 fee',totalV:0,note:''}},

{id:'rewardsp',name:'Citi Rewards+',short:'Rewards+',issuer:'Citi',fee:0,c:'#3858A0',cm:'#6090C8',verified:'2026-03',
  sources:{primary:'https://www.citi.com/credit-cards/citi-rewards-plus-credit-card',secondary:'https://frequentmiler.com/citi-to-release-new-strata-card-replacing-rewards/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'20,000 ThankYou Points',req:'$1,500 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[],multiyear:[],static:[{n:'Converting to Citi Strata in 2026',a:'Card phasing out',warn:true,note:'Citi converting all Rewards+ cards to Citi Strata. 10% rebate remains through July 2026 for existing holders.'},{n:'Rounds up to 10 pts every purchase',a:'Min 10 pts per purchase',note:''},{n:'2x supermarkets & gas',a:'2x TY pts (up to $6k/yr)',note:''},{n:'10% pts back on redemptions',a:'Up to 100k pts/yr — ending July 2026',note:''}]},
  summary:{rows:[],total:'$0 fee',totalV:0,note:''}},

// ── WELLS FARGO / BILT ────────────────────────────────────────────────────
{id:'bilt',name:'Bilt Mastercard',short:'Bilt',issuer:'Bilt/Cardless',fee:0,c:'#2A1860',cm:'#6040A8',verified:'2026-03',
  sources:{primary:'https://biltrewards.com/card',secondary:'https://thepointsguy.com/credit-cards/bilt-mastercard/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'No traditional sign-on bonus',req:'',tags:[]},
  credits:{monthly:[{n:'Rent Day double points (1st)',a:'2x on all categories',note:'Every 1st: 2x on dining, travel, other. Min 5 transactions/billing cycle required.'}],quarterly:[],semiannual:[],annual:[],multiyear:[],static:[{n:'Card 2.0 launched Feb 7 2026',a:'New issuer: Cardless/Column N.A.',warn:true,note:'Original Wells Fargo Bilt card retired Feb 7. Same points, same transfer partners. Now issued by Cardless.'},{n:'Earn on rent payments',a:'1x pts (up to 100k/yr)',note:'No transaction fees.'},{n:'3x dining',a:'3x Bilt pts',note:''},{n:'2x travel',a:'2x Bilt pts',note:''},{n:'Transfer to 15+ partners',a:'1:1 to Hyatt, United, AA, Emirates...',note:''},{n:'Primary auto rental CDW',a:'Included',note:''}]},
  summary:{rows:[],total:'$0 annual fee',totalV:0,note:''}},

{id:'wfauto',name:'WF Autograph Journey',short:'WF Autograph',issuer:'Wells Fargo',fee:95,c:'#8A1818',cm:'#D04040',verified:'2026-03',
  sources:{primary:'https://creditcards.wellsfargo.com/autograph-journey-visa-credit-card/',secondary:'https://thepointsguy.com/credit-cards/wells-fargo-autograph-journey/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'60,000 bonus points',req:'$4,000 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Airline credit',a:'Up to $50/yr',note:''},{n:'Hotel credit',a:'Up to $50/yr',note:''}],multiyear:[],static:[{n:'5x hotels',a:'5x WF pts',note:''},{n:'4x airlines',a:'4x WF pts',note:''},{n:'3x dining & travel',a:'3x WF pts',note:''}]},
  summary:{rows:[{l:'Annual credits',a:'Up to $100',v:100}],total:'~$100+',totalV:100,note:''}},

// ── U.S. BANK ────────────────────────────────────────────────────────
{id:'altres',name:'U.S. Bank Altitude Reserve',short:'Altitude Reserve',issuer:'U.S. Bank',fee:400,c:'#3A1068',cm:'#7038B0',verified:'2026-03',
  sources:{primary:'https://www.usbank.com/credit-cards/altitude-reserve-visa-infinite-credit-card.html',secondary:'https://thepointsguy.com/credit-cards/us-bank-altitude-reserve-visa-infinite-card/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'50,000 pts (~$750 in travel)',req:'$4,500 in 90 days',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Travel & dining credit',a:'Up to $325/yr',note:'Automatic on travel and dining. Extremely broad. Effective fee: $75.'}],multiyear:[{n:'Global Entry / TSA PreCheck',a:'Up to $100/4.5 yrs',note:''}],static:[{n:'Closed to new applicants',a:'Since Nov 2024',warn:true,note:'U.S. Bank Altitude Reserve is no longer accepting new applications as of November 2024. Existing cardholders keep their cards.'},{n:'Priority Pass Select',a:'12 visits/yr',note:''},{n:'3x mobile wallet',a:'3x Altitude pts',note:'Apple Pay, Google Pay — nearly every in-person purchase.'},{n:'3x travel & dining',a:'3x Altitude pts',note:''}]},
  summary:{rows:[{l:'Annual travel & dining credit',a:'Up to $325',v:325}],total:'~$325+',totalV:325,note:''}},

{id:'altconn',name:'U.S. Bank Altitude Connect',short:'Altitude Connect',issuer:'U.S. Bank',fee:95,c:'#301060',cm:'#5830A0',verified:'2026-03',
  sources:{primary:'https://www.usbank.com/credit-cards/altitude-connect-visa-signature-credit-card.html',secondary:'https://thepointsguy.com/credit-cards/us-bank-altitude-connect-visa-signature-card/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'50,000 pts (~$500)',req:'$2,000 in 120 days',tags:['t']},
  credits:{monthly:[],quarterly:[{n:'Streaming credit',a:'Up to $15/qtr ($60/yr)',note:'Netflix, Spotify, Disney+, Hulu, and more.'}],semiannual:[],annual:[],multiyear:[{n:'Global Entry / TSA PreCheck',a:'Up to $100/4.5 yrs',note:''}],static:[{n:'GigSky global data',a:'Free eSIM data',note:'Complimentary international data via GigSky eSIM. Benefit valid through November 30, 2026.'},{n:'Priority Pass Select',a:'4 visits/yr',note:''},{n:'4x travel',a:'4x Altitude pts',note:''},{n:'4x gas & EV charging',a:'4x Altitude pts',note:''}]},
  summary:{rows:[{l:'Streaming credit (ann.)',a:'Up to $60',v:60}],total:'~$60+',totalV:60,note:''}},

// ── BANK OF AMERICA ────────────────────────────────────────────────────
{id:'boapre',name:'BofA Premium Rewards Elite',short:'BofA PR Elite',issuer:'Bank of America',fee:550,c:'#780A18',cm:'#B82030',verified:'2026-03',
  sources:{primary:'https://www.bankofamerica.com/credit-cards/products/premium-rewards-elite-credit-card/',secondary:'https://thepointsguy.com/credit-cards/bank-of-america-premium-rewards-elite/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'75,000 points',req:'$5,000 in 90 days',tags:['c','t']},
  credits:{monthly:[],quarterly:[],semiannual:[{n:'Airline incidental credit',a:'Up to $300/yr',note:'Seat upgrades, baggage fees, airline lounge fees, inflight services only. NOT hotels/transit/rideshare.'},{n:'Lifestyle credit',a:'Up to $150/yr',note:'Streaming services, food delivery, fitness subscriptions, rideshare. Automatic.'}],multiyear:[{n:'Global Entry / TSA PreCheck',a:'Up to $100/4 yrs',note:''}],static:[{n:'BofA Rewards program launches May 27 2026',a:'Replaces Preferred Rewards',note:'Preferred Rewards rebranding to BofA Rewards on May 27, 2026. Same rewards boost (25-75%), new lifestyle benefits for higher tiers.'},{n:'Priority Pass Select',a:'Unlimited + unlimited guests',note:'No guest limits.'},{n:'2x travel & dining',a:'2x BofA pts',note:'Up to 3.5x with Preferred Rewards.'}]},
  summary:{rows:[{l:'Annual travel credit',a:'Up to $300',v:300},{l:'Annual lifestyle credit',a:'Up to $150',v:150}],total:'~$450+',totalV:450,note:''}},

{id:'boatrav',name:'BofA Travel Rewards',short:'BofA Travel',issuer:'Bank of America',fee:0,c:'#680812',cm:'#A01828',verified:'2026-03',
  sources:{primary:'https://www.bankofamerica.com/credit-cards/products/travel-rewards-credit-card/',secondary:'https://www.nerdwallet.com/credit-cards/reviews/bank-of-america-travel-rewards-credit-card',tracker:'https://www.doctorofcredit.com/best-current-credit-card-sign-bonuses/',date:'2026-03-26'},
  sob:{offer:'25,000 pts (~$250 travel)',req:'$1,000 in 90 days',tags:['c']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[],multiyear:[],static:[{n:'1.5x everywhere (up to 2.625x)',a:'1.5x-2.625x pts',note:'With $100k+ BofA/Merrill assets.'}]},
  summary:{rows:[],total:'$0 fee',totalV:0,note:''}},

// ── BARCLAYS ────────────────────────────────────────────────────────
{id:'aadvbiz',name:'Barclays Aviator Silver',short:'Aviator Silver',issuer:'Barclays',fee:199,c:'#1A3A5A',cm:'#3A70A8',verified:'2026-03',
  sources:{primary:'https://cards.barclay.com/aviator/silver',secondary:'https://thepointsguy.com/credit-cards/barclays-aviator-silver/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'60,000 AAdvantage miles',req:'$1,000 in 3 months',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Companion cert (at $20k)',a:'After $20k/yr',note:'Domestic economy.'},{n:'3k EQMs per $10k spend (2x)',a:'Up to 6,000 EQMs',note:''},{n:'Citi taking over AA co-brand in 2026',a:'Card may change',warn:true,note:'Barclays AA partnership ending. Citi becoming sole AA issuer. Cards may be reissued or converted. Monitor for updates.'}],multiyear:[],static:[{n:'Admirals Club membership',a:'Complimentary for cardholder',note:''},{n:'First & second bag free',a:'Complimentary',note:'Cardholder + up to 8.'},{n:'3x on AA',a:'3x AAdvantage miles',note:''}]},
  summary:{rows:[{l:'Admirals Club (cardholder)',a:'~$800 standalone',v:800}],total:'~$800+ (Club value)',totalV:800,note:''}},

{id:'jbtravel',name:'Barclays JetBlue Plus',short:'JetBlue Plus',issuer:'Barclays',fee:99,c:'#0A2848',cm:'#1A5A98',verified:'2026-03',
  sources:{primary:'https://cards.barclay.com/jetblue-plus',secondary:'https://thepointsguy.com/credit-cards/jetblue-plus-card/',tracker:'https://finance.yahoo.com/personal-finance/credit-cards/article/credit-card-perks-calendar-year-214541060.html',date:'2026-03-26'},
  sob:{offer:'50,000 TrueBlue points',req:'$1,000 in 90 days',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Anniversary bonus points',a:'5,000 pts/yr',note:'Worth ~$70.'},{n:'$100 JetBlue credit',a:'$100/yr',note:''}],multiyear:[],static:[{n:'First bag free',a:'Complimentary',note:'Cardholder + up to 3 companions on same JetBlue reservation.'},{n:'3x on JetBlue',a:'3x TrueBlue pts',note:''},{n:'10% pts back on redemptions',a:'Up to 10%',note:''}]},
  summary:{rows:[{l:'Anniversary bonus',a:'5k (~$70)',v:70},{l:'JetBlue credit',a:'$100',v:100}],total:'~$170+',totalV:170,note:''}},

{id:'aadvsel',name:'Barclays Aviator Red',short:'Aviator Red',issuer:'Barclays',fee:99,c:'#5A0A10',cm:'#981820',verified:'2026-03',
  sources:{primary:'https://cards.barclay.com/aviator-red',secondary:'https://thepointsguy.com/credit-cards/barclays-aviator-red-world-elite-mastercard/',tracker:'https://www.doctorofcredit.com/year-end-credit-card-checklist-for-2025-travel-credits-spend-reset-application-strategy-more/',date:'2026-03-26'},
  sob:{offer:'60,000 AAdvantage miles',req:'$0 — earn just by getting card',tags:['t']},
  credits:{monthly:[],quarterly:[],semiannual:[],annual:[{n:'Companion cert (at $20k)',a:'After $20k/yr',note:''},{n:'Citi taking over AA co-brand in 2026',a:'Card may change',warn:true,note:'Barclays AA partnership ending. Citi becoming sole AA issuer. Cards may be reissued or converted.'}],multiyear:[],static:[{n:'First bag free',a:'Complimentary',note:'Cardholder + up to 4.'},{n:'2x on AA',a:'2x AAdvantage miles',note:''}]},
  summary:{rows:[{l:'Companion cert (at $20k)',a:'Domestic economy',v:250}],total:'~$250+',totalV:250,note:''}},
];

  res.json({ cards: CARDS, promos: PROMOS, aff: AFF, issuers: ISSUERS });
};
