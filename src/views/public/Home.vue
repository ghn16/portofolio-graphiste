<script setup>
import Navbar from '@/components/public/Navbar.vue'
import HeroSection from '@/components/public/HeroSection.vue'
import ProjectsSection from '@/components/public/ProjectsSection.vue'
import AboutSection from '@/components/public/AboutSection.vue'
import SkillsBanner from '@/components/public/SkillsBanner.vue'
import ContactSection from '@/components/public/ContactSection.vue'
import FooterSection from '@/components/public/FooterSection.vue'
</script>

<template>
  <div class="bg-brand-purple-dark text-white font-sans selection:bg-brand-yellow selection:text-brand-purple-dark">
    <Navbar />
    <HeroSection />
    <ProjectsSection />
    <AboutSection />
    <SkillsBanner />
    <ContactSection />
    <FooterSection />
  </div>
</template>