import { title } from "@/components/primitives";
import React from "react";
import DefaultLayout from "@/layouts/default";
import { Accordion, AccordionItem } from "@heroui/accordion";

export default function FAQPage() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set());

  return (
    <DefaultLayout>
      <section className="flex flex-col items-start justify-start gap-4 py-8 md:py-10 px-4 md:px-8">
        <h1 className={`${title()} text-left`}>Frequently Asked Questions</h1>

        {/* Accordion stretching across the page */}
        <div className="w-full max-w-4xl px-4">
          <Accordion
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) => setSelectedKeys(new Set(keys as unknown as string[]))}
          >
            <AccordionItem
              key="1"
              aria-label="Accordion 1"
              title={<span className="font-bold text-lg">Will there be transportation from the Hotel to the Venue?</span>}
            >
              <p className="text-gray-700">Yes - there will be shuttles provided! See travel page for more information.</p>
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="Accordion 2"
              title={<span className="font-bold text-lg">What is the dress code?</span>}
            >
              <p className="text-gray-700">The dress code is formal attire. Please see the details on the invitation for more information.</p>
            </AccordionItem>
            <AccordionItem
              key="3"
              aria-label="Accordion 3"
              title={<span className="font-bold text-lg">Are kids allowed at the wedding?</span>}
            >
              <p className="text-gray-700">While we love your little ones, this will be an adults-only celebration.</p>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </DefaultLayout>
  );
}
