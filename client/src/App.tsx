import { FormEvent, ReactNode, Suspense, lazy, useEffect, useState } from "react";

// Admin is lazy-loaded: public visitors never download the dashboard bundle.
const AdminDashboard = lazy(() => import("@/admin/AdminDashboard"));
import Lightbox from "@/components/Lightbox";
import Testimonials from "@/components/Testimonials";
import WhatsAppFab from "@/components/WhatsAppFab";
import ProjectDetail from "@/pages/ProjectDetail";
import { createEnquiry } from "@/lib/api";
import { initAnalytics, trackEvent, trackPageView } from "@/lib/analytics";
import { galleryPhotos, galleryCategories } from "@/lib/gallery";
import { projectCaseStudies, photosFor } from "@/lib/projects";
import { injectLocalBusinessSchema, useSeo } from "@/lib/seo";
import { PHONES, SITE, whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/site";
import { mockPropertyListings, mockRoofingProducts } from "@/lib/mockCms";
import { Link, Route, Switch, useLocation } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  HardHat,
  Home as HomeIcon,
  Mail,
  MapPin,
  Menu,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

const ASSETS = {
  logo: "/images/logo_22da56e1.png",
  hero: "/images/hero-red-roof_78e57ca6.jpeg",
  pinkRoof: "/images/home-pink-roof_178510ed.jpeg",
  blueRoof: "/images/home-blue-roof_36d157bc.jpeg",
  colonnade: "/images/colonnade_cc91d531.jpeg",
  frame: "/images/construction-frame_e0f41e5a.jpeg",
  greyHouse: "/images/house-grey_2ed75e58.jpeg",
  redHouse: "/images/house-red_3d6d39f5.jpeg",
  tallHouse: "/images/tall-house_60c0ab4a.jpeg",
  roofFrame: "/images/roof-frame_e50d38a3.jpeg",
  brickHome: "/images/brick-home_3a6fc288.jpeg",
};
const phones = PHONES;
const navItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Projects", "/projects"],
  ["Contact", "/contact"],
] as const;

const serviceCards = [
  { icon: HomeIcon, eyebrow: "01 / Roofing", title: "Roofing solutions", body: "Supply and installation of modern roofing sheets, accessories and the craftsmanship to bring every roof together.", image: ASSETS.pinkRoof },
  { icon: Building2, eyebrow: "02 / Construction", title: "Building & construction", body: "From foundation to finishing, we help clients move practical building projects from plans to reality.", image: ASSETS.frame },
  { icon: Sparkles, eyebrow: "03 / Finishing", title: "Finishing works", body: "POP ceilings, tiling, tinted glass, trusses, woodworks and the details that complete a space.", image: ASSETS.colonnade },
  { icon: Ruler, eyebrow: "04 / Real estate", title: "Land & property", body: "Support for land buying and selling, property sales and building on your own land.", image: ASSETS.greyHouse },
];

const roofingTypes = [
  ["Long Span", "A clean, practical sheet option for a wide range of roof profiles.", ASSETS.hero],
  ["Self-Lock", "A modern profile for projects that call for a crisp, finished look.", ASSETS.pinkRoof],
  ["IBR", "A familiar architectural profile for residential and commercial applications.", ASSETS.blueRoof],
  ["IDT", "A considered roofing option to discuss with our project team.", ASSETS.redHouse],
  ["Euro Tiles / Aero Tiles", "Tile-inspired character with a strong visual presence.", ASSETS.tallHouse],
  ["Stone Coated Shingles", "A textured finish for clients looking for extra roof character.", ASSETS.roofFrame],
];


function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const activePath = location === "/" ? "/" : `/${location.split("/")[1]}`;

  useEffect(() => {
    initAnalytics();
    injectLocalBusinessSchema();
  }, []);

  useEffect(() => {
    trackPageView(location);
    window.scrollTo({ top: 0 });
  }, [location]);

  return (
    <div className="site-shell">
      <div className="topline">
        <div className="container topbar-inner">
          <span><MapPin size={13} /> Techiman, Bono East Region, Ghana</span>
          <span className="topbar-coverage">Serving all 16 regions of Ghana & beyond</span>
          <a href={`tel:${phones[0]}`}><Phone size={13} /> {phones[0]}</a>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand" onClick={() => setMenuOpen(false)}>
            <img src={ASSETS.logo} alt="JILMEK Roofing & Construction Ltd" />
          </Link>
          <nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className={activePath === href ? "active" : ""} onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <a className="header-phone" href={`tel:${phones[0]}`}><Phone size={15} /> <span>Call JILMEK</span></a>
            <Link className="button button-gold button-small" href="/contact#estimate" onClick={() => setMenuOpen(false)}>Get a free estimate <ArrowRight size={15} /></Link>
            <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
      <WhatsAppFab />
      <div className="mobile-cta"><a href={`tel:${phones[0]}`} onClick={() => trackEvent("phone_click", { source: "mobile_bar" })}><Phone size={16} /> Call</a><a href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", { source: "mobile_bar" })}>WhatsApp</a><Link href="/contact#estimate"><Sparkles size={16} /> Estimate</Link></div>
    </div>
  );
}

