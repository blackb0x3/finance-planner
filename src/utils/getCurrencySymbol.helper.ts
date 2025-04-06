export const getCurrencySymbol = (currency: string): string => {
  const currencySymbols: { [key: string]: string } = {
    'GBP': '£',
    'USD': '$',
    'EUR': '€',
    'JPY': '¥',
    'AUD': 'A$',
    'CAD': 'C$',
    'CHF': 'Fr',
    'CNY': '¥',
    'INR': '₹',
    'NZD': 'NZ$'
  };
  return currencySymbols[currency] || currency;
};