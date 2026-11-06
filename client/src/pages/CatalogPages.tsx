import { ArrowLeft, ArrowRight, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { listListings, listProducts, type CmsListing, type CmsProduct } from "@/lib/api";
import { mockPropertyListings, mockRoofingProducts } from "@/lib/mockCms";
import { mediaUrl } from "@/lib/media";
import { SITE, PHONES } from "@/lib/site";
import { useSeo } from "@/lib/seo";

const fallbackProductImage = mediaUrl("home-blue-roof_36d157bc.jpeg");
const fallbackListingImage = mediaUrl("house-grey_2ed75e58.jpeg");

function CatalogHero({ kicker, title, body, image }: { kicker: string; title: string; body: string; image: string }) {
  return <section className="page-hero">
    <img className="page-hero-image" src={image} alt="JILMEK project photography" />
    <div className="page-hero-overlay" />
    <div className="container page-hero-content">
      <p className="eyebrow eyebrow-light">{kicker}</p>
      <h1>{title}</h1>
      <p className="hero-copy">{body}</p>
    </div>
  </section>;
}

export function ProductCatalog() {
  const [products, setProducts] = useState<CmsProduct[]>(mockRoofingProducts.filter((item) => item.isPublished));
  useEffect(() => { listProducts().then(setProducts).catch(() => undefined); }, []);
  useSeo({ title: "Roofing products | JILMEK Roofing & Construction", description: "Explore published roofing profiles and product details from JILMEK Roofing & Construction Ltd.", path: "/roofing-products" });
  return <>
    <CatalogHero kicker="Roofing product catalogue" title="Roofing profiles for the project in front of you." body="Review the available roofing products, compare the details and ask JILMEK about supply, accessories and installation." image={fallbackProductImage} />
    <section className="section-pad">
      <div className="container">
        <div className="catalog-intro"><div><p className="section-number">01 — Roofing products</p><h2>Choose a profile, then start a useful conversation.</h2></div><Link href="/contact#estimate" className="button button-gold">Request a roofing estimate <ArrowRight size={16} /></Link></div>
        <div className="catalog-grid">
          {products.map((product) => <Link key={product.id} href={`/roofing-products/${product.id}`} className="catalog-card">
            <img src={product.imageUrl || fallbackProductImage} alt={`${product.name} roofing profile`} loading="lazy" />
            <div className="catalog-card-copy"><p className="eyebrow">{product.profile || "Roofing option"}</p><h3>{product.name}</h3><p>{product.description}</p><span className="text-link">View product details <ArrowRight size={15} /></span></div>
          </Link>)}
        </div>
        {!products.length && <p className="empty-page-copy">No roofing products are published yet. Please contact JILMEK for current options.</p>}
      </div>
    </section>
    <section className="section-pad section-tint"><div className="container cta-card"><div><p className="eyebrow">Need help choosing?</p><h2>Talk through the roof before you order.</h2><p>JILMEK can help you consider profile, material, colour, accessories and installation.</p></div><Link href="/contact#estimate" className="button button-gold">Talk to JILMEK <ArrowRight size={16} /></Link></div></section>
  </>;
}

export function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<CmsProduct | null>(null);
  useEffect(() => { listProducts().then((items) => setProduct(items.find((item) => String(item.id) === params.id) ?? null)).catch(() => undefined); }, [params.id]);
  useSeo({ title: product ? `${product.name} | JILMEK Roofing & Construction` : "Roofing product | JILMEK Roofing & Construction", description: product?.description ?? "Roofing product details from JILMEK Roofing & Construction Ltd.", path: `/roofing-products/${params.id}` });
  if (!product) return <section className="section-pad"><div className="container empty-page"><p className="eyebrow">Roofing product</p><h1>That product is not available.</h1><p>It may have been unpublished or moved. Return to the product catalogue to see the current options.</p><Link href="/roofing-products" className="button button-green"><ArrowLeft size={16} /> Back to products</Link></div></section>;
  return <>
    <CatalogHero kicker="Roofing product details" title={product.name} body={product.profile || "A roofing option from the JILMEK catalogue."} image={product.imageUrl || fallbackProductImage} />
    <section className="section-pad"><div className="container detail-layout"><img className="detail-image" src={product.imageUrl || fallbackProductImage} alt={`${product.name} roofing profile`} /><div className="detail-copy"><p className="section-number">01 — Product details</p><h2>{product.name}</h2><p className="detail-lead">{product.profile}</p><p>{product.description}</p><div className="detail-actions"><Link href="/contact#estimate" className="button button-gold">Ask about this product <ArrowRight size={16} /></Link><Link href="/roofing-products" className="button button-outline"><ArrowLeft size={16} /> All roofing products</Link></div></div></div></section>
  </>;
}

