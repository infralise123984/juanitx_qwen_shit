export type Enemy = {
    id: string;
    x: number;
    y: number;
    vida: number;
    elemento: HTMLImageElement;
    vivo: boolean;
    textoVida: HTMLDivElement | null;
};