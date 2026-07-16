import { useEffect, useState } from 'react'
import './RoVerity.css'

// Auto-loads every image inside src/assets/roImages at build time
const imageModules = import.meta.glob('../../assets/roImages/*.{png,jpg,jpeg,PNG,JPG,JPEG}', { eager: true })

const getImage = (file) => {
    const key = Object.keys(imageModules).find((k) => k.endsWith('/' + file))
    return key ? imageModules[key].default : null
}

// Edit this list: `file` must match the image filename you place in
// src/assets/roImages (e.g. "001.png"). Fill in the real name & price.
const RO_PRODUCTS = [
    { file: '001.jpeg', name: 'Aqua Unique', price: 8999 },
    { file: '002.jpeg', name: 'Aqua Rain', price: 8499 },
    { file: '003.jpeg', name: 'Aqua Jade', price: 9499 },
    { file: '004.jpeg', name: 'Aqua 2090', price: 8999 },
    { file: '005.jpeg', name: 'Aqua Nine', price: 10999 },
    { file: '006.jpeg', name: 'Aqua Unique Pro', price: 9999 },
    { file: '007.jpeg', name: 'Aqua Nine Black', price: 11499 },
    { file: '008.jpeg', name: 'Aqua Compact', price: 7999 },
    { file: '009.jpeg', name: 'Waterlily XL', price: 8999 },
    { file: '010.jpeg', name: 'Waterlily Blue', price: 8499 },
    { file: '011.jpeg', name: 'Waterlily Metallic Grey', price: 9499 },
    { file: '012.jpeg', name: 'AquaTouch Mystic', price: 8999 },
    { file: '013.jpeg', name: 'i-Zynn Copper + Alkaline', price: 12999 },
    { file: '014.jpeg', name: 'i-Zynn Display Model', price: 13999 },
    { file: '015.jpeg', name: 'AquaTouch ABS Plastic', price: 8499 },
    { file: '016.jpeg', name: 'AquaTouch ABS Storage Tank', price: 9499 },
    { file: '017.jpeg', name: 'i-Zynn LED', price: 12499 },
    { file: '018.jpeg', name: 'Aqua XL Metallic Grey', price: 9999 },
    { file: '019.jpeg', name: 'Waterlily Healthy Grey', price: 8999 },
    { file: '020.jpeg', name: 'Lily Blue', price: 8499 },
    { file: '021.jpeg', name: 'Aqua XL Cabinet', price: 10999 },
    { file: '022.jpeg', name: 'Aqua XL', price: 9999 },
    { file: '023.jpeg', name: 'AquaTouch Mystic ABS', price: 8999 },
    { file: '024.jpeg', name: 'Aqua Grey Wall Mount', price: 7999 },
    { file: '025.jpeg', name: 'Waterlily Family Pack', price: 8999 },
    { file: '026.jpeg', name: 'Lily Metallic Grey', price: 8499 },
    { file: '027.jpeg', name: 'AquaTouch LED Indicator', price: 9499 },
    { file: '028.jpeg', name: 'AquaTouch ABS Storage', price: 8999 },
    { file: '029.jpeg', name: 'Aqua White Compact', price: 7499 },
    { file: '030.jpeg', name: 'AquaTouch Signature', price: 10499 },
    { file: '031.jpeg', name: 'Aqua Blue Twin', price: 8999 },
    { file: '032.jpeg', name: 'Lily Metallic Grey Pro', price: 8999 },
    { file: '033.jpeg', name: 'Roma Gold', price: 9999 },
    { file: '034.jpeg', name: 'Roma Food Grade', price: 9499 },
    { file: '035.jpeg', name: 'Roma Maroon', price: 9999 },
    { file: '036.jpeg', name: 'Hi-Flo', price: 8499 },
    { file: '037.jpeg', name: 'Aqua Era', price: 10999 },
    { file: '038.jpeg', name: 'Aqua Era Pure Efficient', price: 11999 },
    { file: '039.jpeg', name: 'Aqua Era Light', price: 9999 },
    { file: '040.jpeg', name: 'Aqua Era Silver', price: 10499 },
    { file: '041.jpeg', name: 'Aqua Era Compact', price: 8999 },
    { file: '042.jpeg', name: 'Aqua Era Pro', price: 12999 },
    { file: '043.jpeg', name: 'Aqua Era Ultra', price: 13999 },
]

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

                <div className="ro-verity-grid">
                    {RO_PRODUCTS.map((product) => (
                        <div className="ro-verity-card" key={product.file}>
                            <div className="ro-verity-img-wrap">
                                <img src={getImage(product.file)} alt={product.name} loading="lazy" />
                            </div>
                            <h4>{product.name}</h4>
                            <p className="ro-verity-price">₹{product.price.toLocaleString('en-IN')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RoVerity