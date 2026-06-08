import { useEffect, useState } from "react";
import { useParams } from "react-router";
import BotaoVoltar from "~/components/BotaoVoltar";
import { getTreinoById, updateTreino } from "~/services/treino.service";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Pencil, Save, Trash2, X } from "lucide-react";
import Feedback from "~/components/Feedback";
import { userHasPermission } from "~/services/usuarios.service";
import AjudaPesquisaExercicio from "~/components/AjudaPesquisaExercicio";


export default function TreinoDetalhes() {
    const { id } = useParams();
    const [treino, setTreino] = useState<any>({ nome: "", treinoExercicio: [] });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [screenConfig, setScreenConfig] = useState({
        editarTreinoEnabled: false
    });

    const fetchTreino = async () => {
        try {
            const treinoData = await getTreinoById(Number(id));
            setTreino(treinoData);
        } catch (err) {
            setFeedback({ type: "error", message: "Erro ao carregar o treino." });
        }
    };

    const getPermissions = async () => {
        setScreenConfig({
            editarTreinoEnabled: await userHasPermission("createTreino")
        })
    };

    const handleSave = async () => {
        setFeedback(null);

        if (treino.treinoExercicio.find((exercicio: any) => !exercicio.exercicioId)) {
            setFeedback({ type: "error", message: "É necessário definir o exercício" });
            return;
        }

        setIsSaving(true);

        try {
            await updateTreino(Number(id), treino);
            setIsEditing(false);
            setFeedback({ type: "success", message: "Treino atualizado com sucesso." });
        } catch (err) {
            setFeedback({ type: "error", message: "Erro ao salvar o treino. Tente novamente." });
        } finally {
            setIsSaving(false);
            fetchTreino();
        }
    };

    const removeExercicio = (index: number) => {
        const updatedExercises = [...(treino.treinoExercicio || [])];
        const exercicio = updatedExercises[index];

        if (exercicio.id) {
            updatedExercises[index] = { ...exercicio, delete: !exercicio.delete };
            setTreino({ ...treino, treinoExercicio: updatedExercises });
        } else {
            setTreino({ ...treino, treinoExercicio: updatedExercises.filter((_: any, i: number) => i !== index) });
        }
    }

    const addExercicio = () => {
        setTreino({
            ...treino,
            treinoExercicio: [{ unidadePeso: "KG", peso: "", series: "", repeticoes: "" }, ...(treino.treinoExercicio || [])]
        });
    }

    const onSelectExercicio = (index: number, exercicio: any) => {
        if (treino.treinoExercicio.find((cadastrado: any) => cadastrado.exercicioId === exercicio.id)) {
            setFeedback({ type: "error", message: "Exercício já cadastrado" });
            return;
        }

        const updatedExercises = [...(treino.treinoExercicio || [])];
        updatedExercises[index] = {
            ...updatedExercises[index],
            exercicio,
            exercicioId: exercicio.id
        };
        setTreino({ ...treino, treinoExercicio: updatedExercises });
    };

    const handleExerciseChange = (index: number, field: string, value: string) => {
        const updatedExercises = [...(treino.treinoExercicio || [])];
        updatedExercises[index] = {
            ...updatedExercises[index],
            [field]: value
        };
        setTreino({ ...treino, treinoExercicio: updatedExercises });
    };

    const onCancelar = () => {
        setIsEditing(!isEditing);
        fetchTreino();
        setFeedback(null);
    };

    useEffect(() => {
        fetchTreino();
        getPermissions();
    }, [id]);

    return (
        <div className="min-h-full py-8">
            <div className="max-w-4xl mx-auto px-4">
                <BotaoVoltar />
                <Card className="border-0 shadow-xl mt-4">
                    <CardHeader className="gap-4 md:flex md:items-center md:justify-between">
                        <div>
                            <CardTitle>Detalhes do treino</CardTitle>
                            <CardDescription>Visualize os exercícios e detalhes deste treino</CardDescription>
                        </div>
                        {screenConfig.editarTreinoEnabled && (
                            <div className="flex flex-wrap gap-2">
                                {!isEditing ? (
                                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing(!isEditing)}>
                                        <Pencil size={16} />
                                        Editar
                                    </Button>
                                ) : (
                                    <div>
                                        <Button variant="outline" size="sm" className="gap-2" onClick={onCancelar}>
                                            <X size={16} />
                                            Cancelar
                                        </Button>
                                        <Button size="sm" className="gap-2" onClick={handleSave} disabled={isSaving}>
                                            <Save size={16} />
                                            {isSaving ? "Salvando..." : "Salvar"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Feedback type={feedback?.type} message={feedback?.message} />

                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Nome do treino</label>
                                    <Input
                                        value={treino.nome}
                                        disabled={!isEditing}
                                        onChange={(e) => setTreino({ ...treino, nome: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-foreground">Aluno</p>
                                    <p className="text-sm text-muted-foreground">{treino.user?.name}</p>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-border bg-card p-4">
                                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Exercícios</p>
                                        <p className="text-sm text-muted-foreground">
                                            {treino.treinoExercicio.filter((e: any) => !e.delete).length} exercício{treino.treinoExercicio.filter((e: any) => !e.delete).length !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                    {isEditing && <div>
                                        <Button size="sm" onClick={addExercicio} >Novo</Button>
                                    </div>}
                                </div>

                                {treino.treinoExercicio.length > 0 && (
                                    <div className="space-y-4">
                                        {treino.treinoExercicio.map((exercicio: any, index: number) => (

                                            <div key={index} className={`rounded-2xl border p-4 transition-colors ${exercicio.delete ? "border-border/30 bg-muted/50 opacity-60" : "border-border/50 bg-background"}`}>
                                                {isEditing && !exercicio.exercicio?.id ? (
                                                    <div className="flex items-start gap-2">
                                                        <div className="flex-1">
                                                            <AjudaPesquisaExercicio onSelect={(ex) => onSelectExercicio(index, ex)} />
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => removeExercicio(index)} className="shrink-0 text-destructive hover:text-destructive">
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="font-semibold text-foreground">{exercicio.exercicio?.nome}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {exercicio.exercicio?.descricao}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            {exercicio.delete && <Badge variant="destructive">Será removido</Badge>}
                                                            <Badge variant="secondary">{exercicio.exercicio?.grupoMuscular?.nome}</Badge>
                                                            {isEditing && (
                                                                <Button variant="ghost" size="icon" onClick={() => removeExercicio(index)} className="text-destructive hover:text-destructive">
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-4 grid gap-3 md:grid-cols-3">
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-xs font-medium text-muted-foreground">Peso</label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                disabled={!isEditing || exercicio.delete}
                                                                value={exercicio.peso}
                                                                type="number"
                                                                onChange={(event) => handleExerciseChange(index, "peso", event.target.value)}
                                                            />
                                                            <span className="text-sm text-muted-foreground select-none shrink-0">
                                                                {exercicio.unidadePeso}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-xs font-medium text-muted-foreground">Séries</label>
                                                        <Input
                                                            disabled={!isEditing || exercicio.delete}
                                                            value={exercicio.series}
                                                            type="number"
                                                            onChange={(event) => handleExerciseChange(index, "series", event.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-xs font-medium text-muted-foreground">Repetições</label>
                                                        <Input
                                                            disabled={!isEditing || exercicio.delete}
                                                            value={exercicio.repeticoes}
                                                            type="number"
                                                            onChange={(event) => handleExerciseChange(index, "repeticoes", event.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
