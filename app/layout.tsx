import { Metadata } from "next";
import { ReactNode } from "react";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { auth, signOut } from "@/app/_utils/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Comida",
  icons:
    "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍔️</text></svg>",
};

interface Props {
  readonly children: ReactNode;
}

export default async function RootLayout({ children }: Props) {
  const session = await auth();

  return (
    <html lang="en-US" data-bs-theme="dark">
      <body className="d-flex flex-column" style={{ height: "100dvh" }}>
        <nav className="navbar bg-body-tertiary mb-4">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">🍔️ Comida</span>
            <span className="navbar-nav">
              {session && (
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button type="submit" className="btn btn-link nav-link">
                    Sign out
                  </button>
                </form>
              )}
            </span>
          </div>
        </nav>
        <main className="container-lg flex-fill">{children}</main>
      </body>
    </html>
  );
}
