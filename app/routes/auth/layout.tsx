import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="h-full bg-zinc-50">
      <main className="container grid min-h-full max-w-md grid-cols-1 place-items-center">
        <Outlet />
      </main>
    </div>
  );
}
