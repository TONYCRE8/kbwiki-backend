'use strict';

const slugify = require('slugify')

var filter_colors = {
/*
  Try and make at least 6 filter colors for each color.
  That way we get the most accurate stuff possible broski
*/
  // Beiges
  col_1_beige: "#ffeae3",
  col_2_beige: "#e6d7c3",
  col_3_beige: "#f0e2d8",
  col_4_beige: "#ada5a0",
  // Whites
  col_1_white: "#ffffff",
  col_2_white: "#F7F2EA", // GMK WS1
  // Blacks
  col_1_black: "#232323",
  // Blues
  col_1_blue: "#0000ff",
  col_2_blue: "#7fbeff",
  col_3_blue: "#36f5ff",
  col_4_blue: "#120075",
  col_5_blue: "#374061",
  col_6_blue: "#375261",
  col_7_blue: "#2a2d5e",
  col_8_blue: "#504d8f",
  // Browns
  col_1_brown: "#653c25",
  // Grays
  col_1_gray: "#404040",
  // Greens
  col_1_green: "#00ff00",
  col_2_green: "#70ffa0",
  col_3_green: "#b3ff40",
  col_4_green: "#136100",
  // Oranges
  col_1_orange: "#ff6600",
  col_2_orange: "#ffa970",
  col_3_orange: "#cc7000",
  col_4_orange: "#bd7d3e",
  // Pinks
  col_1_pink: "#ff00dd",
  col_2_pink: "#ffb3e6",
  col_3_pink: "#b846a6",
  col_4_pink: "#c20068",
  // Purples
  col_1_purple: "#ae00ff",
  col_2_purple: "#742d8a",
  col_3_purple: "#5f0082",
  col_4_purple: "#9e3cba",
  col_5_purple: "#b574d4",
  col_6_purple: "#7e5da3",
  col_7_purple: "#8f79a8",
  col_8_purple: "#a857d4",
  // Reds
  col_1_red: "#ff0000",
  col_2_red: "#ff6969",
  col_3_red: "#db583d",
  col_4_red: "#e84858",
  // Yellows
  col_1_yellow: "#ffee00",
  col_2_yellow: "#fff892",
  col_3_yellow: "#949221",
  col_4_yellow: "#ffd84a",
}
const nearestColor = require('nearest-color').from(filter_colors)

const getUnique = async colors => {
  const colorNames = []
  
  colors.forEach((item) => {
    colorNames.push(item.color)
  })

  const uniqueSet = [...new Set(colorNames)]

  const promises = uniqueSet.map(async color => {
    const newColor = await strapi.query('keycap-colors').findOne({color: color})
    console.log(newColor)
    return newColor
  })

  const newColors = await Promise.all(promises)

  return newColors;
}

const getColor = async colors => {
  const promises = colors.map(async color => {
    const hex = color.slice(0,7)
    const nearest = nearestColor(hex)
    const nearest_col = nearest.name.slice(6)
    const newColor = await strapi.query('keycap-colors').findOne({color: nearest_col})
    return newColor
  })
  const newColors = await Promise.all(promises)

  return getUnique(newColors)
}

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.name) {
        data.slug = slugify(data.name.toLowerCase());
      }
      if (data.colors && data.colors.slice(0,1) == "*") {
        //data.filter_colors = []
        const sliced = data.colors.slice(1)
        const colors = sliced.split("|")
        const newData = await getColor(colors)
        data.filter_colors.push(...newData)
      }
    },
    beforeUpdate: async (params, data) => {
      if (data.name) {
        data.slug = slugify(data.name.toLowerCase());
      }
      if (data.colors && data.colors.slice(0,1) == "*") {
        // data.filter_colors = []
        const sliced = data.colors.slice(1)
        const colors = sliced.split("|")
        const newData = await getColor(colors)

        data.filter_colors.push(...newData)
      }
    },
  },
};
