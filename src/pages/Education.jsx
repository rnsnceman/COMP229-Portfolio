import { Award, BookOpen, GraduationCap } from "lucide-react";
export default function Education() {
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "C#",
    "Python",
    "Node.js",
    "REST APIs",
    "HTML",
    "CSS",
    "Firebase",
    "Supabase",
    "SQL",
    "Git & GitHub",
    "Vercel",
  ];
  return (
    <main className="page-shell page-content">
      <div className="page-heading">
        <p className="eyebrow">Learning & qualifications</p>
        <h1>Education</h1>
      </div>
      <section className="education-feature">
        <div className="education-icon">
          <GraduationCap />
        </div>
        <div>
          <p className="education-date">Expected April 2028</p>
          <h2>Software Engineering – Artificial Intelligence</h2>
          <p className="school">Centennial College · Toronto, Ontario</p>
          <p>Second-year student · GPA 4.34</p>
          <p className="coursework">
            <strong>Relevant studies:</strong> C# Programming, Python
            Programming, JavaScript Programming, SQL and Software Requirements.
          </p>
        </div>
      </section>
      <section className="qualification-grid">
        <article>
          <Award />
          <div>
            <p className="education-date">Professional Certificate</p>
            <h3>Meta Front-End Developer Specialization</h3>
          </div>
        </article>
        <article>
          <BookOpen />
          <div>
            <p className="education-date">Career Path</p>
            <h3>Codecademy Front-End Engineer</h3>
          </div>
        </article>
        <article>
          <Award />
          <div>
            <p className="education-date">Professional Certificate</p>
            <h3>Google AI Essentials</h3>
          </div>
        </article>
      </section>
      <section className="skills-panel">
        <h2>Technical toolkit</h2>
        <div className="skill-list">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
