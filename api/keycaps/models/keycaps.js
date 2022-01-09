'use strict';

const slugify = require('slugify')

var filter_colors = {
/*
  Try and make at least 6 filter colors for each color.
  That way we get the most accurate stuff possible broski
*/
  // Beiges
  col_1_beige: "#ffeae3",
  col_2_beige: "#d8d2c3", // GMK L9
  col_3_beige: "#f0e2d8",
  col_4_beige: "#c2b8b2",
  // Whites
  col_1_white: "#ffffff",
  col_2_white: "#F7F2EA", // GMK WS1
  // Blacks
  col_1_black: "#232323",
  col_2_black: "#000000",
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
  col_2_brown: "#524037",
  col_3_brown: "#3d271f",
  col_4_brown: "#634439", // might come out as red
  // Grays
  col_1_gray: "#404040",
  col_2_gray: "#828282",
  // Greens
  col_1_green: "#00ff00",
  col_2_green: "#70ffa0",
  col_3_green: "#b3ff40",
  col_4_green: "#136100",
  col_5_green: "#265937",
  col_6_green: "#3f5916",
  col_7_green: "#375c2e",
  col_8_green: "#66a65a",
  // Oranges - going to dark becomes brown
  col_1_orange: "#ff6600",
  col_2_orange: "#ffa970",
  col_3_orange: "#cc7000",
  col_4_orange: "#bd7d3e",
  // Pinks - going to dark becomes purple
  col_1_pink: "#ff00dd",
  col_2_pink: "#ffb3e6",
  col_3_pink: "#b846a6",
  col_4_pink: "#c20068",
  col_5_pink: "#b85e9e",
  col_6_pink: "#824465",
  col_7_pink: "#b06394",
  col_8_pink: "#e64ce3",
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
  col_5_red: "#9c0003",
  col_6_red: "#992639",
  col_7_red: "#8f3228",
  col_8_red: "#8a3b34",
  // Yellows
  col_1_yellow: "#ffee00",
  col_2_yellow: "#fff892",
  col_3_yellow: "#949221",
  col_4_yellow: "#ffd84a",
  col_5_yellow: "#a38a2e",
  col_6_yellow: "#9e7d02",
  col_7_yellow: "#aba441",
  col_8_yellow: "#755c00",
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
    // console.log(newColor)
    return newColor
  })

  const newColors = await Promise.all(promises)

  return newColors;
}

const getColor = async colors => {
  const promises = colors.map(async color => {
    const hex = color.slice(0,7)
    const nearest = nearestColor(hex)
    console.log('Nearest color:', nearest)
    const nearest_name = nearest.name.slice(6)
    const newColor = await strapi.query('keycap-colors').findOne({color: nearest_name})
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
        const sliced = data.colors.slice(1)
        const colors = sliced.split("|")
        const newData = await getColor(colors)
        data.filter_colors = [...newData]
      }
    },
    beforeUpdate: async (params, data) => {
      if (data.name) {
        data.slug = slugify(data.name.toLowerCase());
      }
      if (data.colors && data.colors.slice(0,1) == "*") {
        const sliced = data.colors.slice(1)
        const colors = sliced.split("|")
        const newData = await getColor(colors)
        data.filter_colors = [...newData]
      }
    },
  },
};
