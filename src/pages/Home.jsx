import { ArrowRight, Code2, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Home() {
  const messageSent =
    new URLSearchParams(useLocation().search).get("message") === "sent";
  return (
    <main>
      {messageSent && (
        <div className="success-banner" role="status">
          Thanks! Your message was captured successfully.
        </div>
      )}
      <section className="hero page-shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <Sparkles size={16} /> Software Engineering · Artificial
            Intelligence
          </p>
          <h1>Building useful digital experiences with code and curiosity.</h1>
          <p className="hero-lead">
            I’m Yuri Koller, a Toronto-based software engineering student and
            web developer focused on responsive, thoughtful applications.
          </p>
          <div className="hero-actions">
            <Link to="/projects" className="button primary">
              View my work <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="button secondary">
              About me
            </Link>
          </div>
          <p className="mission">
            <strong>My mission:</strong> to turn complex ideas into accessible,
            dependable software that helps people accomplish something
            meaningful.
          </p>
        </div>
        <div className="portrait-frame">
          <div className="portrait-accent">
            <Code2 />
          </div>
          <img src="/assets/yuri-koller.png" alt="Yuri Koller" />
        </div>
      </section>
      <section className="home-strip">
        <div>
          <strong>6+</strong>
          <span>Featured projects</span>
        </div>
        <div>
          <strong>4.34</strong>
          <span>College GPA</span>
        </div>
        <div>
          <strong>React</strong>
          <span>Primary library</span>
        </div>
      </section>
    </main>
  );
}
