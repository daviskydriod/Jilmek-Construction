export type MockRoofingProduct = {
  id: number;
  name: string;
  profile: string;
  description: string;
  imageUrl: string;
  imageKey: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

export type MockPropertyListing = {
  id: number;
  title: string;
  listingType: "land" | "property" | "development";
  location: string;
  priceLabel: string | null;
  status: "available" | "reserved" | "sold" | "draft";
  description: string;
  imageUrl: string;
  imageKey: string | null;
  isPublished: boolean;
  isFeatured: boolean;
};

const image = (name: string) => `/images/${name}`;

export const mockRoofingProducts: MockRoofingProduct[] = [
  { id: -101, name: "Long Span", profile: "Clean modern profile", description: "A practical, versatile sheet profile for residential and commercial rooflines.", imageUrl: image("hero-red-roof_78e57ca6.jpeg"), imageKey: null, isPublished: true, isFeatured: true, sortOrder: 1 },
  { id: -102, name: "Self-Lock", profile: "Contemporary interlocking finish", description: "A crisp interlocking option for projects that need a more refined roof finish.", imageUrl: image("home-pink-roof_178510ed.jpeg"), imageKey: null, isPublished: true, isFeatured: true, sortOrder: 2 },
  { id: -103, name: "IBR", profile: "Architectural ribbed profile", description: "A familiar ribbed profile for residential, retail and light commercial applications.", imageUrl: image("home-blue-roof_36d157bc.jpeg"), imageKey: null, isPublished: true, isFeatured: false, sortOrder: 3 },
  { id: -104, name: "IDT", profile: "Distinctive roof profile", description: "A considered roofing option to review with the JILMEK project team.", imageUrl: image("house-red_3d6d39f5.jpeg"), imageKey: null, isPublished: true, isFeatured: false, sortOrder: 4 },
  { id: -105, name: "Euro Tiles / Aero Tiles", profile: "Tile-inspired character", description: "Tile-inspired visual character for clients who want a more decorative roofline.", imageUrl: image("tall-house_60c0ab4a.jpeg"), imageKey: null, isPublished: true, isFeatured: false, sortOrder: 5 },
  { id: -106, name: "Stone Coated Shingles", profile: "Textured premium finish", description: "A textured finish for projects looking for extra roof character and presence.", imageUrl: image("roof-frame_e50d38a3.jpeg"), imageKey: null, isPublished: false, isFeatured: false, sortOrder: 6 },
];

export const mockPropertyListings: MockPropertyListing[] = [
  { id: -201, title: "Residential build opportunity", listingType: "development", location: "Techiman, Bono East Region", priceLabel: "Price on enquiry", status: "available", description: "A sample development record for a residential project conversation with the JILMEK team.", imageUrl: image("house-grey_2ed75e58.jpeg"), imageKey: null, isPublished: true, isFeatured: true },
  { id: -202, title: "Completed family home", listingType: "property", location: "Bono East Region", priceLabel: "Enquire for details", status: "available", description: "A sample property listing showing how completed residential assets can be presented.", imageUrl: image("house-red_3d6d39f5.jpeg"), imageKey: null, isPublished: true, isFeatured: true },
  { id: -203, title: "Land enquiry pathway", listingType: "land", location: "Techiman and surrounding areas", priceLabel: "Price on enquiry", status: "available", description: "A sample land record for clients looking to buy, sell or build on their own land.", imageUrl: image("brick-home_3a6fc288.jpeg"), imageKey: null, isPublished: true, isFeatured: false },
  { id: -204, title: "Roofing-ready property", listingType: "property", location: "Ghana-wide enquiry", priceLabel: "Contact JILMEK", status: "reserved", description: "A sample reserved listing demonstrating the status controls available to admins.", imageUrl: image("colonnade_cc91d531.jpeg"), imageKey: null, isPublished: false, isFeatured: false },
];