function Footer() {
  return <footer className="site-footer">
    <div className="container footer-main">
      <div className="footer-brand">
        <img src={ASSETS.logo} alt="JILMEK logo" />
        <p>Everything About Construction.</p>
        <p className="footer-note">Professional roofing, building, finishing and real estate services from Techiman, Ghana.</p>
      </div>
      <div><p className="footer-label">Explore</p><div className="footer-links">{navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div></div>
      <div><p className="footer-label">Services</p><div className="footer-links"><Link href="/services#roofing">Roofing</Link><Link href="/services#construction">Building & Construction</Link><Link href="/services#finishing">POP & Finishing</Link><Link href="/services#real-estate">Real Estate</Link></div></div>
      <div><p className="footer-label">Contact</p><div className="footer-contact"><span><MapPin size={15} /> Techiman, Bono East Region</span>{phones.map((phone) => <a href={`tel:${phone}`} key={phone}><Phone size={15} /> {phone}</a>)}<span className="footer-coverage"><ShieldCheck size={15} /> Ghana & beyond</span></div></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} JILMEK Roofing & Construction Ltd.</span><span>Free consultation · Free estimate / quotation</span></div>
  </footer>;
}

function PageHero({ kicker, title, body, image = ASSETS.hero, children }: { kicker: string; title: string; body: string; image?: string; children?: ReactNode }) {
  return <section className="page-hero">
    <img className="page-hero-image" src={image} alt="JILMEK project photography" />
    <div className="page-hero-overlay" />
    <div className="container page-hero-content"><p className="eyebrow eyebrow-light">{kicker}</p><h1>{title}</h1><p className="hero-copy">{body}</p>{children}</div>
  </section>;
}

function SectionHeading({ eyebrow, title, body, light = false, align = "left" }: { eyebrow: string; title: string; body?: string; light?: boolean; align?: "left" | "center" }) {
  const cleanEyebrow = eyebrow.replace(/^\d+\s*—\s*/, "");
  return <div className={`section-heading ${light ? "light" : ""} ${align === "center" ? "center" : ""}`}><p className="eyebrow">{cleanEyebrow}</p><h2>{title}</h2>{body && <p>{body}</p>}</div>;
}

function ButtonLink({ href, children, variant = "green" }: { href: string; children: ReactNode; variant?: "green" | "gold" | "outline" | "white" }) {
  return <Link href={href} className={`button button-${variant}`}>{children}<ArrowRight size={16} /></Link>;
}

