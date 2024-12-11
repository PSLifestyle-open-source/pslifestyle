import CountryAndLanguageSelectionDialog from "../../../../features/location/CountryAndLanguageSelectionDialog";
import { Icon } from "../../ui/Icon";
import {
  useOnArrowUp,
  useOnArrowDown,
  useOnEscape,
  useOnSpacebar,
  useOnTab,
} from "./hooks";
import { HeaderLink } from "./hooks/useNavigationLinks";
import { useState, useEffect } from "react";
import { Trans } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

interface Props {
  hamburgerLinks: HeaderLink[];
  desktopHamburgerLinks: HeaderLink[];
}

export const HeaderHamburgerMenu = ({
  hamburgerLinks,
  desktopHamburgerLinks,
}: Props) => {
  const { ref, inView: isHamburgerMenuInView } = useInView();
  const [isHamburgerExpanded, setIsHamburgerExpanded] = useState(false);
  const closeHamburgerMenu = () => setIsHamburgerExpanded(false);
  const openHamburgerMenu = () => setIsHamburgerExpanded(true);
  const [activeMenuItem, setActiveMenuItem] = useState<
    HTMLAnchorElement | undefined
  >(undefined);
  const allMenuItems =
    document.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]');
  const numberOfMenuItems = Array.from(allMenuItems)?.length;

  const getCurrentMenuItemIndex = () => {
    if (activeMenuItem) {
      return Array.from(allMenuItems).indexOf(activeMenuItem);
    }
    return 0;
  };

  const handleArrowUp = () => {
    //  If all ready at the top, set bottom item as activeMenuItem, else move up
    if (!activeMenuItem) {
      setActiveMenuItem(allMenuItems[0]);
      return;
    }
    const currentMenuItemIndex = getCurrentMenuItemIndex();
    const isAbleToMoveUp = currentMenuItemIndex - 1 > -1;
    if (isAbleToMoveUp) {
      setActiveMenuItem(allMenuItems[currentMenuItemIndex - 1]);
      return;
    }
    if (!isAbleToMoveUp) {
      setActiveMenuItem(allMenuItems[numberOfMenuItems - 1]);
    }
  };

  const handleArrowDown = () => {
    //  If all ready at the bottom, set top item as activeMenuItem, else move down
    if (!activeMenuItem) {
      setActiveMenuItem(allMenuItems[0]);
      return;
    }
    const currentMenuItemIndex = getCurrentMenuItemIndex();
    const isAbleToMoveDown = currentMenuItemIndex + 1 < numberOfMenuItems;
    if (isAbleToMoveDown) {
      setActiveMenuItem(allMenuItems[currentMenuItemIndex + 1]);
      return;
    }
    if (!isAbleToMoveDown) {
      setActiveMenuItem(allMenuItems[0]);
    }
  };

  const handleTab = (event: KeyboardEvent) => {
    event.preventDefault();
    handleArrowDown();
  };

  const focusOnFirstMenuItem = () => {
    allMenuItems[0]?.focus();
  };

  const handleToggleMenu = () => {
    if (!isHamburgerExpanded) {
      openHamburgerMenu();
      focusOnFirstMenuItem();
      return;
    }
    if (isHamburgerExpanded) {
      closeHamburgerMenu();
      setActiveMenuItem(allMenuItems[0]);
    }
  };

  const handleOpenLanguageSelectionPopOver = () => {
    closeHamburgerMenu();
  };

  const selectActiveItem = () => activeMenuItem?.click();
  const isMenuActive = isHamburgerMenuInView && isHamburgerExpanded;
  const menuItemTabIndex = isMenuActive ? 0 : -1;

  useOnArrowUp({ callback: handleArrowUp, enabled: isMenuActive });
  useOnArrowDown({ callback: handleArrowDown, enabled: isMenuActive });
  useOnSpacebar({ callback: selectActiveItem, enabled: isMenuActive });
  useOnEscape({ callback: closeHamburgerMenu, enabled: isMenuActive });
  useOnTab({ callback: handleTab, enabled: isMenuActive });

  useEffect(() => {
    if (activeMenuItem) {
      activeMenuItem.focus();
    }
  }, [activeMenuItem]);

  return (
    <div className="relative flex items-center content-center">
      <button
        ref={ref}
        id="menu-button"
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleToggleMenu}
        type="button"
        className="flex p-3"
        aria-expanded={isHamburgerExpanded}
      >
        <span className="sr-only">Open main menu</span>
        <Icon size="medium" type={isHamburgerExpanded ? "X" : "Menu"} />
      </button>
      <ul
        role="menu"
        id="menu"
        aria-labelledby="menu-button"
        style={{ top: "49px" }}
        className={`
  shadow-hamburgerMenu
  rounded-lg
  bg-neutral-5
  flex flex
  flex-col 
  overflow-hidden
  w-max
  transition-max-height
  duration-300 
  absolute
  right-0
  z-50
  ${isHamburgerExpanded ? "max-h-screen max-w-[19rem]" : "max-h-0"}
  `}
      >
        {hamburgerLinks.map((link) => {
          const RendererComponent = link.renderer;

          return (
            <li role="none" key={link.to} className="w-full lg:hidden">
              <RendererComponent
                enabled={link.enabled}
                tabIndex={menuItemTabIndex}
                role="menuitem"
                className="px-4"
                to={link.to}
                linkText={link.linkText}
                onClick={closeHamburgerMenu}
              />
            </li>
          );
        })}
        {desktopHamburgerLinks.map((link) => {
          const RendererComponent = link.renderer;

          return (
            <li role="none" key={link.to} className="w-full">
              <RendererComponent
                enabled={link.enabled}
                tabIndex={menuItemTabIndex}
                role="menuitem"
                className="px-4"
                to={link.to}
                linkText={link.linkText}
                onClick={closeHamburgerMenu}
              />
            </li>
          );
        })}
        <li className="w-full" role="none">
          <CountryAndLanguageSelectionDialog
            tabIndex={menuItemTabIndex}
            customTriggerButtonClassName="h-12 px-4 w-full flex justify-start items-center font-bold hover:bg-neutral-20"
            onTrigger={handleOpenLanguageSelectionPopOver}
          />
        </li>
        <li className="w-full p-3" role="none">
          <div className="bg-neutral-white px-3 py-2.5 body-md">
            <Trans
              i18nKey="feedback.hamburgerMenu"
              ns="common"
              components={{
                Link: (
                  <Link
                    to="mailto:change@me.domain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="body-md-b"
                  />
                ),
              }}
            />
          </div>
        </li>
      </ul>
    </div>
  );
};
