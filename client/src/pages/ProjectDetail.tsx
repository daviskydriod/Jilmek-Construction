import { useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, CircleCheck, MapPin, Phone } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import { caseStudyBySlug, photosFor, projectCaseStudies } from "@/lib/projects";
import { useSeo } from "@/lib/seo";
import { SITE, PHONES, whatsappLink } from "@/lib/site";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:slug");
  const project = params?.slug ? caseStudyBySlug(params.slug) : undefined;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const photos = project ? photosFor(project) : [];
  const cover = photos[0];

  useSeo({
    title: project ? `${project.title} — ${project.category} project` : "Project not found",
    description:
      project?.summary ??
      "Browse completed roofing and construction projects by JILMEK Roofing & Construction Ltd.",
    path: `/projects/${params?.slug ?? ""}`,
    image: cover?.src,
    jsonLd: project
      ? {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.summary,
          about: project.category,
          image: cover ? `${SITE.url}${cover.src}` : undefined,
          creator: { "@type": "Organization", name: SITE.name },
        }
      : undefined,
  });

  if (!project) {
    return (
      <section className="section-pad">
        <div className="container empty-page">
          <p className="eyebrow">Project</p>
          <h1>That project is not on the list.</h1>
          <p>It may have been renamed. Browse the full gallery instead.</p>
          <Link href="/projects" className="button button-green">
            All projects <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  const others = projectCaseStudies.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <section className="project-detail-hero">
        {cover && <img src={cover.src} alt={cover.alt} />}
        <div className="container">
          <Link href="/projects" className="project-back">
            <ArrowLeft size={15} /> All projects
          </Link>
          <p className="eyebrow">{project.category}</p>
          <h1>{project.title}</h1>
          <p className="project-location">
            <MapPin size={15} /> {project.location}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container project-detail-layout">
          <div className="project-story">
            <p className="lead">{project.summary}</p>
            {project.story.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <aside className="project-aside">
            <div className="project-aside-card">
              <p className="eyebrow">Services used</p>
              <ul>
                {project.services.map((service) => (
                  <li key={service}>
                    <CircleCheck size={16} /> {service}
                  </li>
                ))}
              </ul>
            </div>
            <div className="project-aside-card is-dark">
              <p className="eyebrow">Planning something similar?</p>
              <h3>Ask for a free estimate.</h3>
              <Link href="/contact#estimate" className="button button-gold">
                Request estimate <ArrowRight size={15} />
              </Link>
              <a
                className="button button-outline-white"
                href={whatsappLink(`Hello JILMEK, I'm interested in a project like "${project.title}".`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
              <a className="project-call" href={`tel:${PHONES[0]}`}>
                <Phone size={15} /> {PHONES[0]}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-pad section-tint">
        <div className="container">
          <p className="section-number">Project gallery</p>
          <h2 className="project-gallery-title">{photos.length} photos from this project set.</h2>
          <div className="project-gallery-grid">
            {photos.map((photo, index) => (
              <button key={photo.slug} onClick={() => setLightboxIndex(index)}>
                <img src={photo.thumb} alt={photo.alt} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section-pad">
          <div className="container">
            <p className="section-number">More projects</p>
            <div className="project-more-grid">
              {others.map((other) => {
                const otherCover = photosFor(other)[0];
                return (
                  <Link key={other.slug} href={`/projects/${other.slug}`} className="project-more-card">
                    {otherCover && <img src={otherCover.thumb} alt={otherCover.alt} loading="lazy" />}
                    <div>
                      <span>{other.category}</span>
                      <h3>{other.title}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  );
}
