import { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext.jsx'
import './RoVerity.css'

// Auto-loads every image inside any subfolder of src/assets/roImages
// e.g. src/assets/roImages/Aqua era/001.jpg
const imageModules = import.meta.glob(
    '../../assets/roImages/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
    { eager: true }
)

// Group images by their parent folder name, sorted so 001 comes first
const folderImages = {}
Object.keys(imageModules).forEach((path) => {
    const match = path.match(/roImages\/([^/]+)\/([^/]+)$/)
    if (!match) return
    const [, folder, filename] = match
    if (!folderImages[folder]) folderImages[folder] = []
    folderImages[folder].push({ filename, url: imageModules[path].default })
})
Object.values(folderImages).forEach((arr) =>
    arr.sort((a, b) => a.filename.localeCompare(b.filename))
)

const getVariants = (folder) => folderImages[folder] || []

// `folder` must match the exact subfolder name inside src/assets/Images
// NOTE: descriptions below are generic placeholder copy meant to give
// shoppers a quick sense of each model — edit the wording/specs to match
// your actual product sheets whenever you get a chance.
const RO_PRODUCTS = [
    { folder: 'Aqua era', name: 'Aqua Slx', price: 14499, desc: 'Slim wall-mount RO with multi-stage purification, ideal for compact kitchens that still want full filtration power.' },
    { folder: 'Aqua 2090', name: 'Aqua 2090', price: 10000, desc: 'Budget-friendly RO purifier delivering clean, safe drinking water for small to medium households.' },
    { folder: 'Aqua 2090 raga', name: 'Aqua 2090 Raga Serious', price: 13333, desc: 'Upgraded version of the 2090 series with a sturdier build and improved filtration for daily heavy use.' },
    { folder: 'Aqua i pearls', name: 'Aqua i Pearls', price: 12222, desc: 'Elegant pearl-finish RO purifier that balances stylish design with reliable multi-stage water purification.' },
    { folder: 'Aqua nine', name: 'Aqua Nine', price: 14444, desc: 'High-capacity purifier with advanced RO+UV+UF technology, well suited for larger families.' },
    { folder: 'Aqua queen', name: 'Aqua Queen', price: 8499, desc: 'Compact and affordable entry-level RO purifier, great for small families and first-time buyers.' },
    { folder: 'Aqua mountain', name: 'Aqua Mountain', price: 8399, desc: 'Reliable everyday RO purifier offering solid filtration performance at a wallet-friendly price.' },
    { folder: 'Aqua emira', name: 'Aqua Emira', price: 13333, desc: 'Premium-look RO purifier with a mineral cartridge that retains essential minerals while removing impurities.' },
    { folder: 'Aqua Jade', name: 'Aqua Jade', price: 9999, desc: 'Sleek jade-tone purifier with dependable multi-stage filtration for consistently clean water.' },
    { folder: 'aqua-xl', name: 'Aqua XL', price: 9999, desc: 'Extra-large storage tank purifier built for homes that need a bigger reserve of purified water on hand.' },
    { folder: 'Aqua Roma', name: 'Aqua Roma', price: 11111, desc: 'Stylish Roma-series purifier combining a modern look with strong purification performance.' },
    { folder: 'Lx one', name: 'Lx One', price: 17599, desc: 'Feature-rich flagship purifier with advanced filtration stages, built for households that want the best.' },
    { folder: 'Purosis', name: 'Purosis', price: 17777, desc: 'High-end RO system with multiple purification layers, designed for maximum purity and long filter life.' },
    { folder: 'Aqua water pia', name: 'Aqua Water Pia', price: 9999, desc: 'Compact and efficient purifier that fits neatly into smaller kitchen spaces without compromising on filtration.' },
    { folder: 'Aqua touch', name: 'Aqua Touch', price: 10499, desc: 'Touch-panel operated RO purifier offering a modern user experience alongside dependable purification.' },
    { folder: 'Aqua Water lily', name: 'Aqua Water Lily', price: 9499, desc: 'Lightweight, easy-to-install purifier ideal for apartments and rental homes.' },
    { folder: 'Aqua i-zynn', name: 'Aqua i-Zynn', price: 9499, desc: 'Modern-styled purifier with efficient RO membrane filtration for everyday clean drinking water.' },
    { folder: 'hi-flow', name: 'Hi-Flow', price: 9199, desc: 'Fast-flow purifier designed to deliver purified water quickly, great for busy households.' },
    { folder: 'Aqua mars', name: 'Aqua Mars', price: 9499, desc: 'Dependable mid-range purifier offering a good balance of price, design, and filtration quality.' },
    { folder: 'Aqua Grid', name: 'Aqua Grid', price: 11599, desc: 'Durable multi-stage purifier built to handle varying input water quality with consistent output.' },
    { folder: 'Aqua V5', name: 'Aqua V5', price: 12199, desc: 'Advanced V5 series purifier with enhanced membrane technology for thorough impurity removal.' },
    { folder: 'Azor', name: 'Azor', price: 17999, desc: 'Premium Azor model featuring top-tier filtration stages and a refined design for modern homes.' },
    { folder: 'Cosmax', name: 'Cosmax', price: 13999, desc: 'Well-rounded RO purifier offering strong filtration performance for medium to large families.' },
    { folder: 'Aqua Orca', name: 'Aqua Orca', price: 14000, desc: 'Robust purifier with a generous tank capacity, built for consistent daily water demand.' },
    { folder: 'Dolphin Gold', name: 'Dolphin Gold', price: 8500, desc: 'Value-for-money purifier with a gold-accent finish and reliable everyday filtration.' },
    { folder: 'G-Tec (hot&cold)', name: 'G-Tec (hot&cold)', price: 20000, desc: 'Hot & cold RO purifier that delivers purified water at your choice of temperature — great for tea, coffee, and instant needs.' },
    { folder: 'Whale (25 l)', name: 'Whale (25 l)', price: 19000, desc: 'Large 25L storage purifier suited for bigger families or offices needing a bigger reserve of purified water.' },
    { folder: 'One eight', name: 'One eight', price: 16800, desc: 'Feature-packed purifier with multiple filtration stages, designed for households wanting extra assurance on water quality.' },
]

const COMMERCIAL_RO = [
    { folder: 'Comersial', name: '50 L/hr', price: 28888, imageFilename: '001.jpeg', desc: 'Heavy-duty commercial RO unit producing 50 litres of purified water per hour — suited for offices, shops, and small commercial setups.' },
    { folder: 'Comersial', name: '25 L/hr', price: 20000, imageFilename: '002.jpeg', desc: 'Commercial-grade RO unit with 25 litres/hour output, a solid fit for smaller offices, clinics, or retail spaces.' },
]

function ProductBlock({ product, variantFilename }) {
    const variants = getVariants(product.folder)
    const [selected, setSelected] = useState(0)
    const [added, setAdded] = useState(false)
    const { addToCart } = useCart()
    const activeVariant = variantFilename
        ? variants.find((variant) => variant.filename === variantFilename) || variants[0]
        : variants[selected] || variants[0]
    const activeImg = activeVariant?.url

    const handleAddToCart = () => {
        addToCart({
            id: `ro-${product.folder}-${product.name}`,
            name: `${product.name} RO Purifier`,
            price: product.price,
            img: activeImg,
        })
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

    return (
        <div className="ro-product-block">
            {activeImg ? (
                <div className="ro-product-preview">
                    <img src={activeImg} alt={product.name} loading="lazy" />
                </div>
            ) : (
                <div className="ro-product-preview ro-item-noimg">No Image</div>
            )}

            <div className="ro-product-heading">
                <h4>{product.name}</h4>
                <p className="ro-item-price">₹{product.price.toLocaleString('en-IN')}</p>
            </div>

            {!variantFilename && variants.length > 1 && (
                <div className="ro-variant-row">
                    {variants.map((variant, i) => (
                        <button
                            key={variant.filename}
                            className={`ro-variant-thumb ${i === selected ? 'active' : ''}`}
                            onClick={() => setSelected(i)}
                            type="button"
                        >
                            <img src={variant.url} alt={`${product.name} variant ${i + 1}`} loading="lazy" />
                        </button>
                    ))}
                </div>
            )}

            {product.desc && <p className="ro-item-desc">{product.desc}</p>}

            <button type="button" className="ro-add-to-cart-btn" onClick={handleAddToCart}>
                {added ? <><i className="fa-solid fa-check"></i> Added</> : <><i className="fa-solid fa-cart-plus"></i> Add to Cart</>}
            </button>
        </div>
    )
}

function RoVerity({ onClose }) {
    const [isShown, setIsShown] = useState(false)

    useEffect(() => {
        const raf = requestAnimationFrame(() => setIsShown(true))
        return () => cancelAnimationFrame(raf)
    }, [])

    const handleClose = () => {
        setIsShown(false)
        setTimeout(onClose, 300)
    }

    return (
        <div
            className={`ro-verity-overlay ${isShown ? 'show' : ''}`}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
            <div className="ro-verity-panel">
                <span className="ro-verity-close" onClick={handleClose}>&times;</span>

                <div className="ro-verity-header">
                    <h2>Our RO <span className="highlight">Range</span></h2>
                    <p>Choose from our wide range of RO Water Purifiers</p>
                </div>

                <div className="ro-verity-section">
                    <h3 className="ro-verity-section-title">RO Products</h3>
                    <div className="ro-verity-grid">
                        {RO_PRODUCTS.map((product) => (
                            <ProductBlock key={product.folder} product={product} />
                        ))}
                    </div>
                </div>

                <div className="ro-verity-divider" />

                <div className="ro-verity-section">
                    <h3 className="ro-verity-section-title">Commercial RO</h3>
                    <div className="ro-verity-grid">
                        {COMMERCIAL_RO.map((product) => (
                            <ProductBlock
                                key={`${product.folder}-${product.name}`}
                                product={product}
                                variantFilename={product.imageFilename}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoVerity