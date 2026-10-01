import { CodeXml, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Contact() {
  const navigate = useNavigate();
  function handleSubmit(event) {
    event.preventDefault();
    const formData = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );
    sessionStorage.setItem(
      "portfolioContactSubmission",
      JSON.stringify(formData),
    );
    navigate("/?message=sent");
  }
  return (
    <main className="page-shell page-content">
      <div className="page-heading">
        <p className="eyebrow">Start a conversation</p>
        <h1>Contact me</h1>
        <p>Have a project, opportunity or question? Send me a message.</p>
      </div>
      <section className="contact-grid">
        <aside className="contact-panel">
          <h2>Contact information</h2>
          <p>
            I’m open to software development opportunities, collaborations and
            projects.
          </p>
          <ul>
            <li>
              <Mail />
              <a href="mailto:yurikoller@gmail.com">yurikoller@gmail.com</a>
            </li>
            <li>
              <MapPin />
              <span>Toronto, Ontario</span>
            </li>
            <li>
              <ExternalLink />
              <a
                href="https://linkedin.com/in/yuri-koller-24a45288/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <CodeXml />
              <a
                href="https://github.com/rnsnceman"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </aside>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              First name
              <input name="firstName" required />
            </label>
            <label>
              Last name
              <input name="lastName" required />
            </label>
          </div>
          <div className="form-row">
            <label>
              Email address
              <input name="email" type="email" required />
            </label>
            <label>
              Contact number
              <input name="phone" type="tel" required />
            </label>
          </div>
          <label>
            Message
            <textarea name="message" rows="6" required />
          </label>
          <button className="button primary" type="submit">
            Send message
          </button>
        </form>
      </section>
    </main>
  );
}
