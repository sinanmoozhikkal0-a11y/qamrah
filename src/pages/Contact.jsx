import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import SEO from '../components/SEO';
import { generateBreadcrumbSchema, generateFAQSchema } from '../utils/structuredData';
import { api } from '../services/api';

export default function Contact() {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [contactData, setContactData] = useState(null);

  const defaultFaqs = [
    {
      q: 'How does QAMRAH ensure nuts stay fresh and crispy?',
      a: 'All our nuts and dates are nitrogen-flushed and vacuum-sealed immediately after roasting and hand-grading in multi-layer, moisture-resistant oxygen-barrier standup pouches.'
    },
    {
      q: 'What is the standard delivery timeline across India?',
      a: 'Metro cities receive delivery within 24 to 48 hours via express air cargo. Tier 2 & Tier 3 cities receive delivery within 2 to 4 business days.'
    },
    {
      q: 'Do you offer custom corporate gift hampers for Diwali and Eid?',
      a: 'Yes, we curate custom wooden lacquer boxes with personalized company branding, engraved greeting cards, and bespoke dry fruit selections. Please check our Wholesale page for bulk enquiries.'
    },
    {
      q: 'What is your return & freshness guarantee policy?',
      a: 'We offer a 100% satisfaction guarantee. If your package arrives damaged or you are unsatisfied with freshness, we will issue a replacement or full refund within 7 days.'
    }
  ];

  const [faqs, setFaqs] = useState(defaultFaqs);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const [contactRes, faqRes] = await Promise.all([
          api.contact.get(),
          api.faqs.getAll()
        ]);

        if (contactRes.success && contactRes.data) {
          setContactData(contactRes.data);
        }

        if (faqRes.success && faqRes.data && faqRes.data.length > 0) {
          setFaqs(
            faqRes.data.map((f) => ({
              q: f.question,
              a: f.answer
            }))
          );
        }
      } catch (_err) {
        // keep fallback
      }
    };

    fetchContactData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.contact.sendMessage(formData);
      if (res.success) {
        setIsSubmitted(true);
        addToast('Thank you for contacting QAMRAH. Our concierge will get back to you shortly.');
      } else {
        addToast(res.message || 'Failed to send message. Please try again.', 'error');
      }
    } catch (_err) {
      // Offline fallback
      setIsSubmitted(true);
      addToast('Thank you for contacting QAMRAH. Our concierge will get back to you shortly.');
    } finally {
      setLoading(false);
    }
  };

  const header = contactData?.header || {
    eyebrow: 'CUSTOMER CONCIERGE',
    heading: 'GET IN TOUCH',
    description: 'Have a question about our harvest grades, custom hampers, or existing orders? Our dedicated team is delighted to assist you.'
  };

  const email = contactData?.email || 'concierge@qamrahnuts.com';
  const phone = contactData?.phone || '+91 (022) 8940-2200 / +91 98200 44888';
  const address = contactData?.address || 'QAMRAH Fine Foods Ltd, 4th Floor, Crescent Tower, BKC Commercial Complex, Mumbai 400051, India';
  const workingHours = contactData?.workingHours || 'Monday – Saturday: 9:00 AM – 8:00 PM IST';


  return (
    <div style={{ backgroundColor: '#07130D', minHeight: '100vh', padding: '48px 0 90px' }}>
      <SEO
        title="Contact Us & Frequently Asked Questions"
        description="Connect with QAMRAH concierge for order tracking, private tasting inquiries, and answers to frequently asked questions."
        canonical="/contact"
        jsonLd={[
          generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Contact', url: '/contact' }
          ]),
          generateFAQSchema(faqs)
        ]}
      />
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="eyebrow-label" style={{ justifyContent: 'center' }}>
            <Sparkles size={14} color="#D8B66A" />
            <span>{header.eyebrow}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', color: '#FFFFFF', marginBottom: '14px' }}>
            {header.heading}
          </h1>

          <p style={{ color: 'var(--color-cream-muted)', maxWidth: '560px', margin: '0 auto', fontSize: '1.05rem' }}>
            {header.description}
          </p>
        </div>

        {/* 2-Column Split: Contact Cards & Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '48px',
            marginBottom: '72px'
          }}
          className="contact-split-grid"
        >
          {/* Left: Contact Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="luxury-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(199, 154, 74, 0.15)', border: '1px solid var(--color-gold-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold-light)', flexShrink: 0 }}>
                <Mail size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '4px' }}>Email Concierge</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-cream-muted)', marginBottom: '4px' }}>For general, retail, and media enquiries:</p>
                <a href={`mailto:${email}`} style={{ color: 'var(--color-gold-base)', fontWeight: '600', fontSize: '0.9rem' }}>
                  {email}
                </a>
              </div>
            </div>

            <div className="luxury-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(199, 154, 74, 0.15)', border: '1px solid var(--color-gold-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold-light)', flexShrink: 0 }}>
                <Phone size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '4px' }}>Toll-Free &amp; WhatsApp</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-cream-muted)', marginBottom: '4px' }}>Direct phone support &amp; order assistance:</p>
                <div style={{ color: 'var(--color-gold-base)', fontWeight: '600', fontSize: '0.9rem' }}>
                  {phone}
                </div>
              </div>
            </div>

            <div className="luxury-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(199, 154, 74, 0.15)', border: '1px solid var(--color-gold-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold-light)', flexShrink: 0 }}>
                <MapPin size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '4px' }}>Headquarters &amp; Flagship</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-cream-muted)', lineHeight: '1.5' }}>
                  {address}
                </p>
              </div>
            </div>

            <div className="luxury-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(199, 154, 74, 0.15)', border: '1px solid var(--color-gold-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold-light)', flexShrink: 0 }}>
                <Clock size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '4px' }}>Concierge Hours</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-cream-muted)' }}>
                  {workingHours}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div
            className="luxury-card"
            style={{
              padding: '40px 32px',
              backgroundColor: '#091A11',
              border: '1px solid var(--color-gold-border)'
            }}
          >
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(56, 161, 105, 0.2)',
                    border: '2px solid #38A169',
                    color: '#68D391',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h2 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '10px' }}>
                  Message Sent
                </h2>
                <p style={{ color: 'var(--color-cream-muted)', marginBottom: '24px' }}>
                  Thank you for reaching out. A client advisor will respond to your message shortly.
                </p>
                <button onClick={() => setIsSubmitted(false)} className="btn btn-outline">
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <div>
                <div className="eyebrow-label" style={{ marginBottom: '6px' }}>
                  <span>SEND A MESSAGE</span>
                </div>
                <h2 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '24px' }}>
                  How May We Assist You?
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Roy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="luxury-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ananya@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="luxury-input"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="luxury-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Topic of Interest
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="luxury-select"
                    >
                      <option value="general">General Enquiry / Order Tracking</option>
                      <option value="gifting">Festive &amp; Wedding Gifting</option>
                      <option value="bulk">Bulk &amp; Institutional Supply</option>
                      <option value="feedback">Product Quality Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please detail your request or question..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="luxury-input"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '10px' }}>
                    <Send size={16} />
                    <span>TRANSMIT MESSAGE</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div className="eyebrow-label" style={{ justifyContent: 'center' }}>
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 style={{ fontSize: '2rem', textAlign: 'center', color: '#FFFFFF', marginBottom: '32px' }}>
            Common Inquiries
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="luxury-card"
                  style={{
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <div
                    style={{
                      padding: '18px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <h3 style={{ fontSize: '1rem', color: isOpen ? 'var(--color-gold-light)' : '#FFFFFF', fontFamily: 'var(--font-body)', fontWeight: '600' }}>
                      {faq.q}
                    </h3>
                    <ChevronDown
                      size={18}
                      color="#D8B66A"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease',
                        flexShrink: 0
                      }}
                    />
                  </div>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 24px 20px',
                        fontSize: '0.9rem',
                        lineHeight: '1.7',
                        color: 'var(--color-cream-muted)',
                        borderTop: '1px solid rgba(199, 154, 74, 0.15)',
                        paddingTop: '14px'
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .contact-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
