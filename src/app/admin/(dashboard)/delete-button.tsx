"use client";

export function DeleteButton({ action, label }: { action: () => Promise<void>; label: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete ${label}? This also removes its photos and cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button className="font-semibold text-red-600 hover:underline">Delete</button>
    </form>
  );
}
