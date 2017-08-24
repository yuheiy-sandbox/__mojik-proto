const test = require('ava')
const Mojik = require('../')

test(t => {
  const rawHtml = '文字組みをコントロールするためのJavaScriptライブラリ'
  t.is(Mojik(rawHtml), '文字組みをコントロールするための<span class="mjk-western">JavaScript</span>ライブラリ')
})

test(t => {
  const rawHtml = '<span>文字組みを<b class="klass" contenteditable>コントロール</b>する</span>ためのJavaScriptライブラリ'
  t.is(Mojik(rawHtml), '<span>文字組みを<b class="klass" contenteditable>コントロール</b>する</span>ための<span class="mjk-western">JavaScript</span>ライブラリ')
})
