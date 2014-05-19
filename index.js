/*
 * assemble-middleware-kss
 * https://github.com/tomsky/assemble-middleware-kss
 *
 * Copyright (c) 2014 Tom-Marius Olsen
 * Licensed under the MIT license.
 */

var fs = require('fs');
var kss  = require('kss-parse');
var _ = require('lodash-node');

module.exports = function(params, done) {
    'use strict';

    var grunt   = params.grunt;
    var options = params.assemble.options.kss || {};
    var tmpl    = fs.readFileSync(options.layout, 'utf8');

    if(!_.isUndefined(options)){

        console.log('assemble-middleware-kss');

        kss.getSections(options.src, { mask: '*.scss' }, function(err, styleguide) {
            if (err) throw err;

            //Add the styleguide toc to assemble globlally
            params.assemble.options.data.styleguide = styleguide;

            _.forEach(styleguide, function(val, key){
                var sections = kss.flattenSection(val);
                params.assemble.options.pages.push({
                    data: { sections: sections },
                    dest: options.dest + '/section-' + val.refParts[0] + '.html',
                    page: tmpl,
                });
            });

            done();
        });
    }
};

module.exports.options = {
  stage: 'render:pre:pages'
};
