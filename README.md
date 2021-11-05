<aside>
👨🏻‍🏫 Send this homework to: @Sebastian Villegas and @Daniel Restrepo on Slack

</aside>

### **Configuración inicial del proyecto**

En esta primera parte se creará un proyecto node desde 0 y se configurará la primera prueba utilizando mocha. Adicionalmente este proyecto se montará en Github

1. Crear un repositorio en GitHub con el nombre de `workshop-api-testing-js`
2. Seguir las instrucciones para realizar el primer commit
3. [Instalar NodeJS](https://nodejs.org/es/download/package-manager/) en su equipo si no lo tiene instalado
4. Ejecutar en una consola `npm init` dentro de la ruta donde se encuentra el repositorio y colocar la siguiente información:
    
    [Untitled](https://www.notion.so/0792f2dfdab64614b3b4853bc99f7e54)
    
5. Instalar la dependencia de desarrollo mocha, chai
    
    `npm install --save-dev mocha chai`
    
6. Crear el archivo `HelloWord.test.js` dentro de una carpeta test y utilizar el siguiente codigo como contenido
    
    ```jsx
    const { assert } = require('chai');
    
    describe('Array', () => {
      describe('#indexOf()', () => {
        it('should return -1 when the value is not present', function() {
          assert.equal(-1, [1,2,3].indexOf(4));
        });
      });
    });
    ```
    
7. Ejecutar el comando `npm test` y comprobar que la prueba pasa de forma satisfactoria
8. Crear el archivo **.gitignore** en la raíz del proyecto. Ingresar a la página [https://www.gitignore.io/](https://www.gitignore.io/) y en el área de texto agregar el *sistema operativo*, *IDE's* y *NodeJS*, ejemplo *OSX Node VisualStudioCode*. Genere el archivo y cópielo dentro del archivo **.gitignore**
9. Crear el archivo **LICENSE** en la raíz del proyecto con lo especificado en [https://en.wikipedia.org/wiki/MIT_License](https://en.wikipedia.org/wiki/MIT_License) (*Tenga en cuanta cambiar el año y el copyright holders*)
10. Realizar un `commit` donde incluya los 4 archivos modificados con el mensaje **“setup mocha configuration”** y subir los cambios al repositorio

### **Primera Prueba de API**

En esta sesión, crearemos las primeras pruebas consumiendo de distintas formas servicios API Rest. Utilizaremos una librería cliente llamada **superagent** y otra que contiene un enumerador de los principales códigos de respuesta.

1. Crear una nueva rama a partir de master: `git checkout -b <new-branch>`
2. Instalar las dependencia de desarrollo **http-status-codes**
    
    `npm install --save-dev http-status-codes`
    
3. Instalar la dependencias **superagent** y **superagent-promise**. (Tenga en cuenta que estas no son de desarrollo)
    
    `npm install --save superagent superagent-promise`
    
4. Dentro de la carpeta test crear el archivo `MyFirstApiConsume.test.js`
    
    ```jsx
    const agent = require('superagent');
    const statusCode = require('http-status-codes');
    const chai = require('chai');
    
    const expect = chai.expect;
    
    describe('First Api Tests', () => {
    });
    ```
    
5. Agregar una prueba consumiendo un servicio GET
    
    ```jsx
    it('Consume GET Service', async () => {
      const response = await agent.get('https://httpbin.org/ip');
    
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).to.have.property('origin');
    });
    ```
    
6. Agregar una prueba consumiendo un servicio GET con Query Parameters
    
    ```jsx
    it('Consume GET Service with query parameters', async () => {
      const query = {
        name: 'John',
        age: '31',
        city: 'New York'
      };
    
      const response = await agent.get('https://httpbin.org/get').query(query);
    
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.args).to.eql(query);
    });
    ```
    
7. Ejecutar las pruebas.

1. Agregar pruebas consumiendo servicios **HEAD**, **PATCH**, **PUT**, **DELETE** (Utilice [https://httpbin.org/](https://httpbin.org/) para encontrar los servicios) y (la documentación de [superagent](http://visionmedia.github.io/superagent/))
2. Elimine el archivo `test/HelloWord.test.js`
3. Haga commit y push de los cambios.

### **Reporte de Pruebas**

A pesar que mocha nos muestra un reporte por consola, en muchas ocasiones es bueno mostrar un reporte con interfaz gráfica para que los managers o clientes puedan ver los resultados de las pruebas. En esta sesión se configurará un reporte HTML que permite ver los resultados de las pruebas cuando lo ejecutemos localmente

1. Instale la dependencia de desarrollo **mochawesome**
2. Modificar el script test en el `package.json` de la siguiente forma
    
    `"test": "mocha -t 5000 --reporter mochawesome --reporter-options reportDir=report,reportFilename=ApiTesting"`
    
3. Agregar las siguientes líneas dentro del .gitignore
    
    ```jsx
    ## Reports ##
    report
    ```
    
4. Agregar un screenshot del reporte (el archivo HTML abierto en algún navegador) al repositorio

### **Verificación de Código Estático**

Los analizadores de código estático nos permiten estandarizar como los desarrolladores escriben código. En esta sesión se configurará eslint con las reglas de estilo de código propuesto por AirBnb, cómo podemos ejecutar la validación de código y cómo automáticamente se pueden corregir algunas reglas, adicionalmente si no es posible corregirlo de forma automática como poder corregirla.

1. Instalar las dependencias de desarrollo **eslint** **eslint-config-airbnb-base** **eslint-plugin-import**
2. Crear el archivo **.eslintrc.yml** en la raíz del proyecto, con el siguiente contenido
    
    ```yaml
    env:
      es6: true
      node: true
      mocha: true
    extends:
      - eslint:recommended
      - airbnb-base
      - plugin:import/errors
      - plugin:import/warnings
    rules:
      "comma-dangle": ["error", "never
    ```
    
3. Agregar dentro de scripts del **package.json** `"lint": "eslint ./test/**/*.js"`
4. Modificar el script de test agregandole al inicio `npm run lint &&`
5. Ejecute el comando `npm run lint -- --fix` (Esto debe resolverle algunos errores de código estático de forma automática) en caso que todos los errores no se resuelvan investigue en qué consiste el error y resuélvalo

### **Autenticación en GitHub**

En ésta sección se realizarán pruebas al API de Github, en donde se consultarán datos del repositorio que hemos creado y se implementarán mecanismos para trabajar con la autenticación de ésta API.

1. Crear un token de acceso en nuestra cuenta de Github seleccionando (repo, gist, users) y darle acceso público a nuestro repositorios. Recuerde que debe copiar el token ya que no volverá a tener acceso a él. [Documentación](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
2. Dentro de la carpeta test crear el archivo `GithubApi.Authentication.test.js`
    
    ```jsx
    const agent = require('superagent');
    const statusCode = require('http-status-codes');
    const { expect } = require('chai');
    
    const urlBase = 'https://api.github.com';
    const githubUserName = 'AgileTestingColombia';
    const repository = 'workshop-api-testing-js';
    
    describe('Github Api Test', () => {
      describe('Authentication', () => {
        it('Via OAuth2 Tokens by Header', async () => {
          const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');
    
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.description).equal('This is a Workshop about Api Testing in JavaScript');
        });
      });
    });
    ```
    
3. Reemplazar el valor de githubUserName por su usuario de Github.
4. Reemplazar el valor de repository por el nombre del repositorio
5. Establecer la variable de entorno **ACCESS_TOKEN** con el valor del token de acceso.
    
    `export ACCESS_TOKEN=token_de_acceso`
    
6. Ejecutar las pruebas.
7. Adicionar la prueba para autenticación por parámetros.
    
    ```jsx
    it('Via OAuth2 Tokens by parameter', () =>
      agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .query(`access_token=${process.env.ACCESS_TOKEN}`)
        .set('User-Agent', 'agent')
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.description).equal('This is a Workshop about Api Testing in JavaScript');
        }));
    ```
    

### **Consumiendo Métodos GET**

En esta sesión se automatizarán algunas pruebas utilizando métodos GET de la api de Github, se descargará un archivo de menor tamaño y otro de mayor tamaño y se comprobará con su **MD5**

1. Crear el archivo `GithubApi.Repositories.test.js` y dentro de él hacer el resto de pasos
2. Consumir el servicio `https://api.github.com/users/aperdomob` y comprobar el nombre, la compañía y la ubicación del usuario
3. Obtener la lista de los repositorios por medio de hypermedia, y busque un repositorio con el nombre **jasmine-awesome-report** sobre ese repositorio verifique el nombre completo del repositorio, si es privado, y la descripción del repositorio. Utilice el método `find` para encontrar el repositorio que busca [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
4. Descargue el repositorio en un zip y compruebe que descargó de forma adecuada. Aproveche la hypermedia de las anteriores respuesta para formar la url de descarga
5. Obtenga la lista de archivos del repositorio y encuentre el Archivo README.md compruebe su nombre, path y su sha. Use el método containtSubset de chai-subset
6. Por último, descargue el archivo README.md con ayuda del hypermedia y compruebe su md5

### **Consumiendo Métodos PUT**

En esta sesión seguiremos a un usuario de github, comprobaremos que efectivamente lo seguimos y posteriormente volveremos a seguirlo con el fin de comprobar la idempotencia del método **PUT**

1. Crear el archivo GithubApi.Put.test.js y dentro de él hacer el resto de pasos
2. Seguir al usuario aperdomob consumiendo con el método PUT la url [https://api.github.com/user/following/aperdomob.](https://api.github.com/user/following/aperdomob.) Verificar que la consulta devuelve un 204 y que efectivamente el cuerpo venga vacío
3. Consulte la lista de usuario y verifique que efectivamente sigue a aperdomob, puede consumir [https://api.github.com/user/following](https://api.github.com/user/following)
4. Vuelva a llamar el endpoint para seguir al usuario aperdomob y verifique la idempotencia del método

### **Consumiendo métodos POST y PATCH**

En esta sesión crearemos un issue in github con un título, posteriormente modificaremos ese issue agregando un cuerpo

1. Crear el archivo GithubApi.Issue.test.js y dentro de este, codificar los cambios necesarios para los pasos siguientes
2. Obtendremos el usuario logueado mediante el consumo del del servicio `https://api.github.com/user` y verificaremos que tenga al menos un repositorio público
3. Obtendremos la lista de todos los repositorios como ya lo habíamos hecho anteriormente. De todos los repositorios seleccionaremos uno cualquiera y agregamos una verificación que el repositorio exista.
4. A partir del usuario y el nombre del repositorio construimos la url que nos permita crear un issue que contenga solamente un título mediante un método post la estructura de la url es `https://api.github.com/repos/${username}/${repositoryName}/issues`. Verificamos que el título corresponda y que el cuerpo no contenga contenido
5. Modifique el issue agregandole un cuerpo mediante un método PATCH la url usando la url `https://api.github.com/repos/${username}/${repositoryName}/issues/{issueNumber}` verifique que el título no haya cambiado y que contenga el nuevo cuerpo

### **Consumiendo un DELETE y un recurso inexistente**

Se creará un gist posteriormente se verificará que exista. Luego se eliminará ese gist y se comprobará que efectivamente ya no exista.

1. Crear el archivo `GithubApi.Gist.test.js` y dentro de dentro de este, codificar los cambios necesarios para los pasos siguientes
2. Cree un gist con un ejemplo de promesas mediante el método **POST** y la url `https://api.github.com/gists`. Verifique el código de respuesta, la descripción, si es público y el contenido del archivo. Use el método containtSubset de chai-subset
3. Consulte el gist creado mediante la url provisionada por hypermedia y compruebe que el recurso si exista
4. Elimine el gist mediante la misma url usando el método **DELETE**
5. Consulte nuevamente el gist mediante la url y compruebe que el recurso ya no exista

### **Consumiendo HEAD y redireccionando peticiones**

se consumirá por medio de un head un repositorio el cual fue cambiado de nombre para obtener el código de respuesta de redireccionamiento y adicionalmente ver la url a la que debería redireccionar. Posteriormente se consumirá con un **GET** el repositorio que se renombró con el fin de validar que redireccione de forma adecuada.

1. Crear el archivo `GithubApi.Redirect.js` y dentro de dentro de este, codificar los cambios necesarios para los pasos siguientes
2. Consultar con el método `HEAD` la url `https://github.com/aperdomob/redirect-test` y comprobar el código de estado 301 y que tenga la redirección a la url `https://github.com/aperdomob/new-redirect-test`
3. Consultar con el método GET la url [https://github.com/aperdomob/redirect-test](https://github.com/aperdomob/redirect-test) y verificar que redireccione de forma correcta

### **Query parameters**

En esta sesión se enviará query parameters para poder obtener más o menos cantidad de datos en una consulta **get**.

1. Modificar el archivo `GithubApi.Users.test.js` agregando una prueba de cuantos usuarios trae por defecto.
2. Agregar una prueba que obtenga 10 usuarios y verificar que efectivamente traiga 10 usuarios.
3. Agregar una prueba que obtenga 50 usuarios y verificar que efectivamente traiga 50 usuarios.

### **Validación de Esquemas**

En muchas ocasiones debemos verificar que la respuesta que entrega debe cumplir con un esquema generalmente ese tipo de pruebas llevan el nombre de “pruebas de contrato”, una forma sencilla de verificarlo es por medio de json schema validator. Lo que se realizará en este ejercicio es automatizar un solo caso de prueba verificando ese esquema

1. Cree el archivo GithubApi.Contract.test.js con el siguiente contenido
    
    ```jsx
    const agent = require('superagent');
    const chai = require('chai');
    const { listPublicEventsSchema } = require('./schema/ListPublicEvents.schema');
    
    const { expect } = chai;
    chai.use(require('chai-json-schema'));
    
    const urlBase = 'https://api.github.com';
    
    describe('Given event Github API resources', () => {
      describe('When wanna verify the List public events', () => {
        let response;
    
        before(async () => {
          response = await agent
            .get(`${urlBase}/events`)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
        });
    
        it('then the body should have a schema', () => expect(response).to.be.jsonSchema(listPublicEventsSchema));
      });
    });
    ```
    
2. Cree el archivo `schema/ListPublicEvents.schema.js` (En este archivo se agregará el esquema que se validará). Con la siguiente información
    
    ```jsx
    const listPublicEventsSchema = {
    };
    
    exports.listPublicEventsSchema = listPublicEventsSchema;
    ```
    
3. Completar el archivo ListPublicEvents con el esquema que cubra cada una de los keys del json de respuesta, tenga en cuenta tipos de datos (numeros, booleanos, arrays, string, objects), enumeraciones
