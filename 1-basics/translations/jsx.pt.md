# JSX

> Me siga no [Twitter](https://twitter.com/chris_noring), fico feliz em receber sugestões de tópicos ou melhoras /Chris

Este capítulo fala sobre os seguintes tópicos:

- **O que é JSX**. JSX é algo que você usa o tempo todo em React. Vamos explicar o que é isso.
- **Por que utilizar isso**. Você poder escolher não utilizar JSX mas quase ninguém faz isso, além de que JSX deixa a sua vida mais simples.

## O que e Por que

JSX é basicamente você escrever XML em JavaScript. É um passo _pré-processador_. Você não tem que tê-lo, mas ele faz a sua vida bem mais fácil.

### Exemplo simples

Este é um simples exemplo em uma linha de código:

```js
const Elem = <h1>Algum título</h1>;

// e você pode usá-lo em React assim:
<div>
  <Elem />
</div>
```

A declaração `Elem` acima parece com XML em JavaScript. Então o que acontece? Quando ela está sendo processada, ela se torna no seguinte código em ES5:

```js
React.createElement('Elem', null, 'Algum título');
```

Ok, então chamando `createElement`, aqui estão os parâmetros:

- **Primeiro parâmetro, nome do elemento**.`Elem` se trona o nome do elemento.
- **Segundo parâmetro, atributos**. O segundo parâmetro acima é `null` e representa os atributos do nosso elemento, os quais não temos nenhum.
- **Terceiro parâmetro, valor do elemento**. O terceiro e último argumento é o valor do elemento.

#### Exemplo com atributos

Vamos ver um exemplo abaixo ao qual damos atributos:

```js
const Elem = <h1>Algum título</h1>;

// uso:
<div>
  <Elem titulo="um título">
</div>
```

O código acima se torna o seguinte:

```js
React.createElement(
  'Elem', 
  { 
    titulo: 'um título' 
  }, 
  'Algum título'
);
```

Acima podemos ver que nosso atributo `titulo` é agora parte de nosso segundo argumento.

### Multiline

Na maioria das vezes você vai definir JSX em várias linhas diferentes e, começando do zero, você pode ficar surpreso por que ele não funciona.

A solução é envolver vários elementos entre parênteses `()`, assim:

```jsx
const Elem =
(
  <div>
    <h1>Algum título</h1>
    <div>Algum conteúdo</div>
  </div>
)
```

### One parent
### Um pai

JSX precisa ter um pai. O seguinte seria **incorreto**:

```html
<!-- seria incorreto, sem elemento pai -->
const Elem =
(
  <h1>Algum título</h1>
  <div>Algum conteúdo</div>
)
```

Você pode corrigir isso fazendo uma das opções:

- **Envolvendo-o em um elemento**. Você pode envolver seu conteúdo em um elemento div, assim:

   ```html
    const Elem =
    (
      <div>
        <h1>Algum título</h1>
        <div>Algum conteúdo</div>
      </div>
    )
    ```

- **Usando `React.Fragment`**. Você pode envolvê-lo em um `React.Fragment`, assim:

    ```html
    const Elem = (
    <React.Fragment>
      <h1>Algum título</h1>
      <div>Algum conteúdo</div>
    </React.Fragment>
    )
    ```

`React.Fragment` seria o elemento pai, em vez de usarmos um `div`.

## Resumo

Isso é basicamente tudo que precisamos saber sobre o tópico JSX para poder trabalhar com ele:

- É como XML que é traduzido para chamadas de `React.createElement()`.
- Multiline precisa de parênteses para funcionar.
- Você precisa ter um elemento pai, `React.Fragment` é uma boa opção para isso.
