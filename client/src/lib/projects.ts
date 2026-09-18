import { galleryPhotos, GalleryPhoto } from "./gallery";

export type ProjectCaseStudy = {
  slug: string;
  title: string;
  category: "Roofing" | "Construction" | "Finishing" | "Real estate";
  /** Kept deliberately vague until JILMEK confirms exact sites. */
  location: string;
  summary: string;
  story: string[];
  services: string[];
  /** Slugs from gallery.ts — the first one is the cover image. */
  photoSlugs: string[];
};

const photo = (slug: string) => galleryPhotos.find((p) => p.slug === slug);

export const photosFor = (project: ProjectCaseStudy): GalleryPhoto[] =>
  project.photoSlugs.map(photo).filter(Boolean) as GalleryPhoto[];

export const coverFor = (project: ProjectCaseStudy): GalleryPhoto | undefined =>
  photo(project.photoSlugs[0]);

// NOTE FOR JILMEK: titles, locations and story copy below are written from what
// the photos show. Replace `location` and `story` with the real project names,
// towns and completion dates when the company confirms them — nothing here
// invents a client name, a date or a value.
export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    slug: "red-roof-colonnade-residence",
    title: "Colonnade residence, red long-span roof",
    category: "Roofing",
    location: "Bono East Region",
    summary:
      "A multi-gable red roof set over an arched colonnade frontage — one of the more decorative rooflines in the JILMEK portfolio.",
    story: [
      "This residence called for a roof that could follow a complex footprint without losing its lines. The arched colonnade across the front sets the tone for the whole building, so the roof had to sit over it cleanly rather than fight it.",
      "JILMEK supplied and installed the red long-span sheets, working the profile around each gable so the ridges stay straight and the valleys drain properly. The decorative gable details were set out on site.",
      "The building is shown here with the roof complete and finishing works still to follow.",
    ],
    services: ["Roofing sheet supply", "Roofing installation", "Trusses & woodworks"],
    photoSlugs: [
      "red-roof-colonnade-residence",
      "red-roof-multi-gable",
      "red-hip-roof-colonnade",
    ],
  },
  {
    slug: "blue-roof-installation",
    title: "Blue roof installation, single-storey residence",
    category: "Roofing",
    location: "Bono East Region",
    summary:
      "A full roofing installation captured mid-build — trusses set, sheets going down, columns already in place.",
    story: [
      "This project shows the part of the work most clients never see: the roofing crew on the structure, running sheets from the eaves up.",
      "The building is a single-storey block structure with a columned entrance. JILMEK set the timber trusses first, then installed the blue roofing sheets over them, working across the roof in sequence so the laps stay tight and the lines stay true.",
      "Photographs from this site are useful for clients who want to understand what the roofing stage actually involves before they commit to a build.",
    ],
    services: ["Roofing sheet supply", "Roofing installation", "Trusses & woodworks"],
    photoSlugs: [
      "blue-roof-installation",
      "roof-installation-in-progress",
      "blue-roof-rendered-home",
    ],
  },
  {
    slug: "timber-truss-frames",
    title: "Timber truss frames, block structures",
    category: "Construction",
    location: "Bono East Region",
    summary:
      "The carpentry stage across several block-built structures — full timber truss frames set out before any sheeting goes on.",
    story: [
      "Before a single roofing sheet is fixed, the truss frame has to be right. These photos show JILMEK's carpentry work across several block structures, with the full timber frame set out and braced.",
      "Each frame is built to suit the footprint underneath it — hips, valleys and ridges all set out on site rather than assumed. Getting this stage correct is what keeps a roof straight for the next twenty years.",
      "Clients building on their own land often ask to see this stage specifically, because it is where the shape of the finished roof is actually decided.",
    ],
    services: ["Trusses & woodworks", "General building", "Roofing installation"],
    photoSlugs: [
      "wide-truss-frame-build",
      "truss-frame-worker",
      "truss-frame-team-build",
      "timber-truss-single-storey",
    ],
  },
  {
    slug: "completed-residences",
    title: "Completed residences, finishing works",
    category: "Finishing",
    location: "Bono East Region",
    summary:
      "Buildings taken through to a finished state — rendered walls, painted elevations and roofs fully installed.",
    story: [
      "These are projects at the other end of the process: roof on, walls rendered and painted, the building ready to be lived in.",
      "JILMEK's finishing scope can cover POP ceilings, tiling, tinted glass and general finishing works alongside the roofing, which means one team can carry a project from block shell through to handover.",
      "The contrast between these photographs and the truss-frame set is the clearest picture of what the company actually does across a full build.",
    ],
    services: ["Finishing works", "POP ceiling works", "Tiling works", "Roofing installation"],
    photoSlugs: [
      "completed-grey-roof-home",
      "completed-blue-hip-roof-home",
      "grey-roof-portico-residence",
      "bright-red-roof-completed",
    ],
  },
  {
    slug: "two-storey-projects",
    title: "Two-storey builds & larger structures",
    category: "Construction",
    location: "Bono East Region",
    summary:
      "Larger-format projects — two-storey residences and a multi-unit structure, roofed and under construction.",
    story: [
      "Not every JILMEK project is a single-storey home. These photographs cover two-storey residences and a larger multi-unit structure, all at different stages of completion.",
      "Larger buildings change the roofing conversation: spans get longer, access gets harder and the truss design has to carry more. The roofs shown here were set out accordingly.",
      "If you are planning something at this scale, these are the projects worth talking through with the team first.",
    ],
    services: ["General building", "Roofing sheet supply", "Roofing installation"],
    photoSlugs: [
      "two-storey-green-roof-project",
      "two-storey-red-roof-shell",
      "two-storey-roadside-build",
      "two-storey-shell-plot",
    ],
  },
  {
    slug: "roof-profiles-colours",
    title: "Roof profiles & colour options in place",
    category: "Roofing",
    location: "Across JILMEK project sites",
    summary:
      "The same question comes up on every job: what will it actually look like? These are JILMEK roofs in red, blue, green, grey and brown, on real buildings.",
    story: [
      "Colour charts and sample sheets only tell you so much. This set exists so clients can see JILMEK roofing sheets on completed buildings, in daylight, at full size.",
      "Between them these photos cover red, maroon, blue, green, grey and brown roofs across hip, gable and multi-gable layouts.",
      "Bring a photo from this set to your consultation if one of them is close to what you have in mind — it makes the specification conversation much faster.",
    ],
    services: ["Roofing sheet supply", "Roofing installation"],
    photoSlugs: [
      "green-hip-roof-residence",
      "grey-hip-roof-residence",
      "long-span-brown-roofline",
      "red-roof-garage-doors",
      "brown-roof-block-walls",
      "maroon-roof-veranda-build",
    ],
  },
];

export const caseStudyBySlug = (slug: string) =>
  projectCaseStudies.find((p) => p.slug === slug);
