import { api } from "./api";

export const getTreinos = async (userId?: string) => {
    try {
        const response = await api.get("/treino", { params: { userId } });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar treinos:", error);
        throw error;
    }
}

export const countTreinos = async () => {
    try {
        const response = await api.get("/treino", { params: { $count: true } });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar treinos:", error);
        throw error;
    }
}

export const getTreinoById = async (id: number) => {
    try {
        const response = await api.get(`/treino/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar treino por ID:", error);
        throw error;
    }
}

export const createTreino = async (payload: any) => {
    try {
        const response = await api.post("/treino", payload);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar treino:", error);
        throw error;
    }
}

export const updateTreino = async (id: number, payload: any) => {
    try {
        const response = await api.put(`/treino/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar treino:", error);
        throw error;
    }
}