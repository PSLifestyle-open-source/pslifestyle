import { FullWidthContainer } from "../../layout/Container";
import { BackButton } from "./index";
import * as React from "react";
import { HTMLAttributes } from "react";

const BackButtonInContainer = (props: HTMLAttributes<HTMLButtonElement>) => (
  <FullWidthContainer className="items-start mt-4 mb-10">
    <BackButton {...props} />
  </FullWidthContainer>
);

export default BackButtonInContainer;
