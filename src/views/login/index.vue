<template>
  <div class="page-account">
    <div class="page-account-header"></div>
    <div class="ivu-row">
      <div
        class="ivu-col ivu-col-span-xs-0 ivu-col-span-sm-0 ivu-col-span-md-12 ivu-col-span-lg-12 ivu-col-span-xl-12 page-account-banner"
      >
        <div class="ivu-row ivu-row-middle page-account-banner-wrapper">
          <div class="ivu-col ivu-col-span-24">
            <Carousel
              autoplay
              loop
              autoplay-speed="4000"
              dots="none"
              class="page-account-banner-carousel"
            >
              <CarouselItem>
                <div class="ivu-image">
                  <div class="ivu-image-inner">
                    <img
                      class="ivu-image-img"
                      :src="login_banner1"
                      loading="eager"
                    />
                  </div>
                </div>
                <Typography class="ivu-mt">
                  <Title>订货宝餐饮版</Title>
                  <Paragraph>服务餐饮行业的解决方案</Paragraph>
                </Typography>
              </CarouselItem>
              <CarouselItem>
                <div class="ivu-image">
                  <div class="ivu-image-inner">
                    <img
                      class="ivu-image-img"
                      :src="login_banner2"
                      loading="eager"
                    />
                  </div>
                </div>
                <Typography class="ivu-mt">
                  <Title>融合支付</Title>
                  <Paragraph>多种支付方式全面覆盖</Paragraph>
                </Typography>
              </CarouselItem>
              <CarouselItem>
                <div class="ivu-image">
                  <div class="ivu-image-inner">
                    <img
                      class="ivu-image-img"
                      :src="login_banner3"
                      loading="eager"
                    />
                  </div>
                </div>
                <Typography class="ivu-mt">
                  <Title>满立惠促销</Title>
                  <Paragraph>全能促销规则，提升客单价</Paragraph>
                </Typography>
              </CarouselItem>
            </Carousel>
          </div>
        </div>
      </div>
      <div
        class="ivu-col ivu-col-span-xs-24 ivu-col-span-sm-24 ivu-col-span-md-12 ivu-col-span-lg-12 ivu-col-span-xl-12"
      >
        <div class="page-account-wrapper">
          <div class="page-account-container">
            <div class="page-account-logo">
              <img :src="img_logo" />
            </div>
            <Typography class="ivu-text-center ivu-mt">
              <Title>订货宝</Title>
              <Paragraph>渠道订货系统</Paragraph>
            </Typography>
            <div style="width: 400px">
              <Tabs>
                <TabPane :label="__('账号登录')" icon="android-person">
                  <i-form
                    ref="form"
                    :model="form"
                    :rules="rules"
                    :label-width="0"
                    label-position="left"
                    class="login-form"
                  >
                    <FormItem prop="name">
                      <i-input
                        ref="name"
                        type="text"
                        v-model.trim="form.name"
                        :placeholder="__('账号')"
                        size="large"
                        @on-blur="refreshSeccode()"
                      ></i-input>
                    </FormItem>
                    <FormItem prop="password">
                      <i-input
                        type="password"
                        password
                        v-model.trim="form.password"
                        :placeholder="__('密码')"
                        size="large"
                      ></i-input>
                    </FormItem>
                    <FormItem prop="code">
                      <Row>
                        <i-col span="12">
                          <i-input
                            type="text"
                            v-model.trim="form.code"
                            :placeholder="__('验证码')"
                            class="w-150"
                            size="large"
                          ></i-input>
                        </i-col>
                        <i-col span="12" v-if="form.name">
                          <img
                            v-if="form.name"
                            :src="codeUrl"
                            class="code pointer"
                            style="width: 120px; height: 36px"
                            :alt="__('点击刷新验证码')"
                            @click="refreshSeccode(true)"
                          />
                        </i-col>
                      </Row>
                    </FormItem>
                    <FormItem>
                      <Checkbox v-model="checked" @on-change="keepLogin">
                        {{ __('保持登录') }}
                      </Checkbox>
                    </FormItem>
                    <FormItem>
                      <i-button
                        type="primary"
                        :loading="loading"
                        @click.native.prevent="handleSubmit('form')"
                        size="large"
                        long
                        style="background: #2d8cf0"
                      >
                        {{ __('登录') }}
                      </i-button>
                    </FormItem>
                    <!--
                        <FormItem>
                            <Row>
                                <i-col span="12">
                                    <i-button
                                        type="text"
                                        size="large"
                                        >{{
                                            __('找回密码')
                                        }}</i-button
                                    >
                                </i-col>
                                <i-col
                                    span="12"
                                    style="text-align:right;"
                                >
                                    <i-button
                                        type="text"
                                        size="large"
                                        >{{
                                            __('新用户注册')
                                        }}</i-button
                                    >
                                </i-col>
                            </Row>
                        </FormItem>
                    -->
                  </i-form>
                </TabPane>
                <!--
                    <TabPane :label="__('微信扫一扫')" icon=". fa fa-weixin">
                        todo
                    </TabPane>
                    <TabPane :label="__('手机登录')" icon="android-phone-portrait">
                        todo
                    </TabPane>
                -->
              </Tabs>
            </div>
          </div>
          <GlobalFooter
            :links="links"
            :copyright="copyright"
            class="ivu-global-footer i-copyright"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" src="./assets/index.less"></style>
<script src="./assets/index.js" lang="tsx"></script>
