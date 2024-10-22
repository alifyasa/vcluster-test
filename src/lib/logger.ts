import { ISettingsParam, Logger } from "tslog";

let logger = new Logger({
  hideLogPositionForProduction: true,
  minLevel: 3,
  prefix: ["OLD"],
});

function setLogger(settings: ISettingsParam<unknown>) {
  logger = new Logger({
    hideLogPositionForProduction: true,
    prefix: ["OVERWRITTEN"],
    ...settings,
  });
  logger.debug(`Set Logger with settings ${JSON.stringify(settings)}`);
}

function useLogger() {
  return {
    logger,
    setLogger,
  };
}

export { useLogger };
