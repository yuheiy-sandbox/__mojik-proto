const test = require('ava')
const Mojik = require('../')

test(t => {
  const rawHtml = ''
  t.deepEqual(Mojik.parse(rawHtml), [])
})

test(t => {
  const rawHtml = '文字組みをコントロールするためのJavaScriptライブラリ'
  t.deepEqual(Mojik.parse(rawHtml), [
    {
      type: 'text',
      children: [
        {
          type: 'slice',
          data: '文字組みをコントロールするための',
          sliceType: 'japanese',
        }, {
          type: 'slice',
          data: 'JavaScript',
          sliceType: 'western',
        }, {
          type: 'slice',
          data: 'ライブラリ',
          sliceType: 'japanese',
        },
      ],
    },
  ])
})

test(t => {
  const rawHtml = '<span>文字組みを<b class="klass" contenteditable>コントロール</b>する</span>ためのJavaScriptライブラリ'
  t.deepEqual(Mojik.parse(rawHtml), [
    {
      type: 'tag',
      name: 'span',
      attributes: {},
      children: [
        {
          type: 'text',
          children: [
            {
              type: 'slice',
              data: '文字組みを',
              sliceType: 'japanese',
            },
          ],
        }, {
          type: 'tag',
          name: 'b',
          attributes: {
            class: 'klass',
            contenteditable: '',
          },
          children: [
            {
              type: 'text',
              children: [
                {
                  type: 'slice',
                  data: 'コントロール',
                  sliceType: 'japanese',
                },
              ],
            },
          ],
        }, {
          type: 'text',
          children: [
            {
              type: 'slice',
              data: 'する',
              sliceType: 'japanese',
            },
          ],
        },
      ],
    }, {
      type: 'text',
      children: [
        {
          type: 'slice',
          data: 'ための',
          sliceType: 'japanese',
        }, {
          type: 'slice',
          data: 'JavaScript',
          sliceType: 'western',
        }, {
          type: 'slice',
          data: 'ライブラリ',
          sliceType: 'japanese',
        },
      ],
    },
  ])
})