export function ListingCatalog() {
  const [listings, setListings] = useState<CmsListing[]>(mockPropertyListings.filter((item) => item.isPublished));
  useEffect(() => { listListings().then(setListings).catch(() => undefined); }, []);
  useSeo({ title: "Land and property listings | JILMEK", description: "Browse published land, property and development opportunities from JILMEK Roofing & Construction Ltd.", path: "/listings" });
  return <>
    <CatalogHero kicker="Land & property listings" title="A clearer place to review property opportunities." body="Browse current published listings, then contact JILMEK for confirmed details, availability and next steps." image={fallbackListingImage} />
    <section className="section-pad"><div className="container"><div className="catalog-intro"><div><p className="section-number">01 — Current listings</p><h2>Land, property and development opportunities.</h2></div><Link href="/contact#estimate" className="button button-gold">Ask about a listing <ArrowRight size={16} /></Link></div><div className="catalog-grid listing-catalog-grid">{listings.map((listing) => <Link key={listing.id} href={`/listings/${listing.id}`} className="catalog-card"><img src={listing.imageUrl || fallbackListingImage} alt={listing.title} loading="lazy" /><div className="catalog-card-copy"><div className="public-listing-meta"><span>{listing.listingType}</span><span>{listing.status}</span></div><h3>{listing.title}</h3><p className="public-listing-location"><MapPin size={15} /> {listing.location}{listing.priceLabel ? ` · ${listing.priceLabel}` : ""}</p><p>{listing.description}</p><span className="text-link">View listing details <ArrowRight size={15} /></span></div></Link>)}</div>{!listings.length && <p className="empty-page-copy">No listings are published currently. Contact JILMEK to discuss land or property requirements.</p>}</div></section>
    <section className="section-pad section-tint"><div className="container cta-card"><div><p className="eyebrow">Have a property to discuss?</p><h2>Start with the details you can confirm.</h2><p>JILMEK can help with land, property sales and building on your own land.</p></div><Link href="/contact#estimate" className="button button-gold">Make an enquiry <ArrowRight size={16} /></Link></div></section>
  </>;
}

export function ListingDetail({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<CmsListing | null>(null);
  useEffect(() => { listListings().then((items) => setListing(items.find((item) => String(item.id) === params.id) ?? null)).catch(() => undefined); }, [params.id]);
  useSeo({ title: listing ? `${listing.title} | JILMEK` : "Property listing | JILMEK", description: listing?.description ?? "Property listing details from JILMEK Roofing & Construction Ltd.", path: `/listings/${params.id}` });
  if (!listing) return <section className="section-pad"><div className="container empty-page"><p className="eyebrow">Property listing</p><h1>That listing is not available.</h1><p>It may have been unpublished or is no longer current. Return to the listings page for the latest opportunities.</p><Link href="/listings" className="button button-green"><ArrowLeft size={16} /> Back to listings</Link></div></section>;
  return <>
    <CatalogHero kicker={`${listing.listingType} listing`} title={listing.title} body={listing.location} image={listing.imageUrl || fallbackListingImage} />
    <section className="section-pad"><div className="container detail-layout"><img className="detail-image" src={listing.imageUrl || fallbackListingImage} alt={listing.title} /><div className="detail-copy"><p className="section-number">01 — Listing details</p><div className="public-listing-meta"><span>{listing.listingType}</span><span>{listing.status}</span></div><h2>{listing.title}</h2><p className="detail-lead"><MapPin size={17} /> {listing.location}{listing.priceLabel ? ` · ${listing.priceLabel}` : ""}</p><p>{listing.description}</p><div className="detail-actions"><Link href="/contact#estimate" className="button button-gold">Enquire about this listing <ArrowRight size={16} /></Link><a href={`tel:${PHONES[0]}`} className="button button-outline"><Phone size={16} /> Call JILMEK</a><Link href="/listings" className="button button-outline"><ArrowLeft size={16} /> All listings</Link></div></div></div></section>
  </>;
}
