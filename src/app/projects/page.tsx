"use client";
import { motion } from "framer-motion";
import { ProjectCard, SectionTitle } from "@/components/Cards";
import { projectsData } from "@/data";

export default function Projects() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-[90%] max-w-6xl mx-auto mt-24 md:mt-28 px-4 pb-48 relative z-10"
    >
      <SectionTitle label="Projects" title="项目作品" desc="将创意变为现实的精选项目集" />
      <div className="grid gap-4 md:grid-cols-2">
        {projectsData.map((p, i) => <ProjectCard key={p.name} {...p} index={i} />)}
      </div>
    </motion.div>
  );
}
