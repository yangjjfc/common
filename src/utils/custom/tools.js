/**
 * 数据字典
 * @param {*options} obj
 * @param type  平台端数据字典还是 企业端 qiye，默认是平台端 pingtai
 */
import { Http } from 'ycloud-ui';
let tools = {
    pingtai: {} // 平台专用 pingtai
};
export const Dictionarie = (code, isRefresh) => {
    if (tools.pingtai[code] && !isRefresh) {
        return Promise.resolve(tools.pingtai[code]);
    } else {
        return new Promise((resolve, reject) => {
            Http('yhlo.brp.dict.platform.findByNumber', {
                ignoreRepeat: true, // 防止连续请求错误
                number: code
            }).then(result => {
                let list = result.data.children || [];
                if (list.length) {
                    tools.pingtai[code] = list.map(item => ({
                        dictVal: item.modValue,
                        number: item.number,
                        source: {
                            ...item
                        }
                    }));
                    resolve(tools.pingtai[code]);
                }
            });
        });
    }
};
