/**
 * JILMEK API client.
 *
 * The PHP/cPanel backend is deployed separately. Until the live API base is configured, every call in here
 * falls back to a localStorage-backed "demo store" so the admin dashboard and
 * the contact form are fully usable (and demo-able to the client) without a
 * server.
 *
 * To go live: set VITE_API_BASE_URL in your .env (e.g. https://api.jilmekroofingandconstruction.com/api)
 * and implement the endpoints listed in API_CONTRACT below. Nothing else in the
 * app needs to change — `isLiveApi` flips automatically and the demo store is
 * bypassed.
 */

import { mockPropertyListings, mockRoofingProducts } from "./mockCms";

export const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
export const isLiveApi = API_BASE.length > 0;

export const API_CONTRACT = [
  "POST   /api/enquiries         create (public)",
  "GET    /api/enquiries         list (admin)",
  "PATCH  /api/enquiries/:id     update status (admin)",
  "DELETE /api/enquiries/:id     remove (admin)",
  "GET    /api/products             list published records",
  "GET    /api/admin/products       list all records (admin)",
  "POST   /api/products             create (admin)",
  "PUT    /api/products/:id         update (admin)",
  "DELETE /api/products/:id         delete (admin)",
  "GET    /api/listings             list published records",
  "GET    /api/admin/listings       list all records (admin)",
  "POST   /api/listings             create (admin)",
  "PUT    /api/listings/:id         update (admin)",
  "DELETE /api/listings/:id         delete (admin)",
  "GET    /api/media                list project images (admin)",
  "POST   /api/media                upload project image only (admin)",
  "DELETE /api/media/:key           delete (admin)",
  "POST   /api/auth/login        { email, password } -> JWT",
  "GET    /api/auth/me           current admin or 401",
  "POST   /api/projects/:slug/images  attach project image (admin)",
];

/* ------------------------------------------------------------------ types */

export type Enquiry = {
  id: number;
  name: string;
  phone: string;
  email: string;
  location: string;
  service: string;
  message: string;
  preferred: string;
  status: "New" | "Contacted" | "Closed";
  isRead: boolean;
  createdAt: string;
};

export type MediaItem = {
  id?: number;
  key: string;
  url: string;
  filename: string;
  sizeKb: number;
  uploadedAt: string;
  projectSlugs?: string[];
};

export type Testimonial = {
  id: number;
  author: string;
  role: string;
  quote: string;
  isPublished: boolean;
};

export type CmsProduct = {
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

export type CmsListing = {
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

export type EnquiryInput = Omit<Enquiry, "id" | "status" | "isRead" | "createdAt">;

/* ------------------------------------------------------- demo store (local) */

export const AUTH_TOKEN_KEY = "jilmek.admin.jwt";

const KEY = {
  enquiries: "jilmek.demo.enquiries",
  media: "jilmek.demo.media",
  testimonials: "jilmek.demo.testimonials",
  products: "jilmek.demo.products",
  listings: "jilmek.demo.listings",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode / quota) — demo data just won't persist */
  }
}

/* --------------------------------------------------------------- transport */

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  try {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (token) headers.set("Authorization", `Bearer ${token}`);
  } catch {
    // sessionStorage may be unavailable in private browsing.
  }
  const response = await fetch(`${API_BASE}${path}`, { credentials: "include", ...init, headers });
  const payload = (await response.json()) as { success?: boolean; data?: T; error?: { message?: string } };
  if (!response.ok || payload.success === false) throw new Error(payload.error?.message ?? `${response.status} ${response.statusText}`);
  return (payload.success === true && "data" in payload ? payload.data : payload) as T;
}

export type AdminUser = { id: number; email: string; role: string };
export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const payload = (await response.json()) as { success?: boolean; data?: { access_token: string; user: AdminUser }; error?: { message?: string } };
  if (!response.ok || !payload.success || !payload.data?.access_token) throw new Error(payload.error?.message ?? "Sign in failed.");
  sessionStorage.setItem(AUTH_TOKEN_KEY, payload.data.access_token);
  return payload.data.user;
}
export async function getAdminMe(): Promise<AdminUser> {
  return request<AdminUser>("/auth/me");
}
export function clearAdminToken(): void {
  try { sessionStorage.removeItem(AUTH_TOKEN_KEY); } catch { /* ignore */ }
}

