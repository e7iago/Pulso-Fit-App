import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import Feedback, { type FeedbackProps } from "~/components/Feedback";
import AjudaPesquisaUsuario from "~/components/AjudaPesquisaUsuario";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    createAvaliacao,
    getAvaliacao,
    deleteExercicio as deleteAvaliacao,
} from "~/services/evolucao.service";
import { userHasPermission } from "~/services/usuarios.service";

const MEDIDAS = [
    { key: "torax" as const, label: "Tórax" },
    { key: "abdomen" as const, label: "Abdômen" },
    { key: "quadril" as const, label: "Quadril" },
    { key: "braco" as const, label: "Braço" },
    { key: "perna" as const, label: "Perna" },
];

type AvaliacaoForm = {
    peso: string;
    unidadePeso: string;
    altura: string;
    unidadeAltura: string;
    unidadeMedida: string;
    torax: string;
    abdomen: string;
    quadril: string;
    braco: string;
    perna: string;
};

const INITIAL_STATE: AvaliacaoForm = {
    peso: "",
    unidadePeso: "kg",
    altura: "",
    unidadeAltura: "cm",
    unidadeMedida: "cm",
    torax: "",
    abdomen: "",
    quadril: "",
    braco: "",
    perna: "",
};

const iniciais = (nome: string) =>
    nome?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

export default function EvolucaoDetalhes() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isNew = !id || id === "novo";

    const [avaliacaoData, setAvaliacaoData] = useState<AvaliacaoForm>(INITIAL_STATE);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<{ id: string; name: string } | null>(null);
    const [feedback, setFeedback] = useState<FeedbackProps>({});
    const [isLoading, setIsLoading] = useState(false);
    const [canDelete, setCanDelete] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [podeExcluir] = await Promise.all([
                userHasPermission("createAvaliacao"),
            ]);
            setCanDelete(podeExcluir);

            if (!isNew) {
                const data = await getAvaliacao(Number(id));
                setAvaliacaoData({
                    peso: String(data.peso ?? ""),
                    unidadePeso: data.unidadePeso || "kg",
                    altura: String(data.altura ?? ""),
                    unidadeAltura: data.unidadeAltura || "cm",
                    unidadeMedida: data.unidadeMedida || "cm",
                    torax: String(data.torax ?? ""),
                    abdomen: String(data.abdomen ?? ""),
                    quadril: String(data.quadril ?? ""),
                    braco: String(data.braco ?? ""),
                    perna: String(data.perna ?? ""),
                });
                if (data.user) {
                    setUsuarioSelecionado({ id: data.user.id, name: data.user.name });
                }
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

        if (!avaliacaoData.peso || !avaliacaoData.altura || !usuarioSelecionado?.id) {
            setFeedback({ type: "error", message: "Preencha aluno, peso e altura." });
            return;
        }

        setIsLoading(true);
        try {
            await createAvaliacao({
                ...avaliacaoData,
                ...(usuarioSelecionado ? { userId: usuarioSelecionado.id } : {}),
            });
            navigate("/evolucao");
        } catch {
            setFeedback({ type: "error", message: "Erro ao salvar avaliação. Tente novamente." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Deseja excluir esta avaliação? Esta ação não pode ser desfeita.")) return;
        setIsLoading(true);
        try {
            await deleteAvaliacao(Number(id));
            navigate("/evolucao");
        } catch {
            setFeedback({ type: "error", message: "Erro ao excluir avaliação." });
            setIsLoading(false);
        }
    };

    const field = (key: keyof AvaliacaoForm) => ({
        value: avaliacaoData[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setAvaliacaoData({ ...avaliacaoData, [key]: e.target.value }),
        disabled: isLoading || !isNew,
    });

    return (
        <div className="min-h-full py-8">
            <div className="max-w-xl mx-auto px-4">
                <Card className="border-0 shadow-xl">
                    <CardHeader className="space-y-2">
                        <CardTitle>
                            {isNew ? "Nova avaliação física" : "Detalhes da avaliação"}
                        </CardTitle>
                        <CardDescription>
                            {isNew
                                ? "Registre seus dados físicos atuais."
                                : "Dados registrados nesta avaliação física."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Feedback type={feedback?.type} message={feedback?.message} />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Aluno
                                </label>
                                {usuarioSelecionado ? (
                                    <div className="flex items-center gap-3 px-3 py-2 rounded-md border bg-muted/50">
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                                {iniciais(usuarioSelecionado.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="flex-1 text-sm font-medium text-foreground">
                                            {usuarioSelecionado.name}
                                        </span>
                                        {isNew && (
                                            <button
                                                type="button"
                                                onClick={() => setUsuarioSelecionado(null)}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <AjudaPesquisaUsuario
                                        onSelect={setUsuarioSelecionado}
                                        placeholder="Pesquisar usuário..."
                                        disabled={isLoading}
                                    />
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Peso</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="0,0"
                                        className="flex-1"
                                        {...field("peso")}
                                    />
                                    <Select
                                        value={avaliacaoData.unidadePeso}
                                        onValueChange={(unidade) => setAvaliacaoData({ ...avaliacaoData, unidadePeso: unidade })}
                                        disabled={isLoading || !isNew}
                                    >
                                        <SelectTrigger className="w-20 h-9 border-2 border-border">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg">kg</SelectItem>
                                            <SelectItem value="lb">lb</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Altura</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="0,0"
                                        className="flex-1"
                                        {...field("altura")}
                                    />
                                    <Select
                                        value={avaliacaoData.unidadeAltura}
                                        onValueChange={(unidade) => setAvaliacaoData({ ...avaliacaoData, unidadeAltura: unidade })}
                                        disabled={isLoading || !isNew}
                                    >
                                        <SelectTrigger className="w-20 h-9 border-2 border-border">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cm">cm</SelectItem>
                                            <SelectItem value="m">m</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-foreground">
                                        Medidas corporais
                                    </label>
                                    <Select
                                        value={avaliacaoData.unidadeMedida}
                                        onValueChange={(v) => setAvaliacaoData({ ...avaliacaoData, unidadeMedida: v })}
                                        disabled={isLoading || !isNew}
                                    >
                                        <SelectTrigger className="w-20 h-8 text-xs border-2 border-border">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cm">cm</SelectItem>
                                            <SelectItem value="in">in</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {MEDIDAS.map((m) => (
                                        <div key={m.key} className="space-y-1">
                                            <label className="text-xs text-muted-foreground">
                                                {m.label}
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                placeholder="0,0"
                                                {...field(m.key)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                {isNew ? (
                                    <Button type="submit" disabled={isLoading} className="flex-1">
                                        {isLoading ? "Salvando..." : "Registrar avaliação"}
                                    </Button>
                                ) : (
                                    canDelete && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={handleDelete}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Excluindo..." : "Excluir avaliação"}
                                        </Button>
                                    )
                                )}
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => navigate("/evolucao")}
                                    disabled={isLoading}
                                >
                                    {isNew ? "Cancelar" : "Voltar"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
