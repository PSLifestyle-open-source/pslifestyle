import { createSelectorCreator, lruMemoize } from "@reduxjs/toolkit";
import { isEqual } from "lodash";

export const createDeepEqualSelector = createSelectorCreator({
  memoize: lruMemoize,
  memoizeOptions: [isEqual],
  // it's OK to return selector input directly if it is for example an
  // object on which deep equality check is done
  devModeChecks: { identityFunctionCheck: "never" },
});
