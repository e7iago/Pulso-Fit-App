import { api } from "./api";

export const getGruposMusculares = async (): Promise<{ id: number; nome: string }[]> => {
    try {
        const response = await api.get("/grupo-muscular");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar grupos musculares:", error);
        throw error;
    }
}

export const getExercicios = async () => {
    try {
        const response = await api.get("/exercicio");
        return response.data;
    } catch (error) {  
        console.error("Erro ao buscar exercícios:", error);
        throw error;
    }
}

export const getExercicioById = async (id: number) => {
    try {
        const response = await api.get(`/exercicio/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar exercício:", error);
        throw error;
    }
}

export const createExercicio = async (exercicioData: any) => {
    try {
        const response = await api.post("/exercicio", exercicioData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar exercício:", error);
        throw error;
    }
}

export const updateExercicio = async (id: number, exercicioData: any) => {
    try {
        const response = await api.put(`/exercicio/${id}`, exercicioData);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar exercício:", error);
        throw error;
    }
}

export const deleteExercicio = async (id: number) => {
    try {
        await api.delete(`/exercicio/${id}`);
    } catch (error) {
        console.error("Erro ao deletar exercício:", error);
        throw error;
    }
}