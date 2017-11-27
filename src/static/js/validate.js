/*
插件自带的验证规则：
after{target} - 比target要大的一个合法日期，格式(DD/MM/YYYY)
alpha - 只包含英文字符
alpha_dash - 可以包含英文、数字、下划线、破折号
alpha_num - 可以包含英文和数字
before:{target} - 和after相反
between:{min},{max} - 在min和max之间的数字
confirmed:{target} - 必须和target一样
date_between:{min,max} - 日期在min和max之间
date_format:{format} - 合法的format格式化日期
decimal:{decimals?} - 数字，而且是decimals进制
digits:{length} - 长度为length的数字
dimensions:{width},{height} - 符合宽高规定的图片
email - 不解释
ext:[extensions] - 后缀名
image - 图片 
in:[list] - 包含在数组list内的值
ip - ipv4地址
max:{length} - 最大长度为length的字符
mimes:[list] - 文件类型
min - max相反
mot_in - in相反
numeric - 只允许数字
regex:{pattern} - 值必须符合正则pattern
required - 不解释
size:{kb} - 文件大小不超过
url:{domain?} - (指定域名的)url
 */


import Vue from 'vue';
import VeeValidate, {Validator} from 'vee-validate'
import zh from 'vee-validate/dist/locale/zh_CN';//引入中文文件

// 配置中文
Validator.addLocale(zh);

const config = {
  locale: 'zh_CN'
};

Vue.use(VeeValidate,config);

const dictionary = {
  zh_CN: {
     messages: {
       email: () => '请输入正确的邮箱格式',
       required: ( field )=> "请输入" + field
     },
     attributes:{
       email:'邮箱',
       password:'密码',
       name: '账号',
       phone: '手机',
       touchname:'联系人',
       company:'公司名称',
       address:'地址',
       qqemail:"qq邮箱",
       postcode:'邮编'
     }
 }
};
// message ： 提示语。 
// attributes： 就是 filed。
Validator.updateDictionary(dictionary);
Validator.extend('phone', {
  messages: {
    zh_CN:field => field + '必须是11位手机号码',
  },
  validate: value => {
    return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
  }
});
Validator.extend('touchname', {
  messages: {
    zh_CN:field => field + '须是11位手机号码',
  },
  validate: value => {
    return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
  }
});
Validator.extend('company', {
  messages: {
    zh_CN:field => field + '可以是中英文，但不能输入其他字符',
  },
  validate: value => {
    return  /^[\u4e00-\u9fffa-zA-Z0-9]{2,30}$/.test(value)
  }
});
Validator.extend('address', {
  messages: {
    zh_CN:field => field + '可以是中英文，但不能输入其他字符',
  },
  validate: value => {
    return  /^[\u4e00-\u9fffa-zA-Z0-9]{2,30}$/.test(value)
  }
});
// /^\d{5,12}@[qQ][qQ]\.(com|cn)$/
// ,^匹配你要用来查找的字符串的开头，$匹配结尾，\d匹配数字，
// {5,12}说明数字必须大于等于5小于等于12，
// ([q]{2}|[Q]{2})表示要么q或者Q出现两次即qq或者QQ，
// 由于.也是元字符，所以要使用的话必须转义"\"。
Validator.extend('qqemail', {
  messages: {
    zh_CN:field => '请输入正确的qq邮箱',
  },
  validate: value => {
    return  /^\d{5,12}@[qQ][qQ]\.(com|cn)$/.test(value)
  }
});
Validator.extend('postcode', {
  messages: {
    zh_CN:field => '请输入正确的邮编',
  },
  validate: value => {
    return  /^[1-9]\d{5}$/.test(value)
  }
});