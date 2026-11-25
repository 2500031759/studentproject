import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link className="brand" to="/"><span className="brand-mark"><span>AE</span></span><span className="brand-word">ARENA <b>ELITE</b></span></Link>
        <span>Compete with honor. Rise above.</span>
        <span>© {new Date().getFullYear()} Elite Arena</span>
      </div>
    </footer>
  );
}
