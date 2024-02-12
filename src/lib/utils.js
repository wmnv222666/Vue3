/*
 * ArrayFlat 扁平化数组 [ {a}, {b,children:[ {c} ]}] => [ {a}, {b,children}, {c} ]
 * @arr:array 源数组
 * @key:string = 'children' 子数组
 * */
import { h } from 'vue'
import i18n from '@/locales/i18n'
const $t = i18n.global.t

export const ArrayFlat = (arr, key = 'children') =>
  arr.map((item) => (item[key] ? [item, ...ArrayFlat(item[key], key)] : [item])).flat()

/**
 * filterNumber 数字格式化 1234 => 1,234.00
 * @value:number 源数值
 * @n:number 小数精度
 * @isFormatIntPart:boolean 是否格式化整数部分
 * */
export const FormatNumber = (value, n = 2, isFormatIntPart = true) => {
  let num = Number(value)

  // 无穷大
  if (!Number.isFinite(num) || num.toString().includes('e')) {
    return '∞'
  }

  // 非数字 返回默认值
  if (isNaN(num)) {
    num = 0
  }

  // 数字精度 处理
  num = num.toFixed(n)

  // 数字格式化处理
  let intPart = num.toString().split('.')[0]
  if (isFormatIntPart) {
    intPart = intPart.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  }
  let floatPart = n ? num.toString().match(/\.\d+$/)[0] : ''
  return intPart + floatPart
}

/**
 * DownloadBase 下载文件
 * @dom:element 下载文件流
 * @filename:string = 'base' 下载文件名
 * */
export const DownloadBase = (data, filename = 'base') => {
  const a = document.createElement('a')
  a.href = data
  a.download = `${filename}`
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * DownloadExcel 下载Excel文件
 * @data:string 文件流字符串
 * @filename:string = 'excel' 下载文件名
 * */
export const DownloadExcel = (data, filename = 'excel') =>
  DownloadBase(
    URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' })),
    filename
  )

// 事件委托 - 获取目标元素
export const GetEventElement = (element, targetClassName, endClassName) => {
  while (!new RegExp(targetClassName).test(element.className)) {
    if (new RegExp(endClassName).test(element.className)) {
      return false
    }
    element = element.offsetParent
  }
  return element
}

// 创建拖拽事件
export const CreateDragEvent = (options = {}) => {
  let { zoom = 1, el, event, moveFn, upFn } = options
  if (!el) {
    return console.error('请传递拖拽目标 el')
  }
  if (!event) {
    return console.error('请传递keydown时间对象 event')
  }
  let sx = event.clientX / zoom - el.offsetLeft
  let sy = event.clientY / zoom - el.offsetTop
  let maxX = el.offsetParent.clientWidth - el.offsetWidth
  let maxY = el.offsetParent.clientHeight - el.offsetHeight

  let $moveFn = (ev) => {
    let x = ev.clientX / zoom - sx
    let y = ev.clientY / zoom - sy

    // 边界限制
    x = x < 0 ? 0 : x > maxX ? maxX : x
    y = y < 0 ? 0 : y > maxY ? maxY : y

    if (moveFn) {
      return moveFn({
        x,
        y,
        event: ev
      })
    }
    el.style.top = `${y}px`
    el.style.left = `${x}px`
  }

  let $upFn = (ev) => {
    upFn &&
      upFn({
        event: ev
      })
    document.removeEventListener('mousemove', $moveFn)
    document.removeEventListener('mouseup', $upFn)
  }
  document.addEventListener('mousemove', $moveFn)
  document.addEventListener('mouseup', $upFn)
}

/**
 * 将 dom 元素全屏
 * @param {dom} element dom元素
 * @example
 * setFullscreen(document.documentElement) // 整个页面进入全屏
 * setFullscreen(document.getElementById("id")) // 某个元素进入全屏
 */
export const SetFullScreen = (dom) => {
  if (dom.requestFullscreen) {
    return dom.requestFullscreen()
  }
  if (dom.webkitRequestFullscreen) {
    return dom.webkitRequestFullscreen()
  }
  if (dom.mozRequestFullScreen) {
    return dom.mozRequestFullScreen()
  }
  if (dom.msRequestFullscreen) {
    return dom.msRequestFullscreen()
  }
}

/**
 * 退出全屏
 * @example
 * exitFullscreen();
 */
export const ExitFullScreen = () => {
  if (document.exitFullscreen) {
    return document.exitFullscreen()
  }
  if (document.webkitExitFullscreen) {
    return document.webkitExitFullscreen()
  }
  if (document.mozCancelFullScreen) {
    return document.mozCancelFullScreen()
  }
  if (document.msExitFullscreen) {
    return document.msExitFullscreen()
  }
}

// 计算数组之和
export const Sum = (arr, key = 'total') => {
  let s = 0
  switch (typeof key) {
    case 'string':
      arr.forEach((item) => (s += item[key]))
      break
    case 'function':
      arr.forEach((item) => (s += key(item)))
      break
  }
  return s
}

// 点击复制
export const CopyToClipboard = (text) => {
  return new Promise((resolve) => {
    let inputEl = document.createElement('input')
    inputEl.value = text
    inputEl.style.height = '0'
    inputEl.style.overflow = 'hidden'
    inputEl.style.opacity = '0'
    inputEl.style.display = 'block'
    inputEl.style.border = 'none'
    inputEl.style.padding = '0'
    document.body.appendChild(inputEl)
    inputEl.select()
    document.execCommand('copy', false)
    document.body.removeChild(inputEl)
    return resolve()
  })
}

export class DataBase {
  constructor(data) {
    for (const dataKey in data) {
      this[dataKey] = data[dataKey]
    }
  }
}

export class DataPagination extends DataBase {
  constructor(data = {}) {
    super({
      page: 1,
      pageSize: 10,
      itemCount: 0,
      showSizePicker: true,
      pageSlot: 6,
      pageSizes: [10, 20, 30, 40],
      prefix: () => h('span', `${$t('Common.Total')}: ${this.itemCount}`),
      ...data
    })
  }
}

// 点击复制
export const TableDataAPI = (columns, pagination) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = {
        records: [],
        total: 998
      }
      let total = 998

      data.records = Array.apply(null, { length: data.total })
        .map((_, index) => {
          let obj = {
            id: index
          }
          columns.value.forEach(({ key }) => {
            if (/date/i.test(key)) {
              obj[key] = '2022-01-01'
            } else {
              obj[key] = `${key}-${index + 1}`
            }
          })
          return obj
        })
        .slice(pagination.pageSize * (pagination.page - 1), pagination.pageSize * pagination.page)
      resolve({ data })
    }, 300)
  })
}
