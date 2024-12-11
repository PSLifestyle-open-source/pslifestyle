export interface IMenuItemRendererProps {
  to: string;
  onClick?: () => void;
  linkText: string;
  className?: string;
  role?: string;
  tabIndex?: number;
  enabled: boolean;
}
