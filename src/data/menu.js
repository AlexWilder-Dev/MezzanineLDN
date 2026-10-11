// Drinks and food. Cocktail names are illustrative classics in the bar's
// price range; the house list isn't published. Board prices are real.

export const cocktailRange = { from: 9.5, to: 11.5 };

export const menuStyles = [
  { id: 'all', label: 'All' },
  { id: 'sour', label: 'Bright & sour' },
  { id: 'stirred', label: 'Stirred & strong' },
  { id: 'long', label: 'Long & sparkling' },
];

export const cocktails = [
  { name: 'Daiquiri', spec: 'White rum, lime, sugar', price: 9.5, style: 'sour' },
  { name: 'Negroni', spec: 'Gin, Campari, sweet vermouth, orange', price: 10.5, style: 'stirred' },
  { name: 'Paloma', spec: 'Tequila, grapefruit, lime, soda', price: 10, style: 'long' },
  { name: 'Whiskey Sour', spec: 'Bourbon, lemon, sugar, bitters', price: 10.5, style: 'sour' },
  { name: 'Old Fashioned', spec: 'Bourbon, sugar, aromatic bitters, orange', price: 11, style: 'stirred' },
  { name: 'Espresso Martini', spec: 'Vodka, coffee liqueur, espresso', price: 11.5, style: 'stirred' },
  { name: 'Margarita', spec: 'Tequila, orange liqueur, lime, salt', price: 10.5, style: 'sour' },
  { name: 'Mojito', spec: 'White rum, mint, lime, sugar, soda', price: 10, style: 'long' },
  { name: 'Penicillin', spec: 'Scotch, lemon, honey, ginger', price: 11.5, style: 'sour' },
  { name: 'Dark ’n’ Stormy', spec: 'Dark rum, lime, ginger beer', price: 9.5, style: 'long' },
];

export const boards = [
  { id: 'meat', name: 'Meat board', price: 9.5 },
  { id: 'veggie', name: 'Veggie board', price: 8.5 },
];

export const zeroWaste = {
  title: 'Every part of every ingredient',
  body:
    'Our cocktails are homemade with a zero-waste system that uses every part of each ingredient. Nothing good gets binned, which is how premium drinks come in at fair prices.',
  parts: ['Juice', 'Peel', 'Husk'],
};

export const formatPrice = (n) => `£${n % 1 === 0 ? n : n.toFixed(2)}`;