function Home() {
  const cmsListings = mockPropertyListings.filter((listing) => listing.isPublished);
  useSeo({
    title: `${SITE.name} | Roofing & Construction in ${SITE.city}, Ghana`,
    description: "Roofing sheet supply and installation, building and construction, POP and finishing works, and real estate services. Free consultation and free estimate. Techiman, Ghana.",
    path: "/",
  });
  return <>
    <section className="home-hero">
      <img className="home-hero-image" src={ASSETS.hero} alt="Completed JILMEK residence with a finished blue hip roof" />
      <div className="home-hero-overlay" />
      <div className="hero-grid container"><div className="hero-content"><p className="eyebrow eyebrow-light">Everything about construction</p><h1>Roofing, building & construction solutions you can trust.</h1><p>JILMEK Roofing & Construction Ltd provides roofing, building, finishing and real estate services from Techiman, Bono East Region, with projects across Ghana and beyond.</p><div className="hero-buttons"><ButtonLink href="/contact#estimate" variant="gold">Request a free estimate</ButtonLink><a className="button button-outline-white" href={`tel:${phones[0]}`}><Phone size={16} /> Call us</a></div><div className="hero-proof"><span><BadgeCheck size={18} /> Free consultation</span><span><BadgeCheck size={18} /> Free quotation</span></div></div><div className="hero-stamp"><span>JILMEK</span><small>Roofing & Construction Ltd</small><i>Ghana & beyond</i></div></div>
    </section>

    <section className="intro-section section-pad"><div className="container intro-layout"><div><p className="section-number">01 — The JILMEK approach</p><SectionHeading eyebrow="Built for real projects" title="Building. Roofing. Finishing. Property." body="JILMEK Roofing & Construction Ltd provides practical solutions across roofing, general construction, finishing works and real estate services. From roofing sheet supply and installation to complete building projects, we help clients move their projects from plans to reality." /><ButtonLink href="/about" variant="outline">Discover JILMEK</ButtonLink></div><div className="intro-aside"><div className="quote-mark">“</div><p>We are here to make the next step clear — whether you are planning a roof, a home, a finish or a property move.</p><span>— JILMEK Roofing & Construction Ltd</span></div></div></section>

    <section className="service-overview section-pad section-tint"><div className="container"><SectionHeading eyebrow="02 — What we do" title="One trusted team. Four ways to move forward." body="A focused service mix for clients who want to build with confidence and talk to people who understand the work." align="center" /><div className="service-grid">{serviceCards.map(({ icon: Icon, eyebrow, title, body, image }) => <Link href={title.includes("Roofing") ? "/services#roofing" : title.includes("Construction") ? "/services#construction" : title.includes("Finishing") ? "/services#finishing" : "/services#real-estate"} className="service-card" key={title}><div className="service-card-image"><img src={image} alt={title} loading="lazy" /><span className="service-icon"><Icon size={21} /></span></div><div className="service-card-copy"><p className="eyebrow">{eyebrow}</p><h3>{title}</h3><p>{body}</p><span className="text-link">Explore service <ArrowRight size={15} /></span></div></Link>)}</div></div></section>

    <section className="roofing-feature section-pad"><div className="container split-layout"><div className="split-image image-stack"><img className="main-image" src={ASSETS.blueRoof} alt="Modern blue roof supplied project" loading="lazy" /><div className="image-caption"><span>ROOFING SOLUTIONS</span><strong>Choose the profile that fits your project.</strong></div></div><div className="split-copy"><p className="section-number">03 — Roofing solutions</p><SectionHeading eyebrow="Modern roofing solutions" title="A roof that looks right, feels considered and is installed with care." body="We supply and install different types of modern roofing sheets, together with the accessories and installation services required to complete your roofing project." /><div className="type-list">{roofingTypes.slice(0, 4).map(([name]) => <span key={name}><CircleCheck size={16} /> {name}</span>)}</div><ButtonLink href="/services#roofing">Explore roofing services</ButtonLink></div></div></section>

    <section className="comparison-section section-pad"><div className="container"><SectionHeading eyebrow="04 — Make an informed choice" title="Choosing the right roofing material" body="A clear starting point for the conversation. We can help you consider the look, use and budget of your project." align="center" /><div className="comparison-grid"><div className="material-card material-aluminium"><div><p className="eyebrow">Option A</p><h3>Aluminium</h3></div><ul><li>Pure aluminium</li><li>Does not rust</li><li>Very lightweight</li><li>Long-lasting</li><li>Higher cost</li></ul><span className="material-mark">01</span></div><div className="material-card material-msl"><div><p className="eyebrow">Option B</p><h3>MSL / Aluzinc</h3></div><ul><li>Iron + zinc + aluminium coating</li><li>Strong</li><li>Good quality</li><li>Moderate price</li><li>May rust after many years</li></ul><span className="material-mark">02</span></div></div><div className="center-button"><ButtonLink href="/contact#estimate" variant="gold">Talk to us about your roofing project</ButtonLink></div></div></section>

    <section className="construction-feature section-pad section-charcoal"><div className="container split-layout split-reverse"><div className="split-copy light-copy"><p className="section-number">05 — Construction</p><SectionHeading light eyebrow="From foundation to finishing" title="Build with a team that sees the whole project." body="JILMEK provides general building and construction services for clients looking to develop their projects from foundation through finishing." /><div className="check-grid">{["Building from foundation to finishing", "POP ceiling works", "Tiling works", "Tinted glass works", "Trusses & woodworks", "General finishing works"].map((item) => <span key={item}><CircleCheck size={17} /> {item}</span>)}</div><ButtonLink href="/services#construction" variant="green">View construction services</ButtonLink></div><div className="split-image"><img className="main-image" src={ASSETS.frame} alt="JILMEK construction project photo" loading="lazy" /><div className="dark-image-note"><HardHat size={18} /><span>Practical guidance from first conversation to final detail.</span></div></div></div></section>

    <section className="real-estate-section section-pad"><div className="container"><div className="real-estate-head"><div><p className="section-number">06 — Real estate</p><SectionHeading eyebrow="Real estate services" title="More ways to move a property project forward." body="Beyond construction, JILMEK provides services for clients looking to buy, sell or develop land and property." /></div><img src={ASSETS.tallHouse} alt="Residential property supplied project" loading="lazy" /></div><div className="real-estate-grid"><div><span>01</span><h3>Buy & sell land</h3><p>Enquire about land opportunities and the next steps for a property decision.</p><Link href="/contact#estimate" className="text-link">Enquire about land <ArrowRight size={15} /></Link></div><div><span>02</span><h3>Property sales</h3><p>We help clients sell their houses, buildings and other properties.</p><Link href="/contact#estimate" className="text-link">Sell your property <ArrowRight size={15} /></Link></div><div><span>03</span><h3>Build on your land</h3><p>Have your own land? We can help turn it into a completed building project.</p><Link href="/contact#estimate" className="text-link">Start your project <ArrowRight size={15} /></Link></div>{cmsListings.slice(0, 3).map((listing) => <div key={listing.id}><span>CMS / {listing.listingType}</span><h3>{listing.title}</h3><p>{listing.location}{listing.priceLabel ? ` · ${listing.priceLabel}` : ""}</p><Link href="/contact#estimate" className="text-link">Enquire about listing <ArrowRight size={15} /></Link></div>)}</div></div></section>

    <section className="why-section section-pad section-tint"><div className="container why-layout"><div><p className="section-number">07 — Why JILMEK</p><SectionHeading eyebrow="A clear, grounded proposition" title="Professional help without the guesswork." body="The information on this website is designed to help you start a useful conversation — not to make claims we cannot substantiate." /><ButtonLink href="/about" variant="outline">More about the company</ButtonLink></div><div className="why-list">{[["01", "Roofing expertise", "Supply and installation of multiple roofing sheet options."], ["02", "Complete construction", "From structural construction through finishing."], ["03", "Multiple service areas", "Projects across all 16 regions of Ghana and outside Ghana."], ["04", "Free consultation", "Get professional guidance before starting your project."], ["05", "Free estimate", "Request a quotation for your project."]].map(([num, title, body]) => <div key={num}><span>{num}</span><div><h3>{title}</h3><p>{body}</p></div></div>)}</div></div></section>

    <section className="coverage-section section-pad"><div className="container coverage-card"><div className="coverage-copy"><p className="section-number">08 — Project coverage</p><SectionHeading light eyebrow="Serving clients across Ghana" title="Based in Techiman. Ready for projects beyond." body="Based in Techiman, Bono East Region, JILMEK Roofing & Construction Ltd undertakes projects across all 16 regions of Ghana and outside Ghana." /><div className="coverage-meta"><span><MapPin size={18} /> Main office: Techiman, Bono East Region</span><span><ShieldCheck size={18} /> Service coverage: all 16 regions + outside Ghana</span></div></div><div className="ghana-visual"><div className="ghana-map-shape">GHANA<div className="map-pin pin-one" /><div className="map-pin pin-two" /><div className="map-pin pin-three" /></div><p>One home base. A wider reach.</p></div></div></section>

    <section className="projects-preview section-pad section-tint"><div className="container"><div className="projects-head"><SectionHeading eyebrow="09 — Our work" title="A look at supplied project photography." body="Actual JILMEK project images will keep growing as more work is documented." /><ButtonLink href="/projects" variant="outline">View all projects</ButtonLink></div><div className="project-mosaic"><Link href="/projects" className="project-tile large"><img src={ASSETS.hero} alt="Supplied JILMEK roofing project" loading="lazy" /><div><span>Roofing</span><h3>Roofline character, built with intent.</h3></div></Link><Link href="/projects" className="project-tile"><img src={ASSETS.colonnade} alt="Supplied JILMEK construction project" loading="lazy" /><div><span>Construction</span><h3>Structure and frontage.</h3></div></Link><Link href="/projects" className="project-tile"><img src={ASSETS.greyHouse} alt="Supplied JILMEK residential project" loading="lazy" /><div><span>Residential</span><h3>Homes taking shape.</h3></div></Link></div></div></section>

    <Testimonials />

    <section className="cta-section section-pad"><div className="container cta-card"><div><p className="eyebrow">Start the conversation</p><h2>Planning a construction or roofing project?</h2><p>Get in touch with JILMEK Roofing & Construction Ltd for a free consultation and estimate.</p></div><div className="cta-actions"><ButtonLink href="/contact#estimate" variant="gold">Get free estimate</ButtonLink><a className="button button-outline-white" href={`tel:${phones[0]}`}><Phone size={16} /> Call JILMEK</a></div></div></section>
  </>;
}

