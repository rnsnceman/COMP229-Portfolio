import { Download, MapPin } from "lucide-react";
export default function About() {
  return (
    <main className="page-shell page-content">
      <div className="page-heading">
        <p className="eyebrow">The person behind the code</p>
        <h1>About me</h1>
      </div>
      <section className="about-grid">
        <div className="about-photo">
          <img src="/assets/yuri-koller.png" alt="Portrait of Yuri Koller" />
        </div>
        <div className="about-copy">
          <h2>Hi, I’m Yuri Koller.</h2>
          <p>
            I’m a second-year Software Engineering – Artificial Intelligence
            student at Centennial College and a web developer based in Toronto.
            I build responsive applications using React, JavaScript, TypeScript,
            Firebase and modern web APIs.
          </p>
          <p>
            My background in audio engineering taught me to listen closely,
            solve problems under pressure and care about the details people
            notice. Today, I bring that same mindset to software: understand the
            user, make deliberate choices and refine the result until it feels
            clear and dependable.
          </p>
          <p>
            I’m continuing to strengthen my skills in C#, Python, databases,
            software requirements and AI while creating practical projects that
            connect technical learning with real needs.
          </p>
          <p className="location">
            <MapPin size={18} /> Toronto, Ontario
          </p>
          <a
            href="/assets/yuri-koller-resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="button primary"
          >
            View résumé (PDF) <Download size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}
