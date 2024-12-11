import { Icon } from "../../../common/components/ui/Icon";
import * as Accordion from "@radix-ui/react-accordion";
import { ReactNode } from "react";

const ResultsAccordionTrigger = ({
  backgroundImagePath,
  children,
}: {
  backgroundImagePath: string;
  children: ReactNode;
}) => (
  <Accordion.Trigger className="w-full bg-basic-white flex flex-row rounded-2xl shadow-accordion group data-[state=open]:rounded-t-2xl data-[state=open]:rounded-b-none gro overflow-hidden">
    <div
      className="w-20 h-20 shrink-0 bg-no-repeat"
      style={{ backgroundImage: `url('${backgroundImagePath}')` }}
    />
    <p className="title-md text-grey-80 py-4 mr-2 text-left grow">{children}</p>
    <div className="mr-4 py-4">
      <Icon type="ChevronDown" className="group-data-[state=open]:rotate-180" />
    </div>
  </Accordion.Trigger>
);

export default ResultsAccordionTrigger;
