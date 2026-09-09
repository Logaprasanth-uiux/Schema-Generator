export interface GenerationCost {
  amount: number;
  currency: 'INR' | 'USD' | string;
  currencySymbol: string;
  formattedAmount: string;
  isEstimate: boolean;
  source?: string;
  lastUpdated?: string;
}
