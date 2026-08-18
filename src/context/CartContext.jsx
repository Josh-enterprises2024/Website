import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'josh-enterprises-cart'

function loadCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(loadCart)
    const [isCartOpen, setIsCartOpen] = useState(false)

    // Persist to localStorage whenever the cart changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }, [items])

    // product: { id, name, price, img, category }
    const addToCart = (product, qty = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + qty } : item
                )
            }
            return [...prev, { ...product, qty }]
        })
        setIsCartOpen(true)
    }

    const removeFromCart = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id))
    }

    const updateQty = (id, qty) => {
        if (qty < 1) return
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)))
    }

    const clearCart = () => setItems([])

    const openCart = () => setIsCartOpen(true)
    const closeCart = () => setIsCartOpen(false)

    const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items])
    const totalPrice = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
        [items]
    )

    const value = {
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        totalItems,
        totalPrice,
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within a CartProvider')
    return ctx
}
