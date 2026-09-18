import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Image as ImageIcon,
  Inbox,
  Landmark,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  PackageOpen,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import {
  mockPropertyListings,
  mockRoofingProducts,
  MockPropertyListing,
  MockRoofingProduct,
} from "@/lib/mockCms";
import {
  deleteEnquiry,
  deleteMedia,
  deleteTestimonial,
  Enquiry,
  isLiveApi,
  listEnquiries,
  listMedia,
  listTestimonials,
  MediaItem,
  saveTestimonial,
  Testimonial,
  updateEnquiry,
  uploadMedia,
} from "@/lib/api";

/* -------------------------------------------------------------------- types */

type Tab = "overview" | "products" | "listings" | "media" | "enquiries";

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

const emptyProduct: ProductForm = {
  name: "", profile: "", description: "", imageUrl: "", imageKey: "",
  isPublished: true, isFeatured: false, sortOrder: 0,
};

const emptyListing: ListingForm = {
  title: "", listingType: "property", location: "", priceLabel: "", status: "available",
  description: "", imageUrl: "", imageKey: "", isPublished: true, isFeatured: false,
};

const emptyTestimonial = { author: "", role: "", quote: "", isPublished: true };

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard; detail: string }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, detail: "Counts & quick actions" },
  { id: "products", label: "Products", icon: PackageOpen, detail: "Roofing catalog" },
  { id: "listings", label: "Listings", icon: Landmark, detail: "Land & property" },
  { id: "media", label: "Media", icon: ImageIcon, detail: "Photo library" },
  { id: "enquiries", label: "Enquiries", icon: Inbox, detail: "Leads & testimonials" },
];

