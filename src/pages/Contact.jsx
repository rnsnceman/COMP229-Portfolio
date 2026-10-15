import React from "react";
import { CodeXml, ExternalLink, Mail, MapPin } from "lucide-react";
export default function Contact() {
  const [status, setStatus] = React.useState({ type: "", message: "" });
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ type: "info", message: "Sending your message…" });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname: data.firstName, lastname: data.lastName, email: data.email, phone: data.phone, message: data.message }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to send your message.");
      form.reset();
      setStatus({ type: "success", message: "Thanks — your message has been received." });
    } catch (error) {
      setStatus({ type: "error", message: `${error.message} Make sure the API server is running.` });
    }
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
          {status.message && <p role="status" aria-live="polite" className={`form-status ${status.type}`}>{status.message}</p>}
        </form>
      </section>
    </main>
  );
}
