<script>
import { httpAction, getAction } from '@/api/manage';
import Cookies from 'js-cookie';
import { getToken, setToken, removeToken } from '@/utils/auth';
export default {
  name: 'AuthRedirect',
  data() {
    return {
      url: '',
      code: '',
      hasToken: false,
      redirectPath: ''
    };
  },
  created() {
    console.log(location);
    console.log(this.$route.query);
    if (this.$route.query) {
      this.redirectPath = this.$route.query.redirect;
    }

    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      console.log('微信浏览器');
      const hasToken = getToken();
      if (hasToken) {
        this.getUserInfo();
      } else {
        this.getAuthUrl();
      }
    } else {
      const hasToken = getToken();
      console.log("不是微信浏览器"+getToken());
      if (hasToken) {
        this.getUserInfo();
      } else {
        // 在这里开发平台对接代码
        // this.$router.replace({ path: '/baseInfo', query: { checkMobile: true } })
      }
    }
  },
  watch: {
    '$route.query'(v) {
      this.redirectPath = v.redirect;
    }
  },
  methods: {
    getAuthUrl() {
      if (this.getCodeUrlBefore()) {
        console.log('回调路径', location.href);
        httpAction('/getcodeUrl', { body: location.href })
          .then(res => {
            if (res.code == 0) {
              removeToken();
              this.url = res.data;
              this.getCode();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
      //  zhengwu.wangserver.cn
      // http://public.wangserver.cn/
    },
    getCodeUrlBefore() {
      const token = this.$route.query.token;
      if (token) {
        this.token = token;
        setToken(token);
        this.getUserInfo();
        return false;
      }
      return true;
    },
    getCode() {
      // 非静默授权，第一次有弹框
      this.token = this.$route.query.token || ''; // 截取code
      if (!this.token) {
        // 如果没有code，则去请求
        window.location.replace(this.url);
      } else {
        setToken(this.token);
        this.getUserInfo();
      }
    },
    getUserInfo() {
      console.log('token', this.token);
      this.$store
        .dispatch('user/getInfo', { Token: this.token })
        .then(() => {
          const pathname = this.redirectPath;
          console.log('进入的页面 pathname', pathname);
          const { redirect, token, ...params } = this.$route.query;
          console.log(params, '路由参数');
          if (!pathname || pathname == '/' || pathname == '/login') {
            this.$router.replace({ path: '/index', query: params || {} });
          } else {
            this.$router.replace({ path: pathname, query: params || {} });
          }
        })
        .catch(() => {
        });
    }
  },
  render: function(h) {
    return h(); // avoid warning message
  }
};
</script>
