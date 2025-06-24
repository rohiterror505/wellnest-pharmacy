export interface Medicine {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  prescription: boolean;
  inStock: boolean;
  description: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  manufacturer: string;
}

export const medicines: Medicine[];
export function getTrendingMedicines(): Medicine[];
export function searchMedicines(query: string): Medicine[];
export function getMedicineById(id: number): Medicine | undefined;
export const categories: { id: string; name: string }[]; 