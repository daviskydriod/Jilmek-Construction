import { FormEvent, ReactNode, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { mockPropertyListings, mockRoofingProducts, MockPropertyListing, MockRoofingProduct } from "@/lib/mockCms";
import { Link, Route, Switch, useLocation } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Hammer,
  HardHat,
  Home as HomeIcon,
  LayoutDashboard,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Phone,
  PackageOpen,
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
const phones = ["0545788758", "0240992159", "0506968852", "0352197847"];
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

const galleryItems = [
  { title: "Roofing study / supplied project photo", category: "Roofing", image: ASSETS.hero, status: "Supplied image" },
  { title: "Residential roofline / supplied project photo", category: "Construction", image: ASSETS.pinkRoof, status: "Supplied image" },
  { title: "House shell / supplied project photo", category: "Construction", image: ASSETS.frame, status: "Supplied image" },
  { title: "Completed roof / supplied project photo", category: "Roofing", image: ASSETS.blueRoof, status: "Supplied image" },
  { title: "Architectural frontage / supplied project photo", category: "Finishing", image: ASSETS.colonnade, status: "Supplied image" },
  { title: "Roof structure / supplied project photo", category: "Construction", image: ASSETS.roofFrame, status: "Supplied image" },
  { title: "Residential build / supplied project photo", category: "Construction", image: ASSETS.greyHouse, status: "Supplied image" },
  { title: "Property view / supplied project photo", category: "Real estate", image: ASSETS.tallHouse, status: "Supplied image" },
];

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const activePath = location === "/" ? "/" : `/${location.split("/")[1]}`;

  // make sure to consider if you need authentication for certain routes
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
      <div className="mobile-cta"><a href={`tel:${phones[0]}`}><Phone size={16} /> Call JILMEK</a><Link href="/contact#estimate"><Sparkles size={16} /> Free estimate</Link></div>
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
  return <>
    <section className="home-hero">
      <img className="home-hero-image" src={ASSETS.hero} alt="Red-roof residential project supplied by JILMEK" />
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

    <section className="cta-section section-pad"><div className="container cta-card"><div><p className="eyebrow">Start the conversation</p><h2>Planning a construction or roofing project?</h2><p>Get in touch with JILMEK Roofing & Construction Ltd for a free consultation and estimate.</p></div><div className="cta-actions"><ButtonLink href="/contact#estimate" variant="gold">Get free estimate</ButtonLink><a className="button button-outline-white" href={`tel:${phones[0]}`}><Phone size={16} /> Call JILMEK</a></div></div></section>
  </>;
}

