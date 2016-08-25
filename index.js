/*
 * assemble-middleware-styleguide
 * https://github.com/tomsky/assemble-middleware-styleguide
 *
 * Copyright (c) 2016 Tom-Marius Olsen
 * Licensed under the MIT license.
 */

var crypto = require('crypto');
var kss  = require('kss-parse');
var hashFilePath = '.grunt/assemble-middleware-styleguide/hashes.json';

module.exports = function(params, done) {
    'use strict';

    // Get a reference to Grunt
    var grunt = params.grunt;

    // Validated configuration
    grunt.config.requires('assemble.styleguide.options.styleguide.dest');
    grunt.config.requires('assemble.styleguide.options.styleguide.src');
    grunt.config.requires('assemble.styleguide.options.styleguide.layout');

    // Read the layout template
    var tmpl = grunt.file.read(grunt.config.get('assemble.styleguide.options.styleguide.layout'), 'utf8');

    kss.getSections(grunt.config.get('assemble.styleguide.options.styleguide.src'), { mask: '*.scss' }, function(err, styleguide) {
        if (err) throw err;

        // Add the styleguide toc to assemble
        params.assemble.options.data.styleguide = styleguide;

        // Get the hashes
        var hashes = (grunt.file.exists(hashFilePath)) ? grunt.file.readJSON(hashFilePath) : [];

        styleguide.forEach(function(val, key){
            // Flatten the section so it can be used by the template
            var sections = kss.flattenSection(val);

            // Create a hash of the section
            var hash = crypto.createHash('md5').update(JSON.stringify(sections)).digest('hex');

            // Check for changes
            if(hashes[key] != hash){

                // Update the hash for this section
                hashes[key] = hash;

                // Render the markup for each section
                for(var i = 0; i < sections.length; i++){
                    if(sections[i].markup){
                        params.assemble.engine.render(sections[i].markup, params.assemble.options.data, function(err, content){
                            if (err) throw err;
                            sections[i].markup = content;
                        });
                    }
                }

                // Push the section to assemble
                params.assemble.options.pages.push({
                    data: { sections: sections },
                    dest: grunt.config.get('assemble.styleguide.options.styleguide.dest') + '/section-' + val.refParts[0] + '.html',
                    page: tmpl,
                });
            }
        });

        // Write a updated list of hashes.
        grunt.file.write(hashFilePath, JSON.stringify(hashes));

        done();
    });
};

module.exports.options = {
  stage: 'render:pre:pages'
};
