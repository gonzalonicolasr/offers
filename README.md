# ag-highlighted-offers

Aplicación para obtener ofertas destacadas para un cliente.

## Requisitos

- [Node.js 18.x](https://nodejs.org/en/) - Se recomienda utilizar [NVM](https://github.com/nvm-sh/nvm) para su instalación. Ejecutar:

   ```bash
   $ nvm use
   ```

- [Nest CLI](https://docs.nestjs.com/cli/overview)
- [Acceso a la cuenta Switch-Dev en AWS](https://teco.awsapps.com/start/) - [¿Cómo lo gestiono?](#preguntas-frecuentes)

## Configuración

1. Instalar las dependencias del proyecto:

   ```bash
   $ npm install
   ```
   
## Desarrollo

1. Establecer la variable de entorno `NODE_ENV`:

   ```bash
   $ # Linux & macOS
   $ export NODE_ENV=local

   $ # Windows (CMD)
   $ SET NODE_ENV=local

   $ # Windows (PowerShell)
   $ $Env:NODE_ENV = "local"
   ```
   
2. Servir la aplicación localmente:

   ```bash
   $ npm run start:dev
   ```

## Comandos de la aplicación

```bash
$ # Compila la aplicación.
$ # Más información en https://docs.nestjs.com/cli/usages#nest-build
$ npm run build

$ # Compila y sirve la aplicación.
$ # Más información en https://docs.nestjs.com/cli/usages#nest-start
$ npm run start

$ # Compila y sirve la aplicación en modo observador.
$ npm run start:dev

$ # Compila y sirve la aplicación en modo observador; adjunta el depurador de
$ # Node.js en el puerto 9229.
$ npm run start:debug

$ # Ejecuta la aplicación en modo REPL.
$ # Más información en https://docs.nestjs.com/recipes/repl
$ npm run start:repl

$ # Sirve la aplicación en modo producción; requiere compilación previa.
$ npm run start:prod

$ # Ejecuta Prettier para formatear el código.
$ npm run format

$ # Ejecuta ESLint para examinar el código en búsqueda de errores de sintaxis y
$ # prácticas inapropiadas.
$ npm run lint

$ # Ejecuta las pruebas unitarias; definidas en el directorio `src`.
$ npm run test

$ # Ejecuta las pruebas unitarias en modo observador.
$ npm run test:watch

$ # Genera un reporte de cobertura de código en el directorio `coverage`.
$ npm run test:cov

$ # Ejecuta las pruebas de extremo a extremo; definidas en el directorio `test`.
$ npm run test:e2e

 # Ejecuta todas las pruebas del proyecto.
$ npm run test:all
```

## Preguntas frecuentes

**P**: ¿Cómo gestiono el acceso a la cuenta Switch-Dev en AWS?

**R**: Ingresa a [TU id](https://tuid.telecom.com.ar) y solicita el siguiente acceso:

- **Sistema**: AWS Cloud
- **Aplicación**: SWITCH-Developer
- **Perfil**: Developer
