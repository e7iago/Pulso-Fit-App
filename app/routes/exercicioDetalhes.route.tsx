import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Feedback, { type FeedbackProps } from "~/components/Feedback";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    createExercicio,
    getExercicioById,
    getGruposMusculares,
    updateExercicio,
} from "~/services/exercicios.service";

export default function ExercicioDetalhes() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isNew = !id || id === "novo";

    const [exercicioData, setExercicioData] = useState({
        nome: "",
        descricao: "",
        grupoMuscularId: 0,
    });
    const [gruposMusculares, setGruposMusculares] = useState<{ id: number; nome: string }[]>([]);
    const [feedback, setFeedback] = useState<FeedbackProps>({});
    const [isLoading, setIsLoading] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const grupos = await getGruposMusculares();
            setGruposMusculares(grupos);

            if (!isNew) {
                const data = await getExercicioById(Number(id));
                setExercicioData({
                    nome: data.nome || "",
                    descricao: data.descricao || "",
                    grupoMuscularId: data.grupoMuscularId || 0,
                });
            }
        } catch {
            setFeedback({ type: "error", message: "Não foi possível carregar os dados." });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFeedback({});

        if (!exercicioData.nome || !exercicioData.descricao || !exercicioData.grupoMuscularId) {
            setFeedback({ type: "error", message: "Preencha todos os campos antes de salvar." });
            return;
        }

        setIsLoading(true);
        try {
            if (isNew) {
                await createExercicio(exercicioData);
                navigate("/exercicios");
            } else {
                await updateExercicio(Number(id), exercicioData);
                setFeedback({ type: "success", message: "Exercício atualizado com sucesso." });
            }
        } catch {
            setFeedback({ type: "error", message: "Erro ao salvar exercício. Tente novamente." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-full py-8">
            <div className="max-w-xl mx-auto px-4">
                <Card className="border-0 shadow-xl">
                    <CardHeader className="space-y-2">
                        <CardTitle>{isNew ? "Cadastrar novo exercício" : "Detalhes do exercício"}</CardTitle>
                        <CardDescription>
                            {isNew
                                ? "Preencha os dados para criar um exercício no catálogo."
                                : "Altere o nome, descrição ou grupo muscular deste exercício."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Feedback type={feedback?.type} message={feedback?.message} />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="nome" className="text-sm font-medium text-foreground">
                                    Nome do exercício
                                </label>
                                <Input
                                    id="nome"
                                    value={exercicioData.nome}
                                    onChange={(e) => setExercicioData({ ...exercicioData, nome: e.target.value })}
                                    placeholder="Agachamento, Supino, Remada..."
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="descricao" className="text-sm font-medium text-foreground">
                                    Descrição
                                </label>
                                <Input
                                    id="descricao"
                                    value={exercicioData.descricao}
                                    onChange={(e) => setExercicioData({ ...exercicioData, descricao: e.target.value })}
                                    placeholder="Exemplo: 3 séries de 12 repetições..."
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Grupo muscular
                                </label>
                                <Select
                                    value={exercicioData.grupoMuscularId ? String(exercicioData.grupoMuscularId) : ""}
                                    onValueChange={(value) =>
                                        setExercicioData({ ...exercicioData, grupoMuscularId: Number(value) })
                                    }
                                    disabled={isLoading || gruposMusculares.length === 0}
                                >
                                    <SelectTrigger className="w-full h-9">
                                        <SelectValue placeholder="Selecione o grupo muscular" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        {gruposMusculares.map((grupo) => (
                                            <SelectItem key={grupo.id} value={String(grupo.id)}>
                                                {grupo.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button type="submit" disabled={isLoading} className="flex-1">
                                    {isLoading ? "Salvando..." : isNew ? "Criar exercício" : "Salvar alterações"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => navigate("/exercicios")}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
