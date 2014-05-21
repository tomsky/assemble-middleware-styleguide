# assemble-middleware-styleguide

> Styleguide generator plugin for Assemble. Generates a styleguide based on Knyle Style Sheets (KSS), a documentation syntax for CSS.

##Install 

Install with npm:

```bash
npm install assemble-middleware-styleguide --save-dev
```

Register the plugin with Assemble.

```js
options: {
  plugins: ['assemble-middleware-styleguide'],
  styleguide: {
	layout: 'templates/styleguide.hbs',
    src: 'sass',
    dest: 'styleguide'
  }
}
```

###Options

####options.layout
Type: `String`

Path to the file that renders the styleguide.

####options.src
Type: `String`

Path to the folder to scann for kss documentation

####options.dest
Type: `String`

Path to where the styleguide should be written

##Usage

`assemble-middleware-styleguide` exposes the entire styleguide data structure globally.

Given that your css looks something like this…

```css
// Shovel coal
//
// Maybe it was the other George Michael. You know, the singer-songwriter.
//
// Markup:
// <a href="#" class="button {$modifiers}">Buster</a>
//
// :hover - Popcorn shrimp
// .disabled - Club sauce
//
// Styleguide 3

a.button{
  …
}

// Heyyyy Uncle Father Oscar
//
// It's so watery. And yet there's a smack of ham to it.
//
// Markup:
// <button class="button">Buster</button>
//
// Styleguide 3.1

button.button{
  …
}

// Operation Hot Mother
//
// Excuse me while I circumvent you. Look what the homosexuals have done to me!
//
// Markup:
// <input class="button" type="submit" value="button" />
//
// Styleguide 3.1.1

input.button{
  …
}
```

… a structure like this is available in Assemble through the variable `styleguide`'.


```js
[ 
  { 
    raw: 'Shovel coal\n\nMaybe it was the other George Michael…',
    header: 'Shovel coal',
    description: '<p>Maybe it was the other George Michael. You know, the singer-songwriter.</p>\n',
    modifiers: [
	  { 
        name: ':hover',
        description: '<p>Popcorn shrimp</p>\n',
        classname: '.pseudo-class-hover',
        markup: '<a href="#" class="button pseudo-class-hover">Buster</a>' 
      },{ 
        name: '.disabled',
        description: '<p>Club sauce</p>\n',
        classname: '.disabled',
        markup: '<a href="#" class="button disabled">Buster</a>' 
      }
    ],       
    markup: '<a href="#" class="button {$modifiers}">Buster</a>',
    reference: '3',
    refDepth: 1,
    deprecated: false,
    experimental: false,
    refParts: [ 3 ],
    sections: [ 
      {
        raw: 'Heyyyy Uncle Father Oscar\n\nIt\'s so watery. And ye…',
        header: 'Heyyyy Uncle Father Oscar',
        description: '<p>It&#39;s so watery. And yet there&#39;s a smack of ham to it.</p>\n',
        modifiers: [],
        markup: '<button class="button">Buster</button>',
        reference: '3.1',
        refDepth: 2,
        deprecated: false,
        experimental: false,
        refParts: [ 3, 1 ],
        sections: [
          { 
            raw: 'Operation Hot Mother\n\nExcuse me while I circumvent you. Look what the…',
            header: 'Operation Hot Mother',
            description: '<p>Excuse me while I circumvent you. Look what the homosexuals have done to me!</p>\n',
            modifiers: [],
            markup: '<input class="button" type="submit" value="button" />',
            reference: '3.1.1',
            refDepth: 3,
            deprecated: false,
            experimental: false,
            refParts: [ 3, 1, 1] 
          }
        ]
      },
      …
    ]
  }
] 
```

```handlebars
{{#each styleguide}}
  <li>
    <a href="section-{{refParts.0}}.html#{{reference}}"">{{reference}} - {{header}}</a>
    {{#if sections}}
      <ul>
        {{#each sections}}
          <li>
            <a href="section-{{refParts.0}}.html#{{reference}}"">{{reference}} - {{header}}</a>
          </li>
        {{/each}}
      </ul>
  </li>
{{/each}}
```

Additionally, through the array `sections` all sections under each top level reference is  available. 

```js
[ 
  { 
    raw: 'Shovel coal\n\nMaybe it was the other George Michael…',
    header: 'Shovel coal',
    description: '<p>Maybe it was the other George Michael. You know, the singer-songwriter.</p>\n',
    modifiers: [
      { 
        name: ':hover',
        description: '<p>Popcorn shrimp</p>\n',
        classname: '.pseudo-class-hover',
        markup: '<a href="#" class="button pseudo-class-hover">Buster</a>' 
      },{ 
        name: '.disabled',
        description: '<p>Club sauce</p>\n',
        classname: '.disabled',
        markup: '<a href="#" class="button disabled">Buster</a>' 
      }
    ],       
    markup: '<a href="#" class="button {$modifiers}">Buster</a>',
    reference: '3',
    refDepth: 1,
    deprecated: false,
    experimental: false,
    refParts: [ 3 ] 
  },{ 
    raw: 'Heyyyy Uncle Father Oscar\n\nIt\'s so watery. And ye…',
    header: 'Heyyyy Uncle Father Oscar',
    description: '<p>It&#39;s so watery. And yet there&#39;s a smack of ham to it.</p>\n',
    modifiers: [],
    markup: '<button class="button">Buster</button>',
    reference: '3.1',
    refDepth: 2,
    deprecated: false,
    experimental: false,
    refParts: [ 3, 1 ] 
  },{ 
    raw: 'Operation Hot Mother\n\nExcuse me while I circumvent …',
    header: 'Operation Hot Mother',
    description: '<p>Excuse me while I circumvent you. Look what the homosexuals have done to me!</p>\n',
    modifiers: [],
    markup: '<input class="button" type="submit" value="button" />',
    reference: '3.1.1',
    refDepth: 3,
    deprecated: false,
    experimental: false,
    refParts: [ 3, 1, 1 ] 
  } 
]
```

```handlebars
{{#each sections}}
  <h1>{{reference}} - {{header}}</h1>
  {{{description}}}
  <div>{{{markup}}}</div>
  <pre>{{markup}}</pre>
{{/each}}
```
