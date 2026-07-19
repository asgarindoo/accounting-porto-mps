import { useState } from 'react'
import { resumeSections, contact } from '../data'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Icon } from './Icon'

export function ResumeSection() {
  const headerRef = useScrollReveal()
  const cardRef = useScrollReveal()

  return (
    <section id="resume" className="section section--alt">
      <div className="container">
        <div ref={headerRef} className="section__header reveal">
          <div className="section__eyebrow">
            <span className="section__eyebrow-line" />
            Resume
          </div>
          <h2 className="section__title">Download my full CV.</h2>
          <p className="section__subtitle">
            One concise document covering education, experience, skills, and
            certifications — ready for your review.
          </p>
        </div>

        <div ref={cardRef} className="reveal" style={{ width: '100%' }}>
          {resumeSections.map((item, i) => (
            <div key={i} className="resume__card" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
              <div className="resume__card-info" style={{ alignItems: 'center' }}>
                <span className="resume__card-label">{item.label}</span>
                <span className="resume__card-desc">{item.description}</span>
              </div>
              <a href={item.file} download className="btn-primary" style={{ marginTop: '16px' }}>
                <Icon name="Download" size={16} />
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ContactSection() {
  const headerRef = useScrollReveal()
  const leftRef = useScrollReveal()
  const rightRef = useScrollReveal()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real project, connect this to an email service (e.g. EmailJS, Resend)
    setSent(true)
    setForm({ name: '', email: '', message: '' })
  }

  const contactItems = [
    { icon: 'Mail', label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: 'MessageCircle', label: 'WhatsApp', value: 'Chat with me', href: contact.whatsapp },
    { icon: 'Linkedin', label: 'LinkedIn', value: 'Connect with me', href: contact.linkedin },
    { icon: 'MapPin', label: 'Location', value: contact.location, href: null },
  ]

  return (
    <section id="contact" className="section">
      <div className="container">
        <div ref={headerRef} className="section__header reveal" style={{ margin: '0 auto 56px', textAlign: 'center' }}>
          <div className="section__eyebrow">
            <span className="section__eyebrow-line" />
            Contact
          </div>
          <h2 className="section__title">Let's work together.</h2>
          <p className="section__subtitle" style={{ margin: '20px auto 0' }}>
            Open to entry-level opportunities, internships, and freelance
            accounting projects. Reach out — I'd love to hear from you.
          </p>
        </div>

        <div className="contact__grid" style={{ gridTemplateColumns: '1fr', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <div ref={leftRef} className="reveal">
            <div className="contact__links" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {contactItems.map((item) =>
                item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="contact__link-item"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--border)',
                      borderRadius: 0,
                      padding: '24px 0',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '24px'
                    }}
                  >
                    <span className="contact__link-icon" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                      <Icon name={item.icon} size={20} />
                    </span>
                    <span className="contact__link-text" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="contact__link-label" style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text)' }}>{item.label}</span>
                      <span className="contact__link-value" style={{ color: 'var(--text-muted)' }}>{item.value}</span>
                    </span>
                  </a>
                ) : (
                  <div key={item.label} className="contact__link-item"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--border)',
                      borderRadius: 0,
                      padding: '24px 0',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '24px'
                    }}>
                    <span className="contact__link-icon" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                      <Icon name={item.icon} size={20} />
                    </span>
                    <span className="contact__link-text" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="contact__link-label" style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text)' }}>{item.label}</span>
                      <span className="contact__link-value" style={{ color: 'var(--text-muted)' }}>{item.value}</span>
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