function About() {
  useSeo({
    title: "About JILMEK — roofing & construction company in Techiman",
    description: `JILMEK Roofing & Construction Ltd is a roofing and construction company based in ${SITE.city}, ${SITE.region}, Ghana, serving clients across all 16 regions and beyond.`,
    path: "/about",
  });
  return <>
    <PageHero kicker="About JILMEK" title="A practical partner for the work that matters." body="JILMEK Roofing & Construction Ltd is a construction and roofing company based in Techiman, Bono East Region, Ghana." image={ASSETS.pinkRoof}><ButtonLink href="/contact#estimate" variant="gold">Let's discuss your project</ButtonLink></PageHero>
    <section className="section-pad"><div className="container split-layout"><div><p className="section-number">01 — Company introduction</p><SectionHeading eyebrow="Everything about construction" title="Built around clear conversations and complete project thinking." body="We provide roofing, building, finishing and real estate services for clients working on residential, commercial and property projects. Our role is to help make the next decision easier, from a first idea through the work itself." /></div><div className="pull-quote"><div className="quote-mark">“</div><p>From roofing sheet supply and installation to building projects on your own land, we help clients move from plans to reality.</p></div></div></section>
    <section className="section-pad section-tint"><div className="container"><SectionHeading eyebrow="02 — What we do" title="Four core areas, one consistent standard." body="A focused mix of services that meets clients at different stages of a property or construction journey." align="center" /><div className="about-focus-grid">{serviceCards.map(({ icon: Icon, title, body }) => <div key={title}><Icon size={25} /><h3>{title}</h3><p>{body}</p></div>)}</div></div></section>
    <section className="section-pad"><div className="container image-band"><img src={ASSETS.colonnade} alt="Supplied project frontage" loading="lazy" /><div><p className="section-number">03 — A grounded approach</p><SectionHeading eyebrow="Craftsmanship over noise" title="The details should carry the message." body="Our visual language is simple by design: strong materials, clear information, careful installation and a direct route to the people who can help." /><div className="mini-values"><span><CircleCheck size={16} /> Clear scope</span><span><CircleCheck size={16} /> Honest options</span><span><CircleCheck size={16} /> Practical next steps</span></div></div></div></section>
    <section className="section-pad section-charcoal"><div className="container"><SectionHeading light eyebrow="04 — Roofing" title="The roof is more than a finish." body="We supply and install modern roofing sheets and accessories, while helping clients consider material, profile, appearance and project context." /><div className="about-statements"><div><strong>01</strong><h3>Supply</h3><p>Talk through the roofing sheet options that fit your project.</p></div><div><strong>02</strong><h3>Installation</h3><p>Move from product choice to a complete roofing conversation.</p></div><div><strong>03</strong><h3>Accessories</h3><p>Bring the roof together with the supporting details it needs.</p></div></div></div></section>
    <section className="section-pad"><div className="container split-layout split-reverse"><div className="split-image"><img className="main-image" src={ASSETS.frame} alt="Supplied construction frame" loading="lazy" /></div><div><p className="section-number">05 — Construction</p><SectionHeading eyebrow="From foundation through finishing" title="A complete view of the build." body="General building, POP ceilings, tiling, tinted glass, trusses, woodworks and other finishing works can be considered as part of the project scope." /><ButtonLink href="/services#construction">See construction services</ButtonLink></div></div></section>
    <section className="section-pad section-tint"><div className="container"><SectionHeading eyebrow="06 — Finishing" title="The final details make a space feel complete." body="We bring a coordinated eye to POP, tiling, tinted glass, trusses, woodworks and other finishing services." align="center" /><div className="finish-strip"><img src={ASSETS.colonnade} alt="Supplied frontage detail" loading="lazy" /><img src={ASSETS.blueRoof} alt="Supplied roof detail" loading="lazy" /><img src={ASSETS.tallHouse} alt="Supplied property detail" loading="lazy" /></div></div></section>
    <section className="section-pad"><div className="container real-estate-callout"><div><p className="section-number">07 — Real estate</p><SectionHeading eyebrow="Land, property & development" title="Make the property decision with a team that can see the build too." body="JILMEK supports clients looking to buy or sell land, sell property or build on their own land." /></div><img src={ASSETS.tallHouse} alt="Supplied property project" loading="lazy" /></div></section>
    <section className="section-pad section-tint"><div className="container coverage-row"><div><p className="section-number">08 — Coverage</p><SectionHeading eyebrow="Based in Techiman" title="Serving Ghana and beyond." body="We undertake projects across all 16 regions of Ghana and outside Ghana. Techiman remains the company's main office location." /></div><div className="coverage-badge"><MapPin size={24} /><strong>Techiman</strong><span>Bono East Region, Ghana</span><small>All 16 regions + outside Ghana</small></div></div></section>
    <section className="cta-section section-pad"><div className="container cta-card"><div><p className="eyebrow">Talk to JILMEK</p><h2>Let's discuss your project.</h2><p>Free consultation. Free estimate / quotation. A clear place to begin.</p></div><ButtonLink href="/contact#estimate" variant="gold">Start a conversation</ButtonLink></div></section>
  </>;
}

