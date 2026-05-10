import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold",
            card: "bg-zinc-900 border border-zinc-800",
            headerTitle: "text-zinc-50",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton: "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-200",
            formFieldLabel: "text-zinc-300",
            formFieldInput: "bg-zinc-800 border-zinc-700 text-zinc-100",
            footerActionText: "text-zinc-400",
            footerActionLink: "text-emerald-400 hover:text-emerald-300",
          }
        }}
      />
    </div>
  );
}
