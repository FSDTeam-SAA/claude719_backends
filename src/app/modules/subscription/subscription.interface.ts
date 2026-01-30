export interface ISubscription {
  title: string;
  interval: 'monthly' | 'yearly';
  price: number;
  currency: string;
  status: 'active' | 'inactive';

  // yearly = fixed games
  // monthly = unlimited (null)
  numberOfGames?: number | null;

  features?: string[];
  isActive?: boolean;

  totalSubscripeUser?: any[];
}
