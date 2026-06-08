import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getExercicios } from "~/services/exercicios.service";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Edit2, Trash2, Plus } from "lucide-react";
import Navegacao from "~/components/Navegacao";

export default function Exercicios() {
    const navigate = useNavigate();
    const [exercicios, setExercicios] = useState([]);

    const fetchExercicios = async () => {
        const data = await getExercicios();
        setExercicios(data);
    }

    useEffect(() => {
        fetchExercicios();
    }, []);

    return (
        <div className="min-h-full">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Exercícios</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            {exercicios.length} exercício{exercicios.length !== 1 ? 's' : ''} no catálogo
                        </p>
                    </div>
                    <Button 
                        onClick={() => navigate("/exercicios/novo")}
                        size="lg"
                        className="gap-2"
                    >
                        <Plus size={18} />
                        Novo Exercício
                    </Button>
                </div>

                {/* Tabela de exercícios */}
                <Card>
                    {exercicios.length === 0 ? (
                        <CardContent className="text-center py-12">
                            <p className="text-muted-foreground mb-4">Nenhum exercício registrado</p>
                            <Button 
                                onClick={() => navigate("/exercicios/novo")}
                                variant="default"
                            >
                                Criar primeiro exercício
                            </Button>
                        </CardContent>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Grupo Muscular</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {exercicios.map((exercicio: any) => (
                                        <TableRow key={exercicio.id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium text-foreground">
                                                {exercicio.nome}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                                                {exercicio.descricao || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {exercicio.grupoMuscular?.nome}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/exercicios/${exercicio.id}`)}
                                                    className="text-primary hover:text-primary hover:bg-primary/10"
                                                >
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}