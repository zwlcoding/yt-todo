import { withClient } from "../db";

export interface Event {
  id: string;
  userId: string | null;
  eventName: string;
  properties: Record<string, unknown>;
  createdAt: Date;
}

export async function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): Promise<Event> {
  return withClient(async (client) => {
    const result = await client.query(
      `INSERT INTO events (event_name, properties)
       VALUES ($1, $2)
       RETURNING id, event_name, properties, created_at`,
      [eventName, JSON.stringify(properties || {})]
    );
    const row = result.rows[0];
    return {
      id: row.id,
      userId: null,
      eventName: row.event_name,
      properties: row.properties,
      createdAt: row.created_at,
    };
  });
}
