# Styled components (Componentes estilizados)

> La biblioteca de estilos para tus aplicaciones React, que deberías probar lo bien que funciona

> Sígueme en [Twitter](https://twitter.com/chris_noring), feliz de tomar sus sugerencias sobre temas o mejoras /Chris

![](https://miro.medium.com/max/1400/1*6LTIW-LlQA6blkqums6V3g.jpeg)

Hay un montón de formas de diseñar componentes en React. Esta es probablemente mi forma favorita de hacerlo y difiere conceptualmente de otras formas de estilo.

## El caso sugerido para estilizar componentes

Cuando comience a diseñar sus componentes de React, puede optar por definir clases de CSS y asignarlas a cada elemento, así:

```html
<div className="”card”">
  <div className="”card-header”">
    <h3>{card.header}</h3>
  </div>
  <div className="”content”">{card.content}</div>
</div>
```

Realmente no hay nada de malo en lo anterior, es un enfoque viable aunque algunos de ustedes piensen que se esta repitiendo mucho la palabra `className`.

En este punto, puede argumentar que puedo crear un componente para la tarjeta, el encabezado de la tarjeta y el contenido de la tarjeta, respectivamente. Sí, podemos hacer eso. Entonces podría verse así en su lugar:

```jsx
<card header={card.header}>{card.content}</card>
```

Ahora, este ejemplo puede ser un poco trivial y podría ser pan comido para hacer tal componente. Además, todos sabemos lo fácil que es crear componentes en React.

Entonces, lo que debe preguntarse es si realmente necesito un componente para eso, cuando todo lo que quiero hacer es agregar un poco de estilo CSS y nombrar mi elemento HTML como me plazca. Si aquí es donde se dirigen sus pensamientos, ¿tal vez la biblioteca de componentes estilizados podría ser para usted?

## Instalación y configuración de componentes con estilo

Simplemente podemos instalar `styled-components` a través de NPM, así:

```
yarn add styled-components
// OR
npm install — save styled-components
```

Después de esto, estamos listos para usarlo en nuestro proyecto React.

## Nuestro primer estilo

El ejemplo que utiliza la página de inicio de esta biblioteca es el de los botones. Puede terminar creando diferentes botones destinados a diferentes propósitos en su aplicación. Es posible que tenga botones predeterminados, botones primarios, botones deshabilitados, etc. La libreria styled-components le permite mantener todo ese CSS en un solo lugar. Comencemos importándolo:

```
import styled from ‘styled-components’;
```

Ahora para usarlo necesitamos usar el carácter de acento grave `` ` ``, asi:

```
const Button = styled.button``;
```

En este punto, no tenemos nada que funcione, pero podemos dar un vistazo a la sintaxis.

Como podemos ver arriba, hacemos un componente con esta sintaxis

```
styled.nombreElemento``
```

Para definir un estilo a nuestro componente, Se vería así:

```css
const Button = styled.button`
  background: black;
  color: white;
  border-radius: 7px;
  padding: 20px;
  margin: 10px;
  font-size: 16px;
  :disabled {
    opacity: 0.4;
  }
  :hover {
    box-shadow: 0 0 10px yellow;
  }
`;
```

Lo que podemos ver en el ejemplo anterior es que podemos usar propiedades CSS normales en combinación con pseudo selectores como `:disabled` y `: hover`.

Si queremos usar nuestro botón como parte de nuestro JSX, simplemente podemos hacerlo, así:

```jsx
<div>
  <Button>click aquí</Button>
</div>
```

Podemos entremezclar nuestro `Button` con todo el HTML o JSX que queramos y podemos tratarlo como el elemento HTML `button`, porque eso es lo que es un boton con algunos estilos CSS añadidos.

### Usando atributos

La biblioteca `styled-component` puede aplicar estilos condicionalmente buscando la ocurrencia de un atributo específico en nuestro elemento. Podemos usar los atributos existentes y los personalizados que inventamos.

A continuación, tenemos un ejemplo de cómo definir un botón "primary". ¿Qué queremos decir con "primary" versus un botón "normal"? Pues en una aplicación tenemos todo tipo de botones, normalmente tenemos un botón por defecto, pero también tenemos un botón principal, este es el botón más importante de esa página y suele realizar cosas como guardar un formulario.

Es un escenario bastante común diseñar un botón principal de una manera diferente, por lo que vemos una diferencia entre dicho botón y un botón "normal" para que el usuario comprenda la gravedad de presionarlo.

Veamos ahora cómo diseñamos un botón de este tipo y mostramos el uso de atributos con "styled-components". Tenemos nuestro Botón con estilo y podemos agregar el atributo `primary`, así:

```jsx
<Button primary>Soy un botón principal</Button>
```

Nuestro siguiente paso es actualizar nuestro "Button" y escribir alguna lógica condicional si este atributo "primary" está presente.

Lo podemos hacer de la siguiente manera:

```css
${props => props.primary && css`
`}
```

Usamos `${}` para indicar que estamos ejecutando alguna lógica condicional y nos referimos a algo llamado `props`. `props` es simplemente un objeto que contiene todos los atributos de nuestro elemento. Como puede ver arriba, estamos diciendo que `props.primary` debe ser _verdadero_, está definido en nuestro objeto de atributos. Si ese es el caso, aplicaremos estilo CSS. Podemos distinguir este último del código anterior mediante el uso de la función css.

A continuación, usamos la construcción anterior y agregamos algunos estilos que solo debemos aplicar si el atributo `primary` está presente:

```css
const Button = styled.button`
  background: black;
  color: white;
  border-radius: 7px;
  padding: 20px;
  margin: 10px;
  font-size: 16px;
  :disabled {
    opacity: 0.4;
  }
  :hover {
    box-shadow: 0 0 10px yellow;
  }
  ${props => props.primary && css`
    background: green;
    color: white;
  `}
`;
```

Ahora tenemos un ejemplo más completo de cómo probar la existencia de un atributo en particular. Importante, dijimos que necesitábamos usar la función `css`. Esta es una función que encontramos en la libreria `styled-components` y, por lo tanto, podemos usarla actualizando nuestra declaración de importación para que se vea así:

```js
import styled, { css } from "styled-components";
```

### Adaptación

Hemos mostrado cómo podemos ver si existen ciertos atributos, pero también podemos establecer diferentes valores en una propiedad dependiendo de si existe un atributo.

Echemos un vistazo al siguiente código donde cambiamos el "border-radius" dependiendo de si se establece un atributo "circle":

```css
const Button = styled.button`
  background: black;
  color: white;
  border-radius: 7px;
  padding: 20px;
  margin: 10px;
  font-size: 16px;
  :disabled {
    opacity: 0.4;
  }
  :hover {
    box-shadow: 0 0 10px yellow;
  }
  ${props => props.primary && css`
    background: green;
    color: white;
  `}
  border-radius: ${props => (props.round ? ‘50%’ : ‘7px’)}
`;
```

La parte interesante del código es esta:

```css
border-radius: ${props => (props.round ? ‘50%’ : ‘7px’)}
```

Podemos activar el código anterior para que se renderice declarando nuestro Botón así:

```jsx
<Button round>Redondeado</Button>
```

## Aplicar estilo a un componente existente

Este es ideal para diseñar componentes de terceros o uno de sus propios componentes. Imagina que tienes los siguientes componentes:

```js
// Text.js

import React from ‘react’;
import PropTypes from ‘prop-types’;

const Text = ({ text }) => (
  <div> Here is text: {text}</div>
);
Text.propTypes = {
  text: PropTypes.string,
  className: PropTypes.any,
};
export default Text;
```

Ahora, para diseñar este componente, necesitamos usar la función de estilo de una manera un poco diferente. En lugar de escribir

```
styled``
```

Necesitamos llamar la función, pasándole como parámetro el componente a diseñar, así:

```js
const DecoratedText = styled(Text)`
  // define styles
`;
<DecoratedText text={“I am now decorated”} />
```

En el componente, debemos tomar el `className` como parámetro en las` props` y asignarlo a nuestro div de nivel superior, así:

```js
// Text.js
import React from ‘react’;
import PropTypes from ‘prop-types’;

const Text = ({ text, className }) => (
  <div className={className}> Here is text: {text}</div>
);
Text.propTypes = {
  text: PropTypes.string,
  className: PropTypes.any,
};
export default Text;
```

Como puede ver arriba, llamar a la función `styled()` significa que debajo de cuerda produce un `className` que inyecta en nuestro componente que necesitamos establecer en nuestro elemento de nivel superior, para que surta efecto.

### Herencia

Podemos tomar fácilmente un estilo existente y extender sus estilos usando el método `extend`, así:

```js
const GiantButton = Button.extend`
  font-size: 48px;
`;
```

## Cambiar componentes con estilo

En algunos casos, es posible que desee aplicar el estilo previsto para un tipo específico de elemento y aplicarlo a otro tipo de elemento. Un ejemplo común es un botón. Es posible que le guste todo el estilo que viene con un botón específico, pero es posible que desee aplicarlo en un elemento de anclaje. Usar el método `withComponent()` le permite hacer precisamente eso:

```js
const LinkButton = Button.withComponent("a");
```

El resultado final de la operación anterior es un ancla, una etiqueta `a` con todo el estilo de un botón.

## Usando la función de atributo

A veces, todo lo que necesitamos es cambiar una pequeña cosa en el estilo del componente. Para eso, la función `attrs()` nos permite agregar una propiedad con un valor. Ilustremos cómo podemos agregar esto:

```js
const FramedText = styled(Text).attrs({ title: ‘framed’ })`
  border: solid 2px black;
  color: blue;
  font-size: 16px;
  padding: 30px;
`;
```

Arriba hemos encadenado `styled()` y `attrs()` y terminamos con una marca doble `` ` `` . Otro ejemplo seria:

```js
const Button = styled.button.attrs({ title: ‘titled’ })`
  background: black;
  color: white;
  border-radius: 7px;
  padding: 20px;
  margin: 10px;
  font-size: 16px;
  :disabled {
    opacity: 0.4;
  }
  :hover {
    box-shadow: 0 0 10px yellow;
  }
  ${props => props.primary && css`
    background: green;
    color: white;
  `}
  border-radius: ${props => (props.round ? ‘50%’ : ‘7px’)}
`;
```

## Theming (Temas)

Styled-component exporta un `ThemeProvider` que nos permite aplicar temas fácilmente a nuestros componentes con estilo. Para que funcione, debemos hacer lo siguiente:

- **importar** el ThemeProvider
- **fijar** esto como un elemento en la raíz de la App
- **definir** un tema
- **referenciar** a una propiedad en el tema y establecerla en una propiedad CSS deseada

### Preparar

En el componente donde pretendemos usar un `Theme`, necesitamos importar y declarar un` ThemeProvider`. Ahora, este puede ser el elemento raíz de toda la aplicación o el componente en el que se encuentra. `ThemeProvider` inyectará una propiedad `theme` dentro de todos los componentes o del componente al que lo agrego y todos sus elementos secundarios. Veamos cómo agregarlo globalmente:

```jsx
ReactDOM.render(
  <ThemeProvider theme={{ color: ‘white’, bgcolor: ‘red’ }}>
    <App />
  </ThemeProvider>,
  document.getElementById(‘root’),
);
```

Ahora estamos listos para cambiar nuestros componentes acordes para comenzar a usar el tema que establecimos.

Tomemos el componente Button que definimos y hagamos que use nuestro tema, así:

```js
const Button = styled.button.attrs({ title: ‘titled’ })`
  background: ${props => props.theme.bgcolor};
  color: ${props => props.theme.color};
  border-radius: 7px;
  padding: 20px;
  margin: 10px;
  font-size: 16px;
  :disabled {
    opacity: 0.4;
  }
  :hover {
   box-shadow: 0 0 10px yellow;
  }
  ${props => props.primary && css`
    background: green;
    color: white;
  `}
  border-radius: ${props => (props.round ? ‘50%’ : ‘7px’)}
`;
```

Acerquémonos a lo que hicimos:

```css
background: ${props => props.theme.bgcolor};
color: ${props => props.theme.color};
```

Como puede ver, podemos acceder a la propiedad de los temas escribiendo `props.theme.[nombreDeLaPropiedad]`.

### Tema como una fábrica de componentes de orden superior

Si queremos usar el tema dentro de un componente, podemos hacerlo, pero necesitamos usar un ayudante llamado `withTheme()`. Toma un componente y la propiedad del tema, así:

```js
import { withTheme } from "styled-components";

class TextComponent extends React.Component {
  render() {
    console.log("theme ", this.props.theme);
  }
}
export default withTheme(TextComponent);
```

## En resumen

Hemos introducido una nueva forma de diseñar nuestros componentes utilizando la biblioteca `styled-components`.

También hemos aprendido que obtenemos una declaración de elementos más semántico de nuestros componentes cuando lo comparamos con la forma clásica de estilo usando `className` y asignando dichas clases de propiedad CSS.

### Lectura adicional

La documentación oficial proporciona un excelente ejemplo de cómo desarrollar aún más su conocimiento [styled-components documentación oficial](https://www.styled-components.com/)

Con suerte, esto puede ser convincente de que esta es una buena forma de diseñar tus componentes React. Desde que encontré esta biblioteca, esto es todo lo que uso, pero ese soy yo, tú eres el que decide :)
