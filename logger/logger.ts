import "dotenv/config";
import * as winston from "winston";
import { PapertrailTransport } from "winston-papertrail-transport";

const hostname = process.env.PAPERTRAIL_HOSTNAME;
const container = new winston.Container();

const getConfig = (program: string) => {
  const transports = [];

  const papertrailTransport = new PapertrailTransport({
    host: process.env.PAPERTRAIL_HOST,
    port: process.env.PAPERTRAIL_PORT ? Number(process.env.PAPERTRAIL_PORT) : 0,
    hostname,
    program,
  });

  transports.push(papertrailTransport);

  return {
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ level, message }) => `${level} ${message}`)
    ),
    transports,
  };
};

export const logger = (program: string) => {
  return container.add(program, getConfig(program));
};
