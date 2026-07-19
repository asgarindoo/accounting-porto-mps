# Accounting Portfolio — React Clone

Website portfolio akuntan fresh graduate, clone dari [accounting-p.lovable.app](https://accounting-p.lovable.app/).

## Struktur Project

```
src/
├── data.js              ← 📝 UBAH DATA DI SINI
├── App.jsx              ← Root component
├── main.jsx             ← Entry point
├── index.css            ← Design system & global styles
├── hooks/
│   └── useScrollReveal.js
└── components/
    ├── Icon.jsx
    ├── Navbar.jsx
    ├── HeroSection.jsx
    ├── AboutSection.jsx
    ├── ExperienceSection.jsx
    ├── ProjectsSection.jsx
    ├── AchievementsSection.jsx
    ├── SkillsSection.jsx
    ├── ResumeAndContact.jsx
    └── Footer.jsx
```

## Cara Mengubah Data

Semua konten portfolio ada di **`src/data.js`**. Edit file ini saja:

| Export       | Isi                                        |
|--------------|--------------------------------------------|
| `profile`    | Nama, tagline, bio, stats, badge skills    |
| `education`  | Daftar pendidikan                          |
| `softSkills` | Tag soft skills                            |
| `experience` | Timeline pengalaman kerja/organisasi       |
| `projects`   | Studi kasus / proyek                       |
| `achievements` | Penghargaan & sertifikasi                |
| `skills`     | Skill cards (bento grid)                   |
| `resumeSections` | Link download CV                       |
| `contact`    | Email, LinkedIn, GitHub, lokasi            |
| `navLinks`   | Menu navigasi                              |

## Menambah Foto

1. Letakkan foto di folder `/public/`:
   - `portrait.jpg` — foto profil di hero section
   - `project-1.jpg` sampai `project-5.jpg` — gambar proyek
   - `Ardyan-Pratama-CV.pdf` — file CV untuk di-download

2. Ubah path di `data.js` jika nama file berbeda.

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

## Build Production

```bash
npm run build
```
