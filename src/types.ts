export interface RarityBreakdown {
  composite: number;
  production: number;
  survival: number;
  market: number;
  knowledge: number;
}

export interface ComparableSale {
  title: string;
  price: number;
  source: string;
  date: string;
  similarity: string;
}

export interface BuyMaxPricing {
  conservative: number;
  standard: number;
  aggressive: number;
}

export interface ExpectedResaleRanges {
  quickSaleMin: number;
  quickSaleMax: number;
  retailMin: number;
  retailMax: number;
  auctionMin: number;
  auctionMax: number;
  confidence: string;
}

export interface MysteryObject {
  isMystery: boolean;
  materialNotes: string;
  constructionNotes: string;
  ageIndicators: string;
  nextSteps: string;
}

export interface NicheSpecialistInfo {
  specialistName: string;
  specialistTitle: string;
  specialistBadge: string;
  nicheDetected: string;
  subNicheDetected: string;
  researchAvenuesEvaluated: string[];
  godTierPrecisionNotes: string;
}

export interface ObjectReport {
  itemName: string;
  category: string;
  stylePeriod: string;
  materials: string;
  confidence: number;
  authenticity: number;
  craftsmanship: number;
  rarity: RarityBreakdown;
  demand: number;
  liquidity: number;
  historicalSignificance: number;
  researchWorthiness: number;
  opportunity: number;
  riskScore: number;
  gemScore: number;
  verdict: string;
  verdictReasoning: string[];
  researchChecklist: string[];
  knownFacts: string[];
  missingEvidence: string[];
  comparableSales: ComparableSale[];
  buyMax: BuyMaxPricing;
  expectedResale: ExpectedResaleRanges;
  bestExitChannels: string[];
  targetCollectorProfile: string;
  mysteryObjectAnalysis: MysteryObject;
  nicheSpecialist?: NicheSpecialistInfo;
}

export interface CollectorProfile {
  type: string;
  summary: string;
  travelNotes: string;
  incomeTier: string;
  gemProbability: number;
}

export interface LotListItem {
  itemName: string;
  opportunity: number;
  verdict: string;
  maxBid?: number;
}

export interface EstateReport {
  estateName: string;
  estateGrade: string;
  collectorProfile: CollectorProfile;
  roiPotential: {
    lowRoi: string;
    highRoi: string;
    capitalRequired: string;
  };
  bestLots: LotListItem[];
  worstLots: LotListItem[];
  acquisitionStrategy: string;
}

export interface PurchaseRecord {
  id: string;
  itemName: string;
  category: string;
  purchasePrice: number;
  purchaseDate: string;
  sold: boolean;
  salePrice?: number;
  saleDate?: string;
  saleChannel?: string;
  actualRoi?: number;
  daysToSale?: number;
  notes?: string;
}

export interface LotItemBreakdown {
  id: string;
  itemName: string;
  makerOrBrand: string;
  recommendation: "BUY" | "PASS" | "NEUTRAL";
  estValue: number;
  bidEquation: string;
  lineItemValueContribution: number;
  tacticalReasons: string;
  thingsToLookFor: string[];
  conditionNotes: string;
  category: string;
  itemUrl?: string;
  directSearchUrl?: string;
}

export interface CTBidsLotInspectionResult {
  lotNumber: string;
  title: string;
  currentBid: number;
  estimatedLotValue: number;
  profitGap: number;
  roiMultiple: number;
  willShip: boolean;
  location: string;
  sellerName: string;
  endTime: string;
  imageUrl: string;
  lotUrl: string;
  lotBiddingEquation: {
    sumOfKeepableItemsValue: number;
    estimatedLotShippingOrPickupCost: number;
    recommendedMaxLotBid: number;
    riskMargin: number;
    equationFormula: string;
    verdictSummary: string;
  };
  itemsBreakdown: LotItemBreakdown[];
  gemAnalysis?: SleeperGem;
}

export interface SleeperGem {
  id: string;
  itemName: string;
  listedTitle: string;
  askingPrice: number;
  estimatedValue: number;
  profitGap: number;
  roiMultiple: number;
  gemScore: number;
  niche: string;
  sleeperReason: string;
  hallmarkToCheck: string;
  verdict: "GOD-TIER GEM" | "TREASURE BUY" | "STRONG BUY" | "SPECULATIVE" | "PASS";
  riskLevel: "Low" | "Medium" | "High" | "Ultra Low";
  actionSteps: string[];
  auctionLink?: string;
  directItemLink?: string;
  lotLink?: string;
  auctionPlatform?: string;
  saleLocation?: string;
  biddingEnds?: string;
  imageUrl?: string;
  lotNumber?: string;
  willShip?: boolean;
  currentBid?: number;
  sellerAccount?: string;
  distanceMiles?: number;
}

