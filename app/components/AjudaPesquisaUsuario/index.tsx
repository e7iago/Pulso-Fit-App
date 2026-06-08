import { useEffect, useRef, useState } from "react";
import { Search, User } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { getUsuarios } from "~/services/usuarios.service";

type UsuarioOpcao = {
    id: string;
    name: string;
    email: string;
};

type AjudaPesquisaUsuarioProps = {
    onSelect: (usuario: { id: string; name: string }) => void;
    placeholder?: string;
    disabled?: boolean;
};

export default function AjudaPesquisaUsuario({
    onSelect,
    //placeholder = "Pesquisar usuário...",
    disabled = false,
}: AjudaPesquisaUsuarioProps) {
    const [aberto, setAberto] = useState(false);
    const [busca, setBusca] = useState("");
    const [usuarios, setUsuarios] = useState<UsuarioOpcao[]>([]);
    const [carregando, setCarregando] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const buscarUsuarios = async (termo: string) => {
        setCarregando(true);
        try {
            const data = await getUsuarios(termo);
            setUsuarios(data.users || []);
        } catch {
            setUsuarios([]);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        if (!aberto) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => buscarUsuarios(busca), 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [busca, aberto]);

    const abrirDialog = () => {
        setBusca("");
        setUsuarios([]);
        setAberto(true);
    };

    const selecionarUsuario = (usuario: UsuarioOpcao) => {
        onSelect({ id: usuario.id, name: usuario.name });
        setAberto(false);
    };

    const iniciais = (nome: string) =>
        nome?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

    return (
        <Dialog open={aberto} onOpenChange={setAberto}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    onClick={abrirDialog}
                    className="flex items-center gap-2  h-10 rounded-md border border-input bg-background  px-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Search className="h-4 w-4 shrink-0" />
                    {/* {placeholder} */}
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Selecionar usuário</DialogTitle>
                </DialogHeader>

                <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        autoFocus
                        placeholder="Buscar por nome ou e-mail..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="mt-2 max-h-72 overflow-y-auto -mx-4">
                    {carregando ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                            Buscando...
                        </p>
                    ) : usuarios.length === 0 ? (
                        <div className="flex flex-col items-center py-8 gap-2 text-muted-foreground">
                            <User className="h-8 w-8 opacity-20" />
                            <p className="text-sm">Nenhum usuário encontrado</p>
                        </div>
                    ) : (
                        <ul>
                            {usuarios.map((usuario) => (
                                <li
                                    key={usuario.id}
                                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted transition-colors"
                                    onClick={() => selecionarUsuario(usuario)}
                                >
                                    <Avatar className="h-9 w-9 shrink-0">
                                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                            {iniciais(usuario.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">
                                            {usuario.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {usuario.email}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
