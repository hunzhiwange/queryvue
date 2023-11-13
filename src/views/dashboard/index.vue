<template>
  <!--  <PageHeader title="首页" />-->

  <Card shadow :bordered="false">
    <template #title>订货宝</template>
    订货管理系统
  </Card>

  <!--  <Card shadow :bordered="false">-->
  <!--    <template #title>-->
  <!--      <Icon type="flag"></Icon>-->
  <!--      QueryPHP-->
  <!--      <Icon type="ios-heart" color="red"></Icon>-->
  <!--      Vue-->
  <!--    </template>-->
  <!--    <template #extra>-->
  <!--      <i-button size="small" type="text" @click="officeSite()">-->
  <!--        {{ __('官方网站') }}-->
  <!--      </i-button>-->
  <!--    </template>-->

  <!--    <Row :gutter="16">-->
  <!--      <i-col span="12">-->
  <!--        <p>-->
  <!--          {{-->
  <!--            __(-->
  <!--              '欢迎使用 QueryVue 单页面通用极速后台开发框架，本框架包含了基本认证、权限和账号管理功能，开发者可以在此基础上快速构建自己的应用。',-->
  <!--            )-->
  <!--          }}-->
  <!--        </p>-->
  <!--      </i-col>-->
  <!--      <i-col span="12" style="text-align: right">-->
  <!--        <Card :bordered="false">-->
  <!--          <div style="text-align: center">-->
  <!--            <img :src="logo" class="shadow inline-block" alt="QueryPHP" />-->
  <!--            <div-->
  <!--              class="bg-gray-100 px-6 py-3 text-gray-400 text-center font-extrabold rounded-full mt-5 dark:bg-gray-headerbg"-->
  <!--            >-->
  <!--              MIT Licensed | Copyright © 2010-present Xiangmin Liu-->
  <!--            </div>-->
  <!--          </div>-->
  <!--        </Card>-->
  <!--      </i-col>-->
  <!--    </Row>-->
  <!--  </Card>-->

  <!--  <Card shadow class="ivu-mt">-->
  <!--    <template #title>-->
  <!--      <Icon type="ios-heart"></Icon>-->
  <!--      {{ __('二次开发说明') }}-->
  <!--    </template>-->

  <!--    <Row>-->
  <!--      <i-col span="6">-->
  <!--        <Steps :current="0" direction="vertical">-->
  <!--          <Step :title="__('已完成')" :content="__('搭建开发环境')"></Step>-->
  <!--          <Step-->
  <!--            :title="__('创新')"-->
  <!--            :content="__('阅读 Vue & QueryPHP 开发文档')"-->
  <!--          ></Step>-->
  <!--          <Step :title="__('专注')" :content="__('学习基础功能示例')"></Step>-->
  <!--          <Step-->
  <!--            :title="__('分享')"-->
  <!--            :content="__('根据业务改造基础框架')"-->
  <!--          ></Step>-->
  <!--        </Steps>-->
  <!--      </i-col>-->
  <!--      <i-col span="18">-->
  <!--        <Tabs>-->
  <!--          <TabPane :label="__('综合说明')" icon="social-github">-->
  <!--            {{-->
  <!--              __(-->
  <!--                'QueryVue 希望为大家提供了基于 Vue 与 QueryPHP 整合的超级后台开发基础框架，以满足用户快速地理解并使用我们的产品。',-->
  <!--              )-->
  <!--            }}-->
  <!--            <div class="text-5xl font-extrabold mt-5">-->
  <!--              <span-->
  <!--                class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"-->
  <!--              >-->
  <!--                The PHP Framework For Code Poem As Free As Wind-->
  <!--              </span>-->
  <!--            </div>-->
  <!--          </TabPane>-->
  <!--          <TabPane label="IView" icon="social-javascript">IView</TabPane>-->
  <!--          <TabPane label="Vue" icon="social-javascript">Vue</TabPane>-->
  <!--          <TabPane label="QueryPHP" icon="social-codepen">QueryPHP</TabPane>-->
  <!--        </Tabs>-->
  <!--      </i-col>-->
  <!--    </Row>-->
  <!--  </Card>-->

  <!--  <Card shadow class="ivu-mt">-->
  <!--    <Row :gutter="16">-->
  <!--      <i-col span="24">-->
  <!--        <Tabs>-->
  <!--          <TabPane label="Link" icon="md-link" :key="0">-->
  <!--            <Row>-->
  <!--              <i-col span="4">-->
  <!--                <i-button type="text" @click="officeSite()">-->
  <!--                  {{ __('官方网站') }}-->
  <!--                </i-button>-->
  <!--              </i-col>-->
  <!--              <i-col span="4">-->
  <!--                <i-button type="text" @click="githubSite()">Github</i-button>-->
  <!--              </i-col>-->
  <!--            </Row>-->
  <!--          </TabPane>-->
  <!--          <TabPane label="Error Page" :key="1">-->
  <!--            <Row>-->
  <!--              <i-col span="4">-->
  <!--                <i-button type="text" @click="page403()">403</i-button>-->
  <!--              </i-col>-->
  <!--              <i-col span="4">-->
  <!--                <i-button type="text" @click="page404()">404</i-button>-->
  <!--              </i-col>-->
  <!--              <i-col span="4">-->
  <!--                <i-button type="text" @click="page500()">500</i-button>-->
  <!--              </i-col>-->
  <!--            </Row>-->
  <!--          </TabPane>-->
  <!--        </Tabs>-->
  <!--      </i-col>-->
  <!--    </Row>-->
  <!--  </Card>-->

  <!--  <Alert type="success" show-icon class="ivu-mt">-->
  <!--    {{ __('感谢信') }}-->
  <!--    <template #desc>-->
  <!--      {{-->
  <!--        __(-->
  <!--          '在这里特别鸣谢 %s、%s 和 %s 等开源的基础框架，使得我们才能够站在巨人的肩膀上腾飞。',-->
  <!--          'VueThink',-->
  <!--          'VueElementAdmin',-->
  <!--          'IViewAdmin',-->
  <!--        )-->
  <!--      }}-->
  <!--      <a href="https://github.com/honraytech/VueThink" target="_blank">-->
  <!--        VueThink-->
  <!--      </a>-->
  <!--      、-->
  <!--      <a href="https://github.com/PanJiaChen/vue-element-admin" target="_blank">-->
  <!--        VueElementAdmin-->
  <!--      </a>-->
  <!--      、-->
  <!--      <a href="https://github.com/iview/iview-admin" target="_blank">-->
  <!--        IViewAdmin-->
  <!--      </a>-->
  <!--    </template>-->
  <!--  </Alert>-->
</template>
<script>
import logo from '@/assets/images/logo.png'

export default {
  data() {
    return {
      logo,
    }
  },
  methods: {
    officeSite() {
      window.open('http://www.queryphp.com')
    },
    githubSite() {
      window.open('https://github.com/hunzhiwange/queryphp')
    },
    page403() {
      this.$router.replace('/403')
    },
    page404() {
      this.$router.replace('/404')
    },
    page500() {
      this.$router.replace('/500')
    },
  },
}
</script>
