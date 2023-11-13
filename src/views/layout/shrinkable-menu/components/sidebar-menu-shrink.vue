<template>
  <div>
    <Menu
      :theme="currentTheme"
      class="i-layout-menu-side i-scrollbar-hide i-layout-menu-side-collapse"
      style="width: auto"
      :active-name="currentOpenNames[0]"
    >
      <template v-for="(item, index) in menuList" :key="index">
        <Poptip
          v-if="
            item.permission &&
            item.children.length > 1 &&
            !item.children[0].children
          "
          placement="right-start"
          trigger="hover"
          width="150"
          theme="light"
          :key="index_first"
          :content="itemTitle(item.children[0])"
          :id="'menu_poptip_' + item.name"
        >
          <div class="i-layout-menu-side-collapse-top">
            <MenuItem
              :name="item.name"
              class="i-layout-menu-side-collapse-top-item"
            >
              <span
                class="i-layout-menu-side-title i-layout-menu-side-title-with-collapse"
              >
                <span
                  class="i-layout-menu-side-title-icon i-layout-menu-side-title-icon-single"
                >
                  <Icon
                    :v-if="item.icon"
                    :size="20"
                    c2olor="iconColor"
                    :type="item.icon"
                  ></Icon>
                </span>
                {{ itemTitle(item) }}
              </span>
            </MenuItem>
          </div>
          <template #content>
            <List header="" :border="false" :split="false" size="small">
              <template v-for="(children, i) in item.children">
                <ListItem
                  v-if="children.permission"
                  @click="changeMenu(children.name, item.name)"
                >
                  <a>
                    <!--                    <Icon :v-if="children.icon" :type="children.icon"></Icon>-->
                    {{ itemTitle(children) }}
                  </a>
                </ListItem>
              </template>
            </List>
          </template>
        </Poptip>
        <Poptip
          v-else-if="
            item.permission &&
            item.children.length >= 1 &&
            item.children[0].children
          "
          placement="right-start"
          trigger="hover"
          :width="
            item.meta.width ? item.meta.width : 150 * item.children.length
          "
          theme="light"
          :key="index + '_2'"
          :content="itemTitle(item.children[0])"
          :id="'menu_poptip_' + item.name"
        >
          <div
            class="i-layout-menu-side-collapse-top"
            v-if="undefined === item.meta.parentName"
          >
            <MenuItem
              :name="item.name"
              class="i-layout-menu-side-collapse-top-item"
            >
              <span
                class="i-layout-menu-side-title i-layout-menu-side-title-with-collapse"
              >
                <span
                  class="i-layout-menu-side-title-icon i-layout-menu-side-title-icon-single"
                >
                  <Icon
                    :v-if="item.icon"
                    :size="20"
                    c2olor="iconColor"
                    :type="item.icon"
                  ></Icon>
                </span>
                {{ itemTitle(item) }}
              </span>
            </MenuItem>
          </div>
          <template #content>
            <Row>
              <template v-for="(child, i) in item.children">
                <Col :span="child.meta.span" v-if="child.permission">
                  <List header="" :border="false" :split="false" size="small">
                    <template #header>
                      <Text
                        type="secondary"
                        :strong="currentOpenNames.includes(child.name)"
                      >
                        <!--                        <Icon-->
                        <!--                          :v-if="child.icon"-->
                        <!--                          :type="child.icon"-->
                        <!--                          v-if="child.icon"-->
                        <!--                        ></Icon>-->
                        {{ itemTitle(child) }}
                      </Text>
                    </template>
                    <template
                      v-for="childsub in child.children"
                      :name="childsub.name"
                    >
                      <ListItem
                        v-if="
                          childsub.permission &&
                          undefined === childsub.meta.parentName
                        "
                        @click="changeMenu(childsub.name, item.name)"
                      >
                        <!--                          <Icon-->
                        <!--                            :v-if="childsub.icon"-->
                        <!--                            :type="childsub.icon"-->
                        <!--                            v-if="childsub.icon"-->
                        <!--                          ></Icon>-->
                        <a
                          :class="
                            currentOpenNames.includes(childsub.name)
                              ? 'px-1 font-bold bg-yellow-300 text-yellow-700 hover:text-yellow-600'
                              : ''
                          "
                        >
                          {{ itemTitle(childsub) }}
                        </a>
                      </ListItem>
                    </template>
                  </List>
                </Col>
              </template>
            </Row>
          </template>
        </Poptip>
        <Tooltip
          v-else-if="item.permission"
          :key="index + '_3'"
          :content="itemTitle(item.children[0])"
          placement="right"
          theme="light"
        >
          <MenuItem
            :name="item.name"
            class="i-layout-menu-side-collapse-top-item"
            @click="changeMenu(item.children[0].name, item.name)"
          >
            <span class="i-layout-menu-side-title">
              <span
                class="i-layout-menu-side-title-icon i-layout-menu-side-title-icon-single"
              >
                <Icon :size="20" co2lor="iconColor" :type="item.icon"></Icon>
              </span>
              {{ itemTitle(item) }}
            </span>
          </MenuItem>
        </Tooltip>
      </template>
    </Menu>
  </div>
</template>

<script src="./assets/sidebar-menu-shrink.js" lang="tsx"></script>
