export const defaulter = {
  //前置操作
  /**
   *
   * @param {Object} value [Proxy代理的property]
   * @param {Function} resolve
   * @param {Function} reject
   * @param {Object} config
   */
  beforeEach(value, resolve, reject, config) {
    let url, method, data, options, keys, argument;
    keys = Object.keys(value);
    argument = value[keys[0]]; //第一个方法中的参数
    url = `/${keys[0]}/${argument[1].behavior}`;
    method = argument[0].toLowerCase()
    options = {
      loading: config.ElementUILoading
    }
    //当主body对象存在时，不存在时
    if(argument[2]) {
      data = argument[2]
      if(keys.length > 1 && keys[1] == 'page') {
        Object.assign(data, value[keys[1]])
      }
      if(keys.length > 2) {
        reject('请检查你的方法!');
      }
    } else {
      if(keys.length > 1 && keys[1] == 'page') {
        data = value[keys[1]]
      }
      if(keys.length > 2) {
        reject('请检查你的方法!');
      }
    }
    resolve({ url, method, data, options });
  },
};
