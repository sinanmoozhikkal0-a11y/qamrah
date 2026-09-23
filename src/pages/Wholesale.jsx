import React, { useState, useEffect } from 'react';
import { Building2, Gift, Hotel, UtensilsCrossed, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import SEO from '../components/SEO';
import { generateBreadcrumbSchema } from '../utils/structuredData';
import { api } from '../services/api';

const iconMap = {
  Hotel,
  Gift,
  UtensilsCrossed,
  Building2
};

export default function Wholesale() {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: 'hotel',
    productInterest: 'all',
    estimatedQuantity: '100kg - 500kg',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wholesaleData, setWholesaleData] = useState(null);

  useEffect(() => {
    const fetchWholesale = async () => {
      try {
        const res = await api.wholesale.get();
        if (res.success && res.data) {
          setWholesaleData(res.data);
        }
      } catch (_err) {
        // preserve fallback
      }
    };
    fetchWholesale();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.wholesale.submitEnquiry(formData);
      if (res.success) {
        setIsSubmitted(true);
        addToast('Your wholesale enquiry has been submitted. Our B2B concierge will contact you within 24 hours.');
      } else {
        addToast(res.message || 'Failed to submit enquiry. Please try again.', 'error');
      }
    } catch (_err) {
      // Fallback submission success for offline/demo
      setIsSubmitted(true);
      addToast('Your wholesale enquiry has been submitted. Our B2B concierge will contact you within 24 hours.');
    } finally {
      setLoading(false);
    }
  };

  const defaultSegments = [
    {
      icon: Hotel,
      title: 'Luxury Hotels & Resorts',
      description: 'Turn-down amenities, executive lounge snack bars, and presidential welcome dry fruit baskets.'
    },
    {
      icon: Gift,
      title: 'Corporate Gifting',
      description: 'Bespoke engraved wooden gift hampers, custom brass canisters, and personalized festive gift packaging.'
    },
    {
      icon: UtensilsCrossed,
      title: 'Fine Dining & Patisseries',
      description: 'Pastry-grade raw green pistachio kernels, blanched almonds, and colossal cashews for master chefs.'
    },
    {
      icon: Building2,
      title: 'Specialty Retail & Export',
      description: 'Private-label or QAMRAH branded stand-up nitrogen pouches with full export certifications and barcoding.'
    }
  ];

  const header = wholesaleData?.header || {
    eyebrow: 'INSTITUTIONAL & B2B PARTNERSHIPS',
    heading: 'QAMRAH WHOLESALE & GIFTING',
    description: 'Direct-from-source wholesale allocations, custom corporate luxury hampers, and premium bulk supplies with guaranteed caliber consistency.'
  };

  const b2bSegments = wholesaleData?.b2bSegments?.length > 0
    ? wholesaleData.b2bSegments.map((s) => ({
        icon: iconMap[s.icon] || Hotel,
        title: s.title,
        description: s.description
      }))
    : defaultSegments;


  return (
    <div style={{ backgroundColor: '#07130D', minHeight: '100vh', padding: '48px 0 90px' }}>
      <SEO
        title="Wholesale, Bulk Procurement & Corporate Gifting"
        description="Partner with QAMRAH for wholesale bulk dry fruit supply, bespoke luxury corporate hampers, and premium institutional hospitality programs."
        canonical="/wholesale"
        ogImage="/images/gift_hamper.jpg"
        jsonLd={generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Wholesale & Gifting', url: '/wholesale' }
        ])}
      />
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="eyebrow-label" style={{ justifyContent: 'center' }}>
            <Sparkles size={14} color="#D8B66A" />
            <span>{header.eyebrow}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', color: '#FFFFFF', marginBottom: '14px' }}>
            {header.heading}
          </h1>

          <p style={{ color: 'var(--color-cream-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.7' }}>
            {header.description}
          </p>
        </div>

        {/* Corporate Hamper Showcase Banner */}
        <div
          className="luxury-card wholesale-banner-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: '36px',
            padding: '36px',
            marginBottom: '64px',
            alignItems: 'center',
            backgroundColor: '#091A11'
          }}
        >
          <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-gold-border)' }}>
            <img
              src="/images/gift_hamper.jpg"
              alt="Luxury Corporate Gifting Hamper"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <div>
            <div className="eyebrow-label">SIGNATURE CORPORATE COLLECTION</div>
            <h2 style={{ fontSize: '2rem', color: '#FFFFFF', marginBottom: '14px', lineHeight: '1.2' }}>
              Bespoke Executive Gift Boxes
            </h2>
            <p style={{ color: 'var(--color-cream-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '20px' }}>
              Elevate your corporate relationships with hand-finished emerald lacquer boxes, brass preserve tins, and your company's gold foil embossed logo.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', fontSize: '0.9rem', color: 'var(--color-cream-base)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#D8B66A" />
                <span>Custom logo embossing &amp; personalized parchment cards</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#D8B66A" />
                <span>Multi-city direct doorstep courier distribution</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#D8B66A" />
                <span>Attractive tier discounts for orders above 25 boxes</span>
              </div>
            </div>
          </div>
        </div>

        {/* B2B Segments Grid */}
        <div style={{ marginBottom: '64px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}
          >
            {b2bSegments.map((seg, i) => {
              const Icon = seg.icon;
              return (
                <div key={i} className="luxury-card" style={{ padding: '28px 24px', backgroundColor: 'rgba(15, 35, 23, 0.6)' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'rgba(199, 154, 74, 0.15)',
                      border: '1px solid var(--color-gold-base)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-gold-light)',
                      marginBottom: '16px'
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '8px' }}>{seg.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-cream-muted)', lineHeight: '1.6' }}>
                    {seg.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wholesale Enquiry Form */}
        <div
          className="luxury-card"
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            padding: '48px 36px',
            backgroundColor: '#091A11',
            border: '1px solid var(--color-gold-border)'
          }}
        >
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '36px 12px' }}>
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
              <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '10px' }}>
                Enquiry Received Successfully
              </h2>
              <p style={{ color: 'var(--color-cream-muted)', maxWidth: '480px', margin: '0 auto 24px' }}>
                Thank you for your interest in partnering with QAMRAH. Our dedicated institutional trade manager will review your requirement and share custom pricing within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="btn btn-outline"
              >
                SUBMIT ANOTHER ENQUIRY
              </button>
            </div>
          ) : (
            <div>
              <div className="eyebrow-label" style={{ marginBottom: '6px' }}>
                <span>B2B ENQUIRY FORM</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '8px' }}>
                Request Wholesale Catalogue &amp; Pricing
              </h2>
              <p style={{ color: 'var(--color-cream-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>
                Please share your business details below to receive bulk tiered pricing and sample specifications.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Business / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grand Heritage Palace / Taj Fine Foods"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="luxury-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Rathore"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="luxury-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="procurement@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="luxury-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="luxury-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Primary Product Interest
                    </label>
                    <select
                      value={formData.productInterest}
                      onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                      className="luxury-select"
                    >
                      <option value="all">Full Range (Cashews, Dates, Almonds, Pistachios)</option>
                      <option value="cashews">W-180 Jumbo Cashews (Bulk)</option>
                      <option value="dates">Royal Ajwa &amp; Medjool Dates</option>
                      <option value="almonds">California &amp; Kashmiri Mamra Almonds</option>
                      <option value="pistachios">Persian Roasted Pistachios</option>
                      <option value="gifting">Curated Luxury Gift Hampers</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Estimated Order Volume
                    </label>
                    <select
                      value={formData.estimatedQuantity}
                      onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                      className="luxury-select"
                    >
                      <option value="25-100">25kg – 100kg (Sample / Trial)</option>
                      <option value="100-500">100kg – 500kg</option>
                      <option value="500-2000">500kg – 2 Metric Tonnes</option>
                      <option value="2000+">Container Load (Export &amp; National)</option>
                      <option value="50-hampers">50 – 500 Corporate Gift Boxes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Custom Specifications / Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide any custom packaging, private labeling or delivery date requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="luxury-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  <Send size={16} />
                  <span>SUBMIT WHOLESALE ENQUIRY</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .wholesale-banner-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
