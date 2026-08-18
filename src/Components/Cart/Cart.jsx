import { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext.jsx'
import './Cart.css'

const WHATSAPP_NUMBER = '919092929958'
const WEB3FORMS_KEY = '76ce59a0-e306-46e4-b923-60e7d628f20f'

function formatINR(amount) {
    return `\u20B9${amount.toLocaleString('en-IN')}`
}

function Cart() {
    const { items, isCartOpen, closeCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart()
    const [isShown, setIsShown] = useState(false)
    const [customer, setCustomer] = useState({ name: '', phone: '' })
    const [showCheckout, setShowCheckout] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isCartOpen) {
            const raf = requestAnimationFrame(() => setIsShown(true))
            return () => cancelAnimationFrame(raf)
        } else {
            setIsShown(false)
        }
    }, [isCartOpen])

    if (!isCartOpen) return null

    const handleClose = () => {
        setIsShown(false)
        setShowCheckout(false)
        setTimeout(closeCart, 300)
    }

    const buildOrderSummary = () =>
        items.map((item) => `${item.name} x${item.qty} - ${formatINR(item.price * item.qty)}`).join('\n')

    const handleWhatsAppCheckout = () => {
        const lines = [
            'Hi Josh Enterprises, I would like to order:',
            '',
            buildOrderSummary(),
            '',
            `Total: ${formatINR(totalPrice)}`,
            customer.name ? `Name: ${customer.name}` : '',
            customer.phone ? `Phone: ${customer.phone}` : '',
        ].filter(Boolean).join('\n')

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`
        window.open(url, '_blank', 'noreferrer')
    }

    const handleEmailCheckout = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const submissionData = {
            access_key: WEB3FORMS_KEY,
            subject: `New Order From Josh Enterprises website: ${customer.name || 'Website Visitor'}`,
            from_name: customer.name || 'Website Visitor',
            name: customer.name,
            phone: customer.phone,
            order_summary: buildOrderSummary(),
            order_total: formatINR(totalPrice),
        }

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(submissionData),
            })
            const resData = await response.json()

            if (resData.success) {
                alert('Order sent! We will contact you shortly to confirm.')
                clearCart()
                setCustomer({ name: '', phone: '' })
                handleClose()
            } else {
                alert('Oops! Could not send the order: ' + resData.message)
            }
        } catch (error) {
            console.error('Order submission error:', error)
            alert('Could not submit the order. Please check your network connection.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={`cart-overlay ${isShown ? 'show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}>
            <div className="cart-panel">
                <div className="cart-header">
                    <h2>Your Cart {totalItems > 0 && <span className="cart-count-badge">{totalItems}</span>}</h2>
                    <span className="cart-close" onClick={handleClose}>&times;</span>
                </div>

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <i className="fa-solid fa-cart-shopping"></i>
                        <p>Your cart is empty.</p>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {items.map((item) => (
                                <div className="cart-item" key={item.id}>
                                    {item.img && (
                                        <div className="cart-item-img">
                                            <img src={item.img} alt={item.name} />
                                        </div>
                                    )}
                                    <div className="cart-item-info">
                                        <h4>{item.name}</h4>
                                        <p className="cart-item-price">{formatINR(item.price)}</p>
                                        <div className="cart-qty-row">
                                            <button
                                                type="button"
                                                className="qty-btn"
                                                onClick={() => updateQty(item.id, item.qty - 1)}
                                                disabled={item.qty <= 1}
                                            >
                                                -
                                            </button>
                                            <span>{item.qty}</span>
                                            <button
                                                type="button"
                                                className="qty-btn"
                                                onClick={() => updateQty(item.id, item.qty + 1)}
                                            >
                                                +
                                            </button>
                                            <button
                                                type="button"
                                                className="cart-remove"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-item-subtotal">{formatINR(item.price * item.qty)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-total-row">
                                <span>Total</span>
                                <span className="cart-total-amount">{formatINR(totalPrice)}</span>
                            </div>

                            {!showCheckout ? (
                                <div className="cart-actions">
                                    <button type="button" className="btn-primary full-width" onClick={() => setShowCheckout(true)}>
                                        Checkout
                                    </button>
                                    <button type="button" className="btn-text" onClick={clearCart}>
                                        Clear Cart
                                    </button>
                                </div>
                            ) : (
                                <form className="cart-checkout-form" onSubmit={handleEmailCheckout}>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={customer.name}
                                            onChange={(e) => setCustomer((prev) => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="tel"
                                            placeholder="Your Phone"
                                            value={customer.phone}
                                            onChange={(e) => setCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn-primary full-width" disabled={isSubmitting}>
                                        {isSubmitting ? 'Placing Order...' : 'Place Order via Email'}
                                    </button>
                                    <button type="button" className="btn-secondary full-width" onClick={handleWhatsAppCheckout}>
                                        <i className="fa-brands fa-whatsapp"></i> Order via WhatsApp
                                    </button>
                                </form>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Cart
