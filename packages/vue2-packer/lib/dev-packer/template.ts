export const  getServerTemplate = (template: string, { isDev }): string => {
  // const headScripts = [
  //   '{{{ meta.inject().meta ? meta.inject().meta.text() : \'\' }}}',
  //   '{{{ meta.inject().title ? meta.inject().title.text() : \'\' }}}',
  //   '{{{ meta.inject().style ? meta.inject().style.text() : \'\' }}}',
  //   '{{{ meta.inject().link ? meta.inject().link.text() : \'\' }}}',
  //   '{{{ meta.inject().script ? meta.inject().script.text() : \'\' }}}',
  //   '</head>',
  // ].join('\n');

  //  return template.replace('</head>', headScripts);
  return template;
}
