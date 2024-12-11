import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import React from "react";

interface IProps {
  className?: string;
  children: React.ReactNode;
}

const AccordionTrigger = React.forwardRef(
  (
    { children, className, ...props }: IProps,
    forwardedRef: React.ForwardedRef<HTMLButtonElement>,
  ) => (
    <Accordion.Header className={`flex text-heading-sm p-1 ${className}`}>
      <Accordion.Trigger
        className="group flex-1 items-center justify-between flex"
        ref={forwardedRef}
        {...props}
      >
        {children}
        <ChevronDownIcon
          className="group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
  ),
);

export default AccordionTrigger;
