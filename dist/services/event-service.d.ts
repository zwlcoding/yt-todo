export interface Event {
    id: string;
    userId: string | null;
    eventName: string;
    properties: Record<string, unknown>;
    createdAt: Date;
}
export declare function trackEvent(eventName: string, properties?: Record<string, unknown>): Promise<Event>;
