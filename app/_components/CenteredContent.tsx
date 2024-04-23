import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
}

export default function CenteredContent({ children }: Props) {
  return (
    <div className="h-100 d-flex flex-column justify-content-center align-items-center gap-2">
      {children}
    </div>
  );
}
