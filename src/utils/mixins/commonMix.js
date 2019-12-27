import { Tools } from 'ycloud-ui';

// 获取日期禁用选项
export const getDisableDate = (val, isStart = true, isSameDay = false) => {
    let time,
        supplement = isSameDay ? 86400000 : 0;
    if (!val) {
        time = {
            disabledDate () {
                return false;
            }
        };
    } else {
        time = {
            disabledDate (time) {
                if (isStart) {
                    return time.getTime() + supplement < new Date(val).getTime();
                } else {
                    return time.getTime() > new Date(val).getTime();
                }
            }
        };
    }
    return time;
};

export default {
    data () {
        return {
            isLoading: false,
            page: {
                total: 0,
                pageSize: 20,
                pageIndex: 1
            }
        };
    },
    // 判断当前分页是否异常
    watch: {
        'page.total': function (val) {
            let page = this.page;
            let maxPage = Math.ceil(page.total / page.pageSize);
            if (val > 0 && page.pageIndex > maxPage) {
                this.$message.info('分页数据异常，已为您初始化');
                (this.getList || $.noop)(1); //eslint-disable-line
            }
        }
    },
    filters: {
        money (value) {
            if (value === 0) {
                return '0.00';
            }
            let title = value < 0 ? '-' : '';
            return title + Tools.parseMoney(Math.abs(value));
        }
    },
    methods: {
        getDisableDate,
        _showAuthTab (arr) {
            let activeName = '';
            arr.reverse().forEach((item, index) => {
                if (this.auth[item.code]) {
                    activeName = item.name;
                } else {
                    this.$nextTick(() => {
                        document.querySelector('#tab-' + item.name).style.display = 'none';
                    });
                }
            });
            if (!activeName) {
                this.$message.warning('该页面您无权限访问!!!');
                this.$nextTick(() => {
                    this.$el.style.display = 'none';
                });
            }
            return activeName;
        }
    }
};
