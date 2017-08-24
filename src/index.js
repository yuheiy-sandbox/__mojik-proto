const {parseDOM} = require('htmlparser2')

const CHARACTERS = {
  western:
    "\\u0000-\\u007F" + // Basic Latin
    "\\u0080-\\u00FF" + // Latin-1 Supplement
    "\\u0100-\\u017F" + // Latin Extended-A
    "\\u0180-\\u024F" + // Latin Extended-B
    // "\\u0250-\\u02AF" + // IPA Extensions
    // "\\u02B0-\\u02FF" + // Spacing Modifier Letters
    // "\\u0300-\\u036F" + // Combining Diacritical Marks
    // "\\u0370-\\u03FF" + // Greek and Coptic
    // "\\u0400-\\u04FF" + // Cyrillic
    // "\\u0500-\\u052F" + // Cyrillic Supplement
    // ...
    "\\u2000-\\u203A\\u203C-\\u206F" + // General Punctuation excluding U+203B REFERENCE MARK
    "\\u2070-\\u209F" + // Superscripts and Subscripts
    "\\u20A0-\\u20CF" + // Currency Symbols
    // "\\u20D0-\\u20FF" + // Combining Diacritical Marks for Symbols
    "\\u2100-\\u214F" + // Letterlike Symbols
    "\\u2150-\\u218F",  // Number Forms
}

const HTML_CLASSES = {
  western: 'mjk-western',
}

const parseText = (text) => {
  const reWestern = new RegExp(`[${CHARACTERS.western}]`)
  const slicedNodes = []
  let isPrevCharWestern
  let charIdxOfPrevSlice = 0
  ;[...text].forEach((char, idx) => {
    const isFirstChar = idx === 0
    const isCharWestern = reWestern.test(char)
    if (!isFirstChar && (isPrevCharWestern !== isCharWestern)) {
      slicedNodes.push({
        type: 'slice',
        data: text.slice(charIdxOfPrevSlice, idx),
        sliceType: isPrevCharWestern ? 'western' : 'japanese',
      })
      charIdxOfPrevSlice = idx
    }
    isPrevCharWestern = isCharWestern
  })
  slicedNodes.push({
    type: 'slice',
    data: text.slice(charIdxOfPrevSlice),
    sliceType: isPrevCharWestern ? 'western' : 'japanese',
  })
  return slicedNodes
}

const parseNodeDeep = (node) => {
  if (node.type === 'tag') {
    return {
      type: node.type,
      name: node.name,
      attributes: node.attribs,
      children: parseNodes(node.children),
    }
  } else if (node.type === 'text') {
    return {
      type: node.type,
      children: parseText(node.data),
    }
  } else {
    // todo
    return node
  }
}

const parseNodes = (nodes) => {
  return nodes.map(parseNodeDeep)
}

const parse = (rawHtml) => {
  const baseNodes = parseDOM(rawHtml)
  const parsedNodes = parseNodes(baseNodes)
  return parsedNodes
}

const renderNodeDeep = (node) => {
  if (node.type === 'tag') {
    const attrsStr = Object.entries(node.attributes).map(([key, val]) => `${key}${val ? `="${val}"` : ''}`).join(' ')
    return `<${node.name}${attrsStr ? ` ${attrsStr}` : ''}>${renderNodes(node.children)}</${node.name}>`
  } else if (node.type === 'text') {
    return renderNodes(node.children)
  } else if (node.type === 'slice') {
    if (node.sliceType === 'japanese') {
      return node.data
    } else if (node.sliceType === 'western') {
      return `<span class="${HTML_CLASSES.western}">${node.data}</span>`
    }
  } else {
    // todo
    return ''
  }
}

const renderNodes = (nodes) => {
  return nodes.map(renderNodeDeep).join('')
}

const Mojik = (rawHtml) => {
  const parsedNodes = parse(rawHtml)
  const renderedHtml = renderNodes(parsedNodes)
  return renderedHtml
}

Mojik.parse = parse
module.exports = Mojik
