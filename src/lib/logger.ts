import { ISettingsParam, Logger } from "tslog";

let logger = new Logger({
  hideLogPositionForProduction: true,
  minLevel: 3,
});

function setLogger(settings: ISettingsParam<unknown>) {
  logger = new Logger({
    hideLogPositionForProduction: true,
    ...settings,
  });
  logger.debug(`Set Logger with settings ${JSON.stringify(settings)}`);
}

export { logger, setLogger };
