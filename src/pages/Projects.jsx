import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "MiddleGround AI",
    url: "https://middleground-4vzj.vercel.app/",
    image: "/assets/middleground.png",
    year: "2024–2025",
    role: "Full-stack developer",
    description:
      "Built and deployed an AI-powered application that generates compromise suggestions for people navigating disagreements. I developed the React experience, authentication flow and server integration.",
  },
  {
    title: "Moonraker Studios",
    url: "http://moonrakerstudios.com",
    image: "/assets/moonraker.webp",
    year: "2024",
    role: "Designer & developer",
    description:
      "Developed a responsive recording-studio website. The finished site includes a custom audio player that helps visitors explore the studio’s work.",
  },
  {
    title: "World Ruby Foundation",
    url: "https://world-ruby.vercel.app/",
    image: "/assets/world-ruby.webp",
    year: "2024",
    role: "Web developer",
    description:
      "Customize front-end elements to support the organization’s brand and improve the visitor experience while coordinating technical integrations with external partners.",
  },
  {
    title: "Rai’s Recipes",
    url: "https://raisrecipes.com",
    image: "/assets/rais-recipes.webp",
    year: "2024",
    role: "Frontend developer",
    description:
      "Created a welcoming recipe interface that organizes food content into a clear, responsive browsing experience across desktop and mobile devices.",
  },
  {
    title: "Arlene Duncan",
    url: "https://arlene-duncan-site.vercel.app",
    image: "/assets/arlene-duncan.webp",
    year: "2024",
    role: "Web developer",
    description:
      "Produced a polished artist website that presents biography, media and performance information through an accessible, image-led layout.",
  },
  {
    title: "Rock Paper Scissors",
    url: "https://rnsnceman.github.io/rock-paper-scissors/",
    image: "/assets/rock-paper-scissors.webp",
    year: "2023",
    role: "JavaScript developer",
    description:
      "Built an interactive browser game with responsive controls, clear round feedback and reusable JavaScript game logic.",
  },
];
export default function Projects() {
  return (
    <main className="page-shell page-content">
      <div className="page-heading">
        <p className="eyebrow">Selected work</p>
        <h1>Projects</h1>
        <p>
          A collection of web applications and client-focused digital
          experiences.
        </p>
      </div>
      <section className="project-grid">
        {projects.map((project, index) => (
          <a
            className="project-card"
            key={project.title}
            href={project.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit ${project.title} website`}
          >
            <article>
              <div className="project-image">
                <img
                  src={project.image}
                  alt={`${project.title} website screenshot`}
                />
              </div>
              <div className="project-body">
                <div className="project-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.year}</span>
                </div>
                <h2>{project.title}</h2>
                <p className="project-role">{project.role}</p>
                <p>{project.description}</p>
                <span className="project-link">
                  Visit project <ExternalLink size={17} />
                </span>
              </div>
            </article>
          </a>
        ))}
      </section>
    </main>
  );
}
