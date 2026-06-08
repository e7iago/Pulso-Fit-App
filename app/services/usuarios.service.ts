import { api } from "./api";

export const getUsuarios = async (search?: string) => {
    try {
        const response = await api.get(
            "/usuario",
            {
                params: {
                    search
                }
            });

        return response.data;
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        throw error;
    }
}

export const getUsuarioById = async (id: string) => {
    try {  
        const response = await api.get(`/usuario/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar usuário com ID ${id}:`, error);
        throw error;
    }
}

export const updateRoleUsuario = async (id: string, role: string) => {
    try {
        const response = await api.put(`/usuario/${id}/role`, { role });
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar role do usuário com ID ${id}:`, error);
        throw error;
    }
}

export const userHasPermission = async (projeto: string) : Promise<boolean> => {
    try {
        const response = await api.get("/permissao", {
            params: {
                projeto
            } 
        });

        const { success } = response.data;

        return success || false;
    } catch(error) {
        console.error("Erro ao verificar permissão do usuário:", error);
        throw error;
    }
}

export const getAllRoles = async () => {
    try {
        const response = await api.get("/permissao/roles");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar roles disponíveis:", error);
        throw error;
    }
}