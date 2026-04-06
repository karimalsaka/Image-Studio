import { generateForModel, type GenerateEvent } from '../services/generateService';

const DEFAULT_MODEL = 'google/gemini-2.5-flash-image';

class GenerateController {
    async generate(
        prompt: string,
        size: string | undefined,
        models: string[] | undefined,
        onResult: (event: GenerateEvent) => void,
    ): Promise<void> {
        const modelList = models && models.length > 0 ? models : [DEFAULT_MODEL];

        const promises = modelList.map(async (model) => {
            const event = await generateForModel(prompt, size, model);
            onResult(event);
        });

        await Promise.allSettled(promises);
    }
}

export default GenerateController;
