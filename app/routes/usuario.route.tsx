import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getUsuarios } from "~/services/usuarios.service";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Search, User } from "lucide-react";
import BarraPesquisa from "~/components/BarraPesquisa";
import Navegacao from "~/components/Navegacao";

export default function Usuario() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsuarios = async (searchTerm = "") => {
        setIsLoading(true);
        try {
            const users = await getUsuarios(searchTerm);
            setUsuarios(users.users || []);
        } finally {
            setIsLoading(false);
        }
    }

    const filterUsuarios = async (valor: string) => {
        await fetchUsuarios(valor);
    }

    useEffect(() => {
        fetchUsuarios();
    }, [])

    return (
        <div className="min-h-full">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {usuarios.length} usuário{usuarios.length !== 1 ? 's' : ''} registrado{usuarios.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Barra de pesquisa */}
                <BarraPesquisa
                    onSearch={(filtro) => filterUsuarios(filtro)}
                    placeholder="Pesquisar usuários por nome ou email..."
                    disabled={isLoading} />

                {/* Lista de usuários */}
                {usuarios.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                            <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {usuarios.map((usuario: any) => (
                            <Card
                                key={usuario.id}
                                className="hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => navigate(`/usuarios/${usuario.id}`)}
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                                {usuario.name
                                                    ?.split(' ')
                                                    .map((n: string) => n[0])
                                                    .join('')
                                                    .toUpperCase() || '?'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-foreground">
                                                {usuario.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {usuario.email}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}