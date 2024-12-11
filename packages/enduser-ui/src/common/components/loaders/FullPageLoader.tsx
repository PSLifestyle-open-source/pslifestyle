import { Loader } from "./Loader";

export const FullPageLoader = () => (
  <div className="top-0 fixed left-0 right-0 bottom-0 flex justify-center items-center bg-neutral-white">
    <Loader />
  </div>
);