/* ==================================================================== shell */

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<MockRoofingProduct[]>(mockRoofingProducts);
  const [listings, setListings] = useState<MockPropertyListing[]>(mockPropertyListings);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Full-screen editor state (B3) — null means "list view".
  const [editor, setEditor] = useState<
    | { type: "product"; id: number | null; form: ProductForm }
    | { type: "listing"; id: number | null; form: ListingForm }
    | { type: "testimonial"; id: number | null; form: typeof emptyTestimonial }
    | null
  >(null);
  const [picker, setPicker] = useState<null | ((url: string, key: string) => void)>(null);
  const [openEnquiry, setOpenEnquiry] = useState<Enquiry | null>(null);

  const refresh = useCallback(async () => {
    const [m, e, t] = await Promise.all([listMedia(), listEnquiries(), listTestimonials()]);
    setMedia(m);
    setEnquiries(e);
    setTestimonials(t);
  }, []);

  useEffect(() => {
    refresh().catch(() => toast.error("Could not load dashboard data."));
  }, [refresh]);

  if (!user) return <DashboardLayout>{null}</DashboardLayout>;

  const unread = enquiries.filter((item) => item.status === "New").length;

  const tabCounts: Record<Tab, number | null> = {
    overview: null,
    products: products.length,
    listings: listings.length,
    media: media.length,
    enquiries: enquiries.length,
  };

  /** B2: tapping the active tab scrolls the view back to top. */
  const selectTab = (next: Tab) => {
    if (next === tab) scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setTab(next);
    setEditor(null);
    setOpenEnquiry(null);
  };

  return (
    <DashboardLayout>
      <div className="adm">
        <div className="adm-main">
          <header className="adm-topbar">
            <div>
              <p className="adm-kicker">JILMEK content studio</p>
              <h1>{TABS.find((t) => t.id === tab)?.label}</h1>
            </div>
            <div className="adm-topbar-actions">
              <Link href="/" className="adm-icon-btn" title="View public site">
                <ExternalLink size={18} />
              </Link>
              <button className="adm-icon-btn" title="Log out" onClick={logout}>
                <LogOut size={18} />
              </button>
            </div>
          </header>

          {!isLiveApi && (
            <p className="adm-demo-banner">
              Demo mode — saved in this browser only. Set <code>VITE_API_BASE_URL</code> to connect the PHP API.
            </p>
          )}

          <div className="adm-body" ref={scrollRef}>
          {tab === "overview" && (
            <Overview
              products={products}
              listings={listings}
              media={media}
              enquiries={enquiries}
              onGo={selectTab}
            />
          )}

          {tab === "products" && (
            <ProductsTab
              products={products}
              onNew={() => setEditor({ type: "product", id: null, form: emptyProduct })}
              onEdit={(p) =>
                setEditor({
                  type: "product",
                  id: p.id,
                  form: {
                    name: p.name, profile: p.profile, description: p.description,
                    imageUrl: p.imageUrl ?? "", imageKey: p.imageKey ?? "",
                    isPublished: p.isPublished, isFeatured: p.isFeatured, sortOrder: p.sortOrder,
                  },
                })
              }
              onDelete={(p) => {
                if (!window.confirm(`Delete ${p.name}?`)) return;
                setProducts((items) => items.filter((i) => i.id !== p.id));
                toast.success("Product removed.");
              }}
            />
          )}

          {tab === "listings" && (
            <ListingsTab
              listings={listings}
              onNew={() => setEditor({ type: "listing", id: null, form: emptyListing })}
              onEdit={(l) =>
                setEditor({
                  type: "listing",
                  id: l.id,
                  form: {
                    title: l.title, listingType: l.listingType, location: l.location,
                    priceLabel: l.priceLabel ?? "", status: l.status, description: l.description,
                    imageUrl: l.imageUrl ?? "", imageKey: l.imageKey ?? "",
                    isPublished: l.isPublished, isFeatured: l.isFeatured,
                  },
                })
              }
              onDelete={(l) => {
                if (!window.confirm(`Delete ${l.title}?`)) return;
                setListings((items) => items.filter((i) => i.id !== l.id));
                toast.success("Listing removed.");
              }}
            />
          )}

          {tab === "media" && (
            <MediaTab
              media={media}
              products={products}
              listings={listings}
              onChange={refresh}
            />
          )}

          {tab === "enquiries" && (
            <EnquiriesTab
              enquiries={enquiries}
              testimonials={testimonials}
              onOpen={async (enquiry) => {
                setOpenEnquiry(enquiry);
                if (!enquiry.isRead) {
                  await updateEnquiry(enquiry.id, { isRead: true });
                  refresh();
                }
              }}
              onNewTestimonial={() =>
                setEditor({ type: "testimonial", id: null, form: emptyTestimonial })
              }
              onEditTestimonial={(t) =>
                setEditor({
                  type: "testimonial",
                  id: t.id,
                  form: { author: t.author, role: t.role, quote: t.quote, isPublished: t.isPublished },
                })
              }
              onDeleteTestimonial={async (t) => {
                if (!window.confirm(`Delete testimonial from ${t.author}?`)) return;
                await deleteTestimonial(t.id);
                refresh();
                toast.success("Testimonial removed.");
              }}
            />
          )}
          </div>
        </div>

        {/* B1: bottom tab bar on mobile, side rail on desktop.
            On desktop each link also shows what the section holds and a live count. */}
        <nav className="adm-tabbar" aria-label="Dashboard sections">
          <div className="adm-tabbar-brand">
            <img src="/images/logo_22da56e1.png" alt="JILMEK Roofing & Construction Ltd" />
          </div>
          {TABS.map(({ id, label, icon: Icon, detail }) => {
            const count = tabCounts[id];
            return (
              <button
                key={id}
                className={tab === id ? "active" : ""}
                onClick={() => selectTab(id)}
                aria-current={tab === id ? "page" : undefined}
              >
                <span className="adm-tab-icon">
                  <Icon size={20} />
                  {id === "enquiries" && unread > 0 && <span className="adm-badge">{unread}</span>}
                </span>
                <span className="adm-tab-text">
                  <span className="adm-tab-label">
                    {label}
                    {count !== null && <b className="adm-tab-count">{count}</b>}
                  </span>
                  <small className="adm-tab-detail">{detail}</small>
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ------------------------------------------------ full-screen editors */}
      {editor?.type === "product" && (
        <FullScreenForm
          title={editor.id ? "Edit product" : "New product"}
          onClose={() => setEditor(null)}
          onSubmit={() => {
            const next = {
              ...editor.form,
              imageKey: editor.form.imageKey || null,
              id: editor.id ?? Date.now(),
            } as MockRoofingProduct;
            setProducts((items) =>
              editor.id ? items.map((i) => (i.id === editor.id ? next : i)) : [next, ...items],
            );
            setEditor(null);
            toast.success(editor.id ? "Product updated." : "Product created.");
          }}
        >
          <Field label="Product name" required value={editor.form.name}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, name: v } })}
            placeholder="e.g. Long Span" />
          <Field label="Profile / short label" required value={editor.form.profile}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, profile: v } })}
            placeholder="e.g. Modern roofing sheet" />
          <TextArea label="Description" required value={editor.form.description}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, description: v } })}
            placeholder="A clear, factual description for customers." />
          <ImagePickerField
            value={editor.form.imageUrl}
            onPick={() =>
              setPicker(() => (url: string, key: string) =>
                setEditor((e) => (e && e.type === "product" ? { ...e, form: { ...e.form, imageUrl: url, imageKey: key } } : e)),
              )
            }
            onClear={() => setEditor({ ...editor, form: { ...editor.form, imageUrl: "", imageKey: "" } })}
          />
          <Field label="Sort order" type="number" value={String(editor.form.sortOrder)}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, sortOrder: Number(v) || 0 } })} />
          <Check label="Published on website" checked={editor.form.isPublished}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, isPublished: v } })} />
          <Check label="Mark as featured" checked={editor.form.isFeatured}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, isFeatured: v } })} />
        </FullScreenForm>
      )}

      {editor?.type === "listing" && (
        <FullScreenForm
          title={editor.id ? "Edit listing" : "New listing"}
          onClose={() => setEditor(null)}
          onSubmit={() => {
            const next = {
              ...editor.form,
              priceLabel: editor.form.priceLabel || null,
              imageKey: editor.form.imageKey || null,
              id: editor.id ?? Date.now(),
            } as MockPropertyListing;
            setListings((items) =>
              editor.id ? items.map((i) => (i.id === editor.id ? next : i)) : [next, ...items],
            );
            setEditor(null);
            toast.success(editor.id ? "Listing updated." : "Listing created.");
          }}
        >
          <Field label="Listing title" required value={editor.form.title}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, title: v } })}
            placeholder="e.g. Residential property opportunity" />
          <Select label="Listing type" value={editor.form.listingType}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, listingType: v as ListingForm["listingType"] } })}
            options={[["land", "Land"], ["property", "Property"], ["development", "Development"]]} />
          <Select label="Status" value={editor.form.status}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, status: v as ListingForm["status"] } })}
            options={[["available", "Available"], ["reserved", "Reserved"], ["sold", "Sold"], ["draft", "Draft"]]} />
          <Field label="Location" required value={editor.form.location}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, location: v } })}
            placeholder="Add only confirmed location details" />
          <Field label="Price label (optional)" value={editor.form.priceLabel}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, priceLabel: v } })}
            placeholder="e.g. Price on enquiry" />
          <TextArea label="Description" required value={editor.form.description}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, description: v } })}
            placeholder="A clear, factual description for the listing." />
          <ImagePickerField
            value={editor.form.imageUrl}
            onPick={() =>
              setPicker(() => (url: string, key: string) =>
                setEditor((e) => (e && e.type === "listing" ? { ...e, form: { ...e.form, imageUrl: url, imageKey: key } } : e)),
              )
            }
            onClear={() => setEditor({ ...editor, form: { ...editor.form, imageUrl: "", imageKey: "" } })}
          />
          <Check label="Published on website" checked={editor.form.isPublished}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, isPublished: v } })} />
          <Check label="Mark as featured" checked={editor.form.isFeatured}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, isFeatured: v } })} />
        </FullScreenForm>
      )}

      {editor?.type === "testimonial" && (
        <FullScreenForm
          title={editor.id ? "Edit testimonial" : "New testimonial"}
          onClose={() => setEditor(null)}
          onSubmit={async () => {
            await saveTestimonial({ ...editor.form, id: editor.id ?? undefined });
            setEditor(null);
            refresh();
            toast.success("Testimonial saved.");
          }}
        >
          <Field label="Client name" required value={editor.form.author}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, author: v } })}
            placeholder="Only use a real name you have permission to publish" />
          <Field label="Role / location" value={editor.form.role}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, role: v } })}
            placeholder="e.g. Homeowner, Techiman" />
          <TextArea label="What they said" required value={editor.form.quote}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, quote: v } })}
            placeholder="Their words, not a paraphrase." />
          <Check label="Published on website" checked={editor.form.isPublished}
            onChange={(v) => setEditor({ ...editor, form: { ...editor.form, isPublished: v } })} />
        </FullScreenForm>
      )}

      {/* B9: media picker instead of a free-text path field */}
      {picker && (
        <MediaPicker
          media={media}
          onClose={() => setPicker(null)}
          onSelect={(item) => {
            picker(item.url, item.key);
            setPicker(null);
          }}
          onUploaded={refresh}
        />
      )}

      {openEnquiry && (
        <EnquiryDetail
          enquiry={openEnquiry}
          onClose={() => setOpenEnquiry(null)}
          onStatus={async (status) => {
            await updateEnquiry(openEnquiry.id, { status });
            setOpenEnquiry({ ...openEnquiry, status });
            refresh();
          }}
          onDelete={async () => {
            if (!window.confirm("Delete this enquiry?")) return;
            await deleteEnquiry(openEnquiry.id);
            setOpenEnquiry(null);
            refresh();
            toast.success("Enquiry deleted.");
          }}
        />
      )}
    </DashboardLayout>
  );
}

