import * as Accordion from "@radix-ui/react-accordion";
import { ReactNode } from "react";

const ResultsAccordionContent = ({ children }: { children: ReactNode }) => (
  <Accordion.Content className="w-full px-4 pb-4 bg-basic-white shadow-accordion rounded-b-2xl">
    <div className="border-t border-grey-10">
      <div className="mt-4">{children}</div>
    </div>
  </Accordion.Content>
);

export default ResultsAccordionContent;
