import { useState } from "react";
import { useNavigate } from "react-router";
import BotaoVoltar from "~/components/BotaoVoltar";
import { createTreino } from "~/services/treino.service";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { X } from "lucide-react";
import Feedback from "~/components/Feedback";
import AjudaPesquisaUsuario from "~/components/AjudaPesquisaUsuario";

export default function TreinoCadastro() {
    const navigate = useNavigate();
    const [treinoData, setTreinoData] = useState({ nome: "", userId: "" });
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<{ id: string; name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const selecionarUsuario = (usuario: { id: string; name: string }) => {
        setUsuarioSelecionado(usuario);
        setTreinoData((prev) => ({ ...prev, userId: usuario.id }));
    };

    const limparUsuario = () => {
        setUsuarioSelecionado(null);
        setTreinoData((prev) => ({ ...prev, userId: "" }));
    };

    const iniciais = (nome: string) =>
        nome?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

    const cadastrarTreino = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!treinoData.userId || !treinoData.nome) {
            setError("Selecione um usuário e informe o nome do treino.");
            return;
        }

        setIsLoading(true);
        try {
            await createTreino({ nome: treinoData.nome, userId: treinoData.userId });
            navigate("/treino");
        } catch {
            setError("Erro ao cadastrar o treino. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-full py-8">
            <div className="max-w-xl mx-auto px-4">
                <BotaoVoltar />
                <Card className="border-0 shadow-xl mt-4">
                    <CardHeader className="space-y-2">
                        <CardTitle>Cadastro de treino</CardTitle>
                        <CardDescription>Crie um novo treino e atribua a um usuário existente.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Feedback message={error} />
                        <form onSubmit={cadastrarTreino} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Usuário
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
                                        <button
                                            type="button"
                                            onClick={limparUsuario}
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <AjudaPesquisaUsuario
                                        onSelect={selecionarUsuario}
                                        placeholder="Pesquisar usuário..."
                                        disabled={isLoading}
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="nome" className="text-sm font-medium text-foreground">
                                    Nome do treino
                                </label>
                                <Input
                                    id="nome"
                                    type="text"
                                    value={treinoData.nome}
                                    onChange={(e) => setTreinoData((prev) => ({ ...prev, nome: e.target.value }))}
                                    placeholder="Ex: Treino de pernas"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button type="submit" disabled={isLoading} className="flex-1">
                                    {isLoading ? "Salvando..." : "Cadastrar treino"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => navigate("/treino")}
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
