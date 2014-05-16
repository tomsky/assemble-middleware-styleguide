# assemble-middleware-kss

Styleguide generator plugin for Assemble using [kss-node](https://github.com/hughsk/kss-node).

##Usage

Register the plugin with Assemble.

```
assemble: {
  options: {
    plugins: ['assemble-middleware-kss'],
    kss: {
	  layout: 'templates/styleguide.hbs',
      src: 'sass',
      dest: 'styleguide'
    }
  }
}
```

##Templates

`assemble-middleware-kss` exposes a toc globally to all pages that can be used to create navigation.

```
{{#each styleguide}}
  <li>
    <a href="{{url}}">{{reference}} - {{header}}</a>
    {{#if sections}}
      <ul>
        {{#each sections}}
          <li>
            <a href="{{url}}#{{reference}}">{{reference}} - {{header}}</a>
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
