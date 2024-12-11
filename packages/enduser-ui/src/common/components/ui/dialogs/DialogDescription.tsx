import Paragraph from "../Paragraph";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  cyData?: string;
  className?: string;
}

const DialogDescription = ({
  children,
  className,
  cyData,
}: IProps): JSX.Element => (
  <Dialog.Description
    data-cy={cyData}
    className={`text-left mt-1 text-body-lg ${className || ""}`}
    asChild
  >
    <Paragraph type="body-lg">{children}</Paragraph>
  </Dialog.Description>
);

export default DialogDescription;