/* -------------------------------------------------------------- enquiries */
function normalizeEnquiry(raw: any): Enquiry {
  const statusMap: Record<string, Enquiry["status"]> = {
    new: "New", contacted: "Contacted", in_progress: "Contacted", quoted: "Contacted", won: "Closed", closed: "Closed", spam: "Closed",
  };
  return {
    id: Number(raw.id),
    name: raw.name ?? raw.full_name ?? "",
    phone: raw.phone ?? "",
    email: raw.email ?? "",
    location: raw.location ?? "",
    service: raw.service ?? raw.service_needed ?? "",
    message: raw.message ?? "",
    preferred: raw.preferred ?? raw.preferred_contact_method ?? "Phone",
    status: statusMap[String(raw.status ?? "new").toLowerCase()] ?? "New",
    isRead: Boolean(raw.isRead ?? raw.is_read ?? false),
    createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
  };
}

export async function createEnquiry(input: EnquiryInput): Promise<Enquiry> {
  if (isLiveApi) {
    const result = await request<{ reference_code?: string }>("/enquiries", {
      method: "POST",
      body: JSON.stringify({
        full_name: input.name,
        phone: input.phone,
        email: input.email || null,
        location: input.location,
        service_needed: input.service,
        message: input.message,
        preferred_contact_method: input.preferred,
        source_page: window.location.pathname,
      }),
    });
    return normalizeEnquiry({ ...input, id: Date.now(), status: "new", created_at: new Date().toISOString(), reference_code: result.reference_code });
  }
  const list = read<Enquiry[]>(KEY.enquiries, []);
  const next: Enquiry = {
    ...input,
    id: Date.now(),
    status: "New",
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  write(KEY.enquiries, [next, ...list]);
  return next;
}

export async function listEnquiries(): Promise<Enquiry[]> {
  if (isLiveApi) return (await request<any[]>("/enquiries")).map(normalizeEnquiry);
  return read<Enquiry[]>(KEY.enquiries, []);
}

export async function updateEnquiry(id: number, patch: Partial<Enquiry>): Promise<Enquiry> {
  if (isLiveApi) {
    const body: { status?: string; is_read?: boolean } = {};
    if (patch.status) {
      const statusMap: Record<Enquiry["status"], string> = { New: "new", Contacted: "contacted", Closed: "closed" };
      body.status = statusMap[patch.status];
    }
    if (patch.isRead !== undefined) body.is_read = patch.isRead;
    const result = await request<any>(`/enquiries/${id}`, { method: "PATCH", body: JSON.stringify(body) });
    const cached = read<Enquiry[]>(KEY.enquiries, []).find((item) => item.id === id);
    return normalizeEnquiry({ ...cached, ...result, id, status: patch.status ?? result.status ?? cached?.status, is_read: patch.isRead ?? result.is_read ?? cached?.isRead });
  }
  const list = read<Enquiry[]>(KEY.enquiries, []);
  const next = list.map((item) => (item.id === id ? { ...item, ...patch } : item));
  write(KEY.enquiries, next);
  return next.find((item) => item.id === id)!;
}

export async function deleteEnquiry(id: number): Promise<void> {
  if (isLiveApi) {
    await request(`/enquiries/${id}`, { method: "DELETE" });
    return;
  }
  write<Enquiry[]>(KEY.enquiries, read<Enquiry[]>(KEY.enquiries, []).filter((item) => item.id !== id));
}

function normalizeProduct(raw: any): CmsProduct {
  return {
    id: Number(raw.id), name: raw.name ?? "", profile: raw.profile ?? "", description: raw.description ?? "",
    imageUrl: raw.imageUrl ?? raw.image_url ?? "", imageKey: raw.imageKey ?? raw.image_key ?? null,
    isPublished: Boolean(raw.isPublished ?? raw.is_published), isFeatured: Boolean(raw.isFeatured ?? raw.is_featured),
    sortOrder: Number(raw.sortOrder ?? raw.sort_order ?? 0),
  };
}

function normalizeListing(raw: any): CmsListing {
  return {
    id: Number(raw.id), title: raw.title ?? "", listingType: raw.listingType ?? raw.listing_type ?? "property",
    location: raw.location ?? "", priceLabel: raw.priceLabel ?? raw.price_label ?? null,
    status: raw.status ?? "available", description: raw.description ?? "", imageUrl: raw.imageUrl ?? raw.image_url ?? "",
    imageKey: raw.imageKey ?? raw.image_key ?? null, isPublished: Boolean(raw.isPublished ?? raw.is_published),
    isFeatured: Boolean(raw.isFeatured ?? raw.is_featured),
  };
}

function productPayload(product: Omit<CmsProduct, "id">) {
  return { name: product.name, profile: product.profile, description: product.description, image_url: product.imageUrl || null,
    image_key: product.imageKey || null, is_published: product.isPublished, is_featured: product.isFeatured, sort_order: product.sortOrder };
}

function listingPayload(listing: Omit<CmsListing, "id">) {
  return { title: listing.title, listing_type: listing.listingType, location: listing.location, price_label: listing.priceLabel || null,
    status: listing.status, description: listing.description, image_url: listing.imageUrl || null, image_key: listing.imageKey || null,
    is_published: listing.isPublished, is_featured: listing.isFeatured };
}

export async function listProducts(admin = false): Promise<CmsProduct[]> {
  if (isLiveApi) return (await request<any[]>(admin ? "/admin/products" : "/products")).map(normalizeProduct);
  const items = read<CmsProduct[]>(KEY.products, mockRoofingProducts.map(normalizeProduct));
  return admin ? items : items.filter((item) => item.isPublished);
}

export async function saveProduct(input: Omit<CmsProduct, "id"> & { id?: number }): Promise<CmsProduct> {
  const body = JSON.stringify(productPayload(input));
  if (isLiveApi) return normalizeProduct(await request<any>(input.id ? `/products/${input.id}` : "/products", { method: input.id ? "PUT" : "POST", body }));
  const current = read<CmsProduct[]>(KEY.products, mockRoofingProducts.map(normalizeProduct));
  const next = normalizeProduct({ ...input, id: input.id ?? Date.now() });
  write(KEY.products, input.id ? current.map((item) => item.id === input.id ? next : item) : [next, ...current]);
  return next;
}

export async function deleteProduct(id: number): Promise<void> {
  if (isLiveApi) { await request(`/products/${id}`, { method: "DELETE" }); return; }
  write(KEY.products, read<CmsProduct[]>(KEY.products, mockRoofingProducts.map(normalizeProduct)).filter((item) => item.id !== id));
}

export async function listListings(admin = false): Promise<CmsListing[]> {
  if (isLiveApi) return (await request<any[]>(admin ? "/admin/listings" : "/listings")).map(normalizeListing);
  const items = read<CmsListing[]>(KEY.listings, mockPropertyListings.map(normalizeListing));
  return admin ? items : items.filter((item) => item.isPublished && item.status !== "draft");
}

export async function saveListing(input: Omit<CmsListing, "id"> & { id?: number }): Promise<CmsListing> {
  const body = JSON.stringify(listingPayload(input));
  if (isLiveApi) return normalizeListing(await request<any>(input.id ? `/listings/${input.id}` : "/listings", { method: input.id ? "PUT" : "POST", body }));
  const current = read<CmsListing[]>(KEY.listings, mockPropertyListings.map(normalizeListing));
  const next = normalizeListing({ ...input, id: input.id ?? Date.now() });
  write(KEY.listings, input.id ? current.map((item) => item.id === input.id ? next : item) : [next, ...current]);
  return next;
}

export async function deleteListing(id: number): Promise<void> {
  if (isLiveApi) { await request(`/listings/${id}`, { method: "DELETE" }); return; }
  write(KEY.listings, read<CmsListing[]>(KEY.listings, mockPropertyListings.map(normalizeListing)).filter((item) => item.id !== id));
}

export type ProjectOption = { id: number; slug: string; title: string };
export async function listProjectOptions(): Promise<ProjectOption[]> {
  if (!isLiveApi) return [];
  return (await request<any[]>("/projects")).map((item) => ({ id: Number(item.id), slug: String(item.slug), title: String(item.title) }));
}
export type CmsProject = {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string | null;
  description: string | null;
  location: string | null;
  images: { id: number; url: string; alt_text: string | null; caption: string | null; width: number | null; height: number | null }[];
};
export async function listCmsProjects(): Promise<CmsProject[]> {
  if (!isLiveApi) return [];
  return request<CmsProject[]>("/projects");
}
export async function attachProjectImage(slug: string, mediaId: number): Promise<void> {
  if (!isLiveApi) throw new Error("Project image attachment requires the live API.");
  await request(`/projects/${encodeURIComponent(slug)}/images`, {
    method: "POST", body: JSON.stringify({ media_id: mediaId, sort_order: 0, is_cover: false }),
  });
}
export async function removeProjectImage(slug: string, mediaId: number): Promise<void> {
  if (!isLiveApi) throw new Error("Project image detachment requires the live API.");
  await request(`/projects/${encodeURIComponent(slug)}/images/${mediaId}`, { method: "DELETE" });
}

/* ------------------------------------------------------------------ media */

/** Resize + compress in the browser before upload (B8) — keeps mobile data use down. */
export async function compressImage(file: File, maxWidth = 1600, targetKb = 300): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  let quality = 0.85;
  let blob = await toBlob(canvas, quality);
  while (blob && blob.size / 1024 > targetKb && quality > 0.4) {
    quality -= 0.1;
    blob = await toBlob(canvas, quality);
  }
  return blob ?? file;
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

export async function listMedia(): Promise<MediaItem[]> {
  if (isLiveApi) return request<MediaItem[]>("/media");
  return read<MediaItem[]>(KEY.media, []);
}

export async function uploadMedia(file: File): Promise<MediaItem> {
  const compressed = await compressImage(file);

  if (isLiveApi) {
    const body = new FormData();
    body.append("file", compressed, file.name);
    return request<MediaItem>("/media", { method: "POST", body });
  }

  // Demo mode: keep the image as a data URL so it survives a page reload.
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(compressed);
  });
  const item: MediaItem = {
    key: `demo-${Date.now()}`,
    url: dataUrl,
    filename: file.name,
    sizeKb: Math.round(compressed.size / 1024),
    uploadedAt: new Date().toISOString(),
  };
  write(KEY.media, [item, ...read<MediaItem[]>(KEY.media, [])]);
  return item;
}

export async function deleteMedia(key: string): Promise<void> {
  if (isLiveApi) {
    await request(`/media/${encodeURIComponent(key)}`, { method: "DELETE" });
    return;
  }
  write(KEY.media, read<MediaItem[]>(KEY.media, []).filter((item) => item.key !== key));
}

/* ----------------------------------------------------------- testimonials */

const seedTestimonials: Testimonial[] = [];

// Testimonials intentionally remain frontend-local; they are not sent to or read from the API.
export async function listTestimonials(): Promise<Testimonial[]> {
  return read<Testimonial[]>(KEY.testimonials, seedTestimonials);
}
export async function saveTestimonial(input: Omit<Testimonial, "id"> & { id?: number }): Promise<Testimonial> {
  const list = read<Testimonial[]>(KEY.testimonials, seedTestimonials);
  const next: Testimonial = { ...input, id: input.id ?? Date.now() };
  write(KEY.testimonials, input.id ? list.map((t) => (t.id === input.id ? next : t)) : [next, ...list]);
  return next;
}

export async function deleteTestimonial(id: number): Promise<void> {
  write(KEY.testimonials, read<Testimonial[]>(KEY.testimonials, seedTestimonials).filter((t) => t.id !== id));
}
