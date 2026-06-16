export interface ColorVariant {
  name: string;
  hex: string;
}

export interface ProductDetails {
  craftsmanship: string;
  insulation: string;
  fitting: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  tagline: string;
  rating: number;
  materials: string[];
  colors: ColorVariant[];
  features: string[];
  description: string;
  imageUrl: string;
  details: ProductDetails;
}

export interface StylistResponse {
  curationExplanation: string;
  recommendedProductIds: string[];
  craftsmanshipInsight: string;
  outfitTagline: string;
}

export interface CartItem {
  product: Product;
  selectedColor: ColorVariant;
  quantity: number;
}
