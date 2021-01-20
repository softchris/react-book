# JSX

> Sígumeme en [Twitter](https://twitter.com/chris_noring), feliz de tomar sus sugerencias sobre temas o mejoras /Chris

Este capítulo cubre los siguientes temas:

- **Qué es JSX**. JSX es algo que usas todo el tiempo en React. Vamos a explicar que es.
- **Por qué usarlo**. Puedes optar por no usar JSX pero casi nadie lo hace, y te hace la vida mas sencilla.

## Qué y por qué

JSX Es como estar escribiendo XML in JavaScript. Es un paso previo al _procesador_. No necesitas tenerlo, Pero te hace la vida mucho más fácil.

### Ejemplo simple

Este es un ejemplo simple en una linea de código:

```js
const Elem = <h1>Some title</h1>;

// Y puedes usarlo en React así:
<div>
  <Elem />
</div>
```

La declaración anterior de `Elem` Parece XML en JavaScript. Entonces, ¿qué es lo que pasa? cuando se está procesando, Se convierte en el siguiente Codigo de ES5:

```js
React.createElement('Elem', null, 'Some title');
```

Ok Entonces llamando `createElement`, Aquí están los parametros:

- **Primer parámetro, nombre del elemento**.`Elem` se convierte en el nombre del elemento.
- **Segundo parámetro, atributos**. el segundo argumento anterior es `null` y representa nuestros atributos del elemento, del cual no tenemos ninguno.
- **Tercer parámetro, Valor del elemento**. el tercer y último argumento es el valor del elemento.

#### Ejemplo con atributos

Veamos un ejemplo acontinuacion donde le damos un atributo :

```js
const Elem = <h1>Some title</h1>;

// Uso:
<div>
  <Elem title="a title">
</div>
```

Lo anterior se convertiría en el siguiente código:

```js
React.createElement(
  'Elem', 
  { 
    title: 'a title' 
  }, 
  'Some title'
);
```

Arriba podemos ver que nuestro atributo `title` ahora es parte del segundo argumento.

### Multilínea

La mayoría del tiempo, definirás JSX en varias filas diferentes y comenzarás de nuevo, podría desconcertarte el porqué no funciona

la solución es envolver multiples elementos entre paréntesis `()`, de la siguiente forma:

```jsx
const Elem =
(
  <div>
    <h1>Some title</h1>
    <div>Some content</div>
  </div>
)
```

### Un padre

JSX Necesita tener un padre. Lo siguiente sería **incorrecto**:

```html
<!-- sería incorrecto, no hay un elemento padre -->
const Elem =
(
  <h1>Some title</h1>
  <div>Some content</div>
)
```

Puedes arregarlo así:

- **Envolviendolo en un elemento**. Puedes envolver tu contenido en un elemento div así:

   ```html
    const Elem =
    (
      <div>
        <h1>Some title</h1>
        <div>Some content</div>
      </div>
    )
    ```

- **Usa `React.Fragment`**. Puedes envolverlos en un `React.Fragment`, Así:

    ```html
    const Elem = (
    <React.Fragment>
      <h1>Some title</h1>
      <div>Some content</div>
    </React.Fragment>
    )
    ```

`React.Fragment` Sería el elemento padre en vez de usar un `div`.

## Resumen

Esto es prácticamente todo lo que necesitamos saber sobre el tema de JSX para poder trabajar con él:

- Es como XML que se traduce a llamadas de `React.createElement()`.
- Multilínea necesita paréntesis para funcionar.
- Necesitas tener un elemento padre, `React.Fragment` Es una buena opcion para eso.
