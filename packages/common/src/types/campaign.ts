export interface Campaign {
  id: string;
  name: string;
  isHidden: boolean;
  allowedCountries: string[];
  redirectDestination: "test" | "homepage";
  createdAt: string;
}
