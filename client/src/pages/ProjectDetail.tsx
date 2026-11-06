import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, CircleCheck, MapPin, Phone } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import { caseStudyBySlug, photosFor, projectCaseStudies } from "@/lib/projects";
import { listCmsProjects, type CmsProject } from "@/lib/api";
import { type GalleryCategory, type GalleryPhoto } from "@/lib/gallery";
import { useSeo } from "@/lib/seo";
import { SITE, PHONES, whatsappLink } from "@/lib/site";

const categoryFor = (value: string): GalleryCategory =>
  (["Roofing", "Construction", "Finishing", "Real estate"].includes(value) ? value : "Construction") as GalleryCategory;

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug ?? "";
  const [apiProjects, setApiProjects] = useState<CmsProject[]>([]);
  const [apiProjectsLoaded, setApiProjectsLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    listCmsProjects()
      .then((items) => { if (active) setApiProjects(items); })
      .catch(() => undefined)
      .finally(() => { if (active) setApiProjectsLoaded(true); });
    return () => { active = false; };
  }, []);

  const staticProject = slug ? caseStudyBySlug(slug) : undefined;
  const apiProject = apiProjects.find((item) => item.slug === slug);
  const project = apiProject ? {
    slug: apiProject.slug,
    title: apiProject.title,
    category: categoryFor(apiProject.category),
    location: apiProject.location || staticProject?.location || "Ghana",
    summary: apiProject.summary || staticProject?.summary || apiProject.description || "",
    story: apiProject.description
      ? apiProject.description.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)
      : staticProject?.story ?? [],
    services: staticProject?.services ?? [],
    photoSlugs: staticProject?.photoSlugs ?? [],
  } : staticProject;

  const apiImages = apiProject
    ? [ ...(apiProject.coverImage ? [apiProject.coverImage] : []), ...apiProject.images.filter((image) => image.id !== apiProject.coverImage?.id) ]
    : [];
  const dynamicPhotos: GalleryPhoto[] = apiImages.map((image) => ({
    slug: `${apiProject?.slug}-${image.id}`,
    category: categoryFor(apiProject?.category ?? "Construction"),
    alt: image.alt_text || apiProject?.title || "JILMEK project photo",
    src: image.url,
    thumb: image.url,
  }));
  const photos = dynamicPhotos.length ? dynamicPhotos : project ? photosFor(project) : [];
  const cover = photos[0];

  useSeo({
    title: project ? `${project.title} — ${project.category} project` : apiProjectsLoaded ? "Project not found" : "Loading project",
    description: project?.summary ?? "Browse completed roofing and construction projects by JILMEK Roofing & Construction Ltd.",
    path: `/projects/${slug}`,
    image: cover?.src,
    jsonLd: project ? {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.summary,
      about: project.category,
      image: cover ? `${SITE.url}${cover.src}` : undefined,
      creator: { "@type": "Organization", name: SITE.name },
    } : undefined,
  });

  if (!project && !apiProjectsLoaded) {
    return <section className="section-pad"><div className="container empty-page"><p>Loading project…</p></div></section>;
  }

  if (!project) {
    return (
      <section className="section-pad">
        <div className="container empty-page">
          <p className="eyebrow">Project</p>
          <h1>That project is not on the list.</h1>
          <p>It may have been renamed. Browse the full gallery instead.</p>
          <Link href="/projects" className="button button-green">All projects <ArrowRight size={16} /></Link>
        </div>
      </section>
    );
  }

  const moreProjects = apiProjects.length > 0
    ? apiProjects.filter((item) => item.slug !== project.slug).slice(0, 3).map((item) => ({
        slug: item.slug,
        title: item.title,
        category: item.category,
        image: (item.coverImage ?? item.images[0])?.url,
      }))
    : projectCaseStudies.filter((item) => item.slug !== project.slug).slice(0, 3).map((item) => ({
        slug: item.slug,
        title: item.title,
        category: item.category,
        image: photosFor(item)[0]?.thumb,
      }));

  return (
    <>
      <section className="project-detail-hero">
        {cover && <img src={cover.src} alt={cover.alt} />}
        <div className="container">
          <Link href="/projects" className="project-back"><ArrowLeft size={15} /> All projects</Link>
          <p className="eyebrow">{project.category}</p>
          <h1>{project.title}</h1>
          {project.location && <p className="project-location"><MapPin size={15} /> {project.location}</p>}
        </div>
      </section>

      <section className="section-pad">
        <div className="container project-detail-layout">
          <div className="project-story">
            {project.summary && <p className="lead">{project.summary}</p>}
            {project.story.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 30)}`}>{paragraph}</p>)}
          </div>
          <aside className="project-aside">
            {project.services.length > 0 && (
              <div className="project-aside-card">
                <p className="eyebrow">Services used</p>
                <ul>{project.services.map((service) => <li key={service}><CircleCheck size={16} /> {service}</li>)}</ul>
              </div>
            )}
            <div className="project-aside-card is-dark">
              <p className="eyebrow">Planning something similar?</p>
              <h3>Ask for a free estimate.</h3>
              <Link href="/contact#estimate" className="button button-gold">Request estimate <ArrowRight size={15} /></Link>
              <a className="button button-outline-white" href={whatsappLink(`Hello JILMEK, I'm interested in a project like "${project.title}".`)} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
              <a className="project-call" href={`tel:${PHONES[0]}`}><Phone size={15} /> {PHONES[0]}</a>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-pad section-tint">
        <div className="container">
          <p className="section-number">Project gallery</p>
          <h2 className="project-gallery-title">{photos.length} photos from this project set.</h2>
          {photos.length > 0 ? (
            <div className="project-gallery-grid">
              {photos.map((photo, index) => <button key={photo.slug} onClick={() => setLightboxIndex(index)}><img src={photo.thumb} alt={photo.alt} loading="lazy" /></button>)}
            </div>
          ) : <p className="adm-muted">Project photos will appear here when attached in the dashboard Media tab.</p>}
        </div>
      </section>

      {moreProjects.length > 0 && (
        <section className="section-pad">
          <div className="container">
            <p className="section-number">More projects</p>
            <div className="project-more-grid">
              {moreProjects.map((other) => (
                <Link key={other.slug} href={`/projects/${other.slug}`} className="project-more-card">
                  {other.image && <img src={other.image} alt={other.title} loading="lazy" />}
                  <div><span>{other.category}</span><h3>{other.title}</h3></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {lightboxIndex !== null && <Lightbox photos={photos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onIndexChange={setLightboxIndex} />}
    </>
  );
}
