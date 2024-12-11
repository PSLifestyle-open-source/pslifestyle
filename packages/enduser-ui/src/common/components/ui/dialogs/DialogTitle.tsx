import Heading from "../Heading";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  cyData?: string;
  className?: string;
}

const DialogTitle = ({ children, className, cyData }: IProps): JSX.Element => (
  <Dialog.Title data-cy={cyData} className={`${className || ""}`} asChild>
    <Heading level={2} type="headline-md-b">
      {children}
    </Heading>
  </Dialog.Title>
);

export default DialogTitle;
