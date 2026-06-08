import { useEffect, useState } from "react";
import { Dumbbell, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { getExercicios } from "~/services/exercicios.service";

type ExercicioOpcao = {
    id: number;
    nome: string;
    descricao?: string;
    grupoMuscular?: { nome: string };
};

type AjudaPesquisaExercicioProps = {
    onSelect: (exercicio: ExercicioOpcao) => void;
    disabled?: boolean;
};

export default function AjudaPesquisaExercicio({
    onSelect,
    disabled = false,
}: AjudaPesquisaExercicioProps) {
    const [aberto, setAberto] = useState(false);
    const [busca, setBusca] = useState("");
    const [exercicios, setExercicios] = useState<ExercicioOpcao[]>([]);
    const [carregando, setCarregando] = useState(false);

    const fetchExercicios = async () => {
        setCarregando(true);
        try {
            const data = await getExercicios();
            setExercicios(data);
        } catch {
            setExercicios([]);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        if (aberto) fetchExercicios();
    }, [aberto]);

    const filtrados = exercicios.filter((e) =>
        e.nome.toLowerCase().includes(busca.toLowerCase()) ||
        e.grupoMuscular?.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const selecionar = (exercicio: ExercicioOpcao) => {
        onSelect(exercicio);
        setAberto(false);
    };

    return (
        <Dialog open={aberto} onOpenChange={setAberto}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => { setBusca(""); setAberto(true); }}
                    className="flex w-full items-center gap-2 h-10 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Search className="h-4 w-4 shrink-0" />
                    Pesquisar exercício...
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Selecionar exercício</DialogTitle>
                </DialogHeader>

                <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        autoFocus
                        placeholder="Buscar por nome ou grupo muscular..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="mt-2 max-h-72 overflow-y-auto -mx-4">
                    {carregando ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                            Carregando...
                        </p>
                    ) : filtrados.length === 0 ? (
                        <div className="flex flex-col items-center py-8 gap-2 text-muted-foreground">
                            <Dumbbell className="h-8 w-8 opacity-20" />
                            <p className="text-sm">Nenhum exercício encontrado</p>
                        </div>
                    ) : (
                        <ul>
                            {filtrados.map((exercicio) => (
                                <li
                                    key={exercicio.id}
                                    className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer hover:bg-muted transition-colors"
                                    onClick={() => selecionar(exercicio)}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">{exercicio.nome}</p>
                                        {exercicio.descricao && (
                                            <p className="text-xs text-muted-foreground truncate">{exercicio.descricao}</p>
                                        )}
                                    </div>
                                    {exercicio.grupoMuscular?.nome && (
                                        <Badge variant="secondary" className="shrink-0 text-xs">
                                            {exercicio.grupoMuscular.nome}
                                        </Badge>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
