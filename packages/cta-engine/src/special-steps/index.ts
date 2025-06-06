import { rimrafNodeModules } from './rimraf-node-modules.js'

import type { Environment, Options } from '../types.js'

const specialStepsLookup: Record<
  string,
  (environment: Environment, options: Options) => Promise<void>
> = {
  'rimraf-node-modules': rimrafNodeModules,
}

export async function runSpecialSteps(
  environment: Environment,
  options: Options,
  specialSteps: Array<string>,
) {
  if (specialSteps.length) {
    environment.startStep({
      id: 'special-steps',
      type: 'command',
      message: 'Removing node_modules...',
    })

    for (const step of specialSteps) {
      const stepFunction = specialStepsLookup[step]
      /* eslint-disable @typescript-eslint/no-unnecessary-condition */
      if (stepFunction) {
        await stepFunction(environment, options)
      } else {
        environment.error(`Special step ${step} not found`)
      }
    }

    environment.finishStep('special-steps', 'Special steps complete')
  }
}
