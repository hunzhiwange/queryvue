<style></style>
<template>
  <Layout class="i-layout">
    <Sider
      class="i-layout-sider i-layout-sider-fix"
      :style="
        shrink
          ? 'width: 110px; min-width: 110px; max-width: 110px; flex: 0 0 110px;'
          : 'width: 200px; min-width: 200px; max-width: 200px; flex: 0 0 200px;'
      "
    >
      <div>
        <div class="i-layout-sider-logo"></div>
        <shrinkable-menu
          :shrink="shrink"
          :tmpShrink="tmpShrink"
          @on-change="handleSubmenuChange"
          :theme="menuTheme"
          :sidebar-theme="sidebarMenu"
          :before-push="beforePush"
          :open-names="openedSubmenuArr"
          :menu-list="menuList"
          @toggleClick="toggleClick"
          @toggleClickTemp="toggleClickTemp"
        ></shrinkable-menu>
      </div>
      <div class="ivu-layout-sider-trigger" style="width: 200px; display: none">
        <i
          class="ivu-icon ivu-icon-ios-arrow-back ivu-layout-sider-trigger-icon"
        ></i>
      </div>
    </Sider>
    <div
      :class="
        'ivu-layout i-layout-inside i-layout-inside-fix-with-sider ' +
        (this.shrink
          ? ' i-layout-inside-fix-with-sider-collapse'
          : 'i-layout-inside-fix-with-sider-expand')
      "
    >
      <div
        :class="
          'ivu-layout-header i-layout-header i-layout-header-color-' +
          this.headerMenu +
          ' i-layout-header-fix i-layout-header-stick i-layout-header-with-menu'
        "
        style="width: calc(100% - 0px)"
      >
        <a
          @click.native="linkTo(pageOpenedDashboard)"
          :style="{ width: shrink ? '110px' : '200px' }"
          class="i-link i-link-color i-layout-header-logo i-layout-header-logo-stick"
        >
          <img
            :src="
              $store.state.app.headerMenu == 'light' ? img_logo_main : img_logo
            "
            style="height: 25px"
          />
        </a>

        <Poptip
          trigger="hover"
          placement="bottom-start"
          transfer
          v-model="menuDataVisible"
        >
          <div
            @click="toggleClick"
            class="i-layout-header-trigger i-layout-header-trigger-normal"
          >
            <i
              class="ivu-icon i-icon i-icon-menu-unfold"
              v-if="this.shrink"
            ></i>
            <i class="ivu-icon i-icon i-icon-menu-fold" v-if="!this.shrink"></i>
          </div>
          <template #content>
            <Input
              v-model="menuSearchKey"
              search
              placeholder="菜单"
              clearable
              size="large"
              style="width: 500px"
              @on-change="handleSearch"
            />
            <div
              style="
                width: 500px;
                max-height: 400px;
                overflow-x: hidden;
                overflow-y: auto;
              "
              class="m-t-5"
            >
              <List v-if="menuData.length > 0">
                <ListItem
                  v-for="option in menuData"
                  :value="option.name"
                  :key="option.name"
                >
                  <ListItemMeta>
                    <template #title>
                      <a
                        @click="selectMenu(option.name)"
                        class="pointer"
                        v-html="option.matchTitle"
                      ></a>
                    </template>
                  </ListItemMeta>
                  <template #action>
                    <li>
                      <a
                        @click="selectMenu(option.name)"
                        v-html="option.matchPath"
                      ></a>
                    </li>
                  </template>
                </ListItem>
              </List>
              <div v-else>
                <Text type="secondary" v-if="menuSearchKey">
                  {{ __('抱歉没有找到与“%s”相关的功能。', menuSearchKey) }}
                </Text>
                <Text type="secondary" v-if="!menuSearchKey">
                  {{ __('请输入关键词，支持中文名字和英文路径。') }}
                </Text>
              </div>
            </div>
          </template>
        </Poptip>

        <tags-page-opened
          :pageTagsList="pageTagsList"
          :shrink="shrink"
        ></tags-page-opened>
        <div class="i-layout-header-right">
          <message-tip v-model="mesCount"></message-tip>
          <Dropdown transfer class="header-menuitem">
            <span class="i-layout-header-trigger i-layout-header-trigger-min">
              <Icon type="ios-settings-outline" :size="22"></Icon>
            </span>
            <template #list>
              <theme-switch></theme-switch>
              <i18n-switch></i18n-switch>
              <lock-screen></lock-screen>
              <full-screen @on-change="fullscreenChange"></full-screen>
              <DropdownItem @click="uiSetting = true">
                <Icon type="md-aperture" />
                {{ __('界面') }}
              </DropdownItem>
            </template>
          </Dropdown>
          <Dropdown
            class="i-layout-header-user"
            @on-click="handleClickUserDropdown"
          >
            <span class="i-layout-header-trigger i-layout-header-trigger-min">
              <span
                class="ivu-avatar ivu-avatar-circle ivu-avatar-image ivu-avatar-small"
              >
                <img :src="avatorPath" />
              </span>
            </span>
            <template #list>
              <DropdownMenu>
                <DropdownItem name="information">
                  <Icon type="md-person" size="22"></Icon>
                  {{ username }}
                </DropdownItem>
                <DropdownItem name="changePassword">
                  <Icon type="md-key"></Icon>
                  {{ __('修改密码') }}
                </DropdownItem>
                <DropdownItem name="logout">
                  <Icon type="md-log-out"></Icon>
                  {{ __('退出') }}
                </DropdownItem>
              </DropdownMenu>
            </template>
          </Dropdown>
        </div>
      </div>
      <div
        class="ivu-layout-content i-layout-content i-layout-content-fix-with-header i-layout-content-with-tabs i-layout-content-with-tabs-fix"
      >
        <div class="i-layout-content-main">
          <router-view v-slot="{ Component }">
            <keep-alive :include="cachePage">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </div>
      <!--      <GlobalFooter :links="links" :copyright="copyright" class="ivu-global-footer i-copyright" />-->
    </div>
    <Drawer :closable="true" v-model="uiSetting" width="300">
      <Divider>主题风格设置</Divider>
      <div class="i-layout-header-setting-item">
        <span class="i-layout-header-setting-item-desc">
          暗黑模式
          <Tooltip placement="top">
            <Icon type="ios-help-circle-outline" />
            <template #content>启用暗黑模式</template>
          </Tooltip>
        </span>
        <span class="i-layout-header-setting-item-action">
          <Switch
            size="small"
            v-model="darkMode"
            @on-change="toggleDarkModeClick"
          />
        </span>
      </div>
      <div class="i-layout-header-setting-item">
        <span class="i-layout-header-setting-item-desc">
          顶部菜单
          <Tooltip placement="top">
            <Icon type="ios-help-circle-outline" />
            <template #content>顶部菜单</template>
          </Tooltip>
        </span>
        <span class="i-layout-header-setting-item-action">
          <RadioGroup v-model="headerMenu" @on-change="toggleHeaderMenuClick">
            <Radio label="primary" small>主色</Radio>
            <Radio label="dark" small>暗色</Radio>
            <Radio label="light" small>亮色</Radio>
          </RadioGroup>
        </span>
      </div>
      <div class="i-layout-header-setting-item">
        <span class="i-layout-header-setting-item-desc">
          侧边栏菜单
          <Tooltip placement="top">
            <Icon type="ios-help-circle-outline" />
            <template #content>侧边栏菜单</template>
          </Tooltip>
        </span>
        <span class="i-layout-header-setting-item-action">
          <RadioGroup v-model="sidebarMenu" @on-change="toggleSidebarMenuClick">
            <Radio label="dark" small>暗色</Radio>
            <Radio label="light" small>亮色</Radio>
          </RadioGroup>
        </span>
      </div>
      <!--      <Divider>导航设置</Divider>-->
      <!--      <div class="i-layout-header-setting-item">-->
      <!--        <span class="i-layout-header-setting-item-desc">-->
      <!--          下滑时隐藏顶栏-->
      <!--          <Tooltip placement="top">-->
      <!--            <Icon type="ios-help-circle-outline" />-->
      <!--            <template #content>-->
      <!--              <p>Display multiple lines of information</p>-->
      <!--              <p><i>Can customize the style</i></p>-->
      <!--            </template>-->
      <!--          </Tooltip>-->
      <!--        </span>-->
      <!--        <span class="i-layout-header-setting-item-action">-->
      <!--          <Switch size="small" />-->
      <!--        </span>-->
      <!--      </div>-->
      <!--      <Divider>其它设置</Divider>-->
      <!--      <div class="ivu-text-center">-->
      <!--        <Button type="primary">-->
      <!--          <span></span>-->
      <!--          重置设置-->
      <!--        </Button>-->
      <!--      </div>-->
    </Drawer>
    <changePassword
      ref="changePassword"
      @logout="changePasswordLogout"
    ></changePassword>
    <information ref="information"></information>
    <BackTop :bottom="100"></BackTop>
  </Layout>
</template>
<style lang="less" src="./assets/layout.less"></style>
<script src="./assets/layout.js" lang="tsx"></script>
