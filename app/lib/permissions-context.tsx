import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { userHasPermission } from "~/services/usuarios.service";
import { useSession } from "~/lib/auth-client";

interface PermissionsContextType {
  exercicioEnabled: boolean;
  usuarioEnabled: boolean;
  isLoading: boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const [permissions, setPermissions] = useState<PermissionsContextType>({
    exercicioEnabled: false,
    usuarioEnabled: false,
    isLoading: true,
  });

  useEffect(() => {
    let cancelled = false;

    if (isPending) {
      setPermissions((prev) => ({ ...prev, isLoading: true }));
      return;
    }

    if (!userId) {
      setPermissions({ exercicioEnabled: false, usuarioEnabled: false, isLoading: false });
      return;
    }

    const loadPermissions = async () => {
      setPermissions((prev) => ({ ...prev, isLoading: true }));
      try {
        const [exercicioEnabled, usuarioEnabled] = await Promise.all([
          userHasPermission("createExercicio"),
          userHasPermission("usuario"),
        ]);

        if (!cancelled) {
          setPermissions({ exercicioEnabled, usuarioEnabled, isLoading: false });
        }
      } catch (error) {
        console.error("Erro ao carregar permissões:", error);
        if (!cancelled) {
          setPermissions({ exercicioEnabled: false, usuarioEnabled: false, isLoading: false });
        }
      }
    };

    loadPermissions();

    return () => {
      cancelled = true;
    };
    
  }, [userId, isPending]);

  if (permissions.isLoading) {
    return (
      <div className="flex items-center justify-center h-full flex-col">
        <div className="flex justify-center mb-2 animate-pulse">
          <img src="/PulsoLogo.png" alt="Pulso Fit" className="h-60 w-60 object-contain" />
        </div>
      </div>
    )
  }

  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("PermissionsProvider não foi definido.");
  }
  return context;
}
