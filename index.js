/*
 * assemble-middleware-kss
 * https://github.com/tomsky/assemble-middleware-kss
 *
 * Copyright (c) 2014 Tom-Marius Olsen
 * Licensed under the MIT license.
 */

var fs = require('fs');
var kss  = require('kss');
var _ = require('lodash-node');

module.exports = function(params, done) {
    'use strict';

    var grunt   = params.grunt;
    var options = params.assemble.options.kss || {};
    var tmpl    = fs.readFileSync(options.layout, 'utf8');

    function tocReference(section){
        return {
            header: section.header(),
            reference: section.reference(),
            url: 'section-' + section.reference().split('.')[0] + '.html',
            sections: []
        };
    }

    if(!_.isUndefined(options)){

        console.log('assemble-middleware-kss');

        kss.traverse(options.src, { mask: '*.scss' }, function(err, styleguide) {
            if (err) throw err;

            var rootSections = [];
            var toc   = [];

            //Find all root level section and add these to an sorted array.
            //We'll use this array to create one page for each root level section.
            _.forEach(styleguide.section( 'x' ), function(section){
                rootSections.push( section.reference().split('.')[0] );
            });
            rootSections = _.uniq(rootSections);

            //Loop each rootSection and create a reference and page that we can pass to assemble
            _.forEach(rootSections, function(sectionReference){

                //Create a reference to all subsections that we can add to the toc
                var reference = tocReference( styleguide.section( sectionReference ) );

                var x = new RegExp(sectionReference+"\\.[1-99]","g");
                _.forEach(styleguide.section( x ), function(sectionDepth2){
                    reference.sections.push( tocReference(sectionDepth2) );
                    _.forEach(styleguide.section( sectionReference + '.' + (sectionDepth2.reference().split('.')[1]) + '.x' ), function(sectionDepth3){
                        reference.sections[reference.sections.length-1].sections.push( tocReference(sectionDepth3) );
                    });
                });
                toc.push(reference);

                //Create array of all sections that we can pass to assemble
                var x = new RegExp(sectionReference+"(.[1-99])?(.[1-99])?","g");
                var sections = styleguide.section( x );

                //There seems to be a problem with som circular-structure in the modifiers when pushing sections to Assemble,
                //This loops the over each modifier and removes the circular-structure. It's not pretty but i works.
                _.forEach(sections, function(section, key){
                    var modifiers = [];
                    _.forEach(section.modifiers(), function(modifier, key){
                        modifier.data.section = null;
                        modifiers.push(modifier)
                    });
                    sections[key].data.modifiers = modifiers;
                });

                params.assemble.options.pages.push({
                    data: { sections: sections },
                    dest: options.dest + '/section-' + sectionReference + '.html',
                    page: tmpl,
                });

            });

            //Add the styleguide toc to assemble globlally
            params.assemble.options.data.styleguide = toc;
            done();
        });
    }
};

module.exports.options = {
  stage: 'render:pre:pages'
};
