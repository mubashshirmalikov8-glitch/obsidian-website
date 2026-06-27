import { Hero } from "@/components/sections/Hero";
import { TeamSection } from "@/components/sections/TeamSection";
import { Services } from "@/components/sections/Services";
import { Results } from "@/components/sections/Results";
import { Questionnaire } from "@/components/sections/Questionnaire";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TeamSection />
      <Services />
      <Results />
      <Questionnaire />
      <FinalCta />
    </>
  );
}
