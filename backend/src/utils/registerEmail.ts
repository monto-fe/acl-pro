export const getCodeHtml = (code:string) => `
    <p>你好，您的注册验证码为：${code}，有效期15分钟</p>
`
export const registerEmailInfo = {
    type: 'qq',
    name: '费曼学习面试平台',
    from: 'lvpfhappy@qq.com',
    smtp: 'fpsynuymnozfbchh',
    subject: '注册验证码'
}