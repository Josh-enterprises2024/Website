import { useEffect, useState } from 'react'
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
const RO_PRODUCTS = [
    { folder: 'Aqua era', name: 'Aqua Slx', price: 14499 },
    { folder: 'Aqua 2090', name: 'Aqua 2090', price: 10000 },
    { folder: 'Aqua 2090 raga', name: 'Aqua 2090 Raga Serious', price: 13333 },
    { folder: 'Aqua i pearls', name: 'Aqua i Pearls', price: 12222 },
    { folder: 'Aqua nine', name: 'Aqua Nine', price: 14444 },
    { folder: 'Aqua queen', name: 'Aqua Queen', price: 8499 },
    { folder: 'Aqua mountain', name: 'Aqua Mountain', price: 8399 },
    { folder: 'Aqua emira', name: 'Aqua Emira', price: 13333 },
    { folder: 'Aqua Jade', name: 'Aqua Jade', price: 9999 },
    { folder: 'aqua-xl', name: 'Aqua XL', price: 9999 },
    { folder: 'Aqua Roma', name: 'Aqua Roma', price: 11111 },
    { folder: 'Lx one', name: 'Lx One', price: 17599 },
    { folder: 'Purosis', name: 'Purosis', price: 17777 },
    { folder: 'Aqua water pia', name: 'Aqua Water Pia', price: 9999 },
    { folder: 'Aqua touch', name: 'Aqua Touch', price: 10499 },
    { folder: 'Aqua Water lily', name: 'Aqua Water Lily', price: 9499 },
    { folder: 'Aqua i-zynn', name: 'Aqua i-Zynn', price: 9499 }, // folder missing from zip — add images later
    { folder: 'hi-flow', name: 'Hi-Flow', price: 9199 },
    { folder: 'Aqua mars', name: 'Aqua Mars', price: 9499 },
]

const COMMERCIAL_RO = [
    { folder: 'Comersial', name: '50 L/hr', price: 28888, imageFilename: '001.jpeg' },
    { folder: 'Comersial', name: '25 L/hr', price: 20000, imageFilename: '002.jpeg' },
]

function ProductBlock({ product, variantFilename }) {
    const variants = getVariants(product.folder)
    const [selected, setSelected] = useState(0)
    const activeVariant = variantFilename
        ? variants.find((variant) => variant.filename === variantFilename) || variants[0]
        : variants[selected] || variants[0]
    const activeImg = activeVariant?.url

    return (
        <div className="ro-product-block">
            <div className="ro-product-heading">
                <h4>{product.name}</h4>
                <p className="ro-item-price">₹{product.price.toLocaleString('en-IN')}</p>
            </div>

            {activeImg ? (
                <div className="ro-product-preview">
                    <img src={activeImg} alt={product.name} loading="lazy" />
                </div>
            ) : (
                <div className="ro-product-preview ro-item-noimg">No Image</div>
            )}

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