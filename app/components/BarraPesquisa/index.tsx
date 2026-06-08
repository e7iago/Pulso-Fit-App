import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { Search } from "lucide-react";

type BarraPesquisaProps = {
    onSearch: (valor: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function BarraPesquisa({ onSearch, placeholder, disabled = false }: BarraPesquisaProps) {
    const [pesquisa, setPesquisa] = useState("");

    const pesquisar = () => {
        onSearch(pesquisa);
    }

    return (

        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder={placeholder}
                        value={pesquisa}
                        onChange={(event) => { setPesquisa(event.target.value) }}
                        onBlur={() => pesquisar()}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter')
                                pesquisar()
                        }}
                        className="pl-10 h-10"
                        disabled={disabled}
                    />
                </div>
            </CardContent>
        </Card>
    )
}