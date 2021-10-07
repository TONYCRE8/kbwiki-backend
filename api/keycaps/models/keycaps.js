'use strict';

 const slugify = require('slugify')

 var colors = {
   red: "#bc251e",
   blue: "#0084c2",
   green: "689b34"
 }
 const nearestColor = require('nearest-color').from(colors)

 module.exports = {
   lifecycles: {
     beforeCreate: async (data) => {
       if (data.name) {
         data.slug = slugify(data.name.toLowerCase());
       }
       if (data.colors) {
        const color = nearestColor(data.colors)
        const newColor = await strapi.query('keycap-colors').findOne({color: color.name})
        data.filter_colors.push(newColor)
      }
     },
     beforeUpdate: async (params, data) => {
       if (data.name) {
         data.slug = slugify(data.name.toLowerCase());
       }
       if (data.colors)
       {
        const color = nearestColor(data.colors)
        const newColor = await strapi.query('keycap-colors').findOne({color: color.name})
        data.filter_colors.push(newColor)
      }
     },
   },
 };
