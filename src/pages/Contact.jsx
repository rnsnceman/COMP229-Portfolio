import React from "react";
import { api } from "../lib/api";
import { CodeXml, ExternalLink, Mail, MapPin } from "lucide-react";
export default function Contact() {
  const [status, setStatus] = React.useState({ type: "", message: "" });
  const empty = { firstName: "", lastName: "", email: "", phone: "", message: "" };
  const [values, setValues] = React.useState(empty);
  const [busy, setBusy] = React.useState(false);
  const change = event => setValues({ ...values, [event.target.name]: event.target.value });
  async function handleSubmit(event) {
    event.preventDefault();
    const data = values;
    setBusy(true);
    setStatus({ type: "info", message: "Sending your message…" });
    try {
      await api('/contacts', { method: 'POST', body: JSON.stringify({ firstname: data.firstName, lastname: data.lastName, email: data.email, phone: data.phone, message: data.message }) });
      setValues(empty);
      setStatus({ type: "success", message: "Thanks — your message has been received." });
    } catch (error) {
      setStatus({ type: "error", message: `${error.message} Make sure the API server is running.` });
    } finally { setBusy(false); }
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
              <input name="firstName" value={values.firstName} onChange={change} required />
            </label>
            <label>
              Last name
              <input name="lastName" value={values.lastName} onChange={change} required />
            </label>
          </div>
          <div className="form-row">
            <label>
              Email address
              <input name="email" value={values.email} onChange={change} type="email" required />
            </label>
            <label>
              Contact number
              <input name="phone" value={values.phone} onChange={change} type="tel" required />
            </label>
          </div>
          <label>
            Message
            <textarea name="message" value={values.message} onChange={change} rows="6" required />
          </label>
          <button className="button primary" type="submit" disabled={busy}>
            {busy ? "Sending…" : "Send message"}
          </button>
          {status.message && <p role="status" aria-live="polite" className={`form-status ${status.type}`}>{status.message}</p>}
        </form>
      </section>
    </main>
  );
}
