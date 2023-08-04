/**
 * @param {import('plop').NodePlopAPI} plop
 */
export default function (plop) {
  plop.setGenerator('controller', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message:
          'Provide a singular resource name for the controller, like "pet"\n',
        transformer: (value) => value.toLowerCase(value),
      },
      {
        type: 'input',
        name: 'description',
        message:
          'Provide a description for the controller, like "Pet Controller"\n',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'api/controllers/{{name}}.controller.ts',
        templateFile: 'plop-templates/controller.hbs',
      },
    ],
  })

  plop.setGenerator('migration', {
    description: 'date-named database migration',
    prompts: [
      {
        type: 'input',
        name: 'date',
        message: "Use today's date? (Y/n)",
        default: new Date().toISOString(),
        transform: (value) => {
          return new Date().toISOString()
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'cmd/migrations/{{date}}.ts',
        templateFile: 'plop-templates/migration.hbs',
      },
    ],
  })
}
