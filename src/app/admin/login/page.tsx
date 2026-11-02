import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Dealer login",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Dealer login</h1>
      <p className="mt-1 text-sm text-neutral-600">Sign in to manage your cars and enquiries.</p>
      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
}
