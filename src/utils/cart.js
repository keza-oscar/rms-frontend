const CART_KEY = 'midtown-cart';

export const getCart = () => {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
};

export const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

export const addCartItem = (cart, item) => {
  const existing = cart.find((cartItem) => cartItem.item_id === item.item_id);
  return existing
    ? cart.map((cartItem) => cartItem.item_id === item.item_id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)
    : [...cart, { ...item, quantity: 1 }];
};

export const getCartCount = (cart = getCart()) => cart.reduce((count, item) => count + item.quantity, 0);
