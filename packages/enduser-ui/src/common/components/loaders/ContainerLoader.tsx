import { Loader } from "./Loader";

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
  loading: boolean;
  className?: string;
}

export const ContainerLoader = ({ children, loading, className }: IProps) => (
  <div className={`relative ${className || ""}`}>
    <div
      style={{
        transition: "opacity 1s ease-out",
        transitionDuration: "200",
        opacity: loading ? 1 : 0,
        top: "0",
        pointerEvents: loading ? "all" : "none",
        zIndex: 1000,
      }}
      className="fixed left-0 right-0 bottom-0 flex justify-center items-center bg-neutral-white"
    >
      <Loader />
    </div>
    {!loading && children}
  </div>
);
