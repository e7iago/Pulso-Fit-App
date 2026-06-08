import { api } from "./api";

export const getEvolucaoUsuario = async (userId?: string) => {
    try {
        const response = await api.get(`/evolucao`,
            {
                params: { userId }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar evolução do usuário:", error);
        throw error;
    }
}

export const getAvaliacao = async (id: number) => {
    try {
        const response = await api.get(`/evolucao/${id}`);
        return response.data;
    } catch (error) {        
        console.error("Erro ao buscar avaliação:", error);
        throw error;
    }
}

export const createAvaliacao = async (avaliacaoData: any) => {
    try { 
        const response = await api.post(`/evolucao`, avaliacaoData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar avaliação", error);;
        throw error;
    }
}

export const deleteExercicio = async (id: number) => {
    try {
        await api.delete(`/evolucao/${id}`);
    } catch (error) {
        console.error("Erro ao deletar exercício:", error);
        throw error;
    }
}