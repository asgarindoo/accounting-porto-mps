import {
  FileSpreadsheet,
  Calculator,
  BarChart2,
  TrendingUp,
  Search,
  PieChart,
  Trophy,
  Award,
  BookOpen,
  Languages,
  Download,
  ArrowUpRight,
  Mail,
  Linkedin,
  Github,
  MapPin,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Code,
  Users,
  MessageCircle,
} from 'lucide-react'

const iconMap = {
  FileSpreadsheet,
  Calculator,
  BarChart2,
  TrendingUp,
  Search,
  PieChart,
  Trophy,
  Award,
  BookOpen,
  Languages,
  Download,
  ArrowUpRight,
  Mail,
  Linkedin,
  Github,
  MapPin,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Code,
  Users,
  MessageCircle,
}

/**
 * Icon — resolves an icon name string to the matching Lucide component.
 * Falls back gracefully if the icon name is unknown.
 */
export function Icon({ name, size = 16, className = '', ...rest }) {
  const Component = iconMap[name]
  if (!Component) return null
  return <Component size={size} className={className} aria-hidden="true" {...rest} />
}
