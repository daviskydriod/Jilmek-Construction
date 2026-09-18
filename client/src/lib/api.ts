/**
 * JILMEK API client.
 *
 * The PHP/cPanel backend does not exist yet. Until it does, every call in here
 * falls back to a localStorage-backed "demo store" so the admin dashboard and
 * the contact form are fully usable (and demo-able to the client) without a
 * server.
 *
 * To go live: set VITE_API_BASE_URL in your .env (e.g. https://api.jilmek.com)
 * and implement the endpoints listed in API_CONTRACT below. Nothing else in the
 * app needs to change — `isLiveApi` flips automatically and the demo store is
 * bypassed.
 */

export const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
export const isLiveApi = API_BASE.length > 0;

export const API_CONTRACT = [
  "POST   /api/enquiries            create (public)",
  "GET    /api/enquiries            list (admin)",
  "PATCH  /api/enquiries/:id        update read state / status (admin)",
  "DELETE /api/enquiries/:id        remove (admin)",
  "GET    /api/products             list",
  "POST   /api/products             create (admin)",
  "PUT    /api/products/:id         update (admin)",
  "DELETE /api/products/:id         delete (admin)",
  "GET    /api/listings             list",
  "POST   /api/listings             create (admin)",
  "PUT    /api/listings/:id         update (admin)",
  "DELETE /api/listings/:id         delete (admin)",
  "GET    /api/media                list uploaded files (admin)",
  "POST   /api/media                multipart upload -> { url, key } (admin)",
  "DELETE /api/media/:key           delete (admin)",
  "GET    /api/testimonials         list",
  "POST   /api/testimonials         create (admin)",
  "PUT    /api/testimonials/:id     update (admin)",
  "DELETE /api/testimonials/:id     delete (admin)",
  "POST   /api/auth/login           { password } -> session cookie",
  "POST   /api/auth/logout          invalidate session",
  "GET    /api/auth/me              current admin or 401",
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
  key: string;
  url: string;
  filename: string;
  sizeKb: number;
  uploadedAt: string;
};

export type Testimonial = {
  id: number;
  author: string;
  role: string;
  quote: string;
  isPublished: boolean;
};

export type EnquiryInput = Omit<Enquiry, "id" | "status" | "isRead" | "createdAt">;

/* ------------------------------------------------------- demo store (local) */

const KEY = {
  enquiries: "jilmek.demo.enquiries",
  media: "jilmek.demo.media",
  testimonials: "jilmek.demo.testimonials",
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
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: init?.body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return (await response.json()) as T;
}

/* -------------------------------------------------------------- enquiries */

export async function createEnquiry(input: EnquiryInput): Promise<Enquiry> {
  if (isLiveApi) {
    return request<Enquiry>("/api/enquiries", { method: "POST", body: JSON.stringify(input) });
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
  if (isLiveApi) return request<Enquiry[]>("/api/enquiries");
  return read<Enquiry[]>(KEY.enquiries, []);
}

export async function updateEnquiry(id: number, patch: Partial<Enquiry>): Promise<Enquiry> {
  if (isLiveApi) {
    return request<Enquiry>(`/api/enquiries/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  }
  const list = read<Enquiry[]>(KEY.enquiries, []);
  const next = list.map((item) => (item.id === id ? { ...item, ...patch } : item));
  write(KEY.enquiries, next);
  return next.find((item) => item.id === id)!;
}

export async function deleteEnquiry(id: number): Promise<void> {
  if (isLiveApi) {
    await request(`/api/enquiries/${id}`, { method: "DELETE" });
    return;
  }
  write(KEY.enquiries, read<Enquiry[]>(KEY.enquiries, []).filter((item) => item.id !== id));
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
  if (isLiveApi) return request<MediaItem[]>("/api/media");
  return read<MediaItem[]>(KEY.media, []);
}

export async function uploadMedia(file: File): Promise<MediaItem> {
  const compressed = await compressImage(file);

  if (isLiveApi) {
    const body = new FormData();
    body.append("file", compressed, file.name);
    return request<MediaItem>("/api/media", { method: "POST", body });
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
    await request(`/api/media/${encodeURIComponent(key)}`, { method: "DELETE" });
    return;
  }
  write(KEY.media, read<MediaItem[]>(KEY.media, []).filter((item) => item.key !== key));
}

/* ----------------------------------------------------------- testimonials */

const seedTestimonials: Testimonial[] = [];

export async function listTestimonials(): Promise<Testimonial[]> {
  if (isLiveApi) return request<Testimonial[]>("/api/testimonials");
  return read<Testimonial[]>(KEY.testimonials, seedTestimonials);
}

export async function saveTestimonial(input: Omit<Testimonial, "id"> & { id?: number }): Promise<Testimonial> {
  if (isLiveApi) {
    return input.id
      ? request<Testimonial>(`/api/testimonials/${input.id}`, { method: "PUT", body: JSON.stringify(input) })
      : request<Testimonial>("/api/testimonials", { method: "POST", body: JSON.stringify(input) });
  }
  const list = read<Testimonial[]>(KEY.testimonials, seedTestimonials);
  const next: Testimonial = { ...input, id: input.id ?? Date.now() };
  write(KEY.testimonials, input.id ? list.map((t) => (t.id === input.id ? next : t)) : [next, ...list]);
  return next;
}

export async function deleteTestimonial(id: number): Promise<void> {
  if (isLiveApi) {
    await request(`/api/testimonials/${id}`, { method: "DELETE" });
    return;
  }
  write(
    KEY.testimonials,
    read<Testimonial[]>(KEY.testimonials, seedTestimonials).filter((t) => t.id !== id),
  );
}