/* ================================================================= sections */

function Overview({
  products, listings, media, enquiries, onGo,
}: {
  products: MockRoofingProduct[];
  listings: MockPropertyListing[];
  media: MediaItem[];
  enquiries: Enquiry[];
  onGo: (tab: Tab) => void;
}) {
  const stats = [
    { label: "Roofing products", value: products.length, sub: `${products.filter((p) => p.isPublished).length} published`, tab: "products" as Tab },
    { label: "Property listings", value: listings.length, sub: `${listings.filter((l) => l.isPublished).length} published`, tab: "listings" as Tab },
    { label: "Media files", value: media.length, sub: "In the library", tab: "media" as Tab },
    { label: "New enquiries", value: enquiries.filter((e) => e.status === "New").length, sub: `${enquiries.length} total`, tab: "enquiries" as Tab },
  ];

  return (
    <div className="adm-section">
      <div className="adm-stats">
        {stats.map((s) => (
          <button key={s.label} className="adm-stat" onClick={() => onGo(s.tab)}>
            <span>{s.label}</span>
            <strong>{s.value}</strong>
            <small>{s.sub}</small>
          </button>
        ))}
      </div>

      <div className="adm-card">
        <h2>Quick actions</h2>
        <div className="adm-quick">
          <button onClick={() => onGo("enquiries")}><Inbox size={17} /> Check new enquiries <ArrowRight size={15} /></button>
          <button onClick={() => onGo("media")}><Upload size={17} /> Upload project photos <ArrowRight size={15} /></button>
          <button onClick={() => onGo("products")}><PackageOpen size={17} /> Update roofing catalog <ArrowRight size={15} /></button>
        </div>
      </div>

      <div className="adm-card">
        <h2>Latest enquiries</h2>
        {enquiries.length === 0 ? (
          <p className="adm-muted">No enquiries yet. They appear here as soon as the contact form is submitted.</p>
        ) : (
          <ul className="adm-mini-list">
            {enquiries.slice(0, 4).map((e) => (
              <li key={e.id}>
                <b>{e.name}</b>
                <span>{e.service || "General enquiry"}</span>
                <small>{new Date(e.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ProductsTab({
  products, onNew, onEdit, onDelete,
}: {
  products: MockRoofingProduct[];
  onNew: () => void;
  onEdit: (p: MockRoofingProduct) => void;
  onDelete: (p: MockRoofingProduct) => void;
}) {
  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <p>Roofing profiles shown on the public Services page.</p>
        <button className="adm-primary" onClick={onNew}><Plus size={16} /> New product</button>
      </div>
      {products.length === 0 ? (
        <Empty icon={<PackageOpen size={30} />} title="No roofing products yet" body="Add the first product to build the live catalog." />
      ) : (
        <ul className="adm-records">
          {products.map((p) => (
            <li key={p.id}>
              <div className="adm-record-thumb">
                {p.imageUrl ? <img src={p.imageUrl} alt="" loading="lazy" /> : <PackageOpen size={20} />}
              </div>
              <div className="adm-record-main">
                <div className="adm-pills">
                  <span className={`adm-pill ${p.isPublished ? "green" : ""}`}>{p.isPublished ? "Published" : "Draft"}</span>
                  {p.isFeatured && <span className="adm-pill gold">Featured</span>}
                </div>
                <h3>{p.name}</h3>
                <p>{p.profile}</p>
              </div>
              <div className="adm-record-actions">
                <button onClick={() => onEdit(p)}>Edit</button>
                <button className="danger" onClick={() => onDelete(p)} aria-label={`Delete ${p.name}`}><Trash2 size={15} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ListingsTab({
  listings, onNew, onEdit, onDelete,
}: {
  listings: MockPropertyListing[];
  onNew: () => void;
  onEdit: (l: MockPropertyListing) => void;
  onDelete: (l: MockPropertyListing) => void;
}) {
  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <p>Land, property and development records.</p>
        <button className="adm-primary" onClick={onNew}><Plus size={16} /> New listing</button>
      </div>
      {listings.length === 0 ? (
        <Empty icon={<Landmark size={30} />} title="No property listings yet" body="Add a land, property or development record to begin." />
      ) : (
        <ul className="adm-records">
          {listings.map((l) => (
            <li key={l.id}>
              <div className="adm-record-thumb">
                {l.imageUrl ? <img src={l.imageUrl} alt="" loading="lazy" /> : <Landmark size={20} />}
              </div>
              <div className="adm-record-main">
                <div className="adm-pills">
                  <span className={`adm-pill ${l.isPublished ? "green" : ""}`}>{l.isPublished ? "Published" : "Draft"}</span>
                  <span className="adm-pill">{l.status}</span>
                </div>
                <h3>{l.title}</h3>
                <p>{l.listingType} · {l.location}</p>
              </div>
              <div className="adm-record-actions">
                <button onClick={() => onEdit(l)}>Edit</button>
                <button className="danger" onClick={() => onDelete(l)} aria-label={`Delete ${l.title}`}><Trash2 size={15} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- media tab */

function MediaTab({
  media, products, listings, onChange,
}: {
  media: MediaItem[];
  products: MockRoofingProduct[];
  listings: MockPropertyListing[];
  onChange: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const usedBy = (item: MediaItem) => {
    const names = [
      ...products.filter((p) => p.imageUrl === item.url).map((p) => p.name),
      ...listings.filter((l) => l.imageUrl === item.url).map((l) => l.title),
    ];
    return names;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        await uploadMedia(file);
      }
      onChange();
      toast.success(files.length > 1 ? `${files.length} images uploaded.` : "Image uploaded.");
    } catch {
      toast.error("Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-section">
      <div
        className={`adm-drop ${dragging ? "is-dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={26} />
        <strong>{busy ? "Uploading…" : "Upload photos"}</strong>
        {/* `capture` is intentionally omitted so mobile offers camera AND gallery */}
        <span>Tap to choose from camera or gallery — or drag files here on desktop.</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {media.length === 0 ? (
        <Empty icon={<ImageIcon size={30} />} title="No images yet" body="Uploaded photos appear here and can be picked when editing a product or listing." />
      ) : (
        <ul className="adm-media-grid">
          {media.map((item) => {
            const used = usedBy(item);
            return (
              <li key={item.key}>
                <img src={item.url} alt={item.filename} loading="lazy" />
                <div className="adm-media-meta">
                  <b title={item.filename}>{item.filename}</b>
                  <small>{item.sizeKb} KB · {new Date(item.uploadedAt).toLocaleDateString()}</small>
                  {used.length > 0 && <span className="adm-used">In use: {used.join(", ")}</span>}
                </div>
                <button
                  className="adm-media-delete"
                  aria-label={`Delete ${item.filename}`}
                  onClick={async () => {
                    const warning = used.length
                      ? `${item.filename} is used by: ${used.join(", ")}.\n\nDelete anyway?`
                      : `Delete ${item.filename}?`;
                    if (!window.confirm(warning)) return;
                    await deleteMedia(item.key);
                    onChange();
                    toast.success("Image deleted.");
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function MediaPicker({
  media, onClose, onSelect, onUploaded,
}: {
  media: MediaItem[];
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
  onUploaded: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="adm-sheet" role="dialog" aria-modal="true" aria-label="Choose an image">
      <header>
        <h2>Choose an image</h2>
        <button onClick={onClose} aria-label="Close"><X size={20} /></button>
      </header>
      <div className="adm-sheet-body">
        <button className="adm-primary full" disabled={busy} onClick={() => inputRef.current?.click()}>
          <Upload size={16} /> {busy ? "Uploading…" : "Upload new photo"}
        </button>
        <input
          ref={inputRef} type="file" accept="image/*" hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setBusy(true);
            try {
              const item = await uploadMedia(file);
              onUploaded();
              onSelect(item);
            } catch {
              toast.error("Upload failed.");
            } finally {
              setBusy(false);
            }
          }}
        />
        {media.length === 0 ? (
          <p className="adm-muted">Nothing in the library yet — upload a photo to get started.</p>
        ) : (
          <ul className="adm-picker-grid">
            {media.map((item) => (
              <li key={item.key}>
                <button onClick={() => onSelect(item)}>
                  <img src={item.url} alt={item.filename} loading="lazy" />
                  <span>{item.filename}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- enquiries tab */

function EnquiriesTab({
  enquiries, testimonials, onOpen, onNewTestimonial, onEditTestimonial, onDeleteTestimonial,
}: {
  enquiries: Enquiry[];
  testimonials: Testimonial[];
  onOpen: (e: Enquiry) => void;
  onNewTestimonial: () => void;
  onEditTestimonial: (t: Testimonial) => void;
  onDeleteTestimonial: (t: Testimonial) => void;
}) {
  const [view, setView] = useState<"enquiries" | "testimonials">("enquiries");

  return (
    <div className="adm-section">
      <div className="adm-segment">
        <button className={view === "enquiries" ? "active" : ""} onClick={() => setView("enquiries")}>
          Enquiries ({enquiries.length})
        </button>
        <button className={view === "testimonials" ? "active" : ""} onClick={() => setView("testimonials")}>
          Testimonials ({testimonials.length})
        </button>
      </div>

      {view === "enquiries" &&
        (enquiries.length === 0 ? (
          <Empty
            icon={<Inbox size={30} />}
            title="No enquiries yet"
            body="Submissions from the website contact form land here, newest first."
          />
        ) : (
          <ul className="adm-records">
            {enquiries.map((e) => (
              <li key={e.id} className={e.isRead ? "" : "is-unread"}>
                <button className="adm-record-open" onClick={() => onOpen(e)}>
                  <div className="adm-record-main">
                    <div className="adm-pills">
                      <span className={`adm-pill ${e.status === "New" ? "green" : e.status === "Closed" ? "" : "gold"}`}>{e.status}</span>
                      {!e.isRead && <span className="adm-pill unread">Unread</span>}
                    </div>
                    <h3>{e.name}</h3>
                    <p>{e.phone} · {e.service || "General enquiry"}</p>
                    <small>{new Date(e.createdAt).toLocaleString()}</small>
                  </div>
                  <ArrowRight size={16} />
                </button>
              </li>
            ))}
          </ul>
        ))}

      {view === "testimonials" && (
        <>
          <div className="adm-section-head">
            <p>Only publish quotes a client has actually given you.</p>
            <button className="adm-primary" onClick={onNewTestimonial}><Plus size={16} /> New</button>
          </div>
          {testimonials.length === 0 ? (
            <Empty icon={<MessageSquareQuote size={30} />} title="No testimonials yet" body="Add 3–5 real client quotes — they are one of the strongest trust signals on the site." />
          ) : (
            <ul className="adm-records">
              {testimonials.map((t) => (
                <li key={t.id}>
                  <div className="adm-record-main">
                    <div className="adm-pills">
                      <span className={`adm-pill ${t.isPublished ? "green" : ""}`}>{t.isPublished ? "Published" : "Draft"}</span>
                    </div>
                    <h3>{t.author}</h3>
                    <p>{t.quote}</p>
                  </div>
                  <div className="adm-record-actions">
                    <button onClick={() => onEditTestimonial(t)}>Edit</button>
                    <button className="danger" onClick={() => onDeleteTestimonial(t)} aria-label={`Delete testimonial from ${t.author}`}><Trash2 size={15} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function EnquiryDetail({
  enquiry, onClose, onStatus, onDelete,
}: {
  enquiry: Enquiry;
  onClose: () => void;
  onStatus: (status: Enquiry["status"]) => void;
  onDelete: () => void;
}) {
  return (
    <div className="adm-sheet" role="dialog" aria-modal="true" aria-label={`Enquiry from ${enquiry.name}`}>
      <header>
        <button onClick={onClose} aria-label="Back"><ArrowLeft size={20} /></button>
        <h2>{enquiry.name}</h2>
        <button onClick={onDelete} aria-label="Delete enquiry"><Trash2 size={18} /></button>
      </header>
      <div className="adm-sheet-body">
        <div className="adm-enq-actions">
          <a className="adm-primary full" href={`tel:${enquiry.phone}`}>Call {enquiry.phone}</a>
          <a
            className="adm-secondary full"
            href={`https://wa.me/${enquiry.phone.replace(/^0/, "233").replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Reply on WhatsApp
          </a>
        </div>

        <dl className="adm-detail-list">
          {enquiry.email && <><dt>Email</dt><dd><a href={`mailto:${enquiry.email}`}>{enquiry.email}</a></dd></>}
          {enquiry.location && <><dt>Location</dt><dd>{enquiry.location}</dd></>}
          {enquiry.service && <><dt>Service</dt><dd>{enquiry.service}</dd></>}
          <dt>Prefers</dt><dd>{enquiry.preferred}</dd>
          <dt>Received</dt><dd>{new Date(enquiry.createdAt).toLocaleString()}</dd>
        </dl>

        {enquiry.message && (
          <div className="adm-card">
            <h3>Message</h3>
            <p>{enquiry.message}</p>
          </div>
        )}

        <div className="adm-status-row">
          {(["New", "Contacted", "Closed"] as const).map((status) => (
            <button
              key={status}
              className={enquiry.status === status ? "active" : ""}
              onClick={() => onStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ form widgets */

function FullScreenForm({
  title, children, onClose, onSubmit,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };
  return (
    <form className="adm-fullform" onSubmit={submit}>
      <header>
        <button type="button" onClick={onClose} aria-label="Cancel"><ArrowLeft size={20} /></button>
        <h2>{title}</h2>
      </header>
      <div className="adm-fullform-body">{children}</div>
      {/* B3: sticky save, always reachable above the tab bar */}
      <footer>
        <button type="button" className="adm-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="adm-primary">Save</button>
      </footer>
    </form>
  );
}

function Field({
  label, value, onChange, placeholder, required, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <label className="adm-field">
      <span>{label}{required && " *"}</span>
      <input type={type} value={value} required={required} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function TextArea({
  label, value, onChange, placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <label className="adm-field">
      <span>{label}{required && " *"}</span>
      <textarea rows={5} value={value} required={required} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Select({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[][];
}) {
  return (
    <label className="adm-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([key, name]) => <option key={key} value={key}>{name}</option>)}
      </select>
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="adm-check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function ImagePickerField({ value, onPick, onClear }: { value: string; onPick: () => void; onClear: () => void }) {
  return (
    <div className="adm-field">
      <span>Image</span>
      {value ? (
        <div className="adm-image-preview">
          <img src={value} alt="" />
          <div>
            <button type="button" onClick={onPick}>Change</button>
            <button type="button" className="danger" onClick={onClear}>Remove</button>
          </div>
        </div>
      ) : (
        <button type="button" className="adm-image-choose" onClick={onPick}>
          <ImageIcon size={18} /> Choose from media library
        </button>
      )}
    </div>
  );
}

function Empty({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="adm-empty">
      {icon}
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
