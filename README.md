# assemble-middleware-styleguide

Styleguide generator plugin for Assemble using [kss-node](https://github.com/hughsk/kss-node).

##Usage

Register the plugin with Assemble.

```
assemble: {
  options: {
    plugins: ['assemble-middleware-styleguide'],
    styleguide: {
	  layout: 'templates/styleguide.hbs',
      src: 'sass',
      dest: 'styleguide'
    }
  }
}
```

##Templates

`assemble-middleware-styleguide` exposes a the styleguide data structure globally to all pages and can be used to create navigation.

```
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

To the layout an array of all the sections can be used iterate each section.

```
{{#each sections}}
    <h1>{{reference}} - {{header}}</h1>
    {{{description}}}
    <pre>{{markup}}</pre>
{{/each}}
```
