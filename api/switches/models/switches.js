'use strict';

 const slugify = require('slugify');

 module.exports = {
   lifecycles: {
     beforeCreate: async (data) => {
       if (data.name) {
         data.slug = slugify(data.name.toLowerCase());
       }
     },
     beforeUpdate: async (params, data) => {
       if (data.name) {
         data.slug = slugify(data.name.toLowerCase());
       }
     },
   },
 };
