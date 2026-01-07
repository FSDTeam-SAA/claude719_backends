export interface ISubscription {
  title: string;
  interval: 'monthly' | 'yearly';
  price: number;
  currency: string;

  // yearly = fixed games
  // monthly = unlimited (null)
  numberOfGames?: number | null;

  features?: string[];
  isActive?: boolean;

  totalSubscripeUser?: any[];
}
