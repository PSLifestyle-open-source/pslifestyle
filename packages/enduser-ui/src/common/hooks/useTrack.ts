import { useEffect } from "react";

const useTrack = (category: string) => {
  // eslint-disable-next-line no-underscore-dangle, no-var
  var _mtm = window._mtm || [];
  // const existingData = _mtm;
  useEffect(
    () => {
      _mtm.push({
        event: "transition_page_view",
        transition_page_type: category,
      });
      console.log(_mtm);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category],
  );
};

export default useTrack;
