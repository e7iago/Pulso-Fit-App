import { useNavigate, useLocation } from "react-router";
import { usePermissions } from "~/lib/permissions-context";
import { Button } from "~/components/ui/button";
import { Home, Dumbbell, Zap, Users, TrendingUp } from "lucide-react";
import { cn } from "~/lib/utils";

export default function Navegacao() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { exercicioEnabled, usuarioEnabled } = usePermissions();

    const itemClass = (path: string) =>
        cn(
            "flex flex-col items-center gap-1 h-auto py-2",
            pathname === path
                ? "text-primary"
                : "text-muted-foreground"
        );

    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-card shadow-lg">
            <div className="max-w-screen-lg mx-auto px-4 py-3 flex justify-around items-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/")}
                    className={itemClass("/")}
                >
                    <Home size={20} />
                    <span className="text-xs">Início</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/treino")}
                    className={itemClass("/treino")}
                >
                    <Dumbbell size={20} />
                    <span className="text-xs">Treino</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/evolucao")}
                    className={itemClass("/evolucao")}
                >
                    <TrendingUp size={20} />
                    <span className="text-xs">Evolução</span>
                </Button>

                {exercicioEnabled && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/exercicios")}
                        className={itemClass("/exercicios")}
                    >
                        <Zap size={20} />
                        <span className="text-xs">Exercícios</span>
                    </Button>
                )}

                {usuarioEnabled && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/usuarios")}
                        className={itemClass("/usuarios")}
                    >
                        <Users size={20} />
                        <span className="text-xs">Usuários</span>
                    </Button>
                )}
            </div>
        </nav>
    )
}