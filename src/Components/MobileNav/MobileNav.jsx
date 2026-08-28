import { useEffect, useState } from 'react'
import cctvIcon from '../../assets/navIcons/cctv.png'
import roIcon from '../../assets/navIcons/ro.png'
import tvIcon from '../../assets/navIcons/tv.png'
import { useCart } from '../../context/CartContext.jsx'
import './MobileNav.css'

const NAV_ITEMS = [
    { id: 'cctv', label: 'CCTV', icon: cctvIcon },
    { id: 'ro', label: 'RO', icon: roIcon },
    { id: 'tv', label: 'TV', icon: tvIcon },
]

function MobileNav() {
    const [activeId, setActiveId] = useState('cctv')
    const { totalItems, openCart } = useCart()

    useEffect(() => {
        const sections = NAV_ITEMS
            .map((item) => document.getElementById(item.id))
            .filter(Boolean)

        if (!sections.length) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { threshold: 0.4 }
        )

        sections.forEach((section) => observer.observe(section))
        return () => observer.disconnect()
    }, [])

    const handleNavClick = (event, item) => {
        event.preventDefault()
        setActiveId(item.id)

        if (item.id === 'ro') {
            window.dispatchEvent(new Event('openRoVerity'))
            return
        }

        const section = document.getElementById(item.id)
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <nav className="mobile-nav">
            {NAV_ITEMS.map((item) => (
                <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`mobile-nav-item ${activeId === item.id ? 'active' : ''}`}
                    onClick={(event) => handleNavClick(event, item)}
                >
                    <span className="mobile-nav-icon">
                        <img src={item.icon} alt={item.label} />
                    </span>
                    <span className="mobile-nav-label">{item.label}</span>
                </a>
            ))}
            <button type="button" className="mobile-nav-item mobile-nav-cart" onClick={openCart}>
                <span className="mobile-nav-icon">
                    <i className="fa-solid fa-cart-shopping"></i>
                    {totalItems > 0 && <span className="mobile-nav-cart-badge">{totalItems}</span>}
                </span>
                <span className="mobile-nav-label">Cart</span>
            </button>
        </nav>
    )
}

export default MobileNav