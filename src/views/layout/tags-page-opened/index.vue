<template>
  <div
    ref="scrollCon"
    @DOMMouseScroll="handlescroll"
    @mousewheel="handlescroll"
    :class="
      'tags-outer-scroll-con ' +
      (shrink
        ? 'tags-outer-scroll-con-collapse'
        : 'tags-outer-scroll-con-expand')
    "
  >
    <div
      ref="leftMoveTagCon"
      class="left-move-tag-con close-all-tag-con i-layout-header-trigger i-layout-header-trigger-normal"
      style="
        -webkit-box-shadow: 1px 0 9px 0px rgb(0 0 0 / 10%);
        box-shadow: 1px 0 9px 0px rgb(0 0 0 / 10%);
      "
    >
      <Dropdown transfer @on-click="handleTagsOption">
        <Icon
          type="md-more"
          @click.prevent="seeLeftTag()"
          style="
            width: 40px;
            height: 48px;
            line-height: 48px;
            margin-left: -12px;
          "
        ></Icon>
        <template #list>
          <DropdownItem name="refreshTag">
            <Icon type="md-refresh" size="22" />
            {{ __('刷新') }}
          </DropdownItem>
          <DropdownItem name="clearTag">
            <Icon type="md-close" />
            {{ __('关闭') }}
          </DropdownItem>
          <DropdownItem name="clearOthers">
            <Icon type="md-trash" />
            {{ __('关闭其他') }}
          </DropdownItem>
          <!--                    <DropdownItem name="clearRights"><Icon type="md-return-right" /> {{ __('关闭右侧') }}</DropdownItem>-->
          <!--                    <DropdownItem name="clearLefts"><Icon type="md-return-left" /> {{ __('关闭左侧') }}</DropdownItem>-->
          <DropdownItem name="clearAll">
            <Icon type="md-globe" />
            {{ __('关闭所有') }}
          </DropdownItem>
        </template>
      </Dropdown>
    </div>

    <div class="i-layout-menu-head">
      <div
        ref="scrollBody"
        class="tags-inner-scroll-body"
        :style="{ left: tagBodyLeft + 'px' }"
      >
        <div ref="tagsPageOpenedBox">
          <div
            ref="tagDashboardCon"
            @click="linkTo(pageOpenedDashboard)"
            :class="
              'i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-min-' +
              (pageOpenedDashboard.name === currentPageName
                ? 'light'
                : 'default')
            "
          >
            <a class="i-link i-link-color">
              <Icon
                type="ios-navigate"
                :class="
                  'ivu-mr-4 i-layout-header-menu-' +
                  (pageOpenedDashboard.name === currentPageName
                    ? 'light'
                    : 'default')
                "
              ></Icon>
              首页
            </a>
          </div>

          <draggable
            v-model="pageTagsLists"
            tag="transition-group"
            :component-data="{ name: 'fade' }"
          >
            <template #item="{ element, index }">
              <div
                :ref="(el) => setRefsTag(el, element, index)"
                @click="linkTo(element)"
                :class="
                  'i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-min-' +
                  (element.name === currentPageName ? 'light' : 'default')
                "
              >
                <a class="i-link i-link-color">
                  <Icon
                    type="ios-at"
                    :class="
                      'ivu-mr-4 i-layout-header-menu-' +
                      (element.name === currentPageName ? 'light' : 'default')
                    "
                  ></Icon>
                  {{ itemTitle(element) }}
                </a>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>

    <div
      ref="rightMoveTagCon"
      class="right-move-tag-con close-all-tag-con i-layout-header-trigger i-layout-header-trigger-normal"
      style="
        -webkit-box-shadow: 1px 0 9px 0px rgb(0 0 0 / 10%);
        box-shadow: 1px 0 9px 0px rgb(0 0 0 / 10%);
      "
    >
      <Dropdown transfer @on-click="handleTagsOption">
        <Icon
          type="md-more"
          @click.prevent="seeRightTag()"
          style="
            width: 40px;
            height: 48px;
            line-height: 48px;
            margin-left: -12px;
          "
        ></Icon>
        <template #list>
          <DropdownItem name="refreshTag">
            <Icon type="md-refresh" size="22" />
            {{ __('刷新') }}
          </DropdownItem>
          <DropdownItem name="clearTag">
            <Icon type="md-close" />
            {{ __('关闭') }}
          </DropdownItem>
          <DropdownItem name="clearOthers">
            <Icon type="md-trash" />
            {{ __('关闭其他') }}
          </DropdownItem>
          <!--                    <DropdownItem name="clearRights"><Icon type="md-return-right" /> {{ __('关闭右侧') }}</DropdownItem>-->
          <!--                    <DropdownItem name="clearLefts"><Icon type="md-return-left" /> {{ __('关闭左侧') }}</DropdownItem>-->
          <DropdownItem name="clearAll">
            <Icon type="md-globe" />
            {{ __('关闭所有') }}
          </DropdownItem>
        </template>
      </Dropdown>
    </div>
  </div>
</template>

<script src="./assets/index.js" lang="tsx"></script>
