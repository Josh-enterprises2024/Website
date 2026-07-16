import { useEffect, useRef, useState } from 'react'
import logo from '../../assets/logo.jpg'
import './landing.css'

function Landing({ children }) {
    const rootRef = useRef(null)
    const typeTextRef = useRef(null)

    const [navOpen, setNavOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [showBackToTop, setShowBackToTop] = useState(false)

    // Form tracking states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        interest: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Navbar scroll effect & back-to-top visibility
    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 50)
            setShowBackToTop(window.scrollY > 500)
        }
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Number counter animation for stats
    useEffect(() => {
        const stats = rootRef.current.querySelectorAll('.count')
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = +entry.target.getAttribute('data-target')
                    const duration = 2000
                    const increment = target / (duration / 16)
                    let current = 0

                    const updateCount = () => {
                        current += increment
                        if (current < target) {
                            entry.target.innerText = Math.ceil(current)
                            requestAnimationFrame(updateCount)
                        } else {
                            entry.target.innerText = target
                        }
                    }
                    updateCount()
                    obs.unobserve(entry.target)
                }
            })
        }, { threshold: 0.5 })

        stats.forEach((stat) => observer.observe(stat))
        return () => observer.disconnect()
    }, [])

    // Reveal on scroll
    useEffect(() => {
        const revealElements = rootRef.current.querySelectorAll(
            '.about-text, .visual-box, .contact-wrapper, .cta-content'
        )

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

    // Typing animation
    useEffect(() => {
        const words = ['Power Your Life.', 'Protect Your Family.', 'Secure Your Business.']
        let wordIndex = 0
        let charIndex = 0
        let isDeleting = false
        let timeoutId

        const type = () => {
            const el = typeTextRef.current
            if (!el) return

            const currentWord = words[wordIndex]

            if (isDeleting) {
                el.textContent = currentWord.substring(0, charIndex - 1)
                charIndex--
            } else {
                el.textContent = currentWord.substring(0, charIndex + 1)
                charIndex++
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true
                timeoutId = setTimeout(type, 2000)
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false
                wordIndex = (wordIndex + 1) % words.length
                timeoutId = setTimeout(type, 500)
            } else {
                timeoutId = setTimeout(type, isDeleting ? 100 : 200)
            }
        }

        type()
        return () => clearTimeout(timeoutId)
    }, [])

    const handleNavLinkClick = () => setNavOpen(false)

    // Form input dynamic tracking
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Email delivery function via Web3Forms API
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Web3Forms API requirements mapping
        const submissionData = {
            access_key: '76ce59a0-e306-46e4-b923-60e7d628f20f', // <-- Put your generated key here
            subject: `New Lead From Josh Enterprises website: ${formData.name}`,
            from_name: formData.name,
            ...formData
        }

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(submissionData)
            })

            const resData = await response.json()

            if (resData.success) {
                alert('Thank you! Your message has been sent directly to Josh Enterprises.')
                setFormData({ name: '', email: '', interest: '', message: '' }) // Clears inputs
            } else {
                alert('Oops! Submission failed: ' + resData.message)
            }
        } catch (error) {
            console.error('Submission processing error:', error)
            alert('Could not submit the form. Please check your network connection.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div ref={rootRef}>
            {/* Navigation */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container nav-container">
                    <a href="#home" className="logo">
                        <img src={logo} alt="Josh Enterprises" className="logo-img" />
                        <span className="logo-text">JOSH <span className="highlight">ENTERPRISES</span></span>
                    </a>
                    <ul className={`nav-links ${navOpen ? 'active' : ''}`}>
                        <li><a href="#home" onClick={handleNavLinkClick}>Home</a></li>
                        <li><a href="#products" onClick={handleNavLinkClick}>Products</a></li>
                        <li><a href="#about" onClick={handleNavLinkClick}>About</a></li>
                        <li><a href="#contact" className="btn-primary" style={{ color: 'white' }} onClick={handleNavLinkClick}>Contact Us</a></li>
                    </ul>
                    <div className={`hamburger ${navOpen ? 'toggle' : ''}`} onClick={() => setNavOpen(!navOpen)}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header id="home" className="hero">
                <div className="container hero-content">
                    <h1 className="animate-up">
                        Secure Your World, <br />
                        <span className="text-gradient type-text" ref={typeTextRef}></span>
                    </h1>
                    <p className="animate-up delay-1">
                        Top-tier CCTV, RO Purifiers, and Inverters tailored for your peace of mind.
                    </p>
                    <div className="hero-btns animate-up delay-2">
                        <a href="#products" className="btn-primary">Explore Products</a>
                        <a href="#contact" className="btn-secondary">Get a Quote</a>
                    </div>
                </div>
                <div className="hero-bg-overlay"></div>
            </header>

            {/* Products / Items section, passed in as children */}
            {children}

            {/* Parallax CTA Section */}
            <section className="parallax-cta">
                <div className="overlay"></div>
                <div className="container cta-content">
                    <h2>Experience the Difference</h2>
                    <p>Join hundreds of satisfied customers who trust Josh Enterprises for their safety and power needs.</p>
                    <a href="#contact" className="btn-primary">Get Started Today</a>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about section-padding">
                <div className="container about-wrapper">
                    <div className="about-text">
                        <h2>Why Choose
                            <span className="highlight"> Josh Enterprises </span>?</h2>
                        <p>
                            We are dedicated to providing top-notch sales and service for security and utility products. With
                            years of experience and a customer-first approach, we ensure quality and reliability in every
                            installation.
                        </p>
                        <div className="stats">
                            <div className="stat-item">
                                <span className="count" data-target="358">0</span><span>+</span>
                                <p>Happy Clients</p>
                            </div>
                            <div className="stat-item">
                                <span className="count" data-target="202">0</span><span>+</span>
                                <p>Installations</p>
                            </div>
                            <div className="stat-item">
                                <span className="count" data-target="24">0</span><span>/7</span>
                                <p>Support</p>
                            </div>
                        </div>
                    </div>
                    <div className="about-visual">
                        <div className="visual-box">
                            <i className="fa-solid fa-shield-halved"></i>
                            <h4>Trusted</h4>
                        </div>
                        <div className="visual-box">
                            <i className="fa-solid fa-screwdriver-wrench"></i>
                            <h4>Expert Service</h4>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact section-padding">
                <div className="container">
                    <div className="contact-wrapper">
                        <div className="contact-info">
                            <h2>Let's <span className="highlight">Connect</span></h2>
                            <p>Ready to upgrade your security or power systems? Reach out to us today.</p>

                            <div className="info-item">
                                <i className="fa-solid fa-phone"></i>
                                <div>
                                    <h4>Phone</h4>
                                    <p>+91 90929 29958</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <i className="fa-solid fa-envelope"></i>
                                <div>
                                    <h4>Email</h4>
                                    <p>joshenterprisestuty@gmail.com</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <i className="fa-solid fa-location-dot"></i>
                                <div>
                                    <h4>Location</h4>
                                    <p>111/67/1G state bank colony main 60ft road, tuticorin 628002</p>
                                </div>
                            </div>
                        </div>

                        <form className="contact-form" onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    placeholder="Your Name" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleInputChange} 
                                    placeholder="Your Email" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <select 
                                    name="interest" 
                                    value={formData.interest} 
                                    onChange={handleInputChange} 
                                    required
                                >
                                    <option value="" disabled>Interested In...</option>
                                    <option value="cctv">CCTV Camera</option>
                                    <option value="ro">RO Purifier</option>
                                    <option value="inverter">Inverter</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <textarea 
                                    name="message" 
                                    value={formData.message} 
                                    onChange={handleInputChange} 
                                    placeholder="Message" 
                                    rows="5" 
                                    required
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="btn-primary full-width" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="container footer-content">
                    <div className="footer-logo">JOSH ENTERPRISES</div>
                    <p>&copy; 2024 Josh Enterprises. All rights reserved.</p>
                    <div className="social-links">
                        <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="https://www.instagram.com/josh_enterprises__?igsh=ZTJmdW1hb21vdXdi"><i className="fa-brands fa-instagram"></i></a>
                        <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                    </div>
                </div>
            </footer>

            {/* Floating Widgets */}
            <a href="https://wa.me/919092929958" className="float-btn whatsapp" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-whatsapp"></i>
            </a>
            <a href="#home" className={`float-btn back-to-top ${showBackToTop ? 'show' : ''}`}>
                <i className="fa-solid fa-arrow-up"></i>
            </a>
        </div>
    )
}

export default Landing