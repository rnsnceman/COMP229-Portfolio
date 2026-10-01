import {
  BrainCircuit,
  Code2,
  Headphones,
  LayoutTemplate,
  ServerCog,
  Wrench,
} from "lucide-react";
const services = [
  {
    icon: LayoutTemplate,
    title: "Web development",
    text: "Responsive websites built with React, HTML, CSS and JavaScript.",
  },
  {
    icon: Code2,
    title: "Frontend development",
    text: "Accessible, component-based interfaces that work cleanly across screen sizes.",
  },
  {
    icon: ServerCog,
    title: "API integration",
    text: "Connecting web applications to REST APIs, authentication, databases and cloud services.",
  },
  {
    icon: BrainCircuit,
    title: "AI-powered features",
    text: "Practical AI integrations designed around clear user needs and responsible workflows.",
  },
  {
    icon: Wrench,
    title: "Website maintenance",
    text: "Content updates, interface improvements, troubleshooting and deployment support.",
  },
  {
    icon: Headphones,
    title: "Technical support",
    text: "Patient, plain-language help with websites, domains, hosting and digital tools.",
  },
];
export default function Services() {
  return (
    <main className="page-shell page-content">
      <div className="page-heading">
        <p className="eyebrow">How I can help</p>
        <h1>Services</h1>
        <p>
          Practical development and technical support for thoughtful digital
          projects.
        </p>
      </div>
      <section className="service-grid">
        {services.map(({ icon: Icon, title, text }, index) => (
          <article className="service-card" key={title}>
            <div className="service-number">0{index + 1}</div>
            <Icon />
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
