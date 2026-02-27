// src/components/InnerPageBuilder.jsx
import dynamic from "next/dynamic";

// Inner page sections (create these files as you build each section)
const InnerHeroSection = dynamic(() => import("./sections/inner/InnerHeroSection"));
const ContentBlock = dynamic(() => import("./sections/inner/ContentBlock"));
const TwoColumnContentSection = dynamic(() => import("./sections/inner/TwoColumnContentSection"));
const ContactSection = dynamic(() => import("./sections/inner/ContactSection"));
const SpecialHeadingWithCta = dynamic(() => import("./sections/inner/SpecialHeadingWithCta"));
const ThreeColStructure = dynamic(() => import("./sections/inner/ThreeColStructure"));
const TwoColStructure = dynamic(() => import("./sections/inner/TwoColStructure"));
const UspSection = dynamic(() => import("./sections/inner/UspSection"));
const AccordionSection = dynamic(() => import("./sections/inner/AccordionSection"));
const TabsSection = dynamic(() => import("./sections/inner/TabsSection"));

export default function InnerPageBuilder({ sections }) {
    if (!sections || !sections.length) return null;

  return (
    <>
      {sections.map((block, index) => {
        switch (block.acf_fc_layout) {
          case "inner_hero_section":
            return <InnerHeroSection key={index} data={block} />;

          case "content_block":
            return <ContentBlock key={index} data={block} />;

          case "two_column_content_section":
            return <TwoColumnContentSection key={index} data={block} />;

          case "contact_section":
            return <ContactSection key={index} data={block} />;

          case "special_heading_with_cta":
            return <SpecialHeadingWithCta key={index} data={block} />;

          case "three_col_structure":
            return <ThreeColStructure key={index} data={block} />;

          case "two_col_structure":
            return <TwoColStructure key={index} data={block} />;

          case "usp_section":
            return <UspSection key={index} data={block} />;

          case "accordian":
            return <AccordionSection key={index} data={block} />;

          case "tabs":
            return <TabsSection key={index} {...block} />;
          // Add later when ready
          // case "feature_grid_section":
          //   return <FeatureGridSection key={index} data={block} />;
          // case "stats_section":
          //   return <StatsSection key={index} data={block} />;
          // case "process_section":
          //   return <ProcessSection key={index} data={block} />;
          // case "faq_section":
          //   return <FaqSection key={index} data={block} />;
          // case "cta_section":
          //   return <CtaSection key={index} data={block} />;

          default:
            return null;
        }
      })}
    </>
  );
}
