import { WideWidthContainer } from "../../layout/Container";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

interface IProps {
  role: string;
  children: ReactNode;
}

const WindowDialogPortal = ({ role, children }: IProps): JSX.Element => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed z-10 top-0 left-0 bottom-0 right-0 bg-neutral-60/80" />
    <Dialog.Content
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        if (event.target) {
          (event.target as HTMLDivElement).focus();
        }
      }}
      role={role}
      className="p-2 fixed z-[100] top-0 left-0 bottom-0 right-0 flex items-center"
    >
      <WideWidthContainer className="overflow-hidden h-full short:h-full sm:h-auto rounded-2xl shadow-md bg-neutral-white">
        {children}
      </WideWidthContainer>
    </Dialog.Content>
  </Dialog.Portal>
);

export default WindowDialogPortal;
