export interface ParseResult {
    title: string;
    dueDate: Date | null;
}
export declare function parseNaturalDate(input: string): ParseResult;
