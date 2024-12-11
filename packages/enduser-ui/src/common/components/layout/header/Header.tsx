import { FullWidthContainer } from "../Container";
import Logo from "./Logo";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  children?: ReactNode;
}

export const Header = ({ children }: HeaderProps) => (
  <nav className="w-full bg-neutral-white border-b border-transparent-black !title-sm">
    <FullWidthContainer>
      <div className="flex flex-col">
        <div className="flex h-12 justify-between items-center w-full">
          <Link to="/" className="inline-flex ml-[17px] items-center mr-auto">
            <Logo />
          </Link>
          {children}
        </div>
      </div>
    </FullWidthContainer>
  </nav>
);
