import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

const STORAGE_KEY = 'shilpkari_wishlist';

// Load initial state from localStorage
const loadInitialState = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { items: JSON.parse(stored) };
        }
    } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
    }
    return { items: [] };
};

const initialState = loadInitialState();

function wishlistReducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM': {
            const exists = state.items.find(i => i.id === action.payload.id);
            if (exists) {
                return state; // Already in wishlist
            }
            return { ...state, items: [...state.items, action.payload] };
        }
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter(i => i.id !== action.payload) };
        case 'CLEAR':
            return { items: [] };
        case 'TOGGLE_ITEM': {
            const exists = state.items.find(i => i.id === action.payload.id);
            if (exists) {
                return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
            }
            return { ...state, items: [...state.items, action.payload] };
        }
        default:
            return state;
    }
}

export const WishlistProvider = ({ children }) => {
    const [state, dispatch] = useReducer(wishlistReducer, initialState);

    // Save to localStorage whenever items change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
        } catch (error) {
            console.error('Error saving wishlist to localStorage:', error);
        }
    }, [state.items]);

    const addItem = (item) => {
        const exists = state.items.find(i => i.id === item.id);
        if (exists) {
            toast.error('Already in wishlist');
            return;
        }
        dispatch({ type: 'ADD_ITEM', payload: item });
        toast.success('Added to wishlist ❤️');
    };

    const removeItem = (id) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
        toast.success('Removed from wishlist');
    };

    const toggleItem = (item) => {
        const exists = state.items.find(i => i.id === item.id);
        dispatch({ type: 'TOGGLE_ITEM', payload: item });
        if (exists) {
            toast.success('Removed from wishlist');
        } else {
            toast.success('Added to wishlist ❤️');
        }
    };

    const isInWishlist = (id) => {
        return state.items.some(i => i.id === id);
    };

    const clear = () => {
        dispatch({ type: 'CLEAR' });
        toast.success('Wishlist cleared');
    };

    const itemCount = useMemo(() => state.items.length, [state.items]);

    return (
        <WishlistContext.Provider value={{
            items: state.items,
            itemCount,
            addItem,
            removeItem,
            toggleItem,
            isInWishlist,
            clear
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
    return ctx;
};
