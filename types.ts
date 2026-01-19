
export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  badge?: string;
}

export interface AdSuggestion {
  headline: string;
  body: string;
  cta: string;
}
