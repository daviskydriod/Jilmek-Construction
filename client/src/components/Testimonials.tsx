import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { listTestimonials, Testimonial } from "@/lib/api";

/**
 * Testimonials (C4). Renders nothing at all until JILMEK has published real
 * quotes through the admin dashboard — an empty "what our clients say" band
 * looks worse than no band.
 */
export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    listTestimonials()
      .then((all) => setItems(all.filter((t) => t.isPublished)))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="section-pad testimonials-section">
      <div className="container">
        <p className="section-number">What clients say</p>
        <h2 className="testimonials-title">In their words.</h2>
        <div className="testimonials-grid">
          {items.map((item) => (
            <figure key={item.id}>
              <Quote size={22} />
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <strong>{item.author}</strong>
                {item.role && <span>{item.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