function About() {
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
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? galleryItems : galleryItems.filter((item) => item.category === filter);
  return <>
    <PageHero kicker="Projects / Gallery" title="A look at roofing, construction and finishing work." body="A growing gallery of supplied JILMEK project photography. More project detail can be added as it is documented." image={ASSETS.roofFrame}><ButtonLink href="/contact#estimate" variant="gold">Have a similar project?</ButtonLink></PageHero>
    <section className="section-pad"><div className="container"><div className="projects-head"><SectionHeading eyebrow="01 — Supplied work" title="Actual project photography, clearly presented." body="We are keeping project descriptions factual until the company supplies specific names, locations and completion details." /><ButtonLink href="/contact#estimate" variant="outline">Request a similar estimate</ButtonLink></div><div className="filter-row" role="tablist" aria-label="Project categories">{["All", "Roofing", "Construction", "Finishing", "Real estate"].map((option) => <button key={option} className={filter === option ? "active" : ""} onClick={() => setFilter(option)}>{option}</button>)}</div><div className="gallery-grid">{filtered.map((item, index) => <article className={`gallery-card ${index === 0 ? "gallery-feature" : ""}`} key={item.title}><img src={item.image} alt={item.title} loading="lazy" /><div className="gallery-card-copy"><div><span className="gallery-category">{item.category}</span><span className="gallery-status">{item.status}</span></div><h3>{item.title}</h3><p>Location and project details available on request.</p><Link href="/contact#estimate" className="text-link">Discuss a similar project <ArrowRight size={15} /></Link></div></article>)}</div></div></section>
    <section className="section-pad section-tint"><div className="container project-note"><div className="project-note-icon"><BadgeCheck size={30} /></div><div><p className="section-number">02 — Keep it factual</p><h2>More project stories will be added as they are supplied.</h2><p>JILMEK can expand this gallery with project name, location, category, description, completion status and multiple photographs for each case study.</p></div><ButtonLink href="/contact#estimate" variant="outline">Add your project story</ButtonLink></div></section>
    <section className="section-pad"><div className="container project-detail-preview"><div className="detail-photo"><img src={ASSETS.redHouse} alt="Supplied JILMEK project photo" loading="lazy" /><span>Supplied project image</span></div><div><p className="section-number">03 — Project detail pathway</p><SectionHeading eyebrow="A fuller story, when ready" title="Every project can become a useful case study." body="Future project detail pages can include an overview, services provided, a gallery and a direct route to request a similar estimate." /><div className="detail-points"><span><CircleCheck size={16} /> Project overview</span><span><CircleCheck size={16} /> Services provided</span><span><CircleCheck size={16} /> Project gallery</span></div></div></div></section>
    <section className="section-charcoal section-pad"><div className="container"><SectionHeading light eyebrow="04 — Categories" title="From roofing detail to the wider property picture." body="The gallery is structured to grow with the work JILMEK chooses to document." /><div className="category-band"><span>Roofing</span><span>Residential construction</span><span>Commercial construction</span><span>Finishing</span><span>Real estate</span></div></div></section>
    <section className="section-pad section-tint"><div className="container"><SectionHeading eyebrow="05 — What to include" title="Make each project easy to understand." align="center" /><div className="project-fields"><div><span>01</span><h3>Project image</h3><p>Use real photography supplied by JILMEK.</p></div><div><span>02</span><h3>Location</h3><p>Add only when the company provides it.</p></div><div><span>03</span><h3>Service</h3><p>Roofing, construction, finishing or real estate.</p></div><div><span>04</span><h3>Status</h3><p>Completion or current status label.</p></div></div></div></section>
    <section className="section-pad"><div className="container split-layout"><div><p className="section-number">06 — Similar project?</p><SectionHeading eyebrow="Start your own conversation" title="See something that feels close to what you are planning?" body="Send JILMEK the basics and the team can help you think through the next step." /><ButtonLink href="/contact#estimate" variant="gold">Request a free estimate</ButtonLink></div><div className="split-image"><img className="main-image" src={ASSETS.blueRoof} alt="Supplied residential project" loading="lazy" /></div></div></section>
    <section className="section-pad section-tint"><div className="container testimonial-placeholder"><Sparkles size={21} /><div><p className="section-number">07 — Testimonials</p><h2>Genuine client stories can live here next.</h2><p>No testimonials have been supplied yet, so this space is intentionally reserved rather than filled with invented reviews.</p></div></div></section>
    <section className="cta-section section-pad"><div className="container cta-card"><div><p className="eyebrow">Your project</p><h2>Have a similar project in mind?</h2><p>Talk to JILMEK Roofing & Construction Ltd about a free consultation and estimate.</p></div><ButtonLink href="/contact#estimate" variant="gold">Discuss your project</ButtonLink></div></section>
  </>;
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  // TODO: this form is currently front-end only — it just shows a success
  // toast and doesn't send the enquiry anywhere. Once your PHP API exists,
  // POST `new FormData(event.currentTarget)` (or its fields) to your
  // endpoint here before calling setSubmitted/toast.success.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    toast.success("Thanks — your enquiry is ready for the JILMEK team.");
  };
  return <>
    <PageHero kicker="Contact JILMEK" title="Let's discuss your project." body="Whether you need roofing, construction, finishing or real estate services, contact JILMEK Roofing & Construction Ltd." image={ASSETS.colonnade}><a className="button button-gold" href={`tel:${phones[0]}`}><Phone size={16} /> Call JILMEK</a></PageHero>
    <section className="section-pad"><div className="container contact-cards"><div><p className="section-number">01 — Main office</p><MapPin size={24} /><h3>Techiman, Bono East Region, Ghana</h3><p>Our main office location and base for projects across Ghana and beyond.</p></div><div><p className="section-number">02 — Call us</p><Phone size={24} /><h3>Speak with JILMEK</h3><div className="phone-list">{phones.map((phone) => <a href={`tel:${phone}`} key={phone}>{phone} <ArrowRight size={15} /></a>)}</div></div><div><p className="section-number">03 — Email</p><Mail size={24} /><h3>Start with the details</h3><p>Use the estimate form and share the basics of what you are planning.</p></div></div></section>
    <section id="estimate" className="section-pad section-tint"><div className="container form-layout"><div><p className="section-number">04 — Free estimate form</p><SectionHeading eyebrow="Tell us what you are planning" title="A simple enquiry form for the first conversation." body="Share enough detail for the team to understand the direction. Email is optional; phone is the fastest route." /><div className="form-note"><ShieldCheck size={18} /><span>Your details are used to help shape the enquiry conversation.</span></div></div><form className="estimate-form" onSubmit={handleSubmit}><label>Full name<input name="name" required placeholder="Your full name" /></label><label>Phone number<input name="phone" required type="tel" placeholder="e.g. 054 578 8758" /></label><label>Email address <span>(optional)</span><input name="email" type="email" placeholder="you@example.com" /></label><label>Location / region<input name="location" placeholder="Where is the project?" /></label><label>Service needed<select name="service" defaultValue=""><option value="" disabled>Select a service</option><option>Roofing</option><option>Roofing sheet supply</option><option>Roofing installation</option><option>General construction</option><option>POP ceiling</option><option>Tiling</option><option>Tinted glass</option><option>Trusses & woodworks</option><option>Finishing works</option><option>Land</option><option>Property sales</option><option>Build on my land</option><option>Other</option></select></label><label>Tell us about your project<textarea name="message" rows={4} placeholder="A short description of what you need help with" /></label><fieldset><legend>Preferred contact method</legend><label className="radio-label"><input type="radio" name="preferred" value="Phone" defaultChecked /> Phone</label><label className="radio-label"><input type="radio" name="preferred" value="Email" /> Email</label></fieldset><button className="button button-green form-submit" type="submit">{submitted ? "Enquiry noted" : "Request free estimate"} <ArrowRight size={16} /></button></form></div></section>
    <section className="section-pad"><div className="container coverage-row"><div><p className="section-number">05 — Coverage</p><SectionHeading eyebrow="We work across Ghana and beyond" title="Main office: Techiman. Service coverage: all 16 regions + outside Ghana." body="Only Techiman is presented as the main office location. Add more location detail when JILMEK supplies it." /></div><div className="ghana-visual light"><div className="ghana-map-shape">GHANA<div className="map-pin pin-one" /><div className="map-pin pin-two" /><div className="map-pin pin-three" /></div></div></div></section>
    <section className="section-pad section-tint"><div className="container contact-types"><SectionHeading eyebrow="06 — What can we help with?" title="Bring the project type. We will help with the next step." align="center" /><div className="contact-type-grid">{["Roofing sheet supply", "Roofing installation", "Building & construction", "POP / tiling / glass", "Land & property", "Build on my land"].map((item) => <span key={item}><CircleCheck size={17} /> {item}</span>)}</div></div></section>
    <section className="section-pad"><div className="container contact-path-grid"><div><p className="section-number">07 — Choose your path</p><SectionHeading eyebrow="Three useful ways to start" title="Make the first step work for you." body="Call when you want a quick conversation. Use the form when you want to share more detail. Ask for a consultation when the project needs thinking space." /></div><div className="path-cards"><div><Phone size={20} /><h3>Call JILMEK</h3><p>Speak directly with the team using any listed number.</p></div><div><Sparkles size={20} /><h3>Request an estimate</h3><p>Share the basics and ask for a free quotation.</p></div><div><Ruler size={20} /><h3>Book a consultation</h3><p>Start with a clearer project conversation.</p></div></div></div></section>
    <section className="section-pad"><div className="container faq-mini"><SectionHeading eyebrow="08 — Need a quick answer?" title="Start with the basics." body="The fastest answer for a project-specific question is to call one of the numbers above." /><div className="faq-list"><FaqItem question="Do you offer free estimates?" answer="Yes. Free estimates / quotations are offered." /><FaqItem question="Do you offer consultations?" answer="Yes. Free consultations are offered." /><FaqItem question="Which service areas do you cover?" answer="The company states that it undertakes projects across all 16 regions of Ghana and outside Ghana." /></div></div></section>
    <section className="section-pad section-charcoal"><div className="container contact-callback"><div><p className="eyebrow">We can start here</p><h2>Need a quote? Get a free estimate.</h2><p>Use the form or call JILMEK directly. No invented promises — just a clear first conversation.</p></div><div className="callback-buttons"><a className="button button-gold" href={`tel:${phones[0]}`}><Phone size={16} /> Call JILMEK</a><a className="button button-outline-white" href="#estimate">Free estimate <ArrowRight size={16} /></a></div></div></section>
    <section className="cta-section section-pad"><div className="container cta-card"><div><p className="eyebrow">Talk to JILMEK</p><h2>Need to build, roof or develop a property?</h2><p>Free consultation · Free estimate / quotation · Ghana & beyond</p></div><a className="button button-gold" href={`tel:${phones[0]}`}><Phone size={16} /> Call now</a></div></section>
  </>;
}

