import React, { createContext, useContext, useReducer, useMemo } from 'react';

const CartContext = createContext();

const initialState = {
  items: [], // {id, name, price, image, quantity}
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i => i.id === action.payload.id ? { ...i, quantity: i.quantity + action.payload.quantity } : i)
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'UPDATE_QTY':
      return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i) };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const subtotal = useMemo(() => state.items.reduce((sum, i) => sum + (Number(String(i.price).replace(/[^0-9.]/g, '')) || 0) * i.quantity, 0), [state.items]);
  const tax = useMemo(() => subtotal * 0.18, [subtotal]);
  const shipping = useMemo(() => (subtotal > 1000 ? 0 : 100), [subtotal]);
  const total = useMemo(() => subtotal + tax + shipping, [subtotal, tax, shipping]);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } });
  const clear = () => dispatch({ type: 'CLEAR' });

  return (
    <CartContext.Provider value={{ ...state, subtotal, tax, shipping, total, addItem, removeItem, updateQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};


