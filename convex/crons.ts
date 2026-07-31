import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Collect abandoned rooms once a day, off-peak. See convex/cleanup.ts for the
// conditions — nothing recent or still in play is ever touched.
crons.daily(
  "sweep abandoned rooms",
  { hourUTC: 3, minuteUTC: 0 },
  internal.cleanup.sweepAbandonedRooms,
);

export default crons;
