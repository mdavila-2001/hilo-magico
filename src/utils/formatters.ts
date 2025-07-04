// src/utils/formatters.ts
export function formatPrice(price: number, currency: string = 'BOB'): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency
    }).format(price);
  }
  
  export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }