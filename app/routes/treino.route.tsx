import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getTreinos } from "~/services/treino.service";
import { userHasPermission } from "~/services/usuarios.service";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ChevronRight, PlayCircle, Plus } from "lucide-react";
import { useSession } from "~/lib/auth-client";
import AjudaPesquisaUsuario from "~/components/AjudaPesquisaUsuario";

export default function Treino() {
    const navigate = useNavigate();
    const { data: session } = useSession();
    const [treinos, setTreinos] = useState([]);
    const [openCards, setOpenCards] = useState<Record<number, boolean>>({});
    const [screenConfig, setScreenConfig] = useState({
        novoTreinoEnabled: false
    })
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<{ id: string; name: string } | null>(null);

    const selecionarUsuario = async (usuario: { id: string; name: string }) => {
        setUsuarioSelecionado(usuario);
    };

    const fetchTreinos = async () => {
        const response = await getTreinos(usuarioSelecionado?.id);
        setTreinos(response);
    }

    const getPermissions = async () => {
        setScreenConfig({
            novoTreinoEnabled: await userHasPermission("createTreino")
        })
    }

    useEffect(() => {
        fetchTreinos();
    }, [usuarioSelecionado])

    useEffect(() => {
        fetchTreinos();
        getPermissions();

        if (session?.user) {
            setUsuarioSelecionado({ id: session.user.id, name: session.user.name });
        }
    }, []);

    return (
        <div className="min-h-full">
            <div className="max-w-2xl mx-auto px-4 py-8">

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Treinos</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            {treinos.length} treino{treinos.length !== 1 ? 's' : ''} registrado{treinos.length !== 1 ? 's' : ''}
                        </p>

                        {screenConfig.novoTreinoEnabled && (
                            <div className="flex items-center  px-3 rounded-md border">
                                <span className="flex-1 text-sm font-medium text-foreground">
                                    {usuarioSelecionado?.name}
                                </span>
                                <AjudaPesquisaUsuario
                                    onSelect={selecionarUsuario} />
                            </div>
                        )}
                    </div>
                    {screenConfig.novoTreinoEnabled && (
                        <Button
                            onClick={() => navigate("/treino/novo")}
                            size="lg"
                            className="gap-2"
                        >
                            <Plus size={18} />
                            Novo Treino
                        </Button>
                    )}
                </div>

                {treinos.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <p className="text-muted-foreground mb-4">Nenhum treino registrado ainda</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {treinos.map((treino: any) => (
                            <Card key={treino.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl">{treino.nome}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {treino.treinoExercicio?.length || 0} exercício{treino.treinoExercicio?.length !== 1 ? 's' : ''}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="secondary" className="ml-2">
                                            Ativo
                                        </Badge>
                                    </div>
                                </CardHeader>

                                {openCards[treino.id] && treino.treinoExercicio && treino.treinoExercicio.length > 0 && (
                                    <CardContent className="space-y-3 pt-0">
                                        <div className="max-h-32 overflow-y-auto space-y-2">
                                            {treino.treinoExercicio.map((treinoExercicio: any, idx: number) => (
                                                <div key={idx} className="flex items-start justify-between p-2 bg-muted rounded text-sm">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-foreground">
                                                            {treinoExercicio.exercicio?.nome}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {treinoExercicio.series}x{treinoExercicio.repeticoes} • {treinoExercicio.peso}{treinoExercicio.unidadePeso}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline" className="ml-2 flex-shrink-0">
                                                        {treinoExercicio.exercicio?.grupoMuscular?.nome}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                )}

                                <div className="flex gap-2 p-4 border-t bg-muted/20">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setOpenCards((prev) => ({
                                                ...prev,
                                                [treino.id]: !prev[treino.id]
                                            }));
                                        }}
                                    >
                                        <ChevronRight size={16} className="mr-1" />
                                        {openCards[treino.id] ? "Ocultar detalhes" : "Detalhes"}
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="flex-1 gap-2"
                                        onClick={() => navigate(`/treino/${treino.id}`)}
                                    >
                                        <PlayCircle size={16} />
                                        Iniciar
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}