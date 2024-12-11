import CountryAndLanguageSelectionDialog from "../../../../features/location/CountryAndLanguageSelectionDialog";
import { HeaderHamburgerMenu } from "./HeaderHamburgerMenu";
import useNavigationLinks from "./hooks/useNavigationLinks";

const HeaderMenu = () => {
  const { hamburgerLinks, headerLinks, desktopHamburgerLinks } =
    useNavigationLinks();

  return (
    <>
      <ul className="hidden bg-transparent lg:flex flex-row pr-8 gap-8">
        {headerLinks.map((link) => {
          const RendererComponent = link.renderer;

          return (
            <li key={link.to} className="w-full md:w-auto">
              <RendererComponent
                enabled={link.enabled}
                to={link.to}
                linkText={link.linkText}
              />
            </li>
          );
        })}
        <li>
          <CountryAndLanguageSelectionDialog />
        </li>
      </ul>
      <HeaderHamburgerMenu
        desktopHamburgerLinks={desktopHamburgerLinks}
        hamburgerLinks={hamburgerLinks}
      />
    </>
  );
};

export default HeaderMenu;
