import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSession } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import Carregamento from "~/components/Carregamento";
import AjudaPesquisaUsuario from "~/components/AjudaPesquisaUsuario";
import { getEvolucaoUsuario } from "~/services/evolucao.service";
import { userHasPermission } from "~/services/usuarios.service";
import { cn } from "~/lib/utils";
import {
    Plus,
    TrendingUp,
    TrendingDown,
    Minus,
    Scale,
    Ruler,
    LineChart,
    ChevronRight
} from "lucide-react";

interface AvaliacaoFisica {
    id: number;
    data: string;
    peso: string | number;
    unidadePeso: string;
    altura: string | number;
    unidadeAltura: string;
    unidadeMedida: string;
    braco: string | number;
    quadril: string | number;
    abdomen: string | number;
    torax: string | number;
    perna: string | number;
}

const num = (v: string | number | null | undefined) => (v == null ? 0 : Number(v));

const formatNumber = (v: number) =>
    new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(v);

const formatData = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const MEDIDAS = [
    { key: "torax", label: "Tórax" },
    { key: "abdomen", label: "Abdômen" },
    { key: "quadril", label: "Quadril" },
    { key: "braco", label: "Braço" },
    { key: "perna", label: "Perna" },
] as const;

function Variacao({
    atual,
    anterior,
    unidade,
}: {
    atual: number;
    anterior?: number;
    unidade: string;
}) {
    if (anterior === undefined) return null;

    const diff = atual - anterior;
    const isZero = Math.abs(diff) < 0.05;
    const Icon = isZero ? Minus : diff > 0 ? TrendingUp : TrendingDown;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                isZero
                    ? "text-muted-foreground"
                    : diff > 0
                        ? "text-amber-500"
                        : "text-emerald-500"
            )}
        >
            <Icon size={12} />
            {isZero ? "estável" : `${diff > 0 ? "+" : ""}${formatNumber(diff)} ${unidade}`}
        </span>
    );
}

export default function Evolucao() {
    const navigate = useNavigate();
    const { data: session } = useSession();
    const [avaliacoes, setAvaliacoes] = useState<AvaliacaoFisica[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [screenConfig, setScreenConfig] = useState({
        novaAvaliacaoEnabled: false
    })
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<{ id: string; name: string } | null>(null);

    const selecionarUsuario = async (usuario: { id: string; name: string }) => {
        setUsuarioSelecionado(usuario);
    };

    const fetchAvaliacoes = async () => {
        try {
            const dados = await getEvolucaoUsuario(usuarioSelecionado?.id);

            const lista: AvaliacaoFisica[] = Array.isArray(dados) ? dados : [];

            // Mais recente primeiro
            lista.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

            setAvaliacoes(lista);
        } catch (error) {
            console.error("Erro ao carregar evolução:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const getPermissions = async () => {
        setScreenConfig({
            novaAvaliacaoEnabled: await userHasPermission("createAvaliacao")
        })
    }

    useEffect(() => {
        fetchAvaliacoes();
    },[usuarioSelecionado])

    useEffect(() => {
        fetchAvaliacoes();
        getPermissions();

        if (session?.user) {
            setUsuarioSelecionado({ id: session.user.id, name: session.user.name });
        }
    }, []);

    const atual = avaliacoes[0];
    const anterior = avaliacoes[1];

    return (
        <div className="min-h-full">
            <div className="max-w-2xl mx-auto px-4 py-8">

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <LineChart size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Evolução</h1>
                            <p className="text-sm text-muted-foreground">
                                Acompanhe suas avaliações físicas
                            </p>
                        </div>
                    </div>

                    {screenConfig.novaAvaliacaoEnabled && (
                        <Button onClick={() => navigate("/evolucao/novo")}>
                            <Plus size={18} className="mr-1" />
                            Nova
                        </Button>
                    )}
                </div>

                {screenConfig.novaAvaliacaoEnabled && (
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center px-3 rounded-md border">
                            <span className="flex-1 text-sm font-medium text-foreground">
                                {usuarioSelecionado?.name}
                            </span>
                            <AjudaPesquisaUsuario
                                onSelect={selecionarUsuario} />
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <Carregamento className="size-10" />
                ) : !atual ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <LineChart size={28} />
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium text-foreground">
                                    Nenhuma avaliação registrada
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    As avaliações físicas aparecerão aqui para acompanhar sua evolução.
                                </p>
                            </div>
                            {screenConfig.novaAvaliacaoEnabled && (
                                <Button onClick={() => navigate("/evolucao/novo")}>
                                    <Plus size={18} className="mr-1" />
                                    Registrar avaliação
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <Card className="ring-primary/30 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/evolucao/${atual.id}`)}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Avaliação atual</CardTitle>
                                    <ChevronRight className="text-muted-foreground" />
                                </div>
                                <Badge variant="secondary" className="w-fit">{formatData(atual.data)}</Badge>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-muted/60 p-4">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Scale size={14} />
                                            Peso
                                        </div>
                                        <div className="mt-1 flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-foreground">
                                                {formatNumber(num(atual.peso))}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {atual.unidadePeso}
                                            </span>
                                        </div>
                                        <Variacao
                                            atual={num(atual.peso)}
                                            anterior={anterior ? num(anterior.peso) : undefined}
                                            unidade={atual.unidadePeso}
                                        />
                                    </div>

                                    <div className="rounded-xl bg-muted/60 p-4">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Ruler size={14} />
                                            Altura
                                        </div>
                                        <div className="mt-1 flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-foreground">
                                                {formatNumber(num(atual.altura))}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {atual.unidadeAltura}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Medidas ({atual.unidadeMedida})
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                        {MEDIDAS.map((m) => (
                                            <div
                                                key={m.key}
                                                className="rounded-lg border border-border/60 p-3"
                                            >
                                                <p className="text-xs text-muted-foreground">{m.label}</p>
                                                <p className="text-lg font-semibold text-foreground">
                                                    {formatNumber(num(atual[m.key]))}
                                                </p>
                                                <Variacao
                                                    atual={num(atual[m.key])}
                                                    anterior={anterior ? num(anterior[m.key]) : undefined}
                                                    unidade={atual.unidadeMedida}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {avaliacoes.length > 1 && (
                            <div>
                                <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                                    Histórico
                                </h2>
                                <div className="space-y-2">
                                    {avaliacoes.slice(1).map((avaliacao) => (
                                        <Card key={avaliacao.id} size="sm">
                                            <CardContent className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Scale size={14} />
                                                    {formatData(avaliacao.data)}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="font-medium text-foreground">
                                                        {formatNumber(num(avaliacao.peso))} {avaliacao.unidadePeso}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {formatNumber(num(avaliacao.altura))} {avaliacao.unidadeAltura}
                                                    </span>
                                                    <span>
                                                        <Button onClick={() => navigate(`/evolucao/${avaliacao.id}`)}>
                                                            <ChevronRight className="text-muted-foreground" />
                                                        </Button>
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
