import * as yaml from 'js-yaml';
import { useLogger } from './logger';

const { logger } = useLogger()

function yamlToJson(yamlString: string): object {
    try {
        const data = yaml.load(yamlString);
        return data as object;
    } catch (error) {
        logger.error('Error parsing YAML file:', error);
        throw error;
    }
}

export {
    yamlToJson
}
