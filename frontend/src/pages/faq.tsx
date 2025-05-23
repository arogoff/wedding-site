import { title } from "@/components/primitives";
import React from "react";
import DefaultLayout from "@/layouts/default";
import { Accordion, AccordionItem } from "@heroui/accordion";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// FAQ data
const faqData: FAQItem[] = [
  {
    id: "1",
    question: "Will there be transportation from the Hotel to the Venue?",
    answer:
      "Yes - there will be shuttles provided! See travel page for more information.",
  },
  {
    id: "2",
    question: "What is the dress code?",
    answer:
      "The dress code is formal attire. Please see the details on the invitation for more information.",
  },
  {
    id: "3",
    question: "Are kids allowed at the wedding?",
    answer:
      "While we love your little ones, this will be an adults-only celebration.",
  },
];

export default function FAQPage() {
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set()
  );

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-start gap-6 py-8 md:py-10 px-4 md:px-6 w-full max-w-7xl mx-auto">
        <div className="w-full text-center mb-6">
          <h1 className={`${title()} relative inline-block`}>
            <span
              className="relative z-10"
              style={{
                fontFamily: "'Pinyon Script', 'Dancing Script', cursive",
              }}
            >
              Frequently Asked Questions
            </span>
            <span className="absolute -bottom-2 left-0 w-full h-3 bg-rose-200 -z-10 transform -rotate-1"></span>
          </h1>
        </div>

        <div className="w-full max-w-4xl px-4">
          <Accordion
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) =>
              setSelectedKeys(new Set(keys as unknown as string[]))
            }
          >
            {faqData.map((item) => (
              <AccordionItem
                key={item.id}
                aria-label={`FAQ ${item.id}`}
                title={
                  <span className="font-bold text-lg">{item.question}</span>
                }
              >
                <p className="text-gray-700">{item.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </DefaultLayout>
  );
}
