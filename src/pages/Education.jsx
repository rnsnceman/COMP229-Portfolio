import ResourceList from '../components/ResourceList';
export default function Education() {
  const skills = ['JavaScript', 'TypeScript', 'React', 'C#', 'Python', 'Node.js', 'REST APIs', 'HTML', 'CSS', 'MongoDB', 'Firebase', 'Supabase', 'SQL', 'Git & GitHub'];
  return <main className="page-shell page-content"><div className="page-heading"><p className="eyebrow">Learning & qualifications</p><h1>Education</h1></div><ResourceList resource="qualifications" /><section className="skills-panel"><h2>Technical toolkit</h2><div className="skill-list">{skills.map(skill => <span key={skill}>{skill}</span>)}</div></section></main>;
}
