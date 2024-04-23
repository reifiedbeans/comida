import { ReactNode } from "react";

interface Props {
  readonly children?: ReactNode;
  readonly hiddenMessage?: string;
}

export default function FullPageOverlayLoader({ children, hiddenMessage }: Props) {
  return (
    <div
      className="h-100 d-flex flex-column justify-content-center align-items-center gap-2"
      style={{
        zIndex: "50",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.8)",
      }}
    >
      <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
        {(!children || hiddenMessage) && (
          <span className="visually-hidden">{hiddenMessage ?? "Loading..."}</span>
        )}
      </div>
      {children}
    </div>
  );
}
