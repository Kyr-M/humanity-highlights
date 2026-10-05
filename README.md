# 📰 The Humanity Highlights

> **"All the Uplifting News That Inspires the World"**  
> An autonomous, vintage-inspired digital broadsheet web application that curates, processes, and archives positive global news daily.
> ### 🌐 **[View Live Application →](https://humanity-highlights.vercel.app/)**

[![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Custom_Palette-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Autonomous_Cron-000000?style=flat-square&logo=vercel)](https://vercel.com/)

---

## 🌟 Introduction

**The Humanity Highlights** merges 19th-century print journalism aesthetics with modern serverless web architecture. Designed as an antidote to modern media negativity, the platform autonomously aggregates, summarizes, and archives uplifting global stories, presenting them through a meticulously styled vintage broadsheet layout.

---

## ✨ Key Features

* **Authentic Broadsheet Aesthetics:** Custom-tailored typography, 19th-century paper color palettes (`#f2efe9`), drop-cap multi-column article layouts, and framing designed to replicate a physical broadsheet gazette.
* **10-Story Multi-Source Wire Index:** An interactive left-hand index allowing readers to browse dispatches across diverse global sources seamlessly.
* **Autonomous Daily Pipeline:** Integrates Vercel Cron jobs with a secure backend API route to ingest, parse, and persist fresh news content nightly without manual intervention.
* **Persistent PostgreSQL Archiving:** Utilizes Supabase to store dispatches, ensuring lightning-fast client-side page loads and circumventing external API rate limits.
* **Interactive Polish:** Dynamic daily philosophical notes, photographic archive frames, and responsive mobile-to-desktop grid adaptation.

---

## 🛠️ Architecture & Tech Stack

* **Frontend:** Next.js (App Router, React Client/Server components) for high performance and optimal SEO.
* **Styling & UI:** Tailwind CSS for custom styling, responsive multi-column text formatting, and vintage visual transitions.
* **Database:** Supabase (PostgreSQL) for secure, structured data storage of daily editions.
* **Automation & Hosting:** Deployed on Vercel with scheduled cron events driving backend ingestion.

---

## 🚀 Quick Start (Local Development)

If you wish to run or evaluate the project locally:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Kyr-M/humanity-highlights.git](https://github.com/Kyr-M/humanity-highlights.git)
   cd humanity-highlights
