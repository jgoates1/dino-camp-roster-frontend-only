import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CamperCard from "@/components/CamperCard";

interface Camper {
  id: number;
  name: string;
  username: string;
  emoji: string;
}

const fetchCampers = async (): Promise<Camper[]> => {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch campers");
  return res.json();
};

const Index = () => {
  const queryClient = useQueryClient();
  const { data: campers = [], isLoading, error } = useQuery({
    queryKey: ["campers"],
    queryFn: fetchCampers,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, username }: { id: number; username: string }) => {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update username");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campers"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const updateUsername = async (id: number, newUsername: string) => {
    await updateMutation.mutateAsync({ id, username: newUsername });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-10 text-center">
        <p className="text-4xl mb-2">🦕</p>
        <h1 className="font-display text-4xl font-bold text-foreground">
          Dino Discovery Camp
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Summer 2026 · Enrolled Campers
        </p>
      </header>

      <main className="mx-auto max-w-xl px-4 pb-16 space-y-4">
        {isLoading && (
          <p className="text-center text-muted-foreground">Loading campers...</p>
        )}
        {error && (
          <p className="text-center text-destructive">
            Failed to load campers. Is the backend running?
          </p>
        )}
        {campers.map((c) => (
          <CamperCard
            key={c.id}
            name={c.name}
            username={c.username}
            emoji={c.emoji}
            onSave={(newUsername) => updateUsername(c.id, newUsername)}
          />
        ))}
      </main>
    </div>
  );
};

export default Index;
