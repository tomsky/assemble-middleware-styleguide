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

module.exports = function(assemble) {
    'use strict';

    function tocReference(section){
        return {
            header: section.header(),
            reference: section.reference(),
            url: 'section-' + section.reference().split('.')[0] + '.html',
            sections: []
        };
    }

    var middleware = function(params, next) {

        var options = params.assemble.options.kss;
        var tmpl    = fs.readFileSync(options.layout, 'utf8');

        console.info('middleware: assemble-middleware-kss\n');

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
                _.forEach(styleguide.section( sectionReference + '.x' ), function(sectionDepth2){
                    reference.sections.push( tocReference(sectionDepth2) );
                    _.forEach(styleguide.section( sectionReference + '.' + (sectionDepth2.reference().split('.')[1]) + '.x' ), function(sectionDepth3){
                        reference.sections[reference.sections.length-1].sections.push( tocReference(sectionDepth3) );
                    });
                });
                toc.push(reference);

                //Create array of all sections that we can pass to assemble
                var sections = [styleguide.section( sectionReference )].concat( styleguide.section( sectionReference + '.*' ) );

                //Add pages to assemble
                params.pages.push({
                    _id: 'section_' + sectionReference,
                    type: 'styleguide',
                    data: {
                        sections: sections
                    },
                    orig: tmpl,
                    src:  '',
                    dest: options.dest + '/section-' + sectionReference + '.html'
                });
            });

            //Add the styleguide toc to assemble globlally
            params.assemble.data.styleguide = toc;

            next();
        });
    };

    middleware.event = 'assemble:before:build';

    return {
        'assemble-middleware-kss': middleware
    };
};