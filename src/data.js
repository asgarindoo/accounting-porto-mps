/**
 * ============================================================
 *  DATA FILE — ubah semua konten portfolio di sini
 *  Tidak perlu database. Cukup edit objek di bawah ini.
 * ============================================================
 */

export const profile = {
  initials: "MPS",
  name: "Muhammad Panggih Saputra",
  tagline: "Accounting & Tax | Data Analyst",
  headline: [
    "Bridging ",
    { highlight: "accounting precision" },
    " with data-driven insights.",
  ],
  bio: [
    "I am an Accounting student at the State University of Surabaya with a strong passion for accounting, finance, and data analysis. I actively combine my academic background with practical experience in tax reconciliation, financial administration, and data processing.",
    "My goal is to contribute to the professional accounting field by transforming complex financial and operational data into clear, actionable insights for businesses.",
  ],
  careerObjective:
    "Eager to contribute to the professional accounting and finance field while continuously developing competencies in data analysis, taxation, and financial reporting.",
  stats: [
    { value: "3.77", label: "Cumulative GPA" },
    { value: "4+", label: "Professional Experiences" },
    { value: "3", label: "Certifications" },
  ],
  // Foto profil
  portrait: "/foto_gelap.png",
  cvUrl: "#resume",
  floatingBadges: [
    { icon: "Calculator", text: "Taxation & Coretax" },
    { icon: "BarChart2", text: "Data Analysis" },
    { icon: "FileSpreadsheet", text: "Financial Administration" },
    { icon: "Code", text: "Python Automation" },
  ],
};

export const education = [
  {
    degree: "Bachelor of Accounting",
    institution: "Universitas Negeri Surabaya",
    period: "Sep 2022 — 2026",
    detail: "GPA 3.77 / 4.00",
  },
  {
    degree: "Data Analyst and Business Intelligence",
    institution: "PT Mitra Talenta Group (Celerates)",
    period: "Sep 2024 — Dec 2024",
    detail: "Remote",
  },
];

export const softSkills = [
  "Effective Communication",
  "Problem-Solving",
  "Teamwork",
  "Creativity & Adaptability",
  "Attention to Detail",
  "Time Management",
  "Public Speaking",
];

export const experience = [
  {
    type: "Internship",
    role: "Tax Intern",
    company: "PT Borwita Citra Prima",
    period: "Dec 2025 — Present",
    description:
      "Performed VAT reconciliation, processed Output VAT returns via Coretax, and automated recapitulation using Python. Processed and recorded invoices into the internal system.",
    align: "left",
  },
  {
    type: "Internship",
    role: "Frontliner",
    company: "PT (Persero) PLN ULP Caruban",
    period: "Mar 2025 — Jun 2025",
    description:
      "Provided customer service and education on OHS regulations. Processed customer files, updated data, managed invoices and bills, and checked petty cash.",
    align: "right",
  },
  {
    type: "Fulltime",
    role: "Sales Promotor",
    company: "PT Huawei Tech Investment",
    period: "Jul 2024 — Dec 2024",
    description:
      "Managed Huawei's social media platforms for the Madiun region. Attracted 10-20 new customers monthly and conducted live streaming, content creation, and daily customer follow-ups.",
    align: "left",
  },
  {
    type: "Internship",
    role: "Finance & Receptionist Intern",
    company: "Dinas Pendidikan Kota Madiun",
    period: "Mar 2020 — Aug 2020",
    description:
      "Analyzed financial reports and monthly transaction records. Provided administrative support and welcomed guests with accurate information.",
    align: "right",
  },
  {
    type: "Organization",
    role: "Staff Research Human and Development",
    company: "Capital Market Community",
    period: "Jan 2022 — Jan 2024",
    description:
      "Managed and analyzed stock comparison reports for community content. Prepared materials for investment competitions and served as a speaker in investment classes.",
    align: "left",
  },
];

export const projects = [
  {
    title: "VAT Reconciliation Automation",
    description:
      "Developed a Python script to automate the recapitulation and reconciliation of Output VAT returns, reducing manual data entry errors and saving processing time.",
    tags: ["Python", "Excel", "Taxation"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1024&auto=format&fit=crop",
    featured: true,
  },
  {
    title: "Stock Market Analysis Report",
    description:
      "Comprehensive stock comparison and financial analysis created for the Capital Market Community to educate members on investment strategies.",
    tags: ["Financial Analysis", "Research"],
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1024&auto=format&fit=crop",
    featured: false,
  },
  {
    title: "Social Media Marketing Analytics",
    description:
      "Tracked and analyzed engagement metrics across multiple platforms to optimize marketing strategies, resulting in consistent monthly customer acquisition.",
    tags: ["Data Analysis", "Marketing"],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1024&auto=format&fit=crop",
    featured: false,
  },
];

export const achievements = [
  {
    icon: "Trophy",
    title: "3rd Place Sustainable Business Pitch",
    subtitle: "2023 · Bisnis Digital UNESA",
    description: "Awarded 3rd place in the national sustainable business pitch competition.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1024&auto=format&fit=crop",
  },
  {
    icon: "Award",
    title: "3rd Place International Enterpreneur View",
    subtitle: "2023 · BEM FEB UNESA",
    description: "Recognized as an international awardee in entrepreneurship.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1024&auto=format&fit=crop",
  },
  {
    icon: "Code",
    title: "Fundamental Python Certification",
    subtitle: "Coding Studio",
    description: "Certified proficiency in fundamental Python programming for data processing.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1024&auto=format&fit=crop",
  },
  {
    icon: "FileSpreadsheet",
    title: "Fundamental Excel Certification",
    subtitle: "Coding Studio",
    description: "Certified in essential Microsoft Excel functionalities for data analysis.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1024&auto=format&fit=crop",
  },
  {
    icon: "BookOpen",
    title: "Brevet A&B Certification",
    subtitle: "IAI Jawa Timur · Expected Dec 2026",
    description: "Currently pursuing comprehensive taxation certification.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1024&auto=format&fit=crop",
  },
];

export const skills = [
  {
    icon: "Calculator",
    title: "Taxation & Coretax",
    subtitle: "VAT Reconciliation & Returns",
    featured: true,
  },
  {
    icon: "BarChart2",
    title: "Data Analysis",
    subtitle: "Python & Excel",
    featured: false,
  },
  {
    icon: "FileSpreadsheet",
    title: "Administration",
    subtitle: "Financial & General",
    featured: false,
  },
  {
    icon: "Users",
    title: "Social Media Management",
    subtitle: "Content Creation & Marketing",
    featured: false,
  },
];

export const resumeSections = [
  {
    label: "Download Full Resume",
    description: "Get a comprehensive overview of my academic background, professional experiences, and technical skills in a single, well-structured document.",
    // File PDF sudah ada di /public/
    file: "/MUHAMMAD PANGGIH SAPUTRA_CV.pdf",
  },
];

export const contact = {
  email: "muhammadpanggihsaputra@gmail.com",
  whatsapp: "https://wa.me/6285230663129",
  linkedin: "https://linkedin.com/in/muhammad-panggih-saputra-373a75216/",
  location: "Surabaya, Indonesia",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];
