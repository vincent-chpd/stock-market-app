import { connectToDatabase } from '@/types/database/mongoose';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();

    const state = mongoose.connection.readyState;
    const stateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return Response.json({
      success: true,
      status: stateMap[state] ?? 'unknown',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
