import { readFile, writeFile } from 'node:fs/promises'

import { fileURLToPath } from 'url';
import path from 'path';

function resolvePath(relativePath) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))

    return path.resolve(__dirname, relativePath)
}

async function createComponentFromTemplate(fileName, featureName) {
    const template = await readFile(resolvePath('./component.tsx'), { encoding: 'utf-8' })
    template.replaceAll('ComponentName', fileName)

    const outFilePath = featureName
        ? resolvePath(`../app/features/${featureName}/components/${fileName}.tsx`)
        : resolvePath(`../app/components/${fileName}.tsx`)

    await writeFile(outFilePath, template.replaceAll('ComponentName', fileName), { encoding: 'utf-8' })

    console.log(`Component: ${fileName} successfully created.`)
}

async function main() {
    const [componentName, featureName] = process.argv.slice(2)

    if (!componentName) {
        throw new Error('You have to pass a component name as an argument')
    }

    return createComponentFromTemplate(componentName, featureName)
}

main()