export interface CTBidsWatchlistItem {
  id: string;
  lotNumber: string;
  title: string;
  currentBid: number;
  myMaxBid?: number;
  recommendedMaxBid?: number;
  estValue: number;
  endTime: string;
  imageUrl: string;
  lotUrl: string;
  directItemLink?: string;
  itemCompsLink?: string;
  willShip: boolean;
  location: string;
  distanceMiles?: number;
  biddingEquation?: string;
  gemAnalysis?: SleeperGem;
  isSleeperGem: boolean;
}

export interface CTBidsAccountConfig {
  username?: string;
  zipCode: string;
  radiusMiles: number;
  preferWillShip: boolean;
  autoSyncWatchlist: boolean;
  isLoggedIn: boolean;
  lastSyncedAt?: string;
}

// Bidding Tactics & Lifecycle Tracking
export type AuctionPlatform = 'ctbids' | 'hibid' | 'liveauctioneers' | 'estatesales' | 'govdeals' | 'other';

export type ItemLifecycleStatus = 'watching' | 'bidding' | 'won_pending' | 'lost' | 'inventory_in_hand';

export type FulfillmentStatus = 'pending_pickup' | 'shipped_in_transit' | 'received';

export type InventoryDestination = 'store_resale' | 'specialty_item' | 'personal_collection';

export interface BidLog {
  id: string;
  amount: number;
  timestamp: string;
  isMyBid: boolean;
  tacticUsed?: string;
  note?: string;
}

export interface PsychologicalBiddingAdvisor {
  suggestedNextBid: number;
  primaryTactic: string;
  tacticalReasoning: string;
  behavioralInsight: string;
  maxBudgetCap: number;
  dangerZoneThreshold: number;
}

export interface ChannelPricing {
  ebayEst: number;
  fbMarketplaceEst: number;
  specialtyHouseEst: number;
  recommendedChannel: string;
}

export interface TrackedItem {
  id: string;
  title: string;
  platform: AuctionPlatform;
  platformUrl: string;
  imageUrl: string;
  lotNumber?: string;
  location?: string;
  currentBid: number;
  myMaxBudget: number;
  myCurrentBid?: number;
  endTime: string;
  status: ItemLifecycleStatus;
  fulfillmentStatus?: FulfillmentStatus;
  inventoryDestination?: InventoryDestination;
  purchasePrice?: number;
  soldPrice?: number;
  soldDate?: string;
  soldChannel?: string;
  bidHistory: BidLog[];
  psychologicalAdvisor?: PsychologicalBiddingAdvisor;
  channelPricing?: ChannelPricing;
  notes?: string;
  dateAdded: string;
  category?: string;
}

export interface GeneratedStorePosting {
  title: string;
  recommendedPlatform: "eBay" | "Facebook Marketplace" | "Specialty House / LiveAuctioneers" | "Private Collector";
  recommendedPrice: number;
  pricePerChannel: {
    ebay: number;
    fbMarketplace: number;
    specialtyHouse: number;
  };
  conditionGrade: string;
  description: string;
  hashtags: string[];
  listingNotes: string;
}

export interface HallmarkDecodeResult {
  matchedMaker: string;
  symbolInterpretation: string;
  purityOrMaterial: string;
  originPeriod: string;
  rarityMultiplier: string;
  verificationSteps: string[];
  knownMarketValueBonus: string;
  referenceImages: string[];
}

export interface SeedCase {
  id: string;
  name: string;
  category: string;
  image: string;
  listedAs: string;
  correctedId: string;
  actualValue: number;
  whyValuable: string;
  whyOverlooked: string;
  buyerType: string;
  researchNeeded: string;
  opportunityScore: number;
  liquidityNotes: string;
  outcome: string;
}

export interface StudioWidget {
  id: string;
  title: string;
  category: string;
  enabled: boolean;
  colSpan: "full" | "half" | "third";
  iconName: string;
  description: string;
}

export interface StudioPreset {
  id: string;
  name: string;
  description: string;
  nicheFocus: string;
  widgetIds: string[];
}

