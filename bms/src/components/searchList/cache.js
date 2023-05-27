/**
 * 缓存SearchList组件的一些搜索数据，比如说1、分页器页码等数据 
 * 2、顶部的搜索参数数据
 * 
 * 需要使用到本地状态管理工具吗？答：由于我们只是希望实现：分页器交互数据发生变化、
 * 搜索条件数据发生变化时把这个数据存一份“持久化”的数据，然后当组件再次mount的时候
 * 让组件再次取出这部分数据拿出来用即可；
 * 
 * 通过上面的表述，所以没有必要使用状态管理工具也可以；相比我们这里的简单处理，状态
 * 管理工具有一个特点就是包含了react的更新机制。
 * 
 * 但是在我们这个例子是完全用不上这个特性的。在加上umijs官方所提供的状态管理工具需要写的
 * 代码比较多，需要写model等内容；所以这里就直接简单处理，存本地javascript对象即可。
 */

// 用来存数据的javascript对象，value是存储的数据
const cacheDb = {}

/**
 * 向本地存储对象中写部分数据
 * @param {*} outKey : cacheDb的一级key
 * @param {*} innerKey : cacheDb[someKey]对象的某个key
 * @param {*} data : 需要写的数据
 */
export function writeToDbPartial(outKey, innerKey, data) {
  if (!cacheDb[outKey]) {
    cacheDb[outKey] = {}
  }
  cacheDb[outKey][innerKey] = data
  return cacheDb[outKey]
}

/**
 * 向本地存储对象中写全部数据
 * @param {*} key 
 * @param {*} data 
 */
export function writeToDbComplete(key, data) {
  cacheDb[key] = data
  return cacheDb[key]
}

/**
 * 删除cacheDb中的某个数据
 * @param {*} key 
 */
export function clearDbByKey(key) {
  delete cacheDb[key]
}

/**
 * 从cacheDb中读取值
 * @param {*} key 
 */
export function readFromDB(key) {
  return cacheDb[key]
}