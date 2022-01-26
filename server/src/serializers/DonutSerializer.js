class DonutSerializer {
  static getSummary(donut) {
    const allowedAttributes = ["id", "flavor"]
    let serializedDonut = {}
    for (const attribute of allowedAttributes) {
      serializedDonut[attribute] = donut[attribute]
    }
    console.log(serializedDonut)
    return serializedDonut
  }
}

export default DonutSerializer