type ProductForm = {
  name: string;
  profile: string;
  description: string;
  imageUrl: string;
  imageKey: string;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

type ListingForm = {
  title: string;
  listingType: "land" | "property" | "development";
  location: string;
  priceLabel: string;
  status: "available" | "reserved" | "sold" | "draft";
  description: string;
  imageUrl: string;
  imageKey: string;
  isPublished: boolean;
  isFeatured: boolean;
};

const emptyProduct: ProductForm = { name: "", profile: "", description: "", imageUrl: "", imageKey: "", isPublished: true, isFeatured: false, sortOrder: 0 };
const emptyListing: ListingForm = { title: "", listingType: "property", location: "", priceLabel: "", status: "available", description: "", imageUrl: "", imageKey: "", isPublished: true, isFeatured: false };

// NOTE: This dashboard has no backend yet. All product/listing data lives
// only in local component state (seeded from the mock catalog below), so
// changes are NOT persisted anywhere and reset on page reload. Once the
// PHP/cPanel API exists, swap the setLocalProducts/setLocalListings calls
// below for real fetch() calls to your PHP endpoints.
function AdminDashboard() {
  const [adminLocation] = useLocation();
  const { user } = useAuth();
  const [tab, setTab] = useState<"overview" | "products" | "listings">(() => adminLocation.endsWith("/products") ? "products" : adminLocation.endsWith("/listings") ? "listings" : "overview");
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [productId, setProductId] = useState<number | null>(null);
  const [listingForm, setListingForm] = useState<ListingForm>(emptyListing);
  const [listingId, setListingId] = useState<number | null>(null);
  const [products, setProducts] = useState<MockRoofingProduct[]>(mockRoofingProducts);
  const [listings, setListings] = useState<MockPropertyListing[]>(mockPropertyListings);

  if (!user) {
    return <DashboardLayout>{null}</DashboardLayout>;
  }

  const isSaving = false;
  const submitProduct = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const input = { ...productForm, imageUrl: productForm.imageUrl || "", imageKey: productForm.imageKey || null }; const next = { ...input, id: productId ?? Date.now() }; setProducts((items) => productId ? items.map((item) => item.id === productId ? next : item) : [next, ...items]); setProductForm(emptyProduct); setProductId(null); toast.success(productId ? "Roofing product updated." : "Roofing product saved."); };
  const submitListing = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const input = { ...listingForm, priceLabel: listingForm.priceLabel || null, imageUrl: listingForm.imageUrl || "", imageKey: listingForm.imageKey || null }; const next = { ...input, id: listingId ?? Date.now() }; setListings((items) => listingId ? items.map((item) => item.id === listingId ? next : item) : [next, ...items]); setListingForm(emptyListing); setListingId(null); toast.success(listingId ? "Property listing updated." : "Property listing saved."); };
  const editProduct = (product: typeof products[number]) => { setProductId(product.id); setProductForm({ name: product.name, profile: product.profile, description: product.description, imageUrl: product.imageUrl ?? "", imageKey: product.imageKey ?? "", isPublished: product.isPublished, isFeatured: product.isFeatured, sortOrder: product.sortOrder }); setTab("products"); };
  const editListing = (listing: typeof listings[number]) => { setListingId(listing.id); setListingForm({ title: listing.title, listingType: listing.listingType, location: listing.location, priceLabel: listing.priceLabel ?? "", status: listing.status, description: listing.description, imageUrl: listing.imageUrl ?? "", imageKey: listing.imageKey ?? "", isPublished: listing.isPublished, isFeatured: listing.isFeatured }); setTab("listings"); };
  const deleteProduct = (product: typeof products[number]) => { if (window.confirm(`Delete ${product.name}?`)) { setProducts((items) => items.filter((item) => item.id !== product.id)); toast.success("Roofing product removed."); } };
  const deleteListing = (listing: typeof listings[number]) => { if (window.confirm(`Delete ${listing.title}?`)) { setListings((items) => items.filter((item) => item.id !== listing.id)); toast.success("Property listing removed."); } };

  return <DashboardLayout>
    <div className="cms-shell">
      <div className="cms-topbar"><div><p className="cms-kicker">JILMEK content studio</p><h1>Admin dashboard</h1><p>Keep roofing products and property listings current without editing the website code.</p><span className="cms-demo-badge">Local demo · not connected to a backend yet</span></div><Link href="/" className="cms-view-site">View public site <ArrowRight size={15} /></Link></div>
      <div className="cms-tabs"><button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}><LayoutDashboard size={16} /> Overview</button><button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}><PackageOpen size={16} /> Roofing products</button><button className={tab === "listings" ? "active" : ""} onClick={() => setTab("listings")}><Landmark size={16} /> Property listings</button></div>
      {tab === "overview" && <div className="cms-overview"><div className="cms-stat-grid"><div><span>Roofing products</span><strong>{products.length}</strong><small>All catalog records</small></div><div><span>Published products</span><strong>{products.filter((item) => item.isPublished).length}</strong><small>Visible on the website</small></div><div><span>Property listings</span><strong>{listings.length}</strong><small>All listing records</small></div><div><span>Published listings</span><strong>{listings.filter((item) => item.isPublished).length}</strong><small>Visible on the website</small></div></div><div className="cms-overview-grid"><div className="cms-guide"><p className="cms-kicker">How to use this CMS</p><h2>Keep your public pages fresh.</h2><div><span>01</span><p><strong>Add products.</strong> Create a roofing profile with a description, image reference and publish controls.</p></div><div><span>02</span><p><strong>Manage properties.</strong> Add land, property or development listings with location, status and optional price label.</p></div><div><span>03</span><p><strong>Publish when ready.</strong> Uncheck “published” to keep an item in the dashboard while hiding it from public pages.</p></div></div><div className="cms-recent"><p className="cms-kicker">Content health</p><h2>Ready for your next update.</h2><div className="cms-health-row"><span>Roofing catalog</span><b>Local demo</b></div><div className="cms-health-row"><span>Property catalog</span><b>Local demo</b></div><div className="cms-health-row"><span>Public website</span><b className="is-live">Live</b></div><button className="cms-primary" onClick={() => setTab("products")}>{products.length ? "Manage roofing catalog" : "Add your first product"} <ArrowRight size={15} /></button></div></div></div>}
      {tab === "products" && <div className="cms-content"><div className="cms-section-head"><div><p className="cms-kicker">Catalog management</p><h2>Roofing products</h2><p>Add and maintain the sheet profiles shown on the public Services page.</p></div><button className="cms-primary" onClick={() => { setProductForm(emptyProduct); setProductId(null); }}>+ New product</button></div><div className="cms-editor-grid"><div className="cms-list">{products.length === 0 ? <div className="cms-empty"><PackageOpen size={28} /><h3>No roofing products yet</h3><p>Add the first product to start building the live roofing catalog.</p></div> : products.map((product) => <div className="cms-record" key={product.id}><div className="cms-record-image">{product.imageUrl ? <img src={product.imageUrl} alt="" /> : <PackageOpen size={23} />}</div><div className="cms-record-main"><div><span className="cms-pill">{product.isPublished ? "Published" : "Draft"}</span>{product.isFeatured && <span className="cms-pill gold">Featured</span>}</div><h3>{product.name}</h3><p>{product.profile} · {product.description}</p></div><div className="cms-record-actions"><button onClick={() => editProduct(product)}>Edit</button><button className="danger" onClick={() => deleteProduct(product)}>Delete</button></div></div>)}</div><form className="cms-form" onSubmit={submitProduct}><div className="cms-form-head"><p className="cms-kicker">{productId ? "Edit product" : "New product"}</p><h3>{productId ? "Update the catalog record" : "Add a roofing product"}</h3></div><CmsField label="Product name" value={productForm.name} onChange={(value) => setProductForm({ ...productForm, name: value })} placeholder="e.g. Long Span" required /><CmsField label="Profile / short label" value={productForm.profile} onChange={(value) => setProductForm({ ...productForm, profile: value })} placeholder="e.g. Modern roofing sheet" required /><CmsTextArea label="Description" value={productForm.description} onChange={(value) => setProductForm({ ...productForm, description: value })} placeholder="A clear, factual description for customers." required /><CmsField label="Image URL or storage path" value={productForm.imageUrl} onChange={(value) => setProductForm({ ...productForm, imageUrl: value })} placeholder="/images/your-image.jpeg" /><CmsField label="Image key (optional)" value={productForm.imageKey} onChange={(value) => setProductForm({ ...productForm, imageKey: value })} placeholder="For future file management" /><div className="cms-inline-fields"><CmsField label="Sort order" type="number" value={String(productForm.sortOrder)} onChange={(value) => setProductForm({ ...productForm, sortOrder: Number(value) })} placeholder="0" /><label className="cms-check"><input type="checkbox" checked={productForm.isPublished} onChange={(event) => setProductForm({ ...productForm, isPublished: event.target.checked })} /> Published on website</label></div><label className="cms-check"><input type="checkbox" checked={productForm.isFeatured} onChange={(event) => setProductForm({ ...productForm, isFeatured: event.target.checked })} /> Mark as featured</label><div className="cms-form-actions"><button className="cms-primary" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : productId ? "Save changes" : "Create product"}</button>{productId && <button type="button" className="cms-secondary" onClick={() => { setProductForm(emptyProduct); setProductId(null); }}>Cancel</button>}</div></form></div></div>}
      {tab === "listings" && <div className="cms-content"><div className="cms-section-head"><div><p className="cms-kicker">Property management</p><h2>Property listings</h2><p>Manage land, property and development records that can be published when details are ready.</p></div><button className="cms-primary" onClick={() => { setListingForm(emptyListing); setListingId(null); }}>+ New listing</button></div><div className="cms-editor-grid"><div className="cms-list">{listings.length === 0 ? <div className="cms-empty"><Landmark size={28} /><h3>No property listings yet</h3><p>Add a land, property or development record to begin.</p></div> : listings.map((listing) => <div className="cms-record" key={listing.id}><div className="cms-record-image">{listing.imageUrl ? <img src={listing.imageUrl} alt="" /> : <Landmark size={23} />}</div><div className="cms-record-main"><div><span className="cms-pill">{listing.isPublished ? "Published" : "Draft"}</span><span className={`cms-pill ${listing.status === "available" ? "green" : listing.status === "sold" ? "muted" : "gold"}`}>{listing.status}</span></div><h3>{listing.title}</h3><p>{listing.listingType} · {listing.location} · {listing.description}</p></div><div className="cms-record-actions"><button onClick={() => editListing(listing)}>Edit</button><button className="danger" onClick={() => deleteListing(listing)}>Delete</button></div></div>)}</div><form className="cms-form" onSubmit={submitListing}><div className="cms-form-head"><p className="cms-kicker">{listingId ? "Edit listing" : "New listing"}</p><h3>{listingId ? "Update the property record" : "Add a property listing"}</h3></div><CmsField label="Listing title" value={listingForm.title} onChange={(value) => setListingForm({ ...listingForm, title: value })} placeholder="e.g. Residential property opportunity" required /><div className="cms-inline-fields"><CmsSelect label="Listing type" value={listingForm.listingType} onChange={(value) => setListingForm({ ...listingForm, listingType: value as ListingForm["listingType"] })} options={[["land", "Land"], ["property", "Property"], ["development", "Development"]]} /><CmsSelect label="Status" value={listingForm.status} onChange={(value) => setListingForm({ ...listingForm, status: value as ListingForm["status"] })} options={[["available", "Available"], ["reserved", "Reserved"], ["sold", "Sold"], ["draft", "Draft"]]} /></div><CmsField label="Location" value={listingForm.location} onChange={(value) => setListingForm({ ...listingForm, location: value })} placeholder="Add only confirmed location details" required /><CmsField label="Price label (optional)" value={listingForm.priceLabel} onChange={(value) => setListingForm({ ...listingForm, priceLabel: value })} placeholder="e.g. Price on enquiry" /><CmsTextArea label="Description" value={listingForm.description} onChange={(value) => setListingForm({ ...listingForm, description: value })} placeholder="A clear, factual description for the listing." required /><CmsField label="Image URL or storage path" value={listingForm.imageUrl} onChange={(value) => setListingForm({ ...listingForm, imageUrl: value })} placeholder="/images/your-image.jpeg" /><CmsField label="Image key (optional)" value={listingForm.imageKey} onChange={(value) => setListingForm({ ...listingForm, imageKey: value })} placeholder="For future file management" /><label className="cms-check"><input type="checkbox" checked={listingForm.isPublished} onChange={(event) => setListingForm({ ...listingForm, isPublished: event.target.checked })} /> Published on website</label><label className="cms-check"><input type="checkbox" checked={listingForm.isFeatured} onChange={(event) => setListingForm({ ...listingForm, isFeatured: event.target.checked })} /> Mark as featured</label><div className="cms-form-actions"><button className="cms-primary" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : listingId ? "Save changes" : "Create listing"}</button>{listingId && <button type="button" className="cms-secondary" onClick={() => { setListingForm(emptyListing); setListingId(null); }}>Cancel</button>}</div></form></div></div>}
    </div>
  </DashboardLayout>;
}

function CmsField({ label, value, onChange, placeholder, required = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; type?: string }) {
  return <label className="cms-field"><span>{label}{required && " *"}</span><input type={type} required={required} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function CmsTextArea({ label, value, onChange, placeholder, required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean }) {
  return <label className="cms-field"><span>{label}{required && " *"}</span><textarea required={required} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} rows={4} /></label>;
}

function CmsSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) {
  return <label className="cms-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select></label>;
}

function NotFound() {
  return <section className="section-pad"><div className="container empty-page"><p className="eyebrow">404</p><h1>This page is not on the plan yet.</h1><p>Return to the JILMEK home page and find the next project path.</p><ButtonLink href="/">Back home</ButtonLink></div></section>;
}

function App() {
  return <Switch><Route path="/admin/:rest*" component={AdminDashboard} /><Route path="/admin" component={AdminDashboard} /><Route><Shell><Switch><Route path="/" component={Home} /><Route path="/about" component={About} /><Route path="/services" component={Services} /><Route path="/projects" component={Projects} /><Route path="/contact" component={Contact} /><Route component={NotFound} /></Switch></Shell></Route></Switch>;
}

export default App;
