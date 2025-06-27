export interface Order {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: string;
  statusColor: string;
}

export interface Product {
  name: string;
  category: string;
  sales: number;
  stock: number;
  status: string;
  revenue: string;
  image?: string;
}
