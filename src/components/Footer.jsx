import { profile } from '../data'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <p className="footer__text">
        © {year} {profile.name}. Built with React & Vite.
      </p>
    </footer>
  )
}
