import { Queue, Worker } from "bullmq";
import { redisConnection } from "../config/queue.js";
import logger from "../config/logger.js";

export const emailQueuename = "email-queue";

export const emailQueue = new Queue(emailQueuename, {
  connection: redisConnection,
  defaultJobOptions: {
    delay: 5000,
    removeOnComplete: {
      count: 100,
      age: 60 * 60 * 24,
    },
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnFail: {
      count: 1000,
    },
  },
});

//workerr

export const handler = new Worker(emailQueuename, async (job) => {
  console.log("The Email workder data is ", job.data);
});

handler.on("completed", (job) => {
  logger.info({ id: job.id, message: job });
  console.log(`The job ${job.id} is completed`);
});

handler.on("failed", (job) => {
  logger.error(job);
});
