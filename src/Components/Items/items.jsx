import { useEffect, useRef, useState } from 'react'
import cctvImg from '../../assets/cctv.png'
import roImg from '../../assets/ro.png'
import tvImg from '../../assets/tv.png'
import RoVerity from '../RoVerity/RoVerity.jsx'
import './items.css'

const PRODUCTS = [
    {
        id: 'cctv',
        img: cctvImg,
        alt: 'CCTV Camera',
        title: 'CCTV Security Systems',
        desc: 'High-definition surveillance cameras with night vision and remote access to keep your premises safe 24/7.',
        features: ['3K Resolution', 'Motion Detection', 'Mobile App Support'],
        modal: {
            title: 'CCTV Specifications',
            specs: [
                ['Resolution', '5MP Super HD / 4K Ultra HD'],
                ['Night Vision', 'Up to 30 meters with Color Night Vision'],
                ['Storage', 'Support up to 8TB HDD & Cloud Storage'],
                ['Features', 'Two-way Audio, AI Human Detection, IP67 Weatherproof'],
            ],
        },
    },
    {
        id: 'ro',
        img: roImg,
        alt: 'RO Water Purifier',
        title: 'RO Water Purifiers',
        desc: 'Advanced multi-stage filtration ensuring 100% pure and healthy drinking water for your family.',
        features: ['UV + UF Filtration', 'Alkaline Boost', 'Low Maintenance'],
        modal: {
            title: 'RO Purifier Details',
            specs: [
                ['Stages', '7-Stage Purification (Pre-filter, Carbon, RO, UV, UF, Mineral, Post-carbon)'],
                ['Capacity', '15 Liters/Hour'],
                ['TDS Controller', 'Advanced mineral retention technology'],
                ['Warranty', '1 Year Comprehensive + 1 Free Services'],
            ],
        },
    },
    {
        id: 'tv',
        img: tvImg,
        alt: 'Smart LED TV',
        title: 'Smart LED TVs',
        desc: 'Experience cinematic entertainment at home with our range of high-performance Smart Android TVs.',
        features: ['Starts @ \u20B97,999', '4K Ultra HD Display', 'Dolby Audio'],
        modal: {
            title: 'Smart TV Specifications',
            specs: [
                ['Available Sizes', '32", 40", 43", 55", 65"'],
                ['Price', 'Starting from \u20B97,999'],
                ['OS', 'Official Android / Google TV Interface'],
                ['Features', 'Voice Search, Netflix/Prime/Youtube Pre-installed, Frameless Design'],
                ['Warranty', '1 Year Panel Warranty'],
            ],
        },
    },
]

function ProductCard({ product, onOpenModal }) {
    const cardRef = useRef(null)

    const handleMouseMove = (e) => {
        const card = cardRef.current
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / centerY) * -5
        const rotateY = ((x - centerX) / centerX) * 5
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = () => {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
    }

    return (
        <div
            id={product.id}
            className="product-card reveal"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="product-image-container">
                <img src={product.img} alt={product.alt} className="product-img" />
            </div>
            <h3>{product.title}</h3>
            <p>{product.desc}</p>
            <ul>
                {product.features.map((feature) => (
                    <li key={feature}><i className="fa-solid fa-check"></i> {feature}</li>
                ))}
            </ul>
            <button className="btn-text open-modal" onClick={() => onOpenModal(product.id)}>
                View Details <i className="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    )
}

function Items() {
    const rootRef = useRef(null)
    const [openId, setOpenId] = useState(null)
    const [isShown, setIsShown] = useState(false)
    const [showRoVerity, setShowRoVerity] = useState(false)

    // Reveal on scroll for product cards
    useEffect(() => {
        const revealElements = rootRef.current.querySelectorAll('.reveal')

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1'
                    entry.target.style.transform = 'translateY(0)'
                    revealObserver.unobserve(entry.target)
                }
            })
        }, { threshold: 0.1 })

        revealElements.forEach((el) => {
            el.style.opacity = '0'
            el.style.transform = 'translateY(50px)'
            el.style.transition = 'all 0.8s ease-out'
            revealObserver.observe(el)
        })

        return () => revealObserver.disconnect()
    }, [])

    // Animate modal show/hide (mirrors the original 300ms fade+scale transition)
    useEffect(() => {
        if (openId) {
            const raf = requestAnimationFrame(() => setIsShown(true))
            return () => cancelAnimationFrame(raf)
        }
    }, [openId])

    const openModal = (id) => {
        if (id === 'ro') {
            setShowRoVerity(true)
        } else {
            setOpenId(id)
        }
    }

    const closeModal = () => {
        setIsShown(false)
        setTimeout(() => setOpenId(null), 300)
    }

    const activeProduct = PRODUCTS.find((p) => p.id === openId)

    return (
        <section id="products" className="products section-padding" ref={rootRef}>
            <div className="container">
                <div className="section-header">
                    <h2>Our Premium <span className="highlight">Solutions</span></h2>
                    <p>Advanced technology for Home and Business.</p>
                </div>

                <div className="product-grid">
                    {PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} onOpenModal={openModal} />
                    ))}
                </div>
            </div>

            {activeProduct && (
                <div
                    className={`modal ${isShown ? 'show' : ''}`}
                    style={{ display: 'flex' }}
                    onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
                >
                    <div className="modal-content">
                        <span className="close-modal" onClick={closeModal}>&times;</span>
                        <h2>{activeProduct.modal.title}</h2>
                        <ul>
                            {activeProduct.modal.specs.map(([label, value]) => (
                                <li key={label}><strong>{label}:</strong> {value}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {showRoVerity && <RoVerity onClose={() => setShowRoVerity(false)} />}
        </section>
    )
}

export default Items