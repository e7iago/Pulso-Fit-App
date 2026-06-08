import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [

    route("login", "routes/login.route.tsx"),
    route("signup", "routes/signup.route.tsx"),

    layout("lib/router-protect.tsx", [
        layout("routes/nav.layout.tsx", [
            index("routes/home.route.tsx"),
            route("treino", "routes/treino.route.tsx"),
            route("exercicios", "routes/exercicio.route.tsx"),
            route("usuarios", "routes/usuario.route.tsx"),
            route("evolucao", "routes/evolucao.route.tsx"),
        ]),
        route("treino/novo", "routes/treinoCadastro.route.tsx"),
        route("treino/:id", "routes/treinoDetalhes.route.tsx"),
        route("exercicios/:id", "routes/exercicioDetalhes.route.tsx"),
        route("usuarios/:id", "routes/usuarioDetalhes.route.tsx"),
        route("evolucao/:id", "routes/evolucaoDetalhes.route.tsx"),
    ])

] satisfies RouteConfig;
