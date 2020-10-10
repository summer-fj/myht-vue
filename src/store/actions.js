import $axios from '../http'
import $api from '../http/api'
export default{
    // 在action中, 不能直接修改state中的数据, 必须通过context.commit()触发某个mutation才行
    menuAsyncAdd(context){
        return new Promise((resolve, reject)=>{
            // promise中异步获取菜单列表内容
            $axios.get($api.menulistUrl, {
                params:{istree: 1}
            }).then(res=>{
                // console.log(res); // res.data.list是商品列表的内容
                // 把获取的数据存储到store中
                context.commit('setmenulist', res.data.list);
                // 异步请求成功把结果返回出去
                resolve(res);
            })
        })
    },

    roleAsyncAdd(context){
        return new Promise((resolve, reject)=>{
            // promise中异步获取菜单列表内容
            $axios.get($api.rolelistUrl).then(res=>{
                // 把获取的数据存储到store中
                context.commit('setrolelist', res.data.list);
                // 异步请求成功把结果返回出去
                resolve(res);
            })
        })
    },
   
    userinfoAsyncAdd(context, data){
        return new Promise((resolve, reject)=>{
            $axios.post($api.userloginUrl, data).then(res=>{
                // 把获取的数据存储到store中
                context.commit('setuserinfo', res.data.list);
                // 异步请求成功把结果返回出去
                resolve(res);
            })
        })
    },
   
    cateAsyncAdd(context){
        return new Promise((resolve, reject)=>{
            // promise中异步获取菜单列表内容
            $axios.get($api.catelistUrl, {
                params:{istree: 1}
            }).then(res=>{
                // console.log(res); // res.data.list是商品列表的内容
                // 把获取的数据存储到store中
                context.commit('setcatelist', res.data.list);
                // 异步请求成功把结果返回出去
                resolve(res);
            })
        })
    },

    loginOutSync(context){
        context.commit('loginout');
        sessionStorage.removeItem('store')
    }

    
}