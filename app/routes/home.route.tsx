import { useNavigate } from "react-router";
import { useSession, signOut } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { LogOut, ChevronRight, Dumbbell, LineChart, Scale, Ruler, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { countTreinos } from "~/services/treino.service";
import { getEvolucaoUsuario } from "~/services/evolucao.service";

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
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

export default function Home() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [treinos, setTreinos] = useState(0);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoFisica[]>([]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const initials = session?.user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  useEffect(() => {
    const load = async () => {
      const [count, evolucao] = await Promise.all([
        countTreinos(),
        getEvolucaoUsuario(),
      ]);
      setTreinos(Number(count));
      const lista: AvaliacaoFisica[] = Array.isArray(evolucao) ? evolucao : [];
      lista.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      setAvaliacoes(lista);
    };
    load();
  }, []);

  const ultimaAvaliacao = avaliacoes[0];

  const avaliacaoDesatualizada = ultimaAvaliacao
    ? (Date.now() - new Date(ultimaAvaliacao.data).getTime()) / (1000 * 60 * 60 * 24) > 90
    : false;

  return (
    <div className="min-h-full">
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Bem-vindo, {session?.user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-muted-foreground text-sm">Vamos treinar hoje</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut size={20} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/treino")}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dumbbell size={18} className="text-primary" />
                  Meus Treinos
                </div>
                <ChevronRight className="text-muted-foreground" />
              </CardTitle>
              <CardDescription>Acesse seus treinos salvos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{treinos}</p>
              <p className="text-xs text-muted-foreground">treinos cadastrados</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/evolucao")}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LineChart size={18} className="text-primary" />
                  Evolução
                </div>
                <ChevronRight className="text-muted-foreground" />
              </CardTitle>
              <CardDescription>Acompanhe seu progresso físico</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{avaliacoes.length}</p>
              <p className="text-xs text-muted-foreground">avaliações registradas</p>
            </CardContent>
          </Card>
        </div>

        {avaliacaoDesatualizada && (
          <Alert variant="default" className="mb-4 cursor-pointer" onClick={() => navigate("/evolucao/nova")}>
            <AlertTriangle/>
            <AlertTitle>Avaliação desatualizada</AlertTitle>
            <AlertDescription>
              Sua última avaliação foi há mais de 90 dias. Agenda uma nova com a nossa equipe!
            </AlertDescription>
          </Alert>
        )}

        {ultimaAvaliacao && (
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow mb-6"
            onClick={() => navigate(`/evolucao/${ultimaAvaliacao.id}`)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Última Avaliação</CardTitle>
                <ChevronRight className="text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="w-fit">{formatData(ultimaAvaliacao.data)}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/60 p-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Scale size={14} />
                    Peso
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">
                      {formatNumber(num(ultimaAvaliacao.peso))}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {ultimaAvaliacao.unidadePeso}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-muted/60 p-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Ruler size={14} />
                    Altura
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">
                      {formatNumber(num(ultimaAvaliacao.altura))}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {ultimaAvaliacao.unidadeAltura}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
