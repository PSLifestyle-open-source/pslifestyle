import { createBrowserHistory } from "history";
import React from "react";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

export const history = createBrowserHistory({ window });

export const Router = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => (
  // @ts-expect-error history@5 implementation is not type-compatible with HistoryRouter
  <HistoryRouter history={history} {...props}>
    {children}
  </HistoryRouter>
);