function Services() {
  useSeo({
    title: "Services — roofing sheets, construction, POP & finishing",
    description: "Long Span, Self-Lock, IBR, IDT, Euro Tiles and Stone Coated Shingles supply and installation, plus general building, POP ceilings, tiling, tinted glass and real estate services.",
    path: "/services",
  });
  const cmsProducts = mockRoofingProducts.filter((product) => product.isPublished);
  const displayRoofingTypes = cmsProducts.length ? cmsProducts.map((product) => [product.name, product.description, product.imageUrl || ASSETS.blueRoof]) : roofingTypes;
  return <>
    <PageHero kicker="Services" title="Everything about construction, in one focused place." body="Roofing, construction, finishing and real estate services shaped around real project conversations." image={ASSETS.blueRoof}><ButtonLink href="/contact#estimate" variant="gold">Request a free estimate</ButtonLink></PageHero>
    <section className="section-pad"><div className="container"><SectionHeading eyebrow="01 — Service overview" title="Choose the next step that matches your project." body="Every major service area leads to a clear enquiry route. Start with the work you need and we will help define the scope." align="center" /><div className="service-directory"><a href="#roofing"><span>01</span><HomeIcon size={24} /><strong>Roofing</strong><p>Sheets, accessories and installation</p><ArrowRight /></a><a href="#construction"><span>02</span><Building2 size={24} /><strong>Construction</strong><p>Foundation to finishing</p><ArrowRight /></a><a href="#finishing"><span>03</span><Sparkles size={24} /><strong>Finishing</strong><p>POP, tiling, glass and details</p><ArrowRight /></a><a href="#real-estate"><span>04</span><Ruler size={24} /><strong>Real estate</strong><p>Land, property and development</p><ArrowRight /></a></div></div></section>
    <section id="roofing" className="section-pad section-tint"><div className="container"><div className="anchor-title"><p className="section-number">02 — Roofing</p><SectionHeading eyebrow="Roofing sheet supply & installation" title="Roofing solutions built for your project." body="We supply and install a range of modern roofing sheets and provide the accessories and installation services needed for complete roofing projects." /><ButtonLink href="/contact#estimate">Request a roofing estimate</ButtonLink></div><div className="roofing-type-grid">{displayRoofingTypes.map(([name, body, image]) => <div className="roofing-type-card" key={name}><img src={image} alt={`${name} roofing project`} loading="lazy" /><div><p className="eyebrow">Roofing option</p><h3>{name}</h3><p>{body}</p><Link href="/contact#estimate" className="text-link">Enquire now <ArrowRight size={15} /></Link></div></div>)}</div></div></section>
    <section className="section-pad"><div className="container"><SectionHeading eyebrow="03 — Roofing materials" title="Aluminium vs MSL / Aluzinc" body="Use this comparison as a starting point, then talk to JILMEK about what makes sense for your project." align="center" /><div className="simple-table"><div className="table-head"><span>Aluminium</span><span>MSL / Aluzinc</span></div><div className="table-row"><span>Pure aluminium</span><span>Iron + zinc + aluminium coating</span></div><div className="table-row"><span>Does not rust</span><span>Strong and good quality</span></div><div className="table-row"><span>Very lightweight</span><span>Moderate price</span></div><div className="table-row"><span>Long-lasting</span><span>May rust after many years</span></div><div className="table-row"><span>More expensive</span><span>More affordable</span></div></div><div className="center-button"><ButtonLink href="/contact#estimate" variant="gold">Which option is right for you?</ButtonLink></div></div></section>
    <section id="construction" className="section-pad section-charcoal"><div className="container"><SectionHeading light eyebrow="04 — Construction" title="Building from foundation to finishing." body="General building and construction services for clients looking to develop their projects from foundation through finishing." /><div className="dark-service-grid">{[["General building", "Building from foundation to finishing.", ASSETS.frame], ["POP ceiling works", "Considered ceiling details for finished interiors.", ASSETS.colonnade], ["Tiling works", "Hard-wearing surfaces and clean finishing decisions.", ASSETS.greyHouse], ["Tinted glass works", "Glass details that shape the way a space feels.", ASSETS.tallHouse], ["Trusses & woodworks", "The supporting structure and crafted details.", ASSETS.roofFrame], ["Finishing works", "The final layer that completes the project.", ASSETS.pinkRoof]].map(([title, body, image]) => <div key={title} className="dark-service-card"><img src={image} alt={title} loading="lazy" /><div><h3>{title}</h3><p>{body}</p><Link href="/contact#estimate" className="text-link">Enquire now <ArrowRight size={15} /></Link></div></div>)}</div></div></section>
    <section id="finishing" className="section-pad section-tint"><div className="container split-layout"><div><p className="section-number">05 — Finishing</p><SectionHeading eyebrow="Finishing services" title="The work after the structure is what makes it yours." body="Bring together POP ceilings, tiling, tinted glass, trusses, woodworks and general finishing works through one clear scope." /><ButtonLink href="/contact#estimate">Discuss finishing works</ButtonLink></div><div className="split-image"><img className="main-image" src={ASSETS.colonnade} alt="Supplied project finishing detail" loading="lazy" /></div></div></section>
    <section id="real-estate" className="section-pad"><div className="container"><SectionHeading eyebrow="06 — Real estate" title="Land, property and building support." body="Beyond construction, JILMEK provides services for clients looking to buy, sell or develop land and property." align="center" /><div className="estate-service-grid"><div><span>01</span><h3>Land — Buy & Sell</h3><p>Information about available land opportunities can be added as the company provides it.</p><ButtonLink href="/contact#estimate" variant="outline">Enquire about land</ButtonLink></div><div><span>02</span><h3>Property sales</h3><p>We help clients sell their houses, buildings and properties.</p><ButtonLink href="/contact#estimate" variant="outline">Sell your property</ButtonLink></div><div><span>03</span><h3>Build on your own land</h3><p>Have your own land? We can help turn it into a completed building project.</p><ButtonLink href="/contact#estimate" variant="outline">Start your project</ButtonLink></div></div></div></section>
    <section className="section-pad section-tint"><div className="container process-section"><div><p className="section-number">07 — How it works</p><SectionHeading eyebrow="A simple four-step process" title="Start with a conversation. Build from there." body="The exact scope will depend on your project. This is the straightforward path we use to begin." /></div><div className="process-list">{[["01", "Consultation", "Discuss your project requirements."], ["02", "Assessment", "Review the work and material requirements."], ["03", "Estimate", "Receive a project quotation."], ["04", "Work", "Proceed with the agreed roofing, construction or property work."]].map(([num, title, body]) => <div key={num}><span>{num}</span><div><h3>{title}</h3><p>{body}</p></div></div>)}</div></div></section>
    <section className="section-pad"><div className="container faq-mini"><SectionHeading eyebrow="08 — Common questions" title="A few useful starting points." body="Need more detail? Ask us directly and we will guide the next step." /><div className="faq-list"><FaqItem question="What roofing sheets do you supply?" answer="Long Span, Self-Lock, IBR, IDT, Euro Tiles / Aero Tiles and Stone Coated Shingles." /><FaqItem question="Do you offer estimates and consultations?" answer="Yes. Free consultations and free estimates / quotations are available." /><FaqItem question="Do you work outside Techiman?" answer="Yes. The company states that it undertakes projects across all 16 regions of Ghana and outside Ghana." /></div></div></section>
    <section className="cta-section section-pad"><div className="container cta-card"><div><p className="eyebrow">Take the next step</p><h2>Need a quote or a clearer starting point?</h2><p>Tell JILMEK what you are planning and we will help you shape the conversation.</p></div><ButtonLink href="/contact#estimate" variant="gold">Get free estimate</ButtonLink></div></section>
  </>;
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return <div className={`faq-item ${open ? "open" : ""}`}><button onClick={() => setOpen((value) => !value)} aria-expanded={open}><span>{question}</span>{open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>{open && <p>{answer}</p>}</div>;
}

function Projects() {
  const [filter, setFilter] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useSeo({
    title: "Projects & gallery — roofing and construction work in Ghana",
    description:
      "Browse JILMEK roofing, construction and finishing projects: timber truss frames, roof installations, completed residences and two-storey builds across Ghana.",
    path: "/projects",
    image: galleryPhotos[0]?.src,
  });

  const filtered = filter === "All" ? galleryPhotos : galleryPhotos.filter((item) => item.category === filter);

  return <>
    <PageHero kicker="Projects / Gallery" title="Real JILMEK work, start to finish." body={`${galleryPhotos.length} photographs from JILMEK project sites — truss frames going up, roofs going on, and buildings taken through to completion.`} image={ASSETS.roofFrame}><ButtonLink href="/contact#estimate" variant="gold">Have a similar project?</ButtonLink></PageHero>

    <section className="section-pad">
      <div className="container">
        <div className="projects-head">
          <SectionHeading eyebrow="01 — Case studies" title="Project sets, grouped by the work involved." body="Each set collects photographs from the same kind of job, with a short account of what was actually done." />
        </div>
        <div className="case-study-grid">
          {projectCaseStudies.map((project) => {
            const cover = photosFor(project)[0];
            return (
              <Link key={project.slug} href={`/projects/${project.slug}`} className="case-study-card">
                {cover && <img src={cover.thumb} alt={cover.alt} loading="lazy" />}
                <div>
                  <span className="case-study-category">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <span className="text-link">View project <ArrowRight size={15} /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>

    <section className="section-pad section-tint">
      <div className="container">
        <div className="projects-head">
          <SectionHeading eyebrow="02 — Full gallery" title="Every photo in the library." body="Filter by the kind of work, then tap any photo to open it full screen." />
          <ButtonLink href="/contact#estimate" variant="outline">Request a similar estimate</ButtonLink>
        </div>
        <div className="filter-row" role="tablist" aria-label="Project categories">
          {galleryCategories.map((option) => (
            <button key={option} className={filter === option ? "active" : ""} onClick={() => { setFilter(option); setLightboxIndex(null); }} role="tab" aria-selected={filter === option}>
              {option}
              <small>{option === "All" ? galleryPhotos.length : galleryPhotos.filter((p) => p.category === option).length}</small>
            </button>
          ))}
        </div>
        <div className="photo-grid">
          {filtered.map((photo, index) => (
            <button key={photo.slug} className="photo-tile" onClick={() => setLightboxIndex(index)} aria-label={`Open photo: ${photo.alt}`}>
              <img src={photo.thumb} alt={photo.alt} loading="lazy" />
              <span className="photo-tile-tag">{photo.category}</span>
            </button>
          ))}
        </div>
      </div>
    </section>

    <Testimonials />

    <section className="section-charcoal section-pad">
      <div className="container">
        <SectionHeading light eyebrow="03 — Categories" title="From roofing detail to the wider property picture." body="The gallery grows as JILMEK documents more work." />
        <div className="category-band">{galleryCategories.filter((c) => c !== "All").map((c) => <span key={c}>{c}</span>)}</div>
      </div>
    </section>

    <section className="cta-section section-pad"><div className="container cta-card"><div><p className="eyebrow">Your project</p><h2>Have a similar project in mind?</h2><p>Talk to JILMEK Roofing & Construction Ltd about a free consultation and estimate.</p></div><ButtonLink href="/contact#estimate" variant="gold">Discuss your project</ButtonLink></div></section>

    {lightboxIndex !== null && (
      <Lightbox photos={filtered} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onIndexChange={setLightboxIndex} />
    )}
  </>;
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useSeo({
    title: "Contact JILMEK — free roofing & construction estimate",
    description: `Request a free estimate from JILMEK Roofing & Construction Ltd. Main office in ${SITE.city}, ${SITE.region}. Projects across Ghana and beyond.`,
    path: "/contact",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSending(true);
    try {
      await createEnquiry({
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        location: String(data.get("location") ?? ""),
        service: String(data.get("service") ?? ""),
        message: String(data.get("message") ?? ""),
        preferred: String(data.get("preferred") ?? "Phone"),
      });
      trackEvent("enquiry_submit", { service: data.get("service") });
      setSubmitted(true);
      form.reset();
      toast.success("Enquiry sent — the JILMEK team will be in touch.");
    } catch {
      toast.error("That didn't send. Please call or WhatsApp us instead.");
    } finally {
      setSending(false);
    }
  };
  return <>
    <PageHero kicker="Contact JILMEK" title="Let's discuss your project." body="Whether you need roofing, construction, finishing or real estate services, contact JILMEK Roofing & Construction Ltd." image={ASSETS.colonnade}><a className="button button-gold" href={`tel:${phones[0]}`}><Phone size={16} /> Call JILMEK</a></PageHero>
    <section className="section-pad"><div className="container contact-cards"><div><p className="section-number">01 — Main office</p><MapPin size={24} /><h3>Techiman, Bono East Region, Ghana</h3><p>Our main office location and base for projects across Ghana and beyond.</p></div><div><p className="section-number">02 — Call us</p><Phone size={24} /><h3>Speak with JILMEK</h3><div className="phone-list">{phones.map((phone) => <a href={`tel:${phone}`} key={phone}>{phone} <ArrowRight size={15} /></a>)}</div></div><div><p className="section-number">03 — Email</p><Mail size={24} /><h3>Start with the details</h3><p>Use the estimate form and share the basics of what you are planning.</p></div></div></section>
    <section id="estimate" className="section-pad section-tint"><div className="container form-layout"><div><p className="section-number">04 — Free estimate form</p><SectionHeading eyebrow="Tell us what you are planning" title="A simple enquiry form for the first conversation." body="Share enough detail for the team to understand the direction. Email is optional; phone is the fastest route." /><div className="form-note"><ShieldCheck size={18} /><span>Your details are used to help shape the enquiry conversation.</span></div></div><form className="estimate-form" onSubmit={handleSubmit}><label>Full name<input name="name" required placeholder="Your full name" /></label><label>Phone number<input name="phone" required type="tel" placeholder="e.g. 054 578 8758" /></label><label>Email address <span>(optional)</span><input name="email" type="email" placeholder="you@example.com" /></label><label>Location / region<input name="location" placeholder="Where is the project?" /></label><label>Service needed<select name="service" defaultValue=""><option value="" disabled>Select a service</option><option>Roofing</option><option>Roofing sheet supply</option><option>Roofing installation</option><option>General construction</option><option>POP ceiling</option><option>Tiling</option><option>Tinted glass</option><option>Trusses & woodworks</option><option>Finishing works</option><option>Land</option><option>Property sales</option><option>Build on my land</option><option>Other</option></select></label><label>Tell us about your project<textarea name="message" rows={4} placeholder="A short description of what you need help with" /></label><fieldset><legend>Preferred contact method</legend><label className="radio-label"><input type="radio" name="preferred" value="Phone" defaultChecked /> Phone</label><label className="radio-label"><input type="radio" name="preferred" value="Email" /> Email</label></fieldset><button className="button button-green form-submit" type="submit" disabled={sending}>{sending ? "Sending…" : submitted ? "Send another enquiry" : "Request free estimate"} <ArrowRight size={16} /></button><p className="form-alt">Prefer WhatsApp? <a href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer">Message us directly</a>.</p></form></div></section>
    <section className="section-pad"><div className="container coverage-row"><div><p className="section-number">05 — Coverage</p><SectionHeading eyebrow="We work across Ghana and beyond" title="Main office: Techiman. Service coverage: all 16 regions + outside Ghana." body="Only Techiman is presented as the main office location. Add more location detail when JILMEK supplies it." /></div><div className="ghana-visual light"><div className="ghana-map-shape">GHANA<div className="map-pin pin-one" /><div className="map-pin pin-two" /><div className="map-pin pin-three" /></div></div></div></section>
    <section className="section-pad section-tint"><div className="container contact-types"><SectionHeading eyebrow="06 — What can we help with?" title="Bring the project type. We will help with the next step." align="center" /><div className="contact-type-grid">{["Roofing sheet supply", "Roofing installation", "Building & construction", "POP / tiling / glass", "Land & property", "Build on my land"].map((item) => <span key={item}><CircleCheck size={17} /> {item}</span>)}</div></div></section>
    <section className="section-pad"><div className="container contact-path-grid"><div><p className="section-number">07 — Choose your path</p><SectionHeading eyebrow="Three useful ways to start" title="Make the first step work for you." body="Call when you want a quick conversation. Use the form when you want to share more detail. Ask for a consultation when the project needs thinking space." /></div><div className="path-cards"><div><Phone size={20} /><h3>Call JILMEK</h3><p>Speak directly with the team using any listed number.</p></div><div><Sparkles size={20} /><h3>Request an estimate</h3><p>Share the basics and ask for a free quotation.</p></div><div><Ruler size={20} /><h3>Book a consultation</h3><p>Start with a clearer project conversation.</p></div></div></div></section>
    <section className="section-pad"><div className="container faq-mini"><SectionHeading eyebrow="08 — Need a quick answer?" title="Start with the basics." body="The fastest answer for a project-specific question is to call one of the numbers above." /><div className="faq-list"><FaqItem question="Do you offer free estimates?" answer="Yes. Free estimates / quotations are offered." /><FaqItem question="Do you offer consultations?" answer="Yes. Free consultations are offered." /><FaqItem question="Which service areas do you cover?" answer="The company states that it undertakes projects across all 16 regions of Ghana and outside Ghana." /></div></div></section>
    <section className="section-pad section-charcoal"><div className="container contact-callback"><div><p className="eyebrow">We can start here</p><h2>Need a quote? Get a free estimate.</h2><p>Use the form or call JILMEK directly. No invented promises — just a clear first conversation.</p></div><div className="callback-buttons"><a className="button button-gold" href={`tel:${phones[0]}`}><Phone size={16} /> Call JILMEK</a><a className="button button-outline-white" href="#estimate">Free estimate <ArrowRight size={16} /></a></div></div></section>
    <section className="cta-section section-pad"><div className="container cta-card"><div><p className="eyebrow">Talk to JILMEK</p><h2>Need to build, roof or develop a property?</h2><p>Free consultation · Free estimate / quotation · Ghana & beyond</p></div><a className="button button-gold" href={`tel:${phones[0]}`}><Phone size={16} /> Call now</a></div></section>
  </>;
}

function NotFound() {
  return <section className="section-pad"><div className="container empty-page"><p className="eyebrow">404</p><h1>This page is not on the plan yet.</h1><p>Return to the JILMEK home page and find the next project path.</p><ButtonLink href="/">Back home</ButtonLink></div></section>;
}

function App() {
  return (
    <Switch>
      <Route path="/admin/:rest*">
        <Suspense fallback={<div className="adm-loading">Loading dashboard…</div>}>
          <AdminDashboard />
        </Suspense>
      </Route>
      <Route path="/admin">
        <Suspense fallback={<div className="adm-loading">Loading dashboard…</div>}>
          <AdminDashboard />
        </Suspense>
      </Route>
      <Route>
        <Shell>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/services" component={Services} />
            <Route path="/projects" component={Projects} />
            <Route path="/projects/:slug" component={ProjectDetail} />
            <Route path="/contact" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </Shell>
      </Route>
    </Switch>
  );
}

export default App;
