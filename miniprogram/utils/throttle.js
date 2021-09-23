/**
 * 防止重复点击提交
 * @param {*} fn 节流的方法
 * @param {*} gapTime 节流时间，默认 3s
 */
export function throttle (fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
   gapTime = 1500
  }
 
  let _lastTime = null
 
  // 返回新的函数
  return function () {
   let _nowTime = + new Date()
   if (_nowTime - _lastTime > gapTime || !_lastTime) {
    fn.apply(this, arguments) //将this和参数传给原函数
    _lastTime = _nowTime
   }
  }
 }