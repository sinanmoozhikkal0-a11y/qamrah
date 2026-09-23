import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, ShieldCheck, ArrowRight, Globe } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import SEO from '../components/SEO';
import { generateOrganizationSchema, generateBreadcrumbSchema } from '../utils/structuredData';
import { api } from '../services/api';

const iconMap = {
  Globe,
  Award,
  ShieldCheck,
  Sparkles
};

export default function OurStory() {
  const defaultPillars = [
    {
      title: 'Ethical Global Origins',
      description: 'We partner directly with family orchards in Madinah, California, Kerman, and coastal India where soil care and traditional cultivation span generations.',
      icon: Globe
    },
    {
      title: 'Artisanal Grading Caliber',
      description: 'Every harvest batch undergoes rigorous visual and density grading. Only the top 5% of kernels (like colossal W-180 and jumbo nonpareil) earn the QAMRAH insignia.',
      icon: Award
    },
    {
      title: 'Zero Chemical Processing',
      description: 'We strictly reject chemical bleaching agents, sulphur fumigation, artificial glosses, or synthetic preservatives. What you taste is raw nature.',
      icon: ShieldCheck
    },
    {
      title: 'Oxygen-Barrier Freshness',
      description: 'Delicate tree nut oils degrade quickly with oxygen. Our multi-layer nitrogen-sealed preservation bags protect natural crispness and aroma until you open them.',
      icon: Sparkles
    }
  ];

  const [story, setStory] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await api.story.get();
        if (res.success && res.data) {
          setStory(res.data);
        }
      } catch (_err) {
        // preserve fallback
      }
    };
    fetchStory();
  }, []);

  const header = story?.header || {
    eyebrow: 'HERITAGE & PURITY',
    heading: 'THE STORY BEHIND QAMRAH',
    quote: '"Born from a reverence for the sacred earth, timeless botanical traditions, and the pursuit of unadulterated nourishment."'
  };

  const philosophy = story?.philosophy || {
    eyebrow: 'OUR PHILOSOPHY',
    heading: 'Nature, Unaltered & Elevated.',
    paragraph1: 'In an era where industrial mass production frequently masks inferior dry fruits with chemical bleaches, excessive salts, and synthetic glazes, QAMRAH was founded on a singular tenet: The true taste of nature requires no embellishment.',
    paragraph2: 'From sacred Madinah palm groves cultivating revered Ajwa dates to coastal Indian orchards bearing massive W-180 cashews, our procurement team journeys to geographical origins with deep botanical pedigree. We ensure ethical harvesting, direct farmer compensation, and zero compromises in sorting.',
    image: '/images/story_heritage.jpg',
    stat1Number: '100%',
    stat1Label: 'Pure & Chemical Free',
    stat2Number: 'Top 5%',
    stat2Label: 'Hand-Selected Caliber'
  };

  const pillars = story?.pillars?.length > 0
    ? story.pillars.map((p) => ({
        title: p.title,
        description: p.description,
        icon: iconMap[p.icon] || Award
      }))
    : defaultPillars;


  return (
    <div style={{ backgroundColor: '#07130D', minHeight: '100vh', paddingBottom: '90px' }}>
      <SEO
        title="Our Heritage & Philosophy"
        description="Learn about QAMRAH's commitment to unblemished nature, botanical pedigree, ethical orchard partnerships, and artisan preservation."
        canonical="/our-story"
        ogImage="/images/story_heritage.jpg"
        jsonLd={[
          generateOrganizationSchema(),
          generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Our Story', url: '/our-story' }
          ])
        ]}
      />
      {/* Editorial Hero Header */}
      <section
        style={{
          position: 'relative',
          padding: '90px 0 70px',
          background: 'radial-gradient(ellipse at 50% 20%, #153120 0%, #07130D 80%)',
          borderBottom: '1px solid rgba(199, 154, 74, 0.2)',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '820px' }}>
          <div className="eyebrow-label" style={{ justifyContent: 'center' }}>
            <Sparkles size={14} color="#D8B66A" />
            <span>{header.eyebrow}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: '#FFFFFF',
              marginBottom: '20px',
              lineHeight: 1.1
            }}
          >
            {header.heading}
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              lineHeight: 1.7,
              color: 'var(--color-cream-base)',
              fontFamily: 'var(--font-serif-accent)',
              fontStyle: 'italic'
            }}
          >
            {header.quote}
          </p>
        </div>
      </section>

      {/* Main Narrative Split Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '60px',
              alignItems: 'center'
            }}
            className="story-narrative-grid"
          >
            <div>
              <div className="eyebrow-label">{philosophy.eyebrow}</div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: '#FFFFFF', marginBottom: '24px', lineHeight: 1.2 }}>
                {philosophy.heading}
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--color-cream-muted)', marginBottom: '18px' }}>
                {philosophy.paragraph1}
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--color-text-muted)', marginBottom: '28px' }}>
                {philosophy.paragraph2}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div className="luxury-card" style={{ padding: '16px 20px', borderLeft: '3px solid var(--color-gold-base)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gold-light)' }}>{philosophy.stat1Number}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-cream-muted)' }}>{philosophy.stat1Label}</div>
                </div>
                <div className="luxury-card" style={{ padding: '16px 20px', borderLeft: '3px solid var(--color-gold-base)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gold-light)' }}>{philosophy.stat2Number}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-cream-muted)' }}>{philosophy.stat2Label}</div>
                </div>
              </div>
            </div>

            {/* Editorial Showcase Image */}
            <div
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--color-gold-border)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <img
                src={philosophy.image || '/images/story_heritage.jpg'}
                alt="QAMRAH Heritage Selection"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence */}
      <section style={{ padding: '80px 0', backgroundColor: '#091A11', borderTop: '1px solid rgba(199, 154, 74, 0.2)' }}>
        <div className="container">
          <SectionTitle
            eyebrow="OUR STANDARD"
            title="The 4 Pillars of QAMRAH"
            subtitle="The strict guidelines governing our cultivation, grading, and packaging."
            align="center"
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px'
            }}
          >
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="luxury-card" style={{ padding: '32px 24px' }}>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'rgba(199, 154, 74, 0.15)',
                      border: '1px solid var(--color-gold-base)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                      color: 'var(--color-gold-light)'
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '12px' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.65', color: 'var(--color-cream-muted)' }}>
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ padding: '70px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.2rem', marginBottom: '16px', color: '#FFFFFF' }}>
            Experience The Purest Nutrition
          </h2>
          <p style={{ color: 'var(--color-cream-muted)', maxWidth: '520px', margin: '0 auto 28px' }}>
            Explore our royal catalog of cashews, almonds, holy Ajwa dates, and toasted pistachios.
          </p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            <span>EXPLORE OUR COLLECTION</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .story-narrative-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
