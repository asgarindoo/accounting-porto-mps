import { usePortfolio } from '../context/PortfolioContext'

export function Footer() {
  const { profile, siteSettings } = usePortfolio()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <p className="footer__text">
        © {year} {profile.name}
      </p>
    </footer>
  )
}
