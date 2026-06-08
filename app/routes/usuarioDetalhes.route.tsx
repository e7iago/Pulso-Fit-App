import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getAllRoles, getUsuarioById, updateRoleUsuario } from "~/services/usuarios.service";
import { usePermissions } from "~/lib/permissions-context";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { ArrowLeft, ShieldCheck, Mail, Calendar, UserCog } from "lucide-react";
import BotaoVoltar from "~/components/BotaoVoltar";
import Feedback from "~/components/Feedback";

type Usuario = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: string | null;
    banned: boolean;
    banReason: string | null;
    banExpires: string | null;
    createdAt: string;
    updatedAt: string;
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default function UsuarioDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { usuarioEnabled, isLoading: permissionsLoading } = usePermissions();

    const [roles, setRoles] = useState([]);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("user");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const loadUsuario = async () => {
        try {
            const data = await getUsuarioById(id!);
            setUsuario(data);
            setSelectedRole(data.role ?? "user");
        } catch {
            setFeedback({ type: "error", message: "Não foi possível carregar o usuário." });
        } finally {
            setIsLoading(false);
        }
    };

    const loadRoles = async () => {
        try {
            const data = await getAllRoles();
            setRoles(data);
        } catch {
            setFeedback({ type: "error", message: "Não foi possível carregar as roles disponíveis." });
        }
    }

    useEffect(() => {
        if (permissionsLoading) return;
        if (!usuarioEnabled) {
            navigate("/", { replace: true });
            return;
        }

        loadUsuario();
    }, [id, usuarioEnabled, permissionsLoading]);

    useEffect(() => {
        loadRoles();
    },[])

    const handleSaveRole = async () => {
        if (!usuario) return;
        setFeedback(null);
        setIsSaving(true);
        try {
            await updateRoleUsuario(usuario.id, selectedRole);
            setUsuario({ ...usuario, role: selectedRole });
            setFeedback({ type: "success", message: "Role atualizada com sucesso." });
        } catch {
            setFeedback({ type: "error", message: "Erro ao atualizar a role. Tente novamente." });
        } finally {
            setIsSaving(false);
        }
    };

    const roleChanged = usuario && selectedRole !== (usuario.role ?? "user");

    if (isLoading || permissionsLoading) {
        return (
            <div className="flex items-center justify-center min-h-full py-20">
                <p className="text-muted-foreground">Carregando...</p>
            </div>
        );
    }

    if (!usuario) {
        return (
            <div className="flex items-center justify-center min-h-full py-20">
                <p className="text-muted-foreground">Usuário não encontrado.</p>
            </div>
        );
    }

    return (
        <div className="min-h-full py-8">
            <div className="max-w-xl mx-auto px-4 space-y-4">
                <BotaoVoltar />

                {/* Perfil */}
                <Card className="border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                                {getInitials(usuario.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-xl">{usuario.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1.5 mt-1">
                                <Mail size={13} />
                                {usuario.email}
                            </CardDescription>
                        </div>
                        {usuario.role === "admin" && (
                            <Badge className="gap-1 shrink-0">
                                <ShieldCheck size={12} />
                                Admin
                            </Badge>
                        )}
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Calendar size={14} />
                                Membro desde
                            </span>
                            <span className="font-medium">{formatDate(usuario.createdAt)}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">E-mail verificado</span>
                            <Badge variant={usuario.emailVerified ? "default" : "outline"}>
                                {usuario.emailVerified ? "Verificado" : "Não verificado"}
                            </Badge>
                        </div>

                        {usuario.banned && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <Badge variant="destructive">Banido</Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Editar role */}
                <Card className="border-0 shadow-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <UserCog size={16} />
                            Permissão de acesso
                        </CardTitle>
                        <CardDescription>
                            Defina o nível de acesso deste usuário no sistema.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Feedback type={feedback?.type} message={feedback?.message} />

                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-full h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                {roles.map((role: string) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={handleSaveRole}
                            disabled={isSaving || !roleChanged}
                            className="w-full"
                        >
                            {isSaving ? "Salvando..." : "Salvar alteração"